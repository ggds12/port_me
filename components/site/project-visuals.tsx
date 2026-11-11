import type { Dict } from "@/lib/i18n";

type V = Dict["visuals"];

/**
 * "Prints" ilustrativos de cada projeto, feitos em HTML/CSS
 * (no lugar de screenshots), com pequenas animações em loop.
 */

function Chrome({ title, children, tone = "light" }: { title: string; children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <div className={`win win-${tone}`}>
      <div className="win-bar">
        <i />
        <i />
        <i />
        <span>{title}</span>
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}

/** Airflow: grafo de DAG com tarefas acendendo em sequência. */
export function DagVisual({ t }: { t: V }) {
  const cols = [
    ["extract_sqlserver", "extract_mysql", "extract_api_cnj"],
    ["bronze_to_silver"],
    ["quality_checks", "lineage_emit"],
    ["silver_to_gold"],
  ];
  let n = 0;
  return (
    <Chrome title="airflow · dag: dominio_registros">
      <div className="dag">
        {cols.map((c, ci) => (
          <div className="dag-col" key={ci}>
            {c.map((t) => (
              <div className="dag-node" key={t} style={{ "--d": `${n++ * 0.45}s` } as React.CSSProperties}>
                <b />
                {t}
              </div>
            ))}
          </div>
        ))}
        <svg className="dag-lines" viewBox="0 0 400 140" preserveAspectRatio="none" aria-hidden="true">
          <path d="M92 28 C 120 28 120 70 140 70 M92 70 L140 70 M92 112 C120 112 120 70 140 70 M222 70 C 240 70 240 46 258 46 M222 70 C240 70 240 94 258 94 M330 46 C 345 46 345 70 352 70 M330 94 C345 94 345 70 352 70" />
        </svg>
      </div>
      <div className="dag-foot">
        <span>
          <i className="ok" />
          success · 104 DAGs
        </span>
        <span>{t.nextRun}</span>
      </div>
    </Chrome>
  );
}

/** Go: terminal com logs do worker pool rolando. */
export function GoVisual(_: { t: V }) {
  const lines = [
    ["INFO", "pool started", "workers=16 queue=rabbitmq"],
    ["INFO", "lock acquired", "redis key=ingest:orders ttl=30s"],
    ["INFO", "w03 ▸ sqlserver.orders", "→ gs://bronze/orders/dt=2026-11-11 · 412k rows"],
    ["INFO", "w07 ▸ mysql.contracts", "→ parquet (arrow) · 88.1 MB"],
    ["WARN", "api.cnj 429", "retry in 1.6s (backoff)"],
    ["INFO", "breaker cnj", "half-open → closed"],
    ["INFO", "w11 ▸ datastore.events", "→ gs://bronze/events · 1.2M rows"],
    ["INFO", "w02 ▸ postgres.ledger", "→ parquet · 54.7 MB"],
    ["INFO", "batch done", "23 sources · 4m12s · 0 errors"],
  ];
  return (
    <Chrome title="~/ingestion-worker — go run ./cmd/worker" tone="dark">
      <div className="term">
        <div className="term-scroll">
          {[...lines, ...lines].map(([lvl, a, b], i) => (
            <p key={i}>
              <span className="t-time">12:0{(i % 9) + 1}:{String((i * 7) % 60).padStart(2, "0")}</span>
              <span className={`t-${lvl.toLowerCase()}`}>{lvl}</span> <span className="t-a">{a}</span>{" "}
              <span className="t-b">{b}</span>
            </p>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

/** Beam: etapas do pipeline com elementos fluindo entre elas. */
export function BeamVisual({ t, n }: { t: V; n: string }) {
  const steps = [
    ["ReadFromAPI", t.restPaging],
    ["Validate", "Pydantic"],
    ["ToParquet", "Silver · GCS"],
    ["WriteToBigQuery", "Gold"],
  ];
  return (
    <Chrome title="dataflow · flex template · job running">
      <div className="beam">
        {steps.map(([s, d], i) => (
          <div className="beam-step" key={s}>
            <div className="beam-box">
              <strong>{s}</strong>
              <small>{d}</small>
              <em>{[18_420, 18_377, 18_377, 18_377][i].toLocaleString(n)} el/s</em>
            </div>
            {i < steps.length - 1 && (
              <div className="beam-pipe">
                <i style={{ animationDelay: `${i * 0.3}s` }} />
                <i style={{ animationDelay: `${i * 0.3 + 0.7}s` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Chrome>
  );
}

/** Dataplex: semáforo de conformidade por dataset. */
export function GovVisual({ t }: { t: V }) {
  const rows: [string, string, "ok" | "warn" | "bad", number][] = [
    ["registros_gold", "4/4", "ok", 100],
    ["financeiro_silver", "4/4", "ok", 100],
    ["atendimento_gold", "3/4", "warn", 75],
    ["contratos_bronze", "4/4", "ok", 100],
    ["legado_tmp", "1/4", "bad", 25],
  ];
  return (
    <Chrome title={t.govTitle}>
      <div className="gov">
        <div className="gov-head">
          <span>{t.govDataset}</span>
          <span>{t.govCompliance}</span>
          <span />
        </div>
        {rows.map(([d, c, s, p]) => (
          <div className="gov-row" key={d}>
            <span className="mono">{d}</span>
            <span className="gov-bar">
              <i className={s} style={{ width: `${p}%` }} />
            </span>
            <span className={`dot ${s}`} title={`${c} ${t.govFields}`} />
          </div>
        ))}
        <div className="gov-chat">
          <b>Google Chat</b> 🟢 18 · 🟡 3 · 🔴 1 — {t.govReport}
        </div>
      </div>
    </Chrome>
  );
}

/** Catálogo: busca + tabela com frescor dos dados. */
export function CatalogVisual({ t }: { t: V }) {
  const rows: [string, string, number][] = [
    ["gold.registros_diarios", t.ago[0], 96],
    ["silver.contratos", t.ago[1], 84],
    ["gold.financeiro_mensal", t.ago[2], 70],
    ["bronze.api_cnj", t.ago[3], 52],
    ["silver.atendimentos", t.ago[4], 28],
  ];
  return (
    <Chrome title={t.catTitle}>
      <div className="cat">
        <div className="cat-search">
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="none" stroke="currentColor" strokeWidth="2.5" d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.5-2 5 5" />
          </svg>
          <span className="cat-typing">registros</span>
        </div>
        {rows.map(([t, f, p]) => (
          <div className="cat-row" key={t}>
            <span className="mono">{t}</span>
            <span className="cat-fresh">
              <i style={{ width: `${p}%` }} />
            </span>
            <span className="cat-time">{f}</span>
          </div>
        ))}
      </div>
    </Chrome>
  );
}
