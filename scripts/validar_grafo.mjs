#!/usr/bin/env node
// Valida el grafo de una web-aventura recorriendo TODOS los estados alcanzables con el mismo motor
// que usa la página (src/lib/motor.ts). Necesita Node ≥ 22.18 (quita los tipos de TS solo).
//
// Uso (desde la raíz del proyecto):
//   node scripts/validar_grafo.mjs              informe; sale con código 1 si hay errores
//   node scripts/validar_grafo.mjs --rutas      además imprime una query string por nodo y por final
//                                               (la ruta más corta), lista para scripts/estados.mjs
//   node scripts/validar_grafo.mjs --json       informe en JSON
//
// Comprueba: destinos que no existen, nodos inalcanzables, finales inalcanzables, callejones sin salida
// (nodo no final sin opciones disponibles en algún estado), estados desde los que no se llega a ningún
// final (bucles sin salida), desvíos en bucle, texto con «undefined»/«NaN»/llaves sin sustituir,
// opciones repetidas en un nodo. Cuenta rutas completas y su longitud si el grafo no tiene ciclos.
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const args = new Set(process.argv.slice(2));
const raiz = process.cwd();
const {historia: h} = await import(pathToFileURL(resolve(raiz, 'src/historia.ts')).href);
const {disponibles, aplicar, desviar, textoDe} = await import(pathToFileURL(resolve(raiz, 'src/lib/motor.ts')).href);

const errores = [];
const avisos = [];
let informe;
const ids = Object.keys(h.nodos);

// 1. Estático: destinos.
if (!h.nodos[h.inicio]) errores.push(`inicio «${h.inicio}» no existe`);
for (const [id, n] of Object.entries(h.nodos)) {
  for (const o of n.opciones ?? []) if (!h.nodos[o.ir]) errores.push(`${id}: la opción «${o.texto}» va a «${o.ir}», que no existe`);
  for (const d of n.desvio ?? []) if (!h.nodos[d.ir]) errores.push(`${id}: un desvío va a «${d.ir}», que no existe`);
  if (n.final && n.opciones?.length) avisos.push(`${id}: es final pero tiene opciones (se ignoran)`);
  const textos = (n.opciones ?? []).map((o) => o.texto);
  if (new Set(textos).size !== textos.length) avisos.push(`${id}: opciones con el mismo texto`);
}
if (errores.length) fin();

// 2. Dinámico: BFS sobre (nodo, estado).
const clave = (id, e) => `${id}|${JSON.stringify(e, Object.keys(e).sort())}`;
const TOPE = 200_000;
const inicial = {...h.inicial};
const id0 = desviar(h, h.inicio, inicial);
const visitados = new Map(); // clave → {id, e, ruta, sucesores: claves}
const cola = [[id0, inicial, []]];
visitados.set(clave(id0, inicial), {id: id0, e: inicial, ruta: [], sucesores: []});
const nodosVistos = new Set([id0]);
while (cola.length) {
  const [id, e, ruta] = cola.shift();
  const yo = visitados.get(clave(id, e));
  const n = h.nodos[id];
  let texto = '';
  try {
    texto = textoDe(n, e);
  } catch (err) {
    errores.push(`${id}: el texto lanza un error con estado ${JSON.stringify(e)}: ${err.message}`);
  }
  if (/undefined|NaN|\{\w+\}/.test(texto)) errores.push(`${id}: texto roto («${texto.match(/undefined|NaN|\{\w+\}/)[0]}») con estado ${JSON.stringify(e)}`);
  if (n.final) continue;
  const ops = disponibles(n, e);
  if (ops.length === 0) {
    errores.push(`${id}: callejón sin salida (ninguna opción disponible) con estado ${JSON.stringify(e)}, ruta ?r=${ruta.join('.')}`);
    continue;
  }
  ops.forEach((o, i) => {
    const e2 = aplicar(e, o);
    const id2 = desviar(h, o.ir, e2);
    nodosVistos.add(o.ir); // un nodo de reparto (solo desvíos) también cuenta como alcanzado
    if (h.nodos[id2]?.desvio?.some((d) => d.si(e2))) errores.push(`${o.ir}: desvíos en bucle (más de 20 saltos)`);
    const k = clave(id2, e2);
    yo.sucesores.push(k);
    if (!visitados.has(k)) {
      if (visitados.size >= TOPE) return;
      visitados.set(k, {id: id2, e: e2, ruta: [...ruta, i], sucesores: []});
      nodosVistos.add(id2);
      cola.push([id2, e2, [...ruta, i]]);
    }
  });
}
if (visitados.size >= TOPE) avisos.push(`más de ${TOPE} estados: el informe es parcial (¿variables que crecen sin límite?)`);

