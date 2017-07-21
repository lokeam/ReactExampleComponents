import React from "react";
import shallowCompare from "react-addons-shallow-compare";
import {FormattedDateObj} from "../../utils/functions";

class WeatherCurrentWidget extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  parseTime( time ){
    return time.map(( dateItem, i )=>{
      if( isNaN( dateItem ) ){
        return " " + dateItem.toUpperCase();
      }else{
        if( i === 0 ){
          return parseInt( dateItem, 10 );
        }else if( i === 2 ){
          return  "";
        }
        return ":" + dateItem;
      }
    });
  }

  render(){
    let
      {data, dataDetails, params, blogInfo:{timeZone}} = this.props,
      currentZip = data[0],
      sponsorBanner = null,
      //sunriseDate = new FormattedDateObj( new Date( "March 13, 2017 " + dataDetails[currentZip].Sunrise ).getTime(), timeZone ),
      //sunsetDate = new FormattedDateObj( new Date( "March 13, 2017 " + dataDetails[currentZip].Sunset ).getTime(), timeZone ),
      today = new FormattedDateObj( new Date().getTime(), timeZone ),
      styles = {},
      sunriseMatch = dataDetails[currentZip].Sunrise.match( /[0-9a-z]+/g ),
      sunsetMatch = dataDetails[currentZip].Sunset.match( /[0-9a-z]+/g );
    
    sunriseMatch = this.parseTime( sunriseMatch ).join( "" );
    sunsetMatch = this.parseTime( sunsetMatch ).join( "" );

    if (dataDetails) {
      styles.weatherBG = {
        backgroundImage:"url('/wp-content/plugins/weather-widget/wicons/2016/bgs980/wx_"+ dataDetails[currentZip].IconCode +".jpg')"
      };
      styles.weatherIcon = {
        backgroundImage:"url('/wp-content/plugins/weather-widget/wicons/2016/icons/wx_"+ dataDetails[currentZip].IconCode +".svg')"
      };
    }
    return(
      <section className="weather-now outgrow">
        <div className="weather-icon-bg-container">
          <div className="weather-icon-bg" style={styles.weatherBG}>
            <div className="overlay-wrapper">
              <div className="color-overlay"></div>
              <div className="overlay-grad"></div>
            </div>
            <div className="weather-head">
              <h2 className="current-weather-temp">{ dataDetails[currentZip].TempF }&#176;</h2>
              <div className="weather-icon"></div>
            </div>
            <div className="weather-icon">
              <div className="weather-icon-lg" style={styles.weatherIcon}></div>
            </div>
            <p className="current-weather-description">{ dataDetails[currentZip].Sky }</p>
            <div className="div-table-sm">
              <div className="div-table-sm-body" >
                <div className="div-table-row">
                  <div className="div-table-cell div-table-col-sm">
                    <div className="div-table-cell current-weather-icon-sm iconcarbon-wind"></div>
                    <div className="div-table-cell current-weather-description-table">wind</div>
                    <div className="div-table-cell current-weather-percentage-table">{ dataDetails[currentZip].WndDirCardinal } { dataDetails[currentZip].WndSpdMph }mph</div>
                  </div>
                </div>

                <div className="div-table-row">
                  <div className="div-table-cell div-table-col-sm">
                    <div className="div-table-cell current-weather-icon-sm iconcarbon-humidity"></div>
                    <div className="div-table-cell current-weather-description-table">humidity</div>
                    <div className="div-table-cell current-weather-percentage-table">{ dataDetails[currentZip].RelHumidity }&#37;</div>
                  </div>
                </div>

                <div className="div-table-row">
                  <div className="div-table-cell div-table-col-sm">
                    <div className="div-table-cell current-weather-icon-sm iconcarbon-uvindex"></div>
                    <div className="div-table-cell current-weather-description-table">uv index</div>
                    <div className="div-table-cell current-weather-percentage-table">{dataDetails[currentZip].UvIdx}</div>
                  </div>
                </div>

                <div className="div-table-row">
                  <div className="div-table-cell div-table-col-sm">
                    <div className="div-table-cell current-weather-icon-sm iconcarbon-sunset"></div>
                    <div className="div-table-cell current-weather-description-table">sun</div>
                    <div className="div-table-cell current-weather-percentage-table">{sunriseMatch} to {sunsetMatch}</div>
                  </div>
                </div>

              </div>
            </div>
            <div className="current-weather-city">
              <div className="forecast-title">weather forecast</div>
              {/*<p className="forecast-city">{ params["weatherData"].weather_page_sponsor_city_name }</p>*/}
              <h1 className="forecast-city">{this.props.pageTitle}</h1>
              <div className="todays-date">{today.format( "l, F j" )}</div>
            </div>
          </div>
        </div>

      { params["weatherData"].isSponsorActive &&
        <div className='sponsor-banner'>
          <a href={params["weatherData"].weather_page_sponsor_image_link} target="_blank">
            <img src={params["weatherData"].weather_page_sponsor_image_url} />
          </a>
        </div>
      }

      </section>
    );

  }
}

export default WeatherCurrentWidget;