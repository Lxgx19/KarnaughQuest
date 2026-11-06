/** Función booleana de n variables definida por su tabla de verdad. */
class BooleanFunction {
  #n; #bits;
  constructor(n, bits) { this.#n = n; this.#bits = [...bits]; }
  get n() { return this.#n; }
  get size() { return 1 << this.#n; }
  get variables() { return 'ABCD'.slice(0, this.#n); }
  get minterms() { return this.#bits.flatMap((b, i) => (b ? [i] : [])); }
  isOne(x) { return this.#bits[x] === 1; }
  toString() { return `F(${[...this.variables].join(',')}) = Σm(${this.minterms.join(', ')})`; }
}
