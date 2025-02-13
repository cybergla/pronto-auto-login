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
  message: "You can browse the web normally",
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

function logout() {
  fetch('http://phc.prontonetworks.com/cgi-bin/authlogout', {
    method: 'GET',
    mode: 'cors',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  }).then(responseText => {
    var patt_logout = new RegExp("successfully logged out", "i");
    var patt_no_active = new RegExp("no active session", "i");

    if (patt_logout.test(responseText)) {
      showNotification('id5', opt_logout_success);
      chrome.runtime.sendMessage({ logout_success: true });
    } else if (patt_no_active.test(responseText)) {
      showNotification('id6', opt_logout_fail);
      chrome.runtime.sendMessage({ logout_success: false });
    } else {
      chrome.runtime.sendMessage({ logout_unknown_error: true });
    }
  }).catch(error => {
    console.error('There was a problem with the logout fetch operation:', error);
  });
}

function showNotification(id, options) {
  chrome.notifications.create(id, options, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('Notification error:', chrome.runtime.lastError);
    } else {
      console.log('Notification shown successfully:', notificationId);
    }
  });
}

function login(firstRun, formUser, formPassword) {
  firstRun || (firstRun = false);
  chrome.storage.sync.get(null, function (data) {

    var username = (typeof formUser === undefined) ? data.username : formUser;
    var password = (typeof formPassword === undefined) ? data.password : formPassword;

    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 7000);

    fetch("http://phc.prontonetworks.com/cgi-bin/authlogin", {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      body: "userId=" + username + "&password=" + password + "&serviceName=ProntoAuthentication&Submit22=Login",
      mode: 'cors',
      signal: signal
    }).then(response => {
      if (!response.ok) {
        console.error(response.text());
        throw new Error('Network response was not ok');
      }
      return response.text();
    }).then(responseText => {
      var patt_success = /congratulations/i;
      var patt_already = /already logged in/i;
      var patt_quota_over = /quota is over/i;
      var patt_sorry = /sorry/i;
      var patt_tryAgain = /try again/i;

      if (patt_success.test(responseText)) {
        showNotification('id6', opt_login_success);
        chrome.runtime.sendMessage({ login_success: true });
        return 0;
      } else if (patt_quota_over.test(responseText)) {
        showNotification('id3', opt_quota_over);
        chrome.runtime.sendMessage({ quota_over: true });
        return 2;
      } else if (patt_sorry.test(responseText) && patt_tryAgain.test(responseText)) {
        showNotification('id2', opt_login_error);
        chrome.runtime.sendMessage({ login_success: false });
        return 1;
      } else if (patt_already.test(responseText)) {
        if (!firstRun) {
          showNotification('id4', opt_already_logged_in);
          chrome.runtime.sendMessage({ already_logged_in: true });
          return 3;
        }
      } else {
        console.log('Unknown error');
      }
    }).catch(error => {
      console.error('Error during fetch operation:', error);
      if (error.name === 'AbortError') {
        chrome.runtime.sendMessage({ login_timed_out: true });
        showNotification('id_timeout', opt_login_timeout);
      }
    }).finally(() => {
      clearTimeout(timeoutId);
    });
  });
}

chrome.webRequest.onErrorOccurred.addListener(function (details) {
  if (details.error == 'net::ERR_INTERNET_DISCONNECTED') {
    console.log('Wifi Disconnected', details);
    chrome.notifications.create('id_no_wifi', opt_no_wifi, function () {
      console.log("No wifi notification");
    });
  }
  if (details.error == 'net::ERR_NETWORK_CHANGED') {
    console.log('Network Changed');
    chrome.notifications.create('id_net_changed', opt_network_changed, function () {
      console.log("network changed notification");
    });
  }
  if (details.error == 'net::ERR_NAME_NOT_RESOLVED') {
    console.log('Name not resolved');
    chrome.notifications.create('id_name_not_resolved', opt_name_not_resolved, function () {
      console.log("name not resolved notification");
    });
  }
  chrome.runtime.sendMessage({ network_error: true, status: "Network error" });
}, {
  urls: ['*://*/*'],
  types: ['xmlhttprequest']
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.error == true) {
      console.log("Incorrect cred, closing tab");
      chrome.tabs.query({ url: "http://phc.prontonetworks.com/*" }, function (tab) {
        var tab = tab[0];
        console.log(tab.id);
        chrome.tabs.remove(tab.id, function () { });
      });
    }
    if (request.login == true) {
      console.log("logging in");
      login(false, request.username, request.password);
    }
    if (request.logout == true) {
      console.log("logging out");
      logout();
    }
  });