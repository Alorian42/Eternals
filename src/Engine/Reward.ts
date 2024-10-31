import Tower from '../Towers/Abstract';
import BasicTower from '../Towers/Basic';

export default class RewardEngine {
	static generateReward(wave: number): Array<Tower> {
		const tower = new BasicTower();
		tower.attack = wave * 100;

		return [tower];
	}
}
