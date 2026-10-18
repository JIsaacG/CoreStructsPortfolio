# Reglas y criterios de mejora · Reels de CoreStruct

Este documento junta lo aprendido produciendo R00-R07 (octubre de 2026) para que cada video salga mejor que el anterior. Complementa a `PROMPT_REELS.md` (marca y reglas base) y a `README.md` (cómo se opera la máquina). Si algo de aquí choca con `PROMPT_REELS.md`, manda `PROMPT_REELS.md` y se corrige este archivo.

Se usa en tres momentos:

1. **Antes de producir:** la lista de verificación de la sección 3.
2. **Antes de publicar:** la rúbrica de la sección 4 (mínimo 16 de 20).
3. **Cada lunes:** el ciclo de mejora de la sección 5, con `metrics.csv`.

---

## 1. Reglas duras (aprendidas a golpes)

Cada regla trae el problema que la originó. No se negocian.

### Demos y grabación

| # | Regla | Por qué |
| --- | --- | --- |
| D1 | **Revisar la hoja de fotogramas de cada toma nueva antes de usarla** (`npm run frames -- raw/clips/<demo>/<toma>.mp4 0.5,2,4`). | En R02-R07 se colaron cifras en 8 lugares que el filtro automático no vio: estadísticas de Aurelis ("25+ años", "350+ proyectos"), plazos ("Menos de 24 h hábiles", "24h 00m"), calificación "4.9" y datos del médico en Velora, el observatorio y las métricas de cabecera de CEDE, montos en lempiras de Flujo. |
| D2 | Toda cifra que aparezca se oculta en `shots.mjs` (`hide` de la demo, o `HIDE_TEXT` si es un patrón de texto) y la toma **se vuelve a grabar**. Nunca se tapa en la edición. | Una cifra tapada a medias se lee igual. |
| D3 | Los bloques promocionales de CoreStruct dentro de las demos (`.lp-pitch`, `.lp-outro`, `#corestruct`) se ocultan siempre. | El logo y la marca solo van en la tarjeta final; aparecían a mitad de R02 y R03. |
| D4 | Para grabar un estado intermedio (formulario enviado, aprobación hecha, documento generado) se usa `setup` en la toma, no tomas de más de 8 s. | El documento de Flujo exige dos aprobaciones: con una sola, la toma salió vacía. |
| D5 | Si una acción tiene que coincidir con un momento del video (un barrido, una frase), se programa en la toma **en ese segundo** (`at`), no se adivina con `from`. | En R05 el barrido revelaba una pantalla quieta, porque el toque había pasado antes. |
| D6 | Durante grabaciones largas, el sitio se sirve con `node tools/serve.mjs` en un proceso propio. | Al detener una grabación se cayó el servidor que reutilizaba la siguiente. |
| D7 | No se graban de una demo: precios, aranceles, becas con porcentajes, presupuestos, cifras de observatorio ni horarios. Si una sección es pura cifra (ej. `#presupuesto`), se oculta entera. | Regla base de cero cifras. |

### Voz

| # | Regla | Por qué |
| --- | --- | --- |
| V1 | **Las voces se generan de una en una, nunca en paralelo.** | Seis voces a la vez hicieron que ElevenLabs desactivara la cuenta gratis por "actividad inusual"; generadas una por una, volvió a funcionar. |
| V2 | Una sola toma por video (`generations_count: 1`). Dos tomas solo cuando se está eligiendo voz. | Cada toma cuesta ~210-340 créditos. |
| V3 | Voz de la serie: Horacio (`57D8YIbQSuE3REDPO6Vm`), modelo eleven_v4. No se cambia de voz entre videos de la misma serie. | Consistencia de marca. |
| V4 | Los tiempos por palabra se sacan con `npm run align -- <ID> "texto exacto"`, no con la transcripción de pago. | Error medio de 69 ms frente a la transcripción de ElevenLabs, sin costo. |
| V5 | El texto que se le pasa a `align` es el **mismo** que se le dio a ElevenLabs, con su puntuación. | El reparto usa las comas y los puntos para ubicar las pausas. |
| V6 | Las escenas se cortan **en las pausas de la voz**, y cada corte va al menos 0.1 s **antes** de la primera palabra de la frase siguiente. | En R05, "Cada" empezaba en 5.99 s y la escena en 6.0 s: la palabra cayó en la escena anterior. |

### Sonido

