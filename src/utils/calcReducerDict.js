function calcReducerKey(
  arenaReducerDict,
  reducerKey,
  vReducerKey,
  curReducerKey
) {
  let item = { actions: {}, reducerKey, vReducerKey };
  let newDict = Object.assign({}, arenaReducerDict, {
    [reducerKey]: item
  });
  if (vReducerKey) {
    newDict[vReducerKey] = item;
  }
  newDict[curReducerKey] = item;
  newDict._curScene = null;
  return newDict;
}
// 生成的arenaReducerDict
// let temp = {
//   reducerKey: {
//     vReducerKey: "aaaaaaaaa",
//     reducerKey: "bbbbbbb",
//     "actions:": {}
//   },
//   vReducerKey: {
//     vReducerKey: "aaaaaaaaa",
//     reducerKey: "bbbbbbb",
//     "actions:": {}
//   },
//   _curSwitch: {
//     vReducerKey: "aaaaaaaaa",
//     reducerKey: "bbbbbbb",
//     "actions:": {}
//   },
//   _curCurtain: {
//     vReducerKey: "aaaaaaaaa",
//     reducerKey: "bbbbbbb",
//     "actions:": {}
//   },
//   _curScene: null
// };

/**
 * 内部函数，根据curtainReducerKey
 * 用来生成重新计算后的arenaReducerDict
 * 
 * @export
 * @param {any} arenaReducerDict 
 * @param {any} curtainReducerKey 
 * @param {any} vReducerKey 
 * @returns 
 */
export function calcCurtainReducerDict(
  arenaReducerDict,
  curtainReducerKey,
  vReducerKey
) {
  return calcReducerKey(
    arenaReducerDict,
    curtainReducerKey,
    vReducerKey,
    "_curCurtain"
  );
}
/**
 * 内部函数，根据switchReducerKey
 * 用来生成重新计算后的arenaReducerDict
 * 
 * 
 * @export
 * @param {any} arenaReducerDict 
 * @param {any} switchReducerKey 
 * @param {any} vReducerKey 
 * @returns 
 */
export function calcSwitchReducerDict(
  arenaReducerDict,
  switchReducerKey,
  vReducerKey
) {
  return calcReducerKey(
    arenaReducerDict,
    switchReducerKey,
    vReducerKey,
    "_curSwitch"
  );
}
