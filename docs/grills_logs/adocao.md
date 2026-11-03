# Grill — Restrições e calibragem do projeto

Início: 2026-11-03

Objetivo: registrar o que não pode mudar no projeto e como o trabalho é fatiado,
para que fique um backup versionado dessas decisões.

**P:** Onde ficam as issues, e com que labels de triagem?
**R:** GitHub Issues de `PPrauchner/pqs-banco-questoes`, com os cinco papéis canônicos
pelo próprio nome. Contexto de domínio único: `CONTEXT.md` e `docs/adr/` na raiz.

**P:** Quais restrições do projeto não podem mudar?
**R:** As seis da lista abaixo, como propostas.

**P:** Com tudo num único `index.html`, qual é a unidade de trabalho e quais são as camadas?
**R:** A unidade é a Aula (Tema). As camadas são estilo, dados e aplicação, um commit para cada.

## Restrições decididas

- Test command: none — sem suíte de testes nem linter; verificação manual no navegador
  (claro/escuro, desktop/celular).
- Um único `index.html` autocontido: HTML, CSS e JS inline, sem build, sem dependência,
  sem servidor; único recurso externo é o Google Fonts.
- JavaScript em ES5 (`var`, IIFE com `"use strict"`), por decisão do projeto.
- Deploy pelo GitHub Pages servindo a raiz da `main`; `.nojekyll` obrigatório.
- IDs de questão (`P01`…, `T01`…) nunca são renumerados; questão nova continua a
  sequência, para preservar as Marcas já salvas.
- A chave do `localStorage` (`pqs-processos-v1`) não muda.

## Calibragem decidida

- **Quebra de trabalho:** a unidade é a Aula (Tema). Uma issue que cobre mais de uma
  Aula, ou que mistura questões novas com mudança na aplicação, vira plano de sub-tarefas.
- **Camadas:** estilo (`<style>`), dados (1º `<script>`, `window.QUESTOES`) e aplicação
  (2º `<script>`). Um commit por camada.
