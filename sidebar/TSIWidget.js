import React, { Component, PropTypes } from "react";
import shallowCompare from "react-addons-shallow-compare";
import Image from "../generalpurpose/Image";
import get from "lodash/get";

class TSIWidget extends Component{
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
      styles = typeof window === "undefined"?"":require( "../../resources/css/gizmos/tsiwidget/base.scss" );
    let
      classes = [ "tsi-widget" ],
      widgetData = get( dataDetails, "[0].desktop" ),
      labels = widgetData.label.map(function( item, i ){
        return <li key={i}>{item}</li>;
      }),
      markup = [
        <article key={0} className="image-then-content">
          <Image 
            url={widgetData.url}
            image={widgetData.thumbnail}
            title={params.title}/>
          <div className="content">
            <div className="carat"></div>
            <ul>
              {labels}
            </ul>
          </div>
        </article>,
        <p className="cto-container" key={1}>
          <a className="cto" target="_self" href={widgetData.url}>Get an Edge on the Competition Today!</a>
        </p>
      ],
      id = get( dataDetails, "info.id", "" );

    return(
       <div className="widget-content">{markup}</div>
    );
  }
}

export default TSIWidget;