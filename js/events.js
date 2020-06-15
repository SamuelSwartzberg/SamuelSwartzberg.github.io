function switchLanguage(event) {
  console.log(event.target.value);
  document.querySelector('#cv').lang=event.target.value;
  document.querySelector('#language').dataset.languageActive = event.target.value; 
}

document.querySelectorAll('#language.opt-section button').forEach((item, i) => {
  item.onclick = switchLanguage;
});
