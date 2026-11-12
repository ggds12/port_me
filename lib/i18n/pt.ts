import type { Dict } from "./types.ts";

export const pt: Dict = {
  htmlLang: "pt-BR",
  ogLocale: "pt_BR",
  numberLocale: "pt-BR",
  meta: {
    title: "Gustavo Gomes dos Santos · Engenheiro de Dados",
    description:
      "Gustavo Gomes dos Santos — engenheiro de dados. Construo e mantenho pipelines que movem dados da fonte bruta até a camada analítica: ingestão, transformação e tudo que fica no meio.",
    cvTitle: "Currículo · Gustavo Gomes dos Santos",
    cvDescription: "Experiência, formação e competências de Gustavo Gomes dos Santos, Engenheiro de Dados.",
  },
  skip: "Pular para o conteúdo",
  role: "Engenheiro de Dados",
  location: "Brasil",
  nav: {
    main: "Navegação principal",
    projects: "Projetos",
    experience: "Experiência",
    stack: "Stack",
    cv: "Currículo",
    home: "Início",
    downloadPdf: "Baixar PDF",
    toLight: "Mudar para tema claro",
    toDark: "Mudar para tema escuro",
    language: "Idioma",
    home_aria: "Gustavo Gomes, início",
  },
  intro: { group: "Controles da introdução", forward: "Avançar", skip: "Pular" },
  hero: {
    greet: "oi, prazer",
    bio: [
      [
        "Sou engenheiro de dados e passo os dias escrevendo",
        { chip: "Go" },
        "e",
        { chip: "Python" },
        "para construir os canos por onde a informação corre. Tiro dados de",
        { mark: "mais de 20 fontes" },
        "— bancos como",
        { chip: "SQL Server" },
        ",",
        { chip: "PostgreSQL" },
        "e",
        { chip: "MySQL" },
        ", além de APIs do CNJ, MAPA e ServiceNow — e entrego tudo organizado no",
        { chip: "BigQuery" },
        ".",
      ],
      [
        "Na",
        { link: "ONR", to: "experience" },
        ", cuidei da plataforma que alimenta",
        { mark: "mais de 30 domínios de negócio", tone: "blue" },
        ". Escrevi um serviço de ingestão em Go com worker pool, circuit breaker e locks no",
        { chip: "Redis" },
        ", orquestrei mais de 100 DAGs no",
        { chip: "Airflow 3" },
        "e rodei pipelines",
        { chip: "Apache Beam" },
        "no Dataflow, sempre no padrão",
        { hand: "bronze → silver → gold." },
      ],
      [
        "Se não é medido, não está funcionando — então tudo passa por",
        { chip: "OpenTelemetry" },
        ",",
        { chip: "Datadog" },
        "e",
        { chip: "Prometheus" },
        ". Estudo Ciência da Computação na São Judas e estou",
        { open: "aberto a oportunidades" },
        ".",
      ],
      ["O currículo completo está", { link: "aqui", to: "cv" }, ", e o código, no", { link: "GitHub", to: "github" }, "."],
      ["Aqui está um pouco do que construí."],
    ],
  },
  projects: {
    title: "Projetos",
    seeAll: "Ver no GitHub",
    tech: "Tecnologias",
    viewRepo: "ver repositório no GitHub",
    items: [
      {
        name: "Orquestração em escala",
        description:
          "Mais de 100 DAGs em ~50 domínios sobre o padrão Bronze → Silver → Gold em GCS e BigQuery. Auditoria estruturada via listener custom, integração com Datadog, OpenLineage e Dataplex.",
      },
      {
        name: "Ingestão paralela em Go",
        description:
          "Microserviço Go com WorkerPool, circuit breakers e distributed locks. Consome SQL Server, MySQL, Datastore e APIs REST; escreve Parquet/Arrow particionado no GCS. Distribuído em Kubernetes com RabbitMQ.",
      },
      {
        name: "Pipelines no Dataflow",
        description:
          "Cerca de 20 pipelines Beam (Python) deployados como Flex Templates no Dataflow. Launcher dinâmico parametriza ingestão de APIs REST, JDBC e web, Bronze → Silver (Parquet) → Gold (BigQuery).",
      },
      {
        name: "Governança & linhagem",
        description:
          "Auditoria diária de conformidade de metadados em BigQuery (data_ingestao, fonte_dados, load_id, reference_date) com semáforo no Google Chat. Linhagem ponta-a-ponta registrada no Dataplex Universal Catalog, com fallback em JSON.",
      },
      {
        name: "Catálogo de dados",
        description:
          "Dashboard web interativo que indexa 100+ datasets e ~12 mil tabelas/views do data lake no BigQuery. Exibe freshness, linhagem upstream/downstream via Cloud Data Lineage API, métricas de governança e conformidade de nomenclatura, gerado por script Python com cache e export CSV/PDF.",
      },
    ],
  },
  visuals: {
    nextRun: "próxima execução 02:00",
    restPaging: "REST · paginação",
    govTitle: "auditoria de metadados · diária",
    govDataset: "dataset",
    govCompliance: "conformidade",
    govFields: "campos",
    govReport: "relatório enviado às 07:00",
    catTitle: "catálogo de dados · 12.384 tabelas",
    ago: ["há 12 min", "há 1 h", "há 3 h", "há 6 h", "há 1 d"],
  },
  experience: {
    title: "Experiência",
    summary:
      "Responsável pela plataforma de dados que conecta mais de 20 fontes ao data lake em GCS e BigQuery, servindo mais de 30 domínios de negócio. Atuei em três frentes que se complementam: ingestão em Go, pipelines Apache Beam e orquestração com Airflow 3.",
    highlights: [
      "Desenvolvimento e manutenção de pipelines de ingestão em larga escala com Apache Airflow 3 e Google Cloud Dataflow (Apache Beam), orquestrados em Cloud Run com CI/CD via Azure Pipelines, garantindo disponibilidade contínua de dados para mais de 30 domínios de negócio.",
      "Implementação de plataforma centralizada de ingestão em Go com suporte a múltiplas fontes (SQL Server, MySQL, PostgreSQL, BigQuery, Datastore e APIs externas), transformação para Parquet via Apache Arrow, armazenamento em GCS com processamento distribuído via RabbitMQ e Kubernetes, locks distribuídos com Redis e padrões avançados como circuit breaker e worker pool dinâmico.",
      "Arquitetura e implementação de Data Lake em camadas (Bronze/Silver/Gold) com processamento via BigQuery, Trino (SQL distribuído sobre Parquet) e Polars para análises de alta performance, integrado ao Google Dataplex para rastreabilidade de linhagem de dados.",
      "Integração com mais de 20 fontes distintas (APIs do CNJ, MAPA, ServiceNow, Monday.com, Google Workspace, sistemas judiciais e registrais), com tratamento de paginação, retry com backoff exponencial e processamento assíncrono.",
      "Construção de sistema próprio de observabilidade e auditoria de pipelines com captura automática de métricas (contagem de linhas, bytes processados, duração) via decorators, OpenTelemetry, Datadog APM e Prometheus, garantindo rastreabilidade end-to-end.",
    ],
  },
  education: {
    title: "Formação acadêmica",
    items: ["Bacharelado em Ciência da Computação", "Técnico em Desenvolvimento de Sistemas"],
  },
  stack: {
    title: "Ferramentas",
    note: "o que uso no dia a dia",
    groups: [
      { group: "Linguagens", tagline: "A base de tudo que escrevo." },
      { group: "Pipelines & Orquestração", tagline: "Onde o dado ganha movimento." },
      { group: "Cloud (GCP)", tagline: "A infraestrutura que sustenta o fluxo." },
      { group: "Dados & Formatos", tagline: "Como o dado é lido, escrito e servido." },
      { group: "Observabilidade", tagline: "Se não é medido, não está funcionando." },
      { group: "Mensageria & Infra", tagline: "A espinha dorsal da operação." },
      { group: "Bancos de Dados", tagline: "As fontes de onde tudo nasce." },
    ],
  },
  contact: {
    before: "Vamos",
    hand: "conversar?",
    text: "Estou aberto a vagas e projetos de engenharia de dados. O jeito mais rápido de falar comigo é pelo LinkedIn ou WhatsApp.",
    download: "Baixar currículo",
  },
  footer: {
    signature: "Assinatura",
    socials: "Redes",
    train: "Ilustração animada: um trem a vapor atravessa um viaduto de pedra em um vale com montanhas e um lago",
  },
  cv: {
    kicker: "Currículo",
    open: "aberto a oportunidades",
    summary:
      "Atuo como Engenheiro de Dados, construindo e mantendo plataformas que movem dados de mais de 20 fontes (SQL Server, MySQL, PostgreSQL, APIs externas como CNJ, MAPA, ServiceNow e Google Workspace) para um data lake em GCS e BigQuery, servindo mais de 30 domínios de negócio sobre o padrão Bronze → Silver → Gold.",
    downloadPdf: "Baixar PDF",
    jobSummary:
      "Desenvolvi e mantive a plataforma de dados que conecta dezenas de fontes ao data lake em GCS + BigQuery. Atuei em três frentes: ingestão em Go, pipelines Apache Beam e orquestração com Airflow 3.",
    highlights: [
      "Mais de 100 DAGs no Airflow 3 sobre o padrão Bronze → Silver → Gold, com TaskFlow API e auditoria estruturada via listener customizado.",
      "Microserviço Go com WorkerPool, circuit breakers e distributed locks (Redis), consumindo RabbitMQ e escrevendo Parquet/Arrow particionado no GCS.",
      "Cerca de 20 pipelines Apache Beam empacotados como Flex Templates no Dataflow, parametrizados por launcher dinâmico e validados com Pydantic.",
      "Linhagem ponta-a-ponta com OpenLineage + Dataplex; observabilidade com Datadog APM, Prometheus e logs estruturados.",
    ],
    skillsTitle: "Competências",
    skillsNote: "do pipeline à observabilidade",
    skillGroups: ["Linguagens", "Orquestração", "GCP", "Dados", "Observabilidade", "Infra"],
    back: "Voltar ao portfólio",
  },
};
