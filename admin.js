
const colors={"Jessie-Ann Odell":"#b8865e","Ian Odell":"#667e7a","Taylor Paige Graham":"#8f6d55","Vivian Howerton":"#806c8c","Jaycee McKinney":"#9b8068"};
function load(){
 let rows=[];try{rows=JSON.parse(localStorage.getItem("poa_demo_requests")||"[]")}catch(e){}
 if(!rows.length){
   rows=[
    {id:"DEMO-1",status:"pending",client_name:"Sample Client",artist_name:"Jessie-Ann Odell",tattoo_type:"Fine Line Tattoo",size_option:"2–3 inch",requested_date:"2026-09-02",requested_time:"10:00 AM",duration_minutes:90,deposit_due:50,deposit_paid:50,total_price:200,description:"Sample request"},
    {id:"DEMO-2",status:"pending",client_name:"Sample Large Project",artist_name:"Ian Odell",tattoo_type:"Large Tattoo",size_option:null,requested_date:"2026-09-04",requested_time:"9:00 AM",duration_minutes:null,deposit_due:100,deposit_paid:100,total_price:null,description:"Custom large piece"}
   ];
 }
 return rows;
}
function save(rows){localStorage.setItem("poa_demo_requests",JSON.stringify(rows))}
function money(v){return v==null?"Custom / TBD":"$"+Number(v).toFixed(0)}
document.getElementById("demoLogin").onclick=()=>{document.getElementById("loginCard").style.display="none";document.getElementById("dashboard").style.display="block";render()};
function render(){
 const rows=load();
 document.getElementById("requestRows").innerHTML=rows.map(r=>`<tr>
  <td><span class="status ${r.status}">${r.status}</span></td>
  <td>${r.client_name}<br><small>${r.phone||""}</small></td>
  <td>${r.artist_name}</td>
  <td>${r.tattoo_type}<br><small>${r.size_option||"Custom"}${r.tattoo_count?` · ${r.tattoo_count} tattoo(s)`:""}</small></td>
  <td>${r.requested_date}<br>${r.requested_time}</td>
  <td>$${Number(r.deposit_due||0).toFixed(0)}</td>
  <td>$${Number(r.deposit_paid||0).toFixed(0)}</td>
  <td>${money(r.total_price)}</td>
  <td><button class="btn" data-info="${r.id}" type="button">View</button></td>
  <td>${r.status==="pending"?`<button class="btn" data-act="accepted" data-id="${r.id}" type="button">Accept</button> <button class="btn danger" data-act="declined" data-id="${r.id}" type="button">Decline</button>`:"—"}</td>
 </tr>`).join("")||'<tr><td colspan="10">No requests.</td></tr>';
 document.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>{
   const list=load(),r=list.find(x=>x.id===b.dataset.id);if(r){r.status=b.dataset.act;save(list);render();}
 });
 document.querySelectorAll("[data-info]").forEach(b=>b.onclick=()=>{
   const r=load().find(x=>x.id===b.dataset.info);if(!r)return;
   alert(`Client: ${r.client_name}\nDOB: ${r.dob||""}\nEmail: ${r.email||""}\nPhone: ${r.phone||""}\nPlacement: ${r.placement||""}\nDescription: ${r.description||""}\nReference files: ${(r.reference_files||[]).join(", ")}`);
 });
 renderWeek(rows);
}
function renderWeek(rows){
 const days=["Mon","Tue","Wed","Thu","Fri","Sat"];
 let html='<div class="week-grid"><div class="week-head">Time</div>'+days.map(d=>`<div class="week-head">${d}</div>`).join("");
 for(let h=9;h<=16;h++){
  const suffix=h>=12?"PM":"AM",hr=((h+11)%12)+1;
  html+=`<div class="time-label">${hr}:00 ${suffix}</div>`;
  for(let i=1;i<=6;i++){
    const items=rows.filter(r=>{
      const d=new Date(r.requested_date+"T12:00:00");
      return d.getDay()===i && r.status!=="declined" && r.requested_time.startsWith(hr+":00") && r.requested_time.endsWith(suffix);
    });
    html+=`<div>${items.map(r=>`<div class="event-chip" style="background:${colors[r.artist_name]||"#6a594a"}">${r.client_name}<br>${r.status}</div>`).join("")}</div>`;
  }
 }
 html+="</div>";document.getElementById("weekCalendar").innerHTML=html;
}
