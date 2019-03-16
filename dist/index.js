'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

var _slicedToArray = (function() {
  function sliceIterator(arr, i) {
    var _arr = []
    var _n = true
    var _d = false
    var _e = undefined
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value)
        if (i && _arr.length === i) break
      }
    } catch (err) {
      _d = true
      _e = err
    } finally {
      try {
        if (!_n && _i['return']) _i['return']()
      } finally {
        if (_d) throw _e
      }
    }
    return _arr
  }
  return function(arr, i) {
    if (Array.isArray(arr)) {
      return arr
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i)
    } else {
      throw new TypeError('Invalid attempt to destructure non-iterable instance')
    }
  }
})()

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

require('@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css')

var _react = require('react')

var _propTypes = require('prop-types')

var _propTypes2 = _interopRequireDefault(_propTypes)

var _mapboxGlGeocoder = require('@mapbox/mapbox-gl-geocoder')

var _mapboxGlGeocoder2 = _interopRequireDefault(_mapboxGlGeocoder)

var _reactMapGl = require('react-map-gl')

var _viewportMercatorProject = require('viewport-mercator-project')

var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
  }
  return call && (typeof call === 'object' || typeof call === 'function') ? call : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass)
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
  })
  if (superClass)
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : (subClass.__proto__ = superClass)
}

var VALID_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

function fitBounds(bounds, viewport) {
  return new _viewportMercatorProject2.default(viewport).fitBounds(bounds)
}

function getAccessToken() {
  var accessToken = null

  if (typeof window !== 'undefined' && window.location) {
    var match = window.location.search.match(/access_token=([^&/]*)/)
    accessToken = match && match[1]
  }

  if (!accessToken && typeof process !== 'undefined') {
    // Note: This depends on bundler plugins (e.g. webpack) inmporting environment correctly
    accessToken = accessToken || process.env.MapboxAccessToken // eslint-disable-line
  }

  return accessToken || null
}

