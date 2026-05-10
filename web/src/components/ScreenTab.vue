<template>
  <div class="sp-screen">
    <div class="sp-topbar" :class="{ 'sp-hidden': !state.clockBarOn }">
      <span class="sp-temp" :class="{ 'sp-visible': state._indoorOn }">{{ indoorTemp }}</span>
      <span class="sp-clock">{{ currentTime }}</span>
    </div>
    <div class="sp-main">
      <template v-for="(slot, i) in grid" :key="i">
        <!-- Render Button -->
        <ButtonCard 
          v-if="slot > 0" 
          :slotId="slot" 
          :sizeClass="getSizeClass(slot)" 
          @click="buttonClick(slot)" 
        />
        
        <!-- Render Empty Cell -->
        <div v-else-if="slot === 0" class="sp-empty-cell" @click="emptyClick(i)">
           <div class="sp-add-pill"><span class="mdi mdi-plus sp-add-icon"></span></div>
        </div>

        <!-- Render Covered Cell (Spanned) -->
        <div v-else style="display: none;"></div>
      </template>
    </div>

    <!-- Hint and Apply Button -->
    <div class="sp-hint">tap to select • shift/ctrl+tap to multi-select • right click to manage</div>
    <div class="sp-apply-bar">
      <button class="sp-apply-btn">Apply Configuration</button>
      <div class="sp-apply-note">Restarts the device to apply changes</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { state } from '@/store';
import { sizeClass } from '@/api/grid';
import ButtonCard from '@/components/ButtonCard.vue';

defineProps<{ currentTime: string }>();

const grid = computed(() => {
  const hasOrder = state.grid.some(g => g > 0 || g === -2);
  if (hasOrder) return state.grid;
  
  // Fallback: If no order is configured, just place buttons sequentially
  const fallback = [];
  for (let i = 1; i <= state.buttons.length; i++) {
    const b = state.buttons[i - 1];
    // A completely unconfigured button has mostly empty fields and 'Auto' icons
    const isConfigured = !!(b.type || b.sensor || b.entity || b.label || (b.icon && b.icon !== 'Auto'));
    fallback.push(isConfigured ? i : 0);
  }
  return fallback;
});

watch(grid, (newGrid) => {
  console.log('Grid updated to:', newGrid);
}, { immediate: true });

const indoorTemp = computed(() => {
  return '-- \u00B0' + (state.temperatureUnit === 'Fahrenheit' ? 'F' : 'C');
});

function getSizeClass(slot: number) {
  const size = state.sizes[slot] || 1;
  return sizeClass(size);
}



function buttonClick(slot: number) {
  console.log('Clicked button in slot', slot);
}

function emptyClick(index: number) {
  console.log('Clicked empty cell', index);
}
</script>
