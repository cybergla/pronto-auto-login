try {
  //submit form with login data from storage
  var f = document.getElementsByTagName('form')[0];
  chrome.storage.sync.get(null, function(obj){
    f.elements['userId'].value = obj.username;
    f.elements['password'].value = obj.password;
    f.submit();
  });

} catch (e) {
  //if submit form fails
  console.log("Pronto Auto Login Error: Could not get form",e);
}

try {
  //get text from the login failed page (usually opens up when incorrect username/password is given)
  var err = document.getElementsByClassName('errorText10')[0];
  console.log(err);
  if(err){
    alert("Incorrect credentials! Please check your Username and Password.");
    chrome.runtime.sendMessage({error : true});     //close tab
  }
}
catch (e) {
  console.log(e);
}
