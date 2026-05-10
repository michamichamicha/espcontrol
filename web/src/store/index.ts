import { reactive, ref } from 'vue';

export const state = reactive({
  connected: false,
  grid: [] as number[],
  sizes: {} as Record<string, number>,
  buttons: [] as any[],
  subpages: {} as Record<string, any>,
  onColor: 'FF8C00',
  offColor: '313131',
  sensorColor: '212121',
  indoorEntity: '',
  outdoorEntity: '',
  presenceEntity: '',
  temperatureUnit: '°C',
  clockBarOn: false,
  temperatureDegreeSymbolOn: true,
  timezone: '',
  clockFormat: '24h',
  ntpServer1: '',
  ntpServer2: '',
  ntpServer3: '',
  screensaverMode: 'disabled',
  screensaverAction: 'off',
  clockScreensaverOn: false,
  screensaverDimmedBrightness: 0,
  screensaverTimeout: 300,
  homeScreenTimeout: 60,
  brightnessDayVal: 100,
  brightnessNightVal: 75,
  scheduleEnabled: false,
  scheduleOnHour: 6,
  scheduleOffHour: 23,
  scheduleMode: 'day_night',
  scheduleWakeTimeout: 0,
  scheduleWakeBrightness: 100,
  scheduleDimmedBrightness: 0,
  scheduleClockBrightness: 35,
  screenRotation: '0',
  developerExperimentalFeatures: false,
  firmwareVersion: '',
  firmwareUpdateInfo: null as any,
  _indoorOn: false,
  _outdoorOn: false,
  mediaPlayerSleepPreventionOn: false,
  mediaPlayerSleepPreventionEntity: '',
  clockBrightnessDay: 35,
  clockBrightnessNight: 35
});

export function initializeState(numSlots?: number) {
  const count = numSlots || 20;
  for (let i = 0; i < count; i++) {
    state.grid.push(0);
    state.buttons.push({
      entity: '',
      label: '',
      icon: 'Auto',
      icon_on: 'Auto',
      sensor: '',
      unit: '',
      type: '',
      precision: ''
    });
  }
}
