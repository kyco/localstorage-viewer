/* eslint-disable no-undef */
/*
**  Available APIs:
**    chrome.devtools.*
**    chrome.extension.*
*/

const container = document.querySelector('#storage-items');
const messageContainer = document.querySelector('#message');
const clearButton = document.querySelector('#clear-button');
const refreshButton = document.querySelector('#refresh-button');

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

// MAIN

(function createChannel() {
  // Create a port with background page for continous message communication
  let port = chrome.extension.connect({
    name: 'Sample Communication' // Given a Name
  });

  // Listen to messages from the background page
  port.onMessage.addListener(function(message) {
    updateMarkup(message.content);
  });
})();

sendObjectToInspectedPage({
  action: 'script',
  content: 'content_script.js'
});
