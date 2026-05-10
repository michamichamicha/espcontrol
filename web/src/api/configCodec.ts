import { state } from '../store';

export function parseRawButtonConfig(str: string) {
  const compact = str && str.charAt(0) === "~";
  let parts = compact ? str.substring(1).split(",") : (str || "").split(";");
  if (compact) {
    parts = parts.map(decodeConfigField);
  }
  return {
    entity: parts[0] || "",
    label: parts[1] || "",
    icon: parts[2] || "Auto",
    icon_on: parts[3] || "Auto",
    sensor: parts[4] || "",
    unit: parts[5] || "",
    type: parts[6] || "",
    precision: parts[7] || "",
  };
}

export function parseButtonConfig(str: string) {
  return normalizeButtonConfig(parseRawButtonConfig(str));
}

function normalizeButtonConfig(b: any) {
  if (b && b.type === "slider" && b.sensor) {
    b.sensor = "";
  }
  if (b && b.type === "weather_forecast") {
    b.type = "weather";
    b.precision = "tomorrow";
    if (b.label === "Weather") b.label = "";
  }
  if (b && b.type === "text_sensor") {
    b.type = "sensor";
    b.precision = "text";
    b.entity = "";
    b.label = "";
    b.unit = "";
    b.icon_on = "Auto";
    if (!b.icon) b.icon = "Auto";
  }
  if (b && b.type === "media") {
    if (b.sensor === "controls") {
      if (!b.icon || b.icon === "Speaker") b.icon = "Auto";
      b.sensor = "play_pause";
    } else if (!b.sensor) {
      b.sensor = "play_pause";
    }
    if (["play_pause", "previous", "next", "volume", "position", "now_playing"].indexOf(b.sensor) < 0) {
      b.sensor = "play_pause";
    }
    if (b.sensor === "previous" && b.label === "Skip Previous") b.label = "Previous";
    if (b.sensor === "next" && b.label === "Skip Next") b.label = "Next";
    if (b.sensor === "volume") {
      if (!b.label || b.label === "Media") b.label = "Volume";
      b.icon = "Auto";
    }
    if (b.sensor === "position" && (!b.label || b.label === "Track")) b.label = "Position";
    if (b.sensor === "now_playing") {
      b.precision = b.precision === "progress" || b.precision === "play_pause" ? b.precision : "";
    } else if ((b.sensor === "play_pause" || b.sensor === "position") && b.precision === "state") {
      b.precision = "state";
    } else {
      b.precision = "";
    }
  }
  if (b && b.type === "climate") {
    b.sensor = "";
    b.unit = "";
    b.icon = "Auto";
    b.icon_on = "Auto";
    // basic precision formatting
    if (["", "1", "2", "3"].indexOf(String(b.precision || "")) < 0) b.precision = "";
  }
  return b;
}

function decodeConfigField(value: string) {
  return String(value || "").replace(/%([0-9a-fA-F]{2})/g, function (_, hex) {
    return String.fromCharCode(parseInt(hex, 16));
  });
}
