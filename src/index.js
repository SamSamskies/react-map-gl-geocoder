import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { Component } from 'react'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { FlyToInterpolator } from 'react-map-gl'
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

    const { mapRef, onViewportChange, mapboxApiAccessToken, options } = this.props

    this.geocoder = new MapboxGeocoder({ accessToken: mapboxApiAccessToken, ...options })
    this.geocoder.on('result', ({ result }) => {
      const [longitude, latitude] = result.center

      if (this.geocoder.options.flyTo) {
        onViewportChange({
          longitude,
          latitude,
          transitionInterpolator: new FlyToInterpolator(),
          transitionDuration: 3000
        })
      } else {
        onViewportChange({ longitude, latitude })
      }
    })

    mapRef.current.getMap().addControl(this.geocoder)
  }

  getGeocoder() {
    return this.geocoder
  }

  render() {
    return null
  }

  static propTypes = {
    mapRef: PropTypes.object.isRequired,
    onViewportChange: PropTypes.func.isRequired,
    mapboxApiAccessToken: PropTypes.string,
    options: PropTypes.object
  }

  static defaultProps = {
    mapboxApiAccessToken: getAccessToken()
  }
}

export default Geocoder
