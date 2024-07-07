import * as Tone from "tone";
import config from "../../config.json";
import type { PlatformData } from "../../utils/serialize";
import { EventBus } from "../EventBus";
import type { SoundScene } from "../scenes/SoundScene";

const cfg = config.platform;

const defaultData: Omit<PlatformData, "x" | "y"> = {
  angle: cfg.defaultAngle,
  note: cfg.defaultNote,
  duration: cfg.defaultDuration,
};

export class Platform extends Phaser.GameObjects.Container {
  platform: Phaser.GameObjects.Graphics;
  selected: boolean;
  synth: Tone.PolySynth;
  note: string[];
  duration: string;

  constructor(scene: SoundScene, x: number, y: number, config = defaultData) {
    super(scene, x, y);
    this.selected = false;
    this.setSize(cfg.width, cfg.height);
    this.synth = scene.synth;
    this.note = config.note;
    this.duration = cfg.defaultDuration;

    scene.matter.add.gameObject(this, {
      isStatic: true,
      angle: Phaser.Math.DegToRad(config.angle),
      chamfer: {
        radius: cfg.radius,
      },
    });

    this.platform = scene.add.graphics();
    this.add(this.platform);
    this.drawPlatform();

    this.setInteractive({
      draggable: true,
      hitArea: new Phaser.Geom.Rectangle(0, 0, cfg.width, cfg.height),
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

  private drawPlatform(color = Number(cfg.color)) {
    this.platform
      .clear()
      .fillStyle(color)
      .fillRoundedRect(
        0 - cfg.width / 2,
        0 - cfg.height / 2,
        cfg.width,
        cfg.height,
        cfg.radius,
      );
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

    this.drawPlatform(Number(cfg.highlightColor));

    this.selected = true;
  }

  deselect() {
    this.selected = false;
    this.drawPlatform();
  }

  hit() {
    const now = Tone.now();
    this.synth.triggerAttackRelease(this.note, this.duration, now);
  }

  serialize(): PlatformData {
    return {
      x: this.x,
      y: this.y,
      angle: this.angle,
      duration: this.duration,
      note: this.note,
    };
  }
}
