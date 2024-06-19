export const execGroupMethod = <T>(
  g: Phaser.GameObjects.Group,
  m: keyof T,
  ...args: unknown[]
) =>
  g.children.iterate((c) => {
    const item = c as T;
    const method = item[m] as (...args: unknown[]) => void;

    method.call(c, ...args);

    return true;
  });
