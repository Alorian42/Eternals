import { Unit } from 'w3ts';
import { INVENTORY_SIZE_3 } from '../Abilities/Inventory';
import Tower from './Abstract';

export default class BasicTower extends Tower {
  unit!: Unit;
  name = 'Basic Tower';
  icon = 'ReplaceableTextures\\CommandButtons\\BTNBookOfSummoning';

  attack = 100;
  armor = 0;
  evade = 0;
  block = 0;
  fireRes = 0;
  coldRes = 0;
  lightningRes = 0;
  attackSpeed = 1;
  critChance = 0;
  critDamage = 0;
  spellCritChance = 0;
  spellCritDamage = 0;

  constructor() {
    super(1, INVENTORY_SIZE_3);
  }

  get unitId(): number {
    return FourCC('t001');
  }
}
