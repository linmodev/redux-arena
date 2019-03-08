import { ActionsDict, bundleToComponent, StateDict } from "redux-arena";
import actions from "./actions";
import Child from "./Child";
import reducer from "./reducer";
import state from "./state";
import { Actions, State } from "./types";

const propsPicker = (
  {
    $0: state,
    parent: parentState,
    $1,
    $2,
    $3
  }: StateDict<State, { parent: any; $1: any; $2; $3 }>,
  { $0: actions, parent: parentActions }: ActionsDict<Actions, { parent: any }>
) => {
  return {
    name: state.name,
    cnt: state.cnt,
    actions,
    parentState: parentState,
    parentActions: parentActions
  };
};

export default bundleToComponent({
  Component: Child,
  state,
  actions,
  reducer,
  propsPicker
});
