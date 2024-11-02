import Tower from 'Towers/Abstract';
import InventoryButton from '../Buttons/Inventory';
import { printDebugMessage } from '../Utils/Debug';
import { Frame, Trigger } from 'w3ts';
import InitEngine from './Init';

export interface IItem {
	tower?: Tower;
}

export default class InventoryEngine {
	items!: Array<Array<IItem>>;

	inventory!: Array<Array<Frame>>;
	inventoryBackdrops!: Array<Array<Frame>>;
	inventoryTooltips!: Array<
		Array<{
			title: framehandle;
			text: framehandle;
		}>
	>;
	inventoryBack!: Array<Frame>;

	parent = new Frame(
		'InventoryFrame',
		Frame.fromHandle(BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)) as Frame,
		0,
		0,
		'FRAME',
		''
	);

	width = 8 as const;
	height = 8 as const;

	cellXStart = 0.314 as const;
	cellYStart = 0.45 as const;
	cellSize = 0.02 as const;
	cellGap = 0.005 as const;

	get cellWithGap(): number {
		return this.cellSize + this.cellGap;
	}

	emptyIcon =
		'ReplaceableTextures\\CommandButtonsDisabled\\DISnightelf-inventory-slotfiller';

	button!: InventoryButton;
	initEngine!: InitEngine;

	get size(): number {
		return this.width * this.height;
	}

	constructor(engine: InitEngine) {
		this.initEngine = engine;
		this.items = [];
		for (let index = 0; index < bj_MAX_PLAYERS; index++) {
			const items = [];
			for (let j = 0; j < this.size; j++) {
				items.push({});
			}
			this.items.push(items);
		}
	}

	start(): void {
		this.createInventory();

		this.button = new InventoryButton((index) => {
			BlzFrameSetVisible(
				this.inventoryBack[index].handle,
				!BlzFrameIsVisible(this.inventoryBack[index].handle)
			);
		});
	}

	createInventory(): void {
		this.inventory = [];
		this.inventoryBackdrops = [];
		this.inventoryBack = [];
		this.inventoryTooltips = [];

		for (let index = 0; index < bj_MAX_PLAYERS; index++) {
			const back = new Frame(
				'InventoryBack',
				this.parent,
				0,
				index,
				'BACKDROP',
				'EscMenuBackdrop'
			);
			BlzFrameSetSize(
				back.handle,
				this.cellWithGap * (this.width + 2),
				this.cellWithGap * (this.height + 2)
			);
			BlzFrameSetAbsPoint(
				back.handle,
				FRAMEPOINT_TOP,
				this.cellXStart + this.cellWithGap * 3.5,
				this.cellYStart + this.cellWithGap
			);
			BlzFrameSetVisible(back.handle, false);

			this.inventoryBack.push(back);

			const playerInventory: Array<Frame> = [];
			const playerInventoryBackDrops: Array<Frame> = [];
			const inventoryTooltips: Array<{
				title: framehandle;
				text: framehandle;
			}> = [];
			for (let h = 0; h < this.height; h++) {
				for (let w = 0; w < this.width; w++) {
					const ctx = h * this.width + w;
					const button = new Frame(
						`InventoryGridCell${index}`,
						this.inventoryBack[index],
						0,
						ctx,
						'BUTTON',
						'ScoreScreenTabButtonTemplate'
					);
					const buttonIconFrame = new Frame(
						`InventoryButtonBackdrop${index}`,
						button,
						0,
						ctx,
						'BACKDROP',
						''
					);
					const tooltipBox = BlzCreateFrame(
						'BoxedText',
						back.handle,
						0,
						ctx + 100
					) as framehandle;
					const tooltipTitle = BlzGetFrameByName(
						'BoxedTextTitle',
						ctx + 100
					) as framehandle;
					const tooltipText = BlzGetFrameByName(
						'BoxedTextValue',
						ctx + 100
					) as framehandle;

					BlzFrameSetAllPoints(buttonIconFrame.handle, button.handle);
					BlzFrameSetAbsPoint(
						button.handle,
						FRAMEPOINT_TOP,
						this.cellXStart + w * this.cellWithGap,
						this.cellYStart - h * this.cellWithGap
					);
					BlzFrameSetSize(
						button.handle,
						this.cellSize,
						this.cellSize
					);
					BlzFrameSetTexture(
						buttonIconFrame.handle,
						this.emptyIcon,
						0,
						false
					);

					BlzFrameSetTooltip(button.handle, tooltipBox);
					BlzFrameSetAbsPoint(
						tooltipBox,
						FRAMEPOINT_TOP,
						0.69,
						this.cellYStart + this.cellWithGap
					);
					BlzFrameSetSize(
						tooltipBox,
						0.2,
						this.cellWithGap * (this.height + 2)
					);
					BlzFrameSetText(tooltipTitle, 'Empty');
					BlzFrameSetText(tooltipText, '');
					BlzFrameSetEnable(tooltipText, false);
					BlzFrameSetEnable(tooltipTitle, false);

					const trigger = Trigger.create();
					trigger.triggerRegisterFrameEvent(
						button,
						FRAMEEVENT_CONTROL_CLICK
					);
					trigger.addAction(() => {
						const player = GetPlayerId(GetLocalPlayer());
						const trigger = GetPlayerId(
							GetTriggerPlayer() as player
						);

						if (player === trigger) {
							const id = GetHandleId(
								BlzGetTriggerFrame() as framehandle
							);
							const slot = this.inventory[player].findIndex(
								(i) => GetHandleId(i.handle) === id
							);

							if (slot >= 0) {
								this.selectItem(
									player,
									this.items[player][slot],
									slot
								);
							}
						}
					});
					playerInventory.push(button);
					playerInventoryBackDrops.push(buttonIconFrame);
					inventoryTooltips.push({
						title: tooltipTitle,
						text: tooltipText,
					});
				}
			}
			this.inventory.push(playerInventory);
			this.inventoryBackdrops.push(playerInventoryBackDrops);
			this.inventoryTooltips.push(inventoryTooltips);
		}
	}

	updateInventory(player: number): void {
		this.inventoryBackdrops[player].forEach((frame, index) => {
			const tower = this.items[player][index].tower;
			if (tower) {
				BlzFrameSetTexture(frame.handle, tower.icon, 0, false);
				BlzFrameSetText(
					this.inventoryTooltips[player][index].title,
					tower.name
				);
				BlzFrameSetText(
					this.inventoryTooltips[player][index].text,
					tower.tooltip
				);
			} else {
				BlzFrameSetTexture(frame.handle, this.emptyIcon, 0, false);
				BlzFrameSetText(
					this.inventoryTooltips[player][index].title,
					'Empty'
				);
				BlzFrameSetText(this.inventoryTooltips[player][index].text, '');
			}
		});
	}

	selectItem(player: number, item: IItem, index: number): void {
		if (item.tower) {
			this.initEngine.spawnTowerItem(player, item);
			this.removeItem(player, index);
			printDebugMessage(`player ${player}, item ${item.tower.icon}`);
		}
	}

	addItem(player: number, item: IItem): void {
		this.items[player].unshift(item);
		if (this.items[player].length > this.size) {
			this.items[player].splice(this.size);
		}

		this.updateInventory(player);
	}

	removeItem(player: number, index: number): void {
		this.items[player][index] = {};

		this.updateInventory(player);
	}
}
