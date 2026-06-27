// ============================================
// VERIFICADOR — Judge0 + Análise local
// ============================================

var JUDGE0_URL = "https://ce.judge0.com";
var LANGUAGE_ID_C = 50;

// Regras de verificação por exercício
// Cada exercício tem uma lista de tokens obrigatórios que o código DEVE conter
// e opcionalmente tokens proibidos (ex: valor fixo hardcoded)
var REGRAS = {

  // ── INTRODUÇÃO ──
  'intro_1': {
    obrigatorio: ['#include', 'main', 'printf', 'Hello, World!'],
    proibido:    []
  },
  'intro_2': {
    obrigatorio: ['#include', 'main', 'printf'],
    proibido:    []
  },
  'intro_3': {
    obrigatorio: ['#include', 'main', 'printf', '\\t', '\\n'],
    proibido:    []
  },
  'intro_4': {
    obrigatorio: ['#include', 'main', 'printf', '*'],
    proibido:    []
  },
  'intro_5': {
    obrigatorio: ['#include', 'main', 'printf', '='],
    proibido:    []
  },

  // ── VARIÁVEIS ──
  'var_1': {
    obrigatorio: ['int', 'float', 'idade', 'altura', '%d', '%.2f'],
    proibido:    []
  },
  'var_2': {
    obrigatorio: ['float', 'base', 'altura', '*', '/', '%.2f'],
    proibido:    []
  },
  'var_3': {
    obrigatorio: ['#define', 'PI', 'float', 'raio', '*', '%.2f'],
    proibido:    []
  },
  'var_4': {
    obrigatorio: ['int', 'a', 'b', '+', '-', '%d'],
    // não pode só printar os valores sem variáveis
    proibido:    []
  },
  'var_5': {
    obrigatorio: ['float', 'celsius', 'fahrenheit', '%.2f'],
    proibido:    []
  },

  // ── CONTROLE ──
  'ctrl_1': {
    obrigatorio: ['for', 'printf', '%d'],
    proibido:    [] // sem o for não tem como gerar as 5 linhas dinamicamente
  },
  'ctrl_2': {
    obrigatorio: ['int', 'n', 'if', '%', 'else'],
    proibido:    []
  },
  'ctrl_3': {
    obrigatorio: ['int', 'soma', 'for'],
    proibido:    ['55'] // não pode printar o resultado hardcoded
  },
  'ctrl_4': {
    obrigatorio: ['int', 'i', '--'],
    proibido:    []
  },
  'ctrl_5': {
    obrigatorio: ['for', 'continue', '%', '2'],
    proibido:    []
  },

  // ── FUNÇÕES ──
  'fn_1': {
    obrigatorio: ['void', 'saudacao', '(', ')', 'printf'],
    proibido:    []
  },
  'fn_2': {
    obrigatorio: ['int', 'multiplicar', '(', 'int', 'return', '*'],
    proibido:    []
  },
  'fn_3': {
    obrigatorio: ['int', 'maior', '(', 'int', 'if', 'return'],
    proibido:    []
  },
  'fn_4': {
    obrigatorio: ['int', 'fatorial', 'return', 'fatorial', 'n-1'],
    proibido:    ['120'] // não pode printar hardcoded
  },
  'fn_5': {
    obrigatorio: ['int', 'soma', 'return', 'soma', 'n-1'],
    proibido:    ['15'] // não pode printar hardcoded
  },

  // ── PONTEIROS ──
  'pt_1': {
    obrigatorio: ['int', '*', '&', 'printf', '%d'],
    proibido:    []
  },
  'pt_2': {
    obrigatorio: ['int', '*', '&'],
    proibido:    []
  },
  'pt_3': {
    obrigatorio: ['void', 'trocar', '*a', 'temp'],
    proibido:    []
  },
  'pt_4': {
    obrigatorio: ['int', '*', 'for'],
    proibido:    []
  },
  'pt_5': {
    obrigatorio: ['int', 'maior', '*v', 'for'],
    proibido:    []
  }
};

