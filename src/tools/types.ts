﻿import { ComponentType } from "react";
import { ActionCreatorsMapObject } from "redux";
import {
  PropsPicker,
  SceneReducer,
  SceneBundleOptions,
  ActionsDict,
  DefaultSceneActions
} from "../core";

export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];
// FIXME:change omit type implement
// https://github.com/Microsoft/TypeScript/issues/24560
// export type Omit<T, K extends Extract<keyof T, string>> = Pick<
//  T,P
//   Diff<Extrac t<keyof T, string>, K>
// >;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type DefaultPickedProps<S, A extends ActionCreatorsMapObject> = {
  actions: A;
} & S;
type T03<K extends "actions"> = K;

let v2: T03<"actions"> = "actions";
export type DefaultState = {};

export type ActionsProps<A> = { actions: A };

export type SceneBundleBase<P, S> = {
  Component: ComponentType<P>;
  saga?: (...params: any[]) => any;
  options?: SceneBundleOptions;
  reducer?: SceneReducer<S>;
};

export type SceneBundleNo<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
> = {
  state: S;
  actions: A;
  propsPicker: PropsPicker<P, S, A, PP>;
} & SceneBundleBase<P, S>;

export type SceneBundleNoS<
  P extends PP,
  A extends ActionCreatorsMapObject,
  PP
> = {
  actions: A;
  propsPicker: PropsPicker<P, DefaultState, A, PP>;
} & SceneBundleBase<P, DefaultState>;

export type SceneBundleNoPP<P, S, A extends ActionCreatorsMapObject> = {
  state: S;
  actions: A;
} & SceneBundleBase<P & { actions: A }, S>;

export type SceneBundleNoA<P extends PP, S, PP> = {
  state: S;
  propsPicker: PropsPicker<P, DefaultState, DefaultSceneActions<S>, PP>;
} & SceneBundleBase<P, S>;

export type SceneBundleNoSPP<P, A extends ActionCreatorsMapObject> = {
  actions: A;
} & SceneBundleBase<P & { actions: A }, DefaultState>;

export type SceneBundleNoSA<P extends PP, PP> = {
  propsPicker: PropsPicker<
    P,
    DefaultState,
    DefaultSceneActions<DefaultState>,
    PP
  >;
} & SceneBundleBase<P, DefaultState>;

export type SceneBundleNoAPP<P, S> = {
  state: S;
} & SceneBundleBase<P, S>;

export type SceneBundleNoSAPP<P> = SceneBundleBase<P, DefaultState>;

export type SceneBundlePart<
  P extends PP,
  S,
  A extends ActionCreatorsMapObject,
  PP
> =
  | SceneBundleNo<P, S, A, PP>
  | SceneBundleNoS<P, A, PP>
  | SceneBundleNoPP<P, S, A>
  | SceneBundleNoA<P, S, PP>
  | SceneBundleNoSPP<P, A>
  | SceneBundleNoAPP<P, S>
  | SceneBundleNoSA<P, PP>
  | SceneBundleNoSAPP<P>;
