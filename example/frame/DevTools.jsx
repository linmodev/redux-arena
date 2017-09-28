import React from "react";
import { createDevTools } from "redux-devtools";
import DockMonitor from "redux-devtools-dock-monitor";
import ChartMonitor from "redux-devtools-chart-monitor";
import DiffMonitor from "redux-devtools-diff-monitor";

export default createDevTools(
  <DockMonitor
    fluid={true}
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    changeMonitorKey="ctrl-m"
  >
    <ChartMonitor heightBetweenNodesCoeff="2" widthBetweenNodesCoeff="1.6" />
  </DockMonitor>
);
