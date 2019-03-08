﻿import * as React from "react";
import { ActionCreatorsMapObject } from "redux";
import { DefaultSceneActions } from "../core/types";
import { ArenaSceneExtraProps, ArenaScene } from "../hocs";
import {
  Omit,
  ActionsProps,
  SceneBundleNo,
  SceneBundleNoS,
  SceneBundleNoA,
  SceneBundleNoPP,
  SceneBundleNoAPP,
  SceneBundleNoSA,
  SceneBundleNoSPP,
  SceneBundleNoSAPP
} from "./types";
import {
  defaultPropsPicker,
  defaultActions,
  defaultReducerCreator
} from "./autoFill";
import { Context } from "../hocs/ArenaScene";
const ReactReduxContext = require("react-redux").ReactReduxContext;
function bundleToElement<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
>(
  bundle: SceneBundleNo<P, S, A, PP>,
  props?: JSX.IntrinsicAttributes & Omit<P, keyof PP>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<JSX.IntrinsicAttributes & Omit<P, keyof PP>>;
function bundleToElement<P extends PP, A extends ActionCreatorsMapObject, PP>(
  bundle: SceneBundleNoS<P, A, PP>,
  props?: JSX.IntrinsicAttributes & Omit<P, keyof PP>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<JSX.IntrinsicAttributes & Omit<P, keyof PP>>;
function bundleToElement<P extends PP, S, PP>(
  bundle: SceneBundleNoA<P, S, PP>,
  props?: JSX.IntrinsicAttributes & Omit<P, keyof PP>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<JSX.IntrinsicAttributes & Omit<P, keyof PP>>;
function bundleToElement<
  P extends S & ActionsProps<A>,
  S,
  A extends ActionCreatorsMapObject
>(
  bundle: SceneBundleNoPP<P, S, A>,
  props?: JSX.IntrinsicAttributes & Omit<P, keyof (S & ActionsProps<A>)>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<
  JSX.IntrinsicAttributes & Omit<P, keyof (S & ActionsProps<A>)>
>;
function bundleToElement<P extends PP, PP>(
  bundle: SceneBundleNoSA<P, PP>,
  props?: JSX.IntrinsicAttributes & Omit<P, keyof (PP)>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<JSX.IntrinsicAttributes & Omit<P, keyof (PP)>>;
function bundleToElement<
  P extends ActionsProps<A>,
  A extends ActionCreatorsMapObject
>(
  bundle: SceneBundleNoSPP<P, A>,
  props?: JSX.IntrinsicAttributes & Omit<P, keyof (ActionsProps<A>)>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<
  JSX.IntrinsicAttributes & Omit<P, keyof (ActionsProps<A>)>
>;
function bundleToElement<P extends S & ActionsProps<DefaultSceneActions<S>>, S>(
  bundle: SceneBundleNoAPP<P, S>,
  props?: JSX.IntrinsicAttributes &
    Omit<P, keyof (S & ActionsProps<DefaultSceneActions<S>>)>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<
  JSX.IntrinsicAttributes &
    Omit<P, keyof (ActionsProps<DefaultSceneActions<{}>>)>
>;
function bundleToElement<P extends ActionsProps<DefaultSceneActions<{}>>>(
  bundle: SceneBundleNoSAPP<P>,
  props?: JSX.IntrinsicAttributes &
    Omit<P, keyof (ActionsProps<DefaultSceneActions<{}>>)>,
  extraProps?: ArenaSceneExtraProps
): React.ReactElement<
  JSX.IntrinsicAttributes &
    Omit<P, keyof (ActionsProps<DefaultSceneActions<{}>>)>
>;
function bundleToElement(
  bundle: any,
  props?: any,
  extraProps?: ArenaSceneExtraProps
) {
  let newBundle = Object.assign(
    {
      propsPicker: defaultPropsPicker,
      actions: defaultActions,
      reducer: defaultReducerCreator(bundle.state)
    },
    bundle
  );
  return (
    <ArenaScene sceneBundle={newBundle} sceneProps={props} {...extraProps} />
  );
}

export default bundleToElement;
