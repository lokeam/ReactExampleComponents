import React, { Component, PropTypes } from "react";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import classNames from "classnames";
import each from "lodash/each";
import get from "lodash/get";
import LoadingAnim from "../generalpurpose/LoadingAnim";
import map from "lodash/map";
import ReCAPTCHA from "react-google-recaptcha";
import { reduxForm, Field, Fields, getFormSubmitErrors, getFormSyncErrors, getFormValues, submit } from "redux-form";
import set from "lodash/set";
import shallowCompare from "react-addons-shallow-compare";

const reCaptchaClientkey = "6LcJiB4TAAAAAECLVme8vQvvFHGESasoeSFJqTAn";//require("./../../../../../config/config-wp").reCaptchaClientkey;

const  { DOM: { input, select, textarea } } = React;

// validation
let validators = {};
const validateRequired = (value) => { return value ? undefined : "This field is required."; };
const validateMin7 = (value) => (!value || value.length < 7 ? "Must be at least 7 characters." : undefined);
const validateEmail = (value) => { return value && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value) ? "Invalid email address" : undefined; };
const maybeValidateEmail = (value) => { return value.indexOf("@") !== -1 ? validateEmail(value) : undefined; };
const validateMatchPass = (value, values) => { return value == get(values, "pass1", "") ? undefined : "Passwords must match."; };
const validateCaptcha = (value) => { return value ? undefined : "You must check the box."; };
const validateAuthForm = function(values, props, parentKey = null) {

  let errors = {}, error = null, nestedErrors = null, ruleType = null;
  let instValidators = parentKey ? get(validators, parentKey, {}) : validators;

  each(instValidators, (fieldRules, fieldKey) => {

    if(Array.isArray(fieldRules)) {

      each(fieldRules, (rule) => {
        error = rule(get(values, fieldKey, undefined), values);
        if(error) {
          set(errors, fieldKey, error);
          return false;
        }
      });

    } else if(typeof(fieldRules) === "object") {

      nestedErrors = validateAuthForm(get(values, fieldKey, {}), props, (parentKey ? parentKey + "." + fieldKey : fieldKey));
      if(Object.keys(nestedErrors).length) {
        set(errors, fieldKey, nestedErrors);
      }

    } else if(typeof(fieldRules) === "function") {

      error = fieldRules(get(values, fieldKey, undefined), values);
      if(error) {
        set(errors, fieldKey, error);
        return false;
      }

    }
    
  });

  return errors;

};

// text field structure
const renderField = function(arg1) {
  const { input, label, type, meta: { touched, error, warning } } = arg1;
  const inputClasses = classNames("auth-input", {"auth-field-error": (touched && error)});
  const labelClasses = classNames("auth-placeholder", {"auth-field-error": (touched && error)});
  return <div className="auth-field">
    {touched && ((error && <div className="auth-field-error" dangerouslySetInnerHTML={{__html: error}}></div>) || (warning && <div className="auth-field-warning" dangerouslySetInnerHTML={{__html: warning}}></div>))}
    {label && <span className={labelClasses}>{label}</span>}
    <input {...input} type={type} placeholder={label} className={inputClasses} />
  </div>;
};

// dob field structure
const renderDobField = ({ input, values, label, type, meta: { touched, error, warning } }) => {
  return <select {...input}>
    <option value="">{label}</option>
    {map(values, (v) => {
      return <option key={"option-" + input.name + "-" + v.value} value={v.value || ""}>{v.label}</option>;
    })}
  </select>;
};

// captcha structure
const renderCaptchaField = (props) =>{
  
  const { input, label, type, meta: { touched, error, warning }, submitFailed } = props;
  return (
    <div className="auth-field">
      {touched && ((error && <div className="auth-field-error" dangerouslySetInnerHTML={{__html: error}}></div>) || (warning && <div className="auth-field-warning" dangerouslySetInnerHTML={{__html: warning}}></div>))}
      <ReCAPTCHA key="auth-recaptcha" value={input.value || ""} className="recaptcha" onChange={(value) => input.onChange(value)} onBlur={() => input.onBlur()} sitekey={reCaptchaClientkey} />
    </div>
  );

};

/*const resetCaptcha = () => {
  if(window.grecaptcha !== undefined) {
    window.grecaptcha.reset();
  }
};*/

class AuthForm extends Component {

  constructor( props ){

    super( props );
    this.captchaIsReset = false;
    this.year = new Date().getFullYear();
    this.months = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"};
    this.years = Array.from({length: 100}, (v, k) => k + (this.year - 113));

  }

  componentDidMount() {

    const { change, form, mode } = this.props;

    if(mode == "login" || mode == "login-fb") {

      let elems = window.document.querySelectorAll("input[type=text]");
      each(elems, (el) => {
        if(el.value) {
          change(form, el.name, el.value);
        }
      });

    }

  }

  shouldComponentUpdate( nextProps, nextState ){
    const update = shallowCompare( this, nextProps, nextState );
    if(update) {
      const currentStep = get(this.props.uiState, "auth-modal.step", 1);
      const nextStep = get(nextProps, "uiState.auth-modal.step", 1);
      if(currentStep != nextStep) {
        this.captchaIsReset = false;
      }
    }
    return update;
  }

  componentDidUpdate() {

    if(!this.captchaIsReset && get(this.props.uiState, "auth-modal.resetCaptcha", false)) {
      this.captchaIsReset = true;
      this.resetCaptcha();
    }

  }

