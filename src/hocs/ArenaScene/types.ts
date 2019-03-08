import { ComponentClass, ComponentElement } from "react";
import { EnhancedStore, ReducerDict, SceneBundle } from "../../core";
import { Props as BCProps } from "../BundleComponent";

export type ExtraProps = {
  reducerKey?: string;
  vReducerKey?: string;
};
export type Props = ExtraProps & {
  sceneProps?: {};
  sceneBundle: SceneBundle<{}, {}, {}, {}>;
  // context: Context;
};

export type State = {
  parentReducerKey: string | undefined | null;
  arenaReducerDict: ReducerDict;
  ConnectedBundleComponent: ComponentClass<BCProps>;
  connectedBundleElement: ComponentElement<BCProps, any>;
};

export type Context = {
  store: EnhancedStore<any>;
  storeState: any;
  arenaReducerDict: ReducerDict | null | undefined;
};
