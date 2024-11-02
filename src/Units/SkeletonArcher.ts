import { UnitStats } from '../Stats/Stats';
import Enemy from './Enemy';

export default class SkeletonWarrior extends Enemy implements UnitStats {
	name = 'Skeleton Archer';

	attack = 100;
	fireAddAttack = 0;
	coldAddAttack = 0;
	lightningAddAttack = 0;
	armor = 50;
	evade = 5;
	block = 0;
	fireRes = 0;
	coldRes = 0;
	lightningRes = 0;
	attackSpeed = 1;
	critChance = 0;
	critDamage = 0;
	spellCritChance = 0;
	spellCritDamage = 0;

	get unitId(): number {
		return FourCC('h001');
	}
}
