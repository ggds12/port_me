export const profile = {
  name: "Gustavo Gomes",
  role: "Engenheiro de Dados",
  company: "ONR",
  yearsAtCompany: 2,
  location: "Brasil",
  email: "",
  bio: "Engenheiro de dados em atividade. Cuido de pipelines que vão da fonte bruta ao BigQuery: ingestão, transformação e tudo que fica no meio.",
  longBio:
    "Atuo há dois anos como Engenheiro de Dados na ONR. Mantenho a plataforma que move dados de mais de 20 fontes (SQL Server, MySQL, PostgreSQL, APIs externas como CNJ, MAPA, ServiceNow e Google Workspace) para um data lake em GCS e BigQuery, servindo mais de 30 domínios de negócio sobre o padrão Bronze → Silver → Gold.",
  longBioExtra:
    "O trabalho se divide em três frentes: um microserviço de ingestão em Go com WorkerPool, circuit breaker e locks distribuídos via Redis; pipelines Apache Beam no Dataflow para transformações em escala; e orquestração de tudo via Airflow 3 com CI/CD no Azure Pipelines. Observabilidade com OpenTelemetry, Datadog APM e Prometheus fecha o ciclo.",
  links: {
    github: "https://github.com/ggds12",
    linkedin: "https://www.linkedin.com/in/gustavo-gomes-b35a38211/",
    instagram: "https://instagram.com/gugomes_______",
  },
} as const;

export const stack = [
  {
    group: "Linguagens",
    items: ["Go", "Python", "SQL"],
  },
  {
    group: "Pipelines & Orquestração",
    items: ["Apache Airflow 3", "Apache Beam", "Google Dataflow", "RabbitMQ", "Azure Pipelines"],
  },
  {
    group: "Cloud (GCP)",
    items: [
      "BigQuery",
      "Cloud Storage",
      "Cloud Run",
      "Dataflow",
      "Dataplex",
      "Datastore",
    ],
  },
  {
    group: "Dados & Formatos",
    items: ["Polars", "Trino", "Parquet / Arrow", "PyArrow", "Pydantic", "Power BI"],
  },
  {
    group: "Observabilidade",
    items: ["Datadog APM", "OpenTelemetry", "Prometheus", "OpenLineage"],
  },
  {
    group: "Mensageria & Infra",
    items: ["RabbitMQ", "Kubernetes", "Redis", "Docker", "Terraform"],
  },
  {
    group: "Bancos de Dados",
    items: ["SQL Server", "MySQL", "PostgreSQL"],
  },
] as const;

export const experience = [
  {
    role: "Engenheiro de Dados",
    company: "ONR",
    period: "2024 · Presente",
    summary:
      "Responsável pela plataforma de dados que conecta mais de 20 fontes ao data lake em GCS e BigQuery, servindo mais de 30 domínios de negócio. Atuo em três frentes que se complementam: ingestão em Go, pipelines Apache Beam e orquestração com Airflow 3.",
    highlights: [
      "Desenvolvimento e manutenção de pipelines de ingestão em larga escala com Apache Airflow 3 e Google Cloud Dataflow (Apache Beam), orquestrados em Cloud Run com CI/CD via Azure Pipelines, garantindo disponibilidade contínua de dados para mais de 30 domínios de negócio.",
      "Implementação de plataforma centralizada de ingestão em Go com suporte a múltiplas fontes (SQL Server, MySQL, PostgreSQL, BigQuery, Datastore e APIs externas), transformação para Parquet via Apache Arrow, armazenamento em GCS com processamento distribuído via RabbitMQ e Kubernetes, locks distribuídos com Redis e padrões avançados como circuit breaker e worker pool dinâmico.",
      "Arquitetura e implementação de Data Lake em camadas (Bronze/Silver/Gold) com processamento via BigQuery, Trino (SQL distribuído sobre Parquet) e Polars para análises de alta performance, integrado ao Google Dataplex para rastreabilidade de linhagem de dados.",
      "Integração com mais de 20 fontes distintas (APIs do CNJ, MAPA, ServiceNow, Monday.com, Google Workspace, sistemas judiciais e registrais), com tratamento de paginação, retry com backoff exponencial e processamento assíncrono.",
      "Construção de sistema próprio de observabilidade e auditoria de pipelines com captura automática de métricas (contagem de linhas, bytes processados, duração) via decorators, OpenTelemetry, Datadog APM e Prometheus, garantindo rastreabilidade end-to-end.",
    ],
  },
] as const;

export const projects = [
  {
    title: "Plataforma de Orquestração: Airflow 3",
    description:
      "Mais de 100 DAGs em ~50 domínios sobre o padrão Bronze → Silver → Gold em GCS e BigQuery. Auditoria estruturada via listener custom, integração com Datadog, OpenLineage e Dataplex.",
    tags: ["Python", "Airflow 3", "BigQuery", "Polars", "Trino"],
    href: "https://github.com/ggds12/airflow-patterns",
  },
  {
    title: "Ingestão Paralela em Go",
    description:
      "Microserviço Go com WorkerPool, circuit breakers e distributed locks. Consome SQL Server, MySQL, Datastore e APIs REST; escreve Parquet/Arrow particionado no GCS. Distribuído em Kubernetes com RabbitMQ.",
    tags: ["Go", "RabbitMQ", "GCS", "Parquet", "Arrow"],
    href: "https://github.com/ggds12/go-ingestion-worker",
  },
  {
    title: "Pipelines Apache Beam: Dataflow",
    description:
      "Cerca de 20 pipelines Beam (Python) deployados como Flex Templates no Dataflow. Launcher dinâmico parametriza ingestão de APIs REST, JDBC e web, Bronze → Silver (Parquet) → Gold (BigQuery).",
    tags: ["Python", "Apache Beam", "Dataflow", "Pydantic", "Terraform"],
    href: "https://github.com/ggds12/beam-pipeline-template",
  },
  {
    title: "Governança & Lineage: Dataplex",
    description:
      "Auditoria diária de conformidade de metadados em BigQuery (data_ingestao, fonte_dados, load_id, reference_date) com semáforo no Google Chat. Linhagem ponta-a-ponta registrada no Dataplex Universal Catalog, com fallback em JSON.",
    tags: ["Python", "Dataplex", "Data Catalog", "BigQuery", "FinOps"],
    href: "https://github.com/ggds12/airflow-patterns",
  },
  {
    title: "Catálogo de Dados: BigQuery",
    description:
      "Dashboard web interativo que indexa 100+ datasets e ~12 mil tabelas/views do data lake no BigQuery. Exibe freshness, linhagem upstream/downstream via Cloud Data Lineage API, métricas de governança e conformidade de nomenclatura, gerado por script Python com cache e export CSV/PDF.",
    tags: ["Python", "BigQuery", "Data Lineage API", "HTML/JS", "GCP"],
    href: "https://github.com/ggds12/airflow-patterns",
  },
] as const;
