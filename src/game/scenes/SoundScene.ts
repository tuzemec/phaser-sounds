import { Scene } from "phaser";
import config from "../../config.json";
import type { CurrentState } from "../../utils/serialize";
import { EventBus } from "../EventBus";
import { Platform } from "../objects/Platform";
import { Source } from "../objects/Source";

export class SoundScene extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  sources: Phaser.GameObjects.Group;
  platforms: Phaser.GameObjects.Group;

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
    this.camera.setBackgroundColor(config.global.background);
    this.sources = this.add.group();
    this.platforms = this.add.group();

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

        if (a.gameObject.hit) a.gameObject.hit(b.gameObject.source);
        if (b.gameObject.hit) b.gameObject.hit(a.gameObject.source);
      },
    );

    EventBus.emit("global.scene.ready", this);

    this.parseUrlState();
  }

  private parseUrlState() {
    const params = new URLSearchParams(location.search);

    if (!params.get("state")) return;

    const state = JSON.parse(
      decodeURIComponent(params.get("state")!),
    ) as CurrentState;

    for (const p of state.p) {
      const platform = this.add.existing(new Platform(this, p.x, p.y, p));
      this.platforms.add(platform);
    }

    for (const s of state.s) {
      const source = this.add.existing(new Source(this, s.x, s.y, s));
      this.sources.add(source);
    }
  }

  addPlatform() {
    const { width, height } = this.sys.game.canvas;
    const offset = this.platforms.getLength() * 50;
    const platform = this.add.existing(
      new Platform(this, width / 2 + offset, height / 2 + offset),
    );
    this.platforms.add(platform);
  }

  addSource() {
    if (this.sources.getLength() >= config.source.maxCount) return;
    const { width } = this.sys.game.canvas;
    const newX =
      this.sources.getLength() === 0
        ? width / 2
        : this.sources.getLast(true).x + 50;

    const source = this.add.existing(new Source(this, newX, 0, {}));
    this.sources.add(source);
  }

  removePlatform(platform: Platform) {
    EventBus.emit("global.deselect");
    platform.destroy();
  }

  removeSource(source: Source) {
    EventBus.emit("global.deselect");
    source.destroy();
  }
}
