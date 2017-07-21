import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { authError, authProcessing, authStep, toggleAuth } from "../../redux/actions";
import assign from "lodash/assign";
import AuthForm from "./AuthForm";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import each from "lodash/each";
import flatMap from "lodash/flatMap";
import { isInvalid, isPristine, isValid, SubmissionError, submit } from "redux-form";
import LoadingAnim from "../generalpurpose/LoadingAnim";
import merge from "lodash/merge";
import qs from "query-string";
import set from "lodash/set";
import shallowCompare from "react-addons-shallow-compare";
import slashes from  "../../../../../common/utils/formatters/stripslashes.js";
import unset from "lodash/unset";

// const qs = require("query-string");

class AuthModal extends Component {

  constructor( props ){
    super( props );
  }

  componentDidMount() {

    // add click handlers
    window.document.body.addEventListener("click", function(e) {

      const target = e.target !== undefined ? e.target : e.srcElement;
      const tag = (target.nodeName || target.tagName).toLowerCase();

      if(tag != "a") {
        return;
      }

      // catch all auth toggle links
      if(target.href.indexOf("#auth-") !== -1) {
        const matches = target.href.match(/\#auth\-([a-zA-Z]+)/);
        if(matches.length > 1) {
          e.preventDefault();
          this.toggle(matches[1]);
          return;
        }
      }

      // catch legacy links
      const homeUrl = "http\:\/\/" + this.props.options.activeDomain;
      const legacyLinkPatterns = [
        "^" + homeUrl + "\/registration(\/)?$",
        "^\/registration(\/)?$",
        "^" + homeUrl + "\/login(\/)?$",
        "^\/login(\/)?$",
        "^" + homeUrl + "\#fb-auth-registration-link(\/)?$",
        "^\#fb-auth-registration-link(\/)?$"
      ];
      const matchLegacyLinks = target.href.match(new RegExp("/" + legacyLinkPatterns.join("|") + "/"));
      if(matchLegacyLinks !== null) {
        e.preventDefault();
        this.toggle("start");
        return;
      }

      // close on modal backdrop click
      if(target.id == "auth-modal-backdrop") {
        e.preventDefault();
        this.toggle("close");
        return;
      }

    }.bind(this));


  }

  shouldComponentUpdate( nextProps, nextState ){

    return shallowCompare( this, nextProps, nextState );

  }

  componentDidUpdate() {

    const {formState, uiState} = this.props;

    const mode = get(uiState, "auth-modal.mode", "start");

    // logout trigger
    if(mode == "logout") {
      this.logout();
      return;
    }

  }

  render() {
    
    //console.log("-- AuthModal --"/*, this.props*/);
    
    const {options, design, uiState, toggleAuth, sponsor, formState, formIsInvalid, formIsPristine, formIsValid, submitForm} = this.props;

    // check facebook plugin status
    const enabled = parseInt(get(options, "blogOptions.facebook_app.plugins.facebook-authentication", 0));
    if(!enabled) {
      return null;
    }

    // check show status
    const show = get(uiState, "auth-modal.show", false);
    if(!show) {
      return null;
    }

    // status items
    const credentials = get(options, "credentials", null);
    const mode = get(uiState, "auth-modal.mode", "start");
    const step = get(uiState, "auth-modal.step", 1);
    const processing = get(uiState, "auth-modal.processing", false);
    const error = get(uiState, "auth-modal.error", null);

    // the form
    const formId = "auth-form-" + mode.replace("-fb", "");

    // name all the things
    const clubName = slashes.stripslashes( get(options, "globalBlogOptions.loyalty_title_" + options.blogId, null) );
    const callLetters = get(options, "blogOptions._station_info.callletters", null);
    const shortName = clubName ? clubName : options.blogOptions._station_info.legalname;
    const longName = clubName ? (callLetters ? callLetters + " " + clubName : clubName) : options.blogOptions._station_info.legalname;

    // get logo
    const logoPath = get(
      options.blogOptions,
      "_station_logos.overlay-logo",
      get(
        options.blogOptions,
        "design_option_live.logo_img_trim",
        get(
          options.blogOptions,
          "design_option_live.logo_img",
          null
        )
      )
    );
    const logo = logoPath ? <div><img className="auth-logo" src={logoPath} /></div> : null;

    // What are we showing this time?
    let modeTitle,
      modeContent,
      backButton,
      nextButton,
      modeSubmit;
    switch(mode) {

      case "start":

        modeTitle = null;
        modeContent = <div className="input-container">
          <a className="start-button" href="#auth-register"><span className="icon-close"></span> Create Account</a>
          <a className="start-button login" title="Sign In" href="#auth-login"><span className="icon-user"></span> Sign In</a>
        </div>;

        break;

      case "login-fb":
      case "login":

        modeTitle = "Sign In";
        backButton = <a className="auth-nav-back" href="#auth-start">Back</a>;
        nextButton = formIsPristine || formIsInvalid || processing ? <span className="auth-nav-next">Next</span> : <a className="auth-nav-next" href="#_" onClick={(e) => { e.preventDefault(); submitForm(formId); }}>Next</a>;
        
        modeContent = <div className="input-container">
          <div className="facebook-connect-button" title="Sign in with Facebook" onClick={this.fbLogin.bind(this)}>
            <span className="icon-facebook"></span>
            Sign in with Facebook
            { mode == "login-fb" && processing && <LoadingAnim width="18px" color="#c0c0c0" strokeWidth="4" id="auth-loading" /> }
          </div>
          <div className="or"></div>
          <AuthForm id="auth-form" mode={mode} step={step} onSubmit={this.authRequest.bind(this)} goToStep={authStep} />
          <p className="terms">By signing into your {options.blogOptions._station_info.legalname} account, you agree to our <a href="/privacy" target="_blank">Privacy Policy</a> & <a href="/vip-terms" target="_blank">Terms and Conditions</a>.</p>
        </div>;
        break;

      case "register":

        modeTitle = "Create Account";
        backButton = step == 1 ? <a className="auth-nav-back" href="#auth-start">Back</a> : <a className="auth-nav-back" href="#_" onClick={this.prev.bind(this)}>Back</a>;
        nextButton = formIsPristine || formIsInvalid || processing ? <span className="auth-nav-next">Next</span> : <a className="auth-nav-next" href="#_" onClick={(e) => { e.preventDefault(); submitForm(formId); }}>Next</a>;
        modeSubmit = step == 1 ? this.next.bind(this) : this.authRequest.bind(this);
        
        let fbLoginButton = step == 1 && <div>
          <div className="facebook-connect-button" title="Sign in with Facebook" onClick={this.fbLogin.bind(this)}>
            <span className="icon-facebook"></span>
            Sign up with Facebook
          </div>
          <div className="or"></div>
        </div>;

        modeContent = <div className="input-container">
          {fbLoginButton}
          <AuthForm id="auth-form" mode={mode} step={step} onSubmit={modeSubmit} goToStep={authStep} />
          <p className="terms">By signing into your {options.blogOptions._station_info.legalname} account, you agree to our <a href="/privacy" target="_blank">Privacy Policy</a> & <a href="/vip-terms" target="_blank">Terms and Conditions</a>.</p>
        </div>;

        break;

      case "account-activation":

        modeTitle = "Welcome Back!";
        backButton = <a className="auth-nav-back" href="#auth-start">Back</a>;
        nextButton = formIsPristine || formIsInvalid || processing ? <span className="auth-nav-next">Next</span> : <a className="auth-nav-next" href="#_" onClick={(e) => { e.preventDefault(); submitForm(formId); }}>Next</a>;
        modeSubmit = this.authRequest.bind(this);

        const blog = get(uiState, "auth-modal.values.blog");

        modeContent = <div className="input-container">
          <p>
            It appears that you already have an account created within our VIP network of sites on <a href={blog}>{blog}</a>.
            To keep your personal information safe, we need to verify that it's really you.
            To activate your account, please confirm your <a href={blog}>{blog}</a> password.
            When you have confirmed your password, you will be able to sign in through Facebook on both sites.
          </p>
          <AuthForm id="auth-form" mode={mode} step={step} onSubmit={modeSubmit} goToStep={authStep} />
          <p className="meta">Please note that your prizes and activities will not be shared between programs within our VIP network.</p>
        </div>;

        break;

      case "site-activation":

        modeTitle = "Welcome Back!";
        backButton = <a className="auth-nav-back" href="#auth-start">Back</a>;
        nextButton = formIsInvalid || processing ? <span className="auth-nav-next">Next</span> : <a className="auth-nav-next" href="#_" onClick={(e) => { e.preventDefault(); submitForm(formId); }}>Next</a>;
        modeSubmit = this.authRequest.bind(this);
        modeContent = <div className="input-container">
          <p>It appears that you already have an account on this site associated with <strong className="user-email">{get(uiState, "auth-modal.values.email")}</strong>. To connect your existing account just click next. You will maintain your existing VIP profile. After you do this, you will be able to always sign in to <a href={"http://" + options.activeDomain} target="_blank">{options.activeDomain}</a> using your original account information.</p>          
          <AuthForm id="auth-form" mode={mode} step={step} onSubmit={modeSubmit} goToStep={authStep} />
          <p className="meta">*Please note that your prizes and activities will not be shared between programs within our VIP network.</p>
        </div>;

        break;

      case "required-fields":

        modeTitle = "We're Almost There!";
        backButton = <span className="auth-nav-back">Back</span>;
        nextButton = formIsPristine || formIsInvalid || processing ? <span className="auth-nav-next">Next</span> : <a className="auth-nav-next" href="#_" onClick={(e) => { e.preventDefault(); submitForm(formId); }}>Next</a>;
        modeSubmit = this.authRequest.bind(this);

        modeContent = <div className="input-container">
          <p>Please fill out the information below to help us provide you a better experience.</p>
          <AuthForm id="auth-form" mode={mode} step={step} onSubmit={modeSubmit} goToStep={authStep} />
        </div>;

        break;

      case "message":

        modeTitle = get(uiState, "auth-modal.values.title", "");
        backButton = <span className="auth-nav-back">Back</span>;
        nextButton = <span className="auth-nav-next">Next</span>;
        modeContent = <div className="message-container" dangerouslySetInnerHTML={{__html: get(uiState, "auth-modal.values.message", "")}}></div>;

        break;

      case "logout":

        modeTitle = "Signing Out";
        backButton = <span className="auth-nav-back">Back</span>;
        nextButton = <span className="auth-nav-next">Next</span>;
        modeContent = formIsValid && <div className="message-container"><LoadingAnim width="30px" color="#c0c0c0" strokeWidth="4" id="auth-loading" /></div>;

        break;

    }

    let modalNav = mode != "logout" && mode != "message" && <div className="modal-nav">
      {backButton}
      {nextButton}
    </div>;
   
    return(
      <div id="auth-modal">
        <div id="auth-modal-backdrop" onClick={() => { this.toggle("close"); }}></div>
        <div id="auth-modal-container" className={mode}>
          <a className="auth-modal-close" href="#auth-close">&times;</a>
          <div className="auth-modal-header">
            <div className="brand">
              {logo}
              <h3>{shortName} Members Only</h3>
              <span>This is an exclusive benefit for {longName}</span>
            </div>
            <div className="modal-title">
              <strong>{modeTitle}</strong>
            </div>
          </div>
          <div className="auth-modal-content">
            <div>
              {error && <div className="auth-error">{error}</div>}
              {modeContent}
              {!modeContent && <AuthForm id="auth-form" mode={mode} step={step} onSubmit={modeSubmit} goToStep={authStep} />}
            </div>
          </div>
          <div className="auth-modal-footer">
            {modalNav}
            <div className="overlay_sponsor_wrap">
              <span>Powered by</span>
            </div>
            <div className="clear"></div>
          </div>
        </div>
      </div>
    );

  }

  toggle(mode = null) {

    if(mode == "close") {
      mode = null;
    }

    this.props.toggleAuth(mode);

  }

  prev(e) {

    const {uiState, authStep} = this.props;

    if(e.preventDefault !== undefined) {
      e.preventDefault();
    }

    let step = get(uiState, "auth-modal.step", 1) - 1;

    if(step < 1) {
      step = 1;
    }

    authStep(step);

  }

  next(e) {

    const {authStep, formIsPristine, formIsInvalid, uiState} = this.props;

    if(e.preventDefault !== undefined) {
      e.preventDefault();
    }

    if(formIsPristine || formIsInvalid) {
      return;
    }

    const step = get(uiState, "auth-modal.step", 1) + 1;

    authStep(step);

  }

  objToQueryString(obj, prefix = null) {

    return flatMap(obj, (v, k, c) => {

      if(typeof(v) == "object") {
        return this.objToQueryString(v, k);
      }

      return prefix !== null ? prefix + "[" + k + "]=" + v : k + "=" + v;

    }).join("&");

  }
 
  fbLogin() {

    const {authError, options, toggleAuth, uiState} = this.props;

    const processing = get(uiState, "auth-modal.processing", false);

    if(window.FB === undefined || processing) {
      return;
    }

    window.FB.login(function(response) {
      if (response.authResponse) {
        window.FB.api("/me", {fields: ["id", "name", "email"]}, function(response) {

          if(get(uiState, "auth-modal.mode", null) != "login-fb") {
            toggleAuth("login-fb");
          }

          this.authRequest({fb_auth_form_nonce: get(options, "authLoginFormNonce", ""),params: response})
            .catch((error) => {
              authError(get(error, "errors._error", "There was an error"));
            });
          
        }.bind(this));
      }
    }.bind(this), { scope: "email,user_birthday,user_status,publish_actions,user_about_me,user_location,user_likes,user_hometown" });

  }

  authRequest(values = {}) {

    const { options, authProcessing, uiState, toggleAuth } = this.props;

    const processing = get(uiState, "auth-modal.processing", false);

    if(processing) {
      return;
    }

    // flame on!
    authProcessing();

    // get state/defaults
    const mode = get(uiState, "auth-modal.mode", "login");
    const authNonce = get(options, "authLoginFormNonce", null);
    const regNonce = get(options, "authRegFormNonce", null);
    
    let savedPayload = get(uiState, "auth-modal.payload", {});
    if(typeof(savedPayload) == "string") {
      savedPayload = qs.parse(savedPayload);
    }

    let payload = Object.keys(savedPayload).length ? merge(cloneDeep(values), savedPayload) : cloneDeep(values);

    switch(mode) {
      case "login-fb":
        payload.action = "facebook_user_auth";
        payload.params = get(payload, "params", {});
        break;
      case "login":
        payload.action = "facebook_wp_user_auth";
        break;
      case "register":
        payload.action = "tsm_register_user";
        payload._regnonce = regNonce;
        break;
      case "account-activation":
        // payload.fb_auth_form_nonce = authNonce;
        break;
      case "site-activation":
        payload.required_meta = assign({}, get(payload, "required_meta", {}), {activate: true});
        break;
      case "required-fields":
        payload.required_meta = payload.params;
        break;
    }

    // add nonce value if it doesn't already exist
    if(payload.fb_auth_form_nonce === undefined) {
      payload.fb_auth_form_nonce = authNonce;
    }

    // convert to query string for request
    const payloadString = this.objToQueryString(payload);

    const headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache"
    });

