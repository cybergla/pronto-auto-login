var loginURL = "http://phc.prontonetworks.com"; //URL for pronto login

chrome.runtime.onMessage.addListener( function (message, sender, sendResponse) {
  if (message.clicked) { //from the login now button
    chrome.tabs.create({url: loginURL, active: false}, function () {
      console.log("login opened");
    });
  }
});

chrome.runtime.onMessage.addListener( function (message, sender, sendResponse) {
  if (message.error){   //for incorrect credentials
    console.log("error message");
    chrome.tabs.query({url: "http://phc.prontonetworks.com/*"},function(tab) {
      var tab = tab[0];
      console.log(tab.id);
      chrome.tabs.remove(tab.id, function() { });
    });
  }
});

chrome.runtime.onStartup.addListener(function () {
  var isOpen = false;
  chrome.tabs.query({url: "http://phc.prontonetworks.com/*"},function(tabs) {
    var tab = tabs[0];
    console.log(tab.id);
    isOpen = true;
  });
  if(isOpen ==  false){
    chrome.tabs.create({url: loginURL, active: false}, function () {
      console.log("login opened");
    });
  }
});
