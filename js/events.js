function siteInit() {
  let url = document.URL.split('?')[1];
  if(url){
    const params = new URLSearchParams(url);
    for (const [key, value] of params) {
      document.querySelector('#cv').dataset[key] = value;
      document.querySelector(`[value=${value}]`).classList.add('active');
      updateMailtoHref();
    }
  }
}
function updateMailtoHref() {
  document.querySelector('#send-link').href =
  "mailto:?subject=" + encodeURIComponent("Here's Sam Swartzberg's CV!") +
  "&body=" + encodeURIComponent(`Dear ,
    find Sam Swartzberg's CV here: ${document.URL}.

    Cheers,`)
}

function getOptionSectionParent(node) {
  if(node.classList.contains('opt-section')) return node;
  else if (node.nodeName==='BODY') throw 'There is no .opt-section element that is a parent of this node!';
  else return getOptionSectionParent(node.parentNode);
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
  let url = document.URL.split('?')[1];
  if(url){
    const params = new URLSearchParams(url);
    params.set(key, value);
    url = params.toString();
  }
  history.pushState({}, null, document.URL.split('?')[0] + "?" + url);
  updateMailtoHref();
}

function applyAttr(event) {
  console.log(event.target);
  try {
    let optionSectionParent = getOptionSectionParent(event.target);
    let dataAttr = optionSectionParent.id;
    document.querySelector('#cv').dataset[dataAttr] = event.target.value;
    setLang();
    modifyUrl(dataAttr, event.target.value);
    applyActive(event.target, optionSectionParent);
  } catch (e) {
    console.log(e);
    return;
  }

}
document.addEventListener('DOMContentLoaded', siteInit);
document.querySelectorAll('button.apply-attr').forEach(item => item.onclick = applyAttr);
