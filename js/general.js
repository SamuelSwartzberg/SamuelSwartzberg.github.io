// The email message object

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

let mailHandler = {
  value: "",
  setValue(value){
    this.value = value;
    this.updateHtml();
  },
  name: "",
  setName(name){
    this.name = name;
    this.updateHtml();
  },
  getCurrentMailObject(){
    return mailObject[getCurrentLang()][this.value];
  },
  getSubject(){
    return this.getCurrentMailObject().subject;
  },
  getMessage(){
    return this.getCurrentMailObject().message;
  },
  getMailtoLink(){
    return "mailto:me@samswartzberg.com?subject="
    + encodeURIComponent(this.getSubject()) +
    "&body=" + encodeURIComponent(this.getMessage()) +
    encodeURIComponent(this.name);
  },
  getMessageString(){
    return this.getMessage() + this.name;
  },
  messagePreviewSelector: '.message-body pre',
  fabSelector: "#contact-fab a",
  setMessagePreview(){
    document.querySelector(this.messagePreviewSelector).innerHTML = this.getMessageString();
  },
  setFabMailto(){
    document.querySelector(this.fabSelector).href = this.getMailtoLink().replace(/%0A/g,"%0D%0A");
  },
  updateHtml(){
    this.setMessagePreview();
    this.setFabMailto();
    setDocumentHeight(document.querySelector('#contact .message-body'));
  }
}

// Helper methods

// Scroll intersection helper methods
// These all work the same way, so only one will be commented

function getHideWhenIntersecting(selector) {
  return hideWhenIntersecting = (entries, observer) => { // This function will be called on intersection change
    let node= document.querySelector(selector); // The node we want to show or hide
    entries.forEach(entry => { // The IntersectionObserver API returns an interable of some kind, which we have to iterate through
      if (entry.isIntersecting) {
        node.classList.add("hidden");
      } else {
        node.classList.remove("hidden"); } }); };}

function getHideOnceIntersected(selector) {
  return hideOnceIntersected = (entries, observer) => {
    let node= document.querySelector(selector);
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        node.classList.add("hidden");} }); };}

function getUnhideOnceIntersected(selector) {
  return unhideOnceIntersected = (entries, observer) => {
    let node= document.querySelector(selector);
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        node.classList.remove("hidden");} }); };}

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

function parsePxStringInt(pxstring) {
  return parseInt(pxstring.match(/\d*/), 10);
}

function getVerticalPadding(node) {
  return parsePxStringInt(window.getComputedStyle(node).paddingTop) + parsePxStringInt(window.getComputedStyle(node).paddingBottom);
}

function setDocumentHeight(finalMessage){ // cut off the email preview at the right place
  document.querySelector(".main-container").style.height = `${getOffsetFromTopOfDocument(finalMessage) + getVerticalPadding(finalMessage) +  parsePxStringInt(window.getComputedStyle(finalMessage).height)}px`;
}

function getNextInSelect(select) { // get the next value of the <select> element

  for (var i = 0; i < select.children.length; i++) {

    if (i === select.children.length-1){ // This is the last element, so we need to go back to the beginning
      if (select.children[0].value==="dummy") // But we want to skip the dummy value (e.g. 'choose')
        return select.children[1].value;
      else
        return select.children[0].value;}

    if (select.children[i].value === select.value) { // This is the current element
      if (select.children[i+1].disabled) // If this value is disabled, skip it. BUG: If this isn't the last value in the select, the previous condition would never match and we would iterate through i until it was the last element. Only because the disabled element is the last one anyway in our case does this work.
        continue;
      return select.children[i+1].value; } } } // Return the value of the next element

// Language handling

// Methods

function sanitizeLanguage(language) { // Transform UA Language strings into the only form we need, either de or en
  return language.startsWith("de") ? "de" : "en"; }
function getOppositeLang(lang){
  return lang==="de" ? "en" : "de";}
function getCurrentLang() {
  return document.querySelector('html').lang; }

function changeLanguage(language){
  language = sanitizeLanguage(language);
  localStorage.setItem("language", language);
  document.querySelector("html").lang = language; }

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
      afterChangeCallback(); // Execute a callback if necessary
  }, 200); //Change the content exactly when the element is temporarily invisble
  window.setTimeout(()=>{
    document.querySelector(subsection + " .mockup-border").classList.remove("change-swipe"); //Remove the class that does the sideways swipe aimation, so we can reanimate by reapplying it later
  },420); // The time when the animation is finished
}

// Event Handlers

