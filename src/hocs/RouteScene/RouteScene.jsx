import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import invariant from "invariant";
import SoloScene from "../SoloScene";
import withNotify from "./withNotify";

class RouteScene extends Component {
  static contextTypes = {
    arenaReducerDict: PropTypes.object,
    arenaSwitchDictItem: PropTypes.object,
    store: PropTypes.any
  };

  static propTypes = {
    // 生成reducer时用到的两个key
    reducerKey: PropTypes.string,
    vReducerKey: PropTypes.string,
    // 异步加载用到的bundle
    asyncSceneBuldle: PropTypes.any,
    sceneBundle: PropTypes.any,
    SceneLoadingComponent: PropTypes.any,
    sceneProps: PropTypes.object,
    isNotifyOn: PropTypes.bool,
    notifyData: PropTypes.object,
    exact: PropTypes.bool,
    path: PropTypes.string,
    strict: PropTypes.bool
  };

  static defaultProps = {
    isNotifyOn: true,
    exact: true
  };

  componentWillMount() {
    let SceneHOC = withNotify(SoloScene);
    this.state = {
      SceneHOC
    };
  }

  render() {
    let {
      exact,
      strict,
      path,
      computedMatch, // computedMatch,location是由react-router中的switch传递过来
      location,
      notifyData,
      isNotifyOn,
      reducerKey,
      vReducerKey,
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      SceneLoadingComponent
    } = this.props;
    let { arenaReducerDict, store } = this.context;
    return (
      <Route
        location={location}
        computedMatch={computedMatch}
        exact={exact}
        path={path}
        strict={strict}
        render={props => {
          return React.createElement(this.state.SceneHOC, {
            key: path,
            isNotifyOn,
            store,
            notifyData: Object.assign({}, props, notifyData),
            switchReducerKey: arenaReducerDict._curSwitch.reducerKey,
            reducerKey,
            vReducerKey,
            asyncSceneBundle,
            sceneBundle,
            sceneProps,
            SceneLoadingComponent
          });
        }}
      />
    );
  }
}

export default RouteScene;
