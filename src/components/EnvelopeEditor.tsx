import { type Component, For } from "solid-js";
import type { MonoSynthOptions } from "tone";

type ENV_PROPS = "attack" | "decay" | "sustain" | "release";

const ENV_OPT: Array<ENV_PROPS> = ["attack", "decay", "sustain", "release"];

type MMT = {
  min: number;
  max: number;
  step: number;
};

const MIN_MAX_STEP: Record<ENV_PROPS, MMT> = {
  attack: {
    min: 0,
    max: 2,
    step: 0.01,
  },
  decay: {
    min: 0,
    max: 2,
    step: 0.1,
  },
  sustain: {
    min: 0,
    max: 1,
    step: 0.01,
  },
  release: {
    min: 0,
    max: 5,
    step: 0.2,
  },
};

type Props = {
  onChange: (prop: ENV_PROPS, value: string) => void;
  envelope: MonoSynthOptions["envelope"];
};

const EnvelopeEditor: Component<Props> = (props) => {
  return (
    <For each={ENV_OPT}>
      {(f) => (
        <fieldset>
          <label>
            <span>{f[0]}</span>
            <input
              onInput={(e) => props.onChange(f, e.target.value)}
              type="range"
              value={props.envelope[f].toString()}
              min={MIN_MAX_STEP[f].min}
              max={MIN_MAX_STEP[f].max}
              step={MIN_MAX_STEP[f].step}
            />
          </label>
        </fieldset>
      )}
    </For>
  );
};

export default EnvelopeEditor;
