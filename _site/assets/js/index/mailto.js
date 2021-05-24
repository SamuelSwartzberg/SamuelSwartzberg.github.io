let mailto = {
  subject: "",
  message: "",
  name: "",
  update(lang, messageType, name = this.name){
    ({ subject: this.subject, message: this.message } = mailData[lang][messageType]);
    this.name = name;
  },
  getMailtoLink(){
    return "mailto:me@samswartzberg.com?subject="
    + encodeURIComponent(this.subject) +
    "&body=" + encodeURIComponent(this.message) +
    encodeURIComponent(this.name)
  },
  getMessageString(){
    return this.message + this.name;
  }
}
