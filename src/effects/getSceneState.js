import { select, call } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

function* _getSceneState(key) {
  let entry = yield getArenaReducerDictEntry(key);
  return yield select(state => state[entry.reducerKey]);
}
//获取相应key的state
// 默认为_curScene
export default function getSceneState(key = "_curScene") {
  return call(_getSceneState, key);
}
