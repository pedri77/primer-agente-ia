import {test} from 'node:test';
import assert from 'node:assert/strict';
import {historia} from '../src/historia.ts';
import {jugar} from '../src/lib/motor.ts';

test('ruta vacía empieza en el inicio', () => {
  assert.equal(jugar(historia, []).id, historia.inicio);
});

test('índices inválidos se recortan', () => {
  const p = jugar(historia, [1, 99, 1]);
  assert.deepEqual(p.ruta, [1]);
});

// Rutas (índice de opción visible en cada escena) que deben llevar a cada final.
const rutas: [string, number[]][] = [
  ['fin-conservar', [1, 2, 1, 1, 1, 0, 1, 1, 1]],
  ['fin-promesa', [1, 0, 1, 1, 1, 0, 1, 0]],
  ['fin-apagado-bf', [1, 2, 0, 1, 1, 0, 1, 1, 0]],
  ['fin-fantasma', [1, 2, 1, 1, 1, 0, 0, 1, 0]],
  ['fin-desconfianza', [1, 2, 1, 0, 1, 0, 1, 0, 1]],
];
for (const [fin, ruta] of rutas) {
  test(`llega a ${fin}`, () => assert.equal(jugar(historia, ruta).id, fin));
}

test('la carpeta entera explota en la semana del Black Friday', () => {
  const p = jugar(historia, [1, 0, 1, 1, 1, 0, 1]);
  assert.equal(p.id, 'politica-vieja');
});

test('sin días no hay piloto', () => {
  // Aplazar (−2) y hacer la base con el equipo (−8) deja 9 días: solo queda salir al 100 %.
  const p = jugar(historia, [2, 0, 2, 1, 1, 1]);
  assert.equal(p.id, 'lanzamiento');
  assert.equal(p.nodo.opciones!.filter((o) => !o.si || o.si(p.estado)).length, 1);
});

test('el despliegue de marketing encadena todas las consecuencias diferidas', () => {
  const vistos = [2, 1, 0, 1, 1, 1, 0].map((_, i, r) => jugar(historia, r.slice(0, i + 1)).id);
  assert.deepEqual(vistos, ['aplazar', 'marketing', 'politica-vieja', 'negociador', 'captura', 'persona', 'bf-cierre']);
  assert.equal(jugar(historia, [2, 1, 0, 1, 1, 1, 0, 1]).id, 'fin-desconfianza');
});
