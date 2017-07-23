import React, { Component, PropTypes } from 'react';

class WellItem extends Component{
	render(){
		const { url, image, title, excerpt } = this.props;
		if (typeof window !== 'undefined'){
			///let styles600 = require( '../resources/css/gizmos/wellitem/_600.less' );
			//let styles1025 = require( '../resources/css/gizmos/promotion/_1025.less' );
		}
		return(
			<div className="well-item">
				<article>
					<a className="frameme" href={url}>
						<span className="theframe" data-image={image}></span>
					</a>
					<a className="content" href={url}>
						<time dateTime="1970-01-01 00:00">Jan 1, 12AM</time>
						<div className="item-title">{title}</div>
						<div className="item-excerpt">{excerpt}</div>
					</a>
				</article>
			</div>
		);
	};
};

WellItem.propTypes = {
	url: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	excerpt: PropTypes.string.isRequired
};


export default WellItem;