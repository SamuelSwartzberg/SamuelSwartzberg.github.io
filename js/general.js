var fitSelect = function (e) {
  console.log(window.getComputedStyle(e.target.children[e.target.selectedIndex]).width);
  var tempMeasureNode = document.createElement("div");
  var tempText = document.createTextNode(e.target.children[e.target.selectedIndex].text);
  tempMeasureNode.appendChild(tempText);
  var newAttachedNode = e.target.parentNode.appendChild(tempMeasureNode);
  var textWidth = (parseInt(window.getComputedStyle(newAttachedNode).width)+20)+"px";
  newAttachedNode.remove();
  e.target.style.width = textWidth;
}
var changeActive = function(e, allElementsSelector, correctSelectorPrefix){
  document.querySelectorAll(allElementsSelector).forEach((item, i) => {
      item.classList.remove("active");
  });
  document.querySelectorAll(correctSelectorPrefix+e.target.value).forEach((item, i) => {
    item.classList.add("active");
  });
  fitSelect(e);
}
document.querySelector(".code-selector").onchange = function (e,i) {
  changeActive(e, "#code .mockup-body > div", "#code .mockup-body .");};

document.querySelector("#tl-topic-selector").onchange =function (e,i) {
  changeActive(e, "#translation .mockup-body .topic", "#translation .mockup-body .");
  e.target.parentElement.classList.add("discovered"); /* to be able to stop the animation */};

document.querySelector("#tl-lang-selector").onchange = function (e,i) {
  changeActive(e, "#translation .mockup-body .lang", "#translation .mockup-body .");};

document.querySelector(".dance-selector").onchange = function (e,i) {
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
};

document.querySelectorAll('select:not(.dance-selector)').forEach((item, i) => {
  fitSelect({target:item});
});

document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelector("#name-input").oninput = function (e,i){
    if(e.target.value.match(/[\{\}\[\]\(\)\;\=\+\-\"\*\:\>\<\!\,\.\-\_\@\%\&\?\^]/g)){
      alert("Due to security concerns, you may not enter special characters.\nPlease try again.");
      e.target.value = "";
    } else{
      document.querySelector("#contact-fab a").dataset.name=e.target.value;
      document.querySelector('.message-body pre').innerHTML = document.querySelector("#contact-fab a").dataset.message + e.target.value;
      generateMailtoLink();
      document.querySelectorAll(".insert-name").forEach((item, i) => {
        item.innerText=" "+e.target.value;
      });
    }
    console.log(e.target.value);
  };
  var themeChanger=document.querySelector(".theme-changer");
  themeChanger.onclick=function(e, i){
    var body = document.querySelector("body");
    body.classList.toggle("dark-theme");
    document.querySelector("meta[name='theme-color']").content = getComputedStyle(body).getPropertyValue("--main-bg-color");
    }
  // var images = document.querySelectorAll(".image-container picture");
  // for (var i = 0; i < images.length; i++) {
  //   var bubble = document.createElement('div');
  //   bubble.setAttribute('class','img-bubble');
  //   if(i==0){bubble.setAttribute('class','img-bubble active');}
  //   document.querySelector(".image-bubbles").appendChild(bubble);
  // }
  // function switchImage(plusMinus){
  //   var activeImage = document.querySelector(".image-container picture.active");
  //   var currentIndex = Array.from(activeImage.parentNode.children).indexOf(activeImage);
  //   var currentIndexCremented = currentIndex+plusMinus;
  //   var imageBubbles = document.querySelector(".image-bubbles")
  //   var imageContainer = document.querySelector(".image-container");
  //   if (currentIndexCremented>=0 && currentIndexCremented<imageContainer.children.length){
  //     activeImage.classList.remove("active");
  //     imageContainer.children[currentIndexCremented].classList.add("active");
  //     imageBubbles.children[currentIndex].classList.remove("active");
  //     imageBubbles.children[currentIndexCremented].classList.add("active");
  //   }
  // }

  // document.querySelector(".clickable-l").onclick = function () {
  //   switchImage(-1);
  // };
  // document.querySelector(".clickable-r").onclick = function () {
  //   switchImage(1);
  // };

});
let mailObject = {
  defaultMail: {
    subject: "Inquiry regarding translation/web development",
    message: `Hey Sam,

I saw your website and ...

Cheers,

`
  },
  translationArea: {
    subject: "Question regarding your expertise in translating ___",
    message: `Hey Sam,

for my current project, I'm looking for someone who can translate ___. Do you think you could do that?

Cheers,

`
  },
  translationRates: {
    subject: "Inquiry regarding your translation rates",
    message: `Hey Sam,

I was wondering what you would charge for a text of ___? The text ...

Cheers,

`
  },
  webdev: {
    subject: "Inquiry regarding the creation of a website for ___",
    message: `Hey Sam,

I ___. For that purpose, I need a website. This website ...`
  },
  webdevMaintenance: {
    subject: "Inquiry regarding website maintenance or improvement",
    message: `Hey Sam,

I ___ and over the years, the website has developed some problems. Could you ...

Cheers,

`
  },
  confession: {
    subject: "愛の告白",
    message: `サムさんがずっとずっと前から好きでした！付き合ってください！

`
  }
}

function generateMailtoLink(){
  let contactFabLink=document.querySelector("#contact-fab a");
  contactFabLink.href="mailto:me@samswartzberg.com?subject="
  + encodeURIComponent(contactFabLink.dataset.subject) +
  "&body=" + encodeURIComponent(contactFabLink.dataset.message) +
  encodeURIComponent(contactFabLink.dataset.name);
  contactFabLink.href=contactFabLink.href.replace(/%0A/g,"%0D%0A");
}
generateMailtoLink();

document.querySelector('#mail-select').onchange = (e) =>{
  console.log(e);
  let contactFabLink=document.querySelector("#contact-fab a");
  contactFabLink.dataset.subject = mailObject[e.target.value].subject;
  contactFabLink.dataset.message = mailObject[e.target.value].message;
  generateMailtoLink();
  document.querySelector('.message-body pre').innerHTML = mailObject[e.target.value].message;
  document.querySelector('.message-body pre').innerHTML += contactFabLink.dataset.name || "";
}
document.querySelector("#contact-fab").onclick = () => {
  document.querySelector("#contact-fab-outer").classList.add("send");
  window.setTimeout(() => {
    document.querySelector("#contact-fab-outer").classList.remove("send");
  }, 3000)
}

window.setTimeout(() => {document.querySelector("#contact-fab-outer").classList.add("message-reminder")},300000000);
window.setTimeout(() => {document.querySelector("#contact-fab-outer").classList.remove("message-reminder")},100000000);