| # | Regla | Por qué |
| --- | --- | --- |
| S1 | Todo video lleva **voz + música**. Uno sin audio pierde a quien escucha con el teléfono en la mano. | R02, R04 y R07 salieron mudos en la primera vuelta. |
| S2 | La música va **12 dB por debajo de la voz** (`"music": { "db": -12 }`; con -18 casi no se oía) y además se agacha mientras la voz habla (*sidechain*, lo hace `produce`). Entra en 0.4 s, acompaña la tarjeta final y se apaga en el último 0.9 s. Mezcla final a -14 LUFS. | Que la música no opaque la voz. |
| S3 | Solo música con licencia clara: hoy, las dos pistas originales de `music/` generadas con vidIQ (libres de regalías). El sonido en tendencia se agrega desde la app, nunca dentro del MP4. | Derechos. |
| S4 | Las pistas se alternan en el orden de publicación (pulso, marimba, pulso…) para que dos videos seguidos no suenen igual. | Variedad en el feed. |

### Composición

| # | Regla | Por qué |
| --- | --- | --- |
| C1 | Con voz, los subtítulos salen de las palabras dichas; las escenas de texto cinético (`text`, `cards`) no llevan subtítulo, porque el texto grande ya lo es. | Duplicado y saturación. |
| C2 | Los subtítulos se cortan por frase y por coma, en bloques parejos de 2-3 palabras, sin dejar palabras sueltas. | "hecha:", "fotos," y "teléfono." quedaban solas. |
| C3 | `voice.captionsFrom` salta lo que el gancho ya dice en pantalla. | Si no, el gancho y el primer subtítulo repiten lo mismo. |
| C4 | `produce` exige `hyperframes check` con 0 hallazgos, incluidos los de nivel *info*. Si aparece uno, se corrige la plantilla, no se ignora. | El cierre quedaba debajo de la tarjeta final (R03); se arregló en `reel.js` para todos. |

---

## 2. Criterios creativos (lo que hace bueno a un video)

Salen de la revisión de R00-R07 y de los outliers de `research.md`.

1. **Demo en pantalla antes del segundo 3.** El formato A lo cumple solo. En B (R03), los primeros 12 s son texto: es el video más débil visualmente. Criterio para B: **máximo 6 s sin demo**; si hay tres problemas, se alternan problema y demo (problema 1 → demo que lo resuelve → problema 2 → …).
2. **Una interacción visible por video como mínimo**: un toque, algo que se escribe o un estado que cambia. Los mejores momentos de la serie son interacciones: el buscador de AUREA (R00), la aprobación de Flujo (R05), el buscador de normativa de CEDE filtrando mientras se escribe (R07).
3. **Cambio visual cada 1.5-3 s.** Una toma de más de 5 s necesita zoom, scroll o interacción dentro. R04 son 20 s de texto y tarjetas: falta material real. Con el permiso de Virginia Sapp se agregan tomas de la plataforma.
4. **La palabra clave se dice, no solo se escribe.** R00 y R02 la dicen; R06 dice "menú" pero no "menú digital", y en R07 la voz decía "portal de gobierno" y el chip "portal gubernamental" (ya se cambió la palabra clave a lo que se dice). Criterio: la voz dice la palabra clave tal cual, dentro de los primeros 5 s. Si suena forzada, se cambia la palabra clave, no el guion.
5. **El gancho hablado dura 2 s o menos.** La pregunta de R02 dura 3 s ("¿Tus clientes entran a tu página web y no saben cómo contactarte?"). Se escribe más corta: "¿Tus clientes no saben cómo escribirte?".
6. **El rótulo de la escena aporta un dato que no está en el subtítulo.** Si el rótulo repite lo que dice la voz, se cambia por el nombre de la función ("Buscador académico", "Aprobación a quien le toca").
7. **Segunda persona y dolor concreto.** Los outliers que más rinden nombran a quien mira ("Si tienes un restaurante…") y un problema que reconoce ("POV: por fin dejas el Excel"). Nada de "soluciones integrales".
8. **Un CTA de conversación además del de WhatsApp.** Probar en el comentario fijado: "Comenta COLEGIO y te mando el recorrido completo" (patrón de 4 outliers en `research.md`).
9. **Duración de 15 a 25 s.** Toda la serie está en ese rango. Para pasar de 25 s, el video necesita una segunda interacción.

---

## 3. Lista de verificación antes de producir

```
[ ] Guion aprobado; la voz dice la palabra clave tal cual en los primeros 5 s
[ ] Gancho en pantalla ≤ 7 palabras; gancho hablado ≤ 2 s
[ ] Tomas nuevas revisadas con hoja de fotogramas: sin cifras, sin plazos, sin marca CoreStruct
[ ] Al menos una interacción visible (toque, escritura, cambio de estado)
[ ] Voz generada sola (1 toma) → voz/<ID>.mp3 → npm run align
[ ] Escenas cortadas en las pausas, cada corte ≥ 0.1 s antes de la frase siguiente
[ ] music.src asignada (alternando pistas) con db -12
[ ] Ninguna escena sin cambio visual por más de 3 s
```

## 4. Rúbrica antes de publicar (0-2 por criterio, mínimo 16/20)

