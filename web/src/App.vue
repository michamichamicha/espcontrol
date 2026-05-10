<template>
  <div id="sp-app">
    <!-- Header Navigation -->
    <header class="sp-header">
      <div class="sp-brand">EspControl</div>
      <div class="sp-nav">
        <a 
          href="#" 
          class="sp-tab" 
          :class="{ active: currentTab === 'screen' }"
          @click.prevent="currentTab = 'screen'"
        >Screen</a>
        <a 
          href="#" 
          class="sp-tab" 
          :class="{ active: currentTab === 'settings' }"
          @click.prevent="currentTab = 'settings'"
        >Settings</a>
        <a 
          href="https://github.com/jtenniswood/espcontrol" 
          target="_blank" 
          rel="noopener" 
          class="sp-tab sp-tab-docs"
        >
          <span class="mdi mdi-book-open-page-variant"></span>
          Docs
        </a>
      </div>
    </header>

    <!-- Global Connection Banner -->
    <div 
      class="sp-banner fade-in" 
      :class="{ 'sp-offline': !state.connected, 'sp-error': false }" 
      v-if="!state.connected"
    >
      Connecting to device&hellip;
    </div>

    <!-- Main Content Pages -->
    <main class="sp-wrap">
      <!-- Screen Tab -->
      <div class="sp-page" :class="{ active: currentTab === 'screen' }">
        <ScreenTab :currentTime="currentTime" />
      </div>

      <!-- Settings Tab -->
      <div class="sp-page" :class="{ active: currentTab === 'settings' }">
        <SettingsTab />
      </div>
    </main>

    <!-- Support Button -->
    <a href="https://www.buymeacoffee.com/jtenniswood" target="_blank" rel="noopener" class="sp-support-btn">
      <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="60" style="border-radius:999px;">
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { state } from '@/store';
import ScreenTab from '@/components/ScreenTab.vue';
import SettingsTab from '@/components/SettingsTab.vue';
import { connectEvents } from '@/api';

const currentTab = ref('screen');
const currentTime = ref('');
let clockInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  // Sync the time
  updateClock();
  clockInterval = setInterval(updateClock, 1000);

  // Initialize CSS variables
  syncCssVariables();

  // Connect to ESPHome EventSource
  connectEvents();
});

onUnmounted(() => {
  clearInterval(clockInterval);
});

function updateClock() {
  const now = new Date();
  const format = state.clockFormat || '24h';
  if (format === '12h') {
    let hours = now.getHours();
    const ampm = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    currentTime.value = String(hours).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ampm;
  } else {
    currentTime.value = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  }
}

function syncCssVariables() {
  const CFG = window.CFG;
  if (!CFG) return;
  const r = document.documentElement.style;
  r.setProperty("--topbar-h", CFG.topbar.height + "cqw");
  r.setProperty("--topbar-pad", CFG.topbar.padding);
  r.setProperty("--topbar-fs", CFG.topbar.fontSize + "cqw");
  if (CFG.topbar.clockFontSize) r.setProperty("--clock-fs", CFG.topbar.clockFontSize + "cqw");
  r.setProperty("--grid-top", CFG.grid.top + "cqw");
  r.setProperty("--grid-left", CFG.grid.left + "cqw");
  r.setProperty("--grid-right", CFG.grid.right + "cqw");
  r.setProperty("--grid-bottom", CFG.grid.bottom + "cqw");
  r.setProperty("--grid-gap", CFG.grid.gap + "cqw");
  r.setProperty("--btn-r", CFG.btn.radius + "cqw");
  r.setProperty("--btn-pad", CFG.btn.padding + "cqw");
  r.setProperty("--btn-icon", CFG.btn.iconSize + "cqw");
  r.setProperty("--btn-label", CFG.btn.labelSize + "cqw");
  r.setProperty("--btn-lines", String(CFG.btn.labelLines || 1));
  r.setProperty("--btn-lines-dbl", String(CFG.btn.labelLinesDouble || CFG.btn.labelLines || 1));
  r.setProperty("--sensor-top", CFG.sensorBadge.top + "cqw");
  r.setProperty("--sensor-right", CFG.sensorBadge.right + "cqw");
  r.setProperty("--sensor-fs", CFG.sensorBadge.fontSize + "cqw");
  r.setProperty("--empty-r", CFG.emptyCell.radius + "cqw");
  r.setProperty("--subpage-bottom", CFG.subpageBadge.bottom + "cqw");
  r.setProperty("--subpage-right", CFG.subpageBadge.right + "cqw");
  r.setProperty("--subpage-fs", CFG.subpageBadge.fontSize + "cqw");

  // Screen resolution
  r.setProperty("--screen-w", CFG.screen.width);
  r.setProperty("--screen-aspect", CFG.screen.aspect);
  r.setProperty("--grid-cols", "repeat(" + CFG.cols + "," + (CFG.grid.fr || "1fr") + ")");
  r.setProperty("--grid-rows", "repeat(" + CFG.rows + "," + (CFG.grid.fr || "1fr") + ")");
}
</script>
