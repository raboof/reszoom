const normalDpiZoom = 1;
const highDpiZoom = 2;

function zoomLevelSet() {
  if (chrome.runtime.lastError) {
    console.log('failed to set zoom level', chrome.runtime.lastError.message);
  }
}

function updateZoomLevelsTo(windowId, newZoom) {
  console.log('Zooming to level', newZoom);
  chrome.tabs.getAllInWindow(windowId, tabs => {
    console.log('found ' + tabs.length + ' tabs');
    for (var i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      console.log('found tab ' + tab.id);
      if (tab.id) {
        chrome.tabs.getZoom(tab.id, currentZoom => {
          console.log('current zoom factor for tab ' + tab.id + ': ' + currentZoom);
          if (currentZoom != newZoom && 
              (currentZoom == highDpiZoom || currentZoom == normalDpiZoom)) {
            console.log('updating to', newZoom);

            // This can produce errors in the console for 'chrome://' tabs,
            // but we don't want to require the permissions to see the tab URL,
            // so we can't predict this:
            chrome.tabs.setZoom(tab.id, newZoom, zoomLevelSet);
          }
        });
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
  return screen[0];
}

function updateZoomLevelsForWindow(window, screens) {
  const screen = findScreen(window, screens);
  if (screen.bounds && screen.bounds.width > 2800) {
    console.log('HiDPI');
    updateZoomLevelsTo(window.id, highDpiZoom);
  } else {
    console.log('Normal DPI');
    updateZoomLevelsTo(window.id, normalDpiZoom);
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
