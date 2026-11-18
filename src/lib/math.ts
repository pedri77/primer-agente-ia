/** Utilidades numéricas y de formato. */

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Redondea al paso del control (evita 0.30000000000000004 en pantalla y en la URL). */
export const alPaso = (v: number, paso: number) => {
  const dec = (String(paso).split('.')[1] ?? '').length;
  return Number((Math.round(v / paso) * paso).toFixed(dec));
};

const fmt = new Intl.NumberFormat('es-ES', {maximumFractionDigits: 2});
export const num = (v: number) => fmt.format(v);

/** Cifras grandes legibles: 1,2 millones, 3400 millones, 2 billones (escala larga española). */
export function grande(v: number) {
  const a = Math.abs(v);
  if (a >= 1e12) return `${num(v / 1e12)} billones`;
  if (a >= 1e6) return `${num(v / 1e6)} millones`;
  return num(Math.round(v));
}

/** Duración en la unidad más humana: «3 segundos», «4 días», «12 000 años». */
export function duracion(seg: number) {
  const u: [number, string, string][] = [
    [31_557_600, 'año', 'años'],
    [86_400, 'día', 'días'],
    [3_600, 'hora', 'horas'],
    [60, 'minuto', 'minutos'],
    [1, 'segundo', 'segundos'],
  ];
  if (seg < 1) return 'menos de un segundo';
  for (const [s, uno, varios] of u) {
    if (seg >= s) {
      const n = seg / s;
      return `${grande(n >= 10 ? Math.round(n) : Number(n.toFixed(1)))} ${n < 1.05 && n >= 0.95 ? uno : varios}`;
    }
  }
  return 'menos de un segundo';
}
