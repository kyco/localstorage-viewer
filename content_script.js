/* eslint-disable no-undef */

localStorageItems = localStorage.length;

chrome.extension.onMessage.addListener((message) => {
  if (message.msg === 'clear') {
    localStorage.clear();
  }
});

chrome.extension.sendMessage({
  type: 'init',
  content: localStorage
}, function(message) {});

window.addEventListener('storage', function(storageEvent) {
  chrome.extension.sendMessage({
    type: 'update',
    content: localStorage
  }, function(message) {});
}, false);

storageChangeInterval = setInterval(() => {
  if (localStorageItems !== localStorage.length) {
    localStorageItems = localStorage.length;
    chrome.extension.sendMessage({
      type: 'update',
      content: localStorage
    }, function(message) {});
  }
}, 500);
