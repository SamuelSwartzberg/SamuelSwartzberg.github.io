function showWhetherOriginalOrTranslation(){ //For the translation, shows the appropriate Translation / Original element
  let originalOrTranslation=document.querySelector(".mockup-body .active .lang.active").dataset.version;
  let getInverse = (orTr)=> orTr==="translation" ? "original" : "translation";
  document.querySelectorAll(".original-translation-container ."+originalOrTranslation).forEach(ele=>ele.classList.add("flex-active"));
  document.querySelectorAll(".original-translation-container ."+getInverse(originalOrTranslation)).forEach(ele=>ele.classList.remove("flex-active")); }
function switchTopicTranslation(){
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
}