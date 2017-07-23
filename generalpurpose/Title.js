import React from "react";
import shallowCompare from "react-addons-shallow-compare";
import renderHTML from "react-render-html";

class Title extends React.Component{
  constructor( props ){
    super( props );
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  render(){
    return(
      <section className={[ this.props.type, this.props.className ].join( " " )}>
        {this.props.type === "title" && <h1>{renderHTML( this.props.title )}</h1>}
        {this.props.type === "sub-title" && <h2>{renderHTML( this.props.title )}</h2>}
      </section>
    );
  }
}
Title.defaultProps = {
  type: "title",
  title: "",
  className: ""
};
export default Title;