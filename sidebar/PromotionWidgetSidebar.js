import React, { Component } from "react";
import get from "lodash/get";
import Image from "../generalpurpose/Image";
import shallowCompare from "react-addons-shallow-compare";

class PromotionWidgetItem extends Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }
  render(){
    const
      {type, showImage} = this.props,
      {description, image_url, link_label, link_target, link_url, nofollow_toggle} = this.props.data;
    let
      widgetClass = "image-then-content",
      classes = [],
      text = description;
    if( type === "links_list" ){
      let
        attrs = {
          href: link_url || "#",
          target: link_target || "_self"
        };
      if( nofollow_toggle ){
        attrs.rel = "nofollow";
      }
      text = <a {...attrs}>{link_label}</a>;
      widgetClass = "links-only";
    }
    //if( type === "overlay" ){ //need to ask about the aspect ratios of this thing
    classes.push( "imgtag" );
    //}
    return(
      <article className={widgetClass}>
        {( showImage && image_url ) &&
          <Image
            url={link_url}
            image={image_url}
            target={link_target}
            classes={classes}
            useImageTag={true}
          />
        }
        <div className="content">
          {showImage && <div className="carat"></div>}
          <p>{text}</p>
        </div>
      </article>
    );
  }
}
PromotionWidgetItem.defaultProps = {
  showImage: true
};
class PromotionWidgetSidebar extends Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    const
      {data, dataDetails, params} = this.props,
      // id = lodash.get(dataDetails, "info.id", "" );
      id = get(dataDetails, "info.id", "" );
    let
      markup = [],
      title = "",
      classes = [ "widget-content", params.type ],
      showImage = true;

    markup = data.map(function( item, i ){
      if( params.type === "links_list" ){
        showImage = false;
      }
      return <PromotionWidgetItem data={dataDetails[ item ]} type={params.type} {...{showImage}}key={i}/>;
    });

    if( params.title && params.title !== "" ){
      title = params.title;
    }
    if( params.type === "single" ){
      let
        dataId = data[0],
        // link_label = lodash.get( dataDetails, dataId + ".link_label", "" ),
        link_label = get( dataDetails, dataId + ".link_label", "" ),
        // link_target = lodash.get( dataDetails, dataId + ".link_target", "_self" ),
        link_target = get( dataDetails, dataId + ".link_target", "_self" ),
        // link_url = lodash.get( dataDetails, dataId + ".link_url", "javascript:void(0);" );
        link_url = get( dataDetails, dataId + ".link_url", "javascript:void(0);" );
      if( link_label !== "" ){
        markup.push( <p className="cto-container" key={"cto"+dataId}><a className="cto" target={link_target} href={link_url}>{link_label}</a></p> );
      }
    }
    return(
      <div className={classes.join( " " )}>{markup}</div>
    );
  }
}

export default PromotionWidgetSidebar;