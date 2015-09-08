chrome.runtime.onStartup.addListener(function () {
  chrome.browserAction.setIcon({
          path: './icon16.png'
      });
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
        setTimeout(function() { alert("Logged in successfully"); }, 700);
      }
      if(login_error){
        setTimeout(function() { alert("Incorrect credentials"); }, 700);
      }
      if(quota_over){
        setTimeout(function() { alert("Your quota is over"); }, 700);
      }
      if(already_logged_in){
        //setTimeout(function() { alert("Already logged in"); }, 700); //annoying, no need
        console.log("Already Logged in");
      }
    };
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    if(request.setIconColor == true){
      chrome.browserAction.setIcon({path: './icon16.png'});
    }
    if(request.setIconBw ==  true){
      chrome.browserAction.setIcon({path: './ic_pronto_bw_16.png'});
    }
  }
);
