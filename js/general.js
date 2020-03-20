document.querySelector(".code-selector").onchange = function (e,i) {
    document.querySelectorAll("#code .mockup-body > div").forEach((item, i) => {
        item.classList.remove("active");
    });
    document.querySelector("#code .mockup-body ."+e.target.value).classList.add("active");
};
document.querySelector("#tl-lang-selector").onchange = function (e,i) {
    document.querySelectorAll("#translation .mockup-body > div").forEach((item, i) => {
        item.classList.remove("active");
    });
    document.querySelector("#translation .mockup-body ."+e.target.value).classList.add("active");
};
document.querySelector(".dance-selector").onchange = function (e,i) {
    document.querySelectorAll("section .mockup-border").forEach((item, i) => {
        item.classList.remove("dance");
    });
    var elm = document.querySelector(e.target.value +" .mockup-border");
    var newone = elm.cloneNode(true);
    try {newone.querySelector(".dance-selector").onchange = this.onchange;}catch(e){}
    elm.parentNode.replaceChild(newone, elm);
    document.querySelector(e.target.value +" .mockup-border").classList.add("dance");
    document.querySelector(e.target.value +" .mockup-border").onanimationend = (e) => {

      e.target.classList.remove("dance");
    };
};

document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
    console.log("hey");
  });
  document.querySelector("#name-input").oninput = function (e,i){
    if(e.target.value.match(/[\{\}\[\]\(\)\;\=\+\-\"\*\:\>\<\!\,\.\-\_\@\%\&\?\^]/g)){
      alert("Due to security concerns, you may not enter special characters.\nPlease try again.");
      e.target.value = "";
    } else{
      document.querySelectorAll(".insert-name").forEach((item, i) => {
        item.innerText=" "+e.target.value;
      });
    }
    console.log(e.target.value);
  };
  var themeChanger=document.querySelector(".theme-changer");
  themeChanger.onclick=function(e, i){
    document.querySelector("body").classList.toggle("dark-theme");}
  var images = document.querySelectorAll(".image-container img");
  for (var i = 0; i < images.length; i++) {
    var bubble = document.createElement('div');
    bubble.setAttribute('class','img-bubble');
    if(i==0){bubble.setAttribute('class','img-bubble active');}
    document.querySelector(".image-bubbles").appendChild(bubble);
  }
  function switchImage(plusMinus){
    var activeImage = document.querySelector(".image-container img.active");
    var currentIndex = Array.from(activeImage.parentNode.children).indexOf(activeImage);
    var currentIndexCremented = currentIndex+plusMinus;
    var imageBubbles = document.querySelector(".image-bubbles")
    var imageContainer = document.querySelector(".image-container");
    if (currentIndexCremented>=0 && currentIndexCremented<imageContainer.children.length){
      activeImage.classList.remove("active");
      imageContainer.children[currentIndexCremented].classList.add("active");
      imageBubbles.children[currentIndex].classList.remove("active");
      imageBubbles.children[currentIndexCremented].classList.add("active");
    }
  }

  document.querySelector(".clickable-l").onclick = function () {
    switchImage(-1);
  };
  document.querySelector(".clickable-r").onclick = function () {
    switchImage(1);
  };

});
