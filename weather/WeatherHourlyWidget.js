import React from "react";
import shallowCompare from "react-addons-shallow-compare";
import moment from "moment";

class WeatherHourlyWidget extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    let
      {data, dataDetails, info, params, weatherData} = this.props,
      currentZip = data[0];

    let output = dataDetails[currentZip].map(function(obj, index) {
      let

        styles = {},
        reportTime;
      if (obj) {
        reportTime = moment( obj.ValidDateLocal, "M/D/YYYY h:mm:ss A" );
        styles.weatherIcon = {
          backgroundImage:"url('/wp-content/plugins/weather-widget/wicons/2016/icons/wx_"+obj.IconCode+".svg')"
        };
      }

      return (
        <div key={"weatherhouly-"+index} className="div-table-row">
          <div className="div-table-cell div-table-col div-table-time">
            <div className="weather-hourly-text">{reportTime.format("h:mm a")}</div>
            <div className="weather-hourly-date">{reportTime.format("ddd[,] MMM D")}</div>
            <div className="weather-icon-sm" style={styles.weatherIcon}></div>
          </div>
          <div className="div-table-cell div-table-description">{obj.SkyMedium}</div>
          <div className="div-table-cell div-table-temp">{obj.TempF}&#176;</div>
          <div className="div-table-cell">{obj.PrecipChance}&#37;</div>
          <div className="div-table-cell">{obj.RelHumidity}&#37;</div>
          <div className="div-table-cell">{obj.WndDirCardinal} {obj.WndSpdMph} mph</div>
        </div>
      );
    });


    return(
      <section className="weather-hourly">
        <section className="sub-title"><h2 className="weather-hourly-title">hourly forecast</h2></section>
        <div className="div-table-lg">
          <div className="div-table-body">
            <div className="div-table-row div-table-heading">
             <div className="div-table-cell">time</div>
             <div className="div-table-cell">description</div>
             <div className="div-table-cell">temp</div>
             <div className="div-table-cell">precip</div>
             <div className="div-table-cell">humidity</div>
             <div className="div-table-cell">wind</div>
            </div>
            {output}
          </div>
        </div>
      </section>
    );
  }
}

export default WeatherHourlyWidget;