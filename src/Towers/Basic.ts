import { MapPlayer, Unit } from 'w3ts';
import { INVENTORY_SIZE_3 } from '../Abilities/Inventory';
import Tower from './Abstract';

export default class BasicTower extends Tower {
  unit!: Unit;
  attack = 35;

  constructor(player: MapPlayer, x: number, y: number, face: number) {
    super(player, x, y, face, 200, 0.3, INVENTORY_SIZE_3);
  }

  get unitId(): number {
    return FourCC('t001');
  }
}