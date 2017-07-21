import React, { Component, PropTypes } from "react";
class WidgetError extends Component{
  constructor (props) {
    super(props);
  }

  render(){
    if( this.props.env === "production" ){
      return(
        <div className="widget error" data-message={"missing widget data "+this.props.info.groupType}></div>
      );
    }
    return (
      <div className="widget error">missing widget data {this.props.info.groupType}</div>
    );
  }
}
export default WidgetError;