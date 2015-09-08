function setStatus(markup) {
  document.getElementById('status').innerHTML = '<h4>' + markup + '</h4>';
}

document.addEventListener('DOMContentLoaded', function() {
  var loginButton = document.getElementById('login');
  var submitButton =  document.getElementById('submit_form');
  var logoutButton = document.getElementById('logout');
  //get data from storage
  chrome.storage.sync.get(null,function(data){
    document.getElementById('username').value = data.username;
    document.getElementById('password').value = data.password;
  });

  loginButton.addEventListener('click', function login() {
    setStatus('logging in, please wait...');
    chrome.storage.sync.get(null,function(data){
      var username = data.username;
      var password = data.password;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("POST","http://phc.prontonetworks.com/cgi-bin/authlogin",true);
      xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xmlhttp.send("userId="+username+"&password="+password+"&serviceName=ProntoAuthentication&Submit22=Login");
      xmlhttp.onreadystatechange = function () {
        if ( 4 != xmlhttp.readyState ) {
            return;
        }
        if ( 200 != xmlhttp.status ) {
            return;
        }
        //console.log(xmlhttp.responseText);
        var patt_success = /congratulations/i;
        var patt_already = /already logged in/i;
        var patt_quota_over = /quota is over/i;
        var patt_error = /sorry/i;

        var res1 = patt_success.test(xmlhttp.responseText)
        var res2 = patt_error.test(xmlhttp.responseText);
        var res3 = patt_quota_over.test(xmlhttp.responseText);
        var res4 = patt_already.test(xmlhttp.responseText);

        if(res1){
          setStatus('Login Successful');
          chrome.runtime.sendMessage({'setIconColor':true});
          console.log("logged in");
        }
        if(res2){
          setStatus('Incorrect credentials');
          console.log("Incorrect username/pass");
        }
        if(res3){
          setStatus('Your quota is over');
          console.log("quota over");
        }
        if(res4){
          setStatus('Already Logged In');
          console.log("already logged in");
        }

        if(!res1 && !res2 && !res3 && !res4){
          setStatus('Unknown error occurred :(');
          console.log("Unkown error");
        }
      };
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
          setStatus('Could not logout');
        }
        chrome.runtime.sendMessage({'setIconBw':true});
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
