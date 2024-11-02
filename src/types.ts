import Enemy from './Units/Enemy';
import BasicTower from 'Towers/Basic';
export interface IPoint {
	x: number;
	y: number;
}

export interface IEnemy {
	new (x: number, y: number, face: number): Enemy;
}

export interface ITower {
	new (): BasicTower;
}

export type InventorySize = 'A000' | 'A001' | 'A002' | 'A003' | 'A004' | 'A005';
