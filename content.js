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
  //kinda hacky
  //var err = document.getElementsByClassName('errorText10')[0];    //get an element in the page that says "Sorry, please check your..."
  var err2 = document.getElementsByName('dynamicMacAuth')[0];     //when username+password is null

  var patt1 = /Sorry, please check/i;
  var patt2 = /try again/i;
  var responseText = document.getElementsByTagName('html')[0].innerHTML;
  var incorrect_cred = patt1.test(responseText) || patt2.test(responseText) || err2;
  console.log(document.getElementsByTagName('html')[0].innerHTML);
  console.log(incorrect_cred);
  if(incorrect_cred){
    console.log("Incorrect credentials! Please check your Username and Password.")
    alert("Incorrect credentials! Please check your Username and Password.");
    chrome.runtime.sendMessage({error : true});     //close tab
  }
}
catch (e) {
  console.log(e);
}
