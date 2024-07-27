import { type Component, For } from "solid-js";
import { RangeType } from "solid-knobs";
import type { MonoSynthOptions } from "tone";
import Knob from "./Knob";

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
  onChange: (prop: ENV_PROPS, value: number) => void;
  envelope: MonoSynthOptions["envelope"];
};

const EnvelopeEditor: Component<Props> = (props) => {
  return (
    <For each={ENV_OPT}>
      {(f) => (
        <fieldset>
          <Knob
            label={f}
            defaultValue={Number(props.envelope[f])}
            range={{
              type: RangeType.Continuous,
              start: MIN_MAX_STEP[f].min,
              end: MIN_MAX_STEP[f].max,
              step: MIN_MAX_STEP[f].step,
            }}
            onChange={(v) => props.onChange(f, v)}
          />
        </fieldset>
      )}
    </For>
  );
};

export default EnvelopeEditor;
