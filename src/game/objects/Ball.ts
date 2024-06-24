export class Ball extends Phaser.Physics.Matter.Sprite {
  trail: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, "balls", 1);

    this.setCircle(8);
    this.setBounce(1);
    this.setFriction(0);
    this.setFrictionAir(0.0052);
    this.setFrictionStatic(0);

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

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    const { height } = this.scene.sys.game.canvas;

    if (this.y + this.height > height + 100) this.disable();
  }

  spawn(x: number, y: number) {
    this.setPosition(x, y);
    this.active = true;
    this.visible = true;

    this.setVelocity(0);
    this.setAngularSpeed(0);
    this.setAngularVelocity(0);

    this.trail.start();
  }

  disable() {
    this.trail.stop();
    this.setPosition(-200, -200);
    this.setVisible(false);
    this.setActive(false);
  }
}
