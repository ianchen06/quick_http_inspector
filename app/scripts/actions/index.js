export const addRequest = req => {
  return {
    type: 'ADD_REQUEST',
    req
  }
}

export const addResponse = resp => {
  return {
    type: 'ADD_RESPONSE',
    resp
  }
}

export const exportRequest = requestId => {
  return {
    type: 'EXPORT_REQUEST',
    requestId
  }
}

export const toggleTodo = id => {
  return {
    type: 'TOGGLE_TODO',
    id
  }
}