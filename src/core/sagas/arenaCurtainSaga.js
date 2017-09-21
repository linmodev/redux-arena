import {
  ARENA_CURTAIN_LOAD_SCENE,
  ARENA_CURTAIN_LOAD_ASYNCSCENE,
  ARENA_CURTAIN_INIT_SAGA,
  ARENA_CURTAIN_CLEAR_REDUX,
  ARENA_CURTAIN_SET_STATE
} from "../actionTypes";
import {
  takeEvery,
  take,
  put,
  fork,
  select,
  cancel,
  setContext,
  getContext
} from "redux-saga/effects";
import { applySceneBundle, applyAsyncSceneBundle } from "./sceneBundleSaga";

function* takeEverySceneBundleAction() {
  let _reducerKey = yield getContext("_reducerKey");
  let lastTask;
  while (true) {
    // 启动对每一次scene的同步和异步加载
    let action = yield take([
      ARENA_CURTAIN_LOAD_ASYNCSCENE,
      ARENA_CURTAIN_LOAD_SCENE
    ]);
    if (action.parentArenaReducerDict._curCurtain.reducerKey === _reducerKey) {
      // 如果上一次的scene存在还在运行，就取消它
      if (lastTask && lastTask.isRunning()) {
        yield cancel(lastTask);
      }
      // 根据type判断是同步加载还是异步加载，然后使用lastTask保存运行信息
      if (action.type === ARENA_CURTAIN_LOAD_ASYNCSCENE) {
        lastTask = yield fork(applyAsyncSceneBundle, action);
      } else {
        lastTask = yield fork(applySceneBundle, action);
      }
    }
  }
}

/**
 * Listen to the loading of each scene,
 * and handle different processing functions when handling sence switches.
 * 设置上下文ctx--reducerKey
 * 运行takeEverySceneBundleAction
 * @param {any} ctx 
 */

function* forkSagaWithContext(ctx) {
  yield setContext(ctx);
  yield fork(takeEverySceneBundleAction);
}

/**
 * It is used to initialize the ArenaSwitch layer.
 * curtain初始化saga
 * @param {any} { reducerKey, setSagaTask } 
 */

function* initArenaCurtainSaga({
  reducerKey,
  setSagaTask,
  isWaitingSwitchAction = false
}) {
  // 设置状态
  yield put({
    type: ARENA_CURTAIN_SET_STATE,
    _reducerKey: reducerKey,
    state: {
      isWaiting: isWaitingSwitchAction
    }
  });
  // 运行并设置context——_reducerKey
  let sagaTask = yield fork(forkSagaWithContext, {
    _reducerKey: reducerKey
  });
  // 改变sagaTaskPromise的运行状态为resolve
  setSagaTask(sagaTask);
}

/**
 * It is used to cancel the task of the ArenaSwitch layer.
 * 在soloScene卸载或者外部改变了传入soloScene的reduceKey,就结束这Task
 * @param {any} { sagaTaskPromise } 
 */

function* killArenaCurtainSaga({ sagaTaskPromise, reducerKey }) {
  // 取消这个task
  let sagaTask = yield sagaTaskPromise;
  if (sagaTask) yield cancel(sagaTask);
  //
  let store = yield getContext("store");
  let { reduxInfo } = yield select(state => state[reducerKey]);
  if (reduxInfo.sagaTask) {
    yield cancel(reduxInfo.sagaTask);
  }
  if (reduxInfo.reducerKey) {
    store.removeReducer(reduxInfo.reducerKey);
  }
  store.removeReducer(reducerKey);
}

export default function* saga() {
  yield takeEvery(ARENA_CURTAIN_INIT_SAGA, initArenaCurtainSaga);
  yield takeEvery(ARENA_CURTAIN_CLEAR_REDUX, killArenaCurtainSaga);
}
