import { UnitStats } from '../Stats/Stats';
import { Unit } from 'w3ts';
import Enemy from './Enemy';

export default class SkeletonWarrior extends Enemy implements UnitStats {
	name = 'Skeleton Warrior';

	attack = 100;
	fireAddAttack = 0;
	coldAddAttack = 0;
	lightningAddAttack = 0;
	armor = 100;
	evade = 2;
	block = 5;
	fireRes = 10;
	coldRes = 10;
	lightningRes = 10;
	attackSpeed = 1;
	critChance = 0;
	critDamage = 0;
	spellCritChance = 0;
	spellCritDamage = 0;

	get unitId(): number {
		return FourCC('h000');
	}
}
