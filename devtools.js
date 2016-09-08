/* eslint-disable no-undef */
/*
**  Available APIs:
**    chrome.devtools.*
**    chrome.extension.*
*/

chrome.devtools.panels.create('Local Storage', null, 'panel.html', (panel) => {
  panel.onShown.addListener(function(extensionPanel) {
    extensionPanel.sendObjectToInspectedPage({
      action: 'script',
      content: 'content_script.js'
    });
  });
});
