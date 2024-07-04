import { Loop } from "tone";
import config from "../../config.json";
import { EventBus } from "../EventBus";
import type { SoundScene } from "../scenes/SoundScene";
import { Ball } from "./Ball";

const cfg = config.source;

export class Source extends Phaser.GameObjects.Container {
  balls: Phaser.GameObjects.Group;
  timer!: Phaser.Time.TimerEvent;
  rect: Phaser.GameObjects.Graphics;
  selected: boolean;
  muted: boolean;
  loop: Loop;
  progress: Phaser.GameObjects.Graphics;

  constructor(scene: SoundScene, x: number, y: number, interval = "1:0:0") {
    super(scene, x, y);

    this.selected = false;
    this.balls = scene.add.group();
    this.setSize(cfg.width, cfg.height);
    this.muted = false;

    this.loop = new Loop(() => {
      this.spawnBall();
    }, interval).start(0);

    this.balls.createMultiple({
      key: "balls",
      classType: Ball,
      quantity: cfg.balls,
      active: false,
      visible: false,
    });

    this.rect = scene.add.graphics();
    this.add(this.rect);
    this.drawGfx();

    this.progress = scene.add.graphics();
    this.add(this.progress);

    this.setInteractive({
      draggable: true,
      hitArea: new Phaser.Geom.Rectangle(0, 0, cfg.width, cfg.height),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    });

    this.on(
      "destroy",
      () => {
        this.loop.dispose();
      },
      this,
    );

    this.on(
      "drag",
      (_: Phaser.Input.Pointer, x: number) => {
        this.setPosition(x, 0);
      },
      this,
    );

    this.on("pointerdown", this.select, this);

    EventBus.on("global.deselect", this.deselect, this);
  }

  private drawGfx(color = Number(cfg.color)) {
    this.rect
      .clear()
      .fillStyle(color)
      .fillRoundedRect(
        -cfg.width / 2,
        -cfg.height / 2,
        cfg.width,
        cfg.height,
        cfg.radius,
      );
  }

  preUpdate() {
    this.progress
      .clear()
      .fillStyle(Number(cfg.progressColor))
      .fillRect(
        -this.width / 2,
        cfg.progressOffset,
        Phaser.Math.FromPercent(this.loop.progress, 0, this.width),
        cfg.progressHeight,
      );
  }

  select() {
    if (this.selected) return;

    EventBus.emit("global.deselect");
    EventBus.emit("global.select", this);

    this.selected = true;
    this.drawGfx(Number(cfg.highlight));
  }

  deselect() {
    this.selected = false;
    this.drawGfx();
  }

  spawnBall() {
    const ball = this.balls.getFirstDead(true);
    ball.spawn(this.x, 5);
  }
}
