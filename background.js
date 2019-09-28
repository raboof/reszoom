let normalDpiZoom = 1;
let highDpiZoom = 1.25 ;
let applyZoom = "false";

chrome.storage.local.get([
  'normalDpiZoomValue',
  'highDpiZoomValue',
  'applyZoomValue'
], function(data) {
  if (data.normalDpiZoomValue == null){
    normalDpiZoom = 1
    chrome.storage.local.set({
      'normalDpiZoomValue': normalDpiZoom
    }, function(){
      console.log('Normal DPI Zoom Value is set to ' + normalDpiZoom);
    });
  } else {
    normalDpiZoom = Number(data.normalDpiZoomValue)
    chrome.storage.local.set({
      'normalDpiZoomValue': normalDpiZoom
    }, function(){
      console.log('Normal DPI Zoom Value is set to ' + normalDpiZoom);
    });
  }

  if (data.highDpiZoomValue == null){
    highDpiZoom = 1.25
    chrome.storage.local.set({
      'highDpiZoomValue': highDpiZoom
    }, function(){
      console.log('High DPI Zoom Value is set to ' + highDpiZoom);
    });
  } else {
    highDpiZoom = Number(data.highDpiZoomValue)
    chrome.storage.local.set({
      'highDpiZoomValue': highDpiZoom
    }, function(){
      console.log('High DPI Zoom Value is set to ' + highDpiZoom);
    });
  }

  if (typeof data.applyZoomValuev === 'undefined' && data.applyZoomValuev === null) {
    applyZoom = "false"
    chrome.storage.local.set({
      'applyZoomValue': applyZoom
    }, function(){
      console.log('applyZoomValue is set to ' + applyZoom);
    });
  } else {
    applyZoom = data.applyZoomValue
    chrome.storage.local.set({
      'applyZoomValue': applyZoom
    }, function(){
      console.log('applyZoomValue is set to ' + applyZoom);
    });
  }
});


function zoomSettingsSet() {
  if (chrome.runtime.lastError) {
    console.log('failed to set zoom settings', chrome.runtime.lastError.message);
  }
}

function zoomLevelSet() {
  if (chrome.runtime.lastError) {
    console.log('failed to set zoom level', chrome.runtime.lastError.message);
  }
}

function updateZoomLevelsForTabTo(tabId, newZoom) {
  chrome.tabs.getZoom(tabId, currentZoom => {
    console.log('current zoom factor for tab ' + tabId + ': ' + currentZoom);
    if (currentZoom != newZoom &&
       (currentZoom == highDpiZoom || currentZoom == normalDpiZoom)) {
      console.log('updating to', newZoom);

      // This can produce errors in the console for 'chrome://' tabs,
      // but we don't want to require the permissions to see the tab URL,
      // so we can't predict this:
      chrome.tabs.setZoom(tabId, newZoom, zoomLevelSet);
      chrome.tabs.setZoomSettings(tabId, { scope: 'per-tab' }, zoomSettingsSet);
    }
    // apply zoom regardless of the actual tab zoom
    if (applyZoom == 'true' && newZoom != currentZoom &&
       (currentZoom != highDpiZoom || currentZoom != normalDpiZoom)) {
      console.log('############ applyZoom:' + applyZoom + ' updating ' + currentZoom + 'to', newZoom);
      chrome.tabs.setZoom(tabId, newZoom, zoomLevelSet);
      chrome.tabs.setZoomSettings(tabId, { scope: 'per-tab' }, zoomSettingsSet);
    }
  });
}

function updateZoomLevelsForWindowTo(windowId, newZoom) {
  console.log('Zooming to level', newZoom);
  chrome.tabs.getAllInWindow(windowId, tabs => {
    console.log('found ' + tabs.length + ' tabs');
    for (var i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      console.log('found tab ' + tab.id);
      if (tab.id) {
        updateZoomLevelsForTabTo(tab.id, newZoom);
      }
    }
  });
}

function findScreen(window, screens) {
  for (var i = 0; i < screens.length; i++) {
    const screen = screens[i];
    if (window.left >= screen.bounds.left
      && window.left <= screen.bounds.left + screen.bounds.width
      && window.top >= screen.bounds.top
      && window.top <= screen.bounds.top + screen.bounds.height) {
      return screen;
    }
  }
  return screens[0];
}

function updateZoomLevelsForWindow(window, screens) {
  const screen = findScreen(window, screens);
  if (screen.bounds && screen.bounds.width > 2800) {
    console.log('HiDPI');
    updateZoomLevelsForWindowTo(window.id, highDpiZoom);
  } else {
    console.log('Normal DPI');
    updateZoomLevelsForWindowTo(window.id, normalDpiZoom);
  }
}

function updateZoomLevels() {
  chrome.system.display.getInfo(screens => {
    chrome.windows.getAll(windows => {
      console.log('updating zoom levels for ' + windows.length + ' windows');
      for (var i = 0; i < windows.length; i++) {
        updateZoomLevelsForWindow(windows[i], screens)
      }
    });
  });
}

console.log('main code');
updateZoomLevels();

chrome.system.display.onDisplayChanged.addListener(() => {
  console.log('displayChanged');
  updateZoomLevels();
});
chrome.tabs.onUpdated.addListener(() => {
  console.log('tabsUpdated');
  updateZoomLevels();
});
chrome.windows.onFocusChanged.addListener(() => {
  console.log('focusChanged');
  updateZoomLevels();
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({
      'normalDpiZoomValue': normalDpiZoom,
      'highDpiZoomValue': highDpiZoom,
      'applyZoomValue': applyZoom,
    }, function() {
    console.log("The normal DPI zoom == " + normalDpiZoom);
    console.log("The normal DPI zoom == " + highDpiZoom);
    console.log("Apply zoom for customized tabs  == " + applyZoom);
  });
});