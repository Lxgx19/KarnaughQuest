/** Patrón Observer: quien emite no conoce a quien escucha. */
class EventEmitter {
  #handlers = {};
  on(event, fn) { (this.#handlers[event] ??= []).push(fn); return this; }
  emit(event, data) { (this.#handlers[event] || []).forEach(fn => fn(data)); }
}
