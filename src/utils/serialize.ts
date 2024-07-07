import type { Platform } from "../game/objects/Platform";
import type { Source } from "../game/objects/Source";
import type { SoundScene } from "../game/scenes/SoundScene";

export type SourceData = {
  x: number;
  y: number;
  muted: boolean;
  interval: string;
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

  const encoded = encodeURIComponent(JSON.stringify(state));
  const urlParams = new URLSearchParams({ state: encoded });
  const url = `${loc}?${urlParams.toString()}`;

  navigator.clipboard.writeText(url);

  console.log("URL", url);
};