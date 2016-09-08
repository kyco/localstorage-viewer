/*
**  Available APIs:
**    chrome.devtools.*
**    chrome.extension.*
*/

chrome.devtools.panels.create('Local Storage', null, 'panel.html', (panel) => {
  console.log('devtools.js > panel "Local Storage" created', panel);

  panel.onShown.addListener(function(extensionPanel) {
    console.log('devtools.js > `panel.onShown()...`', extensionPanel.localStorage);
  });
});
