import { For } from "solid-js";
import type { EnvelopeOptions } from "tone";
import type {
  OmniOscillatorOptions,
  OmniOscillatorType,
} from "tone/build/esm/source/oscillator/OscillatorInterface";
import { useGameContext } from "../context/SoundSceneContext";
import type { Source } from "../game/objects/Source";

const OSC: OmniOscillatorType[] = [
  "sine",
  "square",
  "triangle",
  "sawtooth",
  "pwm",
  "fatsine",
  "fatsquare",
  "fatsawtooth",
  "fattriangle",
];

const FLT_OPT: Array<Partial<keyof Omit<EnvelopeOptions, "context">>> = [
  "attack",
  "decay",
  "sustain",
  "release",
];

const SynthEditor = () => {
  const [state] = useGameContext();
  const source = state.selected as Source;
  const synth = source.synth;

  return (
    <div class="editor">
      <form>
        <fieldset>
          <label>
            <span>OSC:</span>
            <select
              value={synth.get().oscillator.type}
              onChange={(e) =>
                synth.set({
                  oscillator: { type: e.target.value } as OmniOscillatorOptions,
                })
              }
            >
              <For each={OSC}>
                {(osc) => <option value={osc}>{osc}</option>}
              </For>
            </select>
          </label>
        </fieldset>

        <For each={FLT_OPT}>
          {(f) => (
            <fieldset>
              <label>
                <span>{f[0]}</span>
                <input
                  onChange={(e) =>
                    synth.set({
                      envelope: { [f]: e.target.value },
                    })
                  }
                  size={6}
                  type="text"
                  value={synth.get().envelope[f].toString()}
                />
              </label>
            </fieldset>
          )}
        </For>
      </form>
    </div>
  );
};

export default SynthEditor;
