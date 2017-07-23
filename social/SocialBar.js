import React from "react";
import {fireEvent} from "../../api";
import clone from "lodash/clone";

class SocialButton extends React.Component{
  getName( type ){
    var names = {
      fb:"facebook",
      tw:"twitter"
    };
    return names[ type ] || type;
  }

  render(){
    var
      // attrs = lodash.clone( this.props ),
      attrs = clone( this.props ),
      classNames = attrs.className || "",
      buttonName = this.getName( this.props.buttonType ),
      classes = [ ...new Set( [].concat( classNames.split( " " ), [ "social-icon", "icon-" + buttonName, this.props.buttonType ] ) ) ].join( " " );
    if( attrs.url ){
      attrs.href = attrs.url;
      delete attrs.url;
    }
    delete attrs.class;
    delete attrs.className;
    delete attrs.buttonType;
    delete attrs[ "count-layout" ];

    return (
      <li>
        {/*<a href={info.href||info.url} target="_blank" data-social={buttonName} title={info.title}>*/}
        <a {...attrs}>
          <span className={classes}><span className="share-title">{attrs.title}</span></span>
        </a>
      </li>
    );
  }
}

class SocialBar extends React.Component{
  constructor (props) {
    super(props);
    this.socialClicked = this.socialClicked.bind(this);
  }
  isButtonAvailable( type, pos = "top", force = false ){
    let
      types = [ "fb", "tw", "email", "pinterest", "reddit" ];
      //types = [ "fb", "tw" ];
    if( pos === "side" ){
      types = [ "email", "fb", "tw", "pinterest", "print" ];
    }else if( pos === "showtop" ){
      types = [ "email", "fb", "tw" ];
    }
    if( force ){
      return 1;
    }
    return types.indexOf( type )===-1?0:1;
  }

  socialClicked(winDetail) {
    this.props.onClickCb( winDetail );
    fireEvent({
      data:{
        eventCategory: "social",
        eventAction: winDetail,
        eventLabel: this.props.name
      },
      ga:{},
      ca:{}
    });
  }

  render(){
    let
      {social, type} = this.props;
    type = type || "bignsexy";
    const socialMessageMap = {
      fb: "Facebook Share",
      tw: "Twitter Share",
      pinterest: "Pin-it",
      email: "Email"
    };

    return(
      <div className={"social-share " + type}>
        <div className="social-bar social-icons">
          <ul>
            {
              Object.keys( social ).map( ( buttonType, i ) => {
                if( social[ buttonType ] !== null && typeof social[ buttonType ] === "object" && this.isButtonAvailable( buttonType, this.props.pos ) ){
                  //return self.getButton( buttonType, requestedButtons[ buttonType ] );
                  return <SocialButton
                      buttonType={buttonType}
                      {...social[ buttonType ]}
                      key={i}
                      onClick={(e)=>this.socialClicked(socialMessageMap[buttonType])}
                    />;
                }
                return "";
              })
              .filter(
                function( button ){
                  if( button === "" ){
                    return false;
                  }
                  return true;
                }
              )
            }
          </ul>
        </div>
      </div>

    );
  }
}
SocialBar.defaultProps = {
  pos: "top"
};
export default SocialBar;


