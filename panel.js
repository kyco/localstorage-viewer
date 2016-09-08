/*
**  Available APIs:
**    chrome.devtools.*
**    chrome.extension.*
*/

(function createChannel() {
  // Create a port with background page for continous message communication
  let port = chrome.extension.connect({
    name: 'Sample Communication' // Given a Name
  });

  // Listen to messages from the background page
  port.onMessage.addListener(function(message) {
    console.log('message', message);
    let container = document.querySelector('#storage-items');

    let markup = '';
    for (let key in message.content) {
      if (message.content.hasOwnProperty(key)) {
        let value = message.content[key];
        let item;

        try {
          item = JSON.parse(value);
        } catch (err) {
          item = value;
        }

        console.log('item', item);

        markup += `
          <div class="storage-item">
            <div class="key">${key}</div>
            <div class="value">${value}</div>
            <div class="clear"></div>
          </div>
        `;
      }
    }

    if (markup) {
      container.innerHTML = markup;
    } else {
      container.innerHTML = 'localStorage is empty!';
    }
  });
})();

function sendObjectToInspectedPage(message) {
  message.tabId = chrome.devtools.inspectedWindow.tabId;
  chrome.extension.sendMessage(message);
}

sendObjectToInspectedPage({
  action: 'script',
  content: 'content_script.js'
});
