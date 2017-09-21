import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {
  ARENA_CURTAIN_INIT_SAGA,
  ARENA_CURTAIN_CLEAR_REDUX
} from "../../core/actionTypes";
import { createSwitchReducer } from "../../core/reducers";
import {
  switchAddReducer,
  switchRmAndAddReducer,
  calcSwitchReducerDict
} from "../../utils";

export default class ArenaSwitch extends Component {
  static contextTypes = {
    store: PropTypes.any,
    arenaReducerDict: PropTypes.object
  };
  // 定义arenaReducerDict在context
  static childContextTypes = {
    arenaReducerDict: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.any,
    reducerKey: PropTypes.string,
    vReducerKey: PropTypes.string
  };

  componentWillMount() {
    // 生成，添加reducer,生成arenaReducerDict对象
    let reducerKey = switchAddReducer(
      this.context.store,
      this.props.reducerKey,
      createSwitchReducer
    );
    let arenaReducerDict = calcSwitchReducerDict(
      this.context.arenaReducerDict,
      reducerKey,
      this.props.vReducerKey
    );
    this.state = {
      arenaReducerDict
    };
  }
  /**
   * 
   * 
   * @param {any} nextProps 
   * @param {any} nextContext 
   * @memberof ArenaSwitch
   */
  componentWillReceiveProps(nextProps, nextContext) {
    let { reducerKey, vReducerKey } = nextProps;
    let curReducerKey = this.state.arenaReducerDict._curSwitch.reducerKey;
    // 如果其中一个reducerKey改变了
    if (
      nextContext.arenaReducerDict !== this.context.arenaReducerDict ||
      reducerKey !== this.props.reducerKey ||
      vReducerKey !== this.props.vReducerKey
    ) {
      let newReducerKey = curReducerKey;
      // 如果传入的reucerKey与当前key不一样
      if (reducerKey !== curReducerKey && reducerKey != null) {
        // 替换掉reducer
        newReducerKey = switchRmAndAddReducer(
          nextContext.store,
          curReducerKey,
          reducerKey,
          createSwitchReducer
        );
      }
      // 生成新的arenaReducerDict
      this.state.arenaReducerDict = calcSwitchReducerDict(
        nextContext.arenaReducerDict,
        newReducerKey,
        vReducerKey
      );
    }
  }

  getChildContext() {
    // 挂载到context对象上
    return {
      arenaReducerDict: this.state.arenaReducerDict
    };
  }

  render() {
    // 注：这个location并不一定存在
    return (
      <Switch location={this.props.location}>{this.props.children}</Switch>
    );
  }
}
