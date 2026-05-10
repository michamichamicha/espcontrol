import { computed, reactive } from 'vue';

const state = reactive({
  grid: [0, 0, 0],
  buttons: [
    { entity: 'test' },
    { entity: '' },
    { icon: 'mdi-test' }
  ]
});

const grid = computed(() => {
  const hasOrder = state.grid.some(g => g > 0 || g === -2);
  if (hasOrder) return state.grid;
  
  const fallback = [];
  for (let i = 1; i <= state.buttons.length; i++) {
    const b = state.buttons[i - 1];
    const isConfigured = !!(b.type || b.sensor || b.entity || b.label || (b.icon && b.icon !== 'Auto'));
    fallback.push(isConfigured ? i : 0);
  }
  return fallback;
});

console.log(grid.value);
