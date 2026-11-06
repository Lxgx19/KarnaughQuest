/** Punto de entrada: arma el modelo, la red, la persistencia y las vistas. */
class App {
  constructor() {
    const $ = id => document.getElementById(id), store = new LocalStore();
    const player = new Player(store.get('id') ?? Math.random().toString(36).slice(2, 10), store.get('name', 'Jugador'), 0, store.get('record', 0));
    store.set('id', player.id);
    const game = new Game(new ExerciseGenerator(), player);
    const match = new Match(game, room => new BroadcastTransport(room));
    game.on('solved', () => store.set('record', player.record));
    match.on('rename', name => store.set('name', name));
    new ControlsView(document.querySelector('main'), game);
    new MapView($('map'), game);
    new GroupListView($('groups-panel'), game);
    new MessageView($('msg'), game);
    new MultiplayerView($('mp-body'), game, match);
  }
}
new App();
