# port_me

Portfolio pessoal desenvolvido com Next.js 15, React 19 e Tailwind CSS 4.

## Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + Tailwind CSS 4
- **Linguagem:** TypeScript

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Idiomas (PT · EN · ES)

| Idioma | Home | Currículo |
| --- | --- | --- |
| Português | `/` | `/cv` |
| English | `/en` | `/en/cv` |
| Español | `/es` | `/es/cv` |

Todos os textos ficam em `lib/i18n/` (`pt.ts`, `en.ts`, `es.ts`). Os três seguem o tipo `Dict`
(`lib/i18n/types.ts`), então o TypeScript acusa se faltar algum texto em um dos idiomas.

Para validar que nada ficou sem tradução, com o servidor rodando:

```bash
npm run check:i18n
```

O script confere se os dicionários têm as mesmas chaves e abre as 6 páginas procurando
textos de outro idioma que tenham vazado (inclusive `aria-label`, `<title>` e meta tags).
