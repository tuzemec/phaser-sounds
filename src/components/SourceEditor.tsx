import { Show, createSignal } from "solid-js";
import { EventBus } from "../game/EventBus";
import type { Source } from "../game/objects/Source";

export default function PlatformEditor() {
  const [visible, setVisible] = createSignal(false);
  const [source, setSource] = createSignal<Source | null>(null);

  EventBus.on("global.select.source", (element: Source) => {
    setVisible(true);
    setSource(element);
  });

  EventBus.on("global.deselect", () => {
    setVisible(false);
    setSource(null);
  });

  return (
    <Show when={visible() && source()}>
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
              <span>active</span>
              <input
                type="checkbox"
                checked={source()?.running}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    source()!.start();
                  } else {
                    source()!.stop();
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
