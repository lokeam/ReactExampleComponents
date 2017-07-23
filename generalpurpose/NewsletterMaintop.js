import React from "react";
import shallowCompare from "react-addons-shallow-compare";
import classNames from "classnames";
import get from "lodash/get";
import Newsletter from "./generalpurpose/Newsletter";

class NewsletterMaintop extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    const
      id = get( this.props, "info.id", "" ),
      alignVal = get( this.props, "params.align", "right" ),
      align = alignVal === "" ? "right" : alignVal,
      className = classNames( get( this.props, "info.groupType", "" ), {
        "align-left": align === "left",
        "align-right": align === "right"
      });
    return(
      <section {...{className, id}}>
        <Newsletter {...this.props} showDescription={true}/>
      </section>
    );
  }
}

export default NewsletterMaintop;