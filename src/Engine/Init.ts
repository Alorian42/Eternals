import { DEFAULT_ENEMY_SPEED, PLAYER_0, PLAYER_1, PLAYER_2, PLAYER_3, PLAYER_4, PLAYER_5, PLAYER_6, PLAYER_7, ENEMY_SPAWN_POINTS } from '../Constants/global';
import { Rectangle, Region, Timer, Trigger, Unit } from 'w3ts';
import Enemy from '../Units/Enemy';
import { IPoint } from 'types';
import { IEnemy } from '../types';
import CommandsEngine from './Commands';

export default class InitEngine {
  enemies: Array<Enemy> = [];
  commands = new CommandsEngine();
  activePlayers: Array<number> = [];

  start(): void {
    this.commands.initCommands();
    this.initPlayers();

    FogEnableOff();
    FogMaskEnableOff();

    this.activePlayers.forEach(index => {
      this.initZones(index);
      this.spawnWave(Enemy, index, 5);
    });
  }

  initPlayers(): void {
    ForForce(GetPlayersAll(), () => {
      const player = GetEnumPlayer();
      if (GetPlayerSlotState(player) === PLAYER_SLOT_STATE_PLAYING && GetPlayerController(player) === MAP_CONTROL_USER) {
        const index = GetPlayerId(player);
        this.activePlayers.push(Number(index));
      }
    });
  }

  initZones(player: number): void {
    let points = [];

    switch (player) {
      case 0:
        points = PLAYER_0;
        break;
      case 1:
        points = PLAYER_1;
        break;
      case 2:
        points = PLAYER_2;
        break;
      case 3:
        points = PLAYER_3;
        break;
      case 4:
        points = PLAYER_4;
        break;
      case 5:
        points = PLAYER_5;
        break;
      case 6:
        points = PLAYER_6;
        break;
      case 7:
        points = PLAYER_7;
        break;

      default:
        break;
    }


    points.forEach((point, i, arr) => {
      if (i + 1 < arr.length) {
        this.createTriggerZoneWaypoint(point, arr[i + 1]);
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
      }
    });
  }

  spawnEnemy(type: IEnemy, player: number): Enemy {
    const { x, y, face } = ENEMY_SPAWN_POINTS[player];

    const enemy = new type(x, y, face);
    enemy.unit.moveSpeed = DEFAULT_ENEMY_SPEED;

    return enemy;
  }
}
