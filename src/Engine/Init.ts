import {
	DEFAULT_ENEMY_SPEED,
	PLAYER_0,
	PLAYER_1,
	PLAYER_2,
	PLAYER_3,
	PLAYER_4,
	PLAYER_5,
	PLAYER_6,
	PLAYER_7,
	ENEMY_SPAWN_POINTS,
} from '../Constants/global';
import { Rectangle, Region, Timer, Trigger, Unit, MapPlayer } from 'w3ts';
import Enemy from '../Units/Enemy';
import { IPoint } from 'types';
import { IEnemy, ITower } from '../types';
import CommandsEngine from './Commands';
import BasicTower from '../Towers/Basic';
import { Players } from 'w3ts/globals';
import AddColdDamageGem from '../Items/AddColdDamage';
import Tower from '../Towers/Abstract';
import AbstractItem from '../Items/Abstract';
import UiEngine from './Ui';
import StartWaveButton from '../Buttons/StartWave';
import WaveEngine from './WaveEngine';
import { printDebugMessage } from '../Utils/Debug';
import InventoryEngine from './Inventory';
import RewardEngine from './Reward';
import CombatCalculatorEngine from './CombatCalculator';

export default class InitEngine {
	enemies: Array<Enemy> = [];
	commands = new CommandsEngine();
	activePlayers: Array<number> = [];
	towers: Array<Tower> = [];
	items: Array<AbstractItem> = [];
	uiEngine: UiEngine = new UiEngine(this);
	waveEngine = new WaveEngine(this);
	inventoryEngine = new InventoryEngine();

	start(): void {
		printDebugMessage('start');
		this.commands.initCommands();
		this.initPlayers();

		printDebugMessage('players inited');

		FogEnableOff();
		FogMaskEnableOff();
		EnableWorldFogBoundary(false);

		this.uiEngine.start();
		this.inventoryEngine.start();

		this.activePlayers.forEach((index) => {
			this.initZones(index);
			this.buildTower(BasicTower, Players[index], -2170, 2600);
			const addColdDamage = new AddColdDamageGem(-2000, 2600);
			this.items.push(addColdDamage);

			this.inventoryEngine.addItem(index, {
				tower: new BasicTower(),
			});
		});

		this.initItems();
		this.initButtons();
		this.initDamageSystem();
	}

	initDamageSystem(): void {
		const trigger = CreateTrigger();
		TriggerRegisterPlayerUnitEventSimple(
			trigger,
			Player(11) as player,
			EVENT_PLAYER_UNIT_DAMAGED
		);
		TriggerAddAction(trigger, () => {
			const handle = GetTriggerUnit();
			const unit = this.findUnitById(
				GetHandleId(handle as unit)
			) as Enemy;
			const towerHandle = GetEventDamageSource();
			const tower = this.findUnitById(
				GetHandleId(towerHandle as unit)
			) as Tower;

			if (unit !== undefined && tower !== undefined) {
				let damage = 0;
				const settings: Record<string, boolean> = {};
				try {
					damage = CombatCalculatorEngine.calculateDamage(
						tower,
						unit
					);
				} catch (e: any) {
					damage = e.damage;

					if (e.message === 'Blocked') {
						settings.isBlocked = true;
					} else if (e.message === 'Evaded') {
						settings.isEvaded = true;
					} else if (e.message === 'Critical') {
						settings.isCritical = true;
					}
				}
				unit.receiveDamage(damage, settings);
			}
		});
	}

	initButtons(): void {
		new StartWaveButton((playerIndex, button) => {
			if (this.waveEngine.isInProgress[playerIndex]) {
				return;
			}
			this.waveEngine.isInProgress[playerIndex] = true;
			BlzFrameSetVisible(button.handle, false);

			this.spawnWave(playerIndex, () => {
				const timer = new Timer();
				timer.start(5, false, () => {
					timer.destroy();
					BlzFrameSetVisible(
						button.handle,
						GetPlayerId(GetLocalPlayer()) === playerIndex
					);
					this.waveEngine.isInProgress[playerIndex] = false;
				});

				this.waveEngine.waveGenerationFinished(
					playerIndex,
					this.waveEngine.waves[playerIndex]
				);
				this.waveEngine.checkWaves();
			});
		});
	}

