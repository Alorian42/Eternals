import { Trigger } from 'w3ts';
import { Players } from 'w3ts/globals';

export default class CommandsEngine {
	initCommands(): void {
		this.initZoomCommand();
	}

	initZoomCommand(): void {
		const trigger = new Trigger();
		Players.forEach((player) => {
			trigger.registerPlayerChatEvent(player, '-zoom', false);
		});

		trigger.addAction(() => {
			const player = GetTriggerPlayer() as player;
			const string = GetEventPlayerChatString()?.split(' ');
			if (string?.length === 2 && Number(string[1])) {
				const zoom = Number(string[1]);

				DisplayTextToPlayer(player, 0, 0, `Zoom set to ${zoom}`);
				SetCameraFieldForPlayer(
					player,
					CAMERA_FIELD_TARGET_DISTANCE,
					zoom + 2000,
					0
				);
			}
		});
	}
}
