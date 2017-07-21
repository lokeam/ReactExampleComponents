import React from "react";
import shallowCompare from "react-addons-shallow-compare";

import Image from "../generalpurpose/Image";
import get from "lodash/get";

class MeetTheDJsArticle extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    const
      {data} = this.props;
    if (data) {
      return(
        <article className="item-dj">
          <Image
            url={data.url}
            image={data.thumbnail}
            title={data.name}
          />
          <div className="content">
            <a href={data.url} className="title">{data.name}</a>
            <span className="links sub"><a href={data.url}>Read Articles</a></span>
          </div>
          {/*<a href="#" className="sub">this is a sub line</a>*/}
        </article>
      );
    } else {
      return(
        <article className="item-dj" />
      );
    }
  }
}

class MeetTheDJs extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    const
      self = this,
      {data, params, dataDetails} = this.props,
      id = get( dataDetails, "info.id", "" );
    let
      markup = [];

    data.forEach(function( aid, i ){
      markup.push( <MeetTheDJsArticle data={dataDetails[ aid ]} key={i} /> );
    });

    return (
      <div className="thumb-title-links-sub">
        {markup}
      </div>
    );
  }
}

export default MeetTheDJs;