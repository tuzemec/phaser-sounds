import {
  type Accessor,
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import { useGameContext } from "../context/SoundSceneContext";
import { Platform } from "../game/objects/Platform";
import MidiKeyboard from "./MidiKeyboard";

const DURATION = ["32n", "16n", "8n", "4n", "2n", "1n"];

export default function PlatformEditor() {
  const [state] = useGameContext();
  const [selectedNotes, setSelectedNotes] = createSignal<string[]>([]);

  const platform: Accessor<Platform | null> = createMemo(() => {
    if (state.selected && state.selected instanceof Platform) {
      return state.selected as Platform;
    }
    return null;
  });

  createEffect(() => {
    setSelectedNotes(platform()?.note || []);
  });

  createEffect(() => {
    if (!platform()) return;

    platform()!.setNote = selectedNotes();
  });

  return (
    <Show when={platform()}>
      <div class="editor">
        <MidiKeyboard
          selectedNotes={selectedNotes}
          setSelectedNotes={setSelectedNotes}
        />
        <form onSubmit={(e) => e.preventDefault()}>
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

          <fieldset>
            <button
              type="button"
              onClick={() => {
                setSelectedNotes([]);
              }}
            >
              clear
            </button>
          </fieldset>

          <fieldset>
            <button
              type="button"
              onClick={() => {
                state.scene?.removePlatform(platform()!);
              }}
            >
              remove
            </button>
          </fieldset>
        </form>
      </div>
    </Show>
  );
}
