import React from "react";
import shallowCompare from "react-addons-shallow-compare";
import Newsletter from "../generalpurpose/Newsletter";

class NewsletterWidget extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    return(
      <div className="widget-content">
        <Newsletter {...this.props}/>
      </div>
    );
  }
}

export default NewsletterWidget;