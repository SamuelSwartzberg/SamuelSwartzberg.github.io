function changeInsertedName(e){
  if(e.target.value.match(/[\{\}\[\]\(\)\;\=\+\-\"\*\:\>\<\!\,\.\-\_\@\%\&\?\^]/g)){ // Prevent script injection. I'm not sure anything bad could even happen, but no use risking it
      alert("Due to security concerns, you may not enter special characters.\nPlease try again.");
      e.target.value = "";
    } else{
      mailto.setName(e.target.value);
      document.querySelectorAll(".insert-name").forEach((item, i) => {
        item.innerText=" "+e.target.value;});}//Change the name in places the name should be inserted
}