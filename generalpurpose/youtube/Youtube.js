import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import shallowCompare from "react-addons-shallow-compare";
import get from "lodash/get";
import Image from "../Image";
import isString from "lodash/isString";
import set from "lodash/set";
import makeAsyncScriptLoader from "react-async-script";
import {Parallax} from "../parallax";
import {youtubeChange, youtubeRegisterPlayer, youtubeFetchThumbnail} from "../../../redux/actions";

class YoutubePlayer extends React.Component {
  constructor( props ){
    super( props );
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  componentDidMount () {
  }

  componentWillReceiveProps( nextProps ){
    if( !this.player && nextProps.YT ){
      /*//if( nextProps.playbackState === "playing" ){
        nextProps.configuration.autoplay = 1;
      }*/
      let
        configObject = {
          videoId: this.props.videoId,
          playerVars: nextProps.configuration,
          events:{
            "onReady": (e)=>{ this.props.onReady( e ); },
            "onStateChange": (e)=>{ this.onStateChange( e ); },
            "onError": (e)=>{ this.props.onError( e ); }
          }
        };
      this.player = new window.YT.Player( this.refPlayer, configObject );
    }else{
      if( this.player ){
        this.diffState( this.props, nextProps );
      }
    }
  }

  onStateChange( event ){
    //this.setRealPlaybackState( this.constructor.stateNames[ event.data ] );
    //const realPlaybackState = this.getRealPlaybackState();
    const
      newState = this.constructor.stateNames[ event.data ];
    this.props.youtubeChange( this.props.id, {state:newState} );
    if( newState === "ended" ) {
      this.props.onEnd( event );
    }else if( newState === "playing" ){
      this.props.onPlay( event );
    }else if( newState === "paused" ){
      this.props.onPause( event );
    }else if( newState === "buffering" ){
      this.props.onBuffer( event );
    }
  }

  setRealPlaybackState(stateName){
    this.realPlaybackState = stateName;
  }

  getRealPlaybackState(){
    return this.realPlaybackState;
  }

  diffState( prevProps, nextProps ){
    let playerId = this.props.id;
    if( nextProps.youtube ){
      let
        // currentState = lodash.get( prevProps, `youtube.${playerId}.state` ),
        currentState = get( prevProps, `youtube.${playerId}.state` ),

        // nextState = lodash.get( nextProps, `youtube.${playerId}.state` );
        nextState = get( nextProps, `youtube.${playerId}.state` );


      if( nextState && nextState !== currentState && this.constructor.stateNames[ this.player.getPlayerState() ] !== nextState ){
        this.setPlaybackState( nextState ); 
      }
    }
    if( prevProps.videoId !== nextProps.videoId && nextProps.videoId ){
      this.cueVideoId( nextProps.videoId );
    }

    if(prevProps.width !== nextProps.width ){
      this.setViewportWidth( nextProps.width );
    }

    if( prevProps.height !== nextProps.height ){
      this.setViewportHeight( nextProps.height );
    }
  }

  playVideo(){
    this.player.playVideo();
  }

  pauseVideo(){
    this.player.pauseVideo();
  }

  setPlaybackState( stateName  ){
    if( stateName === "playing" ){
      this.player.playVideo();
    }else if( stateName === "paused" ){
      this.player.pauseVideo();
    }else if( stateName === "unstarted" ){
      this.player.stopVideo();
    }else {
      throw new Error( "Invalid playback state (" + stateName + ")." );
    }
  }

  cueVideoId( videoId ){
    // if( !lodash.isString(videoId) ){
    if( !isString(videoId) ){
      throw new Error("videoId parameter must be a string.");
    }
    this.player.cueVideoById( videoId );
  }

  setViewportWidth( width ){
    this.setDimension( "width", width );
  }

  setViewportHeight(height){
    this.setDimension("height", height);
  }

  setDimension(name, size){
    let formattedSize;
    if(size ){
      formattedSize = size;
      if( !isNaN( parseFloat( formattedSize ) ) && isFinite( formattedSize ) ){
        formattedSize += "px";
      }
      this.refViewport.style[ name ] = formattedSize;
    }else{
      this.refPlayer.style.removeProperty( name );
    }
  }

  render(){
    const
      {thumbnail_url} = this.props,
      style = {
        display: "block",
        height: "100%",
        width: "100%"
        //backgroundImage:`url("${thumbnail_url}")`
      };

    return <div ref={(element) => { this.refViewport = element; }} style={style}>
      <div ref={(element) => { this.refPlayer = element; }} style={style}></div>
    </div>;
  }
}

YoutubePlayer.stateNames = {
  "-1": "unstarted",
  0: "ended",
  1: "playing",
  2: "paused",
  3: "buffering",
  5: "cued"
};

YoutubePlayer.propTypes = {
  configuration: React.PropTypes.shape({
    autoplay: React.PropTypes.oneOf([0, 1]),
    cc_load_policy: React.PropTypes.oneOf([0, 1]),
    color: React.PropTypes.oneOf(["red", "white"]),
    controls: React.PropTypes.oneOf([0, 1, 2]),
    disablekb: React.PropTypes.oneOf([0, 1]),
    enablejsapi: React.PropTypes.oneOf([0, 1]),
    end: React.PropTypes.number,
    fs: React.PropTypes.oneOf([0, 1]),
    hl: React.PropTypes.string,
    iv_load_policy: React.PropTypes.oneOf([1, 3]),
    //list: React.PropTypes.oneOf(["search", "user_uploads", "playlist"]),
    list: React.PropTypes.string,
    listType: React.PropTypes.oneOf(["playlist", "search", "user_uploads"]),
    loop: React.PropTypes.oneOf([0, 1]),
    modestbranding: React.PropTypes.oneOf([0, 1]),
    origin: React.PropTypes.string,
    playlist: React.PropTypes.string,
    playsinline: React.PropTypes.oneOf([0, 1]),
    rel: React.PropTypes.oneOf([0, 1]),
    showinfo: React.PropTypes.oneOf([0, 1]),
    start: React.PropTypes.number,
    theme: React.PropTypes.oneOf(["dark", "light"])
  }),
  /* eslint-enable camelcase, id-match */

  // https://developers.google.com/youtube/iframe_api_reference#onReady
  onReady: React.PropTypes.func,

  // https://developers.google.com/youtube/iframe_api_reference#onStateChange
  // onStateChange: React.PropTypes.func,

  // https://developers.google.com/youtube/iframe_api_reference#onPlaybackQualityChange
  // onPlaybackQualityChange: React.PropTypes.func,

  // https://developers.google.com/youtube/iframe_api_reference#onPlaybackRateChange
  // onPlaybackRateChange: React.PropTypes.func,

  // https://developers.google.com/youtube/iframe_api_reference#onApiChange
  // onApiChange: React.PropTypes.func,

  onBuffer: React.PropTypes.func,

  // https://developers.google.com/youtube/iframe_api_reference#onStateChange
  onEnd: React.PropTypes.func,
  // https://developers.google.com/youtube/iframe_api_reference#onError
  onError: React.PropTypes.func,

  onPause: React.PropTypes.func,
  onPlay: React.PropTypes.func,
  YT: React.PropTypes.object
};

YoutubePlayer.defaultProps = {
  configuration: {},
  height: "100%",
  onBuffer: () => {},
  onEnd: () => {},
  onError: () => {},
  onPause: () => {},
  onPlay: () => {},
  onReady: () => {},
  playbackState: "unstarted",
  width: "100%"
};

class YoutubeOverlay extends React.Component{
  constructor( props ){
    super( props );
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }
  componentDidMount(){
    let {videoId, thumbnail_url, youtube} = this.props;
    if( !thumbnail_url ){
      // let fetchedVideoData = lodash.get( youtube, `info.${videoId}`, false );
      let fetchedVideoData = get( youtube, `info.${videoId}`, false );
      if( !fetchedVideoData ){
        this.props.youtubeFetchThumbnail( videoId );
      }
    }
  }
  componentWillReceiveProps( nextProps ){
    
  }
  render(){
    let
      {videoId, youtube} = this.props,
      // fetchedVideoData = lodash.get( this.props, `youtube.info.${videoId}`, false ),
      fetchedVideoData = get( this.props, `youtube.info.${videoId}`, false ),
      thumbnailUrl = this.props.thumbnail_url;

    if( fetchedVideoData && fetchedVideoData.thumbnail_url ){
      thumbnailUrl = fetchedVideoData.thumbnail_url;
    }
    let imageComponent = <Image
      component="div"
      image={thumbnailUrl}
    />;
    if( this.props.parallax ){
      imageComponent =
        <Parallax
          parallaxComponent={
            <Image
              component="div"
              image={thumbnailUrl}
            />
          }
          contentComponent={
            <Image
              component="div"
              useImageTag={true}
              image={thumbnailUrl}
            />
          }
        />;
      /*imageComponent = <Parallax strength={200}>
          <Background>
            <Image
              component="div"
              image={thumbnailUrl}
            />
          </Background>
          <Image
            component="div"
            useImageTag={true}
            image={thumbnailUrl}
          />
        </Parallax>;*/
    }
    return(
      <div className="video-overlay" onClick={this.props.onClick}>
      {thumbnailUrl && imageComponent}
      </div>
    );
  }
}

class Youtube extends React.Component{
  constructor( props ){
    super( props );
    // this.id = lodash.get( this, "props.youtube.ids", [] ).length;
    this.id = get( this, "props.youtube.ids", [] ).length;
    //this.props.youtubeRegisterPlayer( this.id, this.props.parentId );
  }
  
