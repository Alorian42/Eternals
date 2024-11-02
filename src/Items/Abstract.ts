import { Item } from 'w3ts';
import Tower from '../Towers/Abstract';
import { printDebugMessage } from 'Utils/Debug';

export default abstract class AbstractItem {
	item!: Item;

	constructor(x: number, y: number) {
		this.item = Item.create(this.itemId, x, y) as Item;

		this.item.name = this.name;
		this.item.description = this.description;
		this.item.tooltip = this.description;
		this.item.extendedTooltip = this.description;
	}

	get itemId(): number {
		return FourCC('');
	}

	get name(): string {
		return '';
	}

	get description(): string {
		return '';
	}

	abstract onPickup(tower: Tower): void;

	abstract onDrop(tower: Tower): void;
}
