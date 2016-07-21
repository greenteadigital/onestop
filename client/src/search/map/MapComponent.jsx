import React from 'react'
import ReactDOM from 'react-dom'
import L from 'leaflet'
import 'leaflet-draw'
import styles from './map.css'

class MapComponent extends React.Component {
    constructor(props) {
        super(props)
        this.handleGeometryUpdate = props.handleGeometryUpdate
        this.geoJSON = props.geoJSON
        this.lastLayer
    }

    componentDidMount() {
        let self = this
        let editableLayers = new L.FeatureGroup()
        // Reload previous map selection from store
        if (this.geoJSON){
            let layer = this.lastLayer = L.geoJson(this.geoJSON.toJS())
            editableLayers.addLayer(layer)
        }
        let map = this.map = L.map(ReactDOM.findDOMNode(this), {
            minZoom: 2,
            maxZoom: 20,
            layers: [
                L.tileLayer(
                    '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {attribution: '&copy; <a href="//openstreetmap.org">OpenStreetMap</a> contributors, <a href="//creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'})
            ],
            attributionControl: false
        })
        map.addLayer(editableLayers)
        map.on('draw:created', function (e) {
            let layer = self.lastLayer = e.layer;
            editableLayers.addLayer(layer)
            self.handleGeometryUpdate(layer.toGeoJSON())
        })
        map.on('draw:drawstart', function (e) {
            editableLayers.removeLayer(self.lastLayer)
        })

        let shadeOptions = {
            color: '#00FF00',
            weight: 6
        }
        var drawControl = new L.Control.Draw({
            edit: {
                featureGroup: editableLayers
            },
            remove: true,
            position: 'topright',
            draw: {
                polyline: false,
                marker: false,
                polygon: false,
                circle: false,
                rectangle: {
                    shapeOptions: shadeOptions
                }
            }
        });
        map.addControl(drawControl);
        map.fitWorld()
    }

    componentWillReceiveProps() {
        this.map.invalidateSize()
    }

    componentWillUnmount() {
        var map = this.map
        map.off('click', this.onMapClick)
        map = null
    }

    render() {
        return (
            <div className={styles.mapContainer}></div>
        )
    }
}

export default MapComponent