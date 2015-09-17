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

  loginButton.addEventListener('click', function login() {
    setStatus('logging in, please wait...');
    chrome.runtime.sendMessage({login: true});
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
    });
  });

  logoutButton.addEventListener('click',function logout() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","http://phc.prontonetworks.com/cgi-bin/authlogout",true);
    xmlhttp.send();
    xmlhttp.onreadystatechange=function()
    {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
        var patt_logout = new RegExp(/successfully logged out/i);
        var patt_no_active = new RegExp(/no active session/i);

        var res1 = patt_logout.test(xmlhttp.responseText);
        var res2 = patt_no_active.test(xmlhttp.responseText);
        if(res1){
          setStatus('Logout Successful');
        }
        if(res2){
          setStatus('No active session exists');
        }
        else if(!res1 && !res2){
          setStatus('Unknown error occurred :(');
        }
      }
    }
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
