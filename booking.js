
const S={cat:null,size:null,count:null,price:null,plus:false,duration:null,artist:null,date:null,time:null,giftAmount:null};
let cursor=new Date();cursor.setDate(1);
const cats={
 fineline:{name:"Fine Line Tattoo"},bundle:{name:"Fine Line Tattoo Bundle"},micro:{name:"Micro Realism",price:200,plus:true},
 realism:{name:"Realism",price:500,plus:true},medium:{name:"Medium Sized Tattoo",price:400,plus:true},
 large:{name:"Large Tattoo",price:600,plus:true},sleeves:{name:"Custom Sleeves & More"}
};
const artists=[
{id:"jessie-ann-odell",name:"Jessie-Ann Odell",sub:"Realism · Fine Line · Micro Realism"},
{id:"ian-odell",name:"Ian Odell",sub:"Fine Line · Realism · Blackwork"},
{id:"taylor-paige-graham",name:"Taylor Paige Graham",sub:"Fine Line · Traditional"},
{id:"vivian-howerton",name:"Vivian Howerton",sub:"Traditional · Cyberpunk · Native Ornamental"}];

function step(n){document.querySelectorAll(".flow-step").forEach(x=>x.classList.toggle("active",+x.dataset.step===n));document.querySelectorAll(".step").forEach(x=>x.classList.toggle("active",+x.dataset.label===n));document.getElementById("bookingFlow").scrollIntoView({behavior:"smooth",block:"start"});}
document.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>step(+b.dataset.back));
document.querySelectorAll("[data-category]").forEach(b=>b.onclick=()=>{
 document.querySelectorAll("[data-category]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");
 S.cat=b.dataset.category;S.size=null;S.count=null;S.price=cats[S.cat].price??null;S.plus=!!cats[S.cat].plus;S.duration=null;S.giftAmount=null;
 document.getElementById("flowTitle").textContent=cats[S.cat].name;
 document.getElementById("flowText").textContent="Complete the options below, then click Book Now.";
 renderOptions();document.getElementById("bookingFlow").scrollIntoView({behavior:"smooth",block:"start"});
});

