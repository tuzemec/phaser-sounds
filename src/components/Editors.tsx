import { Show } from "solid-js";
import { useGameContext } from "../context/SoundSceneContext";
import About from "./About";
import PlatformEditor from "./PlatformEditor";
import SourceEditor from "./SourceEditor";

export default function Editors() {
  const [state] = useGameContext();
  return (
    <>
      <div class="editors">
        <PlatformEditor />
        <SourceEditor />
      </div>
      <Show when={state.aboutOpened}>
        <About />
      </Show>
    </>
  );
}
