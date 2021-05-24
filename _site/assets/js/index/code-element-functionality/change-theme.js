function changeTheme(themeChangeer){
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