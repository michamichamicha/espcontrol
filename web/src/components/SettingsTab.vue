<template>
  <div class="sp-config">
    <!-- Appearance -->
    <div class="card" :class="{ collapsed: isCollapsed.appearance }">
      <div class="card-header" @click="toggle('appearance')">
        <h3>Appearance</h3>
        <div class="card-header-right">
          <span class="card-chevron">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </div>
      </div>
      <div class="card-body">
        <div class="sp-field">
          <label class="sp-field-label">Primary Button On Color</label>
          <div class="sp-color-row">
            <div class="sp-color-swatch" :style="{ backgroundColor: '#' + state.onColor }">
              <input type="color" v-model="state.onColor" @change="saveColor('onColor')" />
            </div>
            <input type="text" class="sp-input" v-model="state.onColor" @blur="saveColor('onColor')" />
          </div>
        </div>
        
        <div class="sp-field">
          <label class="sp-field-label">Secondary Button Off Color</label>
          <div class="sp-color-row">
            <div class="sp-color-swatch" :style="{ backgroundColor: '#' + state.offColor }">
              <input type="color" v-model="state.offColor" @change="saveColor('offColor')" />
            </div>
            <input type="text" class="sp-input" v-model="state.offColor" @blur="saveColor('offColor')" />
          </div>
        </div>
        
        <div class="sp-field">
          <label class="sp-field-label">Tertiary Sensor Card Color</label>
          <div class="sp-color-row">
            <div class="sp-color-swatch" :style="{ backgroundColor: '#' + state.sensorColor }">
              <input type="color" v-model="state.sensorColor" @change="saveColor('sensorColor')" />
            </div>
            <input type="text" class="sp-input" v-model="state.sensorColor" @blur="saveColor('sensorColor')" />
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Settings Tabs would go here -->
    <!-- Backlight, Clock, Night Schedule, Time Settings, Idle, Backup, Firmware Update -->
    <div class="card" :class="{ collapsed: isCollapsed.firmware }">
       <div class="card-header" @click="toggle('firmware')">
        <h3>Firmware</h3>
        <div class="card-header-right">
          <span class="card-chevron">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </div>
      </div>
      <div class="card-body">
         <div class="sp-fw-row">
           <span class="sp-fw-version">{{ state.firmwareVersion || 'Unknown' }}</span>
           <div class="sp-fw-actions">
             <button class="sp-fw-btn">Check for Update</button>
           </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { state } from '@/store';
import { postText } from '@/api';

const isCollapsed = reactive<Record<string, boolean>>({
  appearance: false,
  firmware: true,
});

function toggle(section: string) {
  isCollapsed[section] = !isCollapsed[section];
}

function saveColor(field: 'onColor' | 'offColor' | 'sensorColor') {
  let val = state[field].replace('#', '');
  state[field] = val;
  
  if (field === 'onColor') postText("Button On Color", val);
  if (field === 'offColor') postText("Button Off Color", val);
  if (field === 'sensorColor') postText("Sensor Card Color", val);
}
</script>
