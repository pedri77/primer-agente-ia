import {useEffect, useState} from 'react';
import {contenido as c} from '../content';
import type {Historia, Nodo, Paso} from '../lib/motor';

const ETIQUETA = {buena: 'Bien', regular: 'Mejorable', mala: 'Error'} as const;
const CLAVE = 'aventura-finales';

/** Finales descubiertos por este lector (comodidad local: si el almacenamiento falla, no pasa nada). */
function useFinalesVistos(id: string) {
  const [vistos, setVistos] = useState<string[]>([]);
  useEffect(() => {
    let lista: string[] = [];
    try {
      lista = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
      if (!lista.includes(id)) localStorage.setItem(CLAVE, JSON.stringify((lista = [...lista, id])));
    } catch {
      lista = [id];
    }
    setVistos(lista);
  }, [id]);
  return vistos;
}

/**
 * Cierre: qué pasó, y el repaso de cada decisión con su nota. Es donde se aprende;
 * el final sin repaso es solo un «has perdido».
 */
export function Final({historia, id, nodo, pasos, onReiniciar}: {historia: Historia; id: string; nodo: Nodo; pasos: Paso[]; onReiniciar: () => void}) {
  const vistos = useFinalesVistos(id);
  const total = Object.values(historia.nodos).filter((n) => n.final).length;
  const conCalidad = pasos.filter((p) => p.opcion.calidad);
  const buenas = conCalidad.filter((p) => p.opcion.calidad === 'buena').length;
  return (
    <div className="mt-10">
      <p className={`final-tipo final-${nodo.final!.tipo}`}>{nodo.final!.titulo}</p>
      {conCalidad.length > 0 && (
        <section className="mt-8" aria-labelledby="repaso">
          <h3 id="repaso" className="font-display text-lead">
            Tus decisiones: {buenas} de {conCalidad.length} acertadas
          </h3>
          <ol className="repaso mt-4">
            {conCalidad.map((p, i) => (
              <li key={i} className={`calidad-${p.opcion.calidad}`}>
                <p className="text-etiqueta uppercase text-texto-3">{historia.nodos[p.nodo].titulo}</p>
                <p className="mt-1">
                  <span className="sello">{ETIQUETA[p.opcion.calidad!]}</span> {p.opcion.texto}
                </p>
                {p.opcion.nota && <p className="mt-1 text-texto-2">{p.opcion.nota}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}
      <p className="mt-8 text-body text-texto-3">
        Has descubierto {vistos.length} de {total} {total === 1 ? 'final' : 'finales'}.
      </p>
      <button type="button" className="boton-sec mt-4" onClick={onReiniciar}>
        Volver a empezar
      </button>
      {c.cta && (
        <aside className="cta-final mt-12 pl-4">
          <p className="text-lead text-pretty">{c.cta.texto}</p>
          <a className="boton mt-4" href={c.cta.enlace}>
            {c.cta.boton}
          </a>
        </aside>
      )}
    </div>
  );
}
