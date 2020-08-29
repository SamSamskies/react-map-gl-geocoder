import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { FlyToInterpolator } from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import mapboxgl from 'mapbox-gl'

const VALID_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

class Geocoder extends PureComponent {
  geocoder = null
  cachedResult = null

  componentDidMount() {
    this.initializeGeocoder()
  }

  componentWillUnmount() {
    this.removeGeocoder()
  }

  componentDidUpdate() {
    this.removeGeocoder()
    this.initializeGeocoder()
  }

  initializeGeocoder = () => {
    const mapboxMap = this.getMapboxMap()
    const containerNode = this.getContainerNode()
    const {
      mapboxApiAccessToken,
      inputValue,
      origin,
      zoom,
      placeholder,
      proximity,
      trackProximity,
      collapsed,
      clearAndBlurOnEsc,
      clearOnBlur,
      bbox,
      types,
      countries,
      minLength,
      limit,
      language,
      filter,
      localGeocoder,
      reverseGeocode,
      enableEventLogging,
      marker,
      render,
      getItemValue,
      onInit,
      position
    } = this.props
    const options = {
      accessToken: mapboxApiAccessToken,
      origin,
      zoom,
      flyTo: false,
      placeholder,
      proximity,
      trackProximity,
      collapsed,
      clearAndBlurOnEsc,
      clearOnBlur,
      bbox,
      types,
      countries,
      minLength,
      limit,
      language,
      filter,
      localGeocoder,
      reverseGeocode,
      enableEventLogging,
      marker,
      mapboxgl
    }

    if (render && typeof render === 'function') {
      options.render = render
    }

    if (getItemValue && typeof getItemValue === 'function') {
      options.getItemValue = getItemValue
    }

    this.geocoder = new MapboxGeocoder(options)
    this.subscribeEvents()

    if (containerNode) {
      containerNode.appendChild(this.geocoder.onAdd(mapboxMap))
    } else {
      mapboxMap.addControl(this.geocoder, VALID_POSITIONS.find((_position) => position === _position))
    }

    if (inputValue !== undefined && inputValue !== null) {
      this.geocoder.setInput(inputValue)
    } else if (this.cachedResult) {
      this.geocoder.setInput(this.cachedResult.place_name)
    }

    if (this.cachedResult || (inputValue !== undefined && inputValue !== null)) {
      this.showClearIcon()
    }

    onInit(this.geocoder)
  }

  showClearIcon = () => {
    // this is a hack to force clear icon to show if there is text in the input
    this.geocoder._clearEl.style.display = 'block'
  }

  getMapboxMap = () => {
    const { mapRef } = this.props

    return (mapRef && mapRef.current && mapRef.current.getMap()) || null
  }

  getContainerNode = () => {
    const { containerRef } = this.props

    return (containerRef && containerRef.current) || null
  }

  subscribeEvents = () => {
    this.geocoder.on('clear', this.handleClear)
    this.geocoder.on('loading', this.handleLoading)
    this.geocoder.on('results', this.handleResults)
    this.geocoder.on('result', this.handleResult)
    this.geocoder.on('error', this.handleError)
  }

  unsubscribeEvents = () => {
    this.geocoder.off('clear', this.handleClear)
    this.geocoder.off('loading', this.handleLoading)
    this.geocoder.off('results', this.handleResults)
    this.geocoder.off('result', this.handleResult)
    this.geocoder.off('error', this.handleError)
  }

  removeGeocoder = () => {
    const mapboxMap = this.getMapboxMap()

    this.unsubscribeEvents()

    if (mapboxMap && mapboxMap.removeControl) {
      this.getMapboxMap().removeControl(this.geocoder)
    }

    this.geocoder = null
  }

  handleClear = () => {
    this.cachedResult = null
    this.props.onClear()
  }

  handleLoading = (event) => {
    this.props.onLoading(event)
  }

  handleResults = (event) => {
    this.props.onResults(event)
  }

  handleResult = (event) => {
    const { result } = event
    const { onViewportChange, onResult } = this.props
    const { bbox, center, properties = {} } = result
    const { short_code } = properties
    const [longitude, latitude] = center
    const bboxExceptions = {
      fr: {
        name: 'France',
        bbox: [[-4.59235, 41.380007], [9.560016, 51.148506]]
      },
      us: {
        name: 'United States',
        bbox: [[-171.791111, 18.91619], [-66.96466, 71.357764]]
      },
      ru: {
        name: 'Russia',
        bbox: [[19.66064, 41.151416], [190.10042, 81.2504]]
      },
      ca: {
        name: 'Canada',
        bbox: [[-140.99778, 41.675105], [-52.648099, 83.23324]]
      }
    }
    const { width, height } = this.getMapboxMap()
      .getContainer()
      .getBoundingClientRect()
    let zoom = this.geocoder.options.zoom
    const fitBounds = (bounds, viewport) => new WebMercatorViewport(viewport).fitBounds(bounds)

    try {
      if (!bboxExceptions[short_code] && bbox) {
        zoom = fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { width, height }).zoom
      } else if (bboxExceptions[short_code]) {
        zoom = fitBounds(bboxExceptions[short_code].bbox, { width, height }).zoom
      }
    } catch (e) {
      console.warn('following result caused an error when trying to zoom to bbox: ', result) // eslint-disable-line
      zoom = this.geocoder.options.zoom
    }

    onViewportChange({
      longitude,
      latitude,
      zoom,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 3000
    })
    onResult(event)

    this.cachedResult = result
    this.geocoder._typeahead.selected = null
    this.showClearIcon()
  }

  handleError = (event) => {
    this.props.onError(event)
  }

  getGeocoder() {
    return this.geocoder
  }

  render() {
    return null
  }

  static propTypes = {
    mapRef: PropTypes.object.isRequired,
    containerRef: PropTypes.object,
    onViewportChange: PropTypes.func,
    mapboxApiAccessToken: PropTypes.string.isRequired,
    inputValue: PropTypes.string,
    origin: PropTypes.string,
    zoom: PropTypes.number,
    placeholder: PropTypes.string,
    proximity: PropTypes.object,
    trackProximity: PropTypes.bool,
    collapsed: PropTypes.bool,
    clearAndBlurOnEsc: PropTypes.bool,
    clearOnBlur: PropTypes.bool,
    bbox: PropTypes.array,
    types: PropTypes.string,
    countries: PropTypes.string,
    minLength: PropTypes.number,
    limit: PropTypes.number,
    language: PropTypes.string,
    filter: PropTypes.func,
    localGeocoder: PropTypes.func,
    reverseGeocode: PropTypes.bool,
    enableEventLogging: PropTypes.bool,
    marker: PropTypes.bool,
    render: PropTypes.func,
    getItemValue: PropTypes.func,
    position: PropTypes.oneOf(VALID_POSITIONS),
    onInit: PropTypes.func,
    onClear: PropTypes.func,
    onLoading: PropTypes.func,
    onResults: PropTypes.func,
    onResult: PropTypes.func,
    onError: PropTypes.func
  }

  static defaultProps = {
    onViewportChange: () => {},
    origin: 'https://api.mapbox.com',
    zoom: 16,
    placeholder: 'Search',
    trackProximity: false,
    collapsed: false,
    clearAndBlurOnEsc: false,
    clearOnBlur: false,
    minLength: 2,
    limit: 5,
    reverseGeocode: false,
    enableEventLogging: true,
    marker: true,
    position: 'top-right',
    onInit: () => {},
    onClear: () => {},
    onLoading: () => {},
    onResults: () => {},
    onResult: () => {},
    onError: () => {}
  }
}

export default Geocoder
