import { supabase, configured } from "./supabase-client.js";
if(configured){
  const esc=v=>String(v??"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[s]));
  async function rows(kinds,artistSlug=null){
    let q=supabase.from("content_items").select("*,artists(name,slug)").in("kind",kinds).eq("published",true).order("created_at",{ascending:false});
    if(artistSlug) q=q.eq("artists.slug",artistSlug);
    const {data}=await q; return data||[];
  }

  const news=document.getElementById("cms-news");
  if(news){
    const data=await rows(["news","event"]);
    if(data.length) news.innerHTML=data.map(x=>`<article class="card reveal in">${x.image_path?`<img src="${esc(x.image_path)}" alt="${esc(x.title)}" style="width:100%;height:260px;object-fit:cover;margin-bottom:18px">`:""}<span class="tag">${esc(x.kind)}</span><h3 style="margin-top:10px">${esc(x.title)}</h3>${x.event_date?`<p>${esc(x.event_date)}</p>`:""}<p>${esc(x.body)}</p></article>`).join("");
  }

  const healed=document.getElementById("cms-healed");
  if(healed){
    const data=await rows(["healed"]);
    if(data.length) healed.innerHTML=data.map(x=>`<figure><img src="${esc(x.image_path)}" alt="${esc(x.title||"Healed tattoo")}">${x.title?`<figcaption style="margin-top:6px;color:#b7a28d">${esc(x.title)}</figcaption>`:""}</figure>`).join("");
  }

  const art=document.getElementById("cms-art");
  if(art){
    const data=await rows(["art"]);
    if(data.length) art.innerHTML=data.map(x=>`<article class="card image-card"><img src="${esc(x.image_path)}" alt="${esc(x.title)}"><div class="image-card-body"><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p>${x.price!=null?`<div class="artist-meta">$${Number(x.price).toFixed(0)}</div>`:""}</div></article>`).join("");
  }

  document.querySelectorAll("[data-live-portfolio]").forEach(async container=>{
    const artistSlug=container.dataset.artistSlug;
    const {data:artistRows}=await supabase.from("artists").select("id").eq("slug",artistSlug).limit(1);
    const artistId=artistRows?.[0]?.id;
    if(!artistId) return;
    const {data}=await supabase.from("content_items").select("*").eq("kind","portfolio").eq("published",true).eq("artist_id",artistId).order("created_at",{ascending:false});
    if(data?.length) container.insertAdjacentHTML("afterbegin",data.map(x=>`<img src="${esc(x.image_path)}" alt="${esc(x.title||"Tattoo portfolio")}">`).join(""));
  });
}