    return fetch( "/rest/carbon/api/auth/auth", {
      method: "POST",
      credentials: "include",
      headers,
      body: payloadString
    })
    .then(response => response.json())
    .then( (json) => {

      let response = {};

      if( typeof json.data === "string" ){
        response = JSON.parse( json.data );
      } else if(get(json, "data", undefined) !== undefined){
        response = json.data;
      } else {
        response = json;
      }

      authProcessing(false);

      if(typeof(response) != "object" || Object.keys(response).length == 0) {
        throw new SubmissionError({_error: "There was a problem. Please try again."});
      }

      // handle registration response
      if(mode == "register") {

        if(response.success) {

          if(response.redirect) {
            if(response.redirect.indexOf("welcome=1") === -1) {
              window.location.href = response.redirect;
            } else {
              window.location.reload();
            }
          } else {
            toggleAuth("message", {title: response.title, message: response.message}, null);
            return;
          }
          return;

        } else {

          // handle weird issue where user tries to register with valid username and password
          if(get(response, "body") !== undefined) {
            window.location.reload();
            return;
          }

          // reset captcha if it has an error
          if(get(response.errors, "captcha", undefined) !== undefined && window.grecaptcha !== undefined) {
            window.grecaptcha.reset();
          }
          
          // rename captcha error key for redux-form
          let errors = cloneDeep(response.errors);
          if(get(errors, "captcha", null)) {
            set(errors, "g-recaptcha-response", errors.captcha);
            unset(errors, "captcha");
          }

          // make sure we're on the page with the errors
          let step = get(this.props.uiState, "auth-modal.step", 1);
          let errorsOnStep = 0;
          let errorsOffStep = 0;
          let errorElem = null;
          each(errors, (v, k) => {
            errorElem = window.document.querySelector("[name=" + k + "]");
            if(errorElem === null) {
              errorsOffStep++;
            } else {
              errorsOnStep++;
            }
          });
          if(!errorsOnStep && errorsOffStep) {
            this.props.authStep((step == 1 ? 2 : 1));
          }

          throw new SubmissionError(errors);

        }

      }

      // handle login errors
      if(response.error_messages !== undefined && response.error_messages) {
        throw new SubmissionError({_error: response.error_messages});
      }

      // handle login redirects
      if(response.redirect !== undefined && response.redirect) {
        if(window.location.href == response.redirect.trim()) {
          window.location.reload();
        } else {
          window.location.href = response.redirect.trim();
        }
        return;
      }

      if(response.form !== undefined && response.form) {

        switch(response.form) {
          case "site-activation":
            toggleAuth(response.form, {email: response.email}, payload);
            break;
          case "account-activation":
            toggleAuth(response.form, {blog: response.blog}, payload);
            break;
          default:
            toggleAuth(response.form, null, payload);
            break;
        }

        return;

      }

    });

  }

  logout() {

    const headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache"
    });

    fetch( "/wp-admin/admin-ajax.php", {
      method: "POST",
      credentials: "include",
      headers,
      body: "action=facebook_auth_logout"
    })
    .then(response => response.json())
    .then( (json) => {

      let response = {};

      if( typeof json.data === "string" ){
        response = JSON.parse( json.data );
      } else {
        response = json;
      }

      if(typeof(response) != "object" || Object.keys(response).length == 0) {
        authError("There was a problem. Please try again.", null);
      }

      if(response.success) {
        window.location.reload();
      } else {
        authError(response.message);
      }

    });

  }

}

function mapStateToProps(state, props) {
  let formId = "auth-form-" + get(state, "ui.auth-modal.mode", "start").replace("-fb", "");
  return {
    options: state.json.response.options,
    uiState: state.ui,
    formState: get(state, "form." + formId),
    formIsInvalid: isInvalid(formId)(state),
    formIsPristine: isPristine(formId)(state),
    formIsValid: isValid(formId)(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleAuth: toggleAuth,
    authStep: authStep,
    authProcessing: authProcessing,
    authError: authError,
    submitForm: submit
  }, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )(AuthModal);


