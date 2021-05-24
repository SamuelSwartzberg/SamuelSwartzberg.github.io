togglePip(){
  let pictureInPicture = document.getElementsByClassName('picture-in-picture')[0];
  if (e.target.value==="html-code"){ // spawn and handle te pip
    spawnPip(pictureInPicture)
  } else{
    destroyPip(pictureInPicture)
  }
}
spawnPip(pictureInPicture){
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
}
destroyPip(pictureInPicture){
  pictureInPicture.classList.remove("spawned", "arrived");
    pictureInPicture.style="";
    setTimeout(function () {
        pictureInPicture.classList.remove("positioned"); // This is removed later so we can have the pip fade out without moving back
    }, 1000);
}
let intersectionFunctionContainer = {
  getHideWhenIntersecting(selector) {
    return hideWhenIntersecting = (entries, observer) => { // This function will be called on intersection change
      let node= document.querySelector(selector); // The node we want to show or hide
      entries.forEach(entry => { // The IntersectionObserver API returns an interable of some kind, which we have to iterate through
        if (entry.isIntersecting) {
          node.classList.add("hidden");
        } else {
          node.classList.remove("hidden"); } }); };},
  
  getHideOnceIntersected(selector) {
    return hideOnceIntersected = (entries, observer) => {
      let node= document.querySelector(selector);
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.classList.add("hidden");} }); };},
  
  getUnhideOnceIntersected(selector) {
    return unhideOnceIntersected = (entries, observer) => {
      let node= document.querySelector(selector);
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.classList.remove("hidden");} }); };}
}
