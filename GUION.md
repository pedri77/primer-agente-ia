# Guion: Tu primer agente de IA en la empresa

## 1. El caso
- **Situación**: eres responsable de operaciones de Lanaria (tienda online ficticia de textil para el hogar, 40 personas). Faltan 21 días para el Black Friday y la directora quiere un agente de IA que conteste el correo de clientes.
- **Lecciones**:
  1. Qué datos le das: base curada y con fecha, no la carpeta entera → `datos`, explota en `politica-vieja`.
  2. Qué puede hacer solo: acciones con dinero con límite o firma humana → `permisos`, explota en `negociador`.
  3. Qué revisa una persona: umbral + muestreo, ni todo ni nada → `revision`, explota en `incidencia-cazada` o `captura`.
  4. Qué haces cuando se equivoca: cumplir, corregir la fuente y contarlo; culpar al bot sale caro → `politica-vieja`, `incidencia`.
- **Fuentes**: ver README (Air Canada, Chevrolet de Watsonville, Cursor, DPD, MyCity, Klarna, MIT NANDA, AI Act art. 4 y 50, RGPD art. 5.1.c).

## 2. Variables

| Clave | Tipo | Inicial | Visible | Qué mide | Rango |
|---|---|---|---|---|---|
| dias | número | 21 | sí | días para el Black Friday | 0–21 |
| clientes | número | 3 | sí, barra | confianza de los clientes | 0–5 (se muestra acotada) |
| equipo | número | 3 | sí, barra | ánimo del equipo de atención | 0–5 (acotada al mostrar) |
| ahorro | número | 0 | sí, barra | tiempo que libera el agente | 0–5 (acotada al mostrar) |
| alcance | texto | '' | no | frecuentes / todo / todo-asumido | – |
| fuentes | texto | '' | no | carpeta / sola / equipo | – |
| dinero | texto | '' | no | libre / limite / nada | – |
| revision | texto | '' | no | todo / umbral / nada | – |
| aviso | sí/no | – | no | firma como IA | – |
| metricas, culpaBot, apagado, capturaVista, personaVista | sí/no | no | no | memoria de decisiones | – |

## 3. Mapa

```
encargo → (datos | aplazar)        aplazar → (datos | marketing → semana)
datos → permisos → revision → aviso → lanzamiento → equipo-chat → [HUB] semana
semana: alcance todo → todo-caos → semana
        revision todo → incidencia-cazada
        fuentes carpeta → politica-vieja        (consecuencia diferida de `datos`)
        resto → incidencia
todas → [HUB] bf
bf: apagado → fin-desconfianza · culpaBot → fin-promesa
    dinero libre → negociador                   (consecuencia diferida de `permisos`)
    revision nada → captura · sin aviso → persona
    resto → bf-cierre → [HUB] resultado
resultado: equipo ≤ 1 → fin-fantasma · clientes ≤ 1 o ahorro ≤ 2 → fin-desconfianza · resto → fin-conservar
```

## 4. Finales

| Id | Tipo | Título | Se debe a |
|---|---|---|---|
| fin-conservar | bueno | El agente que el equipo quiere conservar | base curada, límites, umbral, equipo dentro |
| fin-desconfianza | regular | Funciona, pero nadie se fía | revisarlo todo, apagarlo o clientes quemados |
| fin-fantasma | regular | El agente fantasma | equipo fuera o recorte de plantilla |
| fin-promesa | malo | La promesa que no puedes cumplir | culpar al bot de su error |
| fin-apagado-bf | malo | Apagado en pleno Black Friday | permisos de dinero sin límite o sin revisión, y apagar en caliente |

Las decisiones y sus notas están en `src/historia.ts` (cada opción lleva `calidad` y `nota`).
