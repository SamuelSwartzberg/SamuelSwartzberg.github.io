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