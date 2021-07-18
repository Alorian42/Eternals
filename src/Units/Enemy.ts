import { Unit } from 'w3ts';
import { Players } from 'w3ts/globals';

export default class Enemy {
  unit!: Unit;
  constructor(x: number, y: number, face: number) {
    this.unit = new Unit(Players[11], this.unitId, x, y, face);
  }

  move(x: number, y: number): void {
    IssuePointOrder(this.unit.handle, 'move', x, y);
  }

  get unitId(): number {
    return FourCC('hfoo');
  }
}
