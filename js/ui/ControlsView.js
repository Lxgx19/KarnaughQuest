/** Selector de variables, botones, cronómetro, puntaje y récord. */
class ControlsView extends View {
  constructor(root, game) {
    super(root, game);
    const $ = id => root.querySelector('#' + id);
    $('nuevo').onclick = () => game.newExercise();
    $('add').onclick = () => game.addGroup();
    $('clear').onclick = () => game.clearSelection();
    $('check').onclick = () => game.check();
    $('hint').onclick = () => game.hint();
    $('reveal').onclick = () => game.reveal();
    $('vars').addEventListener('click', e => {
      const b = e.target.closest('button');
      if (b) game.setVariables(+b.dataset.n);
    });
    setInterval(() => this.#tick(), 500);
    this.render();
  }

  #tick() {
    const s = Math.floor(this.game.elapsed / 1000);
    this.root.querySelector('#time').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  render() {
    const $ = id => this.root.querySelector('#' + id);
    $('vars').innerHTML = [2, 3, 4].map(k => `<button data-n="${k}" aria-pressed="${k === this.game.n}">${k} variables</button>`).join('');
    $('score').textContent = this.game.points;
    $('record').textContent = this.game.record;
    this.#tick();
  }
}
