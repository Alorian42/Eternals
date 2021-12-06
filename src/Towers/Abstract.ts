import { MapPlayer, Unit } from 'w3ts';
import { InventorySize } from '../types';

export default abstract class Tower {
  unit!: Unit;
  attack = 35;

  constructor(player: MapPlayer, x: number, y: number, face: number, attackDamage: number, attackCooldown: number, inventorySize: InventorySize) {
    this.unit = new Unit(player, this.unitId, x, y, face);
    this.setTowerDamage(attackDamage);
    this.unit.setAttackCooldown(attackCooldown, 0);
    this.unit.invulnerable = true;
    this.unit.addAbility(FourCC(inventorySize));
  }

  setTowerDamage(damage: number): void {
    this.unit.setBaseDamage(damage - 1, 0);
    this.unit.setDiceNumber(1, 0);
    this.unit.setDiceSides(1, 0);
  }

  getTowerDamage(): number {
    return this.unit.getBaseDamage(0) + 1;
  }

  get unitId(): number {
    return FourCC('t001');
  }
}
