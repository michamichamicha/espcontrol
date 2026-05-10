import { state } from '../store';
import { parseOrder } from './grid';
import { parseButtonConfig } from './configCodec';

let eventSource: EventSource | null = null;
let _postQueue: Promise<any> = Promise.resolve();

// Bypass Vite proxy in development since ESPHome sends Access-Control-Allow-Origin: *
const BASE_URL = import.meta.env.DEV ? 'http://192.168.1.119' : '';

export function post(url: string | string[], fallbackUrl?: string, errorMessage?: string) {
  const urls = (Array.isArray(url) ? [...url] : [url]).map(u => BASE_URL + u);
  if (fallbackUrl) urls.push(BASE_URL + fallbackUrl);
  
  _postQueue = _postQueue.then(() => {
    let index = 0;
    const tryNext = (): Promise<Response> => {
      return fetch(urls[index], { method: 'POST' }).then(r => {
        if (r.ok || index >= urls.length - 1) {
          if (!r.ok && errorMessage) {
            console.error(errorMessage || `Request failed: ${r.status}`);
          }
          return r;
        }
        index++;
        return tryNext();
      });
    };
    return tryNext().catch(err => {
      console.error('Cannot reach device \u2014 is it connected?', err);
      throw err;
    });
  });
  return _postQueue;
}

export function postText(name: string, value: string) {
  post(`/text/${encodeURIComponent(name)}/set?value=${encodeURIComponent(value)}`);
}

export function postSelect(name: string, option: string) {
  post(`/select/${encodeURIComponent(name)}/set?option=${encodeURIComponent(option)}`);
}

export function postButtonPress(name: string) {
  post(`/button/${encodeURIComponent(name)}/press`);
}

export function postSwitch(name: string, on: boolean) {
  post(`/switch/${encodeURIComponent(name)}/${on ? "turn_on" : "turn_off"}`);
}

export function postNumber(name: string, value: number | string) {
  post(`/number/${encodeURIComponent(name)}/set?value=${encodeURIComponent(value)}`);
}

export async function getJsonQuietly(path: string) {
  try {
    const r = await fetch(BASE_URL + path, { cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

export async function loadInitialState() {
  const items = [
    ["text", "Button Order"],
    ["text", "Button On Color"],
    ["text", "Button Off Color"],
    ["text", "Sensor Card Color"],
  ];
  const cfg = (window as any).CFG || { slots: 20 };
  for (let i = 1; i <= cfg.slots; i++) {
    items.push(["text", `Button ${i} Config`]);
  }
  
  // Also load subpage configs
  for (let i = 1; i <= cfg.slots; i++) {
    items.push(["text", `Subpage ${i} Config`]);
    items.push(["text", `Subpage ${i} Config Ext`]);
    items.push(["text", `Subpage ${i} Config Ext 2`]);
    items.push(["text", `Subpage ${i} Config Ext 3`]);
  }

  // Fetch them in chunks of 4 to not overwhelm ESP
  for (let i = 0; i < items.length; i += 4) {
    const chunk = items.slice(i, i + 4);
    await Promise.all(chunk.map(async ([domain, name]) => {
      const path = `/${encodeURIComponent(domain)}/${encodeURIComponent(name)}?detail=all`;
      const data = await getJsonQuietly(path);
      if (data) handleStateEvent(data);
    }));
  }
}


export function connectEvents() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }

  state.connected = true;

  // Connect to the device event source
  eventSource = new EventSource(BASE_URL + '/events');
  
  eventSource.onopen = () => {
    state.connected = true;
    console.log('Connected to ESPHome API');
    loadInitialState();
  };

  eventSource.onerror = () => {
    state.connected = false;
    console.error('Disconnected from ESPHome API, reconnecting in 5s...');
    if (eventSource?.readyState === 2) {
      eventSource.close();
      eventSource = null;
      setTimeout(connectEvents, 5000);
    }
  };

  eventSource.addEventListener('state', (e) => {
    try {
      const data = JSON.parse(e.data);
      handleStateEvent(data);
    } catch (err) {
      console.error('Failed to parse state event', err);
    }
  });
}

function handleStateEvent(data: any) {
  const { id, state: val, value: numVal } = data;
  const valToUse = val !== undefined ? val : numVal;
  
  // Debug log to see incoming state data
  console.log('Incoming state:', id, valToUse);
  
  if (id === 'switch-indoor_temp_enable') state._indoorOn = valToUse === 'ON' || valToUse === true;
  else if (id === 'switch-outdoor_temp_enable') state._outdoorOn = valToUse === 'ON' || valToUse === true;
  else if (id === 'text-indoor_temp_entity') state.indoorEntity = valToUse;
  else if (id === 'text-outdoor_temp_entity') state.outdoorEntity = valToUse;
  else if (id === 'text-button_on_color') state.onColor = valToUse;
  else if (id === 'text-button_off_color') state.offColor = valToUse;
  else if (id === 'text-sensor_card_color') state.sensorColor = valToUse;
  else if (id === 'number-screensaver_timeout') state.screensaverTimeout = parseFloat(valToUse) || 300;
  else if (id === 'text-button_order' || id === 'text-button_order_1') {
    // window.CFG might not be ready in standard env, fallback to defaults
    const cfg = (window as any).CFG || { slots: 20, cols: 5 };
    state.grid = parseOrder(valToUse, cfg.slots, cfg.cols);
  }
  else {
    // Match Button X Config
    const btnMatch = id.match(/^text-button_(\d+)_config$/);
    if (btnMatch) {
      const slot = parseInt(btnMatch[1], 10);
      const parsed = parseButtonConfig(valToUse);
      if (slot >= 1 && slot <= state.buttons.length) {
        state.buttons[slot - 1] = parsed;
      }
    }
  }
}
