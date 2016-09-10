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

chrome.extension.onConnect.addListener((port) => {
  const extensionListener = function(message, sender, callback) {
    switch (message.type) {
      case 'update':
        port.postMessage(message);
        break;
      default:
        callback(message);
        chrome.tabs.sendMessage(message.tabId, message, (response) => {
          port.postMessage(response);
        });
    }
  };

  chrome.extension.onMessage.addListener(extensionListener);

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.tabs.sendMessage(tabId, {
      type: 'getLocalStorageSilent'
    }, (response) => {
      port.postMessage(response);
    });
  });

  chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.sendMessage(activeInfo.tabId, {
      type: 'getLocalStorageSilent'
    }, (response) => {
      port.postMessage(response);
    });
  });

  port.onDisconnect.addListener((disconnectedPort) => {
    chrome.extension.onMessage.removeListener(extensionListener);
  });
});
