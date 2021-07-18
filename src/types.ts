import Enemy from './Units/Enemy';
export interface IPoint {
  x: number,
  y: number,
}

export interface IEnemy {
    new (x: number, y: number, face: number): Enemy;
}
