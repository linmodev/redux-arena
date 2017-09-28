import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import invariant from "invariant";
import SoloScene from "../SoloScene";
import syncSwitchState from "./syncSwitchState";

class RouteScene extends Component {
  static contextTypes = {
    store: PropTypes.any
  };

  static propTypes = {
    // 生成reducer时用到的两个key
    reducerKey: PropTypes.string,
    vReducerKey: PropTypes.string,
    // 异步加载用到的bundle
    asyncSceneBuldle: PropTypes.any,
    sceneBundle: PropTypes.any,
    sceneProps: PropTypes.object,
    notifyData: PropTypes.object,
    exact: PropTypes.bool,
    path: PropTypes.string,
    strict: PropTypes.bool
  };

  static defaultProps = {
    exact: true
  };

  componentWillMount() {
    // 创建高阶组件
    // 此时是提前创建了一层高阶组件作为代理
    // 而且此高阶组件只是一个无状态组件
    // 优点：避免了不必要的渲染，优化了性级
    let { store } = this.context;
    let { asyncSceneBundle, sceneBundle, sceneProps } = this.props;
    let SceneHOC = syncSwitchState(SoloScene);
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
      reducerKey,
      vReducerKey,
      asyncSceneBundle,
      sceneBundle,
      sceneProps
    } = this.props;
    let { store } = this.context;
    return (
      <Route
        location={location}
        computedMatch={computedMatch}
        exact={exact}
        path={path}
        strict={strict}
        render={props => {
          // 当真正渲染到这个节点时，以下props会直接传给syncSwitchState
          // syncSwitchState返回的hoc组件【RouteNotifier】
          // hoc组件最终回返回SoloScene组件
          // 关于notifiyData默认会合并Route组件传入的location,history,match
          return React.createElement(this.state.SceneHOC, {
            key: path,
            store,
            notifyData: Object.assign({}, props, notifyData),
            reducerKey,
            vReducerKey,
            asyncSceneBundle,
            sceneBundle,
            sceneProps
          });
        }}
      />
    );
  }
}

export default RouteScene;
