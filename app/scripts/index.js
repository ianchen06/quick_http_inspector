import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { composeWithDevTools } from 'remote-redux-devtools';

import { addRequest, addResponse } from './actions'
import appReducers from './reducers'
import App from './components/App'

const tabId = parseInt(window.location.search.substring(1));

// Middleware
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}

let store = createStore(
  appReducers,
  composeWithDevTools(
    applyMiddleware(
      logger
    )
  )
)

function onEvent(debuggeeId, message, params) {
  if (tabId != debuggeeId.tabId)
    return;

  if (message == "Network.requestWillBeSent") {
    if (!params.request.url.startsWith('data')) {
      console.log(`[${params.requestId}]request`)
      store.dispatch(addRequest(params))
    }

    if (params.redirectResponse) {
      console.log(`[${params.requestId}]redirect`)
      store.dispatch(addResponse(params))
    }
  } else if (message == "Network.responseReceived") {
      console.log(`[${params.requestId}]response`)
      store.dispatch(addResponse(params))
  }
}

window.addEventListener("load", () => {
  chrome.debugger.sendCommand({ tabId: tabId }, "Network.enable");
  chrome.debugger.onEvent.addListener(onEvent);
});

window.addEventListener("unload", () => {
  chrome.debugger.detach({ tabId: tabId });
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)