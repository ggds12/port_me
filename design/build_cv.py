"""
Generate Gustavo Gomes' CV as a single-page A4 PDF.
Visual philosophy: Quiet Engineer (see philosophy.md).

Design rules enforced here:
- Warm ivory ground, warm near-black ink, single amber accent.
- Instrument Serif for display, Instrument Sans for body, Geist Mono for tech.
- Single column; left rail of section numerals; hairlines only.
- 8pt baseline grid; generous margins.
"""

from pathlib import Path

from reportlab.lib.colors import Color
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

# --- Paths ---------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent
FONTS = Path(r"C:\Users\gustavo.santos\.claude\skills\canvas-design\canvas-fonts")
OUT = ROOT / "public" / "gustavo-gomes-cv.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

# --- Fonts ---------------------------------------------------------------

pdfmetrics.registerFont(TTFont("Serif", str(FONTS / "InstrumentSerif-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Serif-Italic", str(FONTS / "InstrumentSerif-Italic.ttf")))
pdfmetrics.registerFont(TTFont("Sans", str(FONTS / "InstrumentSans-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Sans-Italic", str(FONTS / "InstrumentSans-Italic.ttf")))
pdfmetrics.registerFont(TTFont("Sans-Bold", str(FONTS / "InstrumentSans-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Mono", str(FONTS / "GeistMono-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Mono-Bold", str(FONTS / "GeistMono-Bold.ttf")))

# --- Palette (sRGB approximations of portfolio OKLCH tokens) -------------

PAPER = Color(0.9803, 0.9764, 0.9490)   # warm ivory
INK = Color(0.1294, 0.1216, 0.1059)     # warm near-black
MUTED = Color(0.4313, 0.4117, 0.3725)   # warm grey
HAIRLINE = Color(0.8588, 0.8470, 0.8117)
ACCENT = Color(0.7607, 0.4470, 0.2235)  # restrained amber

PAGE_W, PAGE_H = A4
MARGIN_X = 28 * mm
MARGIN_TOP = 28 * mm
MARGIN_BOTTOM = 24 * mm
RAIL_W = 18 * mm  # left rail for section indices


# --- Primitives ----------------------------------------------------------

def hairline(c, x1, y, x2):
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(0.5)
    c.line(x1, y, x2, y)


def amber_dot(c, x, y, r=1.6):
    c.setFillColor(ACCENT)
    c.circle(x, y, r, stroke=0, fill=1)


def text(c, x, y, s, font="Sans", size=9, color=INK, tracking=0):
    if tracking:
        t = c.beginText(x, y)
        t.setFont(font, size)
        t.setFillColor(color)
        t.setCharSpace(tracking)
        t.textOut(s)
        c.drawText(t)
    else:
        c.setFillColor(color)
        c.setFont(font, size)
        c.drawString(x, y, s)


def text_right(c, x, y, s, font="Sans", size=9, color=INK, tracking=0):
    if tracking:
        w = pdfmetrics.stringWidth(s, font, size) + tracking * (len(s) - 1)
        t = c.beginText(x - w, y)
        t.setFont(font, size)
        t.setFillColor(color)
        t.setCharSpace(tracking)
        t.textOut(s)
        c.drawText(t)
    else:
        c.setFillColor(color)
        c.setFont(font, size)
        c.drawRightString(x, y, s)


def wrap_paragraph(c, x, y, text_str, width, font="Sans", size=10, leading=14, color=INK):
    """Naive word-wrap layout. Returns y after last line."""
    c.setFillColor(color)
    c.setFont(font, size)
    words = text_str.split()
    line = ""
    for w in words:
        candidate = (line + " " + w).strip()
        if pdfmetrics.stringWidth(candidate, font, size) > width and line:
            c.drawString(x, y, line)
            y -= leading
            line = w
        else:
            line = candidate
    if line:
        c.drawString(x, y, line)
        y -= leading
    return y


def section_marker(c, x_rail, y, number, eyebrow):
    """Left-rail index '0X' over centred eyebrow caps."""
    text(c, x_rail, y, number, font="Mono", size=8, color=MUTED, tracking=0.4)
    text(c, x_rail, y - 12, eyebrow, font="Mono", size=7, color=MUTED, tracking=1.6)


# --- Page ----------------------------------------------------------------

def build():
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("Gustavo Gomes — Curriculum Vitae")
    c.setAuthor("Gustavo Gomes")
    c.setSubject("Engenheiro de Dados Jr.")

    # Paper ground
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    col_x = MARGIN_X + RAIL_W
    col_w = PAGE_W - MARGIN_X - col_x

    # --- Folio: small mono mark, top-right -----------------------------
    text_right(c, PAGE_W - MARGIN_X, PAGE_H - MARGIN_TOP + 10,
               "CV · 01 / 01", font="Mono", size=7, color=MUTED, tracking=1.4)

    # --- Header row: handle line ---------------------------------------
    y = PAGE_H - MARGIN_TOP
    text(c, MARGIN_X, y, "GG", font="Mono", size=8, color=MUTED, tracking=2.0)
    text_right(c, PAGE_W - MARGIN_X, y, "GUSTAVOGOMES.DEV",
               font="Mono", size=7, color=MUTED, tracking=1.8)

    # Hairline below handle row
    y -= 8
    hairline(c, MARGIN_X, y, PAGE_W - MARGIN_X)

    # --- Name + role ----------------------------------------------------
    y -= 36
    text(c, col_x, y, "Gustavo Gomes", font="Serif", size=44, color=INK)
    # Amber accent dot — small editorial mark to the left of the name's x-height
    amber_dot(c, col_x - 10, y + 12, r=1.8)

    y -= 24
    # Italic role + small-cap seniority, generously spaced
    role_str = "engenheiro de dados"
    text(c, col_x, y, role_str, font="Serif-Italic", size=17, color=MUTED)
    role_w = pdfmetrics.stringWidth(role_str, "Serif-Italic", 17)
    # Separator and seniority, both muted
    sep_x = col_x + role_w + 12
    text(c, sep_x, y, "·", font="Sans", size=11, color=HAIRLINE)
    text(c, sep_x + 10, y, "JR.", font="Mono", size=9, color=MUTED, tracking=1.6)

    # --- Lede paragraph -------------------------------------------------
    y -= 22
    bio = (
        "Construo a infraestrutura silenciosa que move dados — da ingestão "
        "à camada analítica. Atuo com Go, Python e o ecossistema GCP."
    )
    y = wrap_paragraph(c, col_x, y, bio, col_w,
                       font="Sans-Italic", size=11, leading=15, color=INK)

    # --- Contact line ---------------------------------------------------
    y -= 8
    contact = "ggds12  ·  linkedin.com/in/gustavo-gomes  ·  Brasil"
    text(c, col_x, y, contact, font="Mono", size=8, color=MUTED, tracking=0.6)

    # --- Section: STACK -------------------------------------------------
    y -= 32
    hairline(c, col_x, y + 6, PAGE_W - MARGIN_X)
    section_marker(c, MARGIN_X, y - 4, "01", "STACK")

    stack_rows = [
        ("Linguagens",      "Go   ·   Python   ·   SQL"),
        ("Orquestração",    "Apache Airflow   ·   Apache Beam   ·   RabbitMQ"),
        ("GCP",             "BigQuery   ·   Cloud Storage   ·   Dataflow   ·   Dataplex"),
        ("Dados",           "Polars   ·   Pandas   ·   Parquet / Arrow   ·   Trino"),
        ("Observabilidade", "Datadog   ·   Prometheus   ·   OpenLineage"),
        ("Infra",           "Docker   ·   Kubernetes   ·   Terraform   ·   Redis"),
    ]
    row_y = y - 4
    for label, items in stack_rows:
        text(c, col_x, row_y, label, font="Sans", size=9, color=MUTED)
        text(c, col_x + 90, row_y, items, font="Mono", size=9, color=INK, tracking=0.1)
        row_y -= 16
    y = row_y - 4

    # --- Section: EXPERIÊNCIA ------------------------------------------
    y -= 14
    hairline(c, col_x, y + 6, PAGE_W - MARGIN_X)
    section_marker(c, MARGIN_X, y - 4, "02", "ROLES")

    # Role 1 — ONR
    y -= 6
    text(c, col_x, y, "Engenheiro de Dados Jr.", font="Serif", size=18, color=INK)
    text_right(c, PAGE_W - MARGIN_X, y, "2024 — Presente",
               font="Mono", size=9, color=MUTED, tracking=0.4)
    y -= 14
    text(c, col_x, y, "ONR", font="Sans-Bold", size=10, color=MUTED, tracking=0.6)
    y -= 14
    role_blurb = (
        "Mantenho a plataforma de dados que conecta dezenas de fontes ao data lake "
        "em GCS + BigQuery, em três frentes: ingestão em Go, pipelines Apache Beam "
        "e orquestração com Airflow 3."
    )
    y = wrap_paragraph(c, col_x, y, role_blurb, col_w,
                       font="Sans", size=10, leading=14, color=INK)

    # Bulleted highlights — minimal: em-dash bullets, mono accents
    highlights = [
        "Mais de 100 DAGs no Airflow 3 sobre o padrão Bronze → Silver → Gold, com TaskFlow API e auditoria estruturada via listener customizado.",
        "Microserviço Go com WorkerPool, circuit breakers e distributed locks (Redis), consumindo RabbitMQ e escrevendo Parquet/Arrow particionado no GCS.",
        "Cerca de 20 pipelines Apache Beam empacotados como Flex Templates no Dataflow, parametrizados por launcher dinâmico e validados com Pydantic.",
        "Linhagem ponta-a-ponta com OpenLineage + Dataplex; observabilidade com Datadog APM, Prometheus e logs estruturados.",
    ]
    y -= 4
    for h in highlights:
        text(c, col_x, y, "—", font="Sans", size=10, color=ACCENT)
        y = wrap_paragraph(c, col_x + 14, y, h, col_w - 14,
                           font="Sans", size=10, leading=14, color=INK)
        y -= 4  # small breathing room between bullets

    # --- Section: FORMAÇÃO ---------------------------------------------
    y -= 6
    hairline(c, col_x, y + 6, PAGE_W - MARGIN_X)
    section_marker(c, MARGIN_X, y - 4, "03", "EDU")

    y -= 6
    text(c, col_x, y, "Bacharelado em Ciência da Computação",
         font="Serif", size=14, color=INK)
    text_right(c, PAGE_W - MARGIN_X, y, "2019 — 2023",
               font="Mono", size=9, color=MUTED, tracking=0.4)
    y -= 14
    text(c, col_x, y, "Universidade — substituir pelo curso real",
         font="Sans-Italic", size=9, color=MUTED)

    # --- Section: CERTIFICAÇÕES ----------------------------------------
    y -= 22
    hairline(c, col_x, y + 6, PAGE_W - MARGIN_X)
    section_marker(c, MARGIN_X, y - 4, "04", "CERT")

    certs = [
        ("Google Cloud Associate Cloud Engineer", "fictício"),
        ("Apache Airflow Fundamentals",           "fictício"),
    ]
    y -= 6
    for name, tag in certs:
        text(c, col_x, y, name, font="Serif", size=12, color=INK)
        text_right(c, PAGE_W - MARGIN_X, y, tag,
                   font="Mono", size=8, color=MUTED, tracking=0.4)
        y -= 16

    # --- Footer hairline + colophon ------------------------------------
    foot_y = MARGIN_BOTTOM
    hairline(c, MARGIN_X, foot_y + 16, PAGE_W - MARGIN_X)
    text(c, MARGIN_X, foot_y, "Quiet Engineer — composto em A4",
         font="Mono", size=7, color=MUTED, tracking=1.4)
    text_right(c, PAGE_W - MARGIN_X, foot_y, "Instrument Serif · Sans · Geist Mono",
               font="Mono", size=7, color=MUTED, tracking=1.4)

    c.showPage()
    c.save()
    print(f"wrote: {OUT}")


if __name__ == "__main__":
    build()
