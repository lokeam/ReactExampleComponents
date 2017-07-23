import React from "react";
import shallowCompare from "react-addons-shallow-compare";
import Image from "./Image";

class AuthorImage extends React.Component{
  constructor( props ){
    super( props );
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    const
      {url, thumbnail, name} = this.props;
    let
      attrs = {
        url,
        image: thumbnail,
        rel: "author"
      };
    if( name ){
      attrs.title = name;
    }
    return(
      <div className="author-image icon-user">
        <Image {...attrs}/>
      </div>
    );
  }
}
export default AuthorImage;