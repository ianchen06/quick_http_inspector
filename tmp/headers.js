// Copyright (c) 2017 Ian Chen <ianchen06@gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { lowerKey, form2Json, parseURL } from './utils.js'
import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'Immutable';
import _ from 'lodash';

var tabId = parseInt(window.location.search.substring(1));

function ClearBtn() {
  return <button>Clear</button>
}

function SearchBar() {
  return (
    <span>
      <input type=""></input>
    </span>
  )
}

function QuickFilter() {
  return (
    <select id="" name="">
      <option value="doc">doc</option>
      <option value="ajax">ajax</option>
    </select>
  )
}

function Header() {
  return (
    <div>
      <ClearBtn />
      <SearchBar />
      <QuickFilter />
    </div>
  )
}

function toggleDetail() {
}

function Title() {
  return
}

function Detail() {
  return <div id="detail"><p>Detail</p></div>
}

class RequestProvider extends React.Component {
  constructor(props) {
    super(props)
    this.onEvent = this.onEvent.bind(this)
    this.state = { 
      requests: Immutable.OrderedMap({})
    }
  }

  componentDidMount() {
    window.addEventListener("load", () => {
      chrome.debugger.sendCommand({ tabId: tabId }, "Network.enable");
      chrome.debugger.onEvent.addListener(this.onEvent);
    });

    window.addEventListener("unload", () => {
      chrome.debugger.detach({ tabId: tabId });
    });
    
  }

  onEvent(debuggeeId, message, params) {
    if (tabId != debuggeeId.tabId)
      return;

    if (message == "Network.requestWillBeSent") {
      if (!params.request.url.startsWith('data')) {
        const newState = this.state.requests.mergeIn([params.requestId], {request: params.request})
        this.setState({requests: newState});
      }

      if (params.redirectResponse) {
        const newState = this.state.requests.mergeIn([params.requestId], {response: params.redirectResponse})
        this.setState({requests: newState});
      }

      //   this.setState({
      //     requests: {
      //       [params.requestId]: {
      //         response: params.redirectResponse
      //       }
      //     }
      //   });

      //const req_headers = lowerKey(params.request.headers)
      // if ('content-type' in req_headers) {
      //   // console.log(`content-type is ${JSON.stringify(params.request)}`)
      //   if (req_headers['content-type'].indexOf('urlencoded') > -1) {
      //     const urlencoded = params.request.postData
      //     var postLine = document.createElement("div");
      //     postLine.textContent = "\n" + "data = json.loads(r'''" + JSON.stringify(form2json(urlencoded)) + "''')"
      //     requestDiv.appendChild(postLine);
      //   } else if (req_headers['content-type'].indexOf('json') > -1) {
      //     const urlencoded = params.request.postData
      //     var postLine = document.createElement("div");
      //     postLine.textContent = "import json" + "\n" + "data = json.loads(" + JSON.stringify(urlencoded) + ")"
      //     requestDiv.appendChild(postLine);
      //   }
      // }
    } else if (message == "Network.responseReceived") {
      const newState = this.state.requests.mergeIn([params.requestId], {response: params.response})
      this.setState({requests: newState});
      // this.setState({
      //   requests: {
      //     [params.requestId]: {
      //       response: params.response
      //     }
      //   }
      // });
    }
  }

  render() {
    return (
      <div>
        <Header />
        <RequestList {...this.state} />
      </div>
    )
  }
}

class RequestList extends React.Component {
  constructor(props) {
    super(props)
    this.handleDetailClick = this.handleDetailClick.bind(this)
    this.state = {show: false}
  }

  handleDetailClick() {
    if (this.state.show == true) {
      this.setState({ show: false })
    } else {
      this.setState({ show: true })
    }
  }

  render() {
    const {requests} = this.props
    let detail = null
    if (this.state.show == true) {
      detail = <Detail />
    } else {
      detail = null
    }
    // console.log(requests.toJS())
    return (
      <div>
        <div onClick={this.handleDetailClick}><span>></span><span>Title</span></div>
        {requests.valueSeq().map((req) => {
          {/* console.log(JSON.stringify(req.getIn(['request', 'url']))) */}
          return(
            <RequestItem key={req.getIn(['request', 'url'])} request={req} />
          )
        }
        )}
      </div>
    )
  }
}

function RequestItem(props) {
  // console.log(props)
  return (
    <p>{props.request.getIn(['request', 'url'])}</p>
  )
}

function App() {
  return (
    <div>
      <RequestProvider />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);