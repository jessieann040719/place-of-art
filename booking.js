
const categoryIcons = {
 fineline:`<svg viewBox="0 0 120 120"><path d="M30 90L78 42l8 8-48 48-17 4z"/><path d="M77 43l8-8 13 13-8 8"/><path d="M32 87l10 10"/></svg>`,
 bundle:`<svg viewBox="0 0 120 120"><path d="M22 84l42-42 8 8-42 42z"/><path d="M48 91l38-38 8 8-38 38z"/><path d="M66 40l8-8 14 14-8 8"/><path d="M82 55l8-8 10 10-8 8"/></svg>`,
 micro:`<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="34"/><circle cx="60" cy="60" r="16"/><path d="M60 18v14M60 88v14M18 60h14M88 60h14M30 30l10 10M80 80l10 10M90 30L80 40M40 80L30 90"/></svg>`,
 medium:`<svg viewBox="0 0 120 120"><rect x="25" y="25" width="70" height="70" rx="8"/><path d="M42 78l18-18 12 12 12-12"/></svg>`,
 large:`<svg viewBox="0 0 120 120"><path d="M22 94h76V26H22z"/><path d="M37 78l23-27 20 20 10-12"/></svg>`,
 sleeves:`<svg viewBox="0 0 120 120"><path d="M42 23c10 5 26 5 36 0l10 16-13 8v50H45V47l-13-8z"/><path d="M45 61h30M45 76h30"/></svg>`,
 gift:`<svg viewBox="0 0 120 120"><rect x="22" y="45" width="76" height="52"/><path d="M60 45v52M18 45h84V32H18z"/><path d="M60 32c-4-17-26-19-26-6 0 9 13 7 26 6zM60 32c4-17 26-19 26-6 0 9-13 7-26 6z"/></svg>`
};

const categories=[
{id:"fineline",name:"Fine Line Tattoo",price:"0.5–1 inch $150 · 2–3 inch $200 · 4–5 inch $250+",kind:"fine"},
{id:"bundle",name:"Fine Line Tattoo Bundle",price:"Choose size first, then 1, 2 or 3 tattoos",kind:"bundle"},
{id:"micro",name:"Micro Realism",price:"Starting at $200+",kind:"custom"},
{id:"medium",name:"Medium Sized Tattoo",price:"Starting at $400+",kind:"custom"},
{id:"large",name:"Large Tattoo",price:"Starting at $600+",kind:"large"},
{id:"sleeves",name:"Custom Sleeves",price:"Arm · Leg · Torso · Custom Pricing",kind:"large"},
{id:"gift",name:"Gift Card",price:"Custom Amount",kind:"gift"}
];

const artists=[
{id:"jessie-ann-odell",name:"Jessie-Ann Odell",sub:"Realism · Fine Line · Micro Realism"},
{id:"ian-odell",name:"Ian Odell",sub:"Fine Line · Realism · Blackwork"},
{id:"taylor-paige-graham",name:"Taylor Paige Graham",sub:"Fine Line · Traditional"},
{id:"vivian-howerton",name:"Vivian Howerton",sub:"Traditional · Cyberpunk · Native Ornamental"}
];

const state={category:null,size:null,count:1,price:null,pricePlus:false,duration:null,artist:null,date:null,time:null};
let monthCursor=new Date();monthCursor.setDate(1);

function setStep(n){
 document.querySelectorAll(".booking-step").forEach(x=>x.classList.toggle("active",Number(x.dataset.step)===n));
 document.querySelectorAll(".step").forEach(x=>x.classList.toggle("active",Number(x.dataset.stepLabel)===n));
 document.getElementById("bookingFlowSection").scrollIntoView({behavior:"smooth",block:"start"});
}
document.querySelectorAll("[data-back]").forEach(b=>b.addEventListener("click",()=>setStep(Number(b.dataset.back))));

