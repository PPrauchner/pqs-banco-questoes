# Grill — Questões de Ágeis e aprimoramento do banco

Início: 2026-11-03 14:28

Objetivo: aprimorar o banco de questões e adicionar questões da unidade Ágeis
(resumos em `PQS/Resumos/04_Ageis`: Intro, FDD, DSDM, Crystal Clear, ASD, XP,
Scrum I e Scrum II).

**P:** Os temas devem seguir as aulas, como diz o glossário, incluindo a migração das 78 questões existentes (de famílias como "Cascata e variações" para aulas como "Prescritivos II — …")?
**R:** Sim. Migrar tudo para tema = aula.

**P:** Quantas questões práticas por processo ágil (FDD, DSDM, Crystal Clear, ASD, XP, Scrum)? Recomendado: 2, como o padrão atual.
**R:** 4 por processo (24 práticas), com cenários bem distintos entre si. Usuário adicionou `docs/prova_1.md` (transcrição da prova dos prescritivos) como referência de como as questões são montadas.

**P:** A pergunta da questão prática deve nomear a unidade, como na prova ("qual o processo ágil/prescritivo mais adequado…"), inclusive nas 38 existentes? Consequência: o Par próximo fica sempre dentro da mesma unidade.
**R:** Sim. E adicionar uma opção para estudar apenas o conteúdo da prova de processos ágeis.

**P:** O "conteúdo da prova de Ágeis" é a Unidade Ágeis, ou uma Prova pode cobrir várias Unidades (MVC, BPMN)? Recomendado: criar o termo Prova = conjunto de Unidades; filtro por Prova.
**R:** A prova de Ágeis não cobra MVC nem BPMN (só `04_Ageis`). Quer os dois filtros: por Unidade e por Prova.

**P:** Como mostrar a hierarquia Prova > Unidade > Tema na barra de filtros?
**R:** Dois selects em cascata: Prova; e escopo com optgroup por Unidade ("Toda a unidade" + aulas). A Prova restringe o segundo select.

**P:** Nomes dos temas seguindo a numeração das videoaulas ("Ágeis I — introdução e Manifesto" … "Ágeis VIII — Scrum: pilares e eventos"; "Prescritivos I/II/III — …", "Iterativos e incrementais — UP", "Fundamentos — …")?
**R:** Sim.

**P:** Que tema recebe uma questão cujo conteúdo atravessa duas aulas (ex.: prática de Scrum usa Scrum I e II)? Recomendado: prática = aula que apresenta o Processo-alvo; teórica = aula de onde sai a resposta.
**R:** Sim.

**P:** "Cenários bem distintos" = um ângulo de ataque por cenário (contexto; mecânica do processo como fato; desvantagem aceita; discriminação do par próximo), cada um num domínio diferente?
**R:** Sim.

**P:** O aprimoramento inclui subir os 19 prescritivos para 4 cenários? Recomendado: não agora; só auditoria do Par próximo dentro da Unidade.
**R:** Concorda. Expansão dos prescritivos vira issue needs-triage; pode gerar PRD / to-issues.

**P:** Quantas teóricas de Ágeis? Recomendado: ~36 por aula (I: 5; II–V: 4 cada; VI, VII, VIII: 5 cada) + 3–4 comparativas entre pares próximos; IDs novos continuam a sequência (P39–P62, T41…) para preservar as Marcas.
**R:** Fechado. Gerar o PRD; as issues de implementação ficam para outro agente.

## Decisões consolidadas

1. Tema = Aula, inclusive nas 78 existentes (migração).
2. Pergunta prática nomeia a Unidade ("processo ágil/prescritivo"); Par próximo sempre na mesma Unidade.
3. Termo Prova (Prova 1: Fundamentos + Prescritivos; Prova 2: Ágeis). MVC e BPMN fora.
4. Filtros por Prova e por Unidade/Tema: dois selects em cascata, optgroup por Unidade.
5. Temas nomeados pela numeração das videoaulas (Ágeis I … VIII).
6. Prática em várias aulas → aula que apresenta o Processo-alvo; teórica → aula da resposta.
7. 4 práticas por processo ágil (24), uma por Ângulo, domínios diferentes.
8. Prescritivos ficam com 2 cenários; auditoria do Par próximo; expansão vira issue needs-triage.
9. ~36 teóricas de Ágeis + 3–4 comparativas; IDs continuam a sequência.
