import * as PropTypes from "prop-types";
import * as React from "react";
import { isEmpty } from "../../utils/isEmpty";
import { EnhancedStore, ReducerDict } from "../../core";
import ActionTypes from "../../core/ActionTypes";
import { createCurtainReducer } from "../../core/reducers";
import {
  addStateTreeNode,
  buildCurtainReducerDict,
  curtainAddReducer
} from "../../utils";
import { curtainConnect } from "../BundleComponent";
import { Context as ArenaContext, Props, State } from "./types";
const ReactReduxContext = require("react-redux")
  .ReactReduxContext as React.Context<ArenaContext>;
function buildConnectedSceneBundle(
  reducerKey: string,
  store: EnhancedStore<any>
  // context:ArenaContext
) {
  let sagaTaskPromise = new Promise(resolve =>
    store.dispatch({
      type: ActionTypes.ARENA_CURTAIN_INIT_SAGA,
      reducerKey,
      setSagaTask: resolve
    })
  );
  return curtainConnect(reducerKey, () =>
    store.dispatch({
      type: ActionTypes.ARENA_CURTAIN_CLEAR_REDUX,
      reducerKey,
      sagaTaskPromise
    })
  );
}

function getParentReducerKey(arenaReducerDict: ReducerDict | undefined | null) {
  return (
    arenaReducerDict &&
    arenaReducerDict._arenaScene &&
    arenaReducerDict._arenaScene.reducerKey
  );
}

export default class ArenaScene extends React.Component<Props, State> {
  static contextType = ReactReduxContext;
  context!: ArenaContext;
  componentWillMount() {
    let { store, arenaReducerDict } = this.context;
    let { sceneBundle, sceneProps, reducerKey, vReducerKey } = this.props;
    // add reducerKey  reducer and state
    let newReducerKey = curtainAddReducer(
      store,
      reducerKey,
      createCurtainReducer
    );

    let parentReducerKey = getParentReducerKey(arenaReducerDict);
    //  add reducerKey into areanState's stateTree and StateTreeDict
    addStateTreeNode(store, parentReducerKey, newReducerKey);
    // build self arenaReducerDict and pass to BundleComponent as arenaReducerDict context
    let newArenaReducerDict = buildCurtainReducerDict(
      arenaReducerDict,
      newReducerKey,
      vReducerKey
    );

    // 1.initialize curtain saga
    // 2.save curtain initialization info ---as it use promise
    // 3.build curtain connect component
    // 4.save reducerKey for connect component
    let ConnectedBundleComponent = buildConnectedSceneBundle(
      newReducerKey,
      this.context.store
      // this.context
    );
    let connectedBundleElement = React.createElement(ConnectedBundleComponent, {
      arenaReducerDict: newArenaReducerDict,
      sceneBundle,
      sceneProps
    });
    this.setState({
      parentReducerKey,
      arenaReducerDict: newArenaReducerDict,
      ConnectedBundleComponent,
      connectedBundleElement
    });
  }
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { reducerKey, vReducerKey, sceneBundle, sceneProps } = nextProps;
    if (
      reducerKey !== this.props.reducerKey ||
      vReducerKey !== this.props.vReducerKey ||
      sceneBundle !== this.props.sceneBundle ||
      // reducer {}==={} :false render times
      (sceneProps !== this.props.sceneProps &&
        !(isEmpty(sceneProps) && isEmpty(this.props.sceneProps))) ||
      this.state !== nextState
    ) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps: any, nextContext: any) {
    // Object.entries(this.state).forEach(([key, val]:[string,any]) =>
    //   prevState[key] !== val && console.log(`State '${key}' changed`)
    // );
    let refreshFlag = false;
    let state: State = Object.assign({}, this.state);
    let { reducerKey, vReducerKey, sceneBundle, sceneProps } = nextProps;
    let curReducerKey = state.arenaReducerDict._arenaCurtain.reducerKey;
    let newReducerKey = curReducerKey;
    if (reducerKey != null && reducerKey !== curReducerKey) {
      refreshFlag = true;
      newReducerKey = curtainAddReducer(
        nextContext.store,
        reducerKey,
        createCurtainReducer
      );
      addStateTreeNode(
        nextContext.store,
        this.state.parentReducerKey,
        newReducerKey
      );
      state.ConnectedBundleComponent = buildConnectedSceneBundle(
        newReducerKey,
        nextContext.store
        // nextContext
      );
    }
    if (
      nextContext.arenaReducerDict !== this.context.arenaReducerDict ||
      reducerKey !== this.props.reducerKey ||
      vReducerKey !== this.props.vReducerKey ||
      sceneBundle !== this.props.sceneBundle ||
      // reducer {}==={} :false render times
      (sceneProps !== this.props.sceneProps &&
        !(isEmpty(sceneProps) && isEmpty(this.props.sceneProps))) ||
      refreshFlag === true
    ) {
      refreshFlag = true;
      state.arenaReducerDict = buildCurtainReducerDict(
        nextContext.arenaReducerDict,
        newReducerKey,
        nextProps.vReducerKey
      );
      state.connectedBundleElement = React.createElement(
        state.ConnectedBundleComponent,
        {
          sceneBundle,
          sceneProps,
          arenaReducerDict: state.arenaReducerDict
        }
      );
    }
    // this.setState(state);
  }

  render() {
    return this.state.connectedBundleElement;
  }
}
