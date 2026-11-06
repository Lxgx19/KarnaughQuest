class Player {
  constructor(id, name = 'Jugador', points = 0, record = 0) {
    this.id = id; this.name = name; this.points = points; this.record = record;
  }
  add(p) { this.points = Math.max(0, this.points + p); this.record = Math.max(this.record, this.points); }
  /** Datos que se envían por la red. */
  snapshot() { return { id: this.id, name: this.name, points: this.points }; }
}
