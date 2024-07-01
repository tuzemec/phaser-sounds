import * as Tone from "tone";
import { EventBus } from "../EventBus";
import type { SoundScene } from "../scenes/SoundScene";

const COLOR = 0x00aa99;
const HIGHLIGHT = 0xfffffff;

export class Platform extends Phaser.GameObjects.Container {
  platform: Phaser.GameObjects.Rectangle;
  outline: Phaser.GameObjects.Rectangle;
  selected: boolean;
  synth: Tone.PolySynth;
  note: string[];
  octave: string;
  duration: string;

  constructor(scene: SoundScene, x: number, y: number, angle = 0) {
    super(scene, x, y);
    this.selected = false;
    this.setSize(100, 10);
    this.synth = scene.synth;
    this.note = ["C4"];
    this.duration = "16n";

    scene.matter.add.gameObject(this, {
      isStatic: true,
      angle: Phaser.Math.DegToRad(angle),
    });

    this.platform = scene.add.rectangle(0, 0, 100, 10, COLOR);
    this.add(this.platform);

    this.setInteractive({
      draggable: true,
      hitArea: new Phaser.Geom.Rectangle(0, 0, 100, 10),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    });

    this.on(
      "drag",
      (_: Phaser.Input.Pointer, x: number, y: number) => {
        // const event = pointer.event;
        // const isAlt = event.altKey;
        // const isShift = event.shiftKey;

        this.setPosition(x, y);
      },
      this,
    );

    this.on("pointerdown", this.select, this);
    this.on("wheel", this.wheel, this);

    EventBus.on("global.deselect", this.deselect, this);
  }

  get getNote() {
    return this.note;
  }

  set setNote(value: string[]) {
    this.note = value;
  }

  get getDuration() {
    return this.duration;
  }

  set setDuration(value: string) {
    this.duration = value;
  }

  wheel(_: Phaser.Input.Pointer, __: number, dy: number) {
    const smooth = 8;
    this.setAngle(this.angle + dy / smooth);
    this.emit("change");
  }

  select() {
    if (this.selected) return;

    EventBus.emit("global.deselect");
    EventBus.emit("global.select", this);

    this.selected = true;
    this.platform.setFillStyle(HIGHLIGHT);
  }

  deselect() {
    this.platform.setFillStyle(COLOR);
    this.selected = false;
  }

  hit() {
    const now = Tone.now();
    this.synth.triggerAttackRelease(this.note, this.duration, now);
  }
}
