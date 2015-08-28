document.addEventListener('DOMContentLoaded', function() {
  var submitButton = document.getElementById('submit_form');
  //get data from storage
  chrome.storage.sync.get(null,function(data){
    document.getElementById('username').value = data.username;
    document.getElementById('password').value = data.password;
  });

  //open prontonetworks in new tab
  var loginButton =  document.getElementById('login');
  loginButton.addEventListener('click', function () {
    chrome.runtime.sendMessage({clicked : true});
  })

  //logout
  document.getElementById('logout').addEventListener('click',function () {
    chrome.runtime.sendMessage({logout : true});
  });

  //get new login data from user
  submitButton.addEventListener('click', function() {
    var f = document.getElementById('form1');
    username= f.elements['username'].value;
    password= f.elements['password'].value;
    chrome.storage.sync.set({"username": username ,"password": password}, function () {
    console.log("settings saved");
    });
  });
  }, false);
