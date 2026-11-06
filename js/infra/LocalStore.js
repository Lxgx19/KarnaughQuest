/** Persistencia en localStorage (nombre, id y récord). Si falla, no rompe el juego. */
class LocalStore {
  #p;
  constructor(prefix = 'kq.') { this.#p = prefix; }
  get(key, fallback = null) {
    try { const v = localStorage.getItem(this.#p + key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
  }
  set(key, value) { try { localStorage.setItem(this.#p + key, JSON.stringify(value)); } catch { /* sin almacenamiento */ } }
}
