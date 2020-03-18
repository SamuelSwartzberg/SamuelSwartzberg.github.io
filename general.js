document.querySelector(".code-selector").onchange = function (e,i) {
    document.querySelectorAll("#code .mockup-body > div").forEach((item, i) => {
        item.style.display="none";
    });
    document.querySelector("#code .mockup-body ."+e.target.value).style.display="block";
}
