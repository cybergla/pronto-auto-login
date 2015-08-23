
document.addEventListener('DOMContentLoaded', function() {
  var submitButton = document.getElementById('submit_form');
  submitButton.addEventListener('click', function() {
        var f = document.getElementById('form1');
        username= f.elements['username'].value;
        password= f.elements['password'].value;

        chrome.storage.sync.set({"username": username ,"password": password}, function () {
        console.log("settings saved");
        });

        
    });
  }, false);
