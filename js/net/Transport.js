/** Contrato de red. Para jugar en línea basta otra subclase (p. ej. WebSocketTransport) con estos 3 métodos. */
class Transport {
  constructor() { if (new.target === Transport) throw new TypeError('Transport es abstracta'); }
  send(message) { throw new Error('send() no implementado'); }
  onMessage(handler) { throw new Error('onMessage() no implementado'); }
  close() {}
}
