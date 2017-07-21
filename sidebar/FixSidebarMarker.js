import React from "react";
import shallowCompare from "react-addons-shallow-compare";

class FixSidebarMarker extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    return <div className={this.props.info.groupType}></div>;
  }
}

export default FixSidebarMarker;