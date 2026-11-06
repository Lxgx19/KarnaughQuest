/** Grupo creado por el jugador. */
class Group {
  constructor(n, cells) {
    this.cells = [...cells].sort((a, b) => a - b);
    this.cube = Cube.fromMinterms(n, this.cells);
  }
  get expression() { return this.cube.toString(); }
}
