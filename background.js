/*
**  Available APIs:
**    chrome.tabs.*
**    chrome.extension.*
*/

chrome.extension.onConnect.addListener(function(port) {
  let extensionListener = function(message, sender, sendResponse) {
    if (message.tabId && message.content) {
      chrome.tabs.executeScript(message.tabId, { file: message.content });
    } else {
      port.postMessage(message);
    }
    sendResponse(message);
  }

  // Listens to messages sent from the panel
  chrome.extension.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener(function(disconnectedPort) {
    chrome.extension.onMessage.removeListener(extensionListener);
  });
});
