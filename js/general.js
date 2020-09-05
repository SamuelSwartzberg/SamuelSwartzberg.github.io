// Helper methods

// Adapted from https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element-relative-to-the-browser-window
function getOffsetFromTopOfDocument(element) {
  var bodyRect = document.body.getBoundingClientRect(),
      elemRect = element.getBoundingClientRect(),
      offset   = elemRect.top - bodyRect.top;
  return offset;
}

function windowIsScrolledToBottom() {
  return (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2; } // From Stackoverflow, the 2px are a solution to a mac bug

function createFakeEvent(node){
  return {target:node};
}

let getScalingFactor = (dimension1, dimension2) => {
  return dimension1/dimension2;
}

// Language handling

// Methods

function sanitizeLanguage(language) { // Transform UA Language strings into the only form we need, either de or en
  return language.startsWith("de") ? "de" : "en"; }
function getOppositeLang(lang){
  return lang==="de" ? "en" : "de";}
function getCurrentLang() {
  return document.querySelector('html').lang; }

// Init

function getLanguageInit() {
  if (localStorage.getItem("language")){
    return localStorage.getItem("language"); // If the user has changed the language before, we've saved in localStorage and will retrieve it
  } else {
    return navigator.languages
    ? navigator.languages[0]
    : (navigator.language || navigator.userLanguage); // One-liner to get the users preferred language, supports older browsers too (that's why it's so long)
    //cf https://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference/25603630#25603630
  }
}

function changeLanguage(language){
  language = sanitizeLanguage(language);
  localStorage.setItem("language", language);
  document.querySelector("html").lang = language; }

changeLanguage(getLanguageInit());

// Methods for handling selects

var fitSelect = function (e) { // Set the width of the select so that the arrow will be placed directly next to the text
  // Without this, the select is always as wide as its widest options
  //Create a div with the same text as the select ...
  var tempMeasureNode = document.createElement("div");
  var tempText = document.createTextNode(e.target.children[e.target.selectedIndex].text);
  tempMeasureNode.appendChild(tempText);
  tempMeasureNode.style = "white-space: pre; overflow-wrap: normal;"; // Make sure it doesn't add a line break and miscalculate
  var newAttachedNode = e.target.parentNode.appendChild(tempMeasureNode);
  // Calculate the width of that tiv
  var textWidth = (parseInt(window.getComputedStyle(newAttachedNode).width)+10)+"px";
  console.log(newAttachedNode.textContent);
  newAttachedNode.remove();
  //And assign that width to the select
  e.target.style.width = textWidth;
};

function fitAllSelects() { //Apply the method fitting the selects to all relevant selects
  document.querySelectorAll('select:not(.dance-selector)').forEach((item, i) => {
    fitSelect(createFakeEvent(item));
  });
}

function transposeSelects(currentLang){ // If the user switches the languages while having selects set, we want to make sure those selects are also correctly set in the new language
  let oldSelects = document.querySelectorAll(`html [lang="${currentLang}"] select`);
  let newSelects = document.querySelectorAll(`html [lang="${getOppositeLang(currentLang)}"] select`);
  for (var i = 0; i < oldSelects.length; i++) {
    newSelects[i].value = oldSelects[i].value;
    newSelects[i].onchange(createFakeEvent(newSelects[i]), true);
  }
}

// Changing the active based on the select

var changeActive = function(e, allElementsSelector, correctSelectorPrefix){
  document.querySelectorAll(allElementsSelector).forEach((item, i) => {
    item.classList.remove("active"); }); // Remove active from all elements
  document.querySelectorAll(correctSelectorPrefix+e.target.value).forEach((item, i) => {
    item.classList.add("active"); }); //And add it to the one that we swiched to
}

function changeActiveAnimated (e, subsection, selectSelector, afterChangeCallback){
  fitSelect(e);
  document.querySelector(subsection + " .mockup-border").classList.add("change-swipe"); //Add the class that does the sideways swipe aimation

  window.setTimeout(()=>{
    changeActive(e, subsection + selectSelector, subsection + " .mockup-body .");
    if(afterChangeCallback)
      afterChangeCallback();
  }, 200); //Change the content exactly when the element is temporarily invisble
  window.setTimeout(()=>{
    document.querySelector(subsection + " .mockup-border").classList.remove("change-swipe"); //Remove the class that does the sideways swipe aimation, so we can reanimate by reapplying it later
  },420); // The time when the animation is finished
}

// Clickhandlers

document.querySelector(".language-switcher").onclick = e => {
  let currentLang = getCurrentLang();
  changeLanguage(getOppositeLang(currentLang));
  transposeSelects(currentLang);
  fitAllSelects();
  setDocumentHeight(document.querySelector('#contact .message-body'));
}




document.querySelector(".code-selector").onchange = function (e,i) {
  changeActiveAnimated(e, "#code", " .mockup-body > div");

  let pictureInPicture = document.getElementsByClassName('picture-in-picture')[0];
  if (e.target.value==="html-code"){ // spawn and handle te pip
    window.setTimeout(()=>{
      let pipBoundingRect = pictureInPicture.getBoundingClientRect();
      let nameInput = document.querySelector("#name-input");
      let nameInputBoundingRect = nameInput.getBoundingClientRect();

      // Since we want the pip element to come out of the textinput, we need to transfrom it to there

      // How much bigger or smaller is the pip?
      let xScalingFactor = getScalingFactor(nameInputBoundingRect.width, pipBoundingRect.width),
          yScalingFactor = getScalingFactor(nameInputBoundingRect.height, pipBoundingRect.height);

      // How much (in absolute length) have we shrunk (or grown) the pip?
      let pipXShrinkResult = pipBoundingRect.width - xScalingFactor * pipBoundingRect.width,
          pipYShrinkResult = pipBoundingRect.height - yScalingFactor * pipBoundingRect.height;

      // How much will we have to move the pip?
      let xOffset = nameInputBoundingRect.left - (pipBoundingRect.left + pipXShrinkResult/2),
          yOffset = nameInputBoundingRect.top - (pipBoundingRect.top + pipXShrinkResult/2);

      //Apply the values to the pip CSS
      pictureInPicture.style.setProperty("--translate-x", `${xOffset}px`);
      pictureInPicture.style.setProperty("--translate-y", `${yOffset}px`);
      pictureInPicture.style.setProperty("--scale-x", `${xScalingFactor}`);
      pictureInPicture.style.setProperty("--scale-y", `${yScalingFactor}`);

      setTimeout(function () {
          pictureInPicture.classList.add("positioned"); // This class appliies the transforms necessary to get the element moving back
          pictureInPicture.classList.add("spawned"); // This makes it visible
      }, 50);
      setTimeout(function () {
          pictureInPicture.classList.add("arrived"); // This starts the bobbing animation
      }, 1050);

    }, 400); //400ms since we want the sideswiping animation of the select swich to finish first
  } else{
    pictureInPicture.classList.remove("spawned", "arrived");
    pictureInPicture.style="";
    setTimeout(function () {
        pictureInPicture.classList.remove("positioned"); // This is removed later so we can have the pip fade out without moving back
    }, 1000);
  }

};


  let pipHide = (entries, observer) => {
    entries.forEach(entry => {
      let pictureInPicture= document.querySelector(".picture-in-picture");
      if (entry.isIntersecting) {
        pictureInPicture.classList.add("hidden");
      } else {
        pictureInPicture.classList.remove("hidden");
      }
    });
  };
  let continueScrollHide = (entries, observer) => {
    entries.forEach(entry => {
      let pictureInPicture= document.querySelector(".picture-in-picture");
      if (entry.isIntersecting) {
        pictureInPicture.classList.add("hidden");
      }
    });
  };
  let reshow = (entries, observer) => {
    entries.forEach(entry => {
      let pictureInPicture= document.querySelector(".picture-in-picture");
      if (entry.isIntersecting) {
        pictureInPicture.classList.remove("hidden");
      }
    });
  };


  let pictureInPictureHideObserver = new IntersectionObserver(pipHide, {threshold: 0.4});
  pictureInPictureHideObserver.observe(document.querySelector('#intro'));
  let pictureInPictureHideObserverBelow = new IntersectionObserver(continueScrollHide, {threshold: 0.35});
  pictureInPictureHideObserverBelow.observe(document.querySelector('#contact'));
  let pictureInPictureHideObserverRestore = new IntersectionObserver(reshow, {threshold: 1});
  pictureInPictureHideObserverRestore.observe(document.querySelector('#code .mockup-container'));

  function showOriginalOrTranslation(){
    let originalOrTranslation=document.querySelector(".mockup-body .active .lang.active").dataset.version;
    let getInverse = (orTr)=> orTr==="translation" ? "original" : "translation";
    document.querySelector(".original-translation-container ."+originalOrTranslation).classList.add("flex-active");
    document.querySelector(".original-translation-container ."+getInverse(originalOrTranslation)).classList.remove("flex-active");
    console.log(originalOrTranslation);
  }
let discovered = false;
document.querySelectorAll(".tl-topic-selector").forEach((selector) => {
  selector.onchange =function (e, isFake) {
    changeActiveAnimated(e, "#translation"," .mockup-body .topic", showOriginalOrTranslation);
    if (!isFake){
      discovered=true;
    }};
});

showOriginalOrTranslation();
document.querySelectorAll(".tl-lang-selector").forEach((selector) => {
  selector.onchange = function (e,i) {
    changeActiveAnimated(e, "#translation", " .mockup-body .lang",showOriginalOrTranslation);};
});

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

function getNextInSelect(select) {
  let currentValue = select.value;
  for (var i = 0; i < select.children.length; i++) {
    console.log(i);
    if (i === select.children.length-1){
      if (select.children[0].value==="dummy")
        return select.children[1].value;
      else
        return select.children[0].value;
    }
    if (select.children[i].value === currentValue) {
      if (select.children[i+1].disabled){
        continue;
      }
      return select.children[i+1].value;
    }
  }

}

window.setInterval(()=>{
  if (discovered) return;
  let selectContainer = document.querySelector( `#translation [lang=${getCurrentLang()}] .language-selector-container`);
  selectContainer.classList.add("change-swipe");
  let selectElement = selectContainer.firstElementChild;
      let fakeEvent = {target:selectElement};
  window.setTimeout(()=>{
    selectElement.value = getNextInSelect(selectElement);
    fitSelect(fakeEvent);
  }, 200)
  window.setTimeout(()=>changeActiveAnimated(fakeEvent, "#translation"," .mockup-body .topic", showOriginalOrTranslation), 50);
  window.setTimeout(()=>selectContainer.classList.remove("change-swipe"), 470);
}, 6000);


document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelector("#name-input").oninput = function (e,i){
    if(e.target.value.match(/[\{\}\[\]\(\)\;\=\+\-\"\*\:\>\<\!\,\.\-\_\@\%\&\?\^]/g)){
      alert("Due to security concerns, you may not enter special characters.\nPlease try again.");
      e.target.value = "";
    } else{
      let contactFab = document.querySelector("#contact-fab a");
      contactFab.dataset.name=e.target.value;
      document.querySelector('.message-body pre').innerHTML = contactFab.dataset.message + e.target.value;
      generateMailtoLink(contactFab);
      document.querySelectorAll(".insert-name").forEach((item, i) => {
        item.innerText=" "+e.target.value;
      });
    }
    console.log(e.target.value);
  };
  var themeChanger=document.querySelector(".theme-changer");
  themeChanger.onclick=function(e, i){
    document.querySelectorAll('#code .mockup-border, #code .mockup-body').forEach((item, i) => {
      item.classList.add("show-overflow");
    });

    themeChanger.style.backgroundColor="var(--opposite-button-bg)";
    themeChanger.parentNode.classList.add("discovered", "clicked");
    window.setTimeout(()=>{
      var body = document.querySelector("body");
      body.classList.toggle("dark-theme");
      document.querySelector("meta[name='theme-color']").content = getComputedStyle(body).getPropertyValue("--main-bg-color");
      themeChanger.parentNode.classList.remove("clicked");
      themeChanger.style.backgroundColor="var(--main-button-bg)";
      document.querySelectorAll('#code .mockup-border, #code .mockup-body').forEach((item, i) => {
        item.classList.remove("show-overflow");
      });
    }, 100);


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
  de: {
    defaultMail: {
      subject: "Anfrage zu ...",
      message: `Hey Sam,

Ich war auf deiner Website und ...

Viele Grüße,

`
    },
    translationArea: {
      subject: "Anfrage zu deiner Fachkenntnis bezüglich ___",
      message: `Hey Sam,
für mein momentanes Projekt bräuchte ich jemanden, der Kenntnisse im Bereich  ___ hat. Hast du in diesem Bereich Erfahrung?

Viele Grüße,

`
    },
    translationRates: {
      subject: "Anfrage zum Preis einer Übersetzung",
      message: `Hey Sam,

was würde denn das Übersetzen eines Textes von etwa ___ kosten? Der Text ...

Viele Grüße,

`
    },
    webdev: {
      subject: "Anfrage für eine Website ___",
      message: `Hey Sam,

ich ___, und dafür bräuchte ich eine Website. Diese Website ...

Viele Grüße,

`
    },
    webdevMaintenance: {
      subject: "Anfrage zur (General)überholung/Instandsetzung/Erweiterung einer Website",
      message: `Hey Sam,

ich ___, und im Laufe der Zeit ___. Daher ...

Viele Grüße,

`
    },
    confession: {
      subject: "愛の告白",
      message: `サムさんがずっとずっと前から好きでした！付き合ってください！

`
    }
  },
  en: {
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

I ___. For that purpose, I need a website. This website ...

Cheers,

`
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
}

function setDatasetValues(value, contactFabLink){
  contactFabLink.dataset.subject = mailObject[document.querySelector("html").lang][value].subject;
  contactFabLink.dataset.message = mailObject[document.querySelector("html").lang][value].message;
}
function generateMailtoLink(contactFabLink){
  contactFabLink.href="mailto:me@samswartzberg.com?subject="
  + encodeURIComponent(contactFabLink.dataset.subject) +
  "&body=" + encodeURIComponent(contactFabLink.dataset.message) +
  encodeURIComponent(contactFabLink.dataset.name);
  contactFabLink.href=contactFabLink.href.replace(/%0A/g,"%0D%0A");
}
function updateMessagePre(contactFabLink){
  document.querySelector('.message-body pre').innerHTML = contactFabLink.dataset.message;
  document.querySelector('.message-body pre').innerHTML += contactFabLink.dataset.name || "";}

function updateMailItems(value){
  let contactFabLink=document.querySelector("#contact-fab a");
  setDatasetValues(value, contactFabLink);
  generateMailtoLink(contactFabLink);
  updateMessagePre(contactFabLink);
}
document.querySelectorAll('.mail-select')
document.querySelectorAll('.mail-select').forEach((select) => {
  select.onchange = (e) => updateMailItems(e.target.value);
  updateMailItems(select.value);
});

document.querySelector("#contact-fab").onclick = () => {
  document.querySelector("#contact-fab-outer").classList.add("send");
  window.setTimeout(() => {
    document.querySelector("#contact-fab-outer").classList.remove("send");
  }, 3000)
}

window.setTimeout(() => {document.querySelector("#contact-fab-outer").classList.add("message-reminder")},45000);
window.setTimeout(() => {document.querySelector("#contact-fab-outer").classList.remove("message-reminder")},52000);

let finalMessage = document.querySelector('#contact .message-body');

function setDocumentHeight(finalMessage){
  document.querySelector(".main-container").style.height = `${getOffsetFromTopOfDocument(finalMessage) + parseInt(window.getComputedStyle(finalMessage).height.match(/\d*/)) + 20}px`;
}
setDocumentHeight(finalMessage);

let wiggleSend = (entries, observer) => {
  entries.forEach(entry => {
    let fabOuter= document.querySelector("#contact-fab-outer");
    if (entry.isIntersecting) {
      fabOuter.classList.add("wiggle");
    } else {
      window.setTimeout(()=>{
        fabOuter.classList.remove("wiggle");
      },300);
    }
  });
};
window.setInterval(()=>{
  if (windowIsScrolledToBottom()){
    window.scrollBy(0,-30);
  }
},500)

let bottomObserverWiggle = new IntersectionObserver(wiggleSend, {threshold: 1});
bottomObserverWiggle.observe(finalMessage);
