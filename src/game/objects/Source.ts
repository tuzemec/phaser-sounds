import { EventBus } from "../EventBus";
import type { SoundScene } from "../scenes/SoundScene";
import { Ball } from "./Ball";

const BALLS_COUNT = 10;
const COLOR = 0x5500cc;
const HIGLIGHT = 0xffffff;

export class Source extends Phaser.GameObjects.Container {
  balls: Phaser.GameObjects.Group;
  interval: number;
  timer!: Phaser.Time.TimerEvent;
  rect: Phaser.GameObjects.Rectangle;
  selected: boolean;
  muted: boolean;
  running: boolean;

  constructor(scene: SoundScene, x: number, y: number, interval = 2000) {
    super(scene, x, y);

    this.interval = interval;
    this.selected = false;
    this.balls = scene.add.group();
    this.setSize(30, 40);
    this.muted = false;
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
  }

  select() {
    if (this.selected) return;

    EventBus.emit("global.deselect");
    EventBus.emit("global.select", this);

    this.selected = true;
    this.rect.setFillStyle(HIGLIGHT);
  }

  deselect() {
    this.selected = false;
    this.rect.setFillStyle(COLOR);
  }

  spawnBall() {
    if (this.muted || !this.running) return;

    const ball = this.balls.getFirstDead(true);
    ball.spawn(this.x, 0);

    this.timer = this.scene.time.addEvent({
      delay: this.interval,
      callback: this.spawnBall,
      callbackScope: this,
    });
  }

  start() {
    if (this.running) return;

    this.running = true;
    this.spawnBall();
  }

  stop() {
    this.running = false;
  }

  mute() {
    this.muted = true;
  }

  unmute() {
    this.muted = false;
    this.spawnBall();
  }

  setInterval(n: number) {
    this.interval = n;
  }
}
