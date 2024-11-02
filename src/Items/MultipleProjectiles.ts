import AbstractItem from './Abstract';
import Tower from '../Towers/Abstract';

export default class MultipleProjectiles extends AbstractItem {
	constructor(x: number, y: number) {
		super(x, y);
	}

	get itemId(): number {
		return FourCC('I000');
	}

	get name(): string {
		return 'Multiple Projectiles Gem';
	}

	get description(): string {
		return 'Increases projectile count by 1';
	}

	onPickup(tower: Tower): void {
		tower.unit.addAbility(FourCC('A009'));
	}

	onDrop(tower: Tower): void {
		tower.unit.removeAbility(FourCC('A009'));
	}
}
