# Banco de Questões — Processos de Desenvolvimento de Software

Página de estudo autocontida para a disciplina de Processos e Qualidade de Software
(Engenharia de Software · UNIPAMPA). Um único `index.html`, sem servidor e sem
dependências: abre no navegador, no celular ou direto do disco.

**➡️ https://PPrauchner.github.io/pqs-banco-questoes/**

## O que tem

**142 questões**, sorteadas em nova ordem a cada abertura, com resposta revelável
questão a questão.

| Tipo | Formato |
|---|---|
| Práticas | Cenário em tópicos + *"Qual o processo prescritivo/ágil mais adequado a este projeto e por quê?"* |
| Teóricas | Definições, fases, vantagens, desvantagens e quadros comparativos |

Contagem por **Unidade**:

| Unidade | Prova | Processos | Práticas | Teóricas |
|---|---|---|---|---|
| Fundamentos | Prova 1 | — | 0 | 7 |
| Prescritivos | Prova 1 | 19 processos × 2 cenários | 38 | 33 |
| Ágeis | Prova 2 | 6 processos × 4 cenários | 24 | 40 |
| **Total** | | **25 processos** | **62** | **80** |

Cada resposta de prática liga afirmação por afirmação ao processo escolhido e diz
qual concorrente foi descartado e por quê — porque o que costuma derrubar em prova
é o par próximo (V × W, entregas em estágios × orientado a cronograma, protótipo
descartável × prototipação evolucionária, XP × Scrum, DSDM × ASD).

## Processos cobertos

Cada questão pertence a uma **Unidade** do curso, e o tema é a **aula** de onde ela
sai. A Prova 1 cobra Fundamentos e Prescritivos; a Prova 2, Ágeis.

**Fundamentos — conceitos de processo de software** — definições, classificações,
características, arquitetura e tipos de fluxo

**Prescritivos I — cascata e modelos V e W** — codificar e consertar · cascata
clássico · cascata dupla · cascata entrelaçado (sashimi) · modelo em V · modelo em W ·
cascata com subprojetos

**Prescritivos II — espiral e evolucionários** — modelo em espiral · cascata com
redução de risco · evolucionário exploratório · evolucionário com protótipos
descartáveis · prototipação evolucionária

**Prescritivos III — entregas, formal e reuso** — entregas em estágios · modelo
orientado a cronograma · entrega evolucionária · modelo orientado a ferramentas ·
desenvolvimento formal de sistemas · desenvolvimento orientado a reuso · linhas de
produto de software (SPL)

**Iterativos e incrementais — UP** — Processo Unificado (fases, disciplinas, as
quatro características centrais e MoSCoW)

**Ágeis I — introdução e Manifesto** — valores e princípios do Manifesto Ágil,
ágeis × prescritivos

**Ágeis II a VIII — os processos ágeis** — FDD · DSDM · Crystal Clear · ASD · XP ·
Scrum (papéis, artefatos, pilares e eventos)

## Recursos da página

- Sorteio aleatório a cada abertura, e botão para re-sortear a qualquer momento
- Filtro por tipo (práticas / teóricas) e por tema
- Marcação **Sei / Revisar** por questão, salva no navegador de cada pessoa, com
  filtro para revisar só o que ficou marcado
- Navegação por teclado: `←` `→` para trocar de questão, `Espaço` para revelar
- Tema claro e escuro

O tema da questão só aparece depois de revelar a resposta, para não entregar
metade do raciocínio antes da hora.

## Checagem dos dados

Ao editar questões, rode na raiz do repositório (precisa só do Node, sem instalar
nada):

```sh
node scripts/checar-dados.js
```

O script lê os dados do `index.html` e confere IDs (únicos, no padrão `P##`/`T##`,
contíguos a partir de `P01` e `T01`, sem buracos), Unidade e Tema de cada questão,
o mapeamento Unidade → Prova, os campos obrigatórios de cada tipo, o número de
práticas por Processo-alvo (2 nos prescritivos, 4 nos ágeis) e se a tabela de
contagem por Unidade deste README bate com os dados. Sai com código 1 e
uma linha por problema quando algo falha; com `ok: …` quando está tudo certo.

## Fonte

Elaborado a partir dos resumos das videoaulas de Processos de Desenvolvimento de
Software do Prof. Dr. Gilleanes Thorwald Araujo Guedes, com base bibliográfica em
Wazlawick (2013), Sommerville (2011) e Pressman; nos Ágeis, também o Manifesto
Ágil, o Scrum Guide e Cockburn (Crystal Clear).

Material de estudo, sem vínculo oficial com a disciplina. Correções e sugestões são
bem-vindas via issue.
