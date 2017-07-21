import React from "react";
import shallowCompare from "react-addons-shallow-compare";
import get from "lodash/get";
import Image from "../generalpurpose/Image";
import renderHTML from "react-render-html";
import {UtilFunctions} from "../../utils/functions";

class SingleThumbPost extends React.Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    const {data, dataDetails, info, params} = this.props;
    let articles = data.map(( id, i )=>{
      const
        {title, thumbnail, url, excerpt} = get( dataDetails, id+ ".data.mainData" );
        //publishDate = UtilFunctions.getFormattedDate( postDateGmt );

      return(
        [
          <article key={id}>
            <Image
              title={title}
              url={url}
              image={thumbnail}
            />
            <div className="content clearfix">
              <div className="carat"></div>
              <a className="title" href={url}>{title}</a>
              <div className="excerpt">{renderHTML( excerpt )}</div>
              {/*<div className="byline">
                <address className="author clearfix">
                  <Image
                    title={authors.name}
                    url={authors.url}
                    image={authors.thumbnail}
                    rel="author"
                  />
                  <a className="author-name" href={authors.url}>{authors.name}</a>
                </address>
              </div>
              <time>{publishDate}</time>*/}
            </div>
          </article>,
          <p className="cto-container" key={i}>
            <a className="cto" href={url}>Read More</a>
          </p>
        ]
      );
    });
    return(
      <div className="widget-content">
        {articles}
      </div>
    );
  }
}

export default SingleThumbPost;