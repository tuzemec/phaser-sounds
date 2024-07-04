import { type Accessor, type Component, For, type Setter } from "solid-js";
import styles from "./MidiKeyboard.module.css";

const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const OCTAVES = [1, 2, 3, 4, 5, 6];
const MAX_KEYS = 7;

type Props = {
  selectedNotes: Accessor<string[]>;
  setSelectedNotes: Setter<string[]>;
};

const MidiKeyboard: Component<Props> = (props) => {
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
                    if (
                      !props.selectedNotes().includes(k) &&
                      props.selectedNotes().length < MAX_KEYS
                    )
                      props.setSelectedNotes((s) => [...s, k]);
                    else
                      props.setSelectedNotes((s) => s.filter((sk) => sk !== k));
                  }}
                  type="button"
                  classList={{
                    [styles.key]: true,
                    [styles.dark]: key.includes("#"),
                    [styles.selected]: props
                      .selectedNotes()
                      .includes(`${key}${octave}`),
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
