import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

import { initializeState } from './store'

// Extend window object with CFG and DEVICE_ID
declare global {
  interface Window {
    DEVICE_ID: string;
    CFG: any;
  }
}

window.CFG = window.CFG || {
  "slots": 20,
  "cols": 5,
  "rows": 4,
  "dragMode": "swap",
  "screen": { "width": "67%", "aspect": "1024/600" },
  "topbar": { "height": 3.2, "padding": "0.39cqw", "fontSize": 1.95 },
  "grid": { "top": 4.4, "left": 0.49, "right": 0.49, "bottom": 0.49, "gap": 0.98, "fr": "1fr" },
  "btn": { "radius": 0.78, "padding": 1.37, "iconSize": 4.69, "labelSize": 1.8 },
  "emptyCell": { "radius": 0.78 },
  "sensorBadge": { "top": 1, "right": 1, "fontSize": 1.6 },
  "subpageBadge": { "bottom": 1, "right": 1, "fontSize": 2 }
};

initializeState(window.CFG.slots);

// Inject CSS custom properties from device config
const r = document.documentElement.style;
r.setProperty("--topbar-h", window.CFG.topbar.height + "cqw");
r.setProperty("--topbar-pad", window.CFG.topbar.padding);
r.setProperty("--topbar-fs", window.CFG.topbar.fontSize + "cqw");
if (window.CFG.topbar.clockFontSize) r.setProperty("--clock-fs", window.CFG.topbar.clockFontSize + "cqw");
r.setProperty("--grid-top", window.CFG.grid.top + "cqw");
r.setProperty("--grid-left", window.CFG.grid.left + "cqw");
r.setProperty("--grid-right", window.CFG.grid.right + "cqw");
r.setProperty("--grid-bottom", window.CFG.grid.bottom + "cqw");
r.setProperty("--grid-gap", window.CFG.grid.gap + "cqw");
r.setProperty("--btn-r", window.CFG.btn.radius + "cqw");
r.setProperty("--btn-pad", window.CFG.btn.padding + "cqw");
r.setProperty("--btn-icon", window.CFG.btn.iconSize + "cqw");
r.setProperty("--btn-label", window.CFG.btn.labelSize + "cqw");
r.setProperty("--btn-lines", String(window.CFG.btn.labelLines || 1));
r.setProperty("--btn-lines-dbl", String(window.CFG.btn.labelLinesDouble || window.CFG.btn.labelLines || 1));
r.setProperty("--sensor-top", window.CFG.sensorBadge.top + "cqw");
r.setProperty("--sensor-right", window.CFG.sensorBadge.right + "cqw");
r.setProperty("--sensor-fs", window.CFG.sensorBadge.fontSize + "cqw");
r.setProperty("--empty-r", window.CFG.emptyCell.radius + "cqw");
r.setProperty("--subpage-bottom", window.CFG.subpageBadge.bottom + "cqw");
r.setProperty("--subpage-right", window.CFG.subpageBadge.right + "cqw");
r.setProperty("--subpage-fs", window.CFG.subpageBadge.fontSize + "cqw");
r.setProperty("--grid-cols", `repeat(${window.CFG.cols}, ${window.CFG.grid.fr || "1fr"})`);
r.setProperty("--grid-rows", `repeat(${window.CFG.rows}, 1fr)`);
r.setProperty("--screen-w", window.CFG.screen.width);
r.setProperty("--screen-aspect", window.CFG.screen.aspect);

const app = createApp(App)
app.mount('#app')
