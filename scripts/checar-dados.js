/**
 * @file Checks the question bank data declared in index.html.
 *
 * Runs with plain Node, no dependencies: `node scripts/checar-dados.js`.
 * Loads the data <script> of index.html (window.QUESTOES and window.UNIDADES)
 * in an isolated context and validates it against the rules of CONTEXT.md and
 * against the counts README.md declares.
 * Exits with code 1 and one line per problem when any rule fails.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ID_PATTERN = /^([PT])(\d{2})$/;
const PREFIXO_POR_TIPO = { pratica: "P", teorica: "T" };
const NOME_DA_COLUNA = { processos: "processos", praticas: "práticas", teoricas: "teóricas" };
const ROTULO_TOTAL = "Total";

/**
 * @typedef {Object} Questao
 * @property {string} id
 * @property {string} tipo - "pratica" or "teorica".
 * @property {string} unidade
 * @property {string} tema
 * @property {string} [alvo]
 * @property {string[]} bullets - The Cenário; empty for a teórica.
 * @property {string} [pergunta]
 * @property {string} resposta
 */

/**
 * @typedef {Object} Tema
 * @property {string} nome
 * @property {string} [alvo] - Processo-alvo presented by this aula.
 */

/**
 * @typedef {Object} Unidade
 * @property {string} nome
 * @property {string} prova
 * @property {number} praticasPorAlvo - How many práticas each Processo-alvo has.
 * @property {Tema[]} temas - In course order.
 */

/**
 * Loads the data script of an index.html in an isolated context.
 *
 * @param {string} htmlPath - Path to index.html.
 * @returns {{questoes: Questao[], unidades: Unidade[]}} The declared data.
 * @throws {Error} If no <script> declares window.QUESTOES.
 */
function carregarDados(htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const scripts = html.match(/<script>[\s\S]*?<\/script>/g) || [];
  const dados = scripts.find(function (s) { return s.indexOf("window.QUESTOES") !== -1; });
  if (!dados) throw new Error("nenhum <script> declara window.QUESTOES em " + htmlPath);
  const contexto = { window: {} };
  vm.runInNewContext(dados.replace(/^<script>|<\/script>$/g, ""), contexto);
  return {
    questoes: contexto.window.QUESTOES || [],
    unidades: contexto.window.UNIDADES || []
  };
}

/**
 * @param {unknown} valor
 * @returns {boolean} True when the value is a string with visible content.
 */
