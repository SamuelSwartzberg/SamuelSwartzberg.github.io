let wiggleSend = (entries, observer) => { // Wiggle when user has reached bottom of doc
  entries.forEach(entry => {
    let fabOuter= document.querySelector("#contact-fab-outer");
    if (entry.isIntersecting) {
      fabOuter.classList.add("wiggle");
    } else {
      window.setTimeout(()=>{
        fabOuter.classList.remove("wiggle");
      },300); } }); }; // Let the animation finish
function scrollUpSlightly(){
  window.scrollBy(0,-30);
}
let bottomObserverWiggle = new IntersectionObserver(wiggleSend, {threshold: 0.99});
bottomObserverWiggle.observe(finalMessage);
