import React, { Component } from 'react';
import MapGL, { FlyToInterpolator } from 'react-map-gl';
import openSocket from 'socket.io-client';
import 'mapbox-gl/dist/mapbox-gl.css';
import { IconLayer, PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';
import busicon from "./busicon.png";
import ControlPanel from './control-panel';


const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYXM0NzIiLCJhIjoiY2p3MGFmdnVoMDhiMDQwa3RkZno4Z2NncCJ9.MssP16N-csE73s0v2p_z8A';
const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 512, height: 512, mask: false, anchorY: 512 }
};

const ti=[
  {"coordinates":[77.5948906108398,12.97216124240571]},
  {"coordinates":[78.48546483100586,17.384278340817406]},
  {"coordinates":[88.37092748046871,22.58640277168946]},
  {"coordinates":[73.8629674,18.52465256713074]},
  {"coordinates":[72.88118614999996,19.08235902435526]},
  {"coordinates":[77.21357285039062,28.614848670334734]}
  
];
const INITIAL_VIEW_STATE = {
  latitude: 21.146633,
  longitude: 79.088860,
  zoom: 4,
  bearing: 0,
  pitch: 0,
  width: 100,
  height: 100
}

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 21.146633,
        longitude: 79.088860,
        zoom: 4.5,
        bearing: 0,
        pitch: 0,
        width: 100,
        height: 100
      },
      data: [],
      stops: [],
      stops1: [],
      hoveredObject: null,
      expandedObjects: null,
      x: 0,
      y: 0
    }
    this._onHover = this._onHover.bind(this);
    this._onClick = this._onClick.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._renderhoveredItems = this._renderhoveredItems.bind(this);
    this._myCallback = this._myCallback.bind(this);

  }


  _onHover(info) {
    
    const { x, y, object } = info;
    this.setState({ x, y, hoveredObject: object });
    }

  _onClick(info) {
    const { showCluster = true } = this.props;
    const { x, y, objects, object } = info;

    if (object && showCluster) {
      
      this.setState({viewport:{...this.state.viewport,latitude:object.latitude,longitude:object.longitude,zoom:12},x, y, expandedObjects: objects || [object], hoveredObject:null
        
      });
      
    } else {
      this._closePopup();
    }
  }

  _closePopup() {
    if (this.state.expandedObjects) {
      this.setState({ hoveredObject: null });
    }
  }

  _renderhoveredItems() {
    const { x, y, hoveredObject} = this.state;
    if (!hoveredObject) {
      return null;
    }
    return hoveredObject && (
      <div className="tooltip" style={{ left: x, top: y }}>
        {hoveredObject.vehicle_number}
      </div>
    );
  }

  async componentDidMount() {
    await
      fetch("https://service-panel-backend.shuttltech.com/api/v1/routes/125e9bde-22c0-4e5d-936d-66dcadc74174/path",
        {
          "credentials": "omit", "headers": {
            "accept": "application/json, text/plain, */*", "x-session-id":
              "633K4LTHCBNXWVS3DOGUW44MGH7ICKVOBNP7QUEVD5J3JRPBFVLWCZWGPESIXXV7NGNVR5RTD66X3OZYPKKOVC6DUYIBTBGVAOSEJYA"
          }
          , "referrer": "https://service-panel.shuttltech.com/trip/01a035d8-7436-43f4-b311-9ac3916af099", "referrerPolicy":
            "no-referrer-when-downgrade", "body": null, "method": "GET", "mode": "cors"
        })
        .then(_ => _.json())
        .then(json =>
          this.setState({
            data: [{ path: json.data.locations.map(item => [item.lng, item.lat])}],
            stops: json.data.way_points.map(item => [item.point.location.lng, item.point.location.lat])
          }));

    const socket = openSocket('http://127.0.0.1:5000');


    socket.emit('my event', {
      Arpit: "Hello!"
    })

    // socket.emit('my event', this.state.stops)
    socket.on('my response', dat => this.setState({ stops1: dat }))
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _onViewportChange = ({viewState}) => { this.setState({
    viewport: { ...this.state.viewport, ...viewState }
  });
  if (this.state.expandedObjects) {
    this.setState({ expandedObjects: null, hoveredObject: null });
  }
}



  

_renderLayers() {


  const layer2 = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data:ti,
    pickable: true,
    opacity: 0.4,
    stroked: true,
    filled: true,
    radiusScale: 6,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: d => d.coordinates,
    getRadius: d => 15000,
    getFillColor: d => [255, 85, 0],
    getLineColor: d => [0, 0, 0],
    onClick: d =>{
      console.log(d);
      this.setState({viewport:{latitude:d.coordinate[1],longitude:d.coordinate[0],zoom:9.1}})
    }
  });


    const layer = new PathLayer({
      id: 'path-layer',
      data: this.state.data,
      pickable: true,
      widthScale: 2,
      widthMinPixels: 2,
      opacity: 0.8,
      getPath: d => {
        return d.path
      },
      getColor: d => [255, 0, 0],
      getWidth: d => 4
    });

    const layer1 = new IconLayer({

      id: 'icon-layer',
      // data: Array(500).fill(this.state.stops1).flat(),
      data: this.state.stops1,
      pickable: true,
      iconAtlas: busicon,
      iconMapping: ICON_MAPPING,
      getIcon: d => 'marker',
      sizeScale: 15,
      // getPosition: (d, a) => [d.longitude + (a.index * 0.01), d.latitude + (a.index * 0.01)],
      getPosition: d => [d.longitude,d.latitude],
      getSize: d => 4,
      getColor: d => [14, 200, 50],
      onHover: this._onHover,
      onClick: this._onClick
    });
     
    if(this.state.viewport.zoom<6)
    return layer2;

    else if(this.state.expandedObjects )
    return [layer,layer1];
    else if(this.state.viewport.zoom>9)
    return layer1;
  }

  _myCallback(lat,lng,vehicle_number){
    this.setState({viewport:{...this.state.viewport,latitude:lat,longitude:lng,zoom:12}, expandedObjects:[{latitude:lat,longitude:lng,vehicle_number:vehicle_number,time:"00"}]})
  }

  _resize = () => this._onViewportChange({
    width: this.props.width || window.innerWidth,
    height: this.props.height || window.innerHeight
  });

  render() {
    const {viewport} = this.state;
    return (
      <div>
      <DeckGL
        viewState={viewport}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={this._renderLayers()}
        onViewStateChange={this._onViewportChange}
        
        >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                   mapStyle={"mapbox://styles/mapbox/dark-v9"} />

      {this._renderhoveredItems}
      </DeckGL>
      <ControlPanel
      containerComponent={this.props.containerComponent}
      propp={this.state}
      onn={this._myCallback}
      
    />

    </div>
    );

  }
}