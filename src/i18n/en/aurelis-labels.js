/**
 * English for the Aurelis Group demo — the short labels.
 *
 * The last of the Aurelis files, and the one the coverage report is most useful
 * for: almost nothing here trips a Spanish-detection heuristic. "Publicado",
 * "Cliente", "Proceso", "Capacidad" and "Disponibilidad" carry no accent and no
 * function word, so without the review bucket they would have shipped
 * untranslated on 260 pages with nothing to say they had.
 *
 * Proper nouns — the invented clients, the people, the cities — are here mapped
 * to themselves, which is the record that somebody looked.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/aurelis";

export default {
  /* ------------------------------------------------------------ page labels */

  Publicado: "Published",
  Lectura: "Read time",
  Autor: "Author",
  Periodo: "Period",
  Informe: "Report",
  Informes: "Reports",
  Cliente: "Client",
  Clientes: "Clients",
  Proceso: "Process",
  Aplicaciones: "Applications",
  Especificaciones: "Specifications",
  Descargas: "Downloads",
  "Industrias relacionadas": "Related industries",
  Certificaciones: "Certifications",
  "Certificaciones vigentes": "Current certifications",
  "Certificaciones y acreditaciones": "Certifications and accreditations",
  Familia: "Family",
  Familias: "Families",
  Entregable: "Deliverable",
  Mercados: "Markets",
  Respuesta: "Response",
  Cargo: "Job title",
  Valores: "Values",
  FAQ: "FAQ",
  "Explorar capacidades": "Explore capabilities",
  "Conocer Aurelis": "Get to know Aurelis",

  /* ---------------------------------------------------------------- figures */

  Disponibilidad: "Availability",
  Capacidad: "Capacity",
  Superficie: "Floor area",
  Retorno: "Payback",
  "Consumo anual": "Annual consumption",
  "Tiempo operativo": "Uptime",
  "Parada total": "Total outage",
  "Sectores medidos": "Districts metered",
  "Proyectos ejecutados": "Projects delivered",
  "Oficinas permanentes": "Permanent offices",
  Conjuntos: "Assemblies",
  "PUE alcanzado": "PUE achieved",
  Continuidad: "Continuity",
  Experiencia: "Experience",
  Escalabilidad: "Scalability",

  /* ----------------------------------------------------------- the industries */

  "Manufactura y proceso": "Manufacturing and process",
  "Obra civil y redes": "Civil works and networks",
  "Terminales, almacenes y transporte": "Terminals, warehouses and transport",
  "Sedes, campus y activos propios": "Offices, campuses and owned assets",

  /* -------------------------------------------------------- the four stages */

  Entender: "Understand",
  Implementar: "Implement",
  Optimizar: "Optimise",
  "Entregable · Activo probado y documentado":
    "Deliverable · A tested and documented asset",

  /* ----------------------------------------------------------- the scope lists */

  "Obra civil e industrial bajo contrato llave en mano":
    "Civil and industrial works under a turnkey contract",
  "Pruebas, puesta en marcha y entrega documentada":
    "Testing, commissioning and a documented handover",
  "Mantenimiento preventivo, correctivo y predictivo":
    "Preventive, corrective and predictive maintenance",
  "Ciberseguridad industrial bajo IEC 62443": "Industrial cyber security to IEC 62443",
  "Ciberseguridad industrial": "Industrial cyber security",
  "Seguridad y salud": "Health and safety",
  "Protecciones coordinadas": "Coordinated protection",
  "Telecontrol listo": "Telecontrol ready",

  /* ---------------------------------------------------------------- contact */

  "Canales directos": "Direct channels",
  "Perfil corporativo": "Company profile",
  "Lunes a viernes · 07:30 – 17:30 (GMT-6)": "Monday to Friday · 07:30 – 17:30 (GMT-6)",
  "Contacto · Aurelis Group": "Contact · Aurelis Group",
  "Empresa · Aurelis Group": "Company · Aurelis Group",
  "Infraestructura · Aurelis Group": "Infrastructure · Aurelis Group",
  "Sistemas y equipamiento · Aurelis Group": "Systems and equipment · Aurelis Group",
  "Skid SK-500 — Conjuntos modulares · Aurelis Group":
    "SK-500 Skid — Modular assemblies · Aurelis Group",
  "Contacto — Aurelis Group": "Contact — Aurelis Group",

  /* --------------------------------------------------------- company facts */

  "Constituida en 1998": "Incorporated in 1998",
  "Cinco oficinas permanentes": "Five permanent offices",
  "Casa matriz": "Head office",
  "Oficina regional": "Regional office",
  "Oficina permanente": "Permanent office",
  "Presencia internacional": "International presence",
  "Primer taller propio": "First in-house workshop",
  "Salida regional": "Going regional",
  "Programa 2030": "2030 programme",
  "Crecer responsablemente": "Growing responsibly",
  Ambiente: "Environment",
  Personas: "People",
  Gobernanza: "Governance",
  "Directora General": "Chief Executive",
  "Director Comercial": "Commercial Director",
  "y operamos infraestructura": "and we operate infrastructure",

  /* --------------------------------------------------- names, kept as written */

  "Marcela Ruiz Alvarado": "Marcela Ruiz Alvarado",
  "Diego Sandoval Pineda": "Diego Sandoval Pineda",
  "Anjali Kapoor Restrepo": "Anjali Kapoor Restrepo",
  "Cementos Talara": "Cementos Talara",
  "Vega Minerals": "Vega Minerals",
  "Banco Peninsular": "Banco Peninsular",
  "Puerto Aranda": "Puerto Aranda",
  Hidralsa: "Hidralsa",
  Honduras: "Honduras",
  Madrid: "Madrid",
  Houston: "Houston",
  "Estados Unidos": "United States",
  "Torre Aurelis · Tegucigalpa": "Torre Aurelis · Tegucigalpa",
  "Sede corporativa · alzado norte": "Corporate headquarters · north elevation",
  "ALZADO NORTE · SEDE CORPORATIVA": "NORTH ELEVATION · CORPORATE HEADQUARTERS",
  "RETRATO CORPORATIVO": "CORPORATE PORTRAIT",

  /* Initials on the leadership portraits, and the studio's own monogram. */
  GAL: "GAL",
  MR: "MR",
  JV: "JV",
  AK: "AK",
  DS: "DS",

  /* -------------------------------------------------------- data-sheet values */

  "Corriente nominal": "Rated current",
  Protecciones: "Protection",
  Telecontrol: "Telecontrol",
  Norma: "Standard",
  Racks: "Racks",
  Redundancia: "Redundancy",
  "Caudal nominal": "Rated flow",
  Sello: "Seal",
  Motor: "Motor",
  Controlador: "Controller",
  Interfaz: "Interface",
  "Entradas digitales": "Digital inputs",
  Salidas: "Outputs",
  Protocolo: "Protocol",

  "Barra simple, doble barra o interruptor y medio":
    "Single busbar, double busbar or breaker-and-a-half",
  "12 minutos a plena carga": "12 minutes at full load",
  "Cartucho simple o doble presurizado": "Single or pressurised double cartridge",
  "IE3, 400/460 V, 50/60 Hz": "IE3, 400/460 V, 50/60 Hz",
  "IP55 (IP66 opcional)": "IP55 (IP66 optional)",
  "AC A106 Gr.B / AI 304L / AI 316L": "CS A106 Gr.B / SS 304L / SS 316L",
  "Acero estructural A36 galvanizado": "Galvanised A36 structural steel",
  "400 / 460 V, 3F + N + T": "400 / 460 V, 3P + N + E",
  "IP54 interior · IP65 intemperie": "IP54 indoor · IP65 outdoor",
  "8 × 4-20 mA aisladas": "8 × isolated 4–20 mA",
  "16 × contacto seco": "16 × volt-free contact",
  "Solar 120 Wp + banco 100 Ah": "120 Wp solar + 100 Ah bank",
  "LTE Cat-M1 + respaldo satelital": "LTE Cat-M1 + satellite back-up",
  "Modbus TCP, Profinet, OPC UA": "Modbus TCP, Profinet, OPC UA",
  "MQTT / Modbus TCP / DNP3": "MQTT / Modbus TCP / DNP3",
  "IEC 61850 / DNP3": "IEC 61850 / DNP3",

  "IEC 62271 · IEC 61850 · ISO 9001": "IEC 62271 · IEC 61850 · ISO 9001",
  "20 – 28 semanas": "20 – 28 weeks",

  "PDF · 2,6 MB": "PDF · 2.6 MB",
  "PDF · 1,4 MB": "PDF · 1.4 MB",
  "XLSX · 380 KB": "XLSX · 380 KB",

  /* ------------------------------------------ the last of the short labels */

  IP66: "IP66",
  ISO: "ISO",
  REG: "REG",
  Noticia: "News",
  Trimestral: "Quarterly",
  "< 2 s": "< 2 s",
  "Informes bajo solicitud": "Reports on request",
  "Mercados atendidos": "Markets served",
  "Estudios entregados": "Studies delivered",
  "Proyectos entregados": "Projects delivered",
  "Disciplinas integradas": "Disciplines integrated",
  "Activos bajo contrato": "Assets under contract",
  "Disponibilidad media contratada": "Average contracted availability",
  "Capital en repuesto": "Capital tied up in spares",

  "Monitoreo incluido": "Monitoring included",
  "Probado bajo carga": "Tested under load",
  "Protocolo FAT documentado": "Documented FAT protocol",
  "Reserva declarada": "Declared spare capacity",
  "Enlace redundante": "Redundant link",
  "Almacenamiento local": "Local storage",
  "Independencia declarada": "Independence declared",
  "Cumplimiento normativo": "Regulatory compliance",
  "Falla anticipada, no atendida": "Failures caught, not attended",
  "Mantenimiento predictivo": "Predictive maintenance",

  "Planta nueva": "New-build plant",
  "Parada mayor": "Major shutdown",
  "Planta modular": "Modular plant",
  "Activo distribuido": "Distributed assets",
  "Disponibilidad contratada en molienda": "Contracted availability in milling",
  "Conjunto rotor AX-360 · corte": "AX-360 rotor assembly · section",

  "Infraestructura · Colombia": "Infrastructure · Colombia",
  "Industria · Honduras": "Manufacturing · Honduras",

  "Obra civil industrial: cimentaciones, estructuras y pavimentos":
    "Industrial civil works: foundations, structures and pavements",
  "Pruebas, precomisionado y puesta en marcha":
    "Testing, pre-commissioning and commissioning",
  "Mantenimiento preventivo y correctivo programado":
    "Scheduled preventive and corrective maintenance",

  /* The site's own URLs, in its structured data. */
  "https://www.aurelisgroup.example/servicios.html":
    "https://www.aurelisgroup.example/servicios.html",
  "https://www.aurelisgroup.example/productos.html":
    "https://www.aurelisgroup.example/productos.html",
  "https://www.aurelisgroup.example/proyectos.html":
    "https://www.aurelisgroup.example/proyectos.html",
  "https://www.aurelisgroup.example/recursos.html":
    "https://www.aurelisgroup.example/recursos.html",
  "https://www.aurelisgroup.example/industrias.html":
    "https://www.aurelisgroup.example/industrias.html",
  "https://www.aurelisgroup.example/contacto.html":
    "https://www.aurelisgroup.example/contacto.html",
  "https://www.aurelisgroup.example/empresa.html":
    "https://www.aurelisgroup.example/empresa.html",
  "https://www.aurelisgroup.example/productos/bahia-hv-138.html":
    "https://www.aurelisgroup.example/productos/bahia-hv-138.html",
};
