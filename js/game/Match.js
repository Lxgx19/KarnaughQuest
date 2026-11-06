/**
 * Partida multijugador sobre cualquier Transport. Mensajes:
 *  hello {p, reply?}  presentación del jugador   | round {seed, n, to?}  ronda con la misma semilla
 *  score {id, points} puntaje actualizado
 */
class Match extends EventEmitter {
  #game; #factory; #t = null; #host = false; #room = null; #players = new Map();
  constructor(game, transportFactory) {
    super(); this.#game = game; this.#factory = transportFactory;
    game.on('solved', () => {
      if (!this.#t) return;
      this.#players.set(this.#me.id, this.#me.snapshot());
      this.#send({ type: 'score', id: this.#me.id, points: this.#me.points });
      this.emit('players');
    });
  }
  get #me() { return this.#game.player; }
  get room() { return this.#room; }
  get isHost() { return this.#host; }
  get players() { return [...this.#players.values()].sort((a, b) => b.points - a.points); }
  static newCode() { return Math.random().toString(36).slice(2, 6).toUpperCase(); }

  create() { this.#open(Match.newCode(), true); }
  join(room) { this.#open(room.trim().toUpperCase(), false); }
  leave() { this.#t?.close(); this.#t = null; this.#room = null; this.#host = false; this.#players.clear(); this.emit('players'); }

  rename(name) {
    this.#me.name = name; this.emit('rename', name);
    if (!this.#t) return;
    this.#players.set(this.#me.id, this.#me.snapshot());
    this.#send({ type: 'hello', p: this.#me.snapshot() }); this.emit('players');
  }

  /** Solo el anfitrión: nueva semilla para todos. */
  nextRound() {
    if (!this.#host) return;
    const seed = SeededRandom.newSeed();
    this.#game.setVariables(this.#game.n, seed);
    this.#send({ type: 'round', seed, n: this.#game.n });
  }

  #open(room, host) {
    this.leave(); this.#room = room; this.#host = host;
    this.#t = this.#factory(room); this.#t.onMessage(m => this.#handle(m));
    this.#players.set(this.#me.id, this.#me.snapshot());
    this.#send({ type: 'hello', p: this.#me.snapshot(), reply: true });
    this.emit('players');
  }
  #send(m) { this.#t?.send(m); }

  #handle(m) {
    if (m.type === 'hello') {
      this.#players.set(m.p.id, m.p);
      if (m.reply) { // un recién llegado: todos se presentan y el anfitrión le pasa la ronda actual
        this.#send({ type: 'hello', p: this.#me.snapshot() });
        if (this.#host) this.#send({ type: 'round', seed: this.#game.exercise.seed, n: this.#game.n, to: m.p.id });
      }
    } else if (m.type === 'round') {
      if (!m.to || m.to === this.#me.id) this.#game.setVariables(m.n, m.seed);
    } else if (m.type === 'score' && this.#players.has(m.id)) {
      this.#players.get(m.id).points = m.points;
    }
    this.emit('players');
  }
}
