import { bundleToComponent } from "redux-arena";
import state from "./state";
import reducer from "./reducer";
import actions from "./actions";
import Container from "./Container";

export default bundleToComponent({
  Component: Container,
  state,
  reducer,
  actions
});
