import { IEnemy } from '../types';
import { getRandomElement } from '../Utils/Array';
import SkeletonWarrior from '../Units/SekeletonWarrior';
import { Trigger } from 'w3ts';
import { Players } from 'w3ts/globals';
import Enemy from '../Units/Enemy';
import RewardEngine from './Reward';
import InitEngine from './Init';
import { printDebugMessage } from '../Utils/Debug';
import SkeletonArcher from 'Units/SkeletonArcher';

export default class WaveEngine {
	waves!: Array<number>;
	enemies: Array<{
		player: number;
		wave: number;
		enemies: Array<typeof Enemy>;
		isInProgress: boolean;
	}> = [];
	isInProgress!: Array<boolean>;
	engine!: InitEngine;

	constructor(engine: InitEngine) {
		this.engine = engine;
		this.waves = [];
		for (let index = 0; index < bj_MAX_PLAYERS; index++) {
			this.waves.push(0);
		}

		this.isInProgress = [];
		for (let index = 0; index < bj_MAX_PLAYERS; index++) {
			this.isInProgress.push(false);
		}

		this.enemyDiesTrigger();
	}

	enemyDiesTrigger(): void {
		const trigger = Trigger.create();
		trigger.registerPlayerUnitEvent(
			Players[11],
			EVENT_PLAYER_UNIT_DEATH,
			() => true
		);
		trigger.addAction(() => {
			this.checkWaves();
		});
	}

	checkWaves(): void {
		this.enemies = this.enemies.filter((item) => {
			// @ts-ignore
			item.enemies = item.enemies.filter((e) => e.unit);
			printDebugMessage(`${item.enemies.length} ${item.isInProgress}`);
			if (item.enemies.length === 0 && !item.isInProgress) {
				this.engine.waveFinished(item.player, item.wave);

				return false;
			}

			return true;
		});
	}

	generateWave(player: number): Array<typeof Enemy> {
		const result = [];
		const wave = this.waves[player] + 1;
		const pool = this.getEnemyPool(wave);
		const size = this.getPackSize(wave);
		for (let index = 0; index < size; index++) {
			result.push(getRandomElement(pool));
		}

		this.waves[player]++;
		this.enemies.push({
			player,
			wave,
			// @TODO this is not real spawned units ;(
			enemies: result,
			isInProgress: true,
		});

		return result;
	}

	getModifier(x: number): number {
		return Math.log(x) * x + 1;
	}

	getEnemyPool(wave: number): Array<typeof Enemy> {
		return [SkeletonWarrior, SkeletonArcher]; // @TODO
	}

	getPackSize(wave: number): number {
		return Math.max(5, Math.floor(Math.random() * wave));
	}

	waveGenerationFinished(player: number, wave: number): void {
		const item = this.enemies.find((e) => {
			return e.player === player && e.wave === wave;
		});

		if (item) {
			item.isInProgress = false;

			printDebugMessage(`Wave finished ${item.wave}`);
		}
	}
}
