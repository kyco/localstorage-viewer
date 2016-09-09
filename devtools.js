'use strict';

/**
 * # Dev Tools
 *
 * This file is the bootstrap file so to speak. It will create the panel and
 * allow for the other parts of the extension to function.
 *
 * Available APIs:
 * - chrome.app.*
 * - chrome.devtools.*
 * - chrome.extension.*
 * - chrome.i18n.*
 * - chrome.runtime.*
 */

chrome.devtools.panels.create('Local Storage', null, 'panel.html', (panel) => {
  panel.onShown.addListener(function(extensionPanel) {
    extensionPanel.sendObjectToInspectedPage({
      action: 'script',
      content: 'content_script.js'
    });
  });
});
