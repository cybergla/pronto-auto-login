chrome.browserAction.onClicked.addListener(function (activeTab) {
  var newURL = "http://phc.prontonetworks.com";
  var d = window.open(newURL);
});
