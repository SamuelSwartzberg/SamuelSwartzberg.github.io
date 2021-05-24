var changeActiveClass = function(e, allElementsSelector, correctSelectorPrefix){
  document.querySelectorAll(allElementsSelector).forEach((item, i) => {
    item.classList.remove("active"); }); // Remove active from all elements
  document.querySelectorAll(correctSelectorPrefix+e.target.value).forEach((item, i) => {
    item.classList.add("active"); }); //And add it to the one that we swiched to
}

function changeActiveAnimated (e, subsection, selectSelector, afterChangeCallback){
  fitSelect(e);
  document.querySelector(subsection + " .mockup-border").classList.add("change-swipe"); //Add the class that does the sideways swipe aimation

  window.setTimeout(()=>{
    changeActiveClass(e, subsection + selectSelector, subsection + " .mockup-body .");
    if(afterChangeCallback)
      afterChangeCallback(); // Execute a callback if necessary
  }, 200); //Change the content exactly when the element is temporarily invisble
  window.setTimeout(()=>{
    document.querySelector(subsection + " .mockup-border").classList.remove("change-swipe"); //Remove the class that does the sideways swipe aimation, so we can reanimate by reapplying it later
  },420); // The time when the animation is finished
}
