'use strict';

/**
 * # Panel
 *
 * This file handles all the JS on the panel itself.
 *
 * Available APIs:
 * - chrome.app.*
 * - chrome.devtools.*
 * - chrome.extension.*
 * - chrome.i18n.*
 * - chrome.runtime.*
 */

const header = document.querySelector('header');
const container = document.querySelector('#storage-items');
const clearButton = document.querySelector('#clear-button');
const refreshButton = document.querySelector('#refresh-button');
const messageContainer = document.querySelector('#message');

/**
 * This method updates the panel's UI.
 *
 * @method `handleResponse`
 * @param {Object} message
 */
function handleResponse(message) {
  if (!(message && message.data)) {
    return false;
  }

  let markup = '';
  let count = 0;

  for (let key in message.data) {
    if (message.data.hasOwnProperty(key)) {
      let value = message.data[key];
      count++;

      markup += `
        <div class="storage-item ${count % 2 === 0 ? 'even' : 'odd'}">
          <div class="key">${key}</div>
          <div class="value">${value}</div>
          <div class="clear"></div>
        </div>
      `;
    }
  }

  if (markup) {
    container.innerHTML = markup;
    messageContainer.innerHTML = '';
  } else {
    container.innerHTML = '';
    messageContainer.innerHTML = 'Local storage is empty.';
  }

  if (!header.classList.contains('updated')) {
    header.classList.add('updated');
    setTimeout(() => {
      header.classList.remove('updated');
    }, 225);
  }
}

clearButton.addEventListener('click', () => {
  chrome.extension.sendMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    type: 'clearLocalStorage'
  });
});

refreshButton.addEventListener('click', () => {
  chrome.extension.sendMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    type: 'getLocalStorage'
  });
});

/**
 * This method creates a communication channel between the panel and the
 * background page.
 *
 * @method `createChannel`
 */
(function createChannel() {
  let port = chrome.extension.connect({ name: 'lsv' });

  port.onMessage.addListener((message) => {
    handleResponse(message);
  });
})();

chrome.extension.sendMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  type: 'getLocalStorage'
}, (response) => {
  handleResponse(response);
});