var Geocoder = (function(_Component) {
  _inherits(Geocoder, _Component)

  function Geocoder() {
    var _ref

    var _temp, _this, _ret

    _classCallCheck(this, Geocoder)

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key]
    }

    return (
      (_ret = ((_temp = ((_this = _possibleConstructorReturn(
        this,
        (_ref = Geocoder.__proto__ || Object.getPrototypeOf(Geocoder)).call.apply(_ref, [this].concat(args))
      )),
      _this)),
      (_this.geocoder = null),
      (_this.cachedResult = ''),
      (_this.initializeGeocoder = function() {
        var mapboxMap = _this.getMapboxMap()
        var containerNode = _this.getContainerNode()
        var _this$props = _this.props,
          mapboxApiAccessToken = _this$props.mapboxApiAccessToken,
          zoom = _this$props.zoom,
          flyTo = _this$props.flyTo,
          placeholder = _this$props.placeholder,
          proximity = _this$props.proximity,
          trackProximity = _this$props.trackProximity,
          bbox = _this$props.bbox,
          types = _this$props.types,
          country = _this$props.country,
          minLength = _this$props.minLength,
          limit = _this$props.limit,
          language = _this$props.language,
          filter = _this$props.filter,
          localGeocoder = _this$props.localGeocoder,
          options = _this$props.options,
          onInit = _this$props.onInit,
          position = _this$props.position

        _this.geocoder = new _mapboxGlGeocoder2.default(
          _extends(
            {
              accessToken: mapboxApiAccessToken,
              zoom: zoom,
              flyTo: flyTo,
              placeholder: placeholder,
              proximity: proximity,
              trackProximity: trackProximity,
              bbox: bbox,
              types: types,
              country: country,
              minLength: minLength,
              limit: limit,
              language: language,
              filter: filter,
              localGeocoder: localGeocoder
            },
            options
          )
        )
        _this.subscribeEvents()

        if (containerNode) {
          containerNode.appendChild(_this.geocoder.onAdd(mapboxMap))
        } else {
          mapboxMap.addControl(
            _this.geocoder,
            VALID_POSITIONS.find(function(_position) {
              return position === _position
            })
          )
        }

        _this.geocoder.setInput(_this.cachedResult)
        onInit(_this.geocoder)
      }),
      (_this.getMapboxMap = function() {
        var mapRef = _this.props.mapRef

        return (mapRef && mapRef.current && mapRef.current.getMap()) || null
      }),
      (_this.getContainerNode = function() {
        var containerRef = _this.props.containerRef

        return (containerRef && containerRef.current) || null
      }),
      (_this.subscribeEvents = function() {
        _this.geocoder.on('clear', _this.handleClear)
        _this.geocoder.on('loading', _this.handleLoading)
        _this.geocoder.on('results', _this.handleResults)
        _this.geocoder.on('result', _this.handleResult)
        _this.geocoder.on('error', _this.handleError)
      }),
      (_this.unsubscribeEvents = function() {
        _this.geocoder.off('clear', _this.handleClear)
        _this.geocoder.off('loading', _this.handleLoading)
        _this.geocoder.off('results', _this.handleResults)
        _this.geocoder.off('result', _this.handleResult)
        _this.geocoder.off('error', _this.handleError)
      }),
      (_this.removeGeocoder = function() {
        var mapboxMap = _this.getMapboxMap()

        _this.unsubscribeEvents()

        if (mapboxMap && mapboxMap.removeControl) {
          _this.getMapboxMap().removeControl(_this.geocoder)
        }

        _this.geocoder = null
      }),
      (_this.handleClear = function() {
        _this.props.onClear()
      }),
      (_this.handleLoading = function(event) {
        _this.props.onLoading(event)
      }),
      (_this.handleResults = function(event) {
        _this.props.onResults(event)
      }),
      (_this.handleResult = function(event) {
        var result = event.result
        var _this$props2 = _this.props,
          mapRef = _this$props2.mapRef,
          onViewportChange = _this$props2.onViewportChange,
          onResult = _this$props2.onResult
        var id = result.id,
          bbox = result.bbox,
          center = result.center,
          place_name = result.place_name

        var _center = _slicedToArray(center, 2),
          longitude = _center[0],
          latitude = _center[1]

        var bboxExceptions = {
          'country.3148': {
            name: 'France',
            bbox: [[-4.59235, 41.380007], [9.560016, 51.148506]]
          },
          'country.3145': {
            name: 'United States',
            bbox: [[-171.791111, 18.91619], [-66.96466, 71.357764]]
          },
          'country.330': {
            name: 'Russia',
            bbox: [[19.66064, 41.151416], [190.10042, 81.2504]]
          },
          'country.3179': {
            name: 'Canada',
            bbox: [[-140.99778, 41.675105], [-52.648099, 83.23324]]
          }
        }
        var width = mapRef.current.props.width
        var height = mapRef.current.props.height
        var zoom = _this.geocoder.options.zoom

        if (!bboxExceptions[id] && bbox) {
          zoom = fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { width: width, height: height }).zoom
        } else if (bboxExceptions[id]) {
          zoom = fitBounds(bboxExceptions[id].bbox, { width: width, height: height }).zoom
        }

        if (_this.geocoder.options.flyTo) {
          onViewportChange({
            longitude: longitude,
            latitude: latitude,
            zoom: zoom,
            transitionInterpolator: new _reactMapGl.FlyToInterpolator(),
            transitionDuration: 3000,
            place_name: place_name
          })
        } else {
          onViewportChange({ longitude: longitude, latitude: latitude, zoom: zoom })
        }

        onResult(event)

        if (result && result.place_name) {
          _this.cachedResult = result.place_name
        }
      }),
      (_this.handleError = function(event) {
        _this.props.onError(event)
      }),
      _temp)),
      _possibleConstructorReturn(_this, _ret)
    )
  }

  _createClass(Geocoder, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.initializeGeocoder()
      }
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.removeGeocoder()
      }
    },
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.removeGeocoder()
        this.initializeGeocoder()
      }
    },
    {
      key: 'getGeocoder',
      value: function getGeocoder() {
        return this.geocoder
      }
    },
    {
      key: 'render',
      value: function render() {
        return null
      }
    }
  ])

  return Geocoder
})(_react.Component)

