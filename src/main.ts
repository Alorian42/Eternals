import { addScriptHook, W3TS_HOOK } from 'w3ts/hooks';
import InitEngine from './Engine/Init';

function tsMain() {
	const initEngine = new InitEngine();

	initEngine.start();
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);
