import { Item } from 'w3ts';
import Tower from '../Towers/Abstract';

export default abstract class AbstractItem {
	item!: Item;

	constructor(x: number, y: number) {
		this.item = new Item(this.itemId, x, y);
	}

	get itemId(): number {
		return FourCC('');
	}

	abstract onPickup(tower: Tower): void;

	abstract onDrop(tower: Tower): void;
}
