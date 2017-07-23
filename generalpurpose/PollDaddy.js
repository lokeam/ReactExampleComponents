import React from "react";
import get from "lodash/get";

const documentWritingComponentPromise = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (typeof window !== "undefined") {
        const postscribe = require("postscribe");
        postscribe(`#polldaddy-${get(data, "poll")}`, get(data, "html"), {
          done: () => {
            resolve(true);
          }
        });
      } else {
        resolve(true);
      }
    }, 500);
  });
};

class PollDaddy extends React.Component {

    constructor(props) {
      super(props);
      this.releaseTimeout = undefined;
      this.state = {
        released: false
      };
    }

    loadDocWriteCompnent(data) {
      documentWritingComponentPromise(data).then(() => this.setState({released: true}));
    }

    componentDidMount() {
      const {data} = this.props;
      this.releaseTimeout = setTimeout(() => this.loadDocWriteCompnent(data), 500);
    }

    componentWillUnmount() {
      clearTimeout(this.releaseTimeout);
    }

    render() {
      const {data} = this.props;
      if (!this.state.released) {
        return <div className="polldaddy-placeholder" />;
      }

      return (
        <div ref="polldaddy-container"></div>
      );
    }

}

export default PollDaddy;
