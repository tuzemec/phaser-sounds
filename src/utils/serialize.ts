import type { FilterRollOff } from "tone";
import type { Frequency, Time } from "tone/build/esm/core/type/Units";
import type { OmniOscillatorType } from "tone/build/esm/source/oscillator/OscillatorInterface";
import type { Platform } from "../game/objects/Platform";
import type { Source } from "../game/objects/Source";
import type { SoundScene } from "../game/scenes/SoundScene";

export type SourceData = {
  x: number;
  y: number;
  muted: boolean;
  interval: string;
  osc: OmniOscillatorType;
  a: Time;
  d: Time;
  s: number;
  r: Time;

  vol: number;

  // filter type, freq, q, rollof, octaves
  ft: BiquadFilterType;
  ff: Frequency;
  fq: number;
  fo: FilterRollOff;
  fc: number;

  // filter adsr
  fa: Time;
  fd: Time;
  fs: number;
  fr: Time;
};

export type PlatformData = {
  x: number;
  y: number;
  angle: number;
  duration: string;
  note: string[];
};

export type CurrentState = {
  s: SourceData[];
  p: PlatformData[];
};

export const serialize = (scene: SoundScene) => {
  const state: CurrentState = { s: [], p: [] };
  const loc = `${location.protocol}//${location.host}${location.pathname}`;

  state.p = scene.platforms
    .getChildren()
    .map((p) => (p as Platform).serialize());
  state.s = scene.sources.getChildren().map((s) => (s as Source).serialize());

  console.log("serializing", state);

  const encoded = encodeURIComponent(JSON.stringify(state));
  const urlParams = new URLSearchParams({ state: encoded });
  const url = `${loc}?${urlParams.toString()}`;

  navigator.clipboard.writeText(url);

  console.log("URL", url);
};
