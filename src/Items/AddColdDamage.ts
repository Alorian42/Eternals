import AbstractItem from './Abstract';
import Tower from '../Towers/Abstract';

export default class AddColdDamageGem extends AbstractItem {
	bonusDamage = 100;

	constructor(x: number, y: number) {
		super(x, y);
	}

	get itemId(): number {
		return FourCC('I000');
	}

	get name(): string {
		return 'Add Cold Damage Gem';
	}

	get description(): string {
		return 'Increases cold attack by 100';
	}

	onPickup(tower: Tower): void {
		tower.coldAddAttack += this.bonusDamage;
	}

	onDrop(tower: Tower): void {
		tower.coldAddAttack -= this.bonusDamage;
	}
}
