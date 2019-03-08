import { ActionCreatorsMapObject } from "redux";
import {
  CurtainLoadSceneAction,
  CurtainState,
  ReducerDict,
  SceneBundle
} from "../../core";
import { Context } from "../ArenaScene";

export type State = {
  loadedPromise: Promise<null>;
};

export type BaseProps = CurtainState<{}> & {
  clearCurtain: () => void;
};
export type InjectDispatchProps = {
  curtainLoadScene: CurtainLoadScene<{}, {}, {}, {}>;
};
export type ConnectedProps = BaseProps & Props & InjectDispatchProps;

export type Props = {
  arenaReducerDict: ReducerDict;
  sceneBundle: SceneBundle<{}, {}, {}, {}>;
  sceneProps: any;
};

export type CurtainLoadScene<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
> = (
  arenaReducerDict: ReducerDict,
  sceneBundle: SceneBundle<P, S, A, PP>,
  isInitial: any,
  loadedCb: () => void
) => CurtainLoadSceneAction<P, S, A, PP>;
