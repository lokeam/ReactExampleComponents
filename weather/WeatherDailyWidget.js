import React from "react";
import shallowCompare from "react-addons-shallow-compare";

class WeatherDailyWidget extends React.Component{
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

      let styles={};
      if (obj) {
        styles.weatherIcon = {
          backgroundImage:"url('/wp-content/plugins/weather-widget/wicons/2016/icons/wx_"+obj.IconCode+".svg')"
        };
      }
      return (
        <div key={"weatherdaily-"+index} className="look-ahead-day">
          <p className="day-title">{obj.DayOfWk}</p>
          <div className="weather-icon-md" style={styles.weatherIcon}></div>
          <div className="look-ahead-description-wrapper">
            <p className="look-ahead-description">{obj.SkyText}</p>
          </div>
          <p className="look-ahead-high-low-temp">
           {obj.HiTempF}&#176;/<span>{obj.LoTempF}&#176;</span>
          </p>
          <div className="look-ahead-precip">
            <div className="precip-icon iconcarbon-singledrop"></div>{obj.PrecipChance}&#37;
          </div>
        </div>
      );
    });

    return(
      <section className="weather-looking-ahead">
        <section className="sub-title"><h2 className="looking-ahead-title">looking ahead</h2></section>
        <div className="look-ahead-wrapper">
          {output}
        </div>
      </section>
    );

  }
}

export default WeatherDailyWidget;