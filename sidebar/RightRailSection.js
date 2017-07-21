import React, { Component, PropTypes } from "react";

class RightRailSection extends Component{
  render(){
    if( typeof window !== "undefined" ){
      ///let styles = require( "../../resources/css/gizmos/sidebarsection/base.less" );
    }
    const
      {title, titleLink, viewall, viewallLink, content, id, headerIcon, sponsor} = this.props;
    let
      classes = [ "sidebar-section" ].concat( this.props.classes || [] ),
      headerContent,
      headerIconContent = false,
      sponsorContent = false,
      titleContent = false,
      styles = {};
    if( headerIcon ){
      headerIconContent = <span className="header-icon">{headerIcon}</span>;
    }
    if( titleLink && titleLink !== "" ){
      titleContent = <a href={titleLink}>{title}</a>;
    }else{
      titleContent = <span>{title}</span>;
    }
    if( sponsor && sponsor.enabled === "on" ){
      styles.backgroundImage = "url(" + sponsor.background_image + ")";
      styles.backgroundRepeat = sponsor.background_repeat && sponsor.background_repeat !== "" ? sponsor.background_repeat : "no-repeat";
      styles.backgroundColor = sponsor.background_color && sponsor.background_color!=="" ? sponsor.background_color : "transparent";
      sponsorContent = <a href={sponsor.sponsor_link}><img src={sponsor.sponsor_image}/></a>;
      classes.push( "has-sponsor" );
    }
    
    headerContent = <h2 style={styles}><span className="title-container">{headerIconContent && headerIconContent}{titleContent && titleContent}</span>{sponsorContent && <span className="sponsor-container">{sponsorContent}</span>}</h2>;
    
    
    return(
      <section className={classes.join( " " )} id={id?id:""}>
        {title && 
          <header>
            {headerContent}
            {viewall &&
              <a href={viewallLink || "#"} className="view-all">{viewall}</a>
            }
          </header>
        }
        <div className="wrapper">
          {content}
        </div>
      </section>
    );
  }
}

export default RightRailSection;