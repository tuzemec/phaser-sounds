import { type Accessor, Show, createMemo } from "solid-js";
import { useGameContext } from "../game/PhaserGameContext";
import { Source } from "../game/objects/Source";

export default function PlatformEditor() {
  const [state] = useGameContext();

  const source: Accessor<Source | null> = createMemo(() => {
    if (state.selected && state.selected instanceof Source) {
      return state.selected as Source;
    }
    return null;
  });

  return (
    <Show when={source()}>
      <div class="editor">
        <form>
          <fieldset>
            <label>
              <span>interval: </span>
              <input
                type="number"
                min={500}
                max={5000}
                value={source()!.interval}
                onInput={(e) => {
                  source()?.setInterval(Number(e.currentTarget.value));
                }}
              />
            </label>
          </fieldset>

          <fieldset>
            <label>
              <span>muted</span>
              <input
                type="checkbox"
                checked={source()?.muted}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    source()!.mute();
                  } else {
                    source()!.unmute();
                  }
                }}
              />
            </label>
          </fieldset>
        </form>
      </div>
    </Show>
  );
}
