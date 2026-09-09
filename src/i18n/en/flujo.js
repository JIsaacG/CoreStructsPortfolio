/**
 * English for the Flujo demo — the workflow console.
 *
 * Flujo is a working interface rather than a site: a purchase request is filed,
 * a rule reads the amount and picks who has to authorise it, the clock runs on
 * each approver, and a document with a verification code comes out of the far
 * end. The English has to keep two registers apart — the product's own voice,
 * which explains, and the console's, which labels — and it has to keep the
 * administrative vocabulary consistent, because the same words are the states
 * of a machine: Recibida/Received, En validación/In validation, En
 * aprobación/In approval, Aprobada/Approved, Finalizada/Closed.
 *
 * "Expediente" is the one term worth a note. It is the whole file on a request:
 * the form, the approvals, the log and the document. "Record" is what an
 * English-language back office calls that, and it is used throughout.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/flujo";

export default {
  /* ------------------------------------------------------------ the product */

  Flujo: "Flujo",
  "Flujo, inicio": "Flujo, home",
  "Gestión administrativa": "Administrative management",
  "Flujo · Gestión administrativa": "Flujo · Administrative management",
  "Gestión administrativa · Flujo": "Administrative management · Flujo",
  "Gestión administrativa · Módulo demostrativo":
    "Administrative management · Demonstration module",
  "Módulo demostrativo de CoreStruct": "A CoreStruct demonstration module",
  "Consola de automatización": "Automation console",
  "Ir a la consola": "Go to the console",
  "Volver a la consola": "Back to the console",
  "Quiero automatizar mis procesos →": "I want to automate my processes →",

  "Consola de automatización administrativa: una solicitud, la regla que la enruta, las personas que la autorizan y el documento que produce. Datos ficticios.":
    "An administrative automation console: a request, the rule that routes it, the people who " +
    "authorise it and the document it produces. Fictional data.",
  "Demostración de un motor de flujos administrativos: solicitudes, reglas de aprobación, responsables, tiempos de respuesta, documentos generados y trazabilidad.":
    "A demonstration of an administrative workflow engine: requests, approval rules, owners, " +
    "response times, generated documents and an audit trail.",
  "Demostración de portafolio creada por CoreStruct. Las personas, las cifras, los documentos y los procesos mostrados son ficticios.":
    "A portfolio demonstration built by CoreStruct. The people, figures, documents and processes " +
    "shown are fictional.",
  "Demostración de portafolio · CoreStruct. Los nombres, métricas, personas y procesos mostrados son ficticios y se utilizan exclusivamente para demostrar las capacidades de la plataforma.":
    "A portfolio demonstration · CoreStruct. The names, metrics, people and processes shown are " +
    "fictional and exist only to demonstrate what the platform can do.",
  "Los nombres, métricas, personas y procesos mostrados son ficticios y se utilizan exclusivamente para demostrar las capacidades de la plataforma.":
    "The names, metrics, people and processes shown are fictional and exist only to demonstrate " +
    "what the platform can do.",
  "Datos ficticios": "Fictional data",
  "Sin servidor": "No server",
  "Ejemplo demostrativo": "Illustrative example",
  Simulación: "Simulated",
  Esc: "Esc",

  /* ---------------------------------------------------------------- the hero */

  "Ejecute una solicitud <em>de principio a fin</em>.":
    "Run a request <em>from start to finish</em>.",
  '<span class="fx-demo">Datos ficticios</span><span class="fx-demo">Sin servidor</span>':
    '<span class="fx-demo">Fictional data</span><span class="fx-demo">No server</span>',
  "Una compra interna viaja hoy por correos, hojas de cálculo y firmas que hay que perseguir. Aquí la regla decide quién autoriza, el sistema vigila el plazo y el expediente se archiva solo.":
    "An internal purchase travels today through emails, spreadsheets and signatures somebody has to " +
    "chase. Here the rule decides who authorises it, the system watches the clock, and the record " +
    "files itself.",

  /* ------------------------------------------------------------- the console */

  "Buscar expediente": "Search records",
  "Buscar por código, concepto, solicitante o estado":
    "Search by reference, subject, requester or status",
  "Ningún expediente coincide con la búsqueda.": "No record matches that search.",
  "Procesos que corre el motor": "Processes the engine runs",
  "Secciones del expediente": "Record sections",
  "Ruta, decisión y cierre": "Route, decision and closing",
  "Resultado del expediente": "Record outcome",

  /* The six processes, with the tooltip each carries. */
  "Solicitud de compra": "Purchase request",
  "Solicitud de vacaciones": "Leave request",
  "Solicitud de viáticos": "Travel expense request",
  Viáticos: "Travel expenses",
  "Bienes, servicios y suministros con cargo a un centro de costo.":
    "Goods, services and supplies charged to a cost centre.",
  "Días de descanso, permisos y licencias del personal.":
    "Staff leave, time off and absences.",
  "Anticipo de gastos de misión y liquidación posterior.":
    "Travel advances and the settlement that follows.",
  "Alta, renovación y expediente documental de proveedores.":
    "Supplier onboarding, renewal and document file.",
  "Reportes de infraestructura, equipos y servicios generales.":
    "Reports on infrastructure, equipment and facilities.",
  "Constancias, autorizaciones y trámites internos del personal.":
    "Certificates, authorisations and internal staff paperwork.",

  /* --------------------------------------------------------------- statuses */

  Recibida: "Received",
  "En validación": "In validation",
  "En aprobación": "In approval",
  Aprobada: "Approved",
  Aprobado: "Approved",
  Rechazada: "Rejected",
  Finalizada: "Closed",
  Vencida: "Overdue",
  "Cambios solicitados": "Changes requested",
  Pendiente: "Pending",
  Correcto: "Correct",
  "Sin enviar": "Not submitted",

  /* ---------------------------------------------------------- who does what */

  Sistema: "System",
  Solicitante: "Requester",
  Responsable: "Owner",
  "Responsable actual": "Current owner",
  "Jefatura inmediata": "Line manager",
  Jefatura: "Management",
  Administración: "Administration",
  Finanzas: "Finance",
  "Recursos Humanos": "Human Resources",
  "RR. HH.": "HR",
  Liquidación: "Settlement",
  "Dirección Administrativa": "Administrative Division",
  "Dirección Ejecutiva": "Executive Office",
  "Jefatura de Finanzas": "Head of Finance",
  "Jefatura de Personal": "Head of Personnel",
  "Jefatura de Servicios Generales": "Head of Facilities",
  "Servicios Generales": "Facilities",
  "Administración General": "General Administration",
  Empleado: "Employee",

  "Administración · Dirección Administrativa": "Administration · Administrative Division",
  "Finanzas · Jefatura de Finanzas": "Finance · Head of Finance",
  "RR. HH. · Jefatura de Personal": "HR · Head of Personnel",
  "Jefatura inmediata · Jefatura de Servicios Generales": "Line manager · Head of Facilities",

  /* People are fictional, and their names stay as written. */
  "María López": "María López",
  "Sofía Herrera": "Sofía Herrera",
  "Carlos Mejía": "Carlos Mejía",
  "Andrea Lagos": "Andrea Lagos",
  "Alejandro Rivera": "Alejandro Rivera",
  "Lucía Fernández": "Lucía Fernández",
  "Óscar Padilla": "Óscar Padilla",
  "Daniela Cruz": "Daniela Cruz",
  "Marcela Zúniga": "Marcela Zúniga",
  "Rodrigo Salgado": "Rodrigo Salgado",
  "Karla Núñez": "Karla Núñez",
  "Iván Bustillo": "Iván Bustillo",
  "Patricia Andino": "Patricia Andino",
  "Jorge Medina": "Jorge Medina",
  "Ricardo Paz": "Ricardo Paz",
  "Tecnología Central S.A.": "Tecnología Central S.A.",
  ML: "ML",
  SH: "SH",
  CM: "CM",
  AL: "AL",

  "Responsable: María López.": "Owner: María López.",
  "Responsable: Sofía Herrera.": "Owner: Sofía Herrera.",
  "Responsable: Carlos Mejía.": "Owner: Carlos Mejía.",
  "Responsable: Andrea Lagos.": "Owner: Andrea Lagos.",
  "Responsable: María López · tiempo objetivo 24 horas.":
    "Owner: María López · target 24 hours.",
  "Responsable actual del expediente. Persona ficticia.":
    "Who currently holds the record. A fictional person.",

  /* ------------------------------------------------------------ the records */

  "Seguimiento del expediente": "Record progress",
  "Fecha de registro": "Filed on",
  "Tiempo objetivo": "Target time",
  "Tiempo restante": "Time left",
  Resolución: "Resolution",
  "Regla aplicada": "Rule applied",
  "Regla de monto aplicada": "Amount rule applied",
  Historial: "History",
  Bitácora: "Audit log",
  Aprobaciones: "Approvals",
  Documento: "Document",
  Resuelva: "Decide",

  "Solicitud creada": "Request created",
  "Validación automática": "Automatic validation",
  "Validación automática completada": "Automatic validation complete",
  Automática: "Automatic",
  Automático: "Automatic",
  Finalización: "Closing",
  "Documento y archivo": "Document and filing",
  "Documento generado": "Document generated",
  "Documento generado automáticamente": "Document generated automatically",
  "Código de verificación": "Verification code",
  "Notificación preparada": "Notification prepared",
  "Notificación al solicitante": "Notification to the requester",
  "Envío simulado al solicitante.": "Simulated send to the requester.",

  "Campos obligatorios y centro de costo verificados.":
    "Required fields and cost centre verified.",
  "Campos obligatorios, adjunto, centro de costo y monto verificados.":
    "Required fields, attachment, cost centre and amount verified.",
  "Revisado conforme al procedimiento interno.": "Reviewed under the internal procedure.",
  "Jefatura inmediata aprobó": "Line manager approved",
  "Administración aprobó": "Administration approved",
  "Finanzas aprobó": "Finance approved",
  "Recursos Humanos aprobó": "Human Resources approved",
  "Asignada a Administración": "Assigned to Administration",

  "Expediente · Solicitud de compra": "Record · Purchase request",
  "Expediente · Solicitud de vacaciones": "Record · Leave request",
  "Expediente · Solicitud de viáticos": "Record · Travel expense request",
  "Expediente 2026 · Administración": "2026 file · Administration",

  "Marca de verificación demostrativa. No es un código legible.":
    "Illustrative verification mark. It is not a scannable code.",
  "Marca y código demostrativos. No corresponden a ningún registro real.":
    "Illustrative mark and code. They do not correspond to any real record.",
  "Marca y código demostrativos. No corresponden a ningún registro y no son legibles por un lector de códigos.":
    "Illustrative mark and code. They correspond to no record and cannot be read by a scanner.",

  "Este expediente aún no ha generado un documento final. Se generará al completar las aprobaciones.":
    "This record has not produced a final document yet. One is generated when the approvals are " +
    "complete.",
  "Sin autorizaciones registradas todavía. La solicitud está con Administración.":
    "No authorisations recorded yet. The request is with Administration.",

  /* ------------------------------------------------------------- the rules */

  "Solicitudes inferiores a L 25,000 requieren únicamente la autorización de la jefatura inmediata.":
    "Requests below L 25,000 need only the line manager's authorisation.",
  "Solicitudes superiores a L 25,000 requieren aprobación de Administración y Finanzas.":
    "Requests above L 25,000 need approval from Administration and Finance.",
  "«Solicitudes superiores a L 25,000 requieren aprobación de Administración y Finanzas.»":
    "“Requests above L 25,000 need approval from Administration and Finance.”",
  "Solicitudes superiores a L 100,000 requieren aprobación de Administración, Finanzas y Dirección Ejecutiva.":
    "Requests above L 100,000 need approval from Administration, Finance and the Executive Office.",
  "L 58,500.00 supera el umbral de L 25,000: se requieren dos autorizaciones.":
    "L 58,500.00 is over the L 25,000 threshold: two authorisations are required.",
  "El visto bueno de jefatura se resuelve en el registro; autorizan Administración y Finanzas.":
    "The line manager's sign-off is settled at filing; Administration and Finance authorise.",
  "Proceso solicitud de vacaciones: 2 autorización(es).": "Leave request process: 2 authorisation(s).",
  "1 aprobación(es)": "1 approval(s)",
  "2 aprobación(es)": "2 approval(s)",
  "3 aprobación(es)": "3 approval(s)",

  /* -------------------------------------------------------------- the form */

  "Datos de la solicitud de compra": "Purchase request details",
  "Complete la solicitud": "Fill in the request",
  "Cambie el monto y mire cómo cambia la ruta de la derecha.":
    "Change the amount and watch the route on the right change with it.",
  "Qué se solicita": "What is being requested",
  Concepto: "Subject",
  "Centro de costo": "Cost centre",
  "Compra de bienes": "Goods purchase",
  "Coordinación Administrativa": "Administrative Coordination",
  Justificación: "Justification",
  "Renovación de equipo utilizado por el personal administrativo.":
    "Replacement of equipment used by administrative staff.",
  "Este campo es obligatorio.": "This field is required.",
  "El concepto es requerido.": "The subject is required.",
  "El monto estimado es requerido.": "The estimated amount is required.",
  "Opcional: en vez de escribirlo, léalo del adjunto.":
    "Optional: instead of typing it, read it off the attachment.",
  "412 KB · extracción simulada": "412 KB · simulated extraction",
  "Fecha del documento": "Document date",
  "Usar información": "Use this information",
  "Ejecutar automatización": "Run the automation",
  "Envío no disponible sin JavaScript": "Submitting needs JavaScript",
  "Nada se transmite: todo ocurre en su navegador.":
    "Nothing is transmitted: it all happens in your browser.",

  /* --------------------------------------------------------- the engine run */

  "Lo que el motor hace solo.": "What the engine does on its own.",
  "Información registrada": "Information recorded",
  "Validando información": "Validating the information",
  "Centro de costo identificado": "Cost centre identified",
  "Registro de la solicitud SOL-2026-0148 con un documento adjunto.":
    "Filing of request SOL-2026-0148 with one attached document.",
  "¿Quién debe autorizar?": "Who has to authorise?",
  "Lo decide el monto. Se recalcula al escribir.":
    "The amount decides. It is recalculated as you type.",
  "Administración · 24h 00m": "Administration · 24h 00m",
  "Aparece en cuanto ejecute la automatización.":
    "It appears as soon as you run the automation.",
  "Usted decide en nombre de esta persona.": "You are deciding on this person's behalf.",
  "Cierre automático, sin intervención.": "Closes automatically, with nobody involved.",
  "Actualización de estado": "Status update",
  "En aprobación → Aprobada": "In approval → Approved",
  "Generación de documento": "Document generation",
  "Registro en bitácora": "Written to the audit log",
  "10 asientos de auditoría": "10 audit entries",
  "Preparación de notificación": "Notification prepared",
  "Flujo de autorización": "Authorisation flow",
  Siguiente: "Next",
  "El mismo motor, otro formulario y otra cadena de autorización.":
    "The same engine, a different form and a different authorisation chain.",

  /* ------------------------------------------------------------ the outcome */

  "Lo que produjo": "What it produced",
  "Se llena solo, a medida que el flujo avanza.": "It fills itself in as the flow advances.",
  "Autorizaciones con constancia": "Authorisations on record",
  "Asientos de bitácora": "Audit log entries",
  "Correos que hubo que perseguir": "Emails somebody had to chase",
  "Cada autorización dejará aquí su responsable, su hora, su comentario y su resultado.":
    "Each authorisation will leave its owner, its time, its comment and its outcome here.",
  "El documento se genera solo, al completarse las aprobaciones.":
    "The document generates itself once the approvals are complete.",
  "La bitácora se escribe sola en cuanto envíe la solicitud.":
    "The audit log writes itself the moment you submit the request.",
  Para: "To",
  "Su solicitud ha completado el flujo de aprobación. Puede consultar el expediente completo, las autorizaciones registradas y el documento generado desde el portal.":
    "Your request has completed the approval flow. You can review the full record, the " +
    "authorisations on file and the generated document from the portal.",

  "María López · 30 de agosto de 2026, 10:42": "María López · 30 August 2026, 10:42",
  "Carlos Mejía · 30 de agosto de 2026, 11:18": "Carlos Mejía · 30 August 2026, 11:18",

  /* ---------------------------------------------------------- what it fixes */

  "¿Qué resuelve?": "What does it solve?",
  "Cuatro trámites que el motor deja de pedirle a una persona.":
    "Four errands the engine stops asking a person to run.",
  "Nadie pregunta a quién enviarlo": "Nobody asks who to send it to",
  "La solicitud no se pierde en un escritorio": "The request does not get lost on a desk",
  "El documento no se redacta dos veces": "The document is not written twice",
  "La auditoría no es una arqueología": "An audit stops being an excavation",
  "Tiempo de procesamiento": "Processing time",
  "Consulta de estado": "Status lookup",
  "Ejemplo ilustrativo del tipo de indicadores que una organización podría medir tras digitalizar sus procesos.":
    "An illustration of the kind of measure an organisation might track once its processes are " +
    "digitised.",

  /* The before/after pairs, in both of the layouts that render them. */
  '<span class="gw-gain__before">Una ronda de correos para averiguar quién tiene que autorizar.</span><span class="gw-gain__after">El monto elige el circuito antes de que nadie abra el expediente.</span>':
    '<span class="gw-gain__before">A round of emails to work out who has to authorise it.</span>' +
    '<span class="gw-gain__after">The amount picks the circuit before anybody opens the record.</span>',
  '<span class="gw-gain__before">Perseguir la firma sin saber en qué bandeja está parada.</span><span class="gw-gain__after">El expediente sabe de quién es el turno y cuánto tiempo lleva ahí.</span>':
    '<span class="gw-gain__before">Chasing a signature without knowing whose inbox it is sitting ' +
    'in.</span><span class="gw-gain__after">The record knows whose turn it is and how long it has ' +
    "been there.</span>",
  '<span class="gw-gain__before">Volver a teclear los mismos datos en una constancia a mano.</span><span class="gw-gain__after">Sale generado, con las firmas registradas y su código de verificación.</span>':
    '<span class="gw-gain__before">Retyping the same details into a certificate by hand.</span>' +
    '<span class="gw-gain__after">It comes out generated, with the signatures on file and its own ' +
    "verification code.</span>",
  '<span class="gw-gain__before">Reconstruir después quién aprobó qué, buscando en correos viejos.</span><span class="gw-gain__after">Cada acción queda asentada con su hora, su responsable y su comentario.</span>':
    '<span class="gw-gain__before">Reconstructing afterwards who approved what, by digging through ' +
    'old emails.</span><span class="gw-gain__after">Every action is entered with its time, its ' +
    "owner and its comment.</span>",

  "<span>Antes</span>Una ronda de correos para averiguar quién tiene que autorizar.":
    "<span>Before</span>A round of emails to work out who has to authorise it.",
  "<span>Ahora</span>El monto elige el circuito antes de que nadie abra el expediente.":
    "<span>Now</span>The amount picks the circuit before anybody opens the record.",
  "<span>Antes</span>Perseguir la firma sin saber en qué bandeja está parada.":
    "<span>Before</span>Chasing a signature without knowing whose inbox it is sitting in.",
  "<span>Ahora</span>El expediente sabe de quién es el turno y cuánto tiempo lleva ahí.":
    "<span>Now</span>The record knows whose turn it is and how long it has been there.",
  "<span>Antes</span>Volver a teclear los mismos datos en una constancia a mano.":
    "<span>Before</span>Retyping the same details into a certificate by hand.",
  "<span>Ahora</span>Sale generado, con las firmas registradas y su código de verificación.":
    "<span>Now</span>It comes out generated, with the signatures on file and its own verification code.",
  "<span>Antes</span>Reconstruir después quién aprobó qué, buscando en correos viejos.":
    "<span>Before</span>Reconstructing afterwards who approved what, by digging through old emails.",
  "<span>Ahora</span>Cada acción queda asentada con su hora, su responsable y su comentario.":
    "<span>Now</span>Every action is entered with its time, its owner and its comment.",

  '<span class="wf-guide__step" data-wf-guide-step>Demo guiada</span> <span data-wf-guide-text>Preparando la demostración…</span>':
    '<span class="wf-guide__step" data-wf-guide-step>Guided demo</span> ' +
    "<span data-wf-guide-text>Preparing the demonstration…</span>",

  /* ------------------------------------------------- the fifteen requests */

  "3 computadoras portátiles": "3 laptop computers",
  "Adquisición de tres computadoras portátiles.": "Purchase of three laptop computers.",
  "Misión técnica a Comayagua": "Technical mission to Comayagua",
  "Reparación de aire acondicionado": "Air conditioning repair",
  "Vacaciones del 12 al 23 de octubre": "Leave from 12 to 23 October",
  "Licencias ofimáticas (25 puestos)": "Office software licences (25 seats)",
  "Alta de proveedor de imprenta": "Onboarding a printing supplier",
  "Mobiliario de archivo": "Filing furniture",
  "Taller regional en Choluteca": "Regional workshop in Choluteca",
  "Suministros de oficina del trimestre": "Quarterly office supplies",
  "Cambio de luminarias del segundo nivel": "Replacing the second-floor lighting",
  "Servidor de respaldo y almacenamiento": "Backup and storage server",
  "Permiso por estudio": "Study leave",
  "Renovación de contrato de limpieza": "Cleaning contract renewal",
  "Sesión de Consejo en San Pedro Sula": "Board session in San Pedro Sula",
  "Constancia laboral": "Employment certificate",

  "3 computadoras portátiles · Alejandro Rivera": "3 laptop computers · Alejandro Rivera",
  "Misión técnica a Comayagua · Lucía Fernández": "Technical mission to Comayagua · Lucía Fernández",
  "Reparación de aire acondicionado · Óscar Padilla":
    "Air conditioning repair · Óscar Padilla",
  "Vacaciones del 12 al 23 de octubre · Daniela Cruz":
    "Leave from 12 to 23 October · Daniela Cruz",
  "Licencias ofimáticas (25 puestos) · Marcela Zúniga":
    "Office software licences (25 seats) · Marcela Zúniga",
  "Alta de proveedor de imprenta · Rodrigo Salgado":
    "Onboarding a printing supplier · Rodrigo Salgado",
  "Mobiliario de archivo · Karla Núñez": "Filing furniture · Karla Núñez",
  "Taller regional en Choluteca · Iván Bustillo": "Regional workshop in Choluteca · Iván Bustillo",
  "Suministros de oficina del trimestre · Patricia Andino":
    "Quarterly office supplies · Patricia Andino",
  "Cambio de luminarias del segundo nivel · Óscar Padilla":
    "Replacing the second-floor lighting · Óscar Padilla",
  "Servidor de respaldo y almacenamiento · Marcela Zúniga":
    "Backup and storage server · Marcela Zúniga",
  "Permiso por estudio · Andrea Lagos": "Study leave · Andrea Lagos",
  "Renovación de contrato de limpieza · Rodrigo Salgado":
    "Cleaning contract renewal · Rodrigo Salgado",
  "Sesión de Consejo en San Pedro Sula · Lucía Fernández":
    "Board session in San Pedro Sula · Lucía Fernández",
  "Constancia laboral · Jorge Medina": "Employment certificate · Jorge Medina",

  /* Leave-request fields. */
  "Fecha de inicio": "Start date",
  "Días solicitados": "Days requested",
  "10 días hábiles": "10 working days",
  "24 horas": "24 hours",
  "48 horas": "48 hours",
  "72 horas": "72 hours",

  /* The page title and description of each of the fifteen files. */
  "SOL-2026-0134 · Solicitud de viáticos · Flujo":
    "SOL-2026-0134 · Travel expense request · Flujo",
  "SOL-2026-0135 · Solicitud de compra · Flujo": "SOL-2026-0135 · Purchase request · Flujo",
  "SOL-2026-0136 · Solicitud de vacaciones · Flujo": "SOL-2026-0136 · Leave request · Flujo",
  "SOL-2026-0137 · Solicitud de compra · Flujo": "SOL-2026-0137 · Purchase request · Flujo",
  "SOL-2026-0138 · Solicitud de vacaciones · Flujo": "SOL-2026-0138 · Leave request · Flujo",
  "SOL-2026-0139 · Solicitud de compra · Flujo": "SOL-2026-0139 · Purchase request · Flujo",
  "SOL-2026-0140 · Solicitud de compra · Flujo": "SOL-2026-0140 · Purchase request · Flujo",
  "SOL-2026-0141 · Solicitud de viáticos · Flujo":
    "SOL-2026-0141 · Travel expense request · Flujo",
  "SOL-2026-0142 · Solicitud de compra · Flujo": "SOL-2026-0142 · Purchase request · Flujo",
  "SOL-2026-0143 · Solicitud de compra · Flujo": "SOL-2026-0143 · Purchase request · Flujo",
  "SOL-2026-0144 · Solicitud de compra · Flujo": "SOL-2026-0144 · Purchase request · Flujo",
  "SOL-2026-0145 · Solicitud de vacaciones · Flujo": "SOL-2026-0145 · Leave request · Flujo",
  "SOL-2026-0146 · Solicitud de compra · Flujo": "SOL-2026-0146 · Purchase request · Flujo",
  "SOL-2026-0147 · Solicitud de viáticos · Flujo":
    "SOL-2026-0147 · Travel expense request · Flujo",
  "SOL-2026-0148 · Solicitud de compra · Flujo": "SOL-2026-0148 · Purchase request · Flujo",

  "Expediente demostrativo SOL-2026-0134: Sesión de Consejo en San Pedro Sula. Estado Finalizada, responsable Liquidación. Datos ficticios.":
    "Demonstration record SOL-2026-0134: Board session in San Pedro Sula. Status Closed, owner " +
    "Settlement. Fictional data.",
  "Expediente demostrativo SOL-2026-0135: Renovación de contrato de limpieza. Estado Rechazada, responsable Finanzas. Datos ficticios.":
    "Demonstration record SOL-2026-0135: Cleaning contract renewal. Status Rejected, owner Finance. " +
    "Fictional data.",
  "Expediente demostrativo SOL-2026-0136: Permiso por estudio. Estado Aprobada, responsable Jefatura inmediata. Datos ficticios.":
    "Demonstration record SOL-2026-0136: Study leave. Status Approved, owner Line manager. " +
    "Fictional data.",
  "Expediente demostrativo SOL-2026-0137: Servidor de respaldo y almacenamiento. Estado Cambios solicitados, responsable Administración. Datos ficticios.":
    "Demonstration record SOL-2026-0137: Backup and storage server. Status Changes requested, owner " +
    "Administration. Fictional data.",
  "Expediente demostrativo SOL-2026-0138: Constancia laboral. Estado Finalizada, responsable RR. HH.. Datos ficticios.":
    "Demonstration record SOL-2026-0138: Employment certificate. Status Closed, owner HR. " +
    "Fictional data.",
  "Expediente demostrativo SOL-2026-0139: Cambio de luminarias del segundo nivel. Estado Finalizada, responsable Administración. Datos ficticios.":
    "Demonstration record SOL-2026-0139: Replacing the second-floor lighting. Status Closed, owner " +
    "Administration. Fictional data.",
  "Expediente demostrativo SOL-2026-0140: Suministros de oficina del trimestre. Estado Finalizada, responsable Jefatura inmediata. Datos ficticios.":
    "Demonstration record SOL-2026-0140: Quarterly office supplies. Status Closed, owner Line " +
    "manager. Fictional data.",
  "Expediente demostrativo SOL-2026-0141: Taller regional en Choluteca. Estado Aprobada, responsable Administración. Datos ficticios.":
    "Demonstration record SOL-2026-0141: Regional workshop in Choluteca. Status Approved, owner " +
    "Administration. Fictional data.",
  "Expediente demostrativo SOL-2026-0142: Mobiliario de archivo. Estado Vencida, responsable Administración. Datos ficticios.":
    "Demonstration record SOL-2026-0142: Filing furniture. Status Overdue, owner Administration. " +
    "Fictional data.",
  "Expediente demostrativo SOL-2026-0143: Alta de proveedor de imprenta. Estado En validación, responsable Administración. Datos ficticios.":
    "Demonstration record SOL-2026-0143: Onboarding a printing supplier. Status In validation, " +
    "owner Administration. Fictional data.",
  "Expediente demostrativo SOL-2026-0144: Licencias ofimáticas (25 puestos). Estado En aprobación, responsable Dirección Ejecutiva. Datos ficticios.":
    "Demonstration record SOL-2026-0144: Office software licences (25 seats). Status In approval, " +
    "owner Executive Office. Fictional data.",
  "Expediente demostrativo SOL-2026-0145: Vacaciones del 12 al 23 de octubre. Estado Aprobada, responsable RR. HH.. Datos ficticios.":
    "Demonstration record SOL-2026-0145: Leave from 12 to 23 October. Status Approved, owner HR. " +
    "Fictional data.",
  "Expediente demostrativo SOL-2026-0146: Reparación de aire acondicionado. Estado Recibida, responsable Jefatura inmediata. Datos ficticios.":
    "Demonstration record SOL-2026-0146: Air conditioning repair. Status Received, owner Line " +
    "manager. Fictional data.",
  "Expediente demostrativo SOL-2026-0147: Misión técnica a Comayagua. Estado Aprobada, responsable Finanzas. Datos ficticios.":
    "Demonstration record SOL-2026-0147: Technical mission to Comayagua. Status Approved, owner " +
    "Finance. Fictional data.",
  "Expediente demostrativo SOL-2026-0148: 3 computadoras portátiles. Estado En aprobación, responsable Administración. Datos ficticios.":
    "Demonstration record SOL-2026-0148: 3 laptop computers. Status In approval, owner " +
    "Administration. Fictional data.",

  "Solicitud de compra · registro 28 de agosto de 2026": "Purchase request · filed 28 August 2026",
  "Solicitud de compra · registro 29 de agosto de 2026": "Purchase request · filed 29 August 2026",
  "Solicitud de compra · registro 30 de agosto de 2026": "Purchase request · filed 30 August 2026",

  /* ------------------------------------------------ the guided demo's chrome */

  "Demo guiada": "Guided demo",
  Reiniciar: "Restart",
  Pausar: "Pause",
  "En vivo": "Live",
  "5 pasos": "5 steps",
  "Pruebe:": "Try:",
  "Leer adjunto": "Read the attachment",
  Imprimir: "Print",
  Aprobar: "Approve",
  Cambios: "Changes",
  Rechazar: "Reject",
  Rechazado: "Rejected",
  Archivo: "Filing",
  "Turno actual": "Current turn",
  Paso: "Step",

  /* Processes the console offers beyond the three with a form. */
  "Permisos y vacaciones": "Leave and time off",
  Proveedores: "Suppliers",
  Mantenimiento: "Maintenance",
  "Solicitud administrativa": "Administrative request",

  /* ------------------------------------------------- the run, step by step */

  "Solicitud SOL-2026-0148": "Request SOL-2026-0148",
  "Solicitud recibida": "Request received",
  "Campos completos": "Fields complete",
  "Documento adjunto": "Document attached",
  "Monto detectado": "Amount detected",
  "Aplicando reglas administrativas": "Applying administrative rules",
  "Monto solicitado:": "Amount requested:",
  "2 aprobaciones requeridas": "2 approvals required",
  "aprobaciones requeridas": "approvals required",
  "Asignando responsables": "Assigning owners",
  "Flujo iniciado": "Flow started",
  "Solicitud aprobada": "Request approved",
  "Solicitud SOL-2026-0148 aprobada": "Request SOL-2026-0148 approved",
  "1 destinatario": "1 recipient",
  "Proceso finalizado": "Process complete",
  "Asignada a Finanzas": "Assigned to Finance",
  "Finanzas · 24h 00m": "Finance · 24h 00m",
  "Dirección Ejecutiva · Dirección Ejecutiva": "Executive Office · Executive Office",
  "Liquidación · Coordinación Administrativa": "Settlement · Administrative Coordination",

  "Escalamiento automático": "Automatic escalation",
  "Tiempo objetivo de 48 horas superado. Dirección Administrativa notificada.":
    "The 48-hour target has been exceeded. The Administrative Division has been notified.",
  "Excedido por 1h 12m": "Over by 1h 12m",
  "Expediente archivado con su historial completo.":
    "Record filed with its full history.",
  "Proceso solicitud de compra: 1 autorización(es).":
    "Purchase request process: 1 authorisation(s).",
  "Sin autorizaciones registradas todavía. La solicitud está con Dirección Ejecutiva.":
    "No authorisations recorded yet. The request is with the Executive Office.",
  "Sin autorizaciones registradas todavía. La solicitud está con Jefatura inmediata.":
    "No authorisations recorded yet. The request is with the line manager.",
  "Este expediente aún no ha generado un documento final. La solicitud fue rechazada.":
    "This record produced no final document. The request was rejected.",
  "Finanzas rechazó": "Finance rejected",
  "No existe disponibilidad presupuestaria en el periodo solicitado.":
    "There is no budget available in the period requested.",
  "«Solicitud conforme a los requerimientos administrativos.»":
    "“The request meets the administrative requirements.”",
  "«Existe disponibilidad en el centro de costo Administración General.»":
    "“Funds are available in the General Administration cost centre.”",

  /* The clock, as the timeline labels it. */
  "Resuelta en 16h 18m": "Settled in 16h 18m",
  "Resuelta en 44h 12m": "Settled in 44h 12m",
  "Resuelta en 9h 06m": "Settled in 9h 06m",
  "Resuelta en 4h 36m": "Settled in 4h 36m",
  "Resuelta en 18h 54m": "Settled in 18h 54m",
  "Resuelta en 21h 24m": "Settled in 21h 24m",
  "Resuelta en 15h 48m": "Settled in 15h 48m",
  "Resuelta en 13h 12m": "Settled in 13h 12m",
  "Resuelta en 19h 30m": "Settled in 19h 30m",
  "Quedan 21h 52m": "21h 52m left",
  "Quedan 53h 28m": "53h 28m left",
  "Quedan 4h 02m": "4h 02m left",
  "Quedan 17h 32m": "17h 32m left",
  "Quedan 47h 11m": "47h 11m left",

  /* --------------------------------------------------------- record fields */

  Proveedor: "Supplier",
  "Proveedor sugerido": "Suggested supplier",
  "Monto estimado (L)": "Estimated amount (L)",
  Prioridad: "Priority",
  Baja: "Low",
  Normal: "Normal",
  Alta: "High",
  "Fecha final": "End date",
  Reemplazo: "Cover",
  Comentario: "Comment",
  Destino: "Destination",
  Proyecto: "Project",
  Adjuntos: "Attachments",
  "Documentos generados": "Documents generated",
  "Cotizacion_Equipos.pdf": "Cotizacion_Equipos.pdf",
  "Agenda_Mision.pdf": "Agenda_Mision.pdf",
  "SOL-2026-0148.pdf": "SOL-2026-0148.pdf",
  AR: "AR",
  RP: "RP",

  "Saldo disponible: 18 días.": "Balance available: 18 days.",
  "Cinco pasos, y dos de ellos ocurren después del viaje.":
    "Five steps, and two of them happen after the trip.",
  "9 y 10 de septiembre de 2026": "9 and 10 September 2026",
  "Levantamiento de información en centros educativos":
    "Data collection at schools",
  "Serie estadística 2026": "2026 statistical series",

  /* ----------------------------------------------------------- the measures */

  "Seguimiento manual": "Manual follow-up",
  "Solicitudes trazables": "Traceable requests",
};
