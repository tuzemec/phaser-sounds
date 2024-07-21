import { onCleanup } from "solid-js";
import { useGameContext } from "../context/SoundSceneContext";
import styles from "./About.module.css";

const About = () => {
  const [, { toggleAbout }] = useGameContext();

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") toggleAbout();
  };

  document.addEventListener("keydown", handleKeydown);

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeydown);
  });

  return (
    <div class={styles.overlay}>
      <article class={styles.content}>
        <header>Phaser Sounds</header>
        <main>
          <p>
            Heavily inspired by{" "}
            <a href="https://finneganeganegan.gumroad.com/l/Droplets">
              Droplets
            </a>
            . Go buy it. It's fun.
          </p>
          <p>
            Use the link button in the lower right corner to copy to clipbord
            the current state as url.
          </p>
          <p>
            Source available at{" "}
            <a href="https://github.com/tuzemec/phaser-sounds">GitHub</a>.
          </p>
          <p>
            Using <a href="https://phaser.io/">Phaser</a>,{" "}
            <a href="https://brm.io/matter-js/">MatterJS</a>,{" "}
            <a href="https://www.solidjs.com/">SolidJS</a> and{" "}
            <a href="https://tonejs.github.io/">Tone.js</a>.
          </p>
          <b>kyboard shortcuts:</b>
          <ul>
            <li>
              <kbd>space</kbd> - start/stop
            </li>
            <li>
              <kbd>s</kbd> - add source
            </li>
            <li>
              <kbd>p</kbd> - add platform
            </li>
            <li>
              <kbd>backspace</kbd> - remove selected
            </li>
          </ul>
        </main>
        <footer>
          <button onClick={toggleAbout} type="button">
            Ok
          </button>
        </footer>
      </article>
    </div>
  );
};

export default About;
