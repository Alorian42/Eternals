import Tower from 'Towers/Abstract';
import Enemy from 'Units/Enemy';

export default class CombatCalculatorEngine {
	static calculateDamage(
		tower: Tower,
		enemy: Enemy,
		settings: {
			isSpell?: boolean;
		} = {}
	): number {
		const normalAttack = tower.attack;
		const fireAttack = tower.fireAddAttack;
		const coldAttack = tower.coldAddAttack;
		const lightningAttack = tower.lightningAddAttack;
		const critChance = tower.critChance;
		const critDamage = tower.critDamage;

		const armor = enemy.armor;
		const evade = enemy.evade;
		const block = enemy.block;
		const fireRes = enemy.fireRes;
		const coldRes = enemy.coldRes;
		const lightningRes = enemy.lightningRes;

		const evadeHappened = this.considerEvade(evade);

		if (evadeHappened) {
			throw {
				message: 'Evaded',
				damage: 0,
			};
		}

		const blockHappened = this.considerBlock(block);
		const critHappened = this.considerCrit(critChance);
		// @TODO check for crit
		// @TODO check for spell crit

		const resultNormalDamage =
			normalAttack * (1 - this.convertArmorToDamageReduction(armor));
		const resultFireDamage =
			fireAttack * (1 - this.convertResToDamageReduction(fireRes));
		const resultColdDamage =
			coldAttack * (1 - this.convertResToDamageReduction(coldRes));
		const resultLightningDamage =
			lightningAttack *
			(1 - this.convertResToDamageReduction(lightningRes));

		const totalDamage = Math.floor(
			resultNormalDamage +
				resultFireDamage +
				resultColdDamage +
				resultLightningDamage
		);

		if (blockHappened) {
			throw {
				message: 'Blocked',
				damage: Math.floor(totalDamage * 0.5),
			};
		} else if (critHappened) {
			throw {
				message: 'Critical',
				damage: Math.floor(totalDamage * (1 + critDamage / 100)),
			};
		}
		return totalDamage;
	}

	static convertArmorToDamageReduction(armor: number): number {
		return armor / (armor + 1000);
	}

	static convertResToDamageReduction(res: number): number {
		return Math.max(1, res / 100);
	}

	static considerBlock(block: number): boolean {
		return Math.random() < block / 100;
	}

	static considerEvade(evade: number): boolean {
		return Math.random() < evade / 100;
	}

	static considerCrit(chance: number): boolean {
		return true;
		return Math.random() < chance / 100;
	}
}
