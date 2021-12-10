import { Frame, Trigger } from 'w3ts';
export default class StartWaveButton {
  callback!: (this: any, playerIndex: number) => void;

  constructor(callback: (this: any, playerIndex: number) => void) {
    this.callback = callback;
    this.init();
  }

  init(): void {
    const button = new Frame('MyIconButton', Frame.fromHandle(BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)), 0, 0, 'BUTTON', 'ScoreScreenTabButtonTemplate');
    const buttonIconFrame = new Frame('MyIconButtonIcon', button, 0, 0, 'BACKDROP', '');
    BlzFrameSetAllPoints(buttonIconFrame.handle, button.handle);
    BlzFrameSetAbsPoint(button.handle, FRAMEPOINT_CENTER, 0.03, 0.18);
    BlzFrameSetSize(button.handle, 0.03, 0.03);
    BlzFrameSetTexture(buttonIconFrame.handle, 'ReplaceableTextures\\CommandButtons\\BTNReplay-Play', 0, false);

    const trigger = new Trigger();
    trigger.triggerRegisterFrameEvent(button as Frame, FRAMEEVENT_CONTROL_CLICK);
    trigger.addAction(() => {
      const player = GetTriggerPlayer();
      this.callback(GetPlayerId(player));
    });
  }
}
