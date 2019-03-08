import { connect } from "react-redux";
import { ActionCreatorsMapObject } from "redux";
import { getContext, put, select } from "redux-saga/effects";
import ActionTypes from "../ActionTypes";
import { createPropsPicker } from "../enhancedRedux";
import { CurtainReduxInfo, CurtainState } from "../reducers/types";
import { CurtainLoadSceneAction, SceneBundle } from "../types";
import { sceneApplyRedux, sceneUpdateRedux } from "./sceneReduxSaga";

export function* applySceneBundle<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
>({
  isInitial,
  arenaReducerDict,
  sceneBundle,
  loadedCb
}: CurtainLoadSceneAction<P, S, A, PP>) {
  let arenaCurtainReducerKey = arenaReducerDict._arenaCurtain.reducerKey;
  let curtainState: CurtainState<P> = yield select(
    (state: any) => state[arenaCurtainReducerKey]
  );
  let {
    curSceneBundle,
    reduxInfo,
    PlayingScene: OldPlayingScene,
    mutableObj
  } = curtainState;
  mutableObj.isObsolete = true;
  let newReduxInfo: CurtainReduxInfo<S>;
  //Use yield* because there is fork effect in sceneApplyRedux and sceneUpdateRedux
  if (isInitial) {
    newReduxInfo = yield* sceneApplyRedux<P, S, A, PP>({
      arenaReducerDict,
      state: sceneBundle.state,
      saga: sceneBundle.saga,
      actions: sceneBundle.actions,
      reducer: sceneBundle.reducer,
      options: sceneBundle.options
    });
  } else {
    newReduxInfo = yield* sceneUpdateRedux<P, S, A, PP>({
      arenaReducerDict,
      state: sceneBundle.state,
      saga: sceneBundle.saga,
      actions: sceneBundle.actions,
      reducer: sceneBundle.reducer,
      options: sceneBundle.options,
      curSceneBundle: curSceneBundle as SceneBundle<P, S, A, PP>,
      reduxInfo: reduxInfo as CurtainReduxInfo<S>
    });
  }
  let newMutableObj = { isObsolete: false };
  let propsPicker = createPropsPicker(
    sceneBundle.propsPicker,
    newReduxInfo,
    newMutableObj
  );
  let PlayingScene = connect(propsPicker)(sceneBundle.Component as any);

  let displayName =
    sceneBundle.Component.displayName ||
    sceneBundle.Component.name ||
    "Unknown";
  PlayingScene.displayName = `SceneConnect({reducerKey:${
    newReduxInfo.reducerKey
  },Component:${displayName}})`;
  let newArenaState = {
    PlayingScene,
    curSceneBundle: sceneBundle,
    reduxInfo: newReduxInfo,
    mutableObj: newMutableObj
  };
  yield put({
    type: ActionTypes.ARENA_CURTAIN_SET_STATE,
    _reducerKey: arenaCurtainReducerKey,
    state: newArenaState
  });
  loadedCb();
  if (
    reduxInfo != null &&
    newReduxInfo.reducerKey !== reduxInfo.reducerKey &&
    reduxInfo.reducerKey != null
  ) {
    let arenaStore = yield getContext("store");
    yield put({
      type: ActionTypes.ARENA_STATETREE_NODE_DISABLE,
      reducerKey: reduxInfo.reducerKey
    });
    arenaStore.removeSingleReducer(reduxInfo.reducerKey);
    yield put({
      type: ActionTypes.ARENA_STATETREE_NODE_DELETE,
      reducerKey: reduxInfo.reducerKey
    });
  }
}
