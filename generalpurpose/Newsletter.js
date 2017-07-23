import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
//import { newsletterRecaptchaClick } from "../../redux/actions/";
import {DropdownList} from "react-widgets";
import {MarkupHelper} from "../../utils/markup";
import shallowCompare from "react-addons-shallow-compare";
import classnames from "classnames";
import {fetchSailthru} from "../../redux/actions/";
import LoadingAnim from "./LoadingAnim";
import ReCAPTCHA from "react-google-recaptcha";
import get from "lodash/get";

class Newsletter extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      showRecaptcha: get(this.props,"showSubmit"),
      recaptchaResponse: null,
      email: "",
      showInput: true,
      list: get(this.props, "params.lists.0"),
      hasSubmitted: false
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handleList = this.handleList.bind(this);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  componentWillReceiveProps( nextProps){
    let id = get(this.props, "info.id");

    if (get(nextProps, `newsletter.${id}`)){
      if (get(nextProps, `newsletter.${id}.status`) == "loading"){
        this.setState({showRecaptcha: false});
      }
      else if (get(nextProps, `newsletter.${id}.data`)){
        if (get(nextProps, `newsletter.${id}.data.error`)){
          this.setState({showRecaptcha: true});
        }
        else if (get(nextProps, `newsletter.${id}.data.success`)){
          console.log("success");
          this.setState({showInput: false});
          this.setState({showRecaptcha: false});
        }
      }
    }
  }

  /*componentDidMount(){
    const
      {fetchSailthru} = this.props,
      {url} = this.props.data;
    fetchSailthru( this.id, url );
  }*/

  onClick( e, id ){
    this.setState({showRecaptcha: true});
  }

  handleEmail(event) {
    this.setState({email: event.target.value});
  }

  handleList(event) {
    this.setState({list: event});
  }

  handleSailthru(value){
    const
      {fetchSailthru, params} = this.props,
      id = get( this.props, "info.id", "" ),
      list = this.state.list === "" ? params.lists[0] : this.state.list;
    if(value !== null && !this.props.showSubmit) {
      this.setState({recaptchaResponse: value});
      this.setState({hasSubmitted: true});
      fetchSailthru(id, this.state.email, this.state.recaptchaResponse, list);
    }
    else if(this.props.showSubmit && value.type == "click") {
      value.preventDefault();
      this.setState({recaptchaResponse: window.grecaptcha.getResponse()});
      this.setState({hasSubmitted: true});
      fetchSailthru(id, this.state.email, this.state.recaptchaResponse, list);
    }
  }

  render(){
    const
      self = this,
      {data, dataDetails, params, newsletter, info} = this.props,
      id = get( this.props, "info.id", "" ),
      styles = typeof window === "undefined"?"":require( "../../resources/css/gizmos/newsletter/lazy.scss" ),
      recaptchaClass = classnames({
        recaptcha: true
      }),
      sailthruData = get( newsletter, id, false),
      className = classnames( "newsletter-frame clearfix",
        {
          "submitted": this.state.hasSubmitted,
          "recaptcha-visible": this.state.showRecaptcha,
          "newsletter-processing": sailthruData && sailthruData.status && sailthruData.status === "loading"
        }
      );

    let
      errorRender = [],
      list = params.lists.length === 1 ? <input type="hidden" name="list" value={this.state.list} /> : <DropdownList name="list" data={params.lists} placeholder="Select a Mailing List" value={this.state.list} onChange={(e)=>this.handleList(e)}/>,
      loading = [];

    if(sailthruData){
      if (sailthruData.status){
        if ( sailthruData.status == "loading"){
          loading = this.props.showSubmit ? <LoadingAnim width="30px" color="#000" strokeWidth="4"/> : <LoadingAnim width="30px" color="#fff" strokeWidth="4"/>;
        }
      }

      if (sailthruData.data){
        if (sailthruData.data.error){
          errorRender = <span className="error">{sailthruData.data.error}</span>;
          //this.refID.reset();
        }
        else if(sailthruData.data.success){
          errorRender = <span dangerouslySetInnerHTML={MarkupHelper.createInnerHtmlFromText(sailthruData.data.success)}></span>;
          list = [];
        }
      }
    }

    return(
      <form method="post" className={className}>
        <div className="content clearfix">
          {(!this.props.hasSponsor && this.props.showTitle && params.title ) && <p className="title">{params.title}</p>}
          {this.props.showDescription && <section className="sub-title"><h2 className="description">{params.description}</h2></section>}
          <div className="newsletter-fields vertical-center">
            <div className="vertical-centered">
              {this.state.showInput && <input type="email" name="email" placeholder="Email Address" onClick={(e)=>this.onClick(e, id)} value={this.state.email} onChange={(e)=>this.handleEmail(e)} />}
              {/*list*/}
              {loading}
              {errorRender}
              {this.state.showRecaptcha && <ReCAPTCHA className={recaptchaClass} ref={(id) => {this.refID = id; }} sitekey="6LcJiB4TAAAAAECLVme8vQvvFHGESasoeSFJqTAn" onChange={(e)=>this.handleSailthru(e)} />}
              {this.props.showSubmit && <button type="submit" value="Sign Up Now" onClick={(e)=>this.handleSailthru(e)}>Subscribe Now</button> }
            </div>
          </div>
        </div>
        {/*<p className="cto-container">
          <input type="submit" className="cto invert-colors" value="Sign Up Now"/>
        </p>*/ }
      </form>
    );
  }
}

Newsletter.defaultProps = {
  showSubmit: false,
  showDescription: false,
  showTitle: true,
  hasSponsor: false,
  hasSubmitted: false
};

function mapStateToProps(state) {
  return {
    //data:state.json.data.header,
    newsletter:state.newsletter
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    //newsletterRecaptchaClick,
    fetchSailthru
  }, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )(Newsletter);
//export default Newsletter;