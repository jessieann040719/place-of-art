import { supabase, configured, requireConfigured } from "./supabase-client.js";

const setupMessage = document.getElementById("setupMessage");
const authView = document.getElementById("authView");
const dashboardView = document.getElementById("dashboardView");
let me = null;
let artists = [];

requireConfigured(setupMessage);

const colors = {};
function esc(v=""){return String(v).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[s]));}
function money(v){return v==null ? "Custom / TBD" : `$${Number(v).toFixed(0)}`;}
function dt(v){if(!v)return "—"; return new Date(v).toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"});}

document.querySelectorAll(".admin-nav button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".admin-nav button").forEach(x=>x.classList.remove("active"));
    document.querySelectorAll(".admin-panel").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("panel-"+btn.dataset.panel).classList.add("active");
  });
});

async function currentArtist(user){
  const {data,error}=await supabase.from("artists").select("*").eq("user_id",user.id).maybeSingle();
  if(error) throw error;
  return data;
}

async function initDashboard(user){
  me = await currentArtist(user);
  if(!me){
    await supabase.auth.signOut();
    authView.style.display="";
    dashboardView.style.display="none";
    document.getElementById("loginMessage").innerHTML='<div class="notice bad">This login exists, but it is not linked to an artist profile yet. Link this user ID to artists.user_id in Supabase.</div>';
    return;
  }
  authView.style.display="none";
  dashboardView.style.display="";
  document.getElementById("signedInName").textContent=me.name;

  const {data:a}=await supabase.from("artists").select("*").eq("active",true).order("name");
  artists=a||[];
  artists.forEach(x=>colors[x.id]=x.color);
  document.getElementById("artistLegend").innerHTML=artists.map(a=>`<div class="legend-item"><span class="dot" style="background:${esc(a.color)}"></span>${esc(a.name)}</div>`).join("");
  document.getElementById("portfolioArtist").innerHTML=artists.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join("");

  await Promise.all([loadAppointments(),loadContentLists()]);
}

document.getElementById("loginForm").addEventListener("submit",async e=>{
  e.preventDefault();
  if(!configured)return requireConfigured(setupMessage);
  const email=document.getElementById("loginEmail").value.trim();
  const password=document.getElementById("loginPassword").value;
  const msg=document.getElementById("loginMessage");
  msg.textContent="Signing in…";
  const {data,error}=await supabase.auth.signInWithPassword({email,password});
  if(error){msg.innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;return;}
  msg.textContent="";
  await initDashboard(data.user);
});

document.getElementById("logoutBtn").addEventListener("click",async()=>{
  await supabase.auth.signOut();
  dashboardView.style.display="none";authView.style.display="";
});

if(configured){
  const {data:{session}}=await supabase.auth.getSession();
  if(session) await initDashboard(session.user);
}

async function loadAppointments(){
  const {data,error}=await supabase.from("bookings")
    .select("*,artists(name,color)")
    .order("requested_start",{ascending:true});
  if(error){console.error(error);return;}
  const body=document.getElementById("appointmentRows");
  body.innerHTML=(data||[]).map(b=>`
    <tr>
      <td><span class="status ${esc(b.status)}">${esc(b.status)}</span></td>
      <td>${esc(b.client_name)}<br><small>${esc(b.phone||"")} · ${esc(b.email||"")}</small></td>
      <td><span class="dot" style="display:inline-block;background:${esc(b.artists?.color||"#777")}"></span> ${esc(b.artists?.name||"Unassigned")}</td>
      <td>${esc(b.service)}<br><small>${esc(b.size_option||"Custom")}${b.tattoo_count?` · ${b.tattoo_count} tattoo(s)`:""}</small></td>
      <td>${dt(b.requested_start)}</td>
      <td>Due ${money(b.deposit_due)}<br>Paid ${money(b.deposit_paid)}</td>
      <td>${money(b.total_price)}</td>
      <td><button class="btn" data-details="${b.id}" type="button">View</button></td>
      <td>${b.status==="pending"?`<button class="btn" data-status="accepted" data-id="${b.id}" type="button">Accept</button> <button class="btn danger" data-status="declined" data-id="${b.id}" type="button">Decline</button>`:"—"}</td>
    </tr>`).join("") || '<tr><td colspan="9">No bookings yet.</td></tr>';

  body.querySelectorAll("[data-status]").forEach(btn=>btn.addEventListener("click",async()=>{
    const status=btn.dataset.status;
    const patch={status};
    if(status==="accepted"){patch.accepted_at=new Date().toISOString();patch.accepted_by=(await supabase.auth.getUser()).data.user.id;}
    const {error}=await supabase.from("bookings").update(patch).eq("id",btn.dataset.id);
    if(error) alert(error.message); else loadAppointments();
  }));

  body.querySelectorAll("[data-details]").forEach(btn=>btn.addEventListener("click",async()=>{
    const b=(data||[]).find(x=>x.id===btn.dataset.details);
    const {data:files}=await supabase.from("booking_files").select("*").eq("booking_id",b.id);
    alert(`Client: ${b.client_name}\nDOB: ${b.date_of_birth||""}\nPhone: ${b.phone||""}\nEmail: ${b.email||""}\nPlacement: ${b.placement||""}\nDescription: ${b.description||""}\nReference images: ${(files||[]).length}`);
  }));
}

