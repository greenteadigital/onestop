import React from 'react'
import watch from 'redux-watch'
import store from '../../store'
import L from 'leaflet'
import E from 'esri-leaflet'
import 'leaflet-draw'
import _ from 'lodash'

const COLOR_ORANGE = '#FFA268'
const COLOR_GREEN = '#00FFC8'

const styleMapContainer = (showMap, forceShow) => {
  return {
    boxSizing: 'border-box',
    backgroundColor: '#3D97D2',
    transition:
      showMap || forceShow
        ? 'height 0.2s 0.0s, padding 0.1s 0.2s, width 0.2s 0.3s'
        : 'width 0.2s 0.0s, padding 0.1s 0.2s, height 0.2s 0.3s',
    padding: showMap && !forceShow ? '1em' : '0em',
    height: showMap || forceShow ? '400px' : '0px',
    width: showMap || forceShow ? '100%' : '0%',
  }
}

const styleMap = (showMap, forceShow) => {
  return {
    zIndex: forceShow ? 2 : 1,
    padding: 0,
    margin: '0 auto',
    display: showMap || forceShow ? 'flex' : 'none',
    position: 'relative',
    height: '100%',
    alignItems: 'flex-start',
    maxWidth: '1200px',
  }
}

const SOUTH_WEST = L.latLng(-90, -180)
const NORTH_EAST = L.latLng(90, 180)
const BOUNDS = L.latLngBounds(SOUTH_WEST, NORTH_EAST)

const initialMapProperties = {
  maxBounds: BOUNDS,
  maxBoundsViscosity: 1.0,
  minZoom: 2,
  maxZoom: 5,
  layers: [ E.basemapLayer('Imagery'), E.basemapLayer('ImageryLabels') ],
  attributionControl: false,
}

const geoJsonStyle = {
  color: COLOR_GREEN,
  weight: 3,
  opacity: 0.65,
}

const drawStyle = {
  color: COLOR_ORANGE,
  weight: 3,
  opacity: 0.65,
}

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.geoJsonFeatures = props.geoJsonFeatures
    this.focusedFeatures = props.focusedFeatures
    this.state = {
      initialized: false,
    }
  }

  handleTransitionEnd = event => {
    // this ensures the map tiles get loaded properly around the animation
    const {map} = this.state
    const property = event.propertyName
    if (property === 'height' || property === 'width') {
      map.invalidateSize()
    }
  }

  initialState = () => {
    const {geoJsonSelection, features} = this.props

    let resultsLayers = new L.FeatureGroup()
    let editableLayers = new L.FeatureGroup()

    if (geoJsonSelection) {
      let geoJSONLayer = L.geoJson(geoJsonSelection, {style: geoJsonStyle})
      editableLayers.addLayer(geoJSONLayer)
    }

    if (features) {
      this.updateResultsLayers(this.props)
    }

    let state = {
      initialized: true,
      resultsLayers,
      editableLayers,
      // Define map with defaults
      map: L.map(this.mapNode, initialMapProperties),
      previousLayer: {},
    }
    return state
  }

  componentDidMount() {
    this.container.addEventListener('transitionend', this.handleTransitionEnd)
    this.setState(this.initialState(), this.mapSetup)
  }

  drawDefaults(layerGroup) {
    return new L.Control.Draw({
      edit: {
        featureGroup: layerGroup,
        edit: false, // edit button
        remove: false, // trash can button
      },
      position: 'topright',
      draw: {
        polyline: false,
        marker: false,
        polygon: false,
        circle: false,
        circlemarker: false,
        rectangle: {
          shapeOptions: drawStyle,
        },
      },
    })
  }

  mapSetup() {
    const {selection, features} = this.props
    let {map, drawControl, editableLayers, resultsLayers} = this.state
    this.loadDrawEventHandlers()
    if (selection) {
      map.addControl(this.drawDefaults(editableLayers))
      map.addLayer(editableLayers)
    }
    if (features) {
      map.addLayer(resultsLayers)
    }
    this.fitMapToResults()
  }

  componentWillReceiveProps() {
    let {map} = this.state
    if (map) {
      map.invalidateSize()
    } // Necessary to redraw map which isn't initially visible
  }

  componentWillUpdate(nextProps) {
    // Add/remove layers on map to reflect store
    const {selection, features} = this.props
    const {initialized} = this.state
    if (initialized) {
      if (selection) {
        this.updateSelectionLayer()
      }
      if (features) {
        this.updateResultsLayers(nextProps)
        this.fitMapToResults()
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {map} = this.state
    map.invalidateSize()
  }

  updateSelectionLayer() {
    let {editableLayers, style} = this.state
    let w = watch(store.getState, 'behavior.search.geoJSON')
    store.subscribe(
      w(newGeoJson => {
        editableLayers.clearLayers()
        if (!_.isEmpty(newGeoJson)) {
          let layer = L.geoJson(newGeoJson, {style: style})
          editableLayers.addLayer(layer)
        }
      })
    )
  }

  updateResultsLayers({geoJsonFeatures, focusedFeatures}) {
    if (!geoJsonFeatures) {
      return
    }
    // Apply colors to focused feature
    let {resultsLayers} = this.state
    const selectedStyle = {color: COLOR_ORANGE}
    const defaultStyle = {
      color: COLOR_GREEN,
      fillOpacity: 0.002,
      opacity: 0.5,
    }
    if (!resultsLayers) {
      return
    }

    resultsLayers.clearLayers()
    geoJsonFeatures.forEach(feature => {
      resultsLayers.addLayer(
        L.geoJson(feature, {
          style: f =>
            focusedFeatures.indexOf(f.properties.id) >= 0
              ? selectedStyle
              : defaultStyle,
        })
      )
    })
    this.geoJsonFeatures = geoJsonFeatures
    this.focusedFeatures = focusedFeatures
  }

  fitMapToResults() {
    const {selection, features} = this.props
    const {map, resultsLayers} = this.state
    const hasResults = resultsLayers && !_.isEmpty(resultsLayers.getLayers())
    if (!selection && features && hasResults) {
      map.fitBounds(resultsLayers.getBounds())
    }
    else {
      map.fitWorld()
    }
  }

  componentWillUnmount() {
    let {map} = this.state
    map.off('click', this.onMapClick)
    map = null
  }

  updateGeometryAndSubmit = newGeoJSON => {
    const {geoJSON, handleNewGeometry, removeGeometry, submit} = this.props
    if (geoJSON || newGeoJSON) {
      if (newGeoJSON) {
        handleNewGeometry(newGeoJSON)
      }
      else {
        removeGeometry()
      }
      submit()
    }
  }

  loadDrawEventHandlers() {
    let {map} = this.state
    map.on('draw:drawstart', e => {
      this.updateGeometryAndSubmit()
    })
    map.on('draw:created', e => {
      let newLayer = e.layer.toGeoJSON()
      this.updateGeometryAndSubmit(newLayer)
    })
    map.on('draw:edited', e => {
      let layerModified = e.getLayers()[0].toGeoJSON()
      this.updateGeometryAndSubmit(layerModified)
    })
    map.on('draw:deleted', e => {
      this.updateGeometryAndSubmit()
    })
  }

  render() {
    const {showMap, forceShow} = this.props
    return (
      <div
        style={styleMapContainer(showMap, forceShow)}
        ref={container => {
          this.container = container
        }}
      >
        <div
          style={styleMap(showMap, forceShow)}
          ref={mapNode => {
            this.mapNode = mapNode
          }}
        />
      </div>
    )
  }
}

Map.defaultProps = {
  selection: false,
  features: true,
}

export default Map