| Criterio | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Gancho | genérico o > 7 palabras | claro pero sin dolor | 2.ª persona + dolor concreto en ≤ 1.5 s |
| Demo temprana | después de 6 s | entre 3 y 6 s | antes de 3 s |
| Interacción | ninguna | scroll con zoom | toque, escritura o cambio de estado |
| Ritmo | escenas de > 5 s quietas | cambios cada 3-5 s | cambios cada 1.5-3 s |
| Voz | sin voz | voz desfasada o con la palabra clave ausente | voz sincronizada y palabra clave dicha |
| Subtítulos | faltan o tapan la demo | cortes torpes | bloques de 2-3 palabras sincronizados |
| Música | ausente o tapa la voz | presente pero plana | bajo la voz, con *ducking* y salida suave |
| Reglas de marca | cifra, precio o logo fuera de lugar | detalle menor | todo limpio (QA en orden) |
| Cierre | sin CTA | CTA genérico | CTA con el público ("¿Tu colegio…?") + tarjeta final |
| Copy | fuera de rango o sin palabra clave | dentro de rango | palabra clave en los primeros 80 caracteres + comentario fijado útil |

### Autoevaluación de la serie (2026-10-09, versión con voz y música)

| ID | Puntos | Lo mejor | Lo que se mejora en la próxima versión |
| --- | --- | --- | --- |
| R00 | 18 | Buscador escribiendo "sistemas" en sincronía con la voz | El gancho podría nombrar el dolor ("¿Las familias encuentran admisiones en el teléfono?") |
| R02 | 16 | El botón verde de WhatsApp siempre a la vista | Gancho hablado de 3 s; ninguna escena toca el botón de WhatsApp |
| R03 | 14 | Estructura clara de tres problemas | 12 s de texto antes de la demo; alternar problema y demo |
| R04 | 13 | Caso real con nombre propio | Todo es texto: faltan tomas de la plataforma (permiso de Virginia Sapp) |
| R05 | 18 | Barrido antes/después y aprobación en vivo | El "antes" es una maqueta genérica; podría ser un correo o una hoja de cálculo reconocible |
| R06 | 15 | Botellas de colores y el botón "Añadir" | No se dice "menú digital"; no se ve ningún QR; Verbena es una marca de bebidas, no un restaurante |
| R07 | 17 | Cortes rápidos al ritmo de la voz y el buscador filtrando | Normativa y transparencia duran 0.9 s: en la próxima voz, una frase por sección |

---

## 5. Ciclo de mejora semanal

Cada lunes, con los números de la semana anterior en `metrics.csv`:

| Métrica | Señal | Qué se cambia |
| --- | --- | --- |
| Retención a 3 s < 50 % | el gancho no detiene el scroll | probar la variante de gancho como Trial Reel; revisar el primer fotograma (¿se mueve algo?) |
| % visto < 40 % con buena retención a 3 s | el medio se cae | acortar la parte de texto y adelantar la interacción |
| Compartidos o guardados altos | el tema sirve | repetir el tema con otra demo o con otro público |
| Comentarios con preguntas | interés de compra | responder en 30-60 min y convertir la pregunta en el próximo guion |
| Mensajes de WhatsApp | el objetivo real | anotar qué video los generó y priorizar ese formato |

Reglas del ciclo:

- **Una variable por prueba.** Si cambia el gancho, no cambia la música ni la duración.
- Los Trial Reels se comparan solo entre Trial Reels.
- Lo que funciona se vuelve regla aquí (sección 1 o 2), con la fecha y el dato que lo respalda.
- Lo que no funciona en dos videos seguidos se descarta en `hooks.md`.

## 6. Bitácora de lecciones

| Fecha | Problema | Causa | Regla |
| --- | --- | --- | --- |
| 2026-10-09 | ElevenLabs desactivó la cuenta gratis | 6 generaciones en paralelo | V1 |
| 2026-10-09 | Cifras visibles en 8 tomas | El filtro de texto no cubre estadísticas sueltas | D1, D2 |
| 2026-10-09 | La marca de CoreStruct a mitad de video | Bloques promocionales dentro de las landings | D3 |
| 2026-10-09 | Barrido sobre pantalla quieta (R05) | El toque iba antes del barrido | D5 |
| 2026-10-09 | Tres videos sin audio | Voces bloqueadas y sin música | S1, S2 |
| 2026-10-09 | El cierre quedaba debajo de la tarjeta final | El CTA nunca se apagaba | C4 |
| 2026-10-09 | Palabras sueltas en subtítulos | Cortes de 3 en 3 sin mirar la frase | C2 |
| 2026-10-09 | Música casi inaudible (-34 dB en la tarjeta final) | 18 dB bajo la voz más *ducking* fuerte la escondían | S2 (ahora -12 dB, *ducking* 4:1; se ajusta con `produce --remix` sin re-renderizar) |
