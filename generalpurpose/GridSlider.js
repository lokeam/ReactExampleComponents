import React, { Component, PropTypes } from "react";
import shallowCompare from "react-addons-shallow-compare";

import classNames from "classnames";
import {triggerScrollCheck, throttledResizeHandler} from "../../api";

class GridSlider extends Component{
  constructor( props ){
    super( props );
    this.state = {
      currentPosition: 0,
      lastAction: false
    };
    this.onResizeHandler = this.onResizeHandler.bind( this );
  }

  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }
  componentWillMount(){
    this.setState({
      currentPosition: 0,
      lastAction: false
    });
  }

  /*componentWillReceiveProps( nextProps ){
    const
      {children, windowSize, parentId, ui} = this.props,
      currentPosition = lodash.get( ui, parentId + ".currentPosition", 0 ),
      nextItemIndex = currentPosition + windowSize;
    if( children[ nextItemIndex ] ){
      triggerScrollCheck();
    }
  }*/
  componentDidMount(){
    if( typeof window !== "undefined" ){
      if( this.cbId === undefined ){
        this.cbId = throttledResizeHandler.addToEventQ( this.onResizeHandler );
      }
    }
  }
  componentDidUpdate( prevProps, prevState ){
    const
      {children, windowSize} = this.props,
      nextItemIndex = this.state.currentPosition + windowSize - 1;
    if( children[ nextItemIndex ] ){
      triggerScrollCheck();
    }
  }
  componentWillUnmount(){
    if( this.cbId ){
      throttledResizeHandler.removeFromEventQ( this.cbId );
    }
  }

  getAdjustment( currentPosition = this.state.currentPosition ){
    if( this.container ){
      let
        {windowSize} = this.props,
        adjustment = 0,
        styles = {},
        items = this.container.querySelectorAll( "article" ),
        nextItemIndex = currentPosition + windowSize;
      for( let i=0;i<currentPosition; i++ ){
        adjustment += items[ i ].clientWidth;
      }
      return adjustment;
    }
    return 0;
  }

  onResizeHandler(){
    //styles[ "transform" ] = "translateX(-" + adjustment + "px)";
    this.setState({
      transform: "translateX(-" + this.getAdjustment() + "px)"
    });
  }

  onSliderClick( command ){
    let nextState = {};
    if( command === "next" ){
      nextState = {
        currentPosition: ( this.state.currentPosition < this.props.totalItems - this.props.windowSize ) ? ( this.state.currentPosition + 1 ) : this.state.currentPosition,
        lastAction:"next"
      };
    }else if( command === "prev" ){
      nextState = {
        currentPosition: this.state.currentPosition > 0 ? ( this.state.currentPosition - 1 ) : this.state.currentPosition,
        lastAction:"prev"
      };
    }
    nextState.transform = "translateX(-" + this.getAdjustment( nextState.currentPosition ) + "px)";
    this.setState( nextState );
  }

  render(){
    const
      {children, totalItems, windowSize} = this.props,
      currentPosition = this.state.currentPosition;
    
    let 
      {className} = this.props,
      styles = {},
      adjustment = 0;
    /*if( typeof window !== "undefined" && this.container ){
      let
        items = this.container.querySelectorAll( "article" ),
        nextItemIndex = currentPosition + windowSize;
      for( let i=0;i<currentPosition; i++ ){
        adjustment += items[ i ].clientWidth;
      }
    }
    styles[ "transform" ] = "translateX(-" + adjustment + "px)";
    this.setState({
      transform: "translateX(-" + adjustment + "px)"
    });*/
    styles.transform = this.state.transform;
    className = classNames( "slider grid-slider ", className, {
      "single-item": children.length <= this.props.windowSize  
    });
    return (
      <div className={className} ref={ (ref) => {this.container = ref;} }>
        <div className="mover" style={styles}>
          {children}
        </div>
        {/*<div className="previous arrow round icon-base icon-arrow-thin-left" onClick={(e)=>onSliderClick( "prev", parentId, {totalItems, windowSize} ) }></div>
        <div className="next arrow round icon-base icon-arrow-thin-right" onClick={(e)=>onSliderClick( "next", parentId, {totalItems, windowSize} ) }></div>*/}
        <div className="previous arrow round icon-base icon-arrow-thin-left" onClick={(e)=>this.onSliderClick( "prev" )}></div>
        <div className="next arrow round icon-base icon-arrow-thin-right" onClick={(e)=>this.onSliderClick( "next" )}></div>
      </div>
    );
  }
}
GridSlider.defaultProps = {
  windowSize:3
};

/*function mapStateToProps(state) {
  return {
    ui:state.ui
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({onSliderClick:gridSliderClick}, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )(GridSlider);*/
export default GridSlider;