const categoryEl=document.getElementById("categoryChoices");
categories.forEach(c=>{
 const b=document.createElement("button");
 b.type="button"; b.className="tattoo-category-card";
 b.innerHTML=`<div class="tattoo-category-icon">${categoryIcons[c.id]}</div><div class="tattoo-category-content"><h3>${c.name}</h3><p>${c.price}</p><span>Choose this tattoo</span></div>`;
 b.onclick=()=>{
   categoryEl.querySelectorAll(".tattoo-category-card").forEach(x=>x.classList.remove("selected"));
   b.classList.add("selected");
   state.category=c;state.size=null;state.count=1;state.price=null;state.duration=null;state.pricePlus=false;
   document.getElementById("selectedCategoryTitle").textContent=c.name;
   document.getElementById("selectedCategoryText").textContent=c.price;
   renderCategoryOptions();
   document.getElementById("bookingFlowSection").scrollIntoView({behavior:"smooth",block:"start"});
 };
 categoryEl.appendChild(b);
});

function renderCategoryOptions(){
 const box=document.getElementById("fineLineOptions");
 if(!state.category){box.style.display="none";return;}
 if(!["fineline","bundle"].includes(state.category.id)){
   box.style.display="block";
   box.className="card selected-service-card";
   box.innerHTML=`<h3>${state.category.name}</h3><p>${state.category.price}</p><div class="notice">Click BOOK NOW to continue with your personal information, reference images, artist selection and calendar.</div>`;
   return;
 }
 const bundle=state.category.id==="bundle";
 box.style.display="block";
 box.className="card selected-service-card";
 box.innerHTML=`
 <h3>${bundle?"Fine Line Bundle — Step 1: Choose Size":"Fine Line Tattoo — Choose Size"}</h3>
 <p>${bundle?"Choose the approximate size first. After that, choose how many tattoos you want in the bundle.":"Choose the approximate size of your tattoo."}</p>
 <div class="big-option-grid" id="sizeChoices">
   <button class="big-option" data-size="0.5–1 inch"><strong>0.5–1 inch</strong><span>Small Fine Line</span></button>
   <button class="big-option" data-size="2–3 inch"><strong>2–3 inch</strong><span>Medium Fine Line</span></button>
   <button class="big-option" data-size="4–5 inch"><strong>4–5 inch</strong><span>Larger Fine Line</span></button>
 </div>
 <div id="countArea"></div>`;
 box.querySelectorAll("[data-size]").forEach(btn=>btn.onclick=()=>{
   box.querySelectorAll("[data-size]").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");
   state.size=btn.dataset.size;
   if(bundle) renderCountOptions();
   calcFineLine();
 });
}

function renderCountOptions(){
 const area=document.getElementById("countArea");
 area.innerHTML=`
   <h3 style="margin-top:24px">Step 2: How many tattoos?</h3>
   <div class="big-option-grid">
     <button class="big-option" data-count="1"><strong>1 Tattoo</strong><span>Single tattoo</span></button>
     <button class="big-option" data-count="2"><strong>2 Tattoos</strong><span>Two-piece bundle</span></button>
     <button class="big-option" data-count="3"><strong>3 Tattoos</strong><span>Three-piece bundle</span></button>
   </div>`;
 area.querySelectorAll("[data-count]").forEach(btn=>btn.onclick=()=>{
   area.querySelectorAll("[data-count]").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");
   state.count=Number(btn.dataset.count);calcFineLine();renderChosenPrice();
 });
}

function calcFineLine(){
 if(!state.size)return;
 const count=state.category.id==="bundle"?state.count:1;
 const prices={
  "0.5–1 inch":{1:150,2:250,3:300},
  "2–3 inch":{1:200,2:300,3:375},
  "4–5 inch":{1:250,2:375,3:475}
 };
 state.price=prices[state.size][count];
 state.pricePlus=state.size==="4–5 inch";
 if(state.size==="0.5–1 inch")state.duration=60;
 if(state.size==="2–3 inch")state.duration=90;
 if(state.size==="4–5 inch")state.duration=count===1?60:120;
 renderChosenPrice();
}
function renderChosenPrice(){
 let old=document.getElementById("chosenPrice");
 if(old) old.remove();
 if(!state.price)return;
 const box=document.getElementById("fineLineOptions");
 const div=document.createElement("div");div.id="chosenPrice";div.className="selected-price";
 div.innerHTML=`<span>Selected Price</span><strong>$${state.price}${state.pricePlus?"+":""}</strong><small>Estimated booking slot: ${state.duration} minutes</small>`;
 box.appendChild(div);
}

