import React, { Component } from "react";
import PropTypes from "prop-types";
import SoloScene from "../SoloScene";
import { ARENA_SWITCH_SET_STATE } from "../../core/actionTypes";
import { ARENA_ROUTESCENE_LOAD_START } from "../../actionTypes";

class ArenaSwitchSyncAgent extends Component {
  static contextTypes = {
    arenaReducerDict: PropTypes.object,
    store: PropTypes.any
  };
  componentWillMount() {
    let { store, notifyData } = this.props;
    let { arenaReducerDict } = this.context;
    // 如果通知开启则更新[ArenaSwitch]的location,match
    // isNotifyOn在通过RouteScene调用时，默认是开启的
    store.dispatch({
      type: ARENA_SWITCH_SET_STATE,
      _reducerKey: arenaReducerDict._curSwitch.reducerKey,
      state: { location: notifyData.location, match: notifyData.match }
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let { store, notifyData } = nextProps;
    let { arenaReducerDict } = nextContext;
    store.dispatch({
      type: ARENA_SWITCH_SET_STATE,
      _reducerKey: arenaReducerDict._curSwitch.reducerKey,
      state: { location: notifyData.location, match: notifyData.match }
    });
  }

  render() {
    let {
      store,
      wrappedComponent,
      switchReducerKey,
      ...innerProps
    } = this.props;
    // 这里会真正创建soloScene
    // 传入以下props
    // key: path,
    // isNotifyOn,
    // notifyData: Object.assign({}, props, notifyData),
    // reducerKey,
    // vReducerKey,
    // asyncSceneBundle,
    // sceneBundle,
    // sceneProps,
    // SceneLoadingComponen
    return React.createElement(wrappedComponent, innerProps);
  }
}
// wrppedComponent 内部一般用SoloScene
export default function(wrappedComponent) {
  // 这个返回的是一个函数
  // 这个函数用来创建soloScene
  let HOC = props => (
    <ArenaSwitchSyncAgent wrappedComponent={wrappedComponent} {...props} />
  );
  HOC.displayName = "ArenaSwitchSyncHOC";
  return HOC;
}
