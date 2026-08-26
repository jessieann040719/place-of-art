import { SUPABASE_URL, SUPABASE_ANON_KEY, DEMO_MODE } from "./config.js";

const artistColors = {
  "Jessie-Ann Odell": "#b8865e",
  "Taylor Paige Graham": "#8f6d55",
  "Vivian Howerton": "#806c8c",
  "Ian Odel": "#667e7a"
};

const demoRequests = [
  {
    id: "r1", client_name: "Sample Client", artist_name: "Jessie-Ann Odell",
    tattoo_type: "Fine Line Tattoo", size_option: "2–3 inch",
    requested_start: new Date(Date.now()+86400000*2).toISOString(),
    deposit_paid: 50, total_price: 200, status: "pending"
  },
  {
    id: "r2", client_name: "Sample Client 2", artist_name: "Taylor Paige Graham",
    tattoo_type: "Fine Line Bundle", size_option: "0.5–1 inch · 3 tattoos",
    requested_start: new Date(Date.now()+86400000*4).toISOString(),
    deposit_paid: 50, total_price: 300, status: "pending"
  },
  {
    id: "r3", client_name: "Large Project", artist_name: "Vivian Howerton",
    tattoo_type: "Large Tattoo", size_option: "Custom",
    requested_start: new Date(Date.now()+86400000*7).toISOString(),
    deposit_paid: 100, total_price: null, status: "pending"
  }
];

const demoEvents = [
  {title:"Fine Line · Jessie-Ann", start:new Date(Date.now()+86400000).toISOString().slice(0,10)+"T10:00:00", end:new Date(Date.now()+86400000).toISOString().slice(0,10)+"T12:00:00", backgroundColor:artistColors["Jessie-Ann Odell"], borderColor:artistColors["Jessie-Ann Odell"]},
  {title:"Traditional · Taylor", start:new Date(Date.now()+86400000*3).toISOString().slice(0,10)+"T13:00:00", end:new Date(Date.now()+86400000*3).toISOString().slice(0,10)+"T15:00:00", backgroundColor:artistColors["Taylor Paige Graham"], borderColor:artistColors["Taylor Paige Graham"]},
  {title:"Custom · Ian", start:new Date(Date.now()+86400000*5).toISOString().slice(0,10)+"T11:00:00", end:new Date(Date.now()+86400000*5).toISOString().slice(0,10)+"T14:00:00", backgroundColor:artistColors["Ian Odel"], borderColor:artistColors["Ian Odel"]}
];

const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const requestsEl = document.getElementById("requests");
let calendar;

function money(v){
  return v == null ? "Custom / TBD" : `$${Number(v).toFixed(0)}`;
}

function renderRequests(rows){
  requestsEl.innerHTML = rows.filter(r=>r.status==="pending").map(r=>`
    <article class="request-card" data-id="${r.id}">
      <h3>${r.client_name}</h3>
      <p><strong>Artist:</strong> ${r.artist_name}</p>
      <p><strong>Tattoo:</strong> ${r.tattoo_type}</p>
      <p><strong>Option:</strong> ${r.size_option || "Custom"}</p>
      <p><strong>Requested:</strong> ${new Date(r.requested_start).toLocaleString()}</p>
      <p><strong>Deposit paid:</strong> <span class="money">$${Number(r.deposit_paid||0).toFixed(0)}</span></p>
      <p><strong>Total tattoo price:</strong> <span class="money">${money(r.total_price)}</span></p>
      <div class="row-actions">
        <button class="small-btn accept" data-action="accept" type="button">Accept</button>
        <button class="small-btn" data-action="decline" type="button">Decline</button>
      </div>
    </article>
  `).join("") || `<div class="card"><h3>No pending requests</h3><p>You're caught up.</p></div>`;

  requestsEl.querySelectorAll("button[data-action]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const card = btn.closest("[data-id]");
      const id = card.dataset.id;
      const action = btn.dataset.action;
      if (DEMO_MODE){
        card.remove();
        return;
      }
      alert("Supabase action will run here after your project keys are added.");
    });
  });
}

function openDashboard(){
  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  if (!calendar){
    calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
      initialView: "dayGridMonth",
      height: "auto",
      headerToolbar: {left:"prev,next today",center:"title",right:"dayGridMonth,timeGridWeek,timeGridDay"},
      events: DEMO_MODE ? demoEvents : [],
      eventClick(info){
        alert(info.event.title + "\n" + info.event.start.toLocaleString());
      }
    });
    calendar.render();
  }
  renderRequests(DEMO_MODE ? demoRequests : []);
}

loginBtn.addEventListener("click", ()=>{
  if (DEMO_MODE){
    openDashboard();
  } else {
    alert("Connect Supabase first using config.js.");
  }
});
logoutBtn.addEventListener("click", ()=>{
  dashboardView.classList.add("hidden");
  loginView.classList.remove("hidden");
});

if (DEMO_MODE){
  document.getElementById("loginMessage").textContent = "Demo mode: click Sign In to preview the shared calendar and approval workflow.";
}
