import type { Dict } from "./types.ts";

export const es: Dict = {
  htmlLang: "es",
  ogLocale: "es_ES",
  numberLocale: "es-ES",
  meta: {
    title: "Gustavo Gomes · Ingeniero de Datos",
    description:
      "Ingeniero de datos. Construyo y mantengo pipelines que llevan los datos desde la fuente cruda hasta la capa analítica: ingesta, transformación y todo lo que hay en medio.",
    cvTitle: "Currículum · Gustavo Gomes",
    cvDescription: "Experiencia, formación y competencias de Gustavo Gomes, Ingeniero de Datos.",
  },
  skip: "Saltar al contenido",
  role: "Ingeniero de Datos",
  location: "Brasil",
  nav: {
    main: "Navegación principal",
    projects: "Proyectos",
    experience: "Experiencia",
    stack: "Stack",
    cv: "Currículum",
    home: "Inicio",
    downloadPdf: "Descargar PDF (PT)",
    toLight: "Cambiar a tema claro",
    toDark: "Cambiar a tema oscuro",
    language: "Idioma",
    home_aria: "Gustavo Gomes, inicio",
  },
  intro: { group: "Controles de la introducción", forward: "Avanzar", skip: "Saltar" },
  hero: {
    greet: "hola, un gusto",
    bio: [
      [
        "Soy ingeniero de datos y paso los días escribiendo",
        { chip: "Go" },
        "y",
        { chip: "Python" },
        "para construir las tuberías por donde fluye la información. Extraigo datos de",
        { mark: "más de 20 fuentes" },
        "— bases como",
        { chip: "SQL Server" },
        ",",
        { chip: "PostgreSQL" },
        "y",
        { chip: "MySQL" },
        ", además de APIs del CNJ, MAPA y ServiceNow — y lo entrego todo organizado en",
        { chip: "BigQuery" },
        ".",
      ],
      [
        "En",
        { link: "ONR", to: "experience" },
        ", me encargué de la plataforma que alimenta",
        { mark: "más de 30 dominios de negocio", tone: "blue" },
        ". Escribí un servicio de ingesta en Go con worker pool, circuit breaker y locks en",
        { chip: "Redis" },
        ", orquesté más de 100 DAGs en",
        { chip: "Airflow 3" },
        "y ejecuté pipelines de",
        { chip: "Apache Beam" },
        "en Dataflow, siempre con el patrón",
        { hand: "bronze → silver → gold." },
      ],
      [
        "Si no se mide, no está funcionando — por eso todo pasa por",
        { chip: "OpenTelemetry" },
        ",",
        { chip: "Datadog" },
        "y",
        { chip: "Prometheus" },
        ". Estudio Ciencias de la Computación en São Judas y estoy",
        { open: "abierto a oportunidades" },
        ".",
      ],
      ["Mi currículum completo está", { link: "aquí", to: "cv" }, ", y el código, en", { link: "GitHub", to: "github" }, "."],
      ["Aquí tienes un poco de lo que he construido."],
    ],
  },
  projects: {
    title: "Proyectos",
    seeAll: "Ver en GitHub",
    tech: "Tecnologías",
    viewRepo: "ver repositorio en GitHub",
    items: [
      {
        name: "Orquestación a escala",
        description:
          "Más de 100 DAGs en ~50 dominios con el patrón Bronze → Silver → Gold sobre GCS y BigQuery. Auditoría estructurada mediante un listener propio, integrada con Datadog, OpenLineage y Dataplex.",
      },
      {
        name: "Ingesta paralela en Go",
        description:
          "Microservicio en Go con WorkerPool, circuit breakers y locks distribuidos. Consume SQL Server, MySQL, Datastore y APIs REST; escribe Parquet/Arrow particionado en GCS. Distribuido en Kubernetes con RabbitMQ.",
      },
      {
        name: "Pipelines en Dataflow",
        description:
          "Unos 20 pipelines de Beam (Python) desplegados como Flex Templates en Dataflow. Un launcher dinámico parametriza la ingesta de APIs REST, JDBC y web, Bronze → Silver (Parquet) → Gold (BigQuery).",
      },
      {
        name: "Gobernanza y linaje",
        description:
          "Auditoría diaria de cumplimiento de metadatos en BigQuery (data_ingestao, fonte_dados, load_id, reference_date) con semáforo en Google Chat. Linaje de extremo a extremo registrado en Dataplex Universal Catalog, con respaldo en JSON.",
      },
      {
        name: "Catálogo de datos",
        description:
          "Dashboard web interactivo que indexa más de 100 datasets y ~12 mil tablas/vistas del data lake en BigQuery. Muestra la frescura, el linaje upstream/downstream mediante la Cloud Data Lineage API, métricas de gobernanza y cumplimiento de nomenclatura, generado por un script en Python con caché y exportación a CSV/PDF.",
      },
    ],
  },
  visuals: {
    nextRun: "próxima ejecución 02:00",
    restPaging: "REST · paginado",
    govTitle: "auditoría de metadatos · diaria",
    govDataset: "dataset",
    govCompliance: "cumplimiento",
    govFields: "campos",
    govReport: "informe enviado a las 07:00",
    catTitle: "catálogo de datos · 12.384 tablas",
    ago: ["hace 12 min", "hace 1 h", "hace 3 h", "hace 6 h", "hace 1 d"],
  },
  experience: {
    title: "Experiencia",
    summary:
      "Responsable de la plataforma de datos que conecta más de 20 fuentes al data lake en GCS y BigQuery, al servicio de más de 30 dominios de negocio. Trabajé en tres frentes complementarios: ingesta en Go, pipelines de Apache Beam y orquestación con Airflow 3.",
    highlights: [
      "Desarrollo y mantenimiento de pipelines de ingesta a gran escala con Apache Airflow 3 y Google Cloud Dataflow (Apache Beam), orquestados en Cloud Run con CI/CD mediante Azure Pipelines, garantizando la disponibilidad continua de datos para más de 30 dominios de negocio.",
      "Implementación de una plataforma centralizada de ingesta en Go compatible con múltiples fuentes (SQL Server, MySQL, PostgreSQL, BigQuery, Datastore y APIs externas), con conversión a Parquet mediante Apache Arrow y almacenamiento en GCS, procesamiento distribuido con RabbitMQ y Kubernetes, locks distribuidos con Redis y patrones avanzados como circuit breaker y worker pool dinámico.",
      "Arquitectura e implementación de un Data Lake por capas (Bronze/Silver/Gold) procesado con BigQuery, Trino (SQL distribuido sobre Parquet) y Polars para análisis de alto rendimiento, integrado con Google Dataplex para la trazabilidad del linaje de datos.",
      "Integración con más de 20 fuentes distintas (APIs del CNJ, MAPA, ServiceNow, Monday.com y Google Workspace, sistemas judiciales y registrales), con manejo de paginación, reintentos con backoff exponencial y procesamiento asíncrono.",
      "Construcción de un sistema propio de observabilidad y auditoría de pipelines con captura automática de métricas (conteo de filas, bytes procesados, duración) mediante decorators, OpenTelemetry, Datadog APM y Prometheus, garantizando trazabilidad de extremo a extremo.",
    ],
  },
  education: {
    title: "Formación académica",
    items: ["Licenciatura en Ciencias de la Computación", "Técnico en Desarrollo de Sistemas"],
  },
  stack: {
    title: "Herramientas",
    note: "lo que uso a diario",
    groups: [
      { group: "Lenguajes", tagline: "La base de todo lo que escribo." },
      { group: "Pipelines y Orquestación", tagline: "Donde los datos cobran movimiento." },
      { group: "Cloud (GCP)", tagline: "La infraestructura que sostiene el flujo." },
      { group: "Datos y Formatos", tagline: "Cómo se leen, escriben y sirven los datos." },
      { group: "Observabilidad", tagline: "Si no se mide, no está funcionando." },
      { group: "Mensajería e Infra", tagline: "La columna vertebral de la operación." },
      { group: "Bases de Datos", tagline: "Las fuentes donde todo comienza." },
    ],
  },
  contact: {
    before: "",
    hand: "¿Hablamos?",
    text: "Estoy abierto a vacantes y proyectos de ingeniería de datos. La forma más rápida de hablar conmigo es por LinkedIn o WhatsApp.",
    download: "Descargar currículum (PT)",
  },
  footer: {
    signature: "Firma",
    socials: "Redes",
    train: "Ilustración animada: un tren de vapor cruza un viaducto de piedra en un valle con montañas y un lago",
  },
  cv: {
    kicker: "Currículum",
    open: "abierto a oportunidades",
    summary:
      "Trabajo como Ingeniero de Datos, construyendo y manteniendo plataformas que llevan datos de más de 20 fuentes (SQL Server, MySQL, PostgreSQL y APIs externas como CNJ, MAPA, ServiceNow y Google Workspace) a un data lake en GCS y BigQuery, al servicio de más de 30 dominios de negocio con el patrón Bronze → Silver → Gold.",
    downloadPdf: "Descargar PDF (PT)",
    jobSummary:
      "Desarrollé y mantuve la plataforma de datos que conecta decenas de fuentes al data lake en GCS + BigQuery. Trabajé en tres frentes: ingesta en Go, pipelines de Apache Beam y orquestación con Airflow 3.",
    highlights: [
      "Más de 100 DAGs en Airflow 3 con el patrón Bronze → Silver → Gold, usando la TaskFlow API y auditoría estructurada mediante un listener propio.",
      "Microservicio en Go con WorkerPool, circuit breakers y locks distribuidos (Redis), consumiendo RabbitMQ y escribiendo Parquet/Arrow particionado en GCS.",
      "Unos 20 pipelines de Apache Beam empaquetados como Flex Templates en Dataflow, parametrizados por un launcher dinámico y validados con Pydantic.",
      "Linaje de extremo a extremo con OpenLineage + Dataplex; observabilidad con Datadog APM, Prometheus y logs estructurados.",
    ],
    skillsTitle: "Competencias",
    skillsNote: "del pipeline a la observabilidad",
    skillGroups: ["Lenguajes", "Orquestación", "GCP", "Datos", "Observabilidad", "Infra"],
    back: "Volver al portafolio",
  },
};
