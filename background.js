'use strict';

/**
 * # Background Page
 *
 * This file handles all the JS which runs on the background page. The background
 * page is a HTML file which automatically gets inserted into the current context
 * and is responsible for establishing communication between the inspected page
 * and the panel.
 *
 * Available APIs:
 * - chrome.app.*
 * - chrome.extension.*
 * - chrome.i18n.*
 * - chrome.management.*
 * - chrome.permissions.*
 * - chrome.runtime.*
 * - chrome.tabs.*
 * - chrome.windows.*
 */

chrome.extension.onConnect.addListener(function(port) {
  let extensionListener = function(message, sender, sendResponse) {
    if (message.tabId && message.content) {
      chrome.tabs.executeScript(message.tabId, { file: message.content });
    } else if (message.msg) {
      chrome.tabs.sendMessage(message.tabId, message, sendResponse);
    } else {
      port.postMessage(message);
    }
    sendResponse(message);
  };

  // Listens to messages sent from the panel
  chrome.extension.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener(function(disconnectedPort) {
    chrome.extension.onMessage.removeListener(extensionListener);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.executeScript(tabId, { file: 'content_script.js' });
});
