import { onCleanup, onMount } from "solid-js";
import { useGameContext } from "../context/SoundSceneContext";
import { serialize } from "../utils/serialize";
import Editors from "./Editors";

export default function () {
  const [state, { toggle, toggleAbout, removeSelected }] = useGameContext();
  let editorRef!: HTMLDivElement;

  const keyHandler = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement;

    if (editorRef.contains(t)) return;

    if (e.key === " ") toggle();
    if (e.key === "p") state.scene?.addPlatform();
    if (e.key === "s") state.scene?.addSource();
    if (e.key === "Backspace") removeSelected();
  };

  onMount(() => {
    document.addEventListener("keydown", keyHandler);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div ref={editorRef} class="controls">
      <div class="controls-content">
        <button
          title="About"
          type="button"
          onClick={() => {
            toggleAbout();
          }}
        >
          <svg
            width={24}
            height={24}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="#EAE2B7"
          >
            <title>About</title>
            <path d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm-40-176h24v-64h-24c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-80c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
        </button>

        <div>
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              state.scene?.addSource();
            }}
          >
            + source
          </button>
          <span class="play-button">
            <button
              class={state.playing ? "playing" : "stopped"}
              type="button"
              onClick={() => {
                toggle();
              }}
            >
              {state.playing ? (
                <svg
                  width={32}
                  height={32}
                  fill="#EAE2B7"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <title>STOP</title>
                  <path d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm-64-352h128c17.7 0 32 14.3 32 32v128c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V192c0-17.7 14.3-32 32-32z" />
                </svg>
              ) : (
                <svg
                  width={32}
                  height={32}
                  fill="#EAE2B7"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <title>PLAY</title>

                  <path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0zm188.3-108.9c-7.6 4.2-12.3 12.3-12.3 20.9v176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
                </svg>
              )}
            </button>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              state.scene?.addPlatform();
            }}
          >
            + platform
          </button>
        </div>

        <button
          title="Copy scene url"
          type="button"
          onClick={() => serialize(state.scene!)}
        >
          <svg
            width={24}
            height={24}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            fill="#EAE2B7"
          >
            <title>Copy scene url</title>
            <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6 31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0l112.3-112.3zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5 50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5l112.2-112.3c31.5-31.5 82.5-31.5 114 0 27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
          </svg>
        </button>
      </div>

      <Editors />
    </div>
  );
}
