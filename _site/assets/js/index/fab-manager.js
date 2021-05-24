function fabAnimateSend(){
  document.querySelector("#contact-fab-outer").classList.add("send"); //Animating a sending motion
  window.setTimeout(() => {
    document.querySelector("#contact-fab-outer").classList.remove("send");
  }, 3000)
}
function fabShowEmailReminder(){
  let fabOuter = document.querySelector("#contact-fab-outer");
  fabOuter.classList.add("message-reminder");
  window.setTimeout(() => {fabOuter.classList.remove("message-reminder")},7000);
}