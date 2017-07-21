import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import {connect} from "react-redux";

class AuthLinks extends Component {

  constructor( props ) {

    super( props );

  }

  render() {

    if(this.props.credentials === undefined) {

      return(<div className="auth-links">
        <a href="#auth-start">Sign In or Register</a>
      </div>);

    } else {

      const displayName = this.props.credentials.display_name ? this.props.credentials.display_name : this.props.credentials.user_nicename;

      return(<div className="auth-links">
        <span>Welcome, <a href="/profile/edit">{displayName}</a></span> |
        <a href="/logout">Sign Out</a>
      </div>);

    }

  }

}

function mapStateToProps(state) {
  return {
    credentials: state.json.response.options.credentials
  };
}

export default connect( mapStateToProps )(AuthLinks);


