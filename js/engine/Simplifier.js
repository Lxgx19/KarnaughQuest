/** Motor de simplificación: implicantes primos y cobertura mínima (SOP). */
class Simplifier {
  #fn; #solution = null;
  constructor(fn) { this.#fn = fn; }

  /** Devuelve { primes, best, groups, literals, expression }. Se calcula una sola vez. */
  solve() { return (this.#solution ??= this.#compute()); }
  isPrime(cube) { return this.solve().primes.some(p => p.equals(cube)); }

  #implicants() {
    const { n, size } = this.#fn, all = [...Array(size).keys()], out = [];
    for (let m = 0; m < size; m++)
      for (let v = m; ; v = (v - 1) & m) { // todos los subconjuntos de m
        const c = new Cube(n, m, v);
        if (!all.some(x => c.covers(x) && !this.#fn.isOne(x))) out.push(c);
        if (!v) break;
      }
    return out;
  }

  #compute() {
    const imp = this.#implicants();
    const primes = imp.filter(c => !imp.some(d => !d.equals(c) && d.contains(c)));
    const ones = this.#fn.minterms;
    let best = null, cost = [Infinity, Infinity];
    for (let k = 1; k < 1 << primes.length; k++) {
      const cs = primes.filter((_, i) => k >> i & 1);
      if (!ones.every(x => cs.some(c => c.covers(x)))) continue;
      const c = [cs.length, cs.reduce((s, q) => s + q.literals, 0)];
      if (c[0] < cost[0] || (c[0] === cost[0] && c[1] < cost[1])) { best = cs; cost = c; }
    }
    return { primes, best, groups: cost[0], literals: cost[1], expression: best.join(' + ') };
  }
}