document.getElementById("toDetails").onclick=()=>{
 if(!state.category)return alert("Please choose a tattoo category.");
 if(["fineline","bundle"].includes(state.category.id)&&!state.size)return alert("Please choose a size.");
 if(state.category.id==="bundle"&&!state.count)return alert("Please choose 1, 2 or 3 tattoos.");
 if(state.category.id==="micro"){state.price=200;state.pricePlus=true;state.duration=null;}
 if(state.category.id==="medium"){state.price=400;state.pricePlus=true;state.duration=null;}
 if(state.category.id==="large"){state.price=600;state.pricePlus=true;state.duration=null;}
 if(state.category.id==="sleeves"){state.price=null;state.pricePlus=false;state.duration=null;}
 if(state.category.id==="gift"){state.price=null;state.pricePlus=false;state.duration=null;}
 setStep(2);
};

document.getElementById("toArtist").onclick=()=>{
 const f=document.getElementById("clientForm");
 if(!f.reportValidity())return;
 if(!document.getElementById("refs").files.length)return alert("Please attach at least one reference image.");
 setStep(3);
};

const artistEl=document.getElementById("artistChoices");
artists.forEach(a=>{
 const b=document.createElement("button");b.type="button";b.className="artist-booking-card";
 b.innerHTML=`<div class="artist-booking-avatar">${a.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div><strong>${a.name}</strong><small>${a.sub}</small></div>`;
 b.onclick=()=>{artistEl.querySelectorAll(".artist-booking-card").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.artist=a;};
 artistEl.appendChild(b);
});

document.getElementById("toCalendar").onclick=()=>{if(!state.artist)return alert("Please choose an artist.");renderCalendar();setStep(4);};

function existingRequests(){try{return JSON.parse(localStorage.getItem("poa_demo_requests")||"[]");}catch(e){return []}}
function dateKey(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;}
function timeToMinutes(t){const m=t.match(/(\d+):(\d+)\s(AM|PM)/);if(!m)return 0;let h=Number(m[1]),min=Number(m[2]);if(m[3]==="PM"&&h!==12)h+=12;if(m[3]==="AM"&&h===12)h=0;return h*60+min;}
function overlaps(date,time,duration,artistName){
 const start=timeToMinutes(time),end=start+(duration||60),d=dateKey(date);
 return existingRequests().some(r=>{
  if(!["pending","accepted"].includes(r.status)||r.artist_name!==artistName||r.requested_date!==d)return false;
  const rs=timeToMinutes(r.requested_time),re=rs+(r.duration_minutes||60);
  return start<re&&end>rs;
 });
}
function renderCalendar(){
 const y=monthCursor.getFullYear(),m=monthCursor.getMonth();
 document.getElementById("monthLabel").textContent=monthCursor.toLocaleString("en-US",{month:"long",year:"numeric"});
 const grid=document.getElementById("calendarGrid");grid.innerHTML="";
 ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d=>{const e=document.createElement("div");e.className="dow";e.textContent=d;grid.appendChild(e);});
 const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
 for(let i=0;i<first;i++)grid.appendChild(document.createElement("div"));
 const today=new Date();today.setHours(0,0,0,0);
 for(let d=1;d<=days;d++){
  const date=new Date(y,m,d);const b=document.createElement("button");b.type="button";b.className="day";b.textContent=d;
  if(date.getDay()===0||date<today){b.disabled=true;b.classList.add("closed");}
  b.onclick=()=>{grid.querySelectorAll(".day").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.date=date;renderSlots();};
  grid.appendChild(b);
 }
}
document.getElementById("prevMonth").onclick=()=>{monthCursor.setMonth(monthCursor.getMonth()-1);renderCalendar()};
document.getElementById("nextMonth").onclick=()=>{monthCursor.setMonth(monthCursor.getMonth()+1);renderCalendar()};

