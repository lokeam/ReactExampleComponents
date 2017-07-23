import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import ReactDOM from "react-dom";
import shallowCompare from "react-addons-shallow-compare";

class Slider extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      currentItem: 0,
      isInteracted: false,
      lastAction: false
    };
  }
  
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  componentWillMount(){
    this.setState({
      currentItem: 0,
      isInteracted: false,
      lastAction: false
    });
  }

  maybyInitAutoplay(){
    if( typeof window !== "undefined" ){
      const {autoplay, autoplayDuration} = this.props;
      if( autoplay ){
        //sliderStartAutoplay( parentId, {totalItems} );
        if( !this.sliderTimer ){
          this.sliderTimer = setInterval( () => {
            if( !this.state.isInteracted ){
              this.onSliderClick( "next" );
            }
          }, autoplayDuration );
        }
      }
    }
  }

  componentDidMount(){
    this.maybyInitAutoplay();
  }

  componentWillUnmount(){
    if( this.sliderTimer ){
      clearInterval( this.sliderTimer );
    }
  }

  componentsWillReceiveProps( nextProps ){console.log( nextProps );
    if( nextProps.autoplay !== this.props.autoplay ){
      if( nextProps.autoplay ){
        this.maybyInitAutoplay();
      }else{
        if( this.sliderTimer ){
          clearInterval( this.sliderTimer );
        }
      }
    }
  }

  onSliderClick( command ){
    let transitioningElements = ReactDOM.findDOMNode( this ).querySelector( ".carousel-enter-active" );
    if( !transitioningElements ){
      if( command === "next" ){
        this.setState({
          currentItem:( this.state.currentItem === this.props.totalItems - 1 ) ? 0 : ( this.state.currentItem + 1 ),
          lastAction:"next"
        });
      }else if( command === "prev" ){
        this.setState({
          currentItem:( this.state.currentItem === 0 ) ? ( this.props.totalItems - 1 ) : ( this.state.currentItem - 1 ),
          lastAction:"prev"
        });
      }
    }
  }

  onSliderInteract( command ){
    if( command === "enter" ){
      this.setState({
        isInteracted: true
      });
    }else if( command === "leave" ){
      this.setState({
        isInteracted: false
      });
    }
  }

  render(){
    const
      {className, items, totalItems, transitionType, showControls, addEnterLeaveEvents} = this.props,
      currentItem = this.state.currentItem,//lodash.get( ui, parentId + ".currentItem", 0 ),
      lastAction = this.state.lastAction;//lodash.get( ui, parentId + ".lastAction", "" );
    let
      classes = [ "slider" ].concat( this.props.classes ),
      moverClasses = [ "mover", transitionType ],
      styles = {},
      enterLeaveEvents = {};
    if( addEnterLeaveEvents ){
      enterLeaveEvents = {
        /*onMouseEnter:() => onSliderInteract( "enter", parentId, {} ),
        onMouseLeave:() => onSliderInteract( "leave", parentId, {} )*/
        onMouseEnter:() => this.onSliderInteract( "enter" ),
        onMouseLeave:() => this.onSliderInteract( "leave" )
      };
    }
    if( lastAction === "prev" ){
      moverClasses.push( "from-left" );
    }
    return(
      <div className={"slider " + className} ref={ (ref) => {this.container = ref;} } {...enterLeaveEvents}>
        <div className="sizer"></div>
        <ReactCSSTransitionGroup component="div" className={moverClasses.join( " " )}
          transitionName="carousel"
          transitionAppear={false}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={0}>
          {items[ currentItem ]}
        </ReactCSSTransitionGroup>
        {/*showControls && <div className="previous arrow icon-base icon-arrow-thin-left" onClick={(e)=>onSliderClick( "prev", parentId, {totalItems} ) }></div>*/}
        {/*showControls && <div className="next arrow icon-base icon-arrow-thin-right" onClick={(e)=>onSliderClick( "next", parentId, {totalItems} ) }></div>*/}
        {showControls && <div className="previous arrow round icon-base icon-arrow-thin-left" title="Previous" onClick={(e)=>this.onSliderClick( "prev" )}></div>}
        {showControls && <div className="next arrow round icon-base icon-arrow-thin-right" title="Next" onClick={(e)=>this.onSliderClick( "next" )}></div> }
      </div>
    );
  }
}
Slider.defaultProps = {
  transitionType:"slide",
  showControls:true,
  autoplay:false,
  autoplayDuration:5000,
  addEnterLeaveEvents:true
};

/*function mapStateToProps(state) {
  return {
    ui:state.ui
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onSliderClick:sliderClick,
    onSliderInteract:sliderInteract,
    sliderStartAutoplay:startAutoplay
  }, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )(Slider);*/
export default Slider;