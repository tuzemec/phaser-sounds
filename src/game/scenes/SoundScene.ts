import { Scene } from "phaser";
import { PolySynth } from "tone";
import { EventBus } from "../EventBus";
// import { initTone } from "../Transport";
import { Platform } from "../objects/Platform";
import { Source } from "../objects/Source";
// import { execGroupMethod } from "../utils";}

export class SoundScene extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  gameText: Phaser.GameObjects.Text;
  synth: PolySynth;
  sources: Phaser.GameObjects.Group;
  toneInitialized: boolean;

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
    this.synth = new PolySynth().toDestination();
    this.sources = this.add.group();
    this.toneInitialized = false;

    this.input.on(
      "pointerdown",
      (_: Phaser.Input.Pointer, objects: Array<unknown>) => {
        if (!objects.length) EventBus.emit("global.deselect");
      },
    );

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

    EventBus.emit("global.scene.ready", this);
  }

  addPlatform() {
    const { width, height } = this.sys.game.canvas;
    this.add.existing(new Platform(this, width / 2, height / 2));
  }

  addSource() {
    const { width } = this.sys.game.canvas;
    const source = this.add.existing(new Source(this, width / 2, 0));
    this.sources.add(source);
  }
}
