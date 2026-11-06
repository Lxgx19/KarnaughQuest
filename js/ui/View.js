const GROUP_COLORS = ['#e4572e', '#17a398', '#f2a900', '#8e44ad', '#2e86de', '#d6336c'];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Clase abstracta: cada vista decide cómo dibujarse (polimorfismo en render). */
class View {
  constructor(root, game) {
    if (new.target === View) throw new TypeError('View es abstracta');
    this.root = root;
    this.game = game;
    game.on('change', () => this.render());
  }
  render() { throw new Error('render() debe implementarse en la subclase'); }
}
