/* eslint-disable no-undef */
chrome.devtools.panels.create('Local Storage', 'icon.png', 'panel.html', (panel) => {
  console.info(window.localStorage.length);
});
