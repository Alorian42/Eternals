import { DEFAULT_ENEMY_SPEED, ENEMY_FINISH_POINTS, ENEMY_SPAWN_POINTS } from '../Constants/global';
import { Rectangle, Region, Timer, Trigger, Unit } from 'w3ts';
import Enemy from '../Units/Enemy';
import { IPoint } from 'types';
import { IEnemy } from '../types';
export default class InitEngine {
  enemies: Array<Enemy> = [];

  start(): void {
    this.initZones();

    FogEnableOff();
    FogMaskEnableOff();

    this.spawnWave(Enemy, 0, 5);
    this.spawnWave(Enemy, 1, 5);
  }

  initZones(): void {
    ENEMY_FINISH_POINTS[0].forEach((point, index, arr) => {
      if (index + 1 < arr.length) {
        this.createTriggerZoneWaypoint(point, arr[index + 1]);
      } else {
        this.createTriggerZoneFinish(point);
      }
    });

    ENEMY_FINISH_POINTS[1].forEach((point, index, arr) => {
      if (index + 1 < arr.length) {
        this.createTriggerZoneWaypoint(point, arr[index + 1]);
      } else {
        this.createTriggerZoneFinish(point);
      }
    });
  }

  createTriggerZoneWaypoint(current: IPoint, next: IPoint): void {
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

  createTriggerZoneFinish(current: IPoint): void {
    const trigger = new Trigger();
    const region = new Region();

    region.addRect(new Rectangle(current.x - 50, current.y - 50, current.x + 50, current.y + 50));
    trigger.registerEnterRegion(region.handle, () => true);

    trigger.addAction(() => {
      const unit = Unit.fromHandle(Unit.fromEvent().handle);
      this.enemies.filter(e => e.unit.id !== unit.id);
      unit.kill();
    });
  }

  spawnWave(type: IEnemy, player: number, size: number): void {
    const timer = new Timer();
    let counter = 0;
    timer.start(1, true, () => {
      this.enemies.push(this.spawnEnemy(type, player));
      counter++;

      if (counter >= size) {
        timer.destroy();

        print('Wave spawned');
      }
    });
  }

  spawnEnemy(type: IEnemy, player: number): Enemy {
    const { x, y, face } = ENEMY_SPAWN_POINTS[player];

    const enemy = new type(x, y, face);
    enemy.unit.moveSpeed = DEFAULT_ENEMY_SPEED;

    print(`Enemy ${enemy.unit.id} has spawned on x=${enemy.unit.x},y=${enemy.unit.y} and face=${enemy.unit.facing}`);

    return enemy;
  }
}
