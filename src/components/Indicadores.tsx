import type {Estado, Indicador} from '../lib/motor';

/** Estado visible (reloj, confianza, pistas…). Lo que no se muestra aquí es estado oculto, a propósito. */
export function Indicadores({lista, estado}: {lista: Indicador[]; estado: Estado}) {
  if (!lista.length) return null;
  return (
    <dl className="indicadores">
      {lista.map((ind) => {
        const v = estado[ind.clave];
        const texto = ind.formato ? ind.formato(v, estado) : String(v);
        return (
          <div key={ind.clave}>
            <dt>{ind.etiqueta}</dt>
            <dd className="font-cifra tabular-nums">{texto}</dd>
            {ind.max !== undefined && typeof v === 'number' && (
              <div className="barra" aria-hidden>
                <span style={{width: `${Math.max(0, Math.min(1, v / ind.max)) * 100}%`}} />
              </div>
            )}
          </div>
        );
      })}
    </dl>
  );
}
