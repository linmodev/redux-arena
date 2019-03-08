import * as React from "react";
import * as PropTypes from "prop-types";
import { ReducerDict, SceneBundle } from "../../core";
import { ConnectedProps, State } from "./types";
import { isEmpty } from "../../utils/isEmpty";
import { Context as ArenaContext } from "../ArenaScene/types";
const ReactReduxContext = require("react-redux").ReactReduxContext;
export default class BundleComponent extends React.Component<
  ConnectedProps,
  State
> {
  _isValid = false;

  buildLoadScenePromise(
    arenaReducerDict: ReducerDict,
    sceneBundle: SceneBundle<{}, {}, {}, {}>,
    isInitial: any
  ): Promise<null> {
    if (isInitial) {
      return new Promise(resolve =>
        setImmediate(() =>
          this.props.curtainLoadScene(
            this.props.arenaReducerDict,
            this.props.sceneBundle,
            true,
            resolve
          )
        )
      );
    } else {
      return new Promise(resolve =>
        this.props.curtainLoadScene(
          this.props.arenaReducerDict,
          this.props.sceneBundle,
          true,
          resolve
        )
      );
    }
  }
  static contextType = ReactReduxContext;
  context: ArenaContext;
  shouldComponentUpdate(nextProps: ConnectedProps) {
    console.log("should componet ");

    const objKeys = Object.keys(this.props);
    let hasChangeed = false;
    hasChangeed = !objKeys.every((key: keyof ConnectedProps) => {
      if (isEmpty(nextProps[key]) && isEmpty(this.props[key])) return true;
      return nextProps[key] === this.props[key];
    });
    return hasChangeed;
  }
  componentWillMount() {
    // console.log("will mount ", this.props.context);
    this._isValid = true;
    let loadedPromise = this.buildLoadScenePromise(
      this.props.arenaReducerDict,
      this.props.sceneBundle,
      true
    );
    this.setState({
      loadedPromise
    });
  }

  componentWillReceiveProps(nextProps: ConnectedProps) {
    let { sceneBundle } = nextProps;
    if (sceneBundle !== this.props.sceneBundle) {
      this.state.loadedPromise.then(() => {
        if (this._isValid) {
          let loadedPromise = this.buildLoadScenePromise(
            nextProps.arenaReducerDict,
            nextProps.sceneBundle,
            false
          );
          this.setState({
            loadedPromise
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this._isValid = false;
    console.log(this.props);
    this.props.clearCurtain();
    this.props.mutableObj.isObsolete = true;
  }

  render() {
    let { PlayingScene, sceneProps } = this.props;
    if (PlayingScene != null) {
      const newContext = {
        arenaReducerDict:
          this.props.reduxInfo && this.props.reduxInfo.arenaReducerDict,
        storeState: this.context.storeState,
        store: this.context.store
      };
      return (
        <ReactReduxContext.Provider value={newContext}>
          <PlayingScene {...sceneProps} />
        </ReactReduxContext.Provider>
      );
    } else {
      return <div />;
    }
  }
}
