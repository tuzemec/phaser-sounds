# Phaser Sounds

Heavily inspired by [Droplets](https://finneganeganegan.gumroad.com/l/Droplets). Go buy it. It's fun.

Based on the [Phaser-SolidJS template](https://github.com/phaserjs/template-solid).

## Using:

- [Phaser](https://phaser.io/)
- [MatterJs](https://brm.io/matter-js/)
- [SolidJS](https://www.solidjs.com/)
- [Tone.js](https://tonejs.github.io/)

## Todo:

- [ ] Reset / Clear all button
- [ ] Different synths per source node / platform
- [ ] Gravity and friction settings for the physics engine
- [ ] Global BPM settings (currently it's 120)
- [ ] Better source nodes representation and interval selection
- [ ] Keyboard shortcuts
- [ ] Resize aware / store the canvas size in the state(?)
- [ ] Auto-save to the local storage
- [ ] Better colors / UI improvements

## Known issues:

The component coordinates are with top/left origin and if a state is restored on a smaller screen, some of the elements may not be visible.