// ── VERIFICAÇÃO LOCAL ──
function verificarCodigo(numExercicio, codigo) {
  var regra = REGRAS[numExercicio];
  if (!regra) return true; // sem regra = aprova

  var codigoLimpo = codigo;

  // Verificar tokens obrigatórios
  for (var i = 0; i < regra.obrigatorio.length; i++) {
    if (codigoLimpo.indexOf(regra.obrigatorio[i]) === -1) {
      return false;
    }
  }

  // Verificar tokens proibidos
  for (var j = 0; j < regra.proibido.length; j++) {
    if (codigoLimpo.indexOf(regra.proibido[j]) !== -1) {
      return false;
    }
  }

  return true;
}

// ── JUDGE0 ──
async function executar(numExercicio, saidaEsperada) {
  var editor     = document.getElementById("editor-" + numExercicio);
  var saidaEl    = document.getElementById("saida-"  + numExercicio);
  var feedbackEl = document.getElementById("feedback-" + numExercicio);
  var btnEl      = document.getElementById("btn-"    + numExercicio);
  var spinEl     = document.getElementById("spin-"   + numExercicio);
  var codigo = editor ? editor.value.trim() : "";

  if (!codigo) {
    saidaEl.className = "terminal-output erro";
    saidaEl.textContent = "O editor esta vazio. Escreva seu codigo antes de executar!";
    return;
  }

  btnEl.disabled = true;
  spinEl.classList.add("ativo");
  saidaEl.className = "terminal-output aguardando";
  saidaEl.textContent = "Compilando e executando...";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback-exercicio";

  try {
    var resposta = await fetch(JUDGE0_URL + "/submissions?base64_encoded=false&wait=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_code: codigo, language_id: LANGUAGE_ID_C })
    });
    var resultado = await resposta.json();
    if (resultado.status_id <= 2 && resultado.token) {
      resultado = await aguardarResultado(resultado.token);
    }
    mostrarResultado(numExercicio, resultado, saidaEsperada, codigo);
  } catch (erro) {
    saidaEl.className = "terminal-output erro";
    saidaEl.textContent = "Erro de conexao: " + erro.message;
  } finally {
    btnEl.disabled = false;
    spinEl.classList.remove("ativo");
  }
}

async function aguardarResultado(token) {
  for (var i = 0; i < 20; i++) {
    await esperar(1500);
    var r = await fetch(JUDGE0_URL + "/submissions/" + token + "?base64_encoded=false&fields=stdout,stderr,status_id,compile_output");
    var res = await r.json();
    if (res.status_id > 2) return res;
  }
  throw new Error("O servidor demorou demais. Tente novamente.");
}

