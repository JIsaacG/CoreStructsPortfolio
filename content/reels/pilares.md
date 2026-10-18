# Pilares para conseguir contratos

Prueba de tres tipos de Reels durante las próximas semanas. Cada video nuevo pertenece a **uno** de estos pilares (campo `"pillar"` en `reel.json`) y toma su tema del **banco de problemas típicos** de abajo. El objetivo de los tres es el mismo: que un dueño o gerente se reconozca en el problema y escriba por WhatsApp.

| Pilar | Qué hace el video | Concepto modelo | Formato base | `pillar` |
| --- | --- | --- | --- | --- |
| **Problema** | Nombra el dolor con señales concretas para que el dueño diga "eso me pasa a mí". Cierra mostrando que tiene solución. | «Cinco señales de que tu empresa necesita un software a medida» | B · Problema → solución | `problema` |
| **Solución** | Enseña *cómo* se resuelve, con la demo funcionando. Tono de "así se hace", no de venta. | «Así puedes automatizar las tareas que te quitan horas cada semana» | A · Demo scroll (o B) | `solucion` |
| **Demostración** | El mismo proceso antes (Excel, correos, papel, WhatsApp) y después (el sistema). El cambio se ve, no se explica. | «Antes y después de digitalizar un proceso empresarial» | C · Antes / después (o D) | `demostracion` |

Producir uno nuevo con su pilar: `npm run new -- R16 problema` (usa el formato base) o `npm run new -- R16 B problema`.

## Reglas por pilar

Todas las reglas de `PROMPT_REELS.md` siguen igual (hook ≤ 7 palabras, prueba de silencio, nada de precios, plazos, cifras de resultados ni "oferta"). Además:

**Problema**
- Hook que nombra el problema o promete una lista: «Cinco señales de que…», «Si esa persona falta, ¿quién sabe?», «Tu empresa corre sobre Excel y memoria».
- Los números de una lista se escriben **con letras** («Cinco señales»): es una cuenta de señales, no una cifra de resultados. El control de calidad no deja pasar dígitos en pantalla.
- Una señal por escena de texto (2.5-3.5 s cada una), redactada como algo que el dueño vive, no como una característica del producto.
- Últimos 5-6 s: corte a la demo que lo resuelve. Cierre: «¿Te pasa alguna? *Escríbenos*».

**Solución**
- Hook en clave de "así se hace": «Así puedes…», «Que tu página responda antes que tú», «Reportes que se generan solos».
- La demo aparece en el primer 1.5 s y no se va: cada paso del proceso es una escena (solicitud → aprobación → documento, por ejemplo).
- Nombrar el trabajo que desaparece (copiar y pegar, armar el reporte, perseguir la firma), nunca cuánto tiempo o dinero ahorra.

**Demostración**
- Hook de contraste: «Antes y después de digitalizar un proceso», «Una solicitud: por correo vs con flujo».
- El "antes" es genérico y creado por nosotros (hoja de cálculo, cadena de correos, carpeta llena), sin marcas reales. El "después" es la demo real.
- Mismo encuadre antes y después para que el cambio se lea sin audio (escena `wipe`).

## Banco de problemas típicos de las empresas

De aquí sale el tema de cada video. Cada problema trae un hook ya escrito para cada pilar (todos ≤ 7 palabras): así el mismo problema se puede probar en los tres pilares y comparar cuál trae más mensajes. La fuente de cada problema está en el repo (`src/data/servicios.js`, `projects.js`) y los patrones de hook en la investigación con vidIQ de abajo.

| # | Problema típico | A quién le pasa | Hook · Problema | Hook · Solución | Hook · Demostración | Demo | Palabra clave |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | La operación corre sobre Excel y la memoria de alguien | Empresas que crecieron, distribuidoras, servicios | Tu empresa corre sobre Excel y memoria | Así sacas tu operación del Excel | Del Excel compartido a un sistema | Rumbo | sistema para empresa Honduras |
| P2 | Solo una persona sabe dónde está todo | Pymes con un empleado "clave" | Si esa persona falta, ¿quién sabe? | Que la información no dependa de nadie | Antes: preguntar. Después: buscar | Rumbo · expedientes | software a medida Honduras |
| P3 | Los reportes se arman a mano cada mes | Gerencias, contabilidad, juntas directivas | ¿Tu reporte mensual se arma a mano? | Reportes que se generan solos | El mismo reporte, sin armarlo a mano | Rumbo · operaciones | sistema de reportes empresa |
| P4 | Las aprobaciones se pierden en correos y WhatsApp | Compras, RR. HH., instituciones | ¿Quién aprobó esto? Nadie lo sabe | Aprobaciones con estado y responsable visible | Una solicitud: por correo vs con flujo | Flujo | flujo de aprobaciones |
| P5 | Los mismos datos se escriben una y otra vez | Administración, ventas, bodega | Escribes los mismos datos otra vez | Captura una vez, úsalo en todo | Antes copiar y pegar, ahora un formulario | Flujo / Rumbo | automatización de procesos |
| P6 | Constancias, órdenes y documentos se llenan a mano | Colegios, RR. HH., servicios | ¿Todavía armas cada documento a mano? | Documentos que se generan solos | La misma constancia, sin llenarla a mano | Flujo · documento generado | digitalizar procesos empresa |
| P7 | Nadie sabe en qué estado va una solicitud | Atención al cliente, trámites | ¿En qué va mi solicitud? Nadie sabe | Cada solicitud con su estado visible | Solicitud perdida vs solicitud con seguimiento | Flujo · solicitudes | seguimiento de solicitudes |
| P8 | El negocio se detiene si el dueño falta | Dueños de pyme | Si faltas, ¿tu negocio sigue funcionando? | Procesos que funcionan aunque no estés | Tu operación, antes y después del sistema | Flujo + Rumbo | digitalizar mi negocio |
| P9 | Expedientes de clientes regados en carpetas y correos | Clínicas, despachos, colegios, financieras | Expedientes regados en carpetas y correos | Cada expediente completo en un lugar | Buscar un expediente: antes y después | Rumbo · expedientes | expediente digital |
| P10 | Se contesta lo mismo todos los días por WhatsApp | Cualquier negocio con atención por mensaje | ¿Contestas lo mismo todos los días? | Que tu página responda antes que tú | La misma pregunta, resuelta en la página | Landing / Aurelis | página web con WhatsApp |
| P11 | Los clientes no encuentran cómo contactarte | Negocios con página vieja o sin página | ¿Tus clientes no saben cómo contactarte? | WhatsApp a un toque desde cualquier página | Buscar tu número vs tocar un botón | Landing / Aurelis | página web Honduras |
| P12 | Pedidos que se pierden entre mensajes | Restaurantes, cafeterías, tiendas | Pedidos perdidos entre mensajes de WhatsApp | Un menú que toma el pedido | El menú en PDF vs menú digital | Verbena | menú digital restaurante |
| P13 | Se compró un software y volvió el Excel paralelo | Empresas con procesos propios | Pagaste un software y volvió el Excel | Software construido sobre tu proceso real | Enlatado vs a medida, mismo proceso | Rumbo + portafolio | software a medida Honduras |
| P14 | Las familias llaman para preguntar todo | Colegios y universidades | ¿Las familias llaman para preguntar todo? | Admisiones y fechas, a un toque | Admisiones en papel vs en línea | AUREA | página web para colegio |
| P15 | La página tarda en abrir o no se lee en el teléfono | Negocios con sitio viejo | Tu página no pierde clientes por fea | Así abre rápido en cualquier teléfono | Así abre tu página en el teléfono | Landing | página web Honduras |

