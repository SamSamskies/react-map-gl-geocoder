import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { Component } from 'react'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { getAccessToken } from 'react-map-gl/dist/mapbox/mapbox'
import PropTypes from 'prop-types'

class Geocoder extends Component {
  componentDidMount() {
    // mapRef is undefined on initial page load, so force an update to initialize geocoder
    this.forceUpdate()
  }

  componentDidUpdate() {
    if (this.geocoder !== undefined) {
      return
    }

    const { mapRef, mapboxApiAccessToken, options } = this.props
    const map = mapRef.current.getMap()

    this.geocoder = map.addControl(new MapboxGeocoder({ accessToken: mapboxApiAccessToken, ...options }))
  }

  getGeocoder() {
    return this.geocoder
  }

  render() {
    return null
  }

  static propTypes = {
    mapRef: PropTypes.object.isRequired,
    mapboxApiAccessToken: PropTypes.string,
    options: PropTypes.object
  }

  static defaultProps = {
    mapboxApiAccessToken: getAccessToken()
  }
}

export default Geocoder
