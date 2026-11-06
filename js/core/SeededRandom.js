/** Aleatorio con semilla (mulberry32): misma semilla = mismo ejercicio en todos los clientes. */
class SeededRandom {
  #s;
  constructor(seed) { this.#s = seed >>> 0; }
  static newSeed() { return Math.floor(Math.random() * 2 ** 32); }
  next() {
    let t = (this.#s += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
