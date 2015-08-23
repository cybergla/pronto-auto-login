try {
  var f = document.getElementsByTagName('form')[0];
  console.log(f.elements["userId"]);
  console.log(f.elements["password"]);
  f.elements["userId"].value = "tanay96";
  f.elements["password"].value = "tamdya96"
  f.submit();
} catch (e) {
  console.log("Pronto Auto Login Error: Could not get form");
}

try {
  var err = document.getElementsByClassName('errorText10')[0];
  console.log(err);
  if(err){
    alert("Incorrect credentials");
    window.close();
  }
}
catch (e) {
  console.log(e);
}