function esperar(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

function mostrarResultado(numExercicio, resultado, saidaEsperada, codigo) {
  var saidaEl    = document.getElementById("saida-"    + numExercicio);
  var feedbackEl = document.getElementById("feedback-" + numExercicio);

  // Erro de compilação
  if (resultado.status_id === 6) {
    saidaEl.className = "terminal-output erro";
    saidaEl.textContent = "Erro de compilacao:\n" + (resultado.compile_output || "Verifique seu codigo.");
    feedbackEl.className = "feedback-exercicio errado";
    feedbackEl.textContent = "✗ Erro no codigo — leia a mensagem acima e tente corrigir";
    return;
  }

  // Erro em tempo de execução
  if (resultado.stderr) {
    saidaEl.className = "terminal-output erro";
    saidaEl.textContent = resultado.stderr;
    feedbackEl.className = "feedback-exercicio errado";
    feedbackEl.textContent = "✗ Erro durante a execucao";
    return;
  }

  var saida = (resultado.stdout || "").trim();
  saidaEl.className = "terminal-output";
  saidaEl.textContent = saida || "(programa executou sem imprimir nada)";

  // Saída errada
  if (saida !== saidaEsperada.trim()) {
    feedbackEl.className = "feedback-exercicio errado";
    feedbackEl.textContent = "✗ Quase! A saida nao esta igual ao esperado. Tente novamente.";
    return;
  }

  // Saída correta — verificar abordagem
  var aprovado = verificarCodigo(numExercicio, codigo);

  if (aprovado) {
    feedbackEl.className = "feedback-exercicio certo";
    feedbackEl.textContent = "✓ Correto! Boa solucao!";
    localStorage.setItem('codigo_' + numExercicio, codigo);
    aplicarVisualConcluido(numExercicio);
    if (typeof marcarConcluido === "function") {
      marcarConcluido(numExercicio);
      setTimeout(verificarPopupAvaliacao, 800);
    }
  } else {
    feedbackEl.className = "feedback-exercicio errado";
    feedbackEl.textContent = "✗ A saida esta certa, mas o codigo nao usa a abordagem esperada para este exercicio. Revise o enunciado!";
  }
}

// ── LIMPAR EDITOR ──
function limparEditor(numExercicio) {
  if (confirm("Deseja limpar o codigo deste exercicio?")) {
    var editor = document.getElementById("editor-" + numExercicio);
    if (editor) editor.value = "";
    var saida = document.getElementById("saida-" + numExercicio);
    if (saida) { saida.className = "terminal-output aguardando"; saida.textContent = "Clique em Executar para ver o resultado..."; }
    var fb = document.getElementById("feedback-" + numExercicio);
    if (fb) { fb.textContent = ""; fb.className = "feedback-exercicio"; }
  }
}

// ── TAB NO EDITOR ──
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".editor-codigo").forEach(function(editor) {
    editor.addEventListener("keydown", function(e) {
      if (e.key === "Tab") {
        e.preventDefault();
        var pos = this.selectionStart;
        this.value = this.value.substring(0, pos) + "    " + this.value.substring(this.selectionEnd);
        this.selectionStart = this.selectionEnd = pos + 4;
      }
    });
  });
});

// ── SIDEBAR ACOMPANHA ROLAGEM ──
document.addEventListener("DOMContentLoaded", function() {
  var secoes = [
    { id: 'teoria', sidebarOnclick: "irPara('teoria')" },
    { id: 'quiz',   sidebarOnclick: "irPara('quiz')"   },
    { id: 'codigo', sidebarOnclick: "irPara('codigo')" }
  ];

  // Mapeia cada seção para seu item da sidebar pelo onclick
  function getSidebarItem(onclickVal) {
    var items = document.querySelectorAll('.sidebar-item');
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAttribute('onclick') === onclickVal) return items[i];
    }
    return null;
  }

  function ativarItem(sidebarItem) {
    document.querySelectorAll('.sidebar-item').forEach(function(i) {
      i.classList.remove('ativo');
    });
    if (sidebarItem) sidebarItem.classList.add('ativo');
  }

  // Usa IntersectionObserver para detectar qual seção está visível
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var secao = secoes.find(function(s) { return s.id === entry.target.id; });
        if (secao) ativarItem(getSidebarItem(secao.sidebarOnclick));
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px' // ativa quando a seção está no terço superior da tela
  });

  secoes.forEach(function(s) {
    var el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
});

// ── POPUP AVALIAÇÃO ──
var FORMS_URL = 'https://forms.gle/iqquYnGKmpm8BdcW6';

function verificarPopupAvaliacao() {
  if (localStorage.getItem('avaliacao_exibida')) return;
  var modulos = ['intro', 'variaveis', 'controle', 'funcoes', 'ponteiros'];
  var algumCompleto = modulos.some(function(m) {
    return parseInt(localStorage.getItem('prog_' + m) || 0) >= 100;
  });
  if (algumCompleto) exibirPopupAvaliacao();
}

function exibirPopupAvaliacao() {
  if (localStorage.getItem('avaliacao_exibida')) return;
  localStorage.setItem('avaliacao_exibida', 'true');
  var overlay = document.getElementById('popup-avaliacao');
  if (overlay) overlay.style.display = 'flex';
}

function fecharPopupAvaliacao() {
  var overlay = document.getElementById('popup-avaliacao');
  if (overlay) overlay.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  verificarPopupAvaliacao();
});

