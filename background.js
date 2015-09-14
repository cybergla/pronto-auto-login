chrome.runtime.onStartup.addListener(function () {
  login();
});

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
        return 0;
      }
      if(login_error){
        alert("Incorrect credentials");
        return 1;
      }
      if(quota_over){
        alert("Your quota is over");
        return 2;
      }
      if(already_logged_in){
        console.log("Already Logged in");
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
  });
