document.addEventListener('DOMContentLoaded', function() {
  var loginButton = document.getElementById('login');
  var submitButton =  document.getElementById('submit_form');
  //get data from storage
  chrome.storage.sync.get(null,function(data){
    document.getElementById('username').value = data.username;
    document.getElementById('password').value = data.password;
  });

  function renderHtml(markup) {
    document.getElementById('content').innerHTML = markup;
  }

  loginButton.addEventListener('click',function login() {
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
        console.log(xmlhttp.responseText);
        var patt_success = /congratulations/i;
        var patt_already = /already logged in/i;
        var patt_quota_over = /quota is over/i;
        var patt_error = /sorry/i;

        var res1 = patt_success.test(xmlhttp.responseText)
        var res2 = patt_error.test(xmlhttp.responseText);
        var res3 = patt_quota_over.test(xmlhttp.responseText);
        var res4 = patt_already.test(xmlhttp.responseText);

        if(res1){
          renderHtml('<h2>Login Successful</h2>');
          console.log("logged in");
        }
        if(res2){
          renderHtml('<h2>Incorrect credentials</h2>');
          console.log("Incorrect username/pass");
        }
        if(res3){
          renderHtml('<h2>Your quota is over</h2>');
          console.log("quota over");
        }
        if(res4){
          renderHtml('<h2>Already Logged In</h2>');
          console.log("already logged in");
        }
      };
    });
  });

  //logout
  document.getElementById('logout').addEventListener('click',function () {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","http://phc.prontonetworks.com/cgi-bin/authlogout",true);
    xmlhttp.send();
    xmlhttp.onreadystatechange=function()
    {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
        var patt_loggedout = new RegExp(/successfully logged out/i);
        var res1 = patt_loggedout.test(xmlhttp.responseText);
        if(res1)
        {
          renderHtml('<h2>Logout Successful</h2>');
        }
      else if(!res1)
        {
          renderStatus('<h2>Could not logout</h2>');
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
      document.getElementById('status').innerHTML = '<h4>Saved login data</h4>';
      setInterval(function () {document.getElementById('status').innerHTML = '';}, 1500);
      console.log("settings saved");
    });
  });
  }, false);
