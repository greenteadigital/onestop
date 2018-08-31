
import {connect} from 'react-redux'
import TrendingSearch from './TrendingSearch'
import {triggerSearch, clearFacets} from '../actions/SearchRequestActions'
import {updateQuery} from '../actions/SearchParamActions'
import {showCollections} from '../actions/FlowActions'

import {withRouter} from 'react-router'

const mapStateToProps = state => {

  return {
    // featured: state.domain.config.featured,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submit: () => {
      dispatch(clearFacets())
      dispatch(triggerSearch())
      dispatch(showCollections())
    },
    updateQuery: text => dispatch(updateQuery(text)),
  }
}

const TrendingSearchContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TrendingSearch)
)

export default TrendingSearchContainer