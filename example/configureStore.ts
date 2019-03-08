import { createArenaStore } from "redux-arena";
import reducer from "./frame/redux/reducer";
import saga from "./frame/redux/saga";
import state from "./frame/redux/state";
import thunk from "redux-thunk";

let middlewares = [thunk];

export default function configureStore(history) {
  let store = createArenaStore(
    { frame: reducer },
    {
      initialStates: { frame: state },
      middlewares
    }
  );
  store.runSaga(saga);
  return store;
}
