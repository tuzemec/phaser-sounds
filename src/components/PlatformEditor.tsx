import { For, Show, createSignal } from "solid-js";
import { EventBus } from "../game/EventBus";
import type { Platform } from "../game/objects/Platform";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const OCTAVES = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
const DURATION = ["32n", "16n", "8n", "4n", "2n", "1n"];

export default function PlatformEditor() {
  const [visible, setVisible] = createSignal(false);
  const [platform, setPlatform] = createSignal<Platform | null>(null);

  EventBus.on("global.select.platform", (element: Platform) => {
    setVisible(true);
    setPlatform(element);
  });

  EventBus.on("global.deselect", () => {
    setVisible(false);
    setPlatform(null);
  });

  return (
    <Show when={visible() && platform()}>
      <div class="editor">
        <form>
          <fieldset>
            <label>
              <span>angle:</span>
              <input
                type="range"
                min={-180}
                max={180}
                value={platform()!.angle}
                onInput={(e) => {
                  platform()?.setAngle(Number(e.currentTarget.value));
                }}
              />
            </label>
          </fieldset>

          <fieldset>
            <label>
              <span>Note:</span>
              <select
                value={platform()!.getNote}
                onChange={(e) => {
                  platform()!.setNote = e.target.value;
                }}
              >
                <For each={NOTES}>
                  {(note) => <option value={note}>{note}</option>}
                </For>
              </select>
            </label>
          </fieldset>

          <fieldset>
            <label>
              <span>Octave:</span>
              <select
                value={platform()!.getOctave}
                onChange={(e) => {
                  platform()!.setOctave = e.target.value;
                }}
              >
                <For each={OCTAVES}>
                  {(o) => <option value={o}>{o}</option>}
                </For>
              </select>
            </label>
          </fieldset>

          <fieldset>
            <label>
              <span>Duration:</span>
              <select
                value={platform()!.getDuration}
                onChange={(e) => {
                  platform()!.setDuration = e.target.value;
                }}
              >
                <For each={DURATION}>
                  {(o) => <option value={o}>{o}</option>}
                </For>
              </select>
            </label>
          </fieldset>
        </form>
      </div>
    </Show>
  );
}
