chrome.runtime.onStartup.addListener(function () {
  login(true);
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

var opt_login_timeout = {
  type: "basic",
  title: "Request Timed Out",
  message: "Please check your connection, or try again later",
  iconUrl: "icon128.png"
}

var opt_no_wifi = {
  type: "basic",
  title: "Wifi Disconnected",
  message: "Please check your connection",
  iconUrl: "icon128.png"
}

var opt_network_changed = {
  type: "basic",
  title: "Network Changed",
  message: "Please try again later",
  iconUrl: "icon128.png"
}

var opt_name_not_resolved = {
  type: "basic",
  title: "Network Error",
  message: "Try disconnecting and reconnecting from VOLSBB",
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
      //var res1 = patt_logout.test(xmlhttp.responseText);
      //var res2 = patt_no_active.test(xmlhttp.responseText);
      if(patt_logout.test(xmlhttp.responseText)){
        chrome.notifications.create('id5',opt_logout_success,function () {
          console.log("logged out");
        });
        chrome.runtime.sendMessage({logout_success: true});
      }
      else if(patt_no_active.test(xmlhttp.responseText)){
        chrome.notifications.create('id6',opt_logout_fail,function () {
          console.log("active session");
        });
        chrome.runtime.sendMessage({logout_success: false});
      }
      else {
        chrome.runtime.sendMessage({logout_unknown_error: true});
      }
    }
  }
}

function login(firstRun) {
  firstRun || (firstRun = false);
  chrome.storage.sync.get(null,function(data) {
    var username = data.username;
    var password = data.password;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST","http://phc.prontonetworks.com/cgi-bin/authlogin",true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.timeout = 7000;
    xmlhttp.ontimeout = function () {
      console.log('Request Timed out');
      chrome.runtime.sendMessage({login_timed_out: true});
      chrome.notifications.create('id_timeout',opt_login_timeout,function () {
        console.log("Req timeout notification");
      });
    }
    xmlhttp.send("userId="+username+"&password="+password+"&serviceName=ProntoAuthentication&Submit22=Login");
    xmlhttp.onreadystatechange = function () {
      if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
          var patt_success = /congratulations/i;
          var patt_already = /already logged in/i;
          var patt_quota_over = /quota is over/i;
          var patt_error = /sorry/i;
          //var login_success = patt_success.test(xmlhttp.responseText)
          //var login_error = patt_error.test(xmlhttp.responseText);
          //var quota_over = patt_quota_over.test(xmlhttp.responseText);
          //var already_logged_in = patt_already.test(xmlhttp.responseText);
          if(patt_success.test(xmlhttp.responseText)){
            chrome.notifications.create('id6',opt_login_success,function () {
            });
            chrome.runtime.sendMessage({login_success: true});
            return 0;
          }
          else if(patt_quota_over.test(xmlhttp.responseText)){
            chrome.notifications.create('id3',opt_quota_over,function () {
              console.log("quota over");
            });
            chrome.runtime.sendMessage({quota_over: true});
            return 2;
          }
          else if(patt_error.test(xmlhttp.responseText)){
            chrome.notifications.create('id2',opt_login_error,function () {
              console.log("error logging in");
            });
            chrome.runtime.sendMessage({login_success: false});
            return 1;
          }
          else if(patt_already.test(xmlhttp.responseText)){
            if(!firstRun){
              chrome.notifications.create('id4',opt_already_logged_in,function () {
                console.log("already_logged_in");
              });
              chrome.runtime.sendMessage({already_logged_in: true});
              return 3;
            }
          }
          else {
            console.log('Unknown error');
          }
      }
    };
  });
}

chrome.webRequest.onErrorOccurred.addListener(function(details) {
    if (details.error == 'net::ERR_INTERNET_DISCONNECTED') {
      console.log('Wifi Disconnected',details);
      chrome.notifications.create('id_no_wifi',opt_no_wifi,function () {
        console.log("No wifi notification");
      });
    }
    if(details.error == 'net::ERR_NETWORK_CHANGED'){
      console.log('Network Changed');
      chrome.notifications.create('id_net_changed',opt_network_changed,function () {
        console.log("network changed notification");
      });
    }
    if(details.error == 'net::ERR_NAME_NOT_RESOLVED'){
      console.log('Name not resolved');
      chrome.notifications.create('id_name_not_resolved',opt_name_not_resolved,function () {
        console.log("name not resolved notification");
      });
    }
    chrome.runtime.sendMessage({network_error: true, status: "Network error"});
}, {
    urls: ['*://*/*'],
    types: ['xmlhttprequest']
});

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