document.querySelector(".language-switcher").onclick = e => { // Handle the changing of the language by the user
  let currentLang = getCurrentLang();
  changeLanguage(getOppositeLang(currentLang)); // Change the language of the <html> node
  transposeSelects(currentLang); // Carry the values of the selects over to the new language
  fitAllSelects(); // Fit the arrows of the selects
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

function showWhetherOriginalOrTranslation(){ //For the translation, shows the appropriate Translation / Original element
  let originalOrTranslation=document.querySelector(".mockup-body .active .lang.active").dataset.version;
  let getInverse = (orTr)=> orTr==="translation" ? "original" : "translation";
  document.querySelector(".original-translation-container ."+originalOrTranslation).classList.add("flex-active");
  document.querySelector(".original-translation-container ."+getInverse(originalOrTranslation)).classList.remove("flex-active"); }

let discovered = false; // Whether we should stop the auto-rotation of tl topics

document.querySelectorAll(".tl-topic-selector").forEach((selector) => { // Change the topic of translation: CSR, Blurbs etc.
  selector.onchange =function (e, isFake) {
    changeActiveAnimated(e, "#translation"," .mockup-body .topic", showWhetherOriginalOrTranslation);
    if (!isFake){ // Fake events can be sent e.g. when the language is swiched, but we want to continue the auto-rotation then
      discovered=true; // Stop the auto-rotation
    }};
});

document.querySelectorAll(".tl-lang-selector").forEach((selector) => { // Change the language of translation: DE/EN
  selector.onchange = function (e,i) {
    changeActiveAnimated(e, "#translation", " .mockup-body .lang",showWhetherOriginalOrTranslation);};
});

// This is a black box I coded a while ago and do not really understand anymore
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

// The reason this is listening for DOMContentLoaded is probably an old bug fix, which I'm currently not in the mood to break

document.addEventListener('DOMContentLoaded', (event) => {

  document.querySelector("#name-input").oninput = function (e,i){
    if(e.target.value.match(/[\{\}\[\]\(\)\;\=\+\-\"\*\:\>\<\!\,\.\-\_\@\%\&\?\^]/g)){ // Prevent script injection. I'm not sure anything bad could even happen, but no use risking it
      alert("Due to security concerns, you may not enter special characters.\nPlease try again.");
      e.target.value = "";
    } else{
      mailHandler.setName(e.target.value);
      document.querySelectorAll(".insert-name").forEach((item, i) => {
        item.innerText=" "+e.target.value;});}}; //Change the name in places the name should be inserted

  var themeChanger=document.querySelector(".theme-changer");

  themeChanger.onclick=function(e, i){

    document.querySelectorAll('#code .mockup-border, #code .mockup-body, .main-container').forEach((item, i) => {
      item.classList.add("show-overflow");}); //Enable the flood-fill

    themeChanger.style.backgroundColor="var(--opposite-button-bg)"; //change the button color beforehand
    themeChanger.parentNode.classList.add("discovered", "clicked"); //toggle flood fill

    window.setTimeout(()=>{
      var body = document.querySelector("body");
      body.classList.toggle("dark-theme"); // change the theme in css
      document.querySelector("meta[name='theme-color']").content = getComputedStyle(body).getPropertyValue("--main-bg-color"); //change the theme for smartphone url bar etc.
      themeChanger.parentNode.classList.remove("clicked"); // Hide the flood fill circle
      themeChanger.style.backgroundColor="var(--main-button-bg)"; // What was opposite before is now main
      document.querySelectorAll('#code .mockup-border, #code .mockup-body, .main-container').forEach((item, i) => {
        item.classList.remove("show-overflow"); // prevent overflow again
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

document.querySelectorAll('.mail-select').forEach((select) => {
  select.onchange = (e) => mailHandler.setValue(e.target.value);
  mailHandler.setValue(select.value);
});

document.querySelector("#contact-fab").onclick = () => {
  document.querySelector("#contact-fab-outer").classList.add("send"); //Animating a sending motion
  window.setTimeout(() => {
    document.querySelector("#contact-fab-outer").classList.remove("send");
  }, 3000)
}

// Timeouts and intervals

window.setInterval(()=>{ // Switch the topics for translation on loop

  if (discovered) return; // Don't if the user has already figured out how to switch

  let selectContainer = document.querySelector( `#translation [lang=${getCurrentLang()}] .language-selector-container`);
  selectContainer.classList.add("change-swipe"); //start the animation for the <select>

  let selectElement = selectContainer.firstElementChild; // the <select>

  window.setTimeout(()=>changeActiveAnimated(createFakeEvent(selectElement), "#translation"," .mockup-body .topic", showWhetherOriginalOrTranslation), 50); // start the animation for the card 50ms later, for a staggered effect

  window.setTimeout(()=>{
    selectElement.value = getNextInSelect(selectElement); //switch to next <option>
    fitSelect(createFakeEvent(selectElement));
    window.setTimeout(()=>selectContainer.classList.remove("change-swipe"), 200); // remove animation class once animation has finished
  }, 200)
}, 6000);

window.setTimeout(() => { // display the reminder to send an email
  let fabOuter = document.querySelector("#contact-fab-outer");
  fabOuter.classList.add("message-reminder");
  window.setTimeout(() => {fabOuter.classList.remove("message-reminder")},7000);
},45000);

window.setInterval(()=>{
  if (windowIsScrolledToBottom()){
    window.scrollBy(0,-30); } },500) // scroll users up a little so when they scroll down again the fab will wiggle again

// Site init

showWhetherOriginalOrTranslation();
let finalMessage = document.querySelector('#contact .message-body');
setTimeout(function () {
  setDocumentHeight(finalMessage);
}, 100);

// Scroll Intersection Management

let wiggleSend = (entries, observer) => { // Wiggle when user has reached bottom of doc
  entries.forEach(entry => {
    let fabOuter= document.querySelector("#contact-fab-outer");
    if (entry.isIntersecting) {
      fabOuter.classList.add("wiggle");
    } else {
      window.setTimeout(()=>{
        fabOuter.classList.remove("wiggle");
      },300); } }); }; // Let the animation finish

let bottomObserverWiggle = new IntersectionObserver(wiggleSend, {threshold: 0.99});
bottomObserverWiggle.observe(finalMessage);

let pictureInPictureHideObserver = new IntersectionObserver(getHideWhenIntersecting('.picture-in-picture'), {threshold: 0.4});
pictureInPictureHideObserver.observe(document.querySelector('#intro'));
let pictureInPictureHideObserverBelow = new IntersectionObserver(getHideOnceIntersected('.picture-in-picture'), {threshold: 0.35});
pictureInPictureHideObserverBelow.observe(document.querySelector('#contact'));
let pictureInPictureHideObserverRestore = new IntersectionObserver(getUnhideOnceIntersected('.picture-in-picture'), {threshold: 1});
pictureInPictureHideObserverRestore.observe(document.querySelector('#code .mockup-container'));
