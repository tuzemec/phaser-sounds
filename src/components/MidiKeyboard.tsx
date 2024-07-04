import { type Component, For, createEffect, createSignal } from "solid-js";
import type { Platform } from "../game/objects/Platform";
import styles from "./MidiKeyboard.module.css";

const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const OCTAVES = [1, 2, 3, 4, 5, 6];
const MAX_KEYS = 7;

type Props = {
  platform: Platform;
};

const MidiKeyboard: Component<Props> = (props) => {
  const [selected, setSelected] = createSignal<string[]>(props.platform.note);

  createEffect(() => {
    props.platform.setNote = selected();
  });

  return (
    <div class={styles.wrapper}>
      <div class={styles.keyboard}>
        <For each={OCTAVES}>
          {(octave) => (
            <For each={KEYS}>
              {(key) => (
                <button
                  onClick={() => {
                    const k = `${key}${octave}`;
                    if (!selected().includes(k) && selected().length < MAX_KEYS)
                      setSelected((s) => [...s, k]);
                    else setSelected((s) => s.filter((sk) => sk !== k));
                  }}
                  type="button"
                  classList={{
                    [styles.key]: true,
                    [styles.dark]: key.includes("#"),
                    [styles.selected]: selected().includes(`${key}${octave}`),
                  }}
                />
              )}
            </For>
          )}
        </For>
      </div>
    </div>
  );
};

export default MidiKeyboard;
