import React from "react";
import shallowCompare from "react-addons-shallow-compare";
import {FormattedDateObj} from "../../utils/functions";

class WeatherWidgetCurrent extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    let
      {data, dataDetails, params} = this.props,
      currentZip = data[0],
      sponsorBanner = null,
      styles = {},
      currentDay = dataDetails[currentZip].dailyForecast.ValidDateLocal,
      dateObj = new FormattedDateObj( new Date( currentDay ) ),
      formattedDay = dateObj.format( "l, F j" ) + dateObj.format( "S" );

    if (dataDetails) {
      styles.weatherBG = {
        backgroundImage:"url('/wp-content/plugins/weather-widget/wicons/2016/bgs980/wx_"+ dataDetails[currentZip].currentObservation.IconCode +".jpg')"
      };
      styles.weatherIcon = {
        backgroundImage:"url('/wp-content/plugins/weather-widget/wicons/2016/icons/wx_"+ dataDetails[currentZip].currentObservation.IconCode +".svg')"
      };
    }
    return(
      <div className="widget-content">
        <div className="weather-sidebar-icon-bg-container">
          <div className="weather-sidebar-icon-bg" style={styles.weatherBG}>
            <div className="overlay-wrapper">
              <div className="color-overlay"></div>
            </div>
            <div className="weather-head">
              <h2>{dataDetails[currentZip].location.Name}, {dataDetails[currentZip].location.StateAbbr}</h2>
              <p>{formattedDay}</p>
            </div>
            <div className="weather-icon">
              <div className="weather-sidebar-icon" style={styles.weatherIcon}></div>
            </div>
            <h2 className="current-temperature">{dataDetails[currentZip].currentObservation.TempF}&#176;</h2>
            <p className="current-weather-description">{dataDetails[currentZip].currentObservation.Sky}</p>
            <p className="look-ahead-high-low-temp">
              {dataDetails[currentZip].dailyForecast.HiTempF}&#176;/<span>{dataDetails[currentZip].dailyForecast.LoTempF}&#176;</span>
            </p>
            <div className="sidebar-sponsor-banner clearfix">
              <div className="cto-container"><a className="cto" target="_self" href={params.linkUrl}>view forecast</a></div>
              <div className="sponsor-sidebar-corner">
                <span className="sidebar-sponsored-by">{params.sponsoredText}</span>
                <span className="sidebar-sponsor-url">
                  <a target="_blank" href={params.sponsoredByLink}>{params.sponsoredBy}</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  }
}

export default WeatherWidgetCurrent;