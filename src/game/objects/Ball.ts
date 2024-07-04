import config from "../../config.json";

const cfg = config.ball;

export class Ball extends Phaser.GameObjects.Arc {
  trail: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, cfg.radius, 0, 360, false, Number(cfg.color));

    scene.matter.add.gameObject(this, {
      friction: 0,
      frictionAir: cfg.frictionAir,
      frictionStatic: 0,
      circleRadius: cfg.radius,
      restitution: 1,
      label: "ball",
    });

    this.addTrail();

    this.disable(); // disabled on creation, call spawn()
  }

  addTrail() {
    const ballBody = this.body as MatterJS.BodyType;

    this.trail = this.scene.add.particles(0, 0, "flares", {
      frame: "blue",
      speed: {
        onEmit: () => ballBody.speed,
      },
      lifespan: {
        onEmit: () => Phaser.Math.Percent(ballBody.speed, 0, 300) * 20000,
      },
      alpha: {
        onEmit: () => Phaser.Math.Percent(ballBody.speed, 0, 300) * 1000,
      },
      scale: { start: 0.2, end: 0 },
      blendMode: "ADD",
    });

    this.trail.startFollow(this);
  }

  preUpdate() {
    const { height } = this.scene.sys.game.canvas;

    if (this.y + this.height > height + 100) {
      this.disable();
    }
  }

  spawn(x: number, y: number) {
    this.setPosition(x, y);
    this.active = true;
    this.visible = true;
    this.setRotation(0);

    const body = this.body as MatterJS.BodyType;
    this.scene.matter.setVelocity(body, 0, 0);
    this.scene.matter.setAngularVelocity(body, 0);

    this.trail.start();
  }

  disable() {
    this.trail.stop();
    this.setPosition(-200, -200);
    this.setVisible(false);
    this.setActive(false);
  }
}
