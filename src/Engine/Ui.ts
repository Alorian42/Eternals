import { UnitStatsMap, UnitStatsNameMap } from '../Stats/Stats';
import { Timer, Trigger } from 'w3ts';
import InitEngine from './Init';

// Custom Stats by Tasyen
// https://www.hiveworkshop.com/threads/ui-3x3-custom-unit-stats.316905/

export default class UiEngine {
  unitAttackTextName = 'UnitAttackText';
  unitAttackTextTooltipName = 'UnitAttackTextTooltip';
  engine!: InitEngine;
  customStatSelectedUnit: {
    [key: string]: unit,
  } = {};
  boxS!: framehandle;
  boxF!: framehandle;
  count = 0;
  frames: Array<{
    frame: framehandle,
    frameIcon: framehandle,
    frameText: framehandle,
    frameHover: framehandle,
    tooltipBox: framehandle,
    tooltipTitle: framehandle,
    tooltipText: framehandle,
  }> = [];

  constructor(engine: InitEngine) {
    this.engine = engine;
  }

  start(): void {
    this.initUi();
  }

  initUi(): void {
    // Clearing old stat frames
    for (let index = 0; index < 5; index++) {
      this.customStatMoveOutOfScreen(BlzGetFrameByName('InfoPanelIconBackdrop', index));
    }

    this.customStatMoveOutOfScreen(BlzGetFrameByName('InfoPanelIconHeroIcon', 6));
    this.customStatMoveOutOfScreen(BlzGetFrameByName('InfoPanelIconAllyTitle', 7));
    this.customStatMoveOutOfScreen(BlzGetFrameByName('InfoPanelIconAllyGoldIcon', 7));

    const trigger = new Trigger();
    trigger.addAction(() => {
      this.customStatSelectedUnit[GetPlayerId(GetTriggerPlayer())] = GetTriggerUnit();
    });

    for (let index = 0; index < bj_MAX_PLAYER_SLOTS; index++) {
      TriggerRegisterPlayerSelectionEventBJ(trigger.handle, Player(index), true);
    }

    this.boxS = BlzCreateFrameByType('SIMPLEFRAME', 'CustomStatFrames.BoxSBoss', BlzGetFrameByName('SimpleUnitStatsPanel', 0), '', 0);
    this.boxF = BlzCreateFrameByType('FRAME', 'CustomStatFrames.BoxFBoss', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), '', 0);

    BlzLoadTOCFile('war3mapimported\\CustomStat.toc');
    BlzLoadTOCFile('war3mapimported\\BoxedText.toc');

    this.buildUi();
  }

  buildUi(): void {
    // @TODO: достать иконки из луа файла и сделать константами
    this.customStatAdd(udg_UnitStatIcon[this.count + 1], '');
    this.customStatAdd(udg_UnitStatIcon[this.count + 1], '');
    this.customStatAdd(udg_UnitStatIcon[this.count + 1], '');
    this.customStatAdd(udg_UnitStatIcon[this.count + 1], '');
    this.customStatAdd(udg_UnitStatIcon[this.count + 1], '');
    this.customStatAdd(udg_UnitStatIcon[this.count + 1], '');
    this.customStatAdd(udg_UnitStatIcon[this.count + 1], '');
    this.customStatAdd(udg_UnitStatIcon[this.count + 1], '');
    this.customStatAdd(udg_UnitStatIcon[this.count + 1], '');
    this.customStatAdd(udg_UnitStatIcon[this.count + 1], '');
    this.customStatAdd(udg_UnitStatIcon[this.count + 1], '');
    this.customStatAdd(udg_UnitStatIcon[this.count + 1], '');

    const timer = new Timer();
    timer.start(0.1, true, () => {
      this.customStatUpdate();
    });
  }

  customStatAdd(icon: string, text: string): void {
    this.count++;
    const fh = BlzCreateSimpleFrame('CustomStat', this.boxS, this.count);
    const tooltipBox = BlzCreateFrame('BoxedText', this.boxF, 0, this.count);
    const fhHover = BlzCreateFrameByType('FRAME', 'CustomStatHover', this.boxF, '', this.count);

    BlzFrameSetPoint(fhHover, FRAMEPOINT_BOTTOMLEFT, fh, FRAMEPOINT_BOTTOMLEFT, 0, 0);
    BlzFrameSetPoint(fhHover, FRAMEPOINT_TOPRIGHT, BlzGetFrameByName('CustomStatText', this.count), FRAMEPOINT_TOPRIGHT, 0, 0);
    BlzFrameSetTooltip(fhHover, tooltipBox);

    BlzFrameSetAbsPoint(tooltipBox, FRAMEPOINT_BOTTOM, 0.6, 0.2);
    BlzFrameSetSize(tooltipBox, 0.15, 0.08);

    BlzFrameSetText(BlzGetFrameByName('CustomStatText', this.count), text);
    BlzFrameSetText(BlzGetFrameByName('BoxedTextTitle', this.count), 'TooltipTitle');
    BlzFrameSetText(BlzGetFrameByName('BoxedTextValue', this.count), text);
    BlzFrameSetTexture(BlzGetFrameByName('CustomStatIcon', this.count), icon, 0, true);

    BlzFrameSetEnable(BlzGetFrameByName('BoxedTextValue', this.count), false);
    BlzFrameSetEnable(BlzGetFrameByName('BoxedTextTitle', this.count), false);

    if (this.count === 1) {
      BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPLEFT, 0.31, 0.08);
    } else if (this.count === 5) {
      BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPLEFT, 0.375, 0.08);
    } else if (this.count === 9) {
      BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPLEFT, 0.435, 0.08);
    } else {
      BlzFrameSetPoint(fh, FRAMEPOINT_TOPLEFT, BlzGetFrameByName('CustomStat', this.count - 1), FRAMEPOINT_BOTTOMLEFT, 0, 0);
    }

    this.frames.push({
      frame: fh,
      frameIcon: BlzGetFrameByName('CustomStatIcon', this.count),
      frameText: BlzGetFrameByName('CustomStatText', this.count),
      frameHover: fhHover,
      tooltipBox,
      tooltipTitle: BlzGetFrameByName('BoxedTextTitle', this.count),
      tooltipText: BlzGetFrameByName('BoxedTextValue', this.count),
    });
  }

  customStatUpdate(): void {
    const isVisible = BlzFrameIsVisible(this.boxS);
    let isUnit = false;
    if (isVisible) {
      const unitHandle = this.customStatSelectedUnit[GetPlayerId(GetLocalPlayer())];
      const unit = this.engine.findUnitById(GetHandleId(unitHandle));
      isUnit = !!unit;

      if (isUnit) {
        UnitStatsMap.forEach((stat, index) => {
          BlzFrameSetText(this.frames[index].frameText, unit[stat].toString());
          BlzFrameSetText(this.frames[index].tooltipTitle, UnitStatsNameMap[stat]);
          BlzFrameSetText(this.frames[index].tooltipText, unit[stat].toString()); // @todo calc dps, damage reduction, etc.
        });
      }
    }
    if (isUnit) {
      BlzFrameSetVisible(this.boxF, isVisible);
    }
  }

  customStatMoveOutOfScreen(frame: framehandle): void {
    BlzFrameClearAllPoints(frame);
    BlzFrameSetAbsPoint(frame, FRAMEPOINT_CENTER, 3, 0);
  }
}
