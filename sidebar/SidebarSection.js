import React, { Component, PropTypes } from "react";
import shallowCompare from "react-addons-shallow-compare";
import classNames from "classnames";
import {getSidebarWidget} from "./";
import get from "lodash/get";
import WidgetError from "./WidgetError";

let nonEmptyDataWidgets = [
  "weather-widget-current"
];
class SidebarSection extends Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    const
      {data, dataDetails, info, params, env} = this.props,
      groupType = info.groupType || "",
      // type = lodash.get( params, "type", "" ),
      type = get( params, "type", "" ),
      selectedWidget = groupType === "ts_blogroll" ? getSidebarWidget( groupType, type ) : getSidebarWidget( groupType ),
      Widget = selectedWidget ? selectedWidget.component : WidgetError;
    let
      isError = selectedWidget ? false : true;
    
    if( nonEmptyDataWidgets.indexOf( groupType ) > -1 && ( !data || !data.length ) ){
      isError = true;
    }
    if( isError ){
      return <WidgetError {...this.props} />;
    }

    let 
      showHeader = selectedWidget.showHeader === undefined ? true : selectedWidget.showHeader,
      sponsorContent = [],
      sponsorStyles = {},
      hasSponsor = false,
      titleMarkup = <span className="title-container">{params.title}</span>,
      classes = [ "sidebar-section", "widget-" + groupType ].concat( this.props.classes || [] );
    if( Widget && params.sponsor ){
      showHeader = true;
    }
    if( params.sponsor && params.sponsor.enabled === "on" ){
      hasSponsor = true;
      classes.push( "has-sponsor" );
      let
        {sponsor} = params;
      if( sponsor.background_image && sponsor.background_image !== "" ){
        sponsorStyles.backgroundImage = "url(" + sponsor.background_image + ")";
      }
      sponsorStyles.backgroundRepeat = sponsor.background_repeat && sponsor.background_repeat !== "" ? sponsor.background_repeat : "no-repeat";
      if( sponsor.background_color && sponsor.background_color !== "" ){
        sponsorStyles.backgroundColor = sponsor.background_color;
      }
      sponsorContent = <a href={sponsor.sponsor_link} target="_blank"><img src={sponsor.sponsor_image}/></a>;
    }
    let
      headerContent = !showHeader ? [] : ( selectedWidget && selectedWidget.ownHeader ? [] : 
        <header>
          <h2 style={sponsorStyles}>
            {!hasSponsor && titleMarkup}
            {params.link_text && <a href={params.link_url || "#"} className="view-all">{params.link_text}</a>}{/*accounting for rss feed widgets*/}
            {params.link_label && <a href={params.link || "#"} className="view-all">{params.link_label}</a>}{/*accounting for blogroll wudgets*/}
            {hasSponsor && <span className="sponsor-container">{sponsorContent}{titleMarkup}</span>}
          </h2>
        </header> ),
      headerIconContent = false,
      titleContent = false,
      styles = {};


    return(
      <section className={classNames( classes )} id={info.id}>
        {params.title && headerContent}
        <div className="wrapper clearfix">
          <Widget {...this.props} hasSponsor={hasSponsor}/>
        </div>
      </section>
    );
  }
}

export default SidebarSection;