/**
 * Página de una web-aventura: portada + escena actual. Todo el estado sale de la ruta (?r=…):
 * jugar(historia, ruta) devuelve nodo, variables y decisiones tomadas.
 * Normalmente solo cambias historia.ts, content.ts y los tokens de index.css.
 */
import {useEffect, useRef} from 'react';
import {Documento} from './components/Documento';
import {Final} from './components/Final';
import {Indicadores} from './components/Indicadores';
import {Pistas} from './components/Pistas';
import {contenido as c} from './content';
import {historia} from './historia';
import {useRuta} from './hooks/useRuta';
import {disponibles, jugar, textoDe} from './lib/motor';

const LETRAS = 'ABCDEFGH';

export default function App() {
  const {ruta, elegir, deshacer, reiniciar, normalizar} = useRuta();
  const partida = jugar(historia, ruta);
  const {id, nodo, estado, pasos} = partida;
  const opciones = disponibles(nodo, estado);
  const titulo = useRef<HTMLHeadingElement>(null);
  const anterior = useRef<string | null>(null);

  // Una URL con índices que ya no existen (historia editada) se corrige sin romper.
  useEffect(() => normalizar(partida.ruta), [partida.ruta.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Al cambiar de escena, el foco va al título: el lector de pantalla lee la escena nueva y Tab sigue desde ahí.
  // Se compara con la escena anterior (no con «primer render») porque StrictMode ejecuta los efectos dos veces.
  const escena = `${id}-${pasos.length}`;
  useEffect(() => {
    const venia = anterior.current;
    anterior.current = escena;
    if (venia === null || venia === escena) return;
    titulo.current?.focus({preventScroll: true});
    titulo.current?.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  }, [escena]);

  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
      <header className={ruta.length ? 'pt-8' : 'pt-16 sm:pt-24'}>
        <p className="text-etiqueta uppercase text-texto-3">{c.antetitulo}</p>
        {ruta.length === 0 ? (
          <>
            <h1 className="mt-4 font-display text-hero text-balance">{historia.titulo}</h1>
            <p className="mt-6 text-lead text-texto-2 text-pretty">{c.entradilla}</p>
          </>
        ) : (
          <p className="mt-1 font-display text-lead">{historia.titulo}</p>
        )}
      </header>

      {/* En los finales no se muestran: la hora del reloj ya no es la de la escena final. */}
      {(historia.indicadores?.length ?? 0) > 0 && !nodo.final && (
        <div className="barra-estado">
          <Indicadores lista={historia.indicadores!} estado={estado} />
        </div>
      )}

      <article key={escena} className="escena" aria-labelledby="escena-titulo">
        <h2 id="escena-titulo" ref={titulo} tabIndex={-1} className="font-display text-display text-balance scroll-mt-28">
          {nodo.titulo}
        </h2>
        <p className="mt-4 text-lead text-texto-2 text-pretty">{textoDe(nodo, estado)}</p>
        {nodo.documento && (
          <div className="mt-6">
            <Documento doc={nodo.documento} />
          </div>
        )}

        {nodo.final ? (
          <Final historia={historia} id={id} nodo={nodo} pasos={pasos} onReiniciar={reiniciar} />
        ) : (
          <>
            <h3 className="sr-only">¿Qué haces?</h3>
            <ol className="opciones-historia mt-8">
              {opciones.map((o, i) => (
                <li key={o.texto}>
                  <button type="button" onClick={() => elegir(i)}>
                    <span className="letra" aria-hidden>
                      {LETRAS[i]}
                    </span>
                    <span>{o.texto}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              {ruta.length > 0 && (
                <button type="button" className="boton-sec" onClick={deshacer}>
                  Deshacer la última decisión
                </button>
              )}
              <Pistas historia={historia} estado={estado} />
            </div>
          </>
        )}
      </article>

      <footer className="mt-24 border-t border-borde pt-8 text-texto-3">
        <p className="text-etiqueta uppercase">{c.pie}</p>
        {c.fuentes && c.fuentes.length > 0 && (
          <details className="fuentes mt-6 text-body">
            <summary className="cursor-pointer">Fuentes de los casos citados</summary>
            <ul className="mt-3 grid list-disc gap-2 pl-5">
              {c.fuentes.map((f) => (
                <li key={f.enlace}>
                  <a href={f.enlace} rel="noopener">
                    {f.texto}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}
      </footer>
    </main>
  );
}
