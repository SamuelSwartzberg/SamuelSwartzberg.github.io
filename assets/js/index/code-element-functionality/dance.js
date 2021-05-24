// This is a black box I coded a while ago and do not really understand anymore

function makeElementDance(e){
  document.querySelectorAll("section .mockup-border").forEach((item, i) => {
    item.classList.remove("dance");
  });
  var elm = document.querySelector(e.target.value +" .mockup-border");
  var prevOnchange = [];
  elm.querySelectorAll("select").forEach((item, i) => {
  prevOnchange.push(item.onchange);
  });
  
  var newone = elm.cloneNode(true);
  try {for (var i = 0; i < prevOnchange.length; i++) {
  newone.querySelector("select").onchange = prevOnchange[i]
  };}catch(e){}
  elm.parentNode.replaceChild(newone, elm);
  document.querySelector(e.target.value +" .mockup-border").classList.add("dance");
  document.querySelector(e.target.value +" .mockup-border").onanimationend = (e) => {
  console.log(e);
  if(e.animationName==="color-change"&&e.elapsedTime===1.5){
    e.target.classList.remove("dance");
  }
  };
}