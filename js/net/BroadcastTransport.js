/** Multijugador local: conecta pestañas del mismo navegador (sin servidor). */
class BroadcastTransport extends Transport {
  #ch;
  constructor(room) { super(); this.#ch = new BroadcastChannel('karnaughquest-' + room); }
  send(message) { this.#ch.postMessage(message); }
  onMessage(handler) { this.#ch.onmessage = e => handler(e.data); }
  close() { this.#ch.close(); }
}
