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

  chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse){
      if(request.network_error){
        setStatus(request.status);
      }
    }
  );

  loginButton.addEventListener('click', function () {
    setStatus('Logging in, please wait...');
    chrome.runtime.sendMessage({
      login: true,
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    });
    chrome.runtime.onMessage.addListener(
      function(request,sender,sendResponse){
        if(request.login_success == true){
          setStatus('Logged in');
        }
        if(request.login_success == false){
          setStatus('Incorrect credentials');
        }
        if(request.quota_over == true){
          setStatus('Quota over');
        }
        if(request.already_logged_in == true){
          setStatus('Already logged in');
        }
        if(request.login_timed_out == true){
          setStatus('Request Timed out');
        }
    });
  });

  logoutButton.addEventListener('click',function () {
    chrome.runtime.sendMessage({logout: true});
    chrome.runtime.onMessage.addListener(
      function(request,sender,sendResponse){
        if(request.logout_success == true){
          setStatus('Logged out');
        }
        if(request.logout_success == false){
          setStatus('No Active Session');
        }
    });
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