Geocoder.propTypes = {
  mapRef: _propTypes2.default.object.isRequired,
  containerRef: _propTypes2.default.object,
  onViewportChange: _propTypes2.default.func.isRequired,
  mapboxApiAccessToken: _propTypes2.default.string,
  zoom: _propTypes2.default.number,
  flyTo: _propTypes2.default.bool,
  placeholder: _propTypes2.default.string,
  proximity: _propTypes2.default.object,
  trackProximity: _propTypes2.default.bool,
  bbox: _propTypes2.default.array,
  types: _propTypes2.default.string,
  country: _propTypes2.default.string,
  minLength: _propTypes2.default.number,
  limit: _propTypes2.default.number,
  language: _propTypes2.default.string,
  filter: _propTypes2.default.func,
  localGeocoder: _propTypes2.default.func,
  position: _propTypes2.default.oneOf(VALID_POSITIONS),
  onInit: _propTypes2.default.func,
  onClear: _propTypes2.default.func,
  onLoading: _propTypes2.default.func,
  onResults: _propTypes2.default.func,
  onResult: _propTypes2.default.func,
  onError: _propTypes2.default.func,
  options: _propTypes2.default.object // deprecated and will be removed in v2
}
Geocoder.defaultProps = {
  mapboxApiAccessToken: getAccessToken(),
  zoom: 16,
  flyTo: true,
  placeholder: 'Search',
  trackProximity: false,
  minLength: 2,
  limit: 5,
  position: 'top-right',
  onInit: function onInit() {},
  onClear: function onClear() {},
  onLoading: function onLoading() {},
  onResults: function onResults() {},
  onResult: function onResult() {},
  onError: function onError() {}
}
exports.default = Geocoder
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJWQUxJRF9QT1NJVElPTlMiLCJmaXRCb3VuZHMiLCJib3VuZHMiLCJ2aWV3cG9ydCIsIldlYk1lcmNhdG9yVmlld3BvcnQiLCJnZXRBY2Nlc3NUb2tlbiIsImFjY2Vzc1Rva2VuIiwid2luZG93IiwibG9jYXRpb24iLCJtYXRjaCIsInNlYXJjaCIsInByb2Nlc3MiLCJlbnYiLCJNYXBib3hBY2Nlc3NUb2tlbiIsIkdlb2NvZGVyIiwiZ2VvY29kZXIiLCJjYWNoZWRSZXN1bHQiLCJpbml0aWFsaXplR2VvY29kZXIiLCJtYXBib3hNYXAiLCJnZXRNYXBib3hNYXAiLCJjb250YWluZXJOb2RlIiwiZ2V0Q29udGFpbmVyTm9kZSIsInByb3BzIiwibWFwYm94QXBpQWNjZXNzVG9rZW4iLCJ6b29tIiwiZmx5VG8iLCJwbGFjZWhvbGRlciIsInByb3hpbWl0eSIsInRyYWNrUHJveGltaXR5IiwiYmJveCIsInR5cGVzIiwiY291bnRyeSIsIm1pbkxlbmd0aCIsImxpbWl0IiwibGFuZ3VhZ2UiLCJmaWx0ZXIiLCJsb2NhbEdlb2NvZGVyIiwib3B0aW9ucyIsIm9uSW5pdCIsInBvc2l0aW9uIiwiTWFwYm94R2VvY29kZXIiLCJzdWJzY3JpYmVFdmVudHMiLCJhcHBlbmRDaGlsZCIsIm9uQWRkIiwiYWRkQ29udHJvbCIsImZpbmQiLCJfcG9zaXRpb24iLCJzZXRJbnB1dCIsIm1hcFJlZiIsImN1cnJlbnQiLCJnZXRNYXAiLCJjb250YWluZXJSZWYiLCJvbiIsImhhbmRsZUNsZWFyIiwiaGFuZGxlTG9hZGluZyIsImhhbmRsZVJlc3VsdHMiLCJoYW5kbGVSZXN1bHQiLCJoYW5kbGVFcnJvciIsInVuc3Vic2NyaWJlRXZlbnRzIiwib2ZmIiwicmVtb3ZlR2VvY29kZXIiLCJyZW1vdmVDb250cm9sIiwib25DbGVhciIsImV2ZW50Iiwib25Mb2FkaW5nIiwib25SZXN1bHRzIiwicmVzdWx0Iiwib25WaWV3cG9ydENoYW5nZSIsIm9uUmVzdWx0IiwiaWQiLCJjZW50ZXIiLCJwbGFjZV9uYW1lIiwibG9uZ2l0dWRlIiwibGF0aXR1ZGUiLCJiYm94RXhjZXB0aW9ucyIsIm5hbWUiLCJ3aWR0aCIsImhlaWdodCIsInRyYW5zaXRpb25JbnRlcnBvbGF0b3IiLCJGbHlUb0ludGVycG9sYXRvciIsInRyYW5zaXRpb25EdXJhdGlvbiIsIm9uRXJyb3IiLCJDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZnVuYyIsInN0cmluZyIsIm51bWJlciIsImJvb2wiLCJhcnJheSIsIm9uZU9mIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGtCQUFrQixDQUFDLFVBQUQsRUFBYSxXQUFiLEVBQTBCLGFBQTFCLEVBQXlDLGNBQXpDLENBQXhCOztBQUVBLFNBQVNDLFNBQVQsQ0FBbUJDLE1BQW5CLEVBQTJCQyxRQUEzQixFQUFxQztBQUNuQyxTQUFPLElBQUlDLGlDQUFKLENBQXdCRCxRQUF4QixFQUFrQ0YsU0FBbEMsQ0FBNENDLE1BQTVDLENBQVA7QUFDRDs7QUFFRCxTQUFTRyxjQUFULEdBQTBCO0FBQ3hCLE1BQUlDLGNBQWMsSUFBbEI7O0FBRUEsTUFBSSxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxPQUFPQyxRQUE1QyxFQUFzRDtBQUNwRCxRQUFNQyxRQUFRRixPQUFPQyxRQUFQLENBQWdCRSxNQUFoQixDQUF1QkQsS0FBdkIsQ0FBNkIsdUJBQTdCLENBQWQ7QUFDQUgsa0JBQWNHLFNBQVNBLE1BQU0sQ0FBTixDQUF2QjtBQUNEOztBQUVELE1BQUksQ0FBQ0gsV0FBRCxJQUFnQixPQUFPSyxPQUFQLEtBQW1CLFdBQXZDLEVBQW9EO0FBQ2xEO0FBQ0FMLGtCQUFjQSxlQUFlSyxRQUFRQyxHQUFSLENBQVlDLGlCQUF6QyxDQUZrRCxDQUVTO0FB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akJ0QixhQUFXbUIsb0JBQVVHLElBdEJKO0FBdUJqQm5CLFlBQVVnQixvQkFBVUcsSUF2Qkg7QUF3QmpCTixXQUFTRyxvQkFBVUcsSUF4QkY7QUF5QmpCbEQsV0FBUytDLG9CQUFVQyxNQXpCRixDQXlCUztBQXpCVCxDO0FBMUxmdkUsUSxDQXNORytFLFksR0FBZTtBQUNwQnRFLHdCQUFzQmxCLGdCQURGO0FBRXBCbUIsUUFBTSxFQUZjO0FBR3BCQyxTQUFPLElBSGE7QUFJcEJDLGVBQWEsUUFKTztBQUtwQkUsa0JBQWdCLEtBTEk7QUFNcEJJLGFBQVcsQ0FOUztBQU9wQkMsU0FBTyxDQVBhO0FBUXBCTSxZQUFVLFdBUlU7QUFTcEJELFVBQVEsa0JBQU0sQ0FBRSxDQVRJO0FBVXBCd0IsV0FBUyxtQkFBTSxDQUFFLENBVkc7QUFXcEJFLGFBQVcscUJBQU0sQ0FBRSxDQVhDO0FBWXBCQyxhQUFXLHFCQUFNLENBQUUsQ0FaQztBQWFwQkcsWUFBVSxvQkFBTSxDQUFFLENBYkU7QUFjcEJhLFdBQVMsbUJBQU0sQ0FBRTtBQWRHLEM7a0JBa0JUbkUsUSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnQG1hcGJveC9tYXBib3gtZ2wtZ2VvY29kZXIvZGlzdC9tYXBib3gtZ2wtZ2VvY29kZXIuY3NzJ1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnXG5pbXBvcnQgTWFwYm94R2VvY29kZXIgZnJvbSAnQG1hcGJveC9tYXBib3gtZ2wtZ2VvY29kZXInXG5pbXBvcnQgeyBGbHlUb0ludGVycG9sYXRvciB9IGZyb20gJ3JlYWN0LW1hcC1nbCdcbmltcG9ydCBXZWJNZXJjYXRvclZpZXdwb3J0IGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnXG5cbmNvbnN0IFZBTElEX1BPU0lUSU9OUyA9IFsndG9wLWxlZnQnLCAndG9wLXJpZ2h0JywgJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCddXG5cbmZ1bmN0aW9uIGZpdEJvdW5kcyhib3VuZHMsIHZpZXdwb3J0KSB7XG4gIHJldHVybiBuZXcgV2ViTWVyY2F0b3JWaWV3cG9ydCh2aWV3cG9ydCkuZml0Qm91bmRzKGJvdW5kcylcbn1cblxuZnVuY3Rpb24gZ2V0QWNjZXNzVG9rZW4oKSB7XG4gIGxldCBhY2Nlc3NUb2tlbiA9IG51bGxcblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2F0aW9uKSB7XG4gICAgY29uc3QgbWF0Y2ggPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLm1hdGNoKC9hY2Nlc3NfdG9rZW49KFteJi9dKikvKVxuICAgIGFjY2Vzc1Rva2VuID0gbWF0Y2ggJiYgbWF0Y2hbMV1cbiAgfVxuXG4gIGlmICghYWNjZXNzVG9rZW4gJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gTm90ZTogVGhpcyBkZXBlbmRzIG9uIGJ1bmRsZXIgcGx1Z2lucyAoZS5nLiB3ZWJwYWNrKSBpbm1wb3J0aW5nIGVudmlyb25tZW50IGNvcnJlY3RseVxuICAgIGFjY2Vzc1Rva2VuID0gYWNjZXNzVG9rZW4gfHwgcHJvY2Vzcy5lbnYuTWFwYm94QWNjZXNzVG9rZW4gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICB9XG5cbiAgcmV0dXJuIGFjY2Vzc1Rva2VuIHx8IG51bGxcbn1cblxuY2xhc3MgR2VvY29kZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBnZW9jb2RlciA9IG51bGxcbiAgY2FjaGVkUmVzdWx0ID0gJydcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVHZW9jb2RlcigpXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnJlbW92ZUdlb2NvZGVyKClcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICB0aGlzLnJlbW92ZUdlb2NvZGVyKClcbiAgICB0aGlzLmluaXRpYWxpemVHZW9jb2RlcigpXG4gIH1cblxuICBpbml0aWFsaXplR2VvY29kZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgbWFwYm94TWFwID0gdGhpcy5nZXRNYXBib3hNYXAoKVxuICAgIGNvbnN0IGNvbnRhaW5lck5vZGUgPSB0aGlzLmdldENvbnRhaW5lck5vZGUoKVxuICAgIGNvbnN0IHtcbiAgICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuLFxuICAgICAgem9vbSxcbiAgICAgIGZseVRvLFxuICAgICAgcGxhY2Vob2xkZXIsXG4gICAgICBwcm94aW1pdHksXG4gICAgICB0cmFja1Byb3hpbWl0eSxcbiAgICAgIGJib3gsXG4gICAgICB0eXBlcyxcbiAgICAgIGNvdW50cnksXG4gICAgICBtaW5MZW5ndGgsXG4gICAgICBsaW1pdCxcbiAgICAgIGxhbmd1YWdlLFxuICAgICAgZmlsdGVyLFxuICAgICAgbG9jYWxHZW9jb2RlcixcbiAgICAgIG9wdGlvbnMsXG4gICAgICBvbkluaXQsXG4gICAgICBwb3NpdGlvblxuICAgIH0gPSB0aGlzLnByb3BzXG5cbiAgICB0aGlzLmdlb2NvZGVyID0gbmV3IE1hcGJveEdlb2NvZGVyKHtcbiAgICAgIGFjY2Vzc1Rva2VuOiBtYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgICAgIHpvb20sXG4gICAgICBmbHlUbyxcbiAgICAgIHBsYWNlaG9sZGVyLFxuICAgICAgcHJveGltaXR5LFxuICAgICAgdHJhY2tQcm94aW1pdHksXG4gICAgICBiYm94LFxuICAgICAgdHlwZXMsXG4gICAgICBjb3VudHJ5LFxuICAgICAgbWluTGVuZ3RoLFxuICAgICAgbGltaXQsXG4gICAgICBsYW5ndWFnZSxcbiAgICAgIGZpbHRlcixcbiAgICAgIGxvY2FsR2VvY29kZXIsXG4gICAgICAuLi5vcHRpb25zXG4gICAgfSlcbiAgICB0aGlzLnN1YnNjcmliZUV2ZW50cygpXG5cbiAgICBpZiAoY29udGFpbmVyTm9kZSkge1xuICAgICAgY29udGFpbmVyTm9kZS5hcHBlbmRDaGlsZCh0aGlzLmdlb2NvZGVyLm9uQWRkKG1hcGJveE1hcCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcGJveE1hcC5hZGRDb250cm9sKHRoaXMuZ2VvY29kZXIsIFZBTElEX1BPU0lUSU9OUy5maW5kKChfcG9zaXRpb24pID0+IHBvc2l0aW9uID09PSBfcG9zaXRpb24pKVxuICAgIH1cblxuICAgIHRoaXMuZ2VvY29kZXIuc2V0SW5wdXQodGhpcy5jYWNoZWRSZXN1bHQpXG4gICAgb25Jbml0KHRoaXMuZ2VvY29kZXIpXG4gIH1cblxuICBnZXRNYXBib3hNYXAgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBtYXBSZWYgfSA9IHRoaXMucHJvcHNcblxuICAgIHJldHVybiAobWFwUmVmICYmIG1hcFJlZi5jdXJyZW50ICYmIG1hcFJlZi5jdXJyZW50LmdldE1hcCgpKSB8fCBudWxsXG4gIH1cblxuICBnZXRDb250YWluZXJOb2RlID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgY29udGFpbmVyUmVmIH0gPSB0aGlzLnByb3BzXG5cbiAgICByZXR1cm4gKGNvbnRhaW5lclJlZiAmJiBjb250YWluZXJSZWYuY3VycmVudCkgfHwgbnVsbFxuICB9XG5cbiAgc3Vic2NyaWJlRXZlbnRzID0gKCkgPT4ge1xuICAgIHRoaXMuZ2VvY29kZXIub24oJ2NsZWFyJywgdGhpcy5oYW5kbGVDbGVhcilcbiAgICB0aGlzLmdlb2NvZGVyLm9uKCdsb2FkaW5nJywgdGhpcy5oYW5kbGVMb2FkaW5nKVxuICAgIHRoaXMuZ2VvY29kZXIub24oJ3Jlc3VsdHMnLCB0aGlzLmhhbmRsZVJlc3VsdHMpXG4gICAgdGhpcy5nZW9jb2Rlci5vbigncmVzdWx0JywgdGhpcy5oYW5kbGVSZXN1bHQpXG4gICAgdGhpcy5nZW9jb2Rlci5vbignZXJyb3InLCB0aGlzLmhhbmRsZUVycm9yKVxuICB9XG5cbiAgdW5zdWJzY3JpYmVFdmVudHMgPSAoKSA9PiB7XG4gICAgdGhpcy5nZW9jb2Rlci5vZmYoJ2NsZWFyJywgdGhpcy5oYW5kbGVDbGVhcilcbiAgICB0aGlzLmdlb2NvZGVyLm9mZignbG9hZGluZycsIHRoaXMuaGFuZGxlTG9hZGluZylcbiAgICB0aGlzLmdlb2NvZGVyLm9mZigncmVzdWx0cycsIHRoaXMuaGFuZGxlUmVzdWx0cylcbiAgICB0aGlzLmdlb2NvZGVyLm9mZigncmVzdWx0JywgdGhpcy5oYW5kbGVSZXN1bHQpXG4gICAgdGhpcy5nZW9jb2Rlci5vZmYoJ2Vycm9yJywgdGhpcy5oYW5kbGVFcnJvcilcbiAgfVxuXG4gIHJlbW92ZUdlb2NvZGVyID0gKCkgPT4ge1xuICAgIGNvbnN0IG1hcGJveE1hcCA9IHRoaXMuZ2V0TWFwYm94TWFwKClcblxuICAgIHRoaXMudW5zdWJzY3JpYmVFdmVudHMoKVxuXG4gICAgaWYgKG1hcGJveE1hcCAmJiBtYXBib3hNYXAucmVtb3ZlQ29udHJvbCkge1xuICAgICAgdGhpcy5nZXRNYXBib3hNYXAoKS5yZW1vdmVDb250cm9sKHRoaXMuZ2VvY29kZXIpXG4gICAgfVxuXG4gICAgdGhpcy5nZW9jb2RlciA9IG51bGxcbiAgfVxuXG4gIGhhbmRsZUNsZWFyID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMub25DbGVhcigpXG4gIH1cblxuICBoYW5kbGVMb2FkaW5nID0gKGV2ZW50KSA9PiB7XG4gICAgdGhpcy5wcm9wcy5vbkxvYWRpbmcoZXZlbnQpXG4gIH1cblxuICBoYW5kbGVSZXN1bHRzID0gKGV2ZW50KSA9PiB7XG4gICAgdGhpcy5wcm9wcy5vblJlc3VsdHMoZXZlbnQpXG4gIH1cblxuICBoYW5kbGVSZXN1bHQgPSAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB7IHJlc3VsdCB9ID0gZXZlbnRcbiAgICBjb25zdCB7IG1hcFJlZiwgb25WaWV3cG9ydENoYW5nZSwgb25SZXN1bHQgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCB7IGlkLCBiYm94LCBjZW50ZXIsIHBsYWNlX25hbWUgfSA9IHJlc3VsdFxuICAgIGNvbnN0IFtsb25naXR1ZGUsIGxhdGl0dWRlXSA9IGNlbnRlclxuICAgIGNvbnN0IGJib3hFeGNlcHRpb25zID0ge1xuICAgICAgJ2NvdW50cnkuMzE0OCc6IHtcbiAgICAgICAgbmFtZTogJ0ZyYW5jZScsXG4gICAgICAgIGJib3g6IFtbLTQuNTkyMzUsIDQxLjM4MDAwN10sIFs5LjU2MDAxNiwgNTEuMTQ4NTA2XV1cbiAgICAgIH0sXG4gICAgICAnY291bnRyeS4zMTQ1Jzoge1xuICAgICAgICBuYW1lOiAnVW5pdGVkIFN0YXRlcycsXG4gICAgICAgIGJib3g6IFtbLTE3MS43OTExMTEsIDE4LjkxNjE5XSwgWy02Ni45NjQ2NiwgNzEuMzU3NzY0XV1cbiAgICAgIH0sXG4gICAgICAnY291bnRyeS4zMzAnOiB7XG4gICAgICAgIG5hbWU6ICdSdXNzaWEnLFxuICAgICAgICBiYm94OiBbWzE5LjY2MDY0LCA0MS4xNTE0MTZdLCBbMTkwLjEwMDQyLCA4MS4yNTA0XV1cbiAgICAgIH0sXG4gICAgICAnY291bnRyeS4zMTc5Jzoge1xuICAgICAgICBuYW1lOiAnQ2FuYWRhJyxcbiAgICAgICAgYmJveDogW1stMTQwLjk5Nzc4LCA0MS42NzUxMDVdLCBbLTUyLjY0ODA5OSwgODMuMjMzMjRdXVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCB3aWR0aCA9IG1hcFJlZi5jdXJyZW50LnByb3BzLndpZHRoXG4gICAgY29uc3QgaGVpZ2h0ID0gbWFwUmVmLmN1cnJlbnQucHJvcHMuaGVpZ2h0XG4gICAgbGV0IHpvb20gPSB0aGlzLmdlb2NvZGVyLm9wdGlvbnMuem9vbVxuXG4gICAgaWYgKCFiYm94RXhjZXB0aW9uc1tpZF0gJiYgYmJveCkge1xuICAgICAgem9vbSA9IGZpdEJvdW5kcyhbW2Jib3hbMF0sIGJib3hbMV1dLCBbYmJveFsyXSwgYmJveFszXV1dLCB7IHdpZHRoLCBoZWlnaHQgfSkuem9vbVxuICAgIH0gZWxzZSBpZiAoYmJveEV4Y2VwdGlvbnNbaWRdKSB7XG4gICAgICB6b29tID0gZml0Qm91bmRzKGJib3hFeGNlcHRpb25zW2lkXS5iYm94LCB7IHdpZHRoLCBoZWlnaHQgfSkuem9vbVxuICAgIH1cblxuICAgIGlmICh0aGlzLmdlb2NvZGVyLm9wdGlvbnMuZmx5VG8pIHtcbiAgICAgIG9uVmlld3BvcnRDaGFuZ2Uoe1xuICAgICAgICBsb25naXR1ZGUsXG4gICAgICAgIGxhdGl0dWRlLFxuICAgICAgICB6b29tLFxuICAgICAgICB0cmFuc2l0aW9uSW50ZXJwb2xhdG9yOiBuZXcgRmx5VG9JbnRlcnBvbGF0b3IoKSxcbiAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAzMDAwLFxuICAgICAgICBwbGFjZV9uYW1lXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBvblZpZXdwb3J0Q2hhbmdlKHsgbG9uZ2l0dWRlLCBsYXRpdHVkZSwgem9vbSB9KVxuICAgIH1cblxuICAgIG9uUmVzdWx0KGV2ZW50KVxuXG4gICAgaWYgKHJlc3VsdCAmJiByZXN1bHQucGxhY2VfbmFtZSkge1xuICAgICAgdGhpcy5jYWNoZWRSZXN1bHQgPSByZXN1bHQucGxhY2VfbmFtZVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgdGhpcy5wcm9wcy5vbkVycm9yKGV2ZW50KVxuICB9XG5cbiAgZ2V0R2VvY29kZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2VvY29kZXJcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXBSZWY6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb250YWluZXJSZWY6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgb25WaWV3cG9ydENoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICB6b29tOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgIGZseVRvOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBwbGFjZWhvbGRlcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBwcm94aW1pdHk6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgdHJhY2tQcm94aW1pdHk6IFByb3BUeXBlcy5ib29sLFxuICAgIGJib3g6IFByb3BUeXBlcy5hcnJheSxcbiAgICB0eXBlczogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjb3VudHJ5OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIG1pbkxlbmd0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBsaW1pdDogUHJvcFR5cGVzLm51bWJlcixcbiAgICBsYW5ndWFnZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBmaWx0ZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIGxvY2FsR2VvY29kZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIHBvc2l0aW9uOiBQcm9wVHlwZXMub25lT2YoVkFMSURfUE9TSVRJT05TKSxcbiAgICBvbkluaXQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uQ2xlYXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uTG9hZGluZzogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25SZXN1bHRzOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvblJlc3VsdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25FcnJvcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb3B0aW9uczogUHJvcFR5cGVzLm9iamVjdCAvLyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdjJcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgbWFwYm94QXBpQWNjZXNzVG9rZW46IGdldEFjY2Vzc1Rva2VuKCksXG4gICAgem9vbTogMTYsXG4gICAgZmx5VG86IHRydWUsXG4gICAgcGxhY2Vob2xkZXI6ICdTZWFyY2gnLFxuICAgIHRyYWNrUHJveGltaXR5OiBmYWxzZSxcbiAgICBtaW5MZW5ndGg6IDIsXG4gICAgbGltaXQ6IDUsXG4gICAgcG9zaXRpb246ICd0b3AtcmlnaHQnLFxuICAgIG9uSW5pdDogKCkgPT4ge30sXG4gICAgb25DbGVhcjogKCkgPT4ge30sXG4gICAgb25Mb2FkaW5nOiAoKSA9PiB7fSxcbiAgICBvblJlc3VsdHM6ICgpID0+IHt9LFxuICAgIG9uUmVzdWx0OiAoKSA9PiB7fSxcbiAgICBvbkVycm9yOiAoKSA9PiB7fVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdlb2NvZGVyXG4iXX0=
