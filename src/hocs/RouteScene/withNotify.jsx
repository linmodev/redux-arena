import React, { Component } from "react";
import SoloScene from "../SoloScene";
import { ARENA_SWITCH_SET_STATE } from "../../core/actionTypes";

class NotifierProxy extends Component {
  componentWillMount() {
    let { store, notifyData, switchReducerKey, isNotifyOn } = this.props;
    // 如果通知开启则更新[ArenaSwitch]的location,match
    // isNotifyOn在通过RouteScene调用时，默认是开启的
    if (isNotifyOn) {
      store.dispatch({
        type: ARENA_SWITCH_SET_STATE,
        _reducerKey: switchReducerKey,
        state: { location: notifyData.location, match: notifyData.match }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let { store, notifyData, switchReducerKey, isNotifyOn } = nextProps;
    // 如果通知开启则更新[ArenaSwitch]的location,match
    if (isNotifyOn) {
      store.dispatch({
        type: ARENA_SWITCH_SET_STATE,
        _reducerKey: switchReducerKey,
        state: { location: notifyData.location, match: notifyData.match }
      });
    }
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
    <NotifierProxy wrappedComponent={wrappedComponent} {...props} />
  );
  HOC.displayName = "RouteNotifier";
  return HOC;
}
