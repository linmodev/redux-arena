import React, { Component } from "react";
import SoloScene from "../hocs/SoloScene";
/**
 * 返回一个高阶组件
 * @param {*打包的模块} bundle 
 */

export default function(bundle) {
  let WrapperClass = class extends Component {
    static displayName = "ScenePropsProxyWrapper";
    render() {
      return <SoloScene sceneBundle={bundle} sceneProps={this.props} />;
    }
  };
  return WrapperClass;
}
