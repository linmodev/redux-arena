import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "./actions";
import SceneBundle from "./SceneBundle";

/**
 * 根据传入的dict生成一个SceneBundle组件，并取得相应
 * reducerKey的state值
 * 
 * @export
 * @param {any} arenaReducerDict 
 * @returns 
 */
export default function arenaCurtainConnect(arenaReducerDict) {
  let mapDispatchToProps = dispatch => {
    return bindActionCreators(actions, dispatch);
  };

  let mapStateToProps = state => {
    let reducerKey = arenaReducerDict._curCurtain.reducerKey;

    return {
      PlayingScene: state[reducerKey].PlayingScene,
      curSceneBundle: state[reducerKey].curSceneBundle,
      reduxInfo: state[reducerKey].reduxInfo,
      parentArenaReducerDict: arenaReducerDict
    };
  };

  let wrappedComponent = connect(mapStateToProps, mapDispatchToProps)(
    SceneBundle
  );

  wrappedComponent.displayName = `arenaCurtainConnect({reducerKey:${arenaReducerDict
    ._curCurtain.reducerKey}})`;
  return wrappedComponent;
}
