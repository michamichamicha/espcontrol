<template>
  <div class="sp-btn" :class="[sizeClass, activeClass]" :style="{ backgroundColor: bgColor }" @click="$emit('click')">
    <template v-if="isSensorPreview">
      <span class="sp-sensor-preview" :class="{ 'sp-forecast-preview': isWeatherForecast }">
        <span class="sp-sensor-value" :class="{ 'sp-forecast-value': isWeatherForecast }">{{ sensorValue }}</span>
        <span class="sp-sensor-unit" v-if="sensorUnit">{{ sensorUnit }}</span>
      </span>
    </template>
    <template v-else>
      <span class="sp-btn-icon mdi" :class="'mdi-' + currentIcon"></span>
    </template>
    
    <div class="sp-btn-label-row">
      <span class="sp-btn-label">{{ label }}</span>
      <span class="sp-type-badge mdi" :class="'mdi-' + typeBadgeIcon"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { state } from '@/store';

const props = defineProps<{
  slotId: number;
  sizeClass: string;
}>();

const btn = computed(() => state.buttons[props.slotId - 1]);

const label = computed(() => {
  if (!btn.value) return '';
  return btn.value.label || btn.value.entity || 'Configure';
});

const currentIcon = computed(() => {
  if (!btn.value) return 'cog';
  return btn.value.icon === 'Auto' ? 'cog' : btn.value.icon;
});

const activeClass = computed(() => '');

const type = computed(() => btn.value?.type || '');

const isSensorPreview = computed(() => {
  if (type.value === 'weather' && (btn.value?.precision === 'today' || btn.value?.precision === 'tomorrow')) return true;
  if (type.value === 'calendar') return true;
  if (type.value === 'sensor' && btn.value?.precision !== 'text') return true;
  if (type.value === 'subpage' && (btn.value?.sensor && btn.value.sensor !== 'indicator')) return true;
  return false;
});

const isWeatherForecast = computed(() => type.value === 'weather' && (btn.value?.precision === 'today' || btn.value?.precision === 'tomorrow'));

const sensorValue = computed(() => {
  if (type.value === 'weather') return '18/10';
  if (type.value === 'calendar') {
    return btn.value?.precision === 'datetime' ? '15:10' : '10';
  }
  return '0.0';
});

const sensorUnit = computed(() => {
  if (type.value === 'weather') return '°C';
  if (type.value === 'calendar' && btn.value?.precision === 'datetime') return 'pm';
  return btn.value?.unit || '';
});

const typeBadgeIcon = computed(() => {
  switch (type.value) {
    case 'weather': return 'weather-cloudy';
    case 'calendar': return 'calendar-month';
    case 'sensor': return btn.value?.precision === 'text' ? 'format-text' : 'gauge';
    case 'subpage': return 'chevron-right';
    case 'slider': return 'brightness-6';
    case 'cover': return 'window-shutter';
    case 'media': return 'play-pause';
    default: return 'toggle-switch-variant-off';
  }
});

const bgColor = computed(() => {
  const c = (type.value === "sensor" || type.value === "weather" || type.value === "weather_forecast" || type.value === "calendar" || type.value === "timezone") 
    ? state.sensorColor : state.offColor;
  return "#" + (c && c.length === 6 ? c : "313131");
});
</script>
