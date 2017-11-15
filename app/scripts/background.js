// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

chrome.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
})

chrome.browserAction.setBadgeText({
  text: `'Allo`
})

console.log(`'Allo 'Allo! Event Page for Browser Action`)

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.debugger.attach({tabId:tab.id}, version,
      onAttach.bind(null, tab.id));
});

var version = "1.0";
var window_id = 0;

function onAttach(tabId) {
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
    return;
  }

  chrome.windows.create(
      {url: "./pages/headers.html?" + tabId, type: "popup", left:0, top: window.screen.height - 400, width: window.screen.availWidth, height: 400},
      (_window) => {window_id = _window.id}
    );
}

chrome.webNavigation.onCommitted.addListener(function(details){
  if (details.transitionType != 'auto_subframe') {
    const app_window = chrome.extension.getViews({windowId: window_id})
    if (app_window.length > 0) {
      console.log("Reloading")
      app_window[0].document.querySelector('#container').innerHTML = ""
    }
  }
});

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   console.log(`${JSON.stringify(activeInfo)}`)
//   chrome.debugger.attach({tabId:activeInfo.tabId}, version)
// });