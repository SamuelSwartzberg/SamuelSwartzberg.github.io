function siteInit() {
  let url = document.URL.split('?')[1];
  let params;
  if(url){
     params = new URLSearchParams(url);
  }
  if(!url || !params) {
    params = new Map([["language", "en"],["theme", "traditional"],["purpose", "translation"],]);
  }
    for (const [key, value] of params) {
      document.querySelector('#cv').dataset[key] = value;
      document.querySelector(`[value=${value}]`).classList.add('active');
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
  let cv = document.querySelector('#cv')
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
  console.log(button);
  try {
    let optionSectionParent = getParentWithClass(button, 'opt-section');
    let dataAttr = optionSectionParent.id;
    document.querySelector('#cv').dataset[dataAttr] = button.value;
    setLang();
    modifyUrl(dataAttr, button.value);
    applyActive(button, optionSectionParent);
  } catch (e) {
    console.log(e);
    return;
  }

}
document.addEventListener('DOMContentLoaded', siteInit);
document.querySelectorAll('button.apply-attr').forEach(item => item.onclick = applyAttr);
