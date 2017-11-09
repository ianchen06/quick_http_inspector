// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// import React from 'react';
// import ReactDOM from 'react-dom';
// import Immutable from 'immutable';

// ReactDOM.render(
//   <h1>Hello, world!</h1>,
//   document.getElementById('root')
// );
var tabId = parseInt(window.location.search.substring(1));

window.addEventListener("load", function() {
  chrome.debugger.sendCommand({tabId:tabId}, "Network.enable");
  chrome.debugger.onEvent.addListener(onEvent);
});

window.addEventListener("unload", function() {
  chrome.debugger.detach({tabId:tabId});
});

var requests = {};

function lowerKey(obj) {
  let key, keys = Object.keys(obj);
  let n = keys.length;
  let newobj={}
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = obj[key];
  }
  return newobj
}

function onEvent(debuggeeId, message, params) {
  if (tabId != debuggeeId.tabId)
    return;

  if (message == "Network.requestWillBeSent") {
    //console.log(`[DEBUG] params is ${JSON.stringify(params,null,4)}`)
    //console.log(`[DEBUG] ${JSON.stringify(params.request.headers['Content-Type'])}`)
    console.log(`[requestId] ${JSON.stringify(params.requestId)}`)
    
    var requestDiv = requests[params.requestId];
    if (!requestDiv) {
      var requestDiv = document.createElement("div");
      requestDiv.className = "request";
      requests[params.requestId] = requestDiv;
      var urlLine = document.createElement("div");
      urlLine.textContent = "import requests\nimport json\n" + "url = '" + params.request.url + "'";
      requestDiv.appendChild(urlLine);
    }

    if (params.redirectResponse)
      appendResponse(params.requestId, params.redirectResponse);

    var requestLine = document.createElement("div");
    requestLine.textContent = "\n# " + params.request.method + " " +
        parseURL(params.request.url).path + " HTTP/1.1";
    requestDiv.appendChild(requestLine);
    //const req_headers = JSON.stringify(params.request.headers).toLowerCase()
    console.log(`[request]\n${JSON.stringify(params.request,null,4)}`)
    const req_headers = lowerKey(params.request.headers)
    // console.log(`req_headers is ${JSON.stringify(req_headers)}`)
    if ('content-type' in req_headers) {
      // console.log(`content-type is ${JSON.stringify(params.request)}`)
      if (req_headers['content-type'].indexOf('urlencoded') > -1) {
        const urlencoded = params.request.postData
        var postLine = document.createElement("div");
        postLine.textContent = "\n" + "data = json.loads(r'''" + JSON.stringify(form2json(urlencoded)) + "''')"
        requestDiv.appendChild(postLine);
      } else if (req_headers['content-type'].indexOf('json') > -1) {
        const urlencoded = params.request.postData
        var postLine = document.createElement("div");
        postLine.textContent = "import json" + "\n" + "data = json.loads(" + JSON.stringify(urlencoded) + ")"
        requestDiv.appendChild(postLine);
      }
    }
    document.getElementById("container").appendChild(requestDiv);
    
  } else if (message == "Network.responseReceived") {
    //console.log(`[DEBUG] params is ${JSON.stringify(params,null,4)}`)
    console.log(`[response]\n${JSON.stringify(params.response,null,4)}`)    
    appendResponse(params.requestId, params.response);
  }
}

function appendResponse(requestId, response) {
  var requestDiv = requests[requestId];
  // console.log(`[requestHeaders] ${JSON.stringify(response.requestHeaders)}`)
  requestDiv.appendChild(formatHeaders(response.requestHeaders));

  var statusLine = document.createElement("div");
  statusLine.textContent = "\n# HTTP/1.1 " + response.status + " " +
      response.statusText;
  requestDiv.appendChild(statusLine);

  const resp_headers = lowerKey(response.headers)
  const mimeType = resp_headers['content-type']
  var mimeTypeLine = document.createElement("div");
  mimeTypeLine.textContent = "# mimeType: " + mimeType
  requestDiv.appendChild(mimeTypeLine);

  /*
  response header
   */
  //requestDiv.appendChild(formatHeaders(response.headers));
}

function formatHeaders(headers) {
  var text = "";
  text = "\n" + "headers = " + JSON.stringify(headers,null,4)
  // for (name in headers)
  //   text += name + ": " + headers[name] + "\n";
  var div = document.createElement("div");
  div.textContent = text;
  return div;
}

function parseURL(url) {
  var result = {};
  var match = url.match(
      /^([^:]+):\/\/([^\/:]*)(?::([\d]+))?(?:(\/[^#]*)(?:#(.*))?)?$/i);
  if (!match)
    return result;
  result.scheme = match[1].toLowerCase();
  result.host = match[2];
  result.port = match[3];
  result.path = match[4] || "/";
  result.fragment = match[5];
  return result;
}

function form2json(formstr) {
  const res = {}
  const form_arr = formstr.split('&')
  for (const kv of form_arr) {
    const kv_arr = kv.split('=')
    const k = decodeURIComponent(kv_arr[0])
    const v = decodeURIComponent(kv_arr[1])

    res[k] = v
  }
  return res
}