Cómo se amplía: en cada "Nueva tanda" se agregan 2-3 problemas nuevos con la búsqueda de outliers de vidIQ (consultas tipo "problemas de las pymes", "errores cuando tu negocio crece", "dejar Excel", "procesos de la empresa") y se marcan aquí con la fecha. Un problema solo entra si alguna demo del repo lo resuelve.

## Lo que encontró vidIQ (10 oct 2026)

Búsqueda de outliers en Instagram y TikTok, en español, público de dueños de pyme en Latinoamérica, desde abril de 2026. Se usan como patrón, nunca como copia.

| Pilar | Cuenta | Hook en pantalla (resumen) | Rendimiento | Qué tomamos |
| --- | --- | --- | --- | --- |
| Problema | [@consul_garcia](https://www.instagram.com/reel/DckN9M6uaL1/) | Lista de errores cuando tu negocio empieza a crecer | ~984 mil vistas, 19.6x su mediana | La lista con número en el hook funciona; texto fijo sobre imagen, ritmo medio |
| Problema | [@essikamorales](https://www.instagram.com/reel/DckJl8iDD9p/) | Lo que pasa cuando tu empresa no estandariza sus procesos | ~178 mil vistas, 49.9x | El caos de oficina como primer frame; "falta de procesos" conecta con dueños |
| Problema | [@soybrendamass](https://www.instagram.com/reel/Dbwe4WwRldy/) | ¿Tu empresa sigue vendiendo si te ausentas unos días? | ~52 mil vistas, 34.2x | La dependencia del dueño es un dolor fuerte (P8) |
| Demostración | [@finanzasconvictoria](https://www.tiktok.com/@finanzasconvictoria/video/7667776363268558087) | POV: por fin dejas el Excel y usas una app | ~2 millones de vistas, 6.6x · 13 s | Grabación de pantalla en movimiento desde el segundo 0 + "dejar el Excel" (P1) |
| Solución | [@mb.suite](https://www.tiktok.com/@mb.suite/video/7661744875754343701) | Herramienta para ordenar los mensajes de WhatsApp | ~206 mil vistas, 371.8x · 53 s | Demo de software sola, sin cara, puede ser outlier si el problema es claro |
| Solución | [@marialebricenos](https://www.tiktok.com/@marialebricenos/video/7689123094509669665) | Lo que no se ve detrás de llevar un negocio | ~689 mil vistas, 14.3x · 43 s | Mostrar el "detrás" de la operación y el sistema que lo ordena |

Conclusiones para nuestros videos:
1. **Problema**: hook de lista o de consecuencia («Lo que pasa cuando…»), con caos visual en el primer frame.
2. **Solución**: la grabación de la demo puede sostener sola el video si se mueve desde el fotograma 0 y el problema se nombra en el hook.
3. **Demostración**: el "dejar el Excel" es el antes más reconocible; videos cortos (13-20 s) con texto fijo rinden bien.

## Cómo se mide la prueba

- `metrics.csv` tiene la columna `pilar`. Cada lunes se suman, por pilar: retención a 3 s, compartidos, guardados y, sobre todo, **mensajes de WhatsApp**.
- Después de 4 semanas (al menos 4 videos por pilar): el pilar que más mensajes trae pasa a ser la mitad de la producción; los otros dos se reparten el resto. Si un problema del banco funciona en un pilar, se prueba en los otros dos.
- Se anota la decisión en la tabla de abajo y en `hooks.md`.

| Fecha | Pilar ganador (WhatsApp) | Mejor retención a 3 s | Problema que más funcionó | Decisión |
| --- | --- | --- | --- | --- |
| — | pendiente de datos | — | — | — |