function renderOptions(){
 const box=document.getElementById("serviceOptions");box.innerHTML="";
 if(["fineline","bundle"].includes(S.cat)){
  box.innerHTML=`<div class="section-head"><h2 style="font-size:2rem">Choose Size</h2></div><div class="option-grid">
   <button class="option-card" data-size="0.5–1 inch"><img src="size-small.jpg"><div><strong>0.5–1 inch</strong><span>From $150</span></div></button>
   <button class="option-card" data-size="2–3 inch"><img src="size-medium.jpg"><div><strong>2–3 inch</strong><span>From $200</span></div></button>
   <button class="option-card" data-size="4–5 inch"><img src="size-large.jpg"><div><strong>4–5 inch</strong><span>From $250+</span></div></button>
  </div><div id="countBox"></div>`;
  box.querySelectorAll("[data-size]").forEach(btn=>btn.onclick=()=>{box.querySelectorAll("[data-size]").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");S.size=btn.dataset.size;if(S.cat==="fineline"){S.count=1;calc();}else{renderCounts()}});
 }else{
  box.innerHTML=`<div class="card"><h3>${cats[S.cat].name}</h3><p>${S.price?`Starting at $${S.price}${S.plus?"+":""}.`:"Custom pricing based on size, time and detail."}</p></div>`;
 }
}
function renderCounts(){
 const cb=document.getElementById("countBox");
 cb.innerHTML=`<div class="section-head" style="margin-top:28px"><h2 style="font-size:2rem">How many tattoos?</h2></div><div class="option-grid">
 <button class="option-card" data-count="1"><div><strong>1 Tattoo</strong><span id="p1"></span></div></button>
 <button class="option-card" data-count="2"><div><strong>2 Tattoos</strong><span id="p2"></span></div></button>
 <button class="option-card" data-count="3"><div><strong>3 Tattoos</strong><span id="p3"></span></div></button></div>`;
 const pr=pricesFor(S.size);[1,2,3].forEach(n=>document.getElementById("p"+n).textContent="$"+pr[n]+(S.size==="4–5 inch"?"+":""));
 cb.querySelectorAll("[data-count]").forEach(btn=>btn.onclick=()=>{cb.querySelectorAll("[data-count]").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");S.count=+btn.dataset.count;calc()});
}
function pricesFor(size){return {"0.5–1 inch":{1:150,2:250,3:300},"2–3 inch":{1:200,2:300,3:375},"4–5 inch":{1:250,2:375,3:475}}[size]}
function calc(){
 if(!S.size)return; const n=S.count||1;S.price=pricesFor(S.size)[n];S.plus=S.size==="4–5 inch";
 if(S.size==="0.5–1 inch")S.duration=60;
 if(S.size==="2–3 inch")S.duration=90;
 if(S.size==="4–5 inch")S.duration=n===1?60:120;
}
document.getElementById("continueDetails").onclick=()=>{
 if(!S.cat)return alert("Choose a tattoo category first.");
 if(["fineline","bundle"].includes(S.cat)&&!S.size)return alert("Choose a size.");
 if(S.cat==="bundle"&&!S.count)return alert("Choose 1, 2 or 3 tattoos.");

 step(2);
};
document.getElementById("continueArtist").onclick=()=>{if(!document.getElementById("clientForm").reportValidity())return;if(!document.getElementById("refs").files.length&&S.cat!=="gift")return alert("Please attach at least one reference image.");step(3)};
const ae=document.getElementById("artistChoices");artists.forEach(a=>{const b=document.createElement("button");b.className="artist-choice";b.innerHTML=`<strong>${a.name}</strong><small>${a.sub}</small>`;b.onclick=()=>{ae.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");S.artist=a};ae.appendChild(b)});
document.getElementById("continueCalendar").onclick=()=>{if(!S.artist)return alert("Choose an artist.");renderCal();step(4)};

function saved(){try{return JSON.parse(localStorage.getItem("poa_requests")||"[]")}catch(e){return[]}}
function key(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function min(t){let m=t.match(/(\d+):(\d+)\s(AM|PM)/),h=+m[1],mi=+m[2];if(m[3]==="PM"&&h!==12)h+=12;if(m[3]==="AM"&&h===12)h=0;return h*60+mi}
function conflict(t){let st=min(t),en=st+(S.duration||60),d=key(S.date);return saved().some(r=>["pending","accepted"].includes(r.status)&&r.artist===S.artist.name&&r.date===d&&st<min(r.time)+(r.duration||60)&&en>min(r.time))}
function renderCal(){
 const y=cursor.getFullYear(),m=cursor.getMonth(),g=document.getElementById("calendarGrid");g.innerHTML="";document.getElementById("monthLabel").textContent=cursor.toLocaleString("en-US",{month:"long",year:"numeric"});
 ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(x=>{let e=document.createElement("div");e.className="dow";e.textContent=x;g.appendChild(e)});
 let first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),today=new Date();today.setHours(0,0,0,0);for(let i=0;i<first;i++)g.appendChild(document.createElement("div"));
 for(let d=1;d<=days;d++){let dt=new Date(y,m,d),b=document.createElement("button");b.className="day";b.textContent=d;if(dt.getDay()===0||dt<today){b.disabled=true;b.classList.add("closed")}b.onclick=()=>{g.querySelectorAll(".day").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");S.date=dt;slots()};g.appendChild(b)}
}
document.getElementById("prevMonth").onclick=()=>{cursor.setMonth(cursor.getMonth()-1);renderCal()};document.getElementById("nextMonth").onclick=()=>{cursor.setMonth(cursor.getMonth()+1);renderCal()};
function slots(){
 let box=document.getElementById("timeSlots");box.innerHTML="";S.time=null;
 let j=S.artist.id==="jessie-ann-odell",large=["large","sleeves","realism"].includes(S.cat),times=[];
 if(large){times=["9:00 AM"];document.getElementById("slotInfo").textContent="Large/custom work starts at 9:00 AM. Final duration is confirmed by the artist."}
 else{
  let end=j?13*60:17*60,dur=S.duration||60,inc=S.duration===90?30:60;for(let s=9*60;s<end;s+=inc){if(s+dur>end)continue;let h=Math.floor(s/60),mm=s%60,ap=h>=12?"PM":"AM",hr=((h+11)%12)+1;times.push(`${hr}:${String(mm).padStart(2,"0")} ${ap}`)}
  document.getElementById("slotInfo").textContent=j?"Jessie-Ann small tattoo requests: 9:00 AM–1:00 PM.":"Request hours: 9:00 AM–5:00 PM.";
 }
 times.forEach(t=>{let b=document.createElement("button");b.className="slot";b.textContent=t;if(conflict(t)){b.disabled=true;b.textContent+=" · Pending/Booked"}b.onclick=()=>{box.querySelectorAll(".slot").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");S.time=t};box.appendChild(b)})
}
document.getElementById("continueReview").onclick=()=>{if(!S.date||!S.time)return alert("Choose a date and time.");summary();step(5)};
function summary(){
 let dep=S.price>=500?100:50,price=S.price==null?"Custom / TBD":`$${S.price}${S.plus?"+":""}`;
 document.getElementById("summary").innerHTML=`<div class="summary-row"><span>Client</span><strong>${document.getElementById("clientName").value}</strong></div><div class="summary-row"><span>Service</span><strong>${cats[S.cat].name}</strong></div><div class="summary-row"><span>Size</span><strong>${S.size||"Custom"}</strong></div><div class="summary-row"><span>Quantity</span><strong>${S.count||1}</strong></div><div class="summary-row"><span>Artist</span><strong>${S.artist.name}</strong></div><div class="summary-row"><span>Requested</span><strong>${S.date.toLocaleDateString()} · ${S.time}</strong></div><div class="summary-row"><span>Price</span><strong>${price}</strong></div><div class="summary-row"><span>Deposit</span><strong>$${dep}</strong></div>`;
}
document.getElementById("submitRequest").onclick=()=>{
 if(!document.getElementById("agree").checked)return alert("Please agree to the policies.");
 let dep=S.price>=500?100:50,rows=saved();rows.push({id:"REQ-"+Date.now(),status:"pending",client:document.getElementById("clientName").value,email:document.getElementById("email").value,phone:document.getElementById("phone").value,artist:S.artist.name,service:cats[S.cat].name,size:S.size,count:S.count||1,date:key(S.date),time:S.time,duration:S.duration,deposit_due:dep,deposit_paid:0,total:S.price,description:document.getElementById("description").value});localStorage.setItem("poa_requests",JSON.stringify(rows));document.getElementById("message").innerHTML='<div class="notice good">Request saved as PENDING in demo mode. The live Supabase version will send this into the shared team dashboard.</div>';
};
