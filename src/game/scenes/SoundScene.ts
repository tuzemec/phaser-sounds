import { Scene } from "phaser";
import * as Tone from "tone";
import { EventBus } from "../EventBus";
import { Platform } from "../objects/Platform";
import { Source } from "../objects/Source";

export class SoundScene extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  gameText: Phaser.GameObjects.Text;
  synth: Tone.PolySynth;

  constructor() {
    super("SoundScene");
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    this.matter.world.setBounds(
      0,
      0,
      width,
      height,
      5,
      true,
      true,
      false,
      false,
    );

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x002233);
    this.synth = new Tone.PolySynth().toDestination();

    this.input.on(
      "pointerdown",
      (_: Phaser.Input.Pointer, objects: Array<unknown>) => {
        if (!objects.length) EventBus.emit("global.deselect");
      },
    );

    this.add.existing(new Platform(this, 130, 150, 20));
    this.add.existing(new Platform(this, 280, 250, -20));
    this.add.existing(new Source(this, 100, 0));

    this.matter.world.on(
      "collisionstart",
      (
        _: Phaser.Physics.Matter.Events.CollisionStartEvent,
        a: MatterJS.BodyType,
        b: MatterJS.BodyType,
      ) => {
        if (!a.gameObject || !b.gameObject) return;

        if (a.gameObject.hit) a.gameObject.hit();
        if (b.gameObject.hit) b.gameObject.hit();
      },
    );

    EventBus.emit("current-scene-ready", this);
    EventBus.on("global.add.platform", () => this.addPlatform());
    EventBus.on("global.add.source", this.addSource, this);
    EventBus.on("global.start", this.initTone, this);
  }

  initTone() {
    EventBus.off("global.start", this.initTone);
    Tone.start();
  }

  addPlatform() {
    const { width, height } = this.sys.game.canvas;
    this.add.existing(new Platform(this, width / 2, height / 2, 20));
  }

  addSource() {
    const { width } = this.sys.game.canvas;
    this.add.existing(new Source(this, width / 2, 0));
  }
}
