import React from "react";
import shallowCompare from "react-addons-shallow-compare";
import Blogroll from "./Blogroll";

class Widget404 extends React.Component{
  constructor( props ){
    super( props );
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    if( typeof window !== "undefined" ){
      require( "../resources/css/gizmos/widget404/lazy.scss" );
    }
    return(
      <div className="content-404">
        <section className="title">
          <h2>This is Somewhat Embarrassing, Isn't it?</h2>
          <h2>Sorry, we couldn't find what you were looking for, but please enjoy these articles from our site.</h2>
        </section>
        <section className="blogroll row-standard">
          <Blogroll data={this.props} articleConfiguration={{
            showByline: false
          }}/>
        </section>
      </div>
    );
  }
}

export default Widget404;