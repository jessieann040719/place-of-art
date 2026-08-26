
const categories=[
{id:"fineline",name:"Fine Line Tattoo",price:"From $150",kind:"fine"},
{id:"bundle",name:"Fine Line Tattoo Bundle",price:"Choose size + 1, 2 or 3 tattoos",kind:"bundle"},
{id:"micro",name:"Micro Realism",price:"$200+",kind:"custom"},
{id:"medium",name:"Medium Sized Tattoo",price:"$400+",kind:"custom"},
{id:"large",name:"Large Tattoo",price:"$600+",kind:"large"},
{id:"sleeves",name:"Custom Sleeves",price:"Arm · Leg · Torso",kind:"large"},
{id:"gift",name:"Gift Card",price:"Custom Amount",kind:"gift"}
];
const artists=[
{id:"jessie-ann-odell",name:"Jessie-Ann Odell"},
{id:"ian-odell",name:"Ian Odell"},
{id:"taylor-paige-graham",name:"Taylor Paige Graham"},
{id:"vivian-howerton",name:"Vivian Howerton"}
];
const state={category:null,size:null,count:1,price:null,pricePlus:false,duration:null,artist:null,date:null,time:null};
let monthCursor=new Date();monthCursor.setDate(1);

function setStep(n){
 document.querySelectorAll(".booking-step").forEach(x=>x.classList.toggle("active",Number(x.dataset.step)===n));
 document.querySelectorAll(".step").forEach(x=>x.classList.toggle("active",Number(x.dataset.stepLabel)===n));
 window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-back]").forEach(b=>b.addEventListener("click",()=>setStep(Number(b.dataset.back))));

const categoryEl=document.getElementById("categoryChoices");
categories.forEach(c=>{
 const b=document.createElement("button");b.type="button";b.className="choice";
 b.innerHTML=`<strong>${c.name}</strong><small>${c.price}</small>`;
 b.onclick=()=>{
  categoryEl.querySelectorAll(".choice").forEach(x=>x.classList.remove("selected"));
  b.classList.add("selected");state.category=c;state.size=null;state.count=1;state.price=null;state.duration=null;renderCategoryOptions();
 };
 categoryEl.appendChild(b);
});

function renderCategoryOptions(){
 const box=document.getElementById("fineLineOptions");
 if(!state.category||!["fineline","bundle"].includes(state.category.id)){box.style.display="none";return;}
 box.style.display="block";
 const bundle=state.category.id==="bundle";
 box.innerHTML=`<h3>${bundle?"Fine Line Bundle":"Fine Line Tattoo"} Options</h3>
 <p>${bundle?"First choose the approximate size, then choose 1, 2 or 3 tattoos.":"Choose the approximate size."}</p>
 <div class="choice-grid" id="sizeChoices" style="margin-top:14px">
  <button class="choice" data-size="0.5–1 inch"><strong>0.5–1 inch</strong></button>
  <button class="choice" data-size="2–3 inch"><strong>2–3 inch</strong></button>
  <button class="choice" data-size="4–5 inch"><strong>4–5 inch</strong></button>
 </div>
 ${bundle?`<h3 style="margin-top:20px">Number of Tattoos</h3><div class="choice-grid" id="countChoices" style="margin-top:14px"><button class="choice" data-count="1"><strong>1 Tattoo</strong></button><button class="choice" data-count="2"><strong>2 Tattoos</strong></button><button class="choice" data-count="3"><strong>3 Tattoos</strong></button></div>`:""}`;
 box.querySelectorAll("[data-size]").forEach(b=>b.onclick=()=>{
   box.querySelectorAll("[data-size]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");
   state.size=b.dataset.size;calcFineLine();
 });
 box.querySelectorAll("[data-count]").forEach(b=>b.onclick=()=>{
   box.querySelectorAll("[data-count]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");
   state.count=Number(b.dataset.count);calcFineLine();
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
}
document.getElementById("toDetails").onclick=()=>{
 if(!state.category)return alert("Please choose a tattoo category.");
 if(["fineline","bundle"].includes(state.category.id)&&!state.size)return alert("Please choose a size.");
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
 const b=document.createElement("button");b.type="button";b.className="choice";
 b.innerHTML=`<strong>${a.name}</strong><small>Request this artist</small>`;
 b.onclick=()=>{artistEl.querySelectorAll(".choice").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.artist=a;};
 artistEl.appendChild(b);
});
document.getElementById("toCalendar").onclick=()=>{if(!state.artist)return alert("Please choose an artist.");renderCalendar();setStep(4);};

function existingRequests(){
 try{return JSON.parse(localStorage.getItem("poa_demo_requests")||"[]");}catch(e){return []}
}
function dateKey(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;}
function timeToMinutes(t){
 const m=t.match(/(\d+):(\d+)\s(AM|PM)/);if(!m)return 0;
 let h=Number(m[1]),min=Number(m[2]);if(m[3]==="PM"&&h!==12)h+=12;if(m[3]==="AM"&&h===12)h=0;return h*60+min;
}
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
   info.textContent=isJessie?"Jessie-Ann accepts small tattoo requests between 9:00 AM and 1:00 PM.":"Request window: 9:00 AM–5:00 PM.";
 }
 starts.forEach(t=>{
   const b=document.createElement("button");b.type="button";b.className="slot";b.textContent=t;
   const dur=state.duration||60;
   if(overlaps(state.date,t,dur,state.artist.name)){b.disabled=true;b.textContent+= " · Pending/Booked";}
   b.onclick=()=>{slots.querySelectorAll(".slot").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.time=t;};
   slots.appendChild(b);
 });
}
document.getElementById("toReview").onclick=()=>{if(!state.date||!state.time)return alert("Please choose a date and time.");renderSummary();setStep(5);};

function renderSummary(){
 const price=state.price==null?"Custom / TBD":`$${state.price}${state.pricePlus?"+":""}`;
 const deposit=(state.price!=null&&state.price>=500)?100:50;
 const duration=state.duration?`${state.duration} minutes`:(["large","sleeves"].includes(state.category.id)?"Artist-confirmed duration":"Artist-confirmed duration");
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
  id:"REQ-"+Date.now(),
  created_at:new Date().toISOString(),
  status:"pending",
  client_name:document.getElementById("clientName").value,
  dob:document.getElementById("dob").value,
  email:document.getElementById("email").value,
  phone:document.getElementById("phone").value,
  placement:document.getElementById("placement").value,
  description:document.getElementById("description").value,
  reference_files:[...document.getElementById("refs").files].map(f=>f.name),
  tattoo_type:state.category.name,
  size_option:state.size,
  tattoo_count:state.count,
  artist_name:state.artist.name,
  requested_date:dateKey(state.date),
  requested_time:state.time,
  duration_minutes:state.duration,
  total_price:state.price,
  price_is_starting:state.pricePlus,
  deposit_due:deposit,
  deposit_paid:0
 };
 const rows=existingRequests();rows.push(req);localStorage.setItem("poa_demo_requests",JSON.stringify(rows));
 document.getElementById("submitMessage").innerHTML=`<div class="notice success">Request ${req.id} was saved in demo mode as PENDING. The studio must accept it before it is confirmed. On the live version, the request will go to the shared team calendar/database and the payment step will collect the required deposit securely.</div>`;
};
