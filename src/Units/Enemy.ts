import { UnitStats } from '../Stats/Stats';
import { Unit } from 'w3ts';
import { Players } from 'w3ts/globals';
import Tower from '../Towers/Abstract';

export default class Enemy implements UnitStats {
  unit!: Unit;
  name = 'Basic Enemy';

  attack = 100;
  fireAddAttack = 0;
  coldAddAttack = 0;
  lightningAddAttack = 0;
  armor = 100;
  evade = 200;
  block = 10;
  fireRes = 10;
  coldRes = 10;
  lightningRes = 10;
  attackSpeed = 1;
  critChance = 0;
  critDamage = 0;
  spellCritChance = 0;
  spellCritDamage = 0;

  constructor(x: number, y: number, face: number) {
    this.unit = new Unit(Players[11], this.unitId, x, y, face);
  }

  move(x: number, y: number): void {
    IssuePointOrder(this.unit.handle, 'move', x, y);
  }

  receiveDamage(tower: Tower): void {
    // @TODO calculate incoming damage
    const outcomingDamage = tower.attack;
    const unitLife = GetUnitStateSwap(UNIT_STATE_LIFE, this.unit.handle);
    print('outcomingDamage:', outcomingDamage);
    print('unitLife:', unitLife);
    SetUnitLifeBJ(this.unit.handle, unitLife - outcomingDamage);
  }

  get unitId(): number {
    return FourCC('hfoo');
  }
}
