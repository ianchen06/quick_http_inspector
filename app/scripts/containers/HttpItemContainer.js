import { connect } from 'react-redux'
import { exportRequest } from '../actions'
import HttpItemList from '../components/HttpItemList'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
}

const mapStateToProps = state => {
  return {
    httpitems: state.network
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onExportClick: requestId => {
      dispatch(exportRequest(requestId))
    }
  }
}

const HttpItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HttpItemList)

export default HttpItemContainer