// 3. Alcance.
for (const id of ids) if (!nodosVistos.has(id)) errores.push(`${id}: inalcanzable${h.nodos[id].final ? ' (es un final)' : ''}`);

// 4. Estados desde los que no se llega a un final (bucles sin salida).
const llega = new Set();
for (const [k, v] of visitados) if (h.nodos[v.id].final) llega.add(k);
let cambio = true;
while (cambio) {
  cambio = false;
  for (const [k, v] of visitados) if (!llega.has(k) && v.sucesores.some((s) => llega.has(s))) llega.add(k), (cambio = true);
}
const atrapados = [...visitados].filter(([k, v]) => !llega.has(k) && !h.nodos[v.id].final);
if (atrapados.length) {
  const [, v] = atrapados[0];
  errores.push(`${atrapados.length} estados sin camino a ningún final; p. ej. «${v.id}» con ?r=${v.ruta.join('.')}`);
}

// 5. Rutas completas (solo si no hay ciclos).
const enCurso = new Set();
const memo = new Map();
let ciclo = false;
function contar(k) {
  if (memo.has(k)) return memo.get(k);
  if (enCurso.has(k)) return (ciclo = true), {n: 0, min: Infinity, max: 0, finales: {}};
  enCurso.add(k);
  const v = visitados.get(k);
  let r;
  if (h.nodos[v.id].final) r = {n: 1, min: 0, max: 0, finales: {[v.id]: 1}};
  else {
    r = {n: 0, min: Infinity, max: 0, finales: {}};
    for (const s of v.sucesores) {
      const c = contar(s);
      r.n += c.n;
      r.min = Math.min(r.min, c.min + 1);
      r.max = Math.max(r.max, c.max + 1);
      for (const [f, x] of Object.entries(c.finales)) r.finales[f] = (r.finales[f] ?? 0) + x;
    }
  }
  enCurso.delete(k);
  memo.set(k, r);
  return r;
}
const total = contar(clave(id0, inicial));

// 6. Rutas para el QA: la más corta a cada nodo (primer estado en que se alcanza, por BFS).
const rutaNodo = new Map();
for (const v of visitados.values()) if (!rutaNodo.has(v.id)) rutaNodo.set(v.id, v.ruta);

const finales = ids.filter((id) => h.nodos[id].final);
informe = {
  nodos: ids.length,
  finales: finales.length,
  estados: visitados.size,
  ciclos: ciclo,
  rutas: ciclo ? 'hay ciclos: no se cuentan' : total.n,
  pasos: ciclo ? null : {min: total.min, max: total.max},
  porFinal: ciclo ? null : total.finales,
  errores,
  avisos,
};
if (args.has('--rutas')) informe.qa = [...rutaNodo].map(([id, r]) => ({id, q: r.length ? `r=${r.join('.')}` : ''}));
fin();

function fin() {
  if (args.has('--json')) console.log(JSON.stringify(informe ?? {errores, avisos}, null, 1));
  else {
    if (informe) {
      console.log(`Nodos ${informe.nodos} · finales ${informe.finales} · estados ${informe.estados} · rutas ${informe.rutas}${informe.pasos ? ` (de ${informe.pasos.min} a ${informe.pasos.max} decisiones)` : ''}`);
      if (informe.porFinal) for (const [f, n] of Object.entries(informe.porFinal)) console.log(`  ${f.padEnd(24)} ${n} rutas · ${h.nodos[f].final.tipo}`);
      if (informe.qa) console.log('\nEstados para estados.mjs:\n' + informe.qa.map((x) => `"${x.q}"`).join(' '));
    }
    for (const a of avisos) console.log(`AVISO  ${a}`);
    for (const e of errores) console.log(`ERROR  ${e}`);
    console.log(errores.length ? `\n${errores.length} errores` : '\nGrafo válido');
  }
  process.exit(errores.length ? 1 : 0);
}
