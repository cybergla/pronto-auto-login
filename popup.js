document.addEventListener('DOMContentLoaded', function() {
  var submitButton = document.getElementById('submit_form');
  chrome.storage.sync.get(null,function(data){
    document.getElementById('username').value = data.username;
    document.getElementById('password').value = data.password;
  });

  var loginButton =  document.getElementById('login');
  loginButton.addEventListener('click',function () {
    chrome.runtime.sendMessage({clicked : true});
  })

  submitButton.addEventListener('click', function() {
    var f = document.getElementById('form1');
    username= f.elements['username'].value;
    password= f.elements['password'].value;
    chrome.storage.sync.set({"username": username ,"password": password}, function () {
    console.log("settings saved");
    });
  });
  }, false);
