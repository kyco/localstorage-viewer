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
// const tabsButton = document.querySelector('#tabs-button');
// const beautifyButton = document.querySelector('#beautify-button');
const messageContainer = document.querySelector('#message');

// let TABS_ACTIVE = false;
// let BEAUTIFY_ACTIVE = false;

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
        <div id="storage-item-${count}" class="storage-item ${count % 2 === 0 ? 'even' : 'odd'}">
          <div class="key">
            <button id="delete-key-${count}">&times;</button>
            <span id="key-${count}">${key}</span>
          </div>
          <div id="value-${count}" class="value">${value}</div>
          <div class="clear"></div>
        </div>
      `;
    }
  }

  if (markup) {
    container.innerHTML = markup;
    messageContainer.innerHTML = '';
    while (count > 0) {
      (function(i) {
        let removeButton = document.querySelector(`#delete-key-${i}`);
        removeButton.addEventListener('click', () => {
          chrome.extension.sendMessage({
            tabId: chrome.devtools.inspectedWindow.tabId,
            type: 'clearLocalStorageItem',
            itemKey: document.querySelector(`#key-${i}`).innerHTML
          });
        });
      })(count);
      count--;
    }
  } else {
    container.innerHTML = '';
    messageContainer.innerHTML = 'Local storage is empty.';
  }

  if (message.type !== 'getLocalStorageSilent' && !header.classList.contains('updated')) {
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

// tabsButton.addEventListener('click', function() {
//   TABS_ACTIVE = !TABS_ACTIVE;
//   tabsButton.firstChild.checked = TABS_ACTIVE;
// });

// beautifyButton.addEventListener('click', () => {
//   BEAUTIFY_ACTIVE = !BEAUTIFY_ACTIVE;
//   beautifyButton.firstChild.checked = BEAUTIFY_ACTIVE;

//   if (BEAUTIFY_ACTIVE) {
//     container.classList.add('beautify');
//     let items = document.querySelectorAll('[id^="value-"]');
//     for (let i = 0, n = items.length; i < n; i++) {
//       let item = document.querySelector(`[id="value-${i + 1}"]`);
//       item.innerHTML = JSON.stringify(JSON.parse(item.innerHTML), null, 2);
//     }
//   } else {
//     container.classList.remove('beautify');
//   }
// });

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
  type: 'getLocalStorageSilent'
}, (response) => {
  handleResponse(response);
});
