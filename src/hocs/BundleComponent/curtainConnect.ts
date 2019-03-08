import { ComponentClass, StatelessComponent } from "react";
import {
  bindActionCreators,
  Dispatch,
  ActionCreator,
  ActionCreatorsMapObject,
  AnyAction
} from "redux";
import { connect } from "react-redux";
import actions from "./actions";
import BundleComponent from "./BundleComponent";
import { Props, BaseProps, CurtainLoadScene } from "./types";
import { CurtainState } from "../../core";
import { Context } from "../ArenaScene";

export default function curtainConnect(
  reducerKey: string,
  clearCurtain: () => void
) {
  let mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return bindActionCreators(actions, dispatch);
  };

  let mapStateToProps = (state: any, ownProps: Props): BaseProps => {
    if (state[reducerKey]) {
      return {
        PlayingScene: state[reducerKey].PlayingScene,
        curSceneBundle: state[reducerKey].curSceneBundle,
        reduxInfo: state[reducerKey].reduxInfo,
        mutableObj: state[reducerKey].mutableObj,
        clearCurtain
      };
    }
    return {} as any;
  };

  let ConnectedComponent = connect(
    mapStateToProps,
    mapDispatchToProps
  )(BundleComponent);

  ConnectedComponent.displayName = `curtainConnect({reducerKey:${reducerKey}})`;
  return ConnectedComponent as any;
}
