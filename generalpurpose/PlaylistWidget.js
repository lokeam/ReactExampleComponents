import React from "react";
import shallowCompare from "react-addons-shallow-compare";

import Image from "./generalpurpose/Image";
import {FormattedDateObj} from "../utils/functions";

class PlaylistItem extends React.Component{
  constructor( props ){
    super( props );
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    const
      {album, art, artist, purchase, song, timestamp, showIndexes, index} = this.props;
    let
      imgUrl = art.large,
      dateObj = new FormattedDateObj( parseInt( timestamp, 10 ) * 1000 );
    if( !imgUrl ){
      imgUrl = art.medium || art.small;
    }
    return(
      <article className="song-meta clearfix">
        { (imgUrl && imgUrl !== "") && <Image
          url={purchase}
          image={imgUrl}
          title={artist}
          classes={["artist-image", "icon-headphones"]}/> }
        <a className="song-info" href={purchase} target="_blank">
          <div className="recently-played">
            <div className="song-info-title">
              {showIndexes===true && <span className="song-info-index">{index}. </span>}{artist} - {song}
            </div>
            <div className="song-info-album">Played At { dateObj.format( "g:i A" )}</div>
            <span className="song-info-link">Buy</span>
          </div>
        </a>
      </article>
    );
  }
}

class PlaylistWidget extends React.Component{
  constructor( props ){
    super( props );
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  getItems( tracks ){
    const
      {params} = this.props;
    let
      showIndexes = params.index_display && params.index_display === "show",
      returnData = [];
    tracks.forEach((track, i)=>{
      let index = i + 1;
      returnData.push( <PlaylistItem {...track} {...{showIndexes,index}} key={i}/> );
    });
    return returnData;
  }
  render(){
    const
      {data,dataDetails, params, pageTitle} = this.props;
    let
      title = params.playlist_title || pageTitle,
      tracks = dataDetails[ data[0] ].track || [],
      toRender = this.getItems( tracks );

    return(
      <div className="content-playlist archive-page">
        <section className="title"><h1>{title}</h1></section>
        <section className="sub-title"><h2>View and Buy recently played songs.</h2></section>
        <section className="recently-played-list">
          {toRender}
        </section>
      </div>
    );
  }
}
export default PlaylistWidget;