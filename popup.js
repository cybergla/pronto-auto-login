function setStatus(markup) {
  document.getElementById('status').innerHTML = '<h4>' + markup + '</h4>';
}

document.addEventListener('DOMContentLoaded', function() {
  var loginButton = document.getElementById('login');
  var submitButton =  document.getElementById('submit_form');
  var logoutButton = document.getElementById('logout');
  //get data from storage
  chrome.storage.sync.get(null,function(data){
    if(data.username != (undefined || null)){
    document.getElementById('username').value = data.username;
    document.getElementById('password').value = data.password;
    }
  });

  // Set up message listener once
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.login_success === true) {
      setStatus('Logged in');
    } else if (request.login_success === false) {
      setStatus('Incorrect credentials');
    } else if (request.network_error) {
      setStatus(request.status);
    }
  });

  // Button click handlers only send messages
  loginButton.addEventListener('click', function() {
    setStatus('Logging in, please wait...');
    chrome.runtime.sendMessage({
      login: true,
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    });
  });

  logoutButton.addEventListener('click',function () {
    chrome.runtime.sendMessage({logout: true});
  });

  //get new login data from user
  submitButton.addEventListener('click', function() {
    var f = document.getElementById('form1');
    username= f.elements['username'].value;
    password= f.elements['password'].value;
    chrome.storage.sync.set({"username": username ,"password": password}, function () {
      setStatus('Saved login data');
    });
  });
}, false);
