import LoadingAnim from "./generalpurpose/LoadingAnim";
import get from "lodash/get";
import replace from "lodash/replace";
import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

class SearchGoogle extends Component{
  constructor (props) {
    super(props);
  }
  shouldComponentUpdate( nextProps, nextState ){
    return shallowCompare( this, nextProps, nextState );
  }

  componentDidMount() {
    let scriptText = `
      var googleSearchCallback = function() {
        if (document.readyState == 'complete') {
          // Document is ready when CSE element is initialized.
          // Render an element with both search box and search results in div with id 'test'.
          google.search.cse.element.render({
            div: "cse",
            tag: 'searchresults-only',
            gname: 'googleSearch1',
            attributes: {
              sort_by: "{{googleCSESort}}",
              resultSetSize: "large",
              linkTarget: "_top",
              enableOrderBy: true
            }
          });
          var element1 = google.search.cse.element.getElement('googleSearch1');
          element1.execute("{{searchTerm}}");
        } else {
          // Document is not ready yet, when CSE element is initialized.
          google.setOnLoadCallback(function() {
             // Render an element with both search box and search results in div with id 'test'.
              google.search.cse.element.render({
                div: "cse",
                tag: 'searchresults-only',
                gname: 'googleSearch1',
                attributes: {
                  sort_by: "{{googleCSESort}}",
                  resultSetSize: "large",
                  linkTarget: "_top",
                  enableOrderBy: true
                }
              });
              var element1 = google.search.cse.element.getElement('googleSearch1');
              element1.execute("{{searchTerm}}");
          }, true);
        }
      };

      // Insert it before the CSE code snippet so that cse.js can take the script
      // parameters, like parsetags, callbacks.
      window.__gcse = {
        parsetags: 'explicit',
        callback: googleSearchCallback
      };

      (function() {
        var cx = '{{googleCSEID}}'; // Insert your own Custom Search engine ID here
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = false;
        gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);      })();
    `;

    const { params, dataDetails } = this.props;
    let searchTerm = get(params, "searchTerm");
    let googleCSEID = get(params, "googleCSEID");
    let googleCSESort = get(params, "googleCSESort") || "Relevance";

    scriptText = replace(scriptText, /{{searchTerm}}/g, searchTerm);
    scriptText = replace(scriptText, "{{googleCSEID}}", googleCSEID);
    scriptText = replace(scriptText, /{{googleCSESort}}/g, googleCSESort);

    if (typeof document !== "undefined") {
      const script = document.createElement("script");
      script.text = scriptText;
      document.body.appendChild(script);
    }

  }

  render(){
    const
      { params, dataDetails } = this.props,
      id = get( dataDetails, "info.id" ) || 1;

    const searchTerm = get(params, "searchTerm");

    return(
      <section id={id}>
        <header className="header-band">
          <h2>Search Results For {searchTerm}</h2>
        </header>
        <div className="google-search">
          <div id="cse">
          </div>
        </div>
      </section>
    );
  }
}

export default SearchGoogle;

