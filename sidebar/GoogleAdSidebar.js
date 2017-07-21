import React from "react";
import shallowCompare from "react-addons-shallow-compare";
import GoogleAd from "../generalpurpose/GoogleAd";

class GoogleAdSidebar extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }
  render(){
    let
      {data, dataDetails} = this.props,
      toRender = [];
    if( data && data[0] ){
      toRender = <GoogleAd adObj={this.props.adObj} adUnit={data[0]} adGroup="scrollRefresh"/>;
    }
    return(
      <div className="widget-content">
        {toRender}
      </div>
    );
  }
}

export default GoogleAdSidebar;