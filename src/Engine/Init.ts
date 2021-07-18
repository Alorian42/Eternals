import { DEFAULT_ENEMY_SPEED, ENEMY_FINISH_POINTS, ENEMY_SPAWN_POINTS } from '../Constants/global';
import { Rectangle, Region, Timer, Trigger, Unit } from 'w3ts';
import Enemy from '../Units/Enemy';
import { IPoint } from 'types';
export default class InitEngine {
  enemies: Array<Enemy> = [];

  start(): void {
    this.initZones();

    FogEnableOff();
    FogMaskEnableOff();

    const timer = new Timer();
    timer.start(1, true, () => {
      this.enemies.push(this.spawnEnemy());

      if (this.enemies.length > 5) {
        timer.destroy();
      }
    });
  }

  initZones(): void {
    ENEMY_FINISH_POINTS[0].forEach((point, index, arr) => {
      if (index + 1 < arr.length) {
        this.createTriggerZone(point, arr[index + 1]);
      }
    });
  }

  createTriggerZone(current: IPoint, next: IPoint): void {
    const trigger = new Trigger();
    const region = new Region();

    region.addRect(new Rectangle(current.x - 50, current.y - 50, current.x + 50, current.y + 50));
    trigger.registerEnterRegion(region.handle, () => true);

    trigger.addAction(() => {
      const unit = Unit.fromHandle(Unit.fromEvent().handle);
      const enemy = this.enemies.find(e => e.unit.id === unit.id);
      enemy.move(next.x, next.y);
    });
  }

  spawnEnemy(): Enemy {
    const { x, y, face } = ENEMY_SPAWN_POINTS[0];

    const enemy = new Enemy(x, y, face);
    enemy.unit.moveSpeed = DEFAULT_ENEMY_SPEED;

    print(`Enemy ${enemy.unit.id} has spawned on x=${enemy.unit.x},y=${enemy.unit.y} and face=${enemy.unit.facing}`);

    return enemy;
  }
}
