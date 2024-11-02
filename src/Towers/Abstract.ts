import { UnitStats } from '../Stats/Stats';
import { MapPlayer, Unit } from 'w3ts';
import { InventorySize } from '../types';
import {
	INVENTORY_SIZE_1,
	INVENTORY_SIZE_2,
	INVENTORY_SIZE_3,
	INVENTORY_SIZE_4,
	INVENTORY_SIZE_5,
	INVENTORY_SIZE_6,
} from '../Abilities/Inventory';
import AbstractUnit from 'Units/Abstract';

export default abstract class Tower extends AbstractUnit {
	icon = 'ReplaceableTextures\\CommandButtons\\BTNElvenGuardTower';

	inventorySize: InventorySize = 'A000';

	get tooltip(): string {
		return `      Physical Damage: ${this.attack}
      Fire Damage: ${this.fireAddAttack}
      Cold Damage: ${this.coldAddAttack}
      Ligtning Damage: ${this.lightningAddAttack}
      Attack Speed: ${this.attackSpeed}
      Critical Chance: ${this.critChance}%
      Critical Damage: ${this.critDamage}
      Spell Critical Chance: ${this.spellCritChance}%
      Spell Critical Damage: ${this.spellCritDamage}
      Inventory Size: ${this.inventorySizeNumber}`;
	}

	constructor(attackCooldown: number, inventorySize: InventorySize) {
		super();
		this.attackSpeed = attackCooldown;
		this.inventorySize = inventorySize;
	}

	fromUnit(unit: Unit): void {
		this.unit = unit;
		this.initTower();
	}

	createUnit(player: MapPlayer, x: number, y: number, face: number): void {
		this.unit = Unit.create(player, this.unitId, x, y, face) as Unit;

		this.initTower();
	}

	initTower(): void {
		this.setBaseTowerDamage(0);
		this.unit.setAttackCooldown(this.attackSpeed, 0);
		this.unit.invulnerable = true;
		this.unit.addAbility(FourCC(this.inventorySize));
	}

	setTowerDamage(damage: number): void {
		this.attack = damage;
	}

	setBaseTowerDamage(damage: number): void {
		this.unit.setBaseDamage(damage, 0);
		this.unit.setDiceNumber(1, 0);
		this.unit.setDiceSides(1, 0);
	}

	getTowerDamage(): number {
		return this.attack;
	}

	get buildAbility(): number {
		return FourCC('');
	}

	get inventorySizeNumber(): number {
		switch (this.inventorySize) {
			case INVENTORY_SIZE_1:
				return 1;
			case INVENTORY_SIZE_2:
				return 2;
			case INVENTORY_SIZE_3:
				return 3;
			case INVENTORY_SIZE_4:
				return 4;
			case INVENTORY_SIZE_5:
				return 5;
			case INVENTORY_SIZE_6:
				return 6;
			default:
				return 0;
		}
	}
}
