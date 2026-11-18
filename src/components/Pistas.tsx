import {useRef} from 'react';
import type {Estado, Historia} from '../lib/motor';

/**
 * Pistas en un <dialog> nativo: foco atrapado, Escape cierra y el foco vuelve al botón, sin librería.
 * Abrirlas no cambia la ruta (no penaliza); si quieres que cuenten, conviértelas en una opción con efecto.
 */
export function Pistas({historia, estado}: {historia: Historia; estado: Estado}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const visibles = (historia.pistas ?? []).filter((p) => !p.si || p.si(estado));
  if (!visibles.length) return null;
  return (
    <>
      <button type="button" className="boton-sec" onClick={() => dialogo.current?.showModal()}>
        Pistas ({visibles.length})
      </button>
      <dialog ref={dialogo} className="dialogo" aria-labelledby="pistas-titulo" onClick={(e) => e.target === dialogo.current && dialogo.current.close()}>
        <h2 id="pistas-titulo" className="font-display text-lead">Pistas</h2>
        <ul className="mt-4 space-y-4">
          {visibles.map((p) => (
            <li key={p.titulo}>
              <p className="font-semibold">{p.titulo}</p>
              <p className="mt-1 text-texto-2">{p.texto}</p>
            </li>
          ))}
        </ul>
        <form method="dialog" className="mt-6">
          <button className="boton">Cerrar</button>
        </form>
      </dialog>
    </>
  );
}
