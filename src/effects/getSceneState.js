import { select, call } from "redux-saga/effects";
import getArenaReducerDictEntry from "./getArenaReducerDictEntry";

function* _getSceneState(key) {
  // 拿到当前key的dict
  let entry = yield getArenaReducerDictEntry(key);
  return yield select(state => state[entry.reducerKey]);
}
//获取相应key的state
// 默认为_curScene--当前scene的
export default function getSceneState(key = "_curScene") {
  return call(_getSceneState, key);
}
