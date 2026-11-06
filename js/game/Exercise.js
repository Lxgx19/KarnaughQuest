/** Un ejercicio: una función, los grupos del jugador y la lógica de evaluación. */
class Exercise {
  #fn; #simplifier; #groups = []; #solved = false; #seed;
  constructor(fn, seed = null) { this.#seed = seed; this.#fn = fn; this.#simplifier = new Simplifier(fn); }

  get fn() { return this.#fn; }
  get seed() { return this.#seed; }
  get groups() { return [...this.#groups]; }
  get solved() { return this.#solved; }
  get solution() { return this.#simplifier.solve(); }
  get expression() { return this.#groups.length ? this.#groups.map(g => g.expression).join(' + ') : '0'; }

  addGroup(cells) {
    const v = GroupValidator.validate(this.#fn, cells);
    if (!v.ok) return v;
    const g = new Group(this.#fn.n, cells);
    if (this.#groups.some(o => o.cube.equals(g.cube))) return { ok: false, reason: 'Ya agregaste ese grupo.' };
    this.#groups.push(g);
    return { ok: true, reason: 'Grupo agregado: ' + g.expression };
  }

  removeGroup(i) { this.#groups.splice(i, 1); }

  /** Pista: el grupo de una solución óptima que cubre la primera celda sin cubrir. */
  hint() {
    const x = this.#fn.minterms.find(m => !this.#groups.some(g => g.cube.covers(m)));
    if (x === undefined) return null;
    const cube = this.solution.best.find(c => c.covers(x));
    const cells = [...Array(this.#fn.size).keys()].filter(m => cube.covers(m));
    return { cells, expression: cube.toString() };
  }

  evaluate() {
    const miss = this.#fn.minterms.filter(x => !this.#groups.some(g => g.cube.covers(x)));
    if (miss.length) return { ok: false, message: 'Faltan celdas por cubrir: m' + miss.join(', m') };
    const big = this.#groups.find(g => !this.#simplifier.isPrime(g.cube));
    if (big) return { ok: false, message: `El grupo ${big.expression} se puede hacer más grande.` };
    const s = this.solution, lit = this.#groups.reduce((t, g) => t + g.cube.literals, 0);
    if (this.#groups.length > s.groups) return { ok: false, message: 'Cubre todo, pero existe una solución con menos grupos.' };
    if (lit > s.literals) return { ok: false, message: 'Cubre todo con los grupos justos, pero hay una forma con menos literales.' };
    this.#solved = true;
    return { ok: true, message: `¡Correcto! Expresión mínima: ${s.expression}` };
  }
}
