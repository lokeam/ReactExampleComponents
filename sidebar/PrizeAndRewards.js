import React from "react";
import shallowCompare from "react-addons-shallow-compare";

import Image from "../generalpurpose/Image";

class PrizeAndRewards extends React.Component{
  constructor( props ){
    super( props );
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  getContent( data = this.props.data, dataDetails = this.props.dataDetails ){
    var mark = [];
    data.forEach(function(id, i){
      let prize = dataDetails[ id ];
      if( prize && prize.url ){
        mark.push(
          <article key={i}>
            <Image
              url={prize.url}
              image={prize.thumbnail}
              classes={[ "item-dj" ]}
            />
            <div className="content">
              <a href={prize.url} className="title">{prize.title}</a>
            </div>
          </article>
        );
      }
    });
    return mark;
  }

  render(){
    const
      {data, dataDetails, params} = this.props;
    let markup = this.getContent();
    return (
      <div className={"widget-content " + (params.activity || "")}>{markup}</div>
    );
  }
}

export default PrizeAndRewards;