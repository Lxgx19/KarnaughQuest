class MessageView extends View {
  #msg = { text: '', type: '' };
  constructor(root, game) {
    super(root, game);
    game.on('message', m => { this.#msg = m; this.render(); });
  }
  render() { this.root.textContent = this.#msg.text; this.root.className = this.#msg.type; }
}
