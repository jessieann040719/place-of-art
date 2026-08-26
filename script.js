
document.addEventListener("DOMContentLoaded",()=>{const d=document.getElementById("booking-detail");document.querySelectorAll("[data-booking]").forEach(b=>b.addEventListener("click",()=>{const x={
fineline:['Fine Line Tattoo','0.5–1 inch · $150<br>2–3 inch · $200<br>4–5 inch · $250+'],
bundle:['Fine Line Tattoo Bundle','0.5–1 inch · 2 tattoos · $250<br>0.5–1 inch · 3 tattoos · $300<br>2–3 inch · 2 tattoos · $300<br>2–3 inch · 3 tattoos · $375<br>4–5 inch · 2 tattoos · $375+<br>4–5 inch · 3 tattoos · $475+'],
micro:['Micro Realism','Starting at $200+'],
medium:['Medium Sized Tattoo','Starting at $400+'],
large:['Large Tattoo','Starting at $600+'],
sleeves:['Custom Sleeves','Priced by size, time and details.'],
gift:['Gift Card','Custom amount']
}[b.dataset.booking];d.innerHTML=`<h3>${x[0]}</h3><p>${x[1]}</p><div class="notice">$50 non-refundable deposit; $100 deposit for appointments priced at $500+. 48 hours notice required to reschedule.</div>`;d.scrollIntoView({behavior:'smooth',block:'center'})}))})
