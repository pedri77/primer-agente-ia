import type {Documento as Doc} from '../lib/motor';

/**
 * El «objeto» de la escena: un correo, un log, un chat o una nota que el lector examina antes de decidir.
 * Es donde vive la información; el texto narrativo solo la presenta. Texto real (seleccionable,
 * legible por lector de pantalla), nunca una imagen.
 */
export function Documento({doc}: {doc: Doc}) {
  switch (doc.tipo) {
    case 'correo':
      return (
        <article className="documento" aria-label={`Correo: ${doc.asunto}`}>
          <dl className="doc-cabecera">
            <div><dt>De</dt><dd>{doc.de}</dd></div>
            {doc.para && <div><dt>Para</dt><dd>{doc.para}</dd></div>}
            {doc.fecha && <div><dt>Fecha</dt><dd>{doc.fecha}</dd></div>}
            <div><dt>Asunto</dt><dd className="font-semibold">{doc.asunto}</dd></div>
          </dl>
          <div className="doc-cuerpo whitespace-pre-line">{doc.cuerpo}</div>
          {doc.adjunto && <p className="doc-adjunto">Adjunto: {doc.adjunto}</p>}
        </article>
      );
    case 'log':
      return (
        <figure className="documento doc-log" aria-label={doc.titulo ?? 'Registro'}>
          {doc.titulo && <figcaption className="text-etiqueta uppercase text-texto-3">{doc.titulo}</figcaption>}
          <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-[0.8125rem] leading-relaxed">{doc.lineas.join('\n')}</pre>
        </figure>
      );
    case 'chat':
      return (
        <ol className="documento doc-chat" aria-label="Conversación">
          {doc.mensajes.map((m, i) => (
            <li key={i}>
              <span className="font-semibold">{m.quien}</span>
              {m.hora && <span className="ml-2 text-texto-3">{m.hora}</span>}
              <p className="mt-1">{m.texto}</p>
            </li>
          ))}
        </ol>
      );
    case 'nota':
      return (
        <aside className="documento doc-nota">
          {doc.titulo && <p className="font-semibold">{doc.titulo}</p>}
          <p className="mt-1 whitespace-pre-line">{doc.texto}</p>
        </aside>
      );
  }
}
