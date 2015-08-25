chrome.runtime.onMessage.addListener( function (message, sender, sendResponse) {
  if (message.clicked) {
    var newURL = "http://phc.prontonetworks.com";
    chrome.tabs.create({url: newURL, active: false}, function () {
      console.log("login opened");
    });
  }
});


chrome.runtime.onMessage.addListener( function (message, sender, sendResponse) {
  if (message.error){
    console.log("error message");
    chrome.tabs.query({url: "http://phc.prontonetworks.com/*"},function(tab) {
      var tab = tab[0];
      console.log(tab.id);
      chrome.tabs.remove(tab.id, function() { });
    });
  }
});