  render() {
    
    //console.log("-- AuthForm --"/*, this.props*/);
    
    const {id, form, mode, step, error, pristine, dirty, valid, onSubmit, stateValues, submitFailed, submit, syncErrors, submitting, handleSubmit, options, uiState} = this.props;

    // nonce fields (values set via initialValues in connect() at the bottom of this file)
    const loginNonceField = <Field component={renderField} id="auth-nonce" type="hidden" name="fb_auth_form_nonce" />;
    const regNonceField = <Field component={renderField} id="auth-reg-nonce" type="hidden" name="_regnonce" />;

    let formContent = null;
    switch(mode) {

      case "login-fb":
      case "login":

        validators = {
          wp_login_user: {
            username: [validateRequired, maybeValidateEmail],
            password: [validateRequired]
          }
        };

        formContent = <div>
          {loginNonceField}
          <Field component={renderField} type="text" name="wp_login_user.username" label="email" />
          <Field component={renderField} type="password" name="wp_login_user.password" label="password" />
          <input type="submit" disabled={submitting} />
          {error && <p className="forgot-password"><a href="/login/?action=lost-password">Forgot password?</a></p>}
        </div>;

        break;

      case "register":

        if(step == 1) {

          validators = {
            display_name: validateRequired,
            user_email: [validateRequired, validateEmail],
            pass1: [validateRequired, validateMin7],
            pass2: [validateRequired, validateMatchPass]
          };

          formContent = <div>
            {loginNonceField}
            {regNonceField}
            <Field component={renderField} type="text" name="display_name" label="name" />
            <Field component={renderField} type="email" name="user_email" label="email" />
            <Field component={renderField} type="password" name="pass1" label="password" />
            <Field component={renderField} type="password" name="pass2" label="confirm" />
            <input type="submit" disabled={submitting} />
          </div>;

        } else if(step == 2) {

          validators = {
            dob: {
              month: validateRequired,
              day: validateRequired,
              year: validateRequired
            },
            "g-recaptcha-response": validateCaptcha
          };

          const months = map(this.months, (v, k) => { return {label: v, value: k}; /* <option key={"month-" + k} value={k}>{v}</option>; */ });
          const days = Array.from({length: 31}, (v, k) => { k++; return {label: k, value: k}; /* return <option key={"days-" + k} value={k+1}>{k+1}</option>; */ });
          const years = this.years.map((v) => { return {label: v, value: v}; /* <option key={"years-" + v} value={v}>{v}</option>; */ });

          const dobError = null; /*get(syncErrors, "dob", false) !== false ? <div className="auth-field-error">This field is required.</div> : null;*/
          const captchaError = null; /*get(syncErrors, "captcha", false) !== false ? <div className="auth-field-error">You must check the box.</div> : null;*/

          formContent = <div>
            <div id="auth-dob">
              {dobError}
              <Field component={renderDobField} name="dob.month" label="Birth Month" values={months} />
              <Field component={renderDobField} name="dob.day" label="Birth Day" values={days} />
              <Field component={renderDobField} name="dob.year" label="Birth Year" values={years} />
            </div>
            {captchaError}
            <Field component={renderCaptchaField} name="g-recaptcha-response" className="recaptcha" ref="auth-recaptcha" />
            <input type="submit" disabled={submitting} />
          </div>;

        }

        break;

      case "account-activation":

        validators = {
          required_meta: {
            password: [validateRequired]
          }
        };

        formContent = <div className="input-container">
          {loginNonceField}
          <div className="auth-field">
            <span className="auth-password auth-placeholder">PASSWORD</span>
            <input id="auth-password" type="password" name="required_meta.password" placeholder="Password" />
          </div>
          <a href="/login/?action=lost-password">Forgot your password?</a>
          <input type="submit" value="Yes, Activate My Account" disabled={submitting} />
        </div>;

        break;

      case "site-activation":

        validators = {};

        formContent = <div className="input-container">
            {loginNonceField}
            <input type="hidden" name="activate" value="1" />
            <input type="submit" disabled={submitting} />
          </div>;

        break;

      case "required-fields":

        validators = {
          zip: [validateRequired]
        };

        formContent = <div className="input-container">
            {loginNonceField}
            <p>
              <label>Zip</label>
              <input id="auth-zip" className="zip" type="text" name="zip" />
            </p>
            <input type="submit" disabled={submitting} />
            { submitting && <LoadingAnim width="30px" color="#c0c0c0" strokeWidth="4" id="auth-loading" /> }
          </div>;

        break;

    }

    return(<form id={id} className="auth-form" action="" method="post" onSubmit={handleSubmit(onSubmit)}>
      {error && <div className="auth-error">{error}</div>}
      {formContent}
      { submitting && <LoadingAnim width="30px" color="#c0c0c0" strokeWidth="4" id="auth-loading" /> }
    </form>);

  }

  resetCaptcha() {
    if(window.grecaptcha !== undefined) {
      window.grecaptcha.reset();
    }
    this.props.change(this.props.form, "g-recaptcha-response", "");
  }

}

let AuthFormComplete = compose(
  connect(
    (state, props) => (
      {
        destroyOnUnmount: false,
        form: "auth-form-" + props.mode.replace("-fb", ""),
        initialValues: {
          fb_auth_form_nonce: get(state, "json.response.options.authLoginFormNonce", ""),
          _regnonce: get(state, "json.response.options.authRegFormNonce", "")
        },
        options: state.json.response.options,
        stateValues: getFormValues("auth-form-" + props.mode)(state),
        syncErrors: getFormSyncErrors("auth-form-" + props.mode)(state),
        submitErrors: getFormSubmitErrors("auth-form" + props.mode)(state),
        uiState: state.ui,
        validate: validateAuthForm
      }
    ),
    (dispatch) => (
      bindActionCreators({
        remoteSubmit: submit
      }, dispatch)
    )
  ),
  reduxForm()
)(AuthForm);

export default AuthFormComplete;