	initItems(): void {
		const pickupTrigger = new Trigger();
		pickupTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_PICKUP_ITEM);

		pickupTrigger.addAction(() => {
			const unit = GetTriggerUnit();
			const enumItem = GetManipulatedItem();
			const item = this.items.find(
				(i) => i.item.id === GetHandleId(enumItem as item)
			);
			const tower = this.towers.find(
				(t) => t.unit.id === GetHandleId(unit as unit)
			);

			item?.onPickup(tower as Tower);
		});

		const dropTrigger = new Trigger();
		dropTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DROP_ITEM);

		dropTrigger.addAction(() => {
			const unit = GetTriggerUnit();
			const enumItem = GetManipulatedItem();
			const item = this.items.find(
				(i) => i.item.id === GetHandleId(enumItem as item)
			);
			const tower = this.towers.find(
				(t) => t.unit.id === GetHandleId(unit as unit)
			);

			item?.onDrop(tower as Tower);
		});
	}

	initPlayers(): void {
		ForForce(GetPlayersAll() as force, () => {
			const player = GetEnumPlayer() as player;
			if (
				GetPlayerSlotState(player) === PLAYER_SLOT_STATE_PLAYING &&
				GetPlayerController(player) === MAP_CONTROL_USER
			) {
				const index = GetPlayerId(player);
				this.activePlayers.push(Number(index));
			}
		});
	}

	initZones(player: number): void {
		let points: { x: number; y: number }[] = [];

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

		region.addRect(
			new Rectangle(
				current.x - 50,
				current.y - 50,
				current.x + 50,
				current.y + 50
			)
		);
		trigger.registerEnterRegion(region.handle, () => true);

		trigger.addAction(() => {
			const unit = Unit.fromHandle(Unit.fromEvent()?.handle);
			const enemy = this.enemies.find((e) => e.unit.id === unit?.id);
			enemy?.move(next.x, next.y);
		});
	}

	createTriggerZoneFinish(current: IPoint): void {
		const trigger = new Trigger();
		const region = new Region();

		region.addRect(
			new Rectangle(
				current.x - 50,
				current.y - 50,
				current.x + 50,
				current.y + 50
			)
		);
		trigger.registerEnterRegion(region.handle, () => true);

		trigger.addAction(() => {
			const unit = Unit.fromHandle(Unit.fromEvent()?.handle);
			this.enemies = this.enemies.filter((e) => e.unit.id !== unit?.id);
			unit?.kill();
		});
	}

	spawnWave(player: number, finishCallback: () => void): void {
		const wave = this.waveEngine.generateWave(player);
		const size = wave.length;
		const timer = new Timer();
		const waveNumber = this.waveEngine.waves[player];
		let counter = 0;

		printDebugMessage(`Wave #${waveNumber}: ${size} mobs`); // @TODO show to player proper message

		timer.start(1, true, () => {
			this.enemies.push(
				this.spawnEnemy(wave[counter], player as any, waveNumber)
			);
			counter++;

			if (counter >= size) {
				timer.destroy();
				finishCallback();
			}
		});
	}

	spawnEnemy(
		type: typeof Enemy,
		player: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
		wave: number
	): Enemy {
		const { x, y, face } = ENEMY_SPAWN_POINTS[player];
		const modifier = this.waveEngine.getModifier(wave);
		printDebugMessage(modifier.toString());

		const enemy = new type(x, y, face);
		enemy.setLife(enemy.unit.maxLife * modifier);
		enemy.setName(enemy.name);
		enemy.unit.moveSpeed = DEFAULT_ENEMY_SPEED;
		// @TODO apply wave resistance modifiers

		return enemy;
	}

	buildTower(type: ITower, player: MapPlayer, x: number, y: number): void {
		const tower = new type();
		tower.createUnit(player, x, y, 270);

		this.towers.push(tower);
	}

	waveFinished(player: number, wave: number): void {
		const reward = RewardEngine.generateReward(wave);
		reward.forEach((tower) => {
			this.inventoryEngine.addItem(player, { tower });
		});
	}

	findUnitById(id: number): Enemy | Tower | undefined {
		return (
			this.enemies.find((e) => e.unit.id === id) ||
			this.towers.find((t) => t.unit.id === id)
		);
	}
}
