import { DEFAULT_ENEMY_SPEED, ENEMY_SPAWN_POINTS } from '../Constants/global';
import { Rectangle, Region, Timer, Trigger, Unit } from 'w3ts';
import Enemy from '../Units/Enemy';
export default class InitEngine {
  enemies: Array<Enemy> = [];

  start(): void {
    this.initZones();

    const timer = new Timer();
    timer.start(1, true, () => {
      this.enemies.push(this.spawnEnemy());

      if (this.enemies.length > 5) {
        timer.destroy();
      }
    });
  }

  initZones(): void {
    const triggerEnd = new Trigger();
    const regionEnd = new Region();

    regionEnd.addRect(new Rectangle(575, 575, 625, 625));
    triggerEnd.registerEnterRegion(regionEnd.handle, () => true);

    triggerEnd.addAction(() => {
      const unit = Unit.fromEvent();
      const enemy = this.enemies.find(e => e.unit.id === unit.id);
      enemy.move(0, 0);
    });

    const triggerStart = new Trigger();
    const regionStart = new Region();

    regionStart.addRect(new Rectangle(-25, -25, 25, 25));
    triggerStart.registerEnterRegion(regionStart.handle, () => true);

    triggerStart.addAction(() => {
      const unit = Unit.fromHandle(Unit.fromEvent().handle);
      const enemy = this.enemies.find(e => e.unit.id === unit.id);
      enemy.move(600, 600);
    });
  }

  spawnEnemy(): Enemy {
    const { x, y, face } = ENEMY_SPAWN_POINTS[0];

    const enemy = new Enemy(x, y, face);
    enemy.unit.moveSpeed = DEFAULT_ENEMY_SPEED;

    enemy.move(600, 600);
    print(`Enemy ${enemy.unit.id} has spawned on x=${enemy.unit.x},y=${enemy.unit.y} and face=${enemy.unit.facing}`);

    return enemy;
  }
}
