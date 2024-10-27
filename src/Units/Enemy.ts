import { UnitStats } from '../Stats/Stats';
import { Timer, Unit } from 'w3ts';
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
    SetUnitLifeBJ(this.unit.handle, unitLife - outcomingDamage);

    // @TODO ???
    // tower.unit.damageTarget(this.unit, outcomingDamage);

    // @TODO create damage engine
    const tag = CreateTextTagUnitBJ(`${outcomingDamage}`, this.unit.handle, 0, 8, 100, 100, 100, 1);

	if (!tag) return;

    SetTextTagVelocityBJ(tag, 75, 90);

    const timer = new Timer();
    timer.start(0.7, false, () => {
      timer.destroy();
      DestroyTextTagBJ(tag);
    });
  }

  setLife(life: number): void {
    this.unit.maxLife = Math.floor(life);
    SetUnitLifePercentBJ(this.unit.handle, 100);
  }

  setName(name: string): void {
    this.unit.name = name;
  }

  get unitId(): number {
    return FourCC('h000');
  }
}
