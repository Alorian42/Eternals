import { IEnemy } from '../types';
import Enemy from '../Units/Enemy';
import { getRandomElement } from '../Utils/Array';

export default class WaveEngine {
  waves!: Array<number>
  isInProgress!: Array<boolean>;

  constructor() {
    this.waves = [];
    for (let index = 0; index < bj_MAX_PLAYERS; index++) {
      this.waves.push(0);
    }

    this.isInProgress = [];
    for (let index = 0; index < bj_MAX_PLAYERS; index++) {
      this.isInProgress.push(false);
    }
  }

  generateWave(player: number): Array<IEnemy> {
    const result = [];
    const wave = this.waves[player] + 1;
    const pool = this.getEnemyPool(wave);
    const size = this.getPackSize(wave);
    for (let index = 0; index < size; index++) {
      result.push(getRandomElement(pool));
    }

    this.waves[player]++;

    return result;
  }

  getModifier(x: number): number {
    return Math.log(x) * x + 1;
  }

  getEnemyPool(wave: number): Array<IEnemy> {
    return wave ? [Enemy] : [Enemy, Enemy]; // @TODO
  }

  getPackSize(wave: number): number {
    return Math.max(5, Math.floor(Math.random() * wave));
  }
}
