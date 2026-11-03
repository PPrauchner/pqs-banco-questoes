# Banco de Questões PQS

Página de estudo autocontida da disciplina de Processos e Qualidade de Software
(ES · UNIPAMPA): 78 questões sobre processos de desenvolvimento de software
(38 práticas + 40 teóricas), sorteadas a cada abertura, com resposta revelável.
Publicada em https://PPrauchner.github.io/pqs-banco-questoes/.

## Stack

- **Um único `index.html`** — HTML, CSS e JavaScript inline. Sem build, sem
  dependências, sem servidor. Único recurso externo: Google Fonts (Archivo,
  IBM Plex Mono, Source Serif 4).
- JavaScript em ES5 (`var`, IIFE com `"use strict"`), sem framework.
- Deploy: GitHub Pages servindo a raiz da `main` (`.nojekyll` desliga o Jekyll).

## Comandos

Para rodar: abrir `index.html` direto no navegador. Checagem dos dados:
`node scripts/checar-dados.js` (Node puro, sem dependências). Não há suíte de testes
nem linter — o resto da verificação é manual no navegador (claro/escuro,
desktop/celular).

## Estrutura do `index.html`

| Trecho | Conteúdo |
|---|---|
| `<style>` | tokens de cor em `:root`, tema escuro via `prefers-color-scheme` e `[data-theme]` |
| 1º `<script>` | dados: `window.UNIDADES` (Unidade → Prova e temas de aula, na ordem do curso) e `window.QUESTOES` — práticas (`P01`–`P38`), teóricas (`T01`–`T40`) e uma âncora por aula de Ágeis |
| 2º `<script>` | aplicação: sorteio, filtros, marcação Sei/Revisar, teclado, tema |

Formato de uma questão:
- prática: `{ id, tipo: "pratica", unidade, tema, alvo, bullets: [...], resposta }`
- teórica: `{ id, tipo: "teorica", unidade, tema, bullets: [], pergunta, resposta }`

`resposta` é uma string HTML (template literal). Marcações do usuário ficam no
`localStorage` sob a chave `pqs-processos-v1`.

## Documentação

- Glossário de domínio: [`CONTEXT.md`](CONTEXT.md)
- Decisões e porquês: [`docs/adr/`](docs/adr/)
- Restrições e calibragem: `.claude/rules/`

## Commits

Conventional Commits em pt-BR (`feat:`, `fix:`, `docs:` …).

## Agent skills

### Issue tracker

Issues no GitHub Issues de `PPrauchner/pqs-banco-questoes`, via `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

Os cinco papéis canônicos com o próprio nome (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` e `docs/adr/` na raiz. See `docs/agents/domain.md`.
