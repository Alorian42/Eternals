import { UnitStats } from 'Stats/Stats';
import { Unit } from 'w3ts';

export default abstract class AbstractUnit implements UnitStats {
	unit!: Unit;
	name!: string;
	icon!: string;

	attack = 0;
	fireAddAttack = 0;
	coldAddAttack = 0;
	lightningAddAttack = 0;
	armor = 0;
	evade = 0;
	block = 0;
	fireRes = 0;
	coldRes = 0;
	lightningRes = 0;
	attackSpeed = 0;
	critChance = 0;
	critDamage = 0;
	spellCritChance = 0;
	spellCritDamage = 0;

	get attackTotal(): number {
		return (
			this.attack +
			this.fireAddAttack +
			this.coldAddAttack +
			this.lightningAddAttack
		);
	}
	get attackTotalDescription(): string {
		return `Physical Damage: ${this.attack}
	  Fire Damage: ${this.fireAddAttack}
	  Cold Damage: ${this.coldAddAttack}
	  Ligtning Damage: ${this.lightningAddAttack}`;
	}

	get unitId(): number {
		return FourCC('');
	}

	getStatValue(stat: keyof UnitStats): string | number {
		if (stat === 'attack') {
			return this.attackTotal;
		}

		if (this.isPercentage(stat)) {
			return `${this[stat]}%`;
		}

		return this[stat];
	}

	getStatDescription(stat: keyof UnitStats): string {
		if (stat === 'attack') {
			return this.attackTotalDescription;
		}

		return this.getStatValue(stat).toString();
	}

	isPercentage(stat: keyof UnitStats): boolean {
		switch (stat) {
			case 'evade':
			case 'block':
			case 'fireRes':
			case 'coldRes':
			case 'lightningRes':
			case 'critChance':
			case 'critDamage':
			case 'spellCritChance':
			case 'spellCritDamage':
				return true;
			default:
				return false;
		}
	}
}
