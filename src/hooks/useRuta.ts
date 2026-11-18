import {useCallback, useEffect, useState} from 'react';

const leer = () =>
  (new URLSearchParams(location.search).get('r') ?? '')
    .split('.')
    .filter((x) => /^\d+$/.test(x))
    .map(Number);

/**
 * La ruta (índices de opción elegidos) vive en ?r=0.2.1. Cada decisión es una entrada del historial:
 * el botón Atrás del navegador deshace, y una URL lleva a cualquier punto de la historia.
 */
export function useRuta() {
  const [ruta, setRuta] = useState(leer);
  useEffect(() => {
    const f = () => setRuta(leer());
    addEventListener('popstate', f);
    return () => removeEventListener('popstate', f);
  }, []);
  const ir = useCallback((r: number[]) => {
    const url = new URL(location.href);
    if (r.length) url.searchParams.set('r', r.join('.'));
    else url.searchParams.delete('r');
    history.pushState(null, '', url);
    setRuta(r);
  }, []);
  return {
    ruta,
    elegir: (i: number) => ir([...ruta, i]),
    deshacer: () => ir(ruta.slice(0, -1)),
    reiniciar: () => ir([]),
    /** Para corregir la URL si traía índices inválidos, sin crear entrada de historial. */
    normalizar: (r: number[]) => {
      if (r.length === ruta.length) return;
      const url = new URL(location.href);
      if (r.length) url.searchParams.set('r', r.join('.'));
      else url.searchParams.delete('r');
      history.replaceState(null, '', url);
      setRuta(r);
    },
  };
}
