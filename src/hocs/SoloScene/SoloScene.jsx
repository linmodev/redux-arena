import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  ARENA_CURTAIN_INIT_SAGA,
  ARENA_CURTAIN_CLEAR_REDUX
} from "../../core/actionTypes";
import { createCurtainReducer } from "../../core/reducers";
import { curtainAddReducer, calcCurtainReducerDict } from "../../utils";
import { arenaCurtainConnect } from "../SceneBundle";
// SoloScene-每一个SoloScene都会生成一个curtain
// SoloScene有两种调用方法
// 1. 第一种是使用bundleToComponent生成高阶组件使用
// 这个种方法只用传入bundle,不用传入额外的props,而且是同步加载的
// 其中{reducerKey,vReducerKey,asyncSceneBundle
export default class SoloScene extends Component {
  static contextTypes = {
    store: PropTypes.any,
    arenaReducerDict: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.any,
    // 两个自定义的reducerKey
    reducerKey: PropTypes.string,
    vReducerKey: PropTypes.string,
    // 两个同步或异步加载的bundle
    sceneBundle: PropTypes.object,
    asyncSceneBuldle: PropTypes.object,
    // 由bundleToComponent传入
    sceneProps: PropTypes.object,
    notifyData: PropTypes.object,
    SceneLoadingComponent: PropTypes.any
  };

  componentWillMount() {
    // 生成SoloScene的curtain reducerKey
    let reducerKey = curtainAddReducer(
      this.context.store,
      this.props.reducerKey,
      createCurtainReducer
    );

    let {
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      notifyData,
      SceneLoadingComponent
    } = this.props;

    // 生成相应的curtainDict且合并到arenaReducerDict
    let arenaReducerDict = calcCurtainReducerDict(
      this.context.arenaReducerDict,
      reducerKey,
      this.props.vReducerKey
    );

    //
    let wrappedSceneBundle = arenaCurtainConnect(arenaReducerDict);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      notifyData,
      SceneLoadingComponent
    });
    this.state = {
      arenaReducerDict,
      wrappedSceneBundle,
      sceneBundleElement,
      sagaTaskPromise: new Promise(resolve =>
        this.context.store.dispatch({
          type: ARENA_CURTAIN_INIT_SAGA,
          reducerKey,
          setSagaTask: resolve
        })
      )
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let refreshFlag = false;
    let {
      reducerKey,
      vReducerKey,
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      notifyData,
      SceneLoadingComponent
    } = nextProps;
    let newReducerKey = this.state.arenaReducerDict._curCurtain.reducerKey;
    if (
      reducerKey != null &&
      reducerKey !== this.state.arenaReducerDict._curCurtain.reducerKey
    ) {
      refreshFlag = true;
      nextContext.store.dispatch({
        type: ARENA_CURTAIN_CLEAR_REDUX,
        reducerKey: this.state.arenaReducerDict._curCurtain.reducerKey,
        sagaTaskPromise: this.state.sagaTaskPromise
      });
      newReducerKey = curtainAddReducer(
        nextContext.store,
        reducerKey,
        createCurtainReducer
      );
      this.state.sagaTaskPromise = new Promise(resolve =>
        nextContext.store.dispatch({
          type: ARENA_CURTAIN_INIT_SAGA,
          reducerKey: newReducerKey,
          setSagaTask: resolve
        })
      );
    }
    if (
      nextContext.arenaReducerDict !== this.context.arenaReducerDict ||
      reducerKey !== this.props.reducerKey ||
      vReducerKey !== this.props.vReducerKey ||
      refreshFlag === true
    ) {
      refreshFlag = true;
      this.state.arenaReducerDict = calcCurtainReducerDict(
        nextContext.arenaReducerDict,
        newReducerKey,
        nextProps.vReducerKey
      );
      this.state.wrappedSceneBundle = arenaCurtainConnect(
        this.state.arenaReducerDict
      );
    }
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      sceneProps !== this.props.sceneBundle ||
      SceneLoadingComponent !== this.props.SceneLoadingComponent ||
      notifyData !== this.props.notifyData ||
      refreshFlag == true
    ) {
      this.setState({
        sceneBundleElement: React.createElement(this.state.wrappedSceneBundle, {
          asyncSceneBundle,
          sceneBundle,
          sceneProps,
          notifyData,
          SceneLoadingComponent
        })
      });
    }
  }

  componentWillUnmount() {
    this.context.store.dispatch({
      type: ARENA_CURTAIN_CLEAR_REDUX,
      reducerKey: this.state.arenaReducerDict._curCurtain.reducerKey,
      sagaTaskPromise: this.state.sagaTaskPromise
    });
  }

  render() {
    return this.state.sceneBundleElement;
  }
}
