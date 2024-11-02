export interface UnitStats {
	attack: number;
	armor: number;
	evade: number;
	block: number;
	fireRes: number;
	coldRes: number;
	lightningRes: number;
	attackSpeed: number;
	critChance: number;
	critDamage: number;
	spellCritChance: number;
	spellCritDamage: number;
	fireAddAttack: number;
	coldAddAttack: number;
	lightningAddAttack: number;
	get attackTotal(): number;
}

export const UnitStatsMap: Array<keyof UnitStats> = [
	'attack',
	'attackSpeed',
	'critChance',
	'critDamage',
	'spellCritChance',
	'spellCritDamage',
	'armor',
	'evade',
	'block',
	'fireRes',
	'coldRes',
	'lightningRes',
];

export const UnitStatsNameMap: {
	[key: string]: string;
} = {
	attack: 'Attack',
	armor: 'Armor',
	evade: 'Evade',
	block: 'Block',
	fireRes: 'Fire Resistance',
	coldRes: 'Cold Resistance',
	lightningRes: 'Lightning Resistance',
	attackSpeed: 'Attack Speed',
	critChance: 'Critical Chance',
	critDamage: 'Critical Damage',
	spellCritChance: 'Spell Critical Chance',
	spellCritDamage: 'Spell Critical Damage',
};
