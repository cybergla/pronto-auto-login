try {
  var f = document.getElementsByTagName('form')[0];
  chrome.storage.sync.get(null, function(obj){
    f.elements['userId'].value = obj.username;
    f.elements['password'].value = obj.password;
    f.submit();
  });

} catch (e) {
  console.log("Pronto Auto Login Error: Could not get form");
}

try {
  var err = document.getElementsByClassName('errorText10')[0];
  console.log(err);
  if(err){
    alert("Incorrect credentials! Please check your Username and Password.");
    chrome.runtime.sendMessage({error : true});
  }
}
catch (e) {
  console.log(e);
}
