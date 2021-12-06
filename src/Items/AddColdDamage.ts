import AbstractItem from './Abstract';
import Tower from '../Towers/Abstract';

export default class AddColdDamageGem extends AbstractItem {
  bonusDamage = 100;

  constructor(x: number, y: number) {
    super(x, y);
  }

  get itemId(): number {
    return FourCC('I000');
  }

  onPickup(tower: Tower): void {
    const damage = tower.getTowerDamage();
    tower.setTowerDamage(damage + this.bonusDamage);
  }

  onDrop(tower: Tower): void {
    const damage = tower.getTowerDamage();
    tower.setTowerDamage(damage - this.bonusDamage);
  }
}
