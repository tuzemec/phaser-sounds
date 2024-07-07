import { Loop } from "tone";
import config from "../../config.json";
import type { SourceData } from "../../utils/serialize";
import { EventBus } from "../EventBus";
import type { SoundScene } from "../scenes/SoundScene";
import { Ball } from "./Ball";

const cfg = config.source;

const defaultData: Omit<SourceData, "x" | "y"> = {
  muted: false,
  interval: cfg.defaultInterval,
};

export class Source extends Phaser.GameObjects.Container {
  balls: Phaser.GameObjects.Group;
  timer!: Phaser.Time.TimerEvent;
  rect: Phaser.GameObjects.Graphics;
  selected: boolean;
  muted: boolean;
  loop: Loop;
  progress: Phaser.GameObjects.Graphics;
  interval: string;

  constructor(scene: SoundScene, x: number, y: number, config = defaultData) {
    super(scene, x, y);

    this.selected = false;
    this.balls = scene.add.group();
    this.setSize(cfg.width, cfg.height);
    this.muted = config.muted;
    this.interval = config.interval;

    this.loop = new Loop(() => {
      this.spawnBall();
    }, this.interval).start(0);

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
      .lineStyle(cfg.progressStroke, Number(cfg.progressColor))
      .beginPath()
      .arc(
        0,
        cfg.progressRadius + 5,
        cfg.progressRadius,
        Phaser.Math.DegToRad(-90),
        Phaser.Math.DegToRad(
          Phaser.Math.FromPercent(this.loop.progress, -90, 360 - 90),
        ),
      )
      .strokePath()
      .closePath();
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

  serialize(): SourceData {
    return {
      x: this.x,
      y: this.y,
      muted: this.muted,
      interval: this.interval,
    };
  }
}
