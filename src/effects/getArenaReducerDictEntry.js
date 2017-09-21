import { getContext, call } from "redux-saga/effects";

// 获取相应key的state
function* _getArenaReducerDictEntry(key) {
  let dict = yield getContext("arenaReducerDict");
  let entry = dict[key];
  if (entry == null) throw new Error(`can not get entry of key: "${key}"`);
  return entry;
}
// 返回一个call effect
export default function getArenaReducerDictEntry(key) {
  return call(_getArenaReducerDictEntry, key);
}
