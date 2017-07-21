import React, { Component, PropTypes } from "react";
import shallowCompare from "react-addons-shallow-compare";
import Image from "../generalpurpose/Image";
import get from "lodash/get";

class SeizeTheDeal extends Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    const 
      self = this,
      {data, dataDetails, params} = this.props,
      styles = typeof window === "undefined"?"":require( "../../resources/css/gizmos/seizethedeal/base.scss" );
    let
      classes = [ "seizethedeal-widget" ],
      widgetData = get( dataDetails, "[0]", {
        image:"",
        title:"",
        url:""
      }),
      
      markup = [
        <article key={0} className="image-then-content">
          <Image 
            url={widgetData.url}
            image={widgetData.image}
            title={params.title}/>
          <div className="content">
            <div className="carat"></div>
            <p>{widgetData.title}</p>
          </div>
        </article>,
        <p className="cto-container" key={1}>
          <a target="_blank" className="cto" href={widgetData.url}>Buy This Deal Now</a>
        </p>
      ],
      id = get( dataDetails, "info.id", "" );

    return(
      <div className="widget-content">{markup}</div>
    );
  }
}

export default SeizeTheDeal;