import * as React from "react";
import * as ReactDOM from "react-dom";

import Frame from "./frame/Frame";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
// const { whyDidYouUpdate } = require("why-did-you-update");
let store = configureStore(history);

document.getElementById("loadingsStyle").remove();
document.getElementById("app").className = "";
// whyDidYouUpdate(React);
let appDom = document.getElementById("app");

let render = (FrameComponent, version) => {
  ReactDOM.render(
    <Provider store={store}>
      <FrameComponent version={version} />
    </Provider>,
    appDom
  );
};

let version = 0;
render(Frame, version);
if ((module as any).hot) {
  (module as any).hot.accept("./frame/Frame", () => {
    let UpdatedFrame = require("./frame/Frame").default;
    render(UpdatedFrame, ++version);
  });
}
