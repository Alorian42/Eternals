import Tower from 'Towers/Abstract';
import InventoryButton from '../Buttons/Inventory';
import { printDebugMessage } from '../Utils/Debug';
import { Frame, Trigger } from 'w3ts';

interface IItem {
  tower?: Tower
}

export default class InventoryEngine {
  items!: Array<Array<IItem>>;

  inventory!: Array<Array<Frame>>;
  inventoryBack!: Array<Frame>;

  width = 8 as const;
  height = 8 as const;

  cellXStart = 0.314 as const;
  cellYStart = 0.5 as const;
  cellSize = 0.02 as const;
  cellGap = 0.005 as const;

  get cellWithGap(): number {
    return this.cellSize + this.cellGap;
  }

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

    this.createInventory();

    this.button = new InventoryButton((index) => {
      BlzFrameSetVisible(this.inventoryBack[index].handle, !BlzFrameIsVisible(this.inventoryBack[index].handle));
    });
  }

  createInventory(): void {
    this.inventory = [];
    this.inventoryBack = [];
    const parent = Frame.fromHandle(BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0));
    for (let index = 0; index < bj_MAX_PLAYERS; index++) {
      const back = new Frame('InventoryBack', parent, 0, index, 'BACKDROP', 'EscMenuBackdrop');
      BlzFrameSetSize(back.handle, this.cellWithGap * (this.width + 2), this.cellWithGap * (this.height + 2));
      BlzFrameSetAbsPoint(back.handle, FRAMEPOINT_TOP, this.cellXStart + this.cellWithGap * 3.5, this.cellYStart + this.cellWithGap);
      BlzFrameSetVisible(back.handle, false);

      this.inventoryBack.push(back);

      const playerInventory: Array<Frame> = [];
      for (let h = 0; h < this.height; h++) {
        for (let w = 0; w < this.width; w++) {
          const button = new Frame(`InventoryGridCell${index}`, this.inventoryBack[index], 0, h * this.width + w, 'BUTTON', 'ScoreScreenTabButtonTemplate');
          const buttonIconFrame = new Frame('InventoryButtonBackdrop', button, 0, index, 'BACKDROP', '');
          BlzFrameSetAllPoints(buttonIconFrame.handle, button.handle);
          BlzFrameSetAbsPoint(button.handle, FRAMEPOINT_TOP, this.cellXStart + w * this.cellWithGap, this.cellYStart - h * this.cellWithGap);
          BlzFrameSetSize(button.handle, this.cellSize, this.cellSize);
          BlzFrameSetTexture(buttonIconFrame.handle, this.emptyIcon, 0, false);
          // BlzFrameSetVisible(button.handle, false);

          const trigger = new Trigger();
          trigger.triggerRegisterFrameEvent(button, FRAMEEVENT_CONTROL_CLICK);
          trigger.addAction(() => {
            const player = GetPlayerId(GetLocalPlayer());
            const trigger = GetPlayerId(GetTriggerPlayer());

            if (player === trigger) {
              const id = GetHandleId(BlzGetTriggerFrame());
              const slot = this.inventory[player].findIndex(i => GetHandleId(i.handle) === id);

              if (slot >= 0) {
                printDebugMessage(`${player} clicked on ${slot}`);
                this.selectItem(player, this.items[player][slot]);

              }
            }
          });
          playerInventory.push(button);
        }
      }
      this.inventory.push(playerInventory);
    }
  }

  selectItem(player: number, item: IItem): void {
    if (!item.tower) {
      printDebugMessage(`Empty slot for player ${player}`);
    } else {
      printDebugMessage(`player ${player}, item ${item.tower.icon}`);
    }
  }

  get size(): number {
    return this.width * this.height;
  }
}
