/** Disposición del mapa: filas y columnas en código Gray. */
class KarnaughMap {
  #n; #rb; #cb;
  constructor(n) { this.#n = n; this.#rb = n >> 1; this.#cb = n - this.#rb; }
  static gray(k) { return Array.from({ length: 1 << k }, (_, i) => i ^ (i >> 1)); }
  get rows() { return KarnaughMap.gray(this.#rb); }
  get cols() { return KarnaughMap.gray(this.#cb); }
  get corner() { return 'ABCD'.slice(0, this.#rb) + '\\' + 'ABCD'.slice(this.#rb, this.#n); }
  rowLabel(r) { return r.toString(2).padStart(this.#rb, '0'); }
  colLabel(c) { return c.toString(2).padStart(this.#cb, '0'); }
  /** Número de minitérmino de la celda (fila r, columna c). */
  minterm(r, c) { return (r << this.#cb) | c; }
}
