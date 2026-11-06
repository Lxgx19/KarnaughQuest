class GroupListView extends View {
  constructor(root, game) {
    super(root, game);
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-del]');
      if (b) game.removeGroup(+b.dataset.del);
    });
    this.render();
  }

  render() {
    const ex = this.game.exercise, gs = ex.groups;
    const items = gs.length
      ? gs.map((g, i) => `<li><span class="sw" style="background:${GROUP_COLORS[i % 6]}"></span><code>${g.expression}</code><small>m${g.cells.join(',')}</small><button class="x" data-del="${i}" aria-label="Quitar grupo">×</button></li>`).join('')
      : '<li class="empty">Aún no hay grupos.</li>';
    this.root.innerHTML = `<ul>${items}</ul><p>Tu expresión: <code>${ex.expression}</code></p>`;
  }
}
