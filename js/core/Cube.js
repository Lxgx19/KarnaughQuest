/**
 * Cubo = grupo de celdas de un K-map (implicante).
 * mask: bits de las variables que cuentan; value: su valor en el grupo.
 */
class Cube {
  #n; #m; #v;
  constructor(n, mask, value) { this.#n = n; this.#m = mask; this.#v = value & mask; }

  /** Menor cubo que contiene todas las celdas dadas. */
  static fromMinterms(n, cells) {
    const full = (1 << n) - 1;
    let and = full, or = 0;
    for (const x of cells) { and &= x; or |= x; }
    return new Cube(n, full & ~(or ^ and), and);
  }

  get mask() { return this.#m; }
  get value() { return this.#v; }
  get literals() { return this.#m.toString(2).replace(/0/g, '').length; }
  get size() { return 1 << (this.#n - this.literals); }
  covers(x) { return (x & this.#m) === this.#v; }
  equals(o) { return this.#m === o.mask && this.#v === o.value; }
  /** true si este cubo es igual o más grande y contiene a `o`. */
  contains(o) { return (this.#m & o.mask) === this.#m && (o.value & this.#m) === this.#v; }

  toString() {
    let s = '';
    for (let i = this.#n - 1; i >= 0; i--)
      if (this.#m >> i & 1) s += 'ABCD'[this.#n - 1 - i] + (this.#v >> i & 1 ? '' : "'");
    return s || '1';
  }
}
