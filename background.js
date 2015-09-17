chrome.runtime.onStartup.addListener(function () {
  login();
});

var opt_login_success = {
  type: "basic",
  title: "Successfully logged in",
  message: "You may now browse the web normally",
  iconUrl: "icon128.png"
}

var opt_login_error = {
  type: "basic",
  title: "Incorrect Username/Password",
  message: "Please check your details",
  iconUrl: "icon128.png"
}

var opt_already_logged_in = {
  type: "basic",
  title: "Already logged in",
  message: "You can browser the web normally",
  iconUrl: "icon128.png"
}

var opt_quota_over = {
  type: "basic",
  title: "Quota over",
  message: "Sorry, your free quota is over :(",
  iconUrl: "icon128.png"
}

var opt_logout_success = {
  type: "basic",
  title: "Logged Out",
  message: "Please login again to use the internet",
  iconUrl: "icon128.png"
}

var opt_logout_fail = {
  type: "basic",
  title: "No Active Session",
  message: "You are already logged out!",
  iconUrl: "icon128.png"
}


function logout(){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET","http://phc.prontonetworks.com/cgi-bin/authlogout",true);
  xmlhttp.send();
  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
      var patt_logout = new RegExp(/successfully logged out/i);
      var patt_no_active = new RegExp(/no active session/i);
      var res1 = patt_logout.test(xmlhttp.responseText);
      var res2 = patt_no_active.test(xmlhttp.responseText);
      if(res1){
        chrome.notifications.create('id5',opt_logout_success,function () {
          console.log("logged out");
        });
        chrome.runtime.sendMessage({logout_success: true});
      }
      if(res2){
        chrome.notifications.create('id6',opt_logout_fail,function () {
          console.log("active session");
        });
        chrome.runtime.sendMessage({logout_success: false});
      }
      else if(!res1 && !res2){
        
        chrome.runtime.sendMessage({logout_unknown_error: true});
      }
    }
  }
}

function login() {
  chrome.storage.sync.get(null,function(data) {
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
      var patt_success = /congratulations/i;
      var patt_already = /already logged in/i;
      var patt_quota_over = /quota is over/i;
      var patt_error = /sorry/i;

      var login_success = patt_success.test(xmlhttp.responseText)
      var login_error = patt_error.test(xmlhttp.responseText);
      var quota_over = patt_quota_over.test(xmlhttp.responseText);
      var already_logged_in = patt_already.test(xmlhttp.responseText);

      if(login_success){
        chrome.notifications.create('id1',opt_login_success,function () {
          console.log("logged in");
        });
        chrome.runtime.sendMessage({login_success: true});
        return 0;
      }
      if(login_error){
        chrome.notifications.create('id2',opt_login_error,function () {
          console.log("error logging in");
        });
        chrome.runtime.sendMessage({login_success: false});
        return 1;
      }
      if(quota_over){
        chrome.notifications.create('id3',opt_quota_over,function () {
          console.log("quota over");
        });
        chrome.runtime.sendMessage({quota_over: true});
        return 2;
      }
      if(already_logged_in){
        chrome.notifications.create('id4',opt_already_logged_in,function () {
          console.log("already_logged_in");
        });
        chrome.runtime.sendMessage({already_logged_in: true});
        return 3;
      }
    };
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if(request.error == true){
        console.log("Incorrect cred, closing tab");
        chrome.tabs.query({url: "http://phc.prontonetworks.com/*"},function(tab) {
          var tab = tab[0];
          console.log(tab.id);
          chrome.tabs.remove(tab.id, function() { });
        });
      }
      if(request.login == true){
        console.log("logging in");
        login();
      }
      if(request.logout == true){
        console.log("logging out");
        logout();
      }
  });
