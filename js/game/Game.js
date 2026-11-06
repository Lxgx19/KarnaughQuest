/** Modelo central. Emite 'change', 'message' y 'solved'; las vistas y Match se suscriben. */
class Game extends EventEmitter {
  #generator; #player; #clock; #n = 4; #exercise; #selection = new Set();
  #startedAt; #endedAt = null; #hints = 0; #revealed = false;

  constructor(generator, player, clock = () => Date.now()) {
    super(); this.#generator = generator; this.#player = player; this.#clock = clock;
    this.#start(SeededRandom.newSeed());
  }

  get player() { return this.#player; }
  get n() { return this.#n; }
  get exercise() { return this.#exercise; }
  get selection() { return new Set(this.#selection); }
  get points() { return this.#player.points; }
  get record() { return this.#player.record; }
  get elapsed() { return (this.#endedAt ?? this.#clock()) - this.#startedAt; }

  #start(seed) {
    this.#exercise = this.#generator.generate(this.#n, seed);
    this.#selection = new Set(); this.#startedAt = this.#clock();
    this.#endedAt = null; this.#hints = 0; this.#revealed = false;
  }
  #notify(text = '', type = '') { this.emit('change'); this.emit('message', { text, type }); }

  setVariables(n, seed = SeededRandom.newSeed()) { this.#n = n; this.#start(seed); this.#notify(); }
  newExercise() { this.setVariables(this.#n); }
  toggleCell(x) { this.#selection.has(x) ? this.#selection.delete(x) : this.#selection.add(x); this.emit('change'); }
  clearSelection() { this.#selection = new Set(); this.emit('change'); }
  removeGroup(i) { this.#exercise.removeGroup(i); this.emit('change'); }

  addGroup() {
    const r = this.#exercise.addGroup([...this.#selection]);
    if (r.ok) this.#selection = new Set();
    this.#notify(r.reason, r.ok ? 'ok' : 'bad');
  }

  hint() {
    if (this.#exercise.solved) return;
    const h = this.#exercise.hint();
    if (!h) return this.#notify('Ya cubres todas las celdas. Pulsa «Comprobar».', 'ok');
    this.#hints++; this.#selection = new Set(h.cells);
    this.#notify(`Pista: agrupa las celdas marcadas (m${h.cells.join(', m')}). Cuesta 2 puntos.`, 'ok');
  }

  /** Puntos: 10 + bonus de velocidad (hasta 5, -1 cada 10 s) - 2 por pista; mínimo 1. */
  check() {
    const ex = this.#exercise;
    if (ex.solved) return this.#notify('Ya resolviste este ejercicio. Pulsa «Nuevo ejercicio».', 'ok');
    const r = ex.evaluate();
    if (!r.ok) return this.#notify(r.message, 'bad');
    this.#endedAt = this.#clock();
    if (this.#revealed) return this.#notify(r.message + ' (sin puntos: viste la solución)', 'ok');
    const secs = Math.floor(this.elapsed / 1000);
    const gain = Math.max(1, 10 + Math.max(0, 5 - Math.floor(secs / 10)) - 2 * this.#hints);
    this.#player.add(gain);
    this.#notify(`${r.message} (+${gain})`, 'ok');
    this.emit('solved', { gain, seconds: secs, seed: ex.seed, n: this.#n });
  }

  reveal() { this.#revealed = true; this.#notify('Solución mínima: ' + this.#exercise.solution.expression, 'ok'); }
}
