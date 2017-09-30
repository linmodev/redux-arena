import React, { Component } from "react";
import PropTypes from "prop-types";
import { TransitionMotion } from "react-motion";
import { LOADING, ENTERING, IN, LEAVING, OUT } from "./animationPhase";
import { buildStyleCalculator, isCurPhaseEnd } from "./utils";

export default class ArenaSceneAnimation extends Component {
  static propTypes = {
    loadingPlay: PropTypes.element.isRequired,
    children: PropTypes.element.isRequired,
    initStyles: PropTypes.array.isRequired,
    styleCalculators: PropTypes.object.isRequired,
    nextPhaseCheckers: PropTypes.object.isRequired,
    numberToStyle: PropTypes.func.isRequired
  };

  cloneSceneWithNotify(children, reducerKey) {
    return React.cloneElement(children, {
      isNotifyOn: true,
      notifyData: Object.assign({}, children.props.notifyData, {
        _toReducerKey: reducerKey
      })
    });
  }

  componentWillMount() {
    this.setState({
      scenePlay: this.cloneSceneWithNotify(
        this.props.children,
        this.props.reducerKey
      ),
      initStyles: this.props.initStyles
        .map(styleObj =>
          Object.assign({}, styleObj, {
            style: Object.assign({}, styleObj.style, { phase: LOADING })
          })
        )
        .concat({
          key: "nextPhase",
          style: { phase: LOADING }
        }),
      styleCalculator: buildStyleCalculator(
        this.props.styleCalculators,
        this.props.phase,
        this.props.nextPhaseCheckers,
        this.props.isSceneReady,
        phase => setImmediate(() => this.props.actions.nextPhase(phase))
      )
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.children !== this.props.children ||
      nextProps.reducerKey !== this.props.reducerKey
    ) {
      this.state.scenePlay = this.cloneSceneWithNotify(
        nextProps.children,
        nextProps.reducerKey
      );
    }
    if (
      nextProps.actions !== this.props.actions ||
      nextProps.phase !== this.props.phase ||
      nextProps.styleCalculators !== this.props.styleCalculators ||
      nextProps.nextPhaseCheckers !== this.props.nextPhaseCheckers ||
      nextProps.isSceneReady !== this.props.isSceneReady
    ) {
      this.state.styleCalculator = buildStyleCalculator(
        nextProps.styleCalculators,
        nextProps.phase,
        nextProps.nextPhaseCheckers,
        nextProps.isSceneReady,
        phase => setImmediate(() => nextProps.actions.nextPhase(phase))
      );
    }
    if (nextProps.initStyles !== this.props.initStyles) {
      let nextPhaseStyle = this.state.initStyles.find(
        style => style.key === "nextPhase"
      );
      this.setState({
        initStyles: nextProps.initStyles.concat(nextPhaseStyle)
      });
    }
  }

  render() {
    let { phase, numberToStyle, isSceneReady } = this.props;
    return (
      <TransitionMotion
        defaultStyles={this.state.initStyles}
        willLeave={this.willLeave}
        styles={this.state.styleCalculator}
      >
        {interpolatedStyles => {
          let containerStyle, scenePlayStyle, loadingPlayStyle, animationPhase;
          interpolatedStyles.forEach(styleObj => {
            let { key, style } = styleObj;
            switch (key) {
              case "container":
                containerStyle = style;
                break;
              case "loadingPlay":
                loadingPlayStyle = style;
                break;
              case "scenePlay":
                scenePlayStyle = style;
                break;
              case "nextPhase":
                animationPhase = style.phase;
                break;
            }
          });
          return (
            <div
              style={numberToStyle(
                "container",
                containerStyle,
                animationPhase,
                isSceneReady
              )}
            >
              {animationPhase === IN ||
              animationPhase === LEAVING ||
              animationPhase === OUT ? null : (
                <div
                  key="loadingPlay"
                  style={numberToStyle(
                    "loadingPlay",
                    loadingPlayStyle,
                    animationPhase,
                    isSceneReady
                  )}
                >
                  {this.props.loadingPlay}
                </div>
              )}
              {animationPhase === OUT ? null : (
                <div
                  key="scenePlay"
                  style={numberToStyle(
                    "scenePlay",
                    scenePlayStyle,
                    animationPhase,
                    isSceneReady
                  )}
                >
                  {this.state.scenePlay}
                </div>
              )}
            </div>
          );
        }}
      </TransitionMotion>
    );
  }
}