  componentWillMount(){
    this.props.youtubeRegisterPlayer( this.id, this.props.parentId );
  }

  shouldComponentUpdate( nextProps, nextState ){
    //return !( lodash.isEqual( nextProps.youtube[ this.id ], this.props.youtube[ this.id ] ) && lodash.isEqual( nextProps.configuration, this.props.configuration ) );
    return shallowCompare( this, nextProps, nextState );
  }
  componentWillReceiveProps( nextProps ){
    let
      // currentMode = lodash.get( this.props, `youtube.${this.id}.mode`, "overlay" ),
      currentMode = get( this.props, `youtube.${this.id}.mode`, "overlay" ),
      // nextMode = lodash.get( nextProps, `youtube.${this.id}.mode`, "overlay" );
      nextMode = get( nextProps, `youtube.${this.id}.mode`, "overlay" );
    if( nextMode === "player" && currentMode === "overlay" ){
      // lodash.set( nextProps, "configuration.autoplay", 1 );
      set( nextProps, "configuration.autoplay", 1 );
    }
  }

  loadVideo( isPlaying ){
    this.props.youtubeChange( this.id, {mode:"player"});
  }

  render(){
    const {thumbnail_url, playbackState} = this.props;
    let
      Component,
      attrs = {},
      // mode = lodash.get( this.props, `youtube.${this.id}.mode`, "overlay" );
      mode = get( this.props, `youtube.${this.id}.mode`, "overlay" );

    if( mode === "overlay" ){
      Component = YoutubeOverlay;
      attrs.onClick = () => {
        this.loadVideo( true );
      };
    }else if( mode === "player" ){
      delete attrs.onclick;
      Component = YoutubePlayer;
    }
  
    return(
      <Component {...this.props} {...attrs} id={this.id}/>
    );
  }
}

function mapStateToProps( state ){
  return {
    youtube:state.youtube
  };
}
function mapDispatchToProps( dispatch ){
  return bindActionCreators({ youtubeRegisterPlayer, youtubeChange, youtubeFetchThumbnail}, dispatch );
}

YoutubePlayer = makeAsyncScriptLoader( YoutubePlayer, "http://www.youtube.com/iframe_api", {
  callbackName:"onYouTubeIframeAPIReady",
  globalName:"YT",
  exposeFuncs: [ "playVideo", "pauseVideo" ]
});
export {YoutubePlayer};
Youtube = connect( mapStateToProps, mapDispatchToProps )( Youtube );
export default Youtube;