// ── INJETAR POPUP E BOTÃO FIXO ──
document.addEventListener('DOMContentLoaded', function() {
  var FORMS_URL = 'https://forms.gle/iqquYnGKmpm8BdcW6';

  // HTML do popup
  var popup = document.createElement('div');
  popup.id = 'popup-avaliacao';
  popup.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;';
  popup.innerHTML = [
    '<div style="background:#fff;border-radius:16px;padding:40px 36px;max-width:420px;width:90%;text-align:center;position:relative;">',
      '<div style="font-size:40px;margin-bottom:16px;">🎉</div>',
      '<h2 style="font-size:20px;font-weight:700;margin-bottom:10px;color:#1a1a1a;">Parabéns por completar o módulo!</h2>',
      '<p style="font-size:14px;color:#555;line-height:1.7;margin-bottom:24px;">Sua opinião é muito importante para nós. Responda nossa pesquisa rápida — leva menos de 5 minutos!</p>',
      '<a href="' + FORMS_URL + '" target="_blank" rel="noopener" ',
        'style="display:block;padding:13px 24px;background:#982424;color:#fff;border-radius:8px;font-size:15px;font-weight:600;text-decoration:none;margin-bottom:12px;" ',
        'onclick="fecharPopupAvaliacao()">',
        '📋 Responder pesquisa',
      '</a>',
      '<button onclick="fecharPopupAvaliacao()" ',
        'style="background:none;border:none;font-size:13px;color:#888;cursor:pointer;font-family:inherit;padding:4px;">',
        'Agora não',
      '</button>',
    '</div>'
  ].join('');
  document.body.appendChild(popup);

  // Botão fixo
  var btn = document.createElement('a');
  btn.href = FORMS_URL;
  btn.target = '_blank';
  btn.rel = 'noopener';
  btn.title = 'Avaliar a plataforma';
  btn.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#982424;color:#fff;border-radius:50px;padding:10px 18px;font-size:13px;font-weight:600;text-decoration:none;box-shadow:0 4px 16px rgba(152,36,36,0.3);z-index:999;display:flex;align-items:center;gap:8px;transition:background 0.2s;';
  btn.innerHTML = '📋 Avaliar';
  btn.onmouseenter = function() { this.style.background = '#6b0000'; };
  btn.onmouseleave = function() { this.style.background = '#982424'; };
  document.body.appendChild(btn);
});

// ── RESTAURAR ESTADO VISUAL DOS EXERCÍCIOS ──
function aplicarVisualConcluido(numExercicio) {
  var editorEl = document.getElementById('editor-' + numExercicio);
  if (editorEl) {
    var exercicioCard = editorEl.closest('.exercicio-card');
    if (exercicioCard) exercicioCard.classList.add('concluido');
  }
  var btn = document.getElementById('btn-' + numExercicio);
  if (btn) btn.classList.add('concluido');
  var sidebar = document.querySelector('[onclick*="' + numExercicio + '"]');
  if (sidebar) sidebar.classList.add('concluido');
}

function restaurarEstadoExercicios() {
  document.querySelectorAll('.editor-codigo').forEach(function(editor) {
    var id = editor.id.replace('editor-', '');
    var codigoSalvo = localStorage.getItem('codigo_' + id);
    if (codigoSalvo) {
      editor.value = codigoSalvo;
      var feedbackEl = document.getElementById('feedback-' + id);
      if (feedbackEl) {
        feedbackEl.className = 'feedback-exercicio certo';
        feedbackEl.textContent = '\u2713 Correto! Boa solucao!';
      }
      var saidaEl = document.getElementById('saida-' + id);
      if (saidaEl && saidaEl.textContent.indexOf('Clique') !== -1) {
        saidaEl.className = 'terminal-output';
        saidaEl.textContent = '(exercicio ja concluido anteriormente)';
      }
      aplicarVisualConcluido(id);
    }
  });
}

document.addEventListener('DOMContentLoaded', restaurarEstadoExercicios);
