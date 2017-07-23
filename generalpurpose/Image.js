import React from "react";
import ReactDOM from "react-dom";
import shallowCompare from "react-addons-shallow-compare";
import classNames from "classnames";
import renderHTML from "react-render-html";
import {throttledScollHandler, inViewport} from "../../api";
import LoadingAnim from "./LoadingAnim";

class Image extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      inView:false,
      imageReady:false
    };
    this.scrollManager = throttledScollHandler;
    this.onScrollHandler = this.onScrollHandler.bind( this );
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }
  
  componentDidMount(){
    if( !this.image || this.image === "" || this.image === undefined ){
      return false;
    }
    let 
      elem = ReactDOM.findDOMNode( this ),
      inView = inViewport( elem, this.props.offsetY ) || this.props.force,
      imageParams = this.createImageUrlParams();
    this.elem = elem;
    this.imageParams = imageParams;
    if( !inView ){
      if( this.cbId === undefined ){
        //this.cbId = addToScrollQ( this.onScrollHandler );
        this.cbId = this.scrollManager.addToEventQ( this.onScrollHandler );
      }
    }else{
      this.loadImage();
      this.setState({
        inView:true
      });
    }
  }

  componentWillUnmount(){
    if( this.cbId !== undefined ){
      this.scrollManager.removeFromEventQ( this.cbId );
    }
  }

  componentWillReceiveProps( nextProps ){
    if( nextProps.force && !this.props.force ){
      this.setState({
        inView:true
      });
    }
  }

  loadImage( src ){
    if( !this.image || this.image === "" || this.image === undefined ){
      return false;
    }
    let img = new window.Image();
    img.onload = (img) => {
      let elem = ReactDOM.findDOMNode( this );
      elem.classList.add( "frame-loaded" );
      this.setState({
        imageReady:true
      });
      if( this.props.onLoadCb ){
        this.props.onLoadCb();
      }
    };
    img.onerror = ( img ) => {console.log( img );
      this.setState({
        imageReady:"error"
      });
    };
    img.src = this.getImageUrl( this.imageParams || this.createImageUrlParams() ) ;
  }

  onScrollHandler( e ){
    if( !this.image || this.image === "" || this.image === undefined ){
      return false;
    }
    let inView = inViewport( this.elem || ReactDOM.findDOMNode( this ), this.props.offsetY );
    if( inView ){
      this.scrollManager.removeFromEventQ( this.cbId );
      this.cbId = null;
      this.setState({
        inView:inView
      });
      this.loadImage();
    }
  }

  createImageUrlParams(){
    if( !this.image || this.image === "" || this.image === undefined ){
      return false;
    }
    let 
      params = [],
      sizeParams = this.getImageSizeParams();
    if( sizeParams ){
      params.push( sizeParams );
    }
    return params.join( "&" );
  }

  getImageSizeParams(){
    if( !this.image || this.image === "" || this.image === undefined ){
      return false;
    }
    if( this.image.search( /\.gif$/ ) > -1 ){
      return false;
    }
    if( this.props.width && this.props.width === "auto" ){
      return false;
    }
    if( this.props.width && !isNaN( this.props.width ) ){
      return "w=" + this.props.width;
    }
    let
      elem = ReactDOM.findDOMNode( this ),
      rect = elem.getBoundingClientRect();
    if (rect.width > 1080) { return "w=1600"; }
    if (rect.width > 980) { return "w=1080"; }
    if (rect.width > 720) { return "w=980"; }
    if (rect.width > 630) { return "w=720"; }
    if (rect.width > 540) { return "w=630"; }
    if (rect.width > 420) { return "w=540"; }
    if (rect.width > 300) { return "w=420"; }
    return "w=300";
  }

  getImageUrl( imageParams = this.imageParams ){
    return [ this.image, imageParams ].join( "?" );
  }

  render(){
    this.image = this.props.image;
    if( this.image === undefined || !this.image ){
      return <figure className="frameme broken-image" data-message="missing image source"></figure>;
    }else{
      this.image = this.props.image.split( "?" )[0];
    }
    this.previewImage = this.props.image + "?w=42&q=20";
    const
      {url, title, rel, target, force, component, useImageTag, frameMe, caption, width, height} = this.props;
    let
      classes = classNames( [ {
        frameme:frameMe,
        "img-tag":useImageTag
      }].concat( this.props.classes ) ),
      frameAttributes = {
        //className:classes.join( " " ),
       
      },
      theFrameAttributes = {
        className:"theframe",
        "data-image":this.image,
        href:url,
        rel:rel,
        title,
        target,
        style:{}
      },
      previewImageAttrs = {
        className: "preview-image",
        style:{
          backgroundImage:"url(\"" + this.previewImage + "\")"
        }
      },
      theFrameContent = "",
      loading = [],
      previewImageMarkup = [],
      captionMarkup = [];

    if( this.state.imageReady === "error" ){
      return <figure className="frameme broken-image" data-image={this.image}></figure>;
    }else if( this.state.imageReady === true ){
      if( useImageTag ){
        theFrameContent = <img src={this.getImageUrl()} />;
      }else{
        theFrameAttributes[ "style" ] = { 
          backgroundImage:"url(\"" + this.getImageUrl() + "\")"
        };
      }
    }else{
      loading = <LoadingAnim key="2" width="30px" strokeWidth="4"/>;
    }
    previewImageMarkup = <div key="1" {...previewImageAttrs}></div>;
    if( force ){
      theFrameAttributes[ "data-frameme-force" ] = force;
    }
    if( !isNaN( height ) ){
      theFrameAttributes[ "style" ].height = height;
    }
    /*if( !isNaN( width ) ){
      theFrameAttributes[ "style" ].width = width;
    }*/

    if( component !== "a" ){
      delete theFrameAttributes.href;
      delete theFrameAttributes.target;
    }else{
      theFrameAttributes.onClick = ( e ) => {
        this.props.onClick( e, this.props.url );
      };
    }
    if( caption !== undefined && caption !== "" ){
      let
        captionStyle = {
          width
        };

      captionMarkup = <figcaption style={captionStyle}>{renderHTML( caption )}</figcaption>;
    }
    return(
      <figure className={classes}>
        {/*previewImageMarkup*/}
        {React.createElement(this.props.component, theFrameAttributes, theFrameContent )}
        {captionMarkup}
        {loading}
      </figure>
    );

    //return <figure className={classes.join( " " )}>{React.createElement(this.props.component, frameAttributes, <span {...theFrameAttributes}></span> )}</figure>;
    /*<a className={classes.join( " " )} href={url} rel={rel} title={title} target={target}>
        <span {...theFrameAttributes}></span>
      </a>*/
  }
}
Image.propTypes = {
  url:React.PropTypes.string,
  title:React.PropTypes.oneOfType( [ React.PropTypes.string, React.PropTypes.bool ] ),
  image:React.PropTypes.string.isRequired,
  rel:React.PropTypes.oneOfType( [ React.PropTypes.string, React.PropTypes.bool ] ),
  classes:React.PropTypes.array,
  target:React.PropTypes.string,
  force:React.PropTypes.bool,
  component:React.PropTypes.string,
  frameMe:React.PropTypes.bool
};

Image.defaultProps = {
  classes:[],
  rel:"",
  title:"",
  target:"_self",
  force:false,
  component:"a",
  frameMe:true,
  offsetY: 200,
  showCaption: true,
  onClick: ()=>{}
};

export default Image;