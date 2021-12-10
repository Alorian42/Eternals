export default class WaveEngine {
  getModifier(x: number): number {
    return Math.log(x) * x + 1;
  }
}
