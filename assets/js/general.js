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

function fitAllSelects() { //Apply the method fitting the selects to all relevant selects
  document.querySelectorAll('select:not(.dance-selector)').forEach((item, i) => {
    fitSelect(createFakeEvent(item));
  });
}

// function transposeSelects(currentLang){ // If the user switches the languages while having selects set, we want to make sure those selects are also correctly set in the new language
//   let oldSelects = document.querySelectorAll(`html [lang="${currentLang}"] select`);
//   let newSelects = document.querySelectorAll(`html [lang="${getOppositeLang(currentLang)}"] select`);
//   for (var i = 0; i < oldSelects.length; i++) {
//     newSelects[i].value = oldSelects[i].value;
//     newSelects[i].onchange(createFakeEvent(newSelects[i]), true);
//   }
// }


// Event Handlers

document.querySelectorAll('.quicklink').forEach((quicklink, i) => { //since #anchor links break the document due to the cut off overflow situation with contact, this method makes them scroll to their targets instead
  quicklink.onclick = event =>
    window.scrollTo(0,
      getOffsetFromTopOfDocument(
        document.querySelector(quicklink.dataset.target)));
});


document.querySelector(".language-switcher").onclick = e => { // Handle the changing of the language by the user
  let currentLang = getCurrentLang();
  changeLanguage(getOppositeLang(currentLang)); // Change the language of the <html> node
  transposeSelects(currentLang); // Carry the values of the selects over to the new language
  fitAllSelects(); // Fit the arrows of the selects
  setDocumentHeight(document.querySelector('#contact .message-body'));
}

document.querySelector(".code-selector").onchange = function (e,i) {
  changeActiveAnimated(e, "#code", " .mockup-body > div");
  togglePip();
};


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

document.querySelector(".dance-selector").onchange = makeElementDance
document.querySelector("#name-input").oninput = changeInsertedName

var themeChanger=document.querySelector(".theme-changer");
themeChanger.onclick=function(e, i){
  changeTheme(themeChanger)
}

document.querySelectorAll('.mail-select').forEach((select) => {
  select.onchange = (e) => mailto.update(getCurrentLang(),e.target.value);
});

document.querySelectorAll("#contact-fab").forEach(fab => fab.onclick = fabAnimateSend)
window.setTimeout(() => fabShowEmailReminder(),45000);
window.setInterval(()=> switchTopicTranslation(), 6000);
window.setInterval(()=>{ if (windowIsScrolledToBottom()) scrollUpSlightly() },500) // scroll users up a little so when they scroll down again the fab will wiggle again

// Site init

showWhetherOriginalOrTranslation();
let finalMessage = document.querySelector('#contact .message-body');
setTimeout(function () {
  setDocumentHeight(finalMessage);
}, 100);


let pictureInPictureHideObserver = new IntersectionObserver(intersectionFunctionContainer.getHideWhenIntersecting('.picture-in-picture'), {threshold: 0.4});
pictureInPictureHideObserver.observe(document.querySelector('#intro'));
let pictureInPictureHideObserverBelow = new IntersectionObserver(intersectionFunctionContainer.getHideOnceIntersected('.picture-in-picture'), {threshold: 0.35});
pictureInPictureHideObserverBelow.observe(document.querySelector('#contact'));
let pictureInPictureHideObserverRestore = new IntersectionObserver(intersectionFunctionContainer.getUnhideOnceIntersected('.picture-in-picture'), {threshold: 1});
pictureInPictureHideObserverRestore.observe(document.querySelector('#code .mockup-container'));
