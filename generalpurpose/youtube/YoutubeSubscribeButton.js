import React from "react";
import {findDOMNode, render} from "react-dom";
import shallowCompare from "react-addons-shallow-compare";

class YoutubeSubscribeButton extends React.Component {
  constructor( props, context ){
    super( props );
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  componentDidMount(){
    if( typeof window !== "undefined" && window.gapi && this.props.channel ){
      window.gapi.ytsubscribe.render( findDOMNode( this ), {
        channel: this.props.channel,
        count: this.props.count,
        layout: this.props.layout,
        theme: this.props.theme
      });
    }
  }
  render(){
    return(
      React.createElement( this.props.component, {className: "youtube-subscribe-button " + ( this.props.className || "" )}, null )
    );
  }
}

YoutubeSubscribeButton.defaultProps = {
  count: "hidden",
  layout: "default",
  theme: "default",
  component: "span"
};

export default YoutubeSubscribeButton;