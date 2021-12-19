import { UnitStats } from '../Stats/Stats';
import { MapPlayer, Unit } from 'w3ts';
import { InventorySize } from '../types';

export default abstract class Tower implements UnitStats {
  unit!: Unit;
  name!: string;
  icon = 'ReplaceableTextures\\CommandButtons\\BTNElvenGuardTower';

  attack = 0;
  fireAddAttack = 0;
  coldAddAttack = 0;
  lightningAddAttack = 0;
  armor = 0;
  evade = 0;
  block = 0;
  fireRes = 0;
  coldRes = 0;
  lightningRes = 0;
  attackSpeed = 0;
  critChance = 0;
  critDamage = 0;
  spellCritChance = 0;
  spellCritDamage = 0;

  constructor(player: MapPlayer, x: number, y: number, face: number, attackCooldown: number, inventorySize: InventorySize) {
    this.unit = new Unit(player, this.unitId, x, y, face);
    this.setBaseTowerDamage(0);
    this.unit.setAttackCooldown(attackCooldown, 0);
    this.unit.invulnerable = true;
    this.unit.addAbility(FourCC(inventorySize));
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

  get unitId(): number {
    return FourCC('t001');
  }
}
