/**
 * Motor de la historia. Funciones puras, sin React: las usa la página y también
 * scripts/validar_grafo.mjs, así que lo que valida el script es exactamente lo que se juega.
 *
 * Idea clave: el estado entero se deriva de la RUTA (lista de índices de opción elegidos desde el
 * inicio). La ruta va en la URL (?r=0.2.1): se puede compartir, el botón Atrás deshace y el QA
 * captura cualquier punto de la historia con una query string.
 */

export type Valor = number | boolean | string;
export type Estado = Record<string, Valor>;
export type Calidad = 'buena' | 'regular' | 'mala';

export type Opcion = {
  texto: string;
  /** Id del nodo destino. */
  ir: string;
  /** Suma a variables numéricas: {minutos: 10, confianza: -1}. */
  efecto?: Record<string, number>;
  /** Asigna variables: {aislado: true}. */
  fija?: Record<string, Valor>;
  /** La opción solo aparece si se cumple. Pura: depende solo del estado. */
  si?: (e: Estado) => boolean;
  /** Para el resumen final: qué tal estuvo la decisión y por qué. */
  calidad?: Calidad;
  nota?: string;
};

export type Documento =
  | {tipo: 'correo'; de: string; para?: string; asunto: string; fecha?: string; cuerpo: string; adjunto?: string}
  | {tipo: 'log'; titulo?: string; lineas: string[]}
  | {tipo: 'chat'; mensajes: {quien: string; texto: string; hora?: string}[]}
  | {tipo: 'nota'; titulo?: string; texto: string};

export type Nodo = {
  titulo: string;
  texto: string | ((e: Estado) => string);
  documento?: Documento;
  opciones?: Opcion[];
  /** Saltos automáticos al llegar (reloj de presión, consecuencias diferidas). Gana la primera que cumple. */
  desvio?: {si: (e: Estado) => boolean; ir: string}[];
  final?: {tipo: 'bueno' | 'regular' | 'malo'; titulo: string};
};

export type Indicador = {
  clave: string;
  etiqueta: string;
  /** Cómo se muestra: «02:40», «3 de 5»… */
  formato?: (v: Valor, e: Estado) => string;
  /** Si hay máximo, se dibuja una barra. */
  max?: number;
};

export type Historia = {
  titulo: string;
  inicio: string;
  inicial: Estado;
  nodos: Record<string, Nodo>;
  indicadores?: Indicador[];
  /** Pistas que el lector puede abrir (diálogo). Visibles solo si se cumple `si`. */
  pistas?: {titulo: string; texto: string; si?: (e: Estado) => boolean}[];
};

export type Paso = {nodo: string; opcion: Opcion};

export const disponibles = (n: Nodo | undefined, e: Estado) => (n?.opciones ?? []).filter((o) => !o.si || o.si(e));

export function aplicar(e: Estado, o: Opcion): Estado {
  const s = {...e};
  for (const [k, v] of Object.entries(o.efecto ?? {})) s[k] = Number(s[k] ?? 0) + v;
  Object.assign(s, o.fija ?? {});
  return s;
}

/** Sigue los desvíos automáticos. Tope de 20 para no colgar la página si alguien hace un bucle. */
export function desviar(h: Historia, id: string, e: Estado) {
  for (let i = 0; i < 20; i++) {
    const regla = h.nodos[id]?.desvio?.find((d) => d.si(e));
    if (!regla) return id;
    id = regla.ir;
  }
  return id;
}

/** Reproduce una ruta desde el inicio. Si un índice no es válido, se queda en el último punto válido. */
export function jugar(h: Historia, ruta: readonly number[]) {
  let e: Estado = {...h.inicial};
  let id = desviar(h, h.inicio, e);
  const pasos: Paso[] = [];
  let valida = 0;
  for (const i of ruta) {
    const o = disponibles(h.nodos[id], e)[i];
    if (!o) break;
    pasos.push({nodo: id, opcion: o});
    e = aplicar(e, o);
    id = desviar(h, o.ir, e);
    valida++;
  }
  return {id, nodo: h.nodos[id], estado: e, pasos, ruta: ruta.slice(0, valida)};
}

export const textoDe = (n: Nodo, e: Estado) => (typeof n.texto === 'function' ? n.texto(e) : n.texto);

/** Hora de reloj a partir de minutos desde una hora de inicio: (100, 2) → «03:40». */
export function reloj(minutos: number, horaInicio = 0) {
  const t = (((horaInicio * 60 + minutos) % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}
