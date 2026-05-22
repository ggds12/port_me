export const cv = {
  pdfHref: "/gustavo-gomes-cv.pdf",
  stack: [
    { label: "Linguagens", items: ["Go", "Python", "SQL"] },
    {
      label: "Orquestração",
      items: ["Apache Airflow", "Apache Beam", "RabbitMQ"],
    },
    {
      label: "GCP",
      items: ["BigQuery", "Cloud Storage", "Dataflow", "Cloud Run", "Dataplex"],
    },
    {
      label: "Dados",
      items: ["Polars", "Pandas", "Parquet / Arrow", "Trino", "Pydantic"],
    },
    {
      label: "Observabilidade",
      items: ["Datadog", "Prometheus", "OpenLineage", "OpenTelemetry"],
    },
    { label: "Infra", items: ["Docker", "Kubernetes", "Terraform", "Redis"] },
  ],
  roles: [
    {
      title: "Engenheiro de Dados",
      company: "ONR",
      period: "2024 · Presente",
      summary:
        "Mantenho a plataforma de dados que conecta dezenas de fontes ao data lake em GCS + BigQuery. Atuo em três frentes: ingestão em Go, pipelines Apache Beam e orquestração com Airflow 3.",
      highlights: [
        "Mais de 100 DAGs no Airflow 3 sobre o padrão Bronze → Silver → Gold, com TaskFlow API e auditoria estruturada via listener customizado.",
        "Microserviço Go com WorkerPool, circuit breakers e distributed locks (Redis), consumindo RabbitMQ e escrevendo Parquet/Arrow particionado no GCS.",
        "Cerca de 20 pipelines Apache Beam empacotados como Flex Templates no Dataflow, parametrizados por launcher dinâmico e validados com Pydantic.",
        "Linhagem ponta-a-ponta com OpenLineage + Dataplex; observabilidade com Datadog APM, Prometheus e logs estruturados.",
      ],
    },
  ],
  education: [
    {
      title: "Bacharelado em Ciência da Computação",
      institution: "Universidade São Judas Tadeu",
      period: "fev 2024 · dez 2027",
    },
    {
      title: "Técnico em Desenvolvimento de Sistemas",
      institution: "ETEC - Escola Técnica Estadual de São Paulo",
      period: "2020 · 2021",
    },
  ],
  certifications: [],
} as const;
