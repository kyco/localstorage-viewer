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

let CACHED_STORAGE = [];
let localStorageItems = 0;
const intervalTimeout = 500;

const setCachedStorage = function(storage) {
  CACHED_STORAGE = [];
  for (let i = 0, n = localStorage.length; i < n; i++) {
    CACHED_STORAGE.push({
      key: localStorage.key(i),
      value: localStorage.getItem(localStorage.key(i))
    });
  }
};

const runDiffOnStorage = function(storage) {
  let diff = 0;
  for (let i = 0, n = localStorage.length; i < n; i++) {
    if (localStorage.getItem(localStorage.key(i)).length !== CACHED_STORAGE[i].value.length) {
      diff++;
    }
  }

  if (diff) {
    chrome.extension.sendMessage({
      type: 'update',
      data: localStorage
    });
    setCachedStorage(localStorage);
  }
};

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
  setCachedStorage(localStorage);
});

window.addEventListener('storage', (storageEvent) => {
  chrome.extension.sendMessage({
    type: 'update',
    data: localStorage
  });
  setCachedStorage(localStorage);
}, false);

let storageChangeInterval = setInterval(() => {
  if (localStorageItems !== localStorage.length) {
    localStorageItems = localStorage.length;
    if (localStorageItems) {
      chrome.extension.sendMessage({
        type: 'update',
        data: localStorage
      });
      setCachedStorage(localStorage);
    }
  } else {
    runDiffOnStorage(localStorage);
  }
}, intervalTimeout);
