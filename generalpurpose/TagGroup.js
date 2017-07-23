import React, { Component } from "react";
import {MarkupHelper} from "../../utils/markup";
import shallowCompare from "react-addons-shallow-compare";


class TagCatGroup extends Component{
  constructor( props ){
    super( props );
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }
  render(){
    var self = this,
      {taxonomies, title} = this.props;

    return(
      <div className="wrapper">
        <span>{title}: </span>
        {
          taxonomies.map(function( taxonomy, i){
            var comma = ", ";
            if( i === 0 ){comma = "";}
            return <span key={i}>{comma}<a href={taxonomy.link_url} dangerouslySetInnerHTML={MarkupHelper.createInnerHtmlFromText( taxonomy.title ) }></a></span>;
          })
        }
      </div>
    );
  }
}

class TagGroup extends Component{
  render(){
    return(
      <TagCatGroup taxonomies={this.props.tags} title={"Filed Under"}/>
    );
  }
}

class CatGroup extends Component{
  render(){
    return (
      <TagCatGroup  taxonomies={this.props.categories} title={"Categories"}/>
    );
  }
}

export {TagGroup, CatGroup};