import { UnitStatsMap, UnitStatsNameMap } from '../Stats/Stats';
import { Timer, Trigger } from 'w3ts';
import InitEngine from './Init';
import { printDebugMessage } from 'Utils/Debug';

// Custom Stats by Tasyen
// https://www.hiveworkshop.com/threads/ui-3x3-custom-unit-stats.316905/

export default class UiEngine {
	unitAttackTextName = 'UnitAttackText';
	unitAttackTextTooltipName = 'UnitAttackTextTooltip';
	engine!: InitEngine;
	customStatSelectedUnit: {
		[key: string]: unit;
	} = {};
	boxS!: framehandle;
	boxF!: framehandle;
	count = 0;
	frames: Array<{
		frame: framehandle;
		frameIcon: framehandle;
		frameText: framehandle;
		frameHover: framehandle;
		tooltipBox: framehandle;
		tooltipTitle: framehandle;
		tooltipText: framehandle;
	}> = [];

	constructor(engine: InitEngine) {
		this.engine = engine;
	}

	start(): void {
		BlzLoadTOCFile('war3mapimported\\CustomStat.toc');
		BlzLoadTOCFile('war3mapimported\\BoxedText.toc');
		this.initUi();
	}

	initUi(): void {
		// Clearing old stat frames
		for (let index = 0; index < 5; index++) {
			this.customStatMoveOutOfScreen(
				BlzGetFrameByName('InfoPanelIconBackdrop', index) as framehandle
			);
		}

		this.customStatMoveOutOfScreen(
			BlzGetFrameByName('InfoPanelIconHeroIcon', 6) as framehandle
		);
		this.customStatMoveOutOfScreen(
			BlzGetFrameByName('InfoPanelIconAllyTitle', 7) as framehandle
		);
		this.customStatMoveOutOfScreen(
			BlzGetFrameByName('InfoPanelIconAllyGoldIcon', 7) as framehandle
		);

		const trigger = Trigger.create();
		trigger.addAction(() => {
			this.customStatSelectedUnit[
				GetPlayerId(GetTriggerPlayer() as player)
			] = GetTriggerUnit() as unit;
		});

		for (let index = 0; index < bj_MAX_PLAYER_SLOTS; index++) {
			TriggerRegisterPlayerSelectionEventBJ(
				trigger.handle,
				Player(index) as player,
				true
			);
		}

		this.boxS = BlzCreateFrameByType(
			'SIMPLEFRAME',
			'CustomStatFrames.BoxSBoss',
			BlzGetFrameByName('SimpleUnitStatsPanel', 0) as framehandle,
			'',
			0
		) as framehandle;
		this.boxF = BlzCreateFrameByType(
			'FRAME',
			'CustomStatFrames.BoxFBoss',
			BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0) as framehandle,
			'',
			0
		) as framehandle;

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

		const timer = Timer.create();
		timer.start(0.1, true, () => {
			this.customStatUpdate();
		});
	}

	customStatAdd(icon: string, text: string): void {
		this.count++;
		const fh = BlzCreateSimpleFrame(
			'CustomStat',
			this.boxS,
			this.count
		) as framehandle;
		const tooltipBox = BlzCreateFrame(
			'BoxedText',
			this.boxF,
			0,
			this.count
		) as framehandle;
		const fhHover = BlzGetFrameByName(
			'CustomStatToolTip',
			this.count
		) as framehandle;

		BlzFrameSetTooltip(fh, fhHover);
		BlzFrameSetVisible(fhHover, false);

		BlzFrameSetVisible(tooltipBox, false);
		BlzFrameSetAbsPoint(tooltipBox, FRAMEPOINT_BOTTOM, 0.6, 0.2);
		BlzFrameSetSize(tooltipBox, 0.15, 0.08);

		BlzFrameSetText(
			BlzGetFrameByName('CustomStatText', this.count) as framehandle,
			text
		);
		BlzFrameSetText(
			BlzGetFrameByName('BoxedTextTitle', this.count) as framehandle,
			'TooltipTitle'
		);
		BlzFrameSetText(
			BlzGetFrameByName('BoxedTextValue', this.count) as framehandle,
			text
		);
		BlzFrameSetTexture(
			BlzGetFrameByName('CustomStatIcon', this.count) as framehandle,
			icon,
			0,
			true
		);

		BlzFrameSetEnable(
			BlzGetFrameByName('BoxedTextValue', this.count) as framehandle,
			false
		);
		BlzFrameSetEnable(
			BlzGetFrameByName('BoxedTextTitle', this.count) as framehandle,
			false
		);

		if (this.count === 1) {
			BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPLEFT, 0.31, 0.08);
		} else if (this.count === 5) {
			BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPLEFT, 0.375, 0.08);
		} else if (this.count === 9) {
			BlzFrameSetAbsPoint(fh, FRAMEPOINT_TOPLEFT, 0.435, 0.08);
		} else {
			BlzFrameSetPoint(
				fh,
				FRAMEPOINT_TOPLEFT,
				BlzGetFrameByName('CustomStat', this.count - 1) as framehandle,
				FRAMEPOINT_BOTTOMLEFT,
				0,
				0
			);
		}

		this.frames.push({
			frame: fh as framehandle,
			frameIcon: BlzGetFrameByName(
				'CustomStatIcon',
				this.count
			) as framehandle,
			frameText: BlzGetFrameByName(
				'CustomStatText',
				this.count
			) as framehandle,
			frameHover: fhHover as framehandle,
			tooltipBox: tooltipBox as framehandle,
			tooltipTitle: BlzGetFrameByName(
				'BoxedTextTitle',
				this.count
			) as framehandle,
			tooltipText: BlzGetFrameByName(
				'BoxedTextValue',
				this.count
			) as framehandle,
		});
	}

	customStatUpdate(): void {
		const isVisible = BlzFrameIsVisible(this.boxS);
		const unitHandle =
			this.customStatSelectedUnit[GetPlayerId(GetLocalPlayer())];
		const unit = this.engine.findUnitById(GetHandleId(unitHandle));
		const isUnit = !!unit;

		if (isUnit) {
			BlzFrameSetVisible(this.boxS, true);
			BlzFrameSetVisible(this.boxF, isVisible);
			UnitStatsMap.forEach((stat, index) => {
				BlzFrameSetText(
					this.frames[index].frameText,
					unit.getStatValue(stat).toString()
				);
				BlzFrameSetText(
					this.frames[index].tooltipTitle,
					UnitStatsNameMap[stat]
				);
				BlzFrameSetText(
					this.frames[index].tooltipText,
					unit.getStatDescription(stat)
				); // @todo calc dps, damage reduction, etc.
				BlzFrameSetVisible(
					this.frames[index].tooltipBox,
					BlzFrameIsVisible(this.frames[index].frameHover)
				);
			});
		} else {
			BlzFrameSetVisible(this.boxS, false);
		}
	}

	customStatMoveOutOfScreen(frame: framehandle): void {
		BlzFrameClearAllPoints(frame);
		BlzFrameSetAbsPoint(frame, FRAMEPOINT_CENTER, 3, 0);
	}
}
