import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import shallowCompare from "react-addons-shallow-compare";
import {debouncedScrollHandler, hyperScollHandler, inViewport} from "../../api";

import get from "lodash/get";


class LazyLoad extends React.Component{
  constructor( props ){
    super( props );
    this.state = {
      inView:false
    };
    this.onScrollHandler = this.onScrollHandler.bind( this );
  }
  
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  componentDidMount(){
    let 
      elem = ReactDOM.findDOMNode( this ),
      offsetY = get( this.props, "offsetY", 0 ),
      inView = inViewport( elem, offsetY ),
      scrollHandlerType = get( this.props, "scrollHandlerType", "debounce" );

    this.scrollHandler = scrollHandlerType === "debounce" ? debouncedScrollHandler : hyperScollHandler;
    this.elem = elem;

    if( !inView ){
      if( this.cbId === undefined ){
        this.cbId = this.scrollHandler.addToEventQ( this.onScrollHandler );
      }
    }else{
      this.setState({
        inView:inView
      });
    }
  }
  
  componentWillUnmount(){
    if( this.cbId !== undefined ){
      this.scrollHandler.removeFromEventQ( this.cbId );
    }
  }

  onScrollHandler(){
    let
      offsetY = get( this.props, "offsetY", 0 ),
      inView = inViewport( this.elem || ReactDOM.findDOMNode( this ), offsetY );
    if( inView ){
      this.scrollHandler.removeFromEventQ( this.cbId );
      this.cbId = null;
      this.setState({
        inView:inView
      });
    }
  }

  render(){
    if( this.state.inView || this.props.forceRender ){
      return this.props.children;
    }else{
      const
        {width, height, className} = this.props;
      let
        styles = {},
        classes = [ "lazyload-placeholder" ];
      if( width ){
        styles.width = width;
      }
      if( height ){
        styles.height = height;
      }
      if( className ){
        classes.push( className );
      }
      return <div style={styles} className={classes.join( " " )}></div>;
    }
  }
}

export default LazyLoad;