import { combineReducers } from 'redux'
import omitDeep from 'omit-deep-lodash'
import { lowerKey, form2Json } from '../utils.js'
//import todos from './todos'
//import visibilityFilter from './visibilityFilter'

const network = (state = [], action) => {
  let newState
  switch (action.type) {
    case 'ADD_REQUEST':
      action.req.request.headers = lowerKey(action.req.request.headers)
      const req_headers = action.req.request.headers
      if ('content-type' in req_headers) {
        if (req_headers['content-type'].indexOf('urlencoded') > -1) {
          const urlencoded = action.req.request.postData
          action.req.request.pyPostData = "json.loads(r'''" + JSON.stringify(form2Json(urlencoded),null,4) + "''')"
        } else if (req_headers['content-type'].indexOf('json') > -1) {
          const urlencoded = action.req.request.postData
          action.req.request.pyPostData = JSON.stringify(urlencoded) + ".encode('utf-8')"
        }
      } 
      newState = [...state, {requestId: action.req.requestId, request: action.req.request, response: {}}]
      return newState
    case 'ADD_RESPONSE':
      newState = state.map((rec) => {
        const requestHeaders = Object.keys(action.resp.response.requestHeaders)
        .filter(key => !key.startsWith(":"))
        .reduce((obj, key) => {
          obj[key] = action.resp.response.requestHeaders[key];
          return obj;
        }, {});
        action.resp.response.cleanRequestHeaders = requestHeaders
        for (const field of ['headersText', 'securityDetails', 'requestHeadersText', 'timing']) {
          action.resp.response = omitDeep(action.resp.response, field)
        }
        if (rec.requestId == action.resp.requestId) {
          return {...rec, response: action.resp.response}
        } else {
          return rec
        }
      })
      return newState
    default:
      return state
  }
}

const appReducers = combineReducers({
  network,
  //todos,
  //visibilityFilter
})

export default appReducers