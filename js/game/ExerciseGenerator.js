/** Fábrica de ejercicios reproducibles: la misma semilla genera la misma función. */
class ExerciseGenerator {
  #density;
  constructor(density = 0.5) { this.#density = density; }
  generate(n, seed = SeededRandom.newSeed()) {
    const rng = new SeededRandom(seed);
    let bits;
    do { bits = Array.from({ length: 1 << n }, () => (rng.next() < this.#density ? 1 : 0)); }
    while (!bits.includes(1) || !bits.includes(0));
    return new Exercise(new BooleanFunction(n, bits), seed);
  }
}
