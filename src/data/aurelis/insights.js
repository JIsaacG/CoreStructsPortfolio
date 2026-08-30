/**
 * Resources: analysis, reports and news.
 *
 * Three pieces are readable in full at `/recursos/<slug>`; three are gated
 * reports that route to the contact page, which is how a B2B firm actually
 * distributes them. Nothing links to a file the demo does not have.
 */

export const insights = [
  {
    id: "modernizacion",
    slug: "modernizacion-sin-detener-la-planta",
    kind: "Análisis",
    date: "2026-06-18",
    dateLabel: "18 de junio, 2026",
    read: "7 min",
    plate: "cell",
    caption: "Intervención en línea activa · esquema",
    title: "Cómo se moderniza una planta que no puede parar",
    summary:
      "La restricción real de casi toda modernización industrial no es el presupuesto: " +
      "es la ventana. Cuatro decisiones que determinan si el proyecto cabe dentro de ella.",
    author: "Anjali Kapoor Restrepo",
    authorRole: "Directora Técnica",
    body: [
      { type: "p", text: "En las evaluaciones que hemos hecho en los últimos tres años, el factor que más veces descartó una alternativa técnicamente buena no fue el costo de inversión. Fue el tiempo de parada que exigía. Una planta de proceso que factura por hora tiene un precio implícito para cada hora detenida, y ese número suele ser mayor que la diferencia entre las dos opciones que se están comparando." },
      { type: "p", text: "El error habitual es tratar la ventana como un dato del final: se diseña la solución, se calcula lo que cuesta detenerse y entonces empieza la negociación. Invertir ese orden cambia el resultado del proyecto." },
      { type: "h", text: "1. Definir la ventana antes que la solución" },
      { type: "p", text: "La primera pregunta de un proyecto de modernización no debería ser qué tecnología conviene, sino cuántas horas consecutivas puede estar detenido el activo y con cuánta anticipación se puede programar la parada. Con esas dos cifras sobre la mesa, buena parte del catálogo de alternativas desaparece antes de gastar una hora de ingeniería en ella." },
      { type: "p", text: "En una de las plantas que evaluamos, la ventana máxima era de setenta y dos horas una vez al año. Esa restricción, planteada al principio, llevó directamente a una solución modular que en un escenario sin límite de parada habría sido más cara y menos elegante — y que fue la única ejecutable." },
      { type: "h", text: "2. Mover trabajo fuera de la ventana" },
      { type: "p", text: "Todo lo que pueda fabricarse, cablearse, programarse y probarse en taller reduce el riesgo de la parada dos veces: acorta el trabajo en sitio y traslada los errores a un lugar donde corregirlos no cuesta producción. Un módulo prefabricado que llega probado convierte semanas de montaje en días de conexión." },
      { type: "p", text: "Lo mismo aplica al trabajo que puede hacerse con la instalación energizada o en operación. En la ampliación de una subestación de 138 kV, el 84 % de las horas-hombre se ejecutaron con la instalación en servicio; a la ventana nocturna sólo llegó lo que exigía corte." },
      { type: "h", text: "3. Ensayar la secuencia, no sólo planificarla" },
      { type: "p", text: "Un plan de maniobra revisado en una sala de reuniones y un plan ensayado por la gente que va a ejecutarlo son documentos distintos. El ensayo — en simulador, en maqueta o en seco sobre la instalación — es donde aparecen los pasos que faltaban, las llaves que no estaban y las dos operaciones que alguien había supuesto simultáneas." },
      { type: "list", items: [
        "Ensayar con el personal que ejecutará, no con el que planificó",
        "Cronometrar cada paso y sumar los tiempos reales, no los estimados",
        "Definir el punto de no retorno y el criterio para abortar antes de llegar a él",
        "Preparar la vuelta atrás con el mismo detalle que el avance",
      ] },
      { type: "h", text: "4. Aceptar que la ventana puede no alcanzar" },
      { type: "p", text: "La conclusión honesta de algunos estudios es que el trabajo no cabe. Cuando eso ocurre, las salidas son tres: dividirlo en varias ventanas con una configuración intermedia estable, construir capacidad redundante temporal, o aceptar una parada mayor y planificarla con un año de anticipación. Las tres son caras. Descubrirlo durante la parada lo es mucho más." },
      { type: "quote", text: "El costo de una parada no planificada no se compara con el de la obra. Se compara con el de la producción que no ocurrió." },
      { type: "p", text: "La modernización de un activo en operación es, antes que un problema técnico, un problema de secuencia. Los proyectos que salen bien casi siempre se decidieron en las primeras semanas, cuando alguien preguntó cuánto tiempo había y diseñó hacia atrás desde ahí." },
    ],
  },

  {
    id: "disponibilidad",
    slug: "que-significa-comprar-disponibilidad",
    kind: "Análisis",
    date: "2026-04-30",
    dateLabel: "30 de abril, 2026",
    read: "6 min",
    plate: "plant",
    caption: "Servicios auxiliares · elevación",
    title: "Qué significa realmente comprar disponibilidad",
    summary:
      "Un contrato de disponibilidad cambia quién asume el riesgo de que el activo se " +
      "detenga. Es un instrumento útil y mal entendido: estas son sus condiciones.",
    author: "Joaquín Vidal Ferrer",
    authorRole: "Director de Operaciones",
    body: [
      { type: "p", text: "En un contrato de mantenimiento tradicional, el cliente compra horas y repuestos. Si el equipo falla, paga la reparación. En un contrato de disponibilidad, compra un resultado: el activo debe estar disponible un porcentaje acordado del tiempo, y si no lo está, el proveedor asume una penalización." },
      { type: "p", text: "La diferencia parece contractual y es operativa. Cambia por completo los incentivos de quien mantiene el equipo." },
      { type: "h", text: "El incentivo se invierte" },
      { type: "p", text: "Bajo un contrato por horas, un proveedor gana más cuando el equipo falla más. Nadie lo diría en voz alta, pero la estructura de precios lo dice sola. Bajo un contrato de disponibilidad, cada falla es un costo propio, y por eso el proveedor invierte en detectarla antes: la medición predictiva deja de ser un servicio adicional que hay que vender y pasa a ser una defensa de su propio margen." },
      { type: "h", text: "Cuatro condiciones sin las cuales no funciona" },
      { type: "p", text: "Un contrato de disponibilidad mal escrito genera más conflicto que el esquema que reemplaza. Estas son las condiciones que, en nuestra experiencia, separan uno que funciona de uno que termina en arbitraje." },
      { type: "list", items: [
        "Una línea base medida. Comprometer un 99,4 % sin saber en cuánto está hoy el activo es una apuesta, no un contrato.",
        "Una definición de indisponibilidad acordada evento por evento, con las exclusiones escritas antes de firmar.",
        "Medición que ambas partes ven en tiempo real, sobre la misma fuente de datos.",
        "Un plazo suficiente para que quepa al menos un ciclo completo de mantenimiento mayor.",
      ] },
      { type: "h", text: "Qué pasa con el personal" },
      { type: "p", text: "La pregunta que más aparece en la mesa es qué ocurre con el equipo de mantenimiento existente. En la mayoría de las transiciones que hemos hecho, conservarlo fue la mejor decisión: conoce el activo, conoce sus manías y su incorporación acorta la curva de aprendizaje de meses a semanas. Lo que cambia no es la gente, es a quién reporta el indicador." },
      { type: "h", text: "Cuándo no conviene" },
      { type: "p", text: "Un contrato de disponibilidad no tiene sentido sobre un activo al final de su vida útil, ni sobre uno cuyo modo de falla depende de una variable que el operador no controla — calidad de la materia prima, por ejemplo, o estabilidad de la red eléctrica. En esos casos el precio del riesgo se dispara y termina siendo más caro que asumirlo internamente." },
      { type: "quote", text: "Si el proveedor no puede influir en la causa de la falla, cobrará por asumirla igual. Y cobrará bien." },
      { type: "p", text: "El instrumento sirve cuando el riesgo puede ser gestionado por quien lo asume. Esa es toda la regla." },
    ],
  },

  {
    id: "medicion",
    slug: "el-dato-que-nadie-mide",
    kind: "Análisis",
    date: "2026-02-11",
    dateLabel: "11 de febrero, 2026",
    read: "5 min",
    plate: "hall",
    caption: "Adquisición de datos · arquitectura",
    title: "El dato que nadie mide y todos discuten",
    summary:
      "La mayoría de las reuniones de operación se van en decidir si la cifra es correcta. " +
      "Instrumentar bien no es medir más: es acabar con esa discusión.",
    author: "Anjali Kapoor Restrepo",
    authorRole: "Directora Técnica",
    body: [
      { type: "p", text: "Hay una escena que se repite en plantas de sectores que no tienen nada que ver entre sí. La reunión mensual de operación empieza, aparece el número de rendimiento, y los primeros cuarenta minutos se van en establecer si ese número es real. Producción lo calcula de una forma, mantenimiento de otra, y el sistema de gestión tiene una tercera versión." },
      { type: "p", text: "Cuando por fin hay acuerdo sobre la cifra, queda poco tiempo para lo único que importaba: decidir qué hacer con ella." },
      { type: "h", text: "El problema casi nunca es la falta de sensores" },
      { type: "p", text: "En los diagnósticos que hacemos, la conclusión más frecuente no es que falte instrumentación. Es que la que existe no está reconciliada: dos medidores en serie que no coinciden, un totalizador que se reinicia con cada corte de energía, un dato de producción que se captura a mano al cierre del turno y otro que sale del PLC." },
      { type: "p", text: "Añadir un tercer medidor a esa situación no resuelve nada. Produce una tercera cifra en discusión." },
      { type: "h", text: "Tres cosas que sí lo resuelven" },
      { type: "list", items: [
        "Una fuente declarada por cada indicador: qué instrumento, qué cálculo, qué frecuencia. Escrito y visible en el mismo tablero donde aparece el número.",
        "Reconciliación automática entre mediciones redundantes, con la desviación expuesta en lugar de escondida.",
        "Trazabilidad hacia atrás: poder abrir cualquier cifra del reporte mensual hasta la lectura que la originó.",
      ] },
      { type: "h", text: "El efecto secundario" },
      { type: "p", text: "En los proyectos donde esto se resolvió primero, el beneficio inmediato no fue una mejora de rendimiento. Fue que las reuniones cambiaron de tema. Cuando el dato deja de estar en disputa, la conversación se mueve hacia la causa, y la causa es lo único sobre lo que alguien puede actuar." },
      { type: "quote", text: "Instrumentar bien no genera información nueva. Elimina una discusión vieja, que es más valioso." },
      { type: "p", text: "Es también la parte más barata de cualquier programa de digitalización, y la que más veces se salta porque no se ve en una demostración." },
    ],
  },

  /* Gated: routed to the contact page rather than to a file the demo lacks. */
  {
    id: "informe-capacidad",
    kind: "Informe",
    date: "2026-05-20",
    dateLabel: "Mayo 2026",
    read: "48 páginas",
    plate: "report",
    caption: "Informe de capacidad industrial",
    title: "Capacidad industrial en Centroamérica · Edición 2026",
    summary:
      "Utilización, cuellos de botella y planes de inversión declarados en 140 instalaciones " +
      "de la región. Disponible bajo solicitud.",
    gated: true,
  },
  {
    id: "informe-energia",
    kind: "Informe",
    date: "2026-03-04",
    dateLabel: "Marzo 2026",
    read: "32 páginas",
    plate: "grid",
    caption: "Informe de continuidad eléctrica",
    title: "Continuidad eléctrica y costo de la interrupción",
    summary:
      "Qué cuesta realmente una hora sin energía en ocho sectores industriales, y cuánto " +
      "de esa exposición es evitable. Disponible bajo solicitud.",
    gated: true,
  },
  {
    id: "noticia-madrid",
    kind: "Noticia",
    date: "2026-01-22",
    dateLabel: "22 de enero, 2026",
    read: "2 min",
    plate: "tower",
    caption: "Centro técnico de Madrid",
    title: "Aurelis amplía su centro técnico en Madrid",
    summary:
      "La sede europea suma un laboratorio de pruebas de protecciones y duplica el equipo " +
      "de ciberseguridad industrial.",
    gated: true,
  },
];

export const insightsIntro = {
  label: "Recursos",
  title: "Análisis, informes y novedades",
  text:
    "Lo que el equipo técnico publica cuando un problema se repite lo suficiente como " +
    "para merecer una respuesta escrita.",
};

export const articles = () => insights.filter((item) => item.slug);
export const byId = (id) => insights.find((item) => item.id === id);
