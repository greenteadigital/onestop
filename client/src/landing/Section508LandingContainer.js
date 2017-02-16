import { connect } from 'react-redux'
import Section508LandingComponent from './Section508LandingComponent'
import { triggerSearch, clearFacets } from '../actions/SearchRequestActions'
import { updateQuery } from '../actions/SearchParamActions'
import { showCollections } from '../actions/FlowActions'
import { newGeometry, removeGeometry, updateDateRange } from '../actions/SearchParamActions'

const mapStateToProps = (state) => {
  const { startDateTime, endDateTime } = state.behavior.search
  const coordinates = pullOutCoordinates(state.behavior.search)
  return {
    startDateTime: startDateTime,
    endDateTime: endDateTime,
    geoJsonSelection: coordinates,
    queryString: state.behavior.search.queryText
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // Update geometry
    handleNewGeometry: geoJSON => {console.log(geoJSON);dispatch(newGeometry(geoJSON))},
    removeGeometry: () => dispatch(removeGeometry()),
    // Update date range
    updateOnChange: (startDate, endDate) => {
      dispatch(updateDateRange(startDate, endDate))
    },
    // Update search text
    updateQuery: text => dispatch(updateQuery(text)),
    // Submit search
    submit: () => {
      dispatch(clearFacets())
      dispatch(triggerSearch())
      dispatch(showCollections())
    }
  }
}

const pullOutCoordinates = ({geoJSON}) => {
  let coordinates = geoJSON && geoJSON.geometry && geoJSON.geometry.coordinates
  return coordinates
    ? coordinates[0]
      .filter((el,idx)=>[0,2].includes(idx))
      .toString()
    : ''
}

const Section508LandingContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Section508LandingComponent)

export default Section508LandingContainer