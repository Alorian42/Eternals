import { Frame, Trigger } from 'w3ts';
export default class InventoryButton {
	callback!: (
		this: InventoryButton,
		playerIndex: number,
		button: Frame
	) => void;
	buttons: Array<Frame> = [];

	constructor(
		callback: (
			this: InventoryButton,
			playerIndex: number,
			button: Frame
		) => void
	) {
		this.callback = callback;
		this.init();
	}

	init(): void {
		for (let index = 0; index < bj_MAX_PLAYERS; index++) {
			const button = new Frame(
				'InventoryButton',
				Frame.fromHandle(
					BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)
				) as Frame,
				0,
				index,
				'BUTTON',
				'ScoreScreenTabButtonTemplate'
			);
			const buttonIconFrame = new Frame(
				'InventoryButtonBackdrop',
				button,
				0,
				index,
				'BACKDROP',
				''
			);
			BlzFrameSetAllPoints(buttonIconFrame.handle, button.handle);
			BlzFrameSetAbsPoint(button.handle, FRAMEPOINT_CENTER, 0.77, 0.18);
			BlzFrameSetSize(button.handle, 0.03, 0.03);
			BlzFrameSetTexture(
				buttonIconFrame.handle,
				'ReplaceableTextures\\CommandButtons\\BTNDust',
				0,
				false
			);
			BlzFrameSetVisible(
				button.handle,
				GetPlayerId(GetLocalPlayer()) === index
			);

			const trigger = Trigger.create();
			trigger.triggerRegisterFrameEvent(button, FRAMEEVENT_CONTROL_CLICK);
			trigger.addAction(() => {
				const player = GetPlayerId(GetLocalPlayer());
				const trigger = GetPlayerId(GetTriggerPlayer() as player);

				if (player === trigger) {
					this.callback(player, this.buttons[player]);
				}
			});
			this.buttons.push(button);
		}
	}
}