function textoPreenchido(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

/**
 * Checks ids: unique, P##/T## matching the tipo, and contiguous from 01 to
 * the highest number of each prefix — a gap means a renumbered or lost id.
 *
 * @param {Questao[]} questoes
 * @param {string[]} erros - Receives one message per problem.
 */
function checarIds(questoes, erros) {
  const vistos = {};
  const maior = { P: 0, T: 0 };
  questoes.forEach(function (q, i) {
    const m = ID_PATTERN.exec(q.id || "");
    if (!m) {
      erros.push("questão na posição " + i + ": id \"" + q.id + "\" fora do padrão P##/T##");
      return;
    }
    if (vistos[q.id]) erros.push(q.id + ": id duplicado");
    vistos[q.id] = true;
    maior[m[1]] = Math.max(maior[m[1]], Number(m[2]));
    if (PREFIXO_POR_TIPO[q.tipo] && PREFIXO_POR_TIPO[q.tipo] !== m[1]) {
      erros.push(q.id + ": prefixo do id não corresponde ao tipo \"" + q.tipo + "\"");
    }
  });
  Object.keys(maior).forEach(function (prefixo) {
    const ultimo = prefixo + (maior[prefixo] < 10 ? "0" : "") + maior[prefixo];
    for (let n = 1; n < maior[prefixo]; n++) {
      const id = prefixo + (n < 10 ? "0" : "") + n;
      if (!vistos[id]) erros.push(id + ": buraco na sequência de ids " + prefixo + "01–" + ultimo + " (ids nunca são renumerados)");
    }
  });
}

/**
 * Checks the required fields of each tipo.
 *
 * @param {Questao} q
 * @param {string[]} erros
 */
function checarCampos(q, erros) {
  const bullets = Array.isArray(q.bullets) ? q.bullets : null;
  if (!bullets) erros.push(q.id + ": campo bullets (Cenário) ausente");
  if (!textoPreenchido(q.resposta)) erros.push(q.id + ": resposta vazia");
  if (q.tipo === "pratica") {
    if (!textoPreenchido(q.alvo)) erros.push(q.id + ": prática sem alvo (Processo-alvo)");
    if (bullets && (!bullets.length || !bullets.every(textoPreenchido))) {
      erros.push(q.id + ": prática com Cenário vazio");
    }
    if (q.pergunta !== undefined) erros.push(q.id + ": prática não grava pergunta (a frase é montada a partir da Unidade)");
  } else if (q.tipo === "teorica") {
    if (!textoPreenchido(q.pergunta)) erros.push(q.id + ": teórica sem pergunta");
    if (bullets && bullets.length) erros.push(q.id + ": teórica com Cenário (bullets deve ser vazio)");
  } else {
    erros.push(q.id + ": tipo desconhecido \"" + q.tipo + "\"");
  }
}

/**
 * Checks Unidade, Tema and Prova of each question.
 *
 * @param {Questao} q
 * @param {Object<string, Unidade>} unidadePorNome
 * @param {string[]} erros
 */
function checarClassificacao(q, unidadePorNome, erros) {
  const unidade = unidadePorNome[q.unidade];
  if (!unidade) {
    erros.push(q.id + ": Unidade desconhecida \"" + q.unidade + "\"");
    return;
  }
  const temas = unidade.temas.map(function (t) { return t.nome; });
  if (temas.indexOf(q.tema) === -1) {
    erros.push(q.id + ": Tema \"" + q.tema + "\" não pertence à Unidade " + unidade.nome);
  }
}

/**
 * Checks how many práticas each Processo-alvo has, per Unidade. When the
 * Unidade's temas declare their alvo, a prática must sit in that aula.
 * Only alvos present are counted: an alvo without práticas is not an error.
 *
 * @param {Questao[]} questoes
 * @param {Object<string, Unidade>} unidadePorNome
 * @param {string[]} erros
 */
function checarPraticasPorAlvo(questoes, unidadePorNome, erros) {
  const contagem = {};
  questoes.forEach(function (q) {
    const unidade = unidadePorNome[q.unidade];
    if (q.tipo !== "pratica" || !unidade || !textoPreenchido(q.alvo)) return;
    const chave = unidade.nome + "\u0000" + q.alvo;
    contagem[chave] = (contagem[chave] || 0) + 1;

    const declarado = unidade.temas.filter(function (t) { return t.alvo; });
    if (!declarado.length) return;
    const aula = declarado.filter(function (t) { return t.alvo === q.alvo; })[0];
    if (!aula) erros.push(q.id + ": Processo-alvo \"" + q.alvo + "\" não é apresentado por nenhuma aula de " + unidade.nome);
    else if (aula.nome !== q.tema) erros.push(q.id + ": prática de \"" + q.alvo + "\" deve ter Tema \"" + aula.nome + "\"");
  });
  Object.keys(contagem).forEach(function (chave) {
    const partes = chave.split("\u0000");
    const esperado = unidadePorNome[partes[0]].praticasPorAlvo;
    if (contagem[chave] !== esperado) {
      erros.push("Processo-alvo \"" + partes[1] + "\" (" + partes[0] + "): " + contagem[chave]
        + " práticas, esperado exatamente " + esperado);
    }
  });
}

/**
 * @typedef {Object} Contagem
 * @property {number} processos - Distinct Processos-alvo.
 * @property {number} praticas
 * @property {number} teoricas
 */

/**
 * Counts the bank per Unidade and in total.
 *
 * @param {Questao[]} questoes
 * @returns {Object<string, Contagem>} Keyed by Unidade name, plus ROTULO_TOTAL.
 */
function contarPorUnidade(questoes) {
  const contagens = {};
  const alvos = {};
  function somar(chave, q) {
    const c = contagens[chave] || (contagens[chave] = { processos: 0, praticas: 0, teoricas: 0 });
    alvos[chave] = alvos[chave] || {};
    if (q.tipo === "pratica") {
      c.praticas++;
      if (textoPreenchido(q.alvo) && !alvos[chave][q.alvo]) {
        alvos[chave][q.alvo] = true;
        c.processos++;
      }
    } else if (q.tipo === "teorica") {
      c.teoricas++;
    }
  }
  questoes.forEach(function (q) {
    somar(q.unidade, q);
    somar(ROTULO_TOTAL, q);
  });
  return contagens;
}

/**
 * Reads the per-Unidade count table of the README: the rows whose first cell
 * is a Unidade name or "Total", with columns
 * Unidade | Prova | Processos | Práticas | Teóricas. A Processos cell counts
 * by its leading number ("19 processos × 2 cenários"); "—" counts as zero.
 *
 * @param {string} readme - README.md content.
 * @param {string[]} rotulos - Accepted first-cell labels.
 * @returns {Object<string, Contagem>} The declared counts, keyed by label.
 */
function lerTabelaDoReadme(readme, rotulos) {
  const declarado = {};
  readme.split(/\r?\n/).forEach(function (linha) {
    const celulas = linha.split("|").slice(1, -1).map(function (c) {
      return c.replace(/\*\*/g, "").trim();
    });
    if (celulas.length !== 5 || rotulos.indexOf(celulas[0]) === -1) return;
    function numero(texto) {
      const m = /^\d+/.exec(texto);
      return m ? Number(m[0]) : 0;
    }
    declarado[celulas[0]] = {
      processos: numero(celulas[2]),
      praticas: numero(celulas[3]),
      teoricas: numero(celulas[4])
    };
  });
  return declarado;
}

/**
 * Checks the counts the README declares — the headline "**N questões**" and
 * the per-Unidade table — against the data.
 *
 * @param {Questao[]} questoes
 * @param {Unidade[]} unidades
 * @param {string} readme - README.md content.
 * @param {string[]} erros
 */
function checarReadme(questoes, unidades, readme, erros) {
  const manchete = /\*\*(\d+) questões\*\*/.exec(readme);
  if (!manchete) erros.push("README: sem a manchete \"**N questões**\"");
  else if (Number(manchete[1]) !== questoes.length) {
    erros.push("README: declara " + manchete[1] + " questões, os dados têm " + questoes.length);
  }

  const contado = contarPorUnidade(questoes);
  const rotulos = unidades.map(function (u) { return u.nome; }).concat(ROTULO_TOTAL);
  const declarado = lerTabelaDoReadme(readme, rotulos);
  rotulos.forEach(function (rotulo) {
    const real = contado[rotulo] || { processos: 0, praticas: 0, teoricas: 0 };
    const linha = declarado[rotulo];
    if (!linha) {
      if (contado[rotulo]) erros.push("README: tabela por Unidade sem a linha " + rotulo);
      return;
    }
    Object.keys(NOME_DA_COLUNA).forEach(function (campo) {
      if (linha[campo] !== real[campo]) {
        erros.push("README: " + rotulo + " declara " + linha[campo] + " " + NOME_DA_COLUNA[campo]
          + ", os dados têm " + real[campo]);
      }
    });
  });
}

/**
 * Validates the question bank against the data rules.
 *
 * @param {Questao[]} questoes - The questions, as declared in window.QUESTOES.
 * @param {Unidade[]} unidades - The Unidades, as declared in window.UNIDADES.
 * @param {string} [readme] - README.md content; its counts are checked when given.
 * @returns {string[]} One message per problem; empty when the data is valid.
 */
function checar(questoes, unidades, readme) {
  const erros = [];
  const unidadePorNome = {};
  unidades.forEach(function (u) { unidadePorNome[u.nome] = u; });

  checarIds(questoes, erros);
  questoes.forEach(function (q) {
    checarCampos(q, erros);
    checarClassificacao(q, unidadePorNome, erros);
  });

  const usadas = {};
  questoes.forEach(function (q) { if (unidadePorNome[q.unidade]) usadas[q.unidade] = true; });
  Object.keys(usadas).forEach(function (nome) {
    if (!textoPreenchido(unidadePorNome[nome].prova)) erros.push("Unidade " + nome + " tem questões mas não mapeia para uma Prova");
  });

  checarPraticasPorAlvo(questoes, unidadePorNome, erros);
  if (readme !== undefined) checarReadme(questoes, unidades, readme, erros);
  return erros;
}

module.exports = { carregarDados: carregarDados, checar: checar };

if (require.main === module) {
  const htmlPath = path.join(__dirname, "..", "index.html");
  const readme = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");
  const dados = carregarDados(htmlPath);
  const erros = checar(dados.questoes, dados.unidades, readme);
  if (erros.length) {
    console.error(erros.length + " problema(s) nos dados de index.html e README.md:");
    erros.forEach(function (e) { console.error("  - " + e); });
    process.exit(1);
  }
  console.log("ok: " + dados.questoes.length + " questões, " + dados.unidades.length + " unidades, dados válidos.");
}
