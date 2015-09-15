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

var opt_alrady_logged_in = {
  type: "basic",
  title: "Alrady logged in",
  message: "You can browser the web normally",
  iconUrl: "icon128.png"
}

var opt_quota_over = {
  type: "basic",
  title: "Quota over",
  message: "Sorry, your free quota is over :(",
  iconUrl: "icon128.png"
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
        chrome.notifications.create('id1',opt_quota_over,function () {
          console.log("quota over");
        });
        chrome.runtime.sendMessage({quota_over: true});
        return 2;
      }
      if(already_logged_in){
        chrome.notifications.create('id1',opt_alrady_logged_in,function () {
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
  });
