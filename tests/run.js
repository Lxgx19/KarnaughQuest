// Ejecutar con: node tests/run.js
const vm = require('vm'), fs = require('fs'), path = require('path'), assert = require('assert');
const files = ['core/EventEmitter', 'core/SeededRandom', 'core/Cube', 'core/BooleanFunction', 'core/KarnaughMap', 'engine/Simplifier',
  'engine/GroupValidator', 'game/Group', 'game/Exercise', 'game/ExerciseGenerator', 'game/Player', 'game/Game', 'game/Match'];
const code = files.map(f => fs.readFileSync(path.join(__dirname, '../js', f + '.js'), 'utf8')).join('\n');
const ctx = { Math }; vm.createContext(ctx);
vm.runInContext(code + '\nthis.api = { BooleanFunction, KarnaughMap, Simplifier, GroupValidator, Exercise, ExerciseGenerator, Player, Game, Match };', ctx);
const { BooleanFunction, KarnaughMap, Simplifier, GroupValidator, Exercise, ExerciseGenerator, Player, Game, Match } = ctx.api;
const mk = (n, ms) => { const b = Array(1 << n).fill(0); ms.forEach(x => (b[x] = 1)); return new BooleanFunction(n, b); };
const sorted = s => s.split(' + ').sort().join(' + ');
let ok = 0; const t = (name, fn) => { fn(); ok++; console.log('OK  ' + name); };
// Red simulada en memoria (mismo contrato que Transport)
const hub = () => { const subs = []; return () => { const me = {}; subs.push(me); return { send: m => subs.filter(s => s !== me).forEach(s => s.cb && s.cb(JSON.parse(JSON.stringify(m)))), onMessage: f => { me.cb = f; }, close() {} }; }; };

t('simplifica A\'B\'', () => assert.strictEqual(new Simplifier(mk(4, [0, 1, 2, 3])).solve().expression, "A'B'"));
t('esquinas envueltas B\'D\'', () => assert.strictEqual(new Simplifier(mk(4, [0, 2, 8, 10])).solve().expression, "B'D'"));
t('columna completa D', () => assert.strictEqual(new Simplifier(mk(4, [1, 3, 5, 7, 9, 11, 13, 15])).solve().expression, 'D'));
t('3 grupos, 7 literales', () => { const s = new Simplifier(mk(4, [0, 1, 2, 5, 6, 7, 8, 9, 10, 14])).solve(); assert.deepStrictEqual([s.groups, s.literals], [3, 7]); });
t('3 variables', () => assert.strictEqual(sorted(new Simplifier(mk(3, [1, 3, 4, 5])).solve().expression), "A'C + AB'"));
t('validador acepta bordes', () => assert.ok(GroupValidator.validate(mk(4, [0, 2, 8, 10]), [0, 2, 8, 10]).ok));
t('validador rechaza no adyacentes', () => assert.ok(!GroupValidator.validate(mk(4, [0, 3, 5, 6]), [0, 3, 5, 6]).ok));
t('validador rechaza ceros', () => assert.ok(!GroupValidator.validate(mk(4, [0, 1]), [0, 1, 2, 3]).ok));
t('mapa en Gray', () => { const m = new KarnaughMap(4); assert.deepStrictEqual([...m.rows], [0, 1, 3, 2]); assert.strictEqual(m.minterm(3, 3), 15); });
t('misma semilla, mismo ejercicio', () => { const g = new ExerciseGenerator(); assert.strictEqual(g.generate(4, 7).fn.minterms.join(), g.generate(4, 7).fn.minterms.join()); });
t('puntos: 10 + bonus 5 sin pistas', () => {
  const g = new Game({ generate: () => new Exercise(mk(4, [0, 1, 2, 3]), 1) }, new Player('p', 'P'), () => 0);
  [0, 1, 2, 3].forEach(x => g.toggleCell(x)); g.addGroup(); g.check();
  assert.strictEqual(g.points, 15);
});
t('multijugador: misma semilla y marcador compartido', () => {
  const factory = hub(), gen = new ExerciseGenerator(), clock = () => 0;
  const gh = new Game(gen, new Player('h', 'Ana'), clock), gg = new Game(gen, new Player('g', 'Beto'), clock);
  const mh = new Match(gh, factory), mg = new Match(gg, factory);
  mh.create(); mg.join(mh.room);
  assert.strictEqual(gg.exercise.seed, gh.exercise.seed);
  mh.nextRound(); assert.strictEqual(gg.exercise.seed, gh.exercise.seed);
  let guard = 0; while (!gg.exercise.solved && guard++ < 20) { gg.hint(); gg.addGroup(); gg.check(); }
  assert.ok(gg.exercise.solved && gg.player.points > 0);
  assert.strictEqual(mh.players.find(p => p.id === 'g').points, gg.player.points);
});
console.log(`\n${ok} pruebas pasaron`);
