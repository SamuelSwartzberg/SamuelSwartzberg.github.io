function siteInit() {
  let url = document.URL.split('?')[1];
  let params;
  let defaultParams = new Map([["language", "en"],["theme", "modern"],["purpose", "translation"],]);
  params = new URLSearchParams(url);
  for (const [key, value] of defaultParams) {
    if(!params || params.has(key) === false){
      params.append(key, value); // If a key is unspecified, populate it with the default value
    }
  }
    for (let [key, value] of params) {
      if(!params.get(key)){ // Value may still be undefined or null because of some error, generally anything falsy will not be useful, so replace it with the default param
        value = defaultParams(key);
      }
      document.querySelector('#cv-container-inner').dataset[key] = value;
      document.querySelector(`[value=${value}]`).classList.add('active');
      updatePrintStylesheet();
      updateMailtoHref();
      setLang();
    }
}
function updateMailtoHref() {
  document.querySelector('#send-link').href =
  "mailto:?subject=" + encodeURIComponent("Here's Sam Swartzberg's CV!") +
  "&body=" + encodeURIComponent(`Dear ,
    find Sam Swartzberg's CV here: ${document.URL}.

    Cheers,`)
}

function updatePrintStylesheet() {
  let theme = document.querySelector('#cv-container-inner').dataset["theme"];
  document.querySelector('#print-styles').href = `css/print/${theme}-print.css`;
  console.log(document.querySelector('#print-styles').href);
}

function getParentWithClass(node, nodeClass) {
  if(node.classList.contains(nodeClass)) return node;
  else if (node.nodeName==='BODY') throw `There is no ${nodeClass} element that is a parent of this node`;
  else return getParentWithClass(node.parentNode, nodeClass);
}
function applyActive(target, sectionParent) {
  sectionParent.querySelectorAll('button.apply-attr').forEach(item => item.classList.remove('active'));
  target.classList.add('active');
}
function setLang() {
  let cv = document.querySelector('#cv-container-inner')
  cv.lang=cv.dataset.language;
}
function modifyUrl(key, value){
  if (!key || !value) throw `Key or value provided were falsy - ${key}: ${value}`;
  let url = document.URL.split('?')[1];
  const params = new URLSearchParams(url);
  params.set(key, value);
  url = params.toString();
  history.pushState({}, null, document.URL.split('?')[0] + "?" + url);
  updateMailtoHref();
}

function applyAttr(event) {
  let button = event.target.classList.contains('buttonlike') ? event.target : getParentWithClass(event.target, 'buttonlike');
  if(button.classList.contains("disabled")) return;
  console.log(button);
  try {
    let optionSectionParent = getParentWithClass(button, 'opt-section');
    let dataAttr = optionSectionParent.id;
    document.querySelector('#cv-container-inner').dataset[dataAttr] = button.value;
    setLang();
    updatePrintStylesheet();
    modifyUrl(dataAttr, button.value);
    applyActive(button, optionSectionParent);
  } catch (e) {
    console.log(e);
    return;
  }

}
document.addEventListener('DOMContentLoaded', siteInit);
document.querySelectorAll('button.apply-attr').forEach(item => item.onclick = applyAttr);
window.addEventListener('popstate', function(ev){ //fix back button behavior
    if(document.referrer){
      window.location = document.referrer;
    } else {
      history.pushState(null, null, window.location.pathname);
    }
}, false);
document.querySelectorAll('.print').forEach((item, i) => {
  item.onclick = (item) => {
    window.setTimeout(window.print, 50);
  }
});

//Since our HTML is indented with newlines, there will be ugly whitespace, which we have to remove
function trimTextBefore(node) {
  while (node.previousSibling.nodeName === "#text") { //Get rid of white space from preceeding text nodes first
    node.previousSibling.textContent = node.previousSibling.textContent.trimRight();
    if(node.previousSibling.textContent===""){node.previousSibling.remove();} // If the textnode was only whitespace and is now empty, there may be problematic whitespace in the preceeding text node
    else break; //If it isn't only whitespace, then stop, since it has already been trimmed.
  }
  if(node.previousSibling.innerHTML && node.previousSibling.outerHTML){ //if our previous node is now an element, get rid of whitespace within and without
    node.previousSibling.innerHTML = node.previousSibling.innerHTML.trimRight();
    node.previousSibling.outerHTML = node.previousSibling.outerHTML.trimRight();
  }
  node.innerHTML = node.innerHTML.trimLeft(); //Get rid of any whitespace our node might itself contain
  node.outerHTML = node.outerHTML.trimLeft();
}
document.querySelectorAll('.punct').forEach(trimTextBefore); //Do this before any punctuation
