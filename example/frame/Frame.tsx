import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import actions from "./redux/actions";

import ModuleReUse from "../ModuleReUse";
import ScopedPage from "../ScopedPage";
import PassDownState from "../PassDownStateF";
import { Props } from "./types";

const linkStyle = {
  textDecoration: "underline",
  color: "blue",
  cursor: "pointer"
};

class Frame extends React.Component<Props, { page: string }> {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.setState({
      page: "emptyPage"
    });
  }
  componentWillReceiveProps() {
    console.log("frame recieve props");
  }
  render() {
    let { cnt, addCnt, clearCnt } = this.props;
    console.log("frame render");
    return (
      <div>
        <div>
          <ul>
            <li>
              <a
                style={linkStyle}
                onClick={() => this.setState({ page: "emptyPage" })}
              >
                Empty Page
              </a>
            </li>
            <li>
              <a
                style={linkStyle}
                onClick={() => this.setState({ page: "scopedPage" })}
              >
                Scoped Page
              </a>
            </li>
            <li>
              <a
                style={linkStyle}
                onClick={() =>
                  this.setState({ page: "passDownStateAndActions" })
                }
              >
                Pass Down State And Actions
              </a>
            </li>
            <li>
              <a
                style={linkStyle}
                onClick={() => this.setState({ page: "moduleReUse" })}
              >
                Module Re-Use
              </a>
            </li>
          </ul>
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: "1rem" }}>total count: {cnt}</div>
            <button onClick={addCnt} style={{ marginLeft: "1rem" }}>
              Add Total Count----
            </button>
            <button onClick={clearCnt} style={{ marginLeft: "1rem" }}>
              Clear Total Count
            </button>
          </div>
          <hr />
          <div>
            <div style={{ marginTop: "1rem" }}>
              {this.state.page === "scopedPage" ? (
                <ScopedPage />
              ) : this.state.page === "passDownStateAndActions" ? (
                <PassDownState />
              ) : // <div />
              this.state.page === "moduleReUse" ? (
                <ModuleReUse />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

function mapStateToProps(state) {
  return { cnt: state.frame.cnt };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Frame);
