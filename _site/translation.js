let query=document.location.search.split("=")[1];
document.querySelectorAll(".search").forEach(search => {
  search.src += query;
})