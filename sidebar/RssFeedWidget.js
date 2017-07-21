import React from "react";
import shallowCompare from "react-addons-shallow-compare";
import Image from "../generalpurpose/Image";
import renderHTML from "react-render-html";
import truncate from "truncate";
import {UtilFunctions} from "../../utils/functions";

class RssFeedWidgetArticle extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  getHeader(){
    return <h2><span className="title-container">my header!</span></h2>;
  }

  render(){
    const
      {data, params} = this.props;

    let
      publishedDate = UtilFunctions.getFormattedDate( data.date ),
      title = data.title;
      //title = truncate( data.title, 60 );
    title = truncate( title.replace( /\&(amp;){1,}/g, "&" ), 75 );
    return(
      <article className="item-rss">
        { ( params.show_image=="1" && data.thumbnail && data.thumbnail !== "" ) && <Image 
          url={data.url}
          image={data.thumbnail}
          title={title}/>
        }
        <div className="content">
          <a href={data.url} className="title">{renderHTML( title )}</a>
          {params.show_date && <time>{publishedDate}</time>}
        </div>
      </article>
    );
  }
}

class RssFeedWidget extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    const
      self = this,
      {data, params, dataDetails} = this.props,
      sponsor = params.sponsor || {};
    let
      classes = [ "widget-content" ],
      markup = [],
      styles = {},
      sponsorContent = "",
      headerIconContent = [],
      headerContent = "",
      titleContent = [],
      hasSponsor = false,
      titleMarkup = [];

    if( params.show_rss_icon == "1" ){
      headerIconContent = <span className="header-icon"><a href={params.url} className="icon-feed icon-base"></a></span>;
    }
    if( params.link_title && params.title_url && params.title_url !== "" ){
      titleContent = <a href={params.title_url}>{params.title}</a>;
    }else{
      titleContent = <span>{params.title}</span>;
    }
    if( sponsor && sponsor.enabled === "on" ){
      hasSponsor = true;
      styles.backgroundImage = "url(" + sponsor.background_image + ")";
      styles.backgroundRepeat = sponsor.background_repeat && sponsor.background_repeat !== "" ? sponsor.background_repeat : "no-repeat";
      styles.backgroundColor = sponsor.background_color && sponsor.background_color!=="" ? sponsor.background_color : "transparent";
      sponsorContent = <a href={sponsor.sponsor_link} target="_blank"><img src={sponsor.sponsor_image}/></a>;
      classes.push( "has-sponsor" );
    }
    titleMarkup = <span className="title-container"><div className="rss-icon-wrap">{headerIconContent}{titleContent}</div></span>;

    headerContent = 
      <h2 style={styles}>
        {!hasSponsor && titleMarkup}
        {hasSponsor  && <span className="sponsor-container">{sponsorContent}{titleMarkup}</span>}
      </h2>;

    data.forEach(function( pid, i ){
      markup.push( <RssFeedWidgetArticle data={dataDetails[ pid ] } params={params} key={i}/> );
    });
    return(
      <div className={classes.join( " " )}>
        <header>{headerContent}{params.link_text && <a href={params.link_url || "#"} className="view-all">{params.link_text}</a>}</header>
        <div className="clearfix">
          {markup}
        </div>
      </div>
    );
  }
}

export default RssFeedWidget;