'use strict';

/**
 * # Panel
 *
 * This file handles all the JS on the panel itself.
 *
 * Available APIs:
 * - chrome.devtools.*
 * - chrome.extension.*
 */

const container = document.querySelector('#storage-items');
const clearButton = document.querySelector('#clear-button');
const refreshButton = document.querySelector('#refresh-button');
const messageContainer = document.querySelector('#message');

/**
 * This method updates the panel's UI.
 *
 * @method `updateMarkup`
 * @param {Object} storageItems
 */
const updateMarkup = function(storageItems) {
  let markup = '';
  let count = 0;

  for (let key in storageItems) {
    if (storageItems.hasOwnProperty(key)) {
      let value = storageItems[key];
      count++;

      try {
        item = JSON.parse(value);
      } catch (err) {
        console.warn(`Couldn't parse value for ${key}.`);
        item = value;
      }

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
};

/**
 * This method sends a message to background.js which then gets
 * passed on to the inspected page.
 *
 * @method `sendObjectToInspectedPage`
 * @param {Object} message
 */
function sendObjectToInspectedPage(message) {
  message.tabId = chrome.devtools.inspectedWindow.tabId;
  chrome.extension.sendMessage(message);
}

refreshButton.addEventListener('click', () => {
  sendObjectToInspectedPage({
    action: 'script',
    content: 'content_script.js'
  });
});

clearButton.addEventListener('click', () => {
  sendObjectToInspectedPage({
    msg: 'clear'
  });
});

/**
 * This method creates a communication channel between the panel and the
 * background page.
 *
 * @method `createChannel`
 */
(function createChannel() {
  // Create channel with background.js
  let port = chrome.extension.connect({ name: 'lsv' });

  // Listen to messages from background.js
  port.onMessage.addListener((message) => {
    updateMarkup(message.content);
  });
})();

sendObjectToInspectedPage({
  action: 'script',
  content: 'content_script.js'
});
