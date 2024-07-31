import { createEffect, createSignal } from "solid-js";
import {
  Arc,
  Control,
  type Range,
  RangeType,
  ValueInput,
  createSmoothedValue,
  rangeFunctions,
} from "solid-knobs";

import styles from "./Knob.module.css";

type KnobProps = {
  range: Range;
  defaultValue: number;
  smoothed?: boolean;
  onChange: (v: number) => void;
  label: string;
  readOnlyInput?: boolean;
};

const STROKE = 10;

const Knob = (props: KnobProps) => {
  const [value, setValue] = createSignal(props.defaultValue);

  const normalisedValue = () =>
    rangeFunctions.toNormalised(props.range, value());

  const smoothedValue = createSmoothedValue(normalisedValue, 0.7);

  const baseAngle = 135;

  createEffect(() => {
    props.onChange(value());
  });

  return (
    <div class={styles.knob}>
      <Control
        defaultValue={props.defaultValue}
        range={props.range}
        value={value()}
        onChange={setValue}
      >
        <svg width={64} height={64} viewBox="0 0 100 100">
          <title>{props.label}</title>
          <circle cx={50} cy={50} r={24} fill="#003049" />
          <Arc
            x={50}
            y={50}
            radius={38}
            startAngle={-baseAngle}
            endAngle={baseAngle}
            stroke="#001F2F"
            stroke-width={STROKE}
          />
          <Arc
            x={50}
            y={50}
            radius={42}
            startAngle={
              props.range.type === RangeType.Continuous && props.range.bipolar
                ? 0
                : -baseAngle
            }
            endAngle={
              -baseAngle +
              baseAngle *
                2 *
                (props.smoothed ? smoothedValue() : normalisedValue())
            }
            stroke="#FCBF49"
            stroke-width={STROKE}
          />
        </svg>
      </Control>
      <div class={styles.label}>{props.label}</div>
      <ValueInput
        class="value-input"
        range={props.range}
        value={value()}
        onChange={setValue}
        readOnly={props.readOnlyInput}
      />
    </div>
  );
};

export default Knob;
