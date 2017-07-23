import React, { Component, PropTypes } from "react";

class LoadingAnim extends Component{
  render(){
    if (typeof window !== "undefined"){
      let a = require( "../../resources/css/gizmos/misc/loadinganim.scss" );
    }
    const 
      { width, color, strokeWidth=2} = this.props,
      height = width;
    let
      id = this.props.id | "",
      styleOverride = "width:" + width;
    return (
      <div className="loadinganim showbox" id={id}>
        <div className="loader" style={{width, height}}>
          <svg className="circular" viewBox="25 25 50 50" style={{width, height}}>
            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth={strokeWidth} strokeMiterlimit="10" style={{stroke:color}}/>
          </svg>
        </div>
      </div>
    );
  }
}

export default LoadingAnim;