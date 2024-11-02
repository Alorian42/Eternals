import { InventorySize } from 'types';
import { MapPlayer, Unit } from 'w3ts';

export default abstract class Builder {
	unit!: Unit;
	inventorySize: InventorySize = 'A005';

	createUnit(player: MapPlayer, x: number, y: number, face: number): void {
		this.unit = Unit.create(player, this.unitId, x, y, face) as Unit;
		this.unit.invulnerable = true;
		this.unit.addAbility(FourCC(this.inventorySize));
		this.unit.nameProper = player.name;
	}
	get unitId(): number {
		return FourCC('B001');
	}
}
