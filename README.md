# react-map-gl-geocoder

React wrapper for mapbox-gl-geocoder for use with react-map-gl.

## Demo

https://codesandbox.io/s/vv29y730q3

## Installation
NPM
```
$ npm install react-map-gl-geocoder
```

or

Yarn
```
$ yarn add react-map-gl-geocoder
```


## Example
```js
import 'mapbox-gl/dist/mapbox-gl.css'
import React, { Component } from 'react'
import MapGL from 'react-map-gl'
import { getAccessToken } from 'react-map-gl/dist/mapbox/mapbox'
import Geocoder from 'react-map-gl-geocoder'

// Ways to set Mapbox token: https://uber.github.io/react-map-gl/#/Documentation/getting-started/about-mapbox-tokens
const MAPBOX_TOKEN = getAccessToken()

class Example extends Component {
  state = {
    viewport: {
      width: 400,
      height: 400,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    }
  }

  mapRef = React.createRef()

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this))
    this._resize()
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  _onViewportChange = (viewport) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    })
  }

  render() {
    return (
      <MapGL
        ref={this.mapRef}
        {...this.state.viewport}
        onViewportChange={this._onViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <Geocoder mapRef={this.mapRef} onViewportChange={this._onViewportChange} mapboxApiAccessToken={MAPBOX_TOKEN} />
      </MapGL>
    )
  }
}

export default Example

```

![react-map-gl-geocoder example screenshot](react-map-gl-geocoder-screenshot.png)
