'use strict';

/**
 * # Content Script
 *
 * This file get's injected into the inspected tab.
 *
 * Available APIs:
 * - chrome.app.*
 * - chrome.extension.*
 * - chrome.i18n.*
 * - chrome.runtime.*
 */

let localStorageItems = 0;
const intervalTimeout = 500;

chrome.extension.onMessage.addListener((message, sender, callback) => {
  switch (message.type) {
    case 'getLocalStorage':
    case 'getLocalStorageSilent':
      message.data = localStorage;
      break;
    case 'clearLocalStorage':
      localStorage.clear();
      message.data = localStorage;
      break;
    case 'clearLocalStorageItem':
      localStorage.removeItem(message.itemKey);
      message.data = localStorage;
      break;
    // no default
  }
  callback(message);
});

window.addEventListener('storage', (storageEvent) => {
  chrome.extension.sendMessage({
    type: 'update',
    content: localStorage
  });
}, false);

let storageChangeInterval = setInterval(() => {
  if (localStorageItems !== localStorage.length) {
    localStorageItems = localStorage.length;
    if (localStorageItems) {
      chrome.extension.sendMessage({
        type: 'update',
        data: localStorage
      });
    }
  }
}, intervalTimeout);
