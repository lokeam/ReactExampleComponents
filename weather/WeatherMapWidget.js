import React from "react";
import shallowCompare from "react-addons-shallow-compare";
import ReactDOM from "react-dom";

class WeatherMapWidget extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }
  componentDidMount(){
    let
      mapWrapper = ReactDOM.findDOMNode( this ),
      mapContainer = mapWrapper.querySelector( ".map-container" ),
      {data, dataDetails, info, params} = this.props,
      currentZip = data[0],
      weatherLocation = dataDetails[ currentZip ].weatherLocation,
      mapMarkup = "<wx:map scriptId='wxMap' memberId='1300' mapId='0001' templateId='0011' latitude='" + weatherLocation.Latitude + "' longitude='" + weatherLocation.Longitude + "' zoomLevel='8' enableWeather='true' basemap='1102'/>";
    mapContainer.innerHTML = mapMarkup;
  }
  render(){
    return(
      <section className="map-wrapper embed-wrapper misc-embed">
        <script type="text/javascript" src="http://widgets.wsi.com/1.1/wx.loader.min.js?cid=552173495"></script>
        <div className="map-container">
        </div>
      </section>
    );
  }
}

export default WeatherMapWidget;