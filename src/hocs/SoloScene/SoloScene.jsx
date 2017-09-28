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
// SoloScene-每一个SoloScene都会生成一个curtain包含着一个SceneBundle
// SoloScene有两种调用方法
// 1. 第一种是使用bundleToComponent生成高阶组件使用
// 这个种方法只用传入bundle,不用传入额外的props,而且是同步加载的
// 其中{reducerKey,vReducerKey,asyncSceneBundle,sceneBundle,SceneLoadingComponent}是在第二种方法时传入
// 2. 自定义使用，各props可以自行传入
// 最终会渲染sceneBundleElement
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
    notifyData: PropTypes.object
  };

  componentWillMount() {
    // 生成SoloScene的curtain reducerKey
    let reducerKey = curtainAddReducer(
      this.context.store,
      this.props.reducerKey,
      createCurtainReducer
    );

    let { asyncSceneBundle, sceneBundle, sceneProps, notifyData } = this.props;
    // 把生成的reducerKey合并到当前的arenaReducerDict中
    let arenaReducerDict = calcCurtainReducerDict(
      // 这个arenaReducerDict是从ArenaSwitch中获得
      this.context.arenaReducerDict,
      reducerKey,
      this.props.vReducerKey
    );

    // 生成一个关注了{PlayigScene,curSceneBundle,reduxInfo,parentArenaReducerDict}
    // 的高阶组件
    let wrappedSceneBundle = arenaCurtainConnect(arenaReducerDict);
    // 生成这个sceneBundle的实例
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      notifyData
    });
    // 暂时保存一些信息
    this.state = {
      arenaReducerDict,
      wrappedSceneBundle,
      sceneBundleElement,
      // 异步初始化curtain
      // 为了保存当前task运行信息
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
      notifyData
    } = nextProps;
    let newReducerKey = this.state.arenaReducerDict._curCurtain.reducerKey;
    if (
      reducerKey != null &&
      reducerKey !== this.state.arenaReducerDict._curCurtain.reducerKey
    ) {
      // 如果传入的reducerKey改变了则
      // 清除原来的curtain
      // 重新添加新的curtain
      // 重新初始化一个curtain
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
      notifyData !== this.props.notifyData ||
      refreshFlag == true
    ) {
      this.setState({
        sceneBundleElement: React.createElement(this.state.wrappedSceneBundle, {
          asyncSceneBundle,
          sceneBundle,
          sceneProps,
          notifyData
        })
      });
    }
  }

  componentWillUnmount() {
    // 卸载前进行清除reducer
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
