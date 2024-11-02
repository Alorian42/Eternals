import { UnitStats } from '../Stats/Stats';
import { Timer, Unit } from 'w3ts';
import { Players } from 'w3ts/globals';
import AbstractUnit from './Abstract';

export default class Enemy extends AbstractUnit {
	constructor(x: number, y: number, face: number) {
		super();
		this.unit = Unit.create(Players[11], this.unitId, x, y, face) as Unit;
	}

	move(x: number, y: number): void {
		IssuePointOrder(this.unit.handle, 'move', x, y);
	}

	receiveDamage(
		outcomingDamage: number,
		settings: Record<string, boolean> = {}
	): void {
		const unitLife = GetUnitStateSwap(UNIT_STATE_LIFE, this.unit.handle);
		SetUnitLifeBJ(this.unit.handle, unitLife - outcomingDamage);

		// @TODO ???
		// tower.unit.damageTarget(this.unit, outcomingDamage);

		// @TODO create damage engine
		const text = settings.isEvaded
			? 'Evaded'
			: `${outcomingDamage} ${settings.isBlocked ? '(Blocked!)' : ''}${
					settings.isCritical ? '(Critical!)' : ''
				}`;
		const tag = CreateTextTagUnitBJ(
			text,
			this.unit.handle,
			0,
			8,
			100,
			100,
			100,
			1
		);

		if (!tag) return;

		SetTextTagVelocityBJ(tag, 75, 90);

		const timer = Timer.create();
		timer.start(0.7, false, () => {
			timer.destroy();
			DestroyTextTagBJ(tag);
		});
	}

	setLife(life: number): void {
		this.unit.maxLife = Math.floor(life);
		SetUnitLifePercentBJ(this.unit.handle, 100);
	}

	setName(name: string): void {
		this.unit.name = name;
	}
}
