/** Panel de sala y ranking. El HTML se arma una vez para no perder lo que el usuario escribe. */
class MultiplayerView extends View {
  #match;
  constructor(root, game, match) {
    super(root, game);
    this.#match = match;
    root.innerHTML = `
      <label>Tu nombre <input id="mp-name" maxlength="16"></label>
      <div class="mp-row"><button class="btn" id="mp-create">Crear sala</button>
        <input id="mp-code" placeholder="Código" maxlength="4" aria-label="Código de sala">
        <button class="btn" id="mp-join">Unirse</button></div>
      <div class="mp-row"><button class="btn" id="mp-round">Nueva ronda</button><button class="btn" id="mp-leave">Salir</button></div>
      <p id="mp-status" class="hint"></p><ol id="mp-rank"></ol>
      <p class="hint">Beta: funciona entre pestañas del mismo navegador. Para jugar en línea se cambia el Transport por uno con WebSocket.</p>`;
    const $ = id => root.querySelector('#' + id);
    $('mp-name').value = game.player.name;
    $('mp-name').onchange = e => match.rename(e.target.value.trim() || 'Jugador');
    $('mp-create').onclick = () => match.create();
    $('mp-join').onclick = () => { if ($('mp-code').value.trim()) match.join($('mp-code').value); };
    $('mp-round').onclick = () => match.nextRound();
    $('mp-leave').onclick = () => match.leave();
    match.on('players', () => this.render());
    this.render();
  }

  render() {
    const m = this.#match, $ = id => this.root.querySelector('#' + id);
    $('mp-status').textContent = m.room ? `Sala ${m.room} (${m.isHost ? 'anfitrión' : 'invitado'})` : 'Sin sala. Crea una o únete con un código.';
    $('mp-round').disabled = !m.isHost;
    $('mp-leave').disabled = !m.room;
    $('mp-rank').innerHTML = m.players.map(p => `<li${p.id === this.game.player.id ? ' class="me"' : ''}>${esc(p.name)} <b>${p.points}</b></li>`).join('');
  }
}
