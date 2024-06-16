import { EventBus } from "../EventBus";
import type { SoundScene } from "../scenes/SoundScene";
import { Ball } from "./Ball";

const BALLS_COUNT = 10;
const COLOR = 0x5500cc;
const HIGLIGHT = 0xffffff;

export class Source extends Phaser.GameObjects.Container {
  balls: Phaser.GameObjects.Group;
  interval: number;
  running: boolean;
  timer!: Phaser.Time.TimerEvent;
  rect: Phaser.GameObjects.Rectangle;
  selected: boolean;

  constructor(scene: SoundScene, x: number, y: number, interval = 2000) {
    super(scene, x, y);

    this.interval = interval;
    this.selected = false;
    this.balls = scene.add.group();
    this.setSize(30, 40);
    this.running = false;

    this.balls.createMultiple({
      key: "balls",
      classType: Ball,
      quantity: BALLS_COUNT,
      active: false,
      visible: false,
    });

    this.rect = scene.add.rectangle(0, 0, 30, 40, COLOR);
    this.add(this.rect);

    this.setInteractive({
      draggable: true,
      hitArea: new Phaser.Geom.Rectangle(0, 0, 30, 40),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    });

    this.on(
      "drag",
      (_: Phaser.Input.Pointer, x: number) => {
        this.setPosition(x, 0);
      },
      this,
    );
    this.on("pointerdown", this.select, this);

    EventBus.on("global.deselect", this.deselect, this);
    EventBus.on("global.start", this.start, this);
    EventBus.on("global.stop", this.stop, this);
  }

  select() {
    if (this.selected) return;

    EventBus.emit("global.deselect");
    EventBus.emit("global.select.source", this);

    this.selected = true;
    this.rect.setFillStyle(HIGLIGHT);
  }

  deselect() {
    this.rect.setFillStyle(COLOR);
    this.selected = false;
  }

  spawnBall() {
    if (!this.running) return;

    EventBus.emit("balls.spawn");

    const ball = this.balls.getFirstDead(true);
    ball.spawn(this.x, 0);

    this.timer = this.scene.time.addEvent({
      delay: this.interval,
      callback: this.spawnBall,
      callbackScope: this,
    });
  }

  start() {
    EventBus.emit("source.start", this);
    this.running = true;
    this.spawnBall();
  }

  stop() {
    EventBus.emit("source.stop", this);
    this.running = false;
  }

  setInterval(n: number) {
    this.interval = n;
  }
}