function renderSlots(){
 const slots=document.getElementById("timeSlots");slots.innerHTML="";state.time=null;
 const info=document.getElementById("slotInfo");
 const isJessie=state.artist.id==="jessie-ann-odell";
 const isLarge=["large","sleeves"].includes(state.category.id);
 let starts=[];
 if(isLarge){
   starts=["9:00 AM"];
   info.textContent="Large and sleeve projects start at 9:00 AM. Final duration is confirmed by the artist.";
 }else{
   const maxEnd=isJessie?13*60:17*60;
   const duration=state.duration||60;
   const increment=state.duration===90?30:60;
   for(let start=9*60;start<maxEnd;start+=increment){
     if(start+duration>maxEnd)continue;
     const h=Math.floor(start/60),mm=start%60,suffix=h>=12?"PM":"AM",hr=((h+11)%12)+1;
     starts.push(`${hr}:${String(mm).padStart(2,"0")} ${suffix}`);
   }
   info.textContent=isJessie?"Jessie-Ann accepts small tattoo requests from 9:00 AM to 1:00 PM.":"Request window: 9:00 AM–5:00 PM.";
 }
 starts.forEach(t=>{
   const b=document.createElement("button");b.type="button";b.className="slot";b.textContent=t;
   const dur=state.duration||60;
   if(overlaps(state.date,t,dur,state.artist.name)){b.disabled=true;b.textContent+=" · Pending/Booked";}
   b.onclick=()=>{slots.querySelectorAll(".slot").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.time=t;};
   slots.appendChild(b);
 });
}
document.getElementById("toReview").onclick=()=>{if(!state.date||!state.time)return alert("Please choose a date and time.");renderSummary();setStep(5);};

function renderSummary(){
 const price=state.price==null?"Custom / TBD":`$${state.price}${state.pricePlus?"+":""}`;
 const deposit=(state.price!=null&&state.price>=500)?100:50;
 const duration=state.duration?`${state.duration} minutes`:"Artist-confirmed duration";
 document.getElementById("bookingSummary").innerHTML=`
 <div class="summary-row"><span>Client</span><strong>${document.getElementById("clientName").value}</strong></div>
 <div class="summary-row"><span>Tattoo</span><strong>${state.category.name}</strong></div>
 <div class="summary-row"><span>Size / Bundle</span><strong>${state.size||"Custom"}${state.category.id==="bundle"?` · ${state.count} tattoo(s)`:""}</strong></div>
 <div class="summary-row"><span>Artist</span><strong>${state.artist.name}</strong></div>
 <div class="summary-row"><span>Requested Date</span><strong>${state.date.toLocaleDateString("en-US")}</strong></div>
 <div class="summary-row"><span>Requested Time</span><strong>${state.time}</strong></div>
 <div class="summary-row"><span>Estimated Slot</span><strong>${duration}</strong></div>
 <div class="summary-row"><span>Starting / Total Price</span><strong>${price}</strong></div>
 <div class="summary-row"><span>Deposit Due</span><strong>$${deposit}</strong></div>`;
}

document.getElementById("submitRequest").onclick=()=>{
 if(!document.getElementById("policyAck").checked)return alert("Please agree to the policies before submitting.");
 const deposit=(state.price!=null&&state.price>=500)?100:50;
 const req={
  id:"REQ-"+Date.now(),created_at:new Date().toISOString(),status:"pending",
  client_name:document.getElementById("clientName").value,dob:document.getElementById("dob").value,
  email:document.getElementById("email").value,phone:document.getElementById("phone").value,
  placement:document.getElementById("placement").value,description:document.getElementById("description").value,
  reference_files:[...document.getElementById("refs").files].map(f=>f.name),
  tattoo_type:state.category.name,size_option:state.size,tattoo_count:state.count,
  artist_name:state.artist.name,requested_date:dateKey(state.date),requested_time:state.time,
  duration_minutes:state.duration,total_price:state.price,price_is_starting:state.pricePlus,
  deposit_due:deposit,deposit_paid:0
 };
 const rows=existingRequests();rows.push(req);localStorage.setItem("poa_demo_requests",JSON.stringify(rows));
 document.getElementById("submitMessage").innerHTML=`<div class="notice success">Your request was submitted as PENDING. Place of Art will review the selected date and time before the appointment is confirmed.</div>`;
};
