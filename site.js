
document.addEventListener("DOMContentLoaded",()=>{
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");obs.unobserve(e.target)}})
  },{threshold:.12});
  document.querySelectorAll(".reveal,.reveal-left,.stagger").forEach(el=>obs.observe(el));
});