async function uploadPublic(file,folder){
  const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"-");
  const path=`${folder}/${crypto.randomUUID()}-${safe}`;
  const {error}=await supabase.storage.from("site-media").upload(path,file,{upsert:false,contentType:file.type});
  if(error) throw error;
  const {data}=supabase.storage.from("site-media").getPublicUrl(path);
  return {path,url:data.publicUrl};
}

async function createContent({kind,title,body="",price=null,event_date=null,file=null,artist_id=null,messageEl}){
  try{
    let image_path=null;
    if(file){const u=await uploadPublic(file,kind);image_path=u.url;}
    const {error}=await supabase.from("content_items").insert({kind,title,body,price,event_date,image_path,artist_id,published:true,created_by:me.id});
    if(error)throw error;
    messageEl.innerHTML='<div class="notice good">Published.</div>';
    await loadContentLists();
  }catch(err){messageEl.innerHTML=`<div class="notice bad">${esc(err.message)}</div>`;}
}

document.getElementById("newsForm").addEventListener("submit",async e=>{
  e.preventDefault();
  await createContent({
    kind:document.getElementById("newsKind").value,
    title:document.getElementById("newsTitle").value.trim(),
    body:document.getElementById("newsBody").value.trim(),
    event_date:document.getElementById("newsDate").value||null,
    file:document.getElementById("newsImage").files[0]||null,
    messageEl:document.getElementById("newsMessage")
  });
  e.target.reset();
});
document.getElementById("healedForm").addEventListener("submit",async e=>{
  e.preventDefault();
  await createContent({kind:"healed",title:document.getElementById("healedTitle").value.trim(),file:document.getElementById("healedImage").files[0],messageEl:document.getElementById("healedMessage")});
  e.target.reset();
});
document.getElementById("artForm").addEventListener("submit",async e=>{
  e.preventDefault();
  await createContent({kind:"art",title:document.getElementById("artTitle").value.trim(),body:document.getElementById("artBody").value.trim(),price:document.getElementById("artPrice").value?Number(document.getElementById("artPrice").value):null,file:document.getElementById("artImage").files[0],messageEl:document.getElementById("artMessage")});
  e.target.reset();
});
document.getElementById("portfolioForm").addEventListener("submit",async e=>{
  e.preventDefault();
  await createContent({kind:"portfolio",title:document.getElementById("portfolioTitle").value.trim(),artist_id:document.getElementById("portfolioArtist").value,file:document.getElementById("portfolioImage").files[0],messageEl:document.getElementById("portfolioMessage")});
  e.target.reset();
});

async function loadContentLists(){
  const {data,error}=await supabase.from("content_items").select("*,artists(name)").order("created_at",{ascending:false});
  if(error){console.error(error);return;}
  const kinds={news:["news","event"],healed:["healed"],art:["art"],portfolio:["portfolio"]};
  for(const [panel,accepted] of Object.entries(kinds)){
    const rows=(data||[]).filter(x=>accepted.includes(x.kind));
    const target=document.getElementById(panel+"AdminList");
    if(!target)continue;
    target.innerHTML=rows.map(x=>`<article class="cms-item"><div class="cms-item-head"><div><span class="tag">${esc(x.kind)}</span><h4>${esc(x.title||"Untitled")}</h4><small>${x.artists?.name?esc(x.artists.name):""}</small></div><button class="btn danger" data-delete-content="${x.id}" type="button">Delete</button></div>${x.image_path?`<img src="${esc(x.image_path)}" alt="" style="max-width:220px;margin-top:12px">`:""}<p style="margin-top:9px">${esc(x.body||"")}</p></article>`).join("") || '<div class="notice">Nothing published yet.</div>';
  }
  document.querySelectorAll("[data-delete-content]").forEach(btn=>btn.addEventListener("click",async()=>{
    if(!confirm("Delete this item from the website?"))return;
    const {error}=await supabase.from("content_items").delete().eq("id",btn.dataset.deleteContent);
    if(error)alert(error.message);else loadContentLists();
  }));
}
