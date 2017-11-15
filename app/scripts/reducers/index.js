import { combineReducers } from 'redux'
//import todos from './todos'
//import visibilityFilter from './visibilityFilter'

const network = (state = [], action) => {
  let newState
  switch (action.type) {
    case 'ADD_REQUEST':
      newState = [...state, {requestId: action.req.requestId, request: action.req.request}]
      return newState
    case 'ADD_RESPONSE':
      newState = state.map((rec) => {
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