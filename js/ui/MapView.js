class MapView extends View {
  constructor(root, game) {
    super(root, game);
    root.addEventListener('click', e => {
      const b = e.target.closest('.cell');
      if (b) game.toggleCell(+b.dataset.x);
    });
    this.render();
  }

  render() {
    const { exercise: ex, selection } = this.game, fn = ex.fn, map = new KarnaughMap(fn.n), groups = ex.groups;
    let h = `<p class="fn">${fn}</p><table><tr><th>${map.corner}</th>${map.cols.map(c => `<th>${map.colLabel(c)}</th>`).join('')}</tr>`;
    for (const r of map.rows) {
      h += `<tr><th>${map.rowLabel(r)}</th>`;
      for (const c of map.cols) {
        const x = map.minterm(r, c), v = fn.isOne(x) ? 1 : 0, gi = groups.findIndex(g => g.cube.covers(x));
        const dots = groups.map((g, i) => (g.cube.covers(x) ? `<i style="background:${GROUP_COLORS[i % 6]}"></i>` : '')).join('');
        h += `<td><button class="cell${v ? ' one' : ''}${gi >= 0 ? ' grp' : ''}${selection.has(x) ? ' sel' : ''}" data-x="${x}" style="--g:${GROUP_COLORS[Math.max(gi, 0) % 6]}" aria-label="m${x} valor ${v}"><small>${x}</small>${v}<span class="dots">${dots}</span></button></td>`;
      }
      h += '</tr>';
    }
    this.root.innerHTML = h + '</table>';
  }
}
