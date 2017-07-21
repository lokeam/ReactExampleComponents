import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import {MarkupHelper} from "../../utils/markup";

class TextWidget extends Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }
  render(){
    var
      {data, params} = this.props,
      markup = <div className="text-widget-inner" dangerouslySetInnerHTML={MarkupHelper.createInnerHtmlFromText( params.text ) }></div>,
      classes = [ "text-widget" ];
    return(
        <div className="widget-content">
          {markup}
        </div>
    );
  }
}

export default TextWidget;