import { Frame, Trigger } from 'w3ts';
export default class StartWaveButton {
	callback!: (
		this: StartWaveButton,
		playerIndex: number,
		button: Frame
	) => void;
	buttons: Array<Frame> = [];

	constructor(
		callback: (
			this: StartWaveButton,
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
				'StartWaveButton',
				Frame.fromHandle(
					BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)
				) as Frame,
				0,
				index,
				'BUTTON',
				'ScoreScreenTabButtonTemplate'
			);
			const buttonIconFrame = new Frame(
				'StartWaveButtonBackdrop',
				button,
				0,
				index,
				'BACKDROP',
				''
			);
			BlzFrameSetAllPoints(buttonIconFrame.handle, button.handle);
			BlzFrameSetAbsPoint(button.handle, FRAMEPOINT_CENTER, 0.03, 0.18);
			BlzFrameSetSize(button.handle, 0.03, 0.03);
			BlzFrameSetTexture(
				buttonIconFrame.handle,
				'ReplaceableTextures\\CommandButtons\\BTNReplay-Play',
				0,
				false
			);
			BlzFrameSetVisible(
				button.handle,
				GetPlayerId(GetLocalPlayer()) === index
			);

			const trigger = new Trigger();
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
