import Tower from 'Towers/Abstract';
import InventoryButton from '../Buttons/Inventory';
import { printDebugMessage } from '../Utils/Debug';

interface IItem {
  tower?: Tower
}

export default class InventoryEngine {
  items!: Array<Array<IItem>>;

  size = 64;

  emptyIcon = 'ReplaceableTextures\\CommandButtonsDisabled\\DISnightelf-inventory-slotfiller';

  button!: InventoryButton;

  constructor() {
    this.items = [];
    for (let index = 0; index < bj_MAX_PLAYERS; index++) {
      const items = [];
      for (let j = 0; j < this.size; j++) {
        items.push({});
      }
      this.items.push(items);
    }

    this.button = new InventoryButton((index, button) => {
      // @TODO show invenotry
      printDebugMessage(`Show inventory for player ${index}`);
    });
  }
}
