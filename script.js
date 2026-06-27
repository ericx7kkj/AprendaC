// =====================
// MÓDULOS - ABRIR
// =====================
function abrirModulo(nomeModulo) {
  var paginas = {
    'intro':      'modulos/introducao/index.html',
    'variaveis':  'modulos/variaveis/index.html',
    'controle':   'modulos/controle/index.html',
    'funcoes':    'modulos/funcoes/index.html',
    'ponteiros':  'modulos/ponteiros/index.html'
  };
  if (paginas[nomeModulo]) {
    window.location.href = paginas[nomeModulo];
  }
}

// =====================
// PROGRESSO
// =====================
var ORDEM = ['intro', 'variaveis', 'controle', 'funcoes', 'ponteiros'];

function carregarProgresso() {
  var modulos = {
    'intro':     { fillId: 'fill-intro',     labelId: 'label-intro'     },
    'variaveis': { fillId: 'fill-variaveis', labelId: 'label-variaveis' },
    'controle':  { fillId: 'fill-controle',  labelId: 'label-controle'  },
    'funcoes':   { fillId: 'fill-funcoes',   labelId: 'label-funcoes'   },
    'ponteiros': { fillId: 'fill-ponteiros', labelId: 'label-ponteiros' }
  };
  Object.keys(modulos).forEach(function(modulo) {
    var pct     = parseInt(localStorage.getItem('prog_' + modulo)) || 0;
    var fillEl  = document.getElementById(modulos[modulo].fillId);
    var labelEl = document.getElementById(modulos[modulo].labelId);
    if (fillEl)  fillEl.style.width = pct + '%';
    if (labelEl) {
      if (pct === 0) {
        labelEl.textContent = 'Não iniciado';
        labelEl.className = 'progress-label';
      } else if (pct >= 100) {
        labelEl.textContent = 'Completo \u2713';
        labelEl.className = 'progress-label completo';
      } else {
        labelEl.textContent = pct + '% \u2014 Em andamento';
        labelEl.className = 'progress-label em-andamento';
      }
    }
  });
  atualizarPainelGeral();
  atualizarBotaoAvaliacao();
}

function atualizarPainelGeral() {
  var total = 0;
  ORDEM.forEach(function(m) { total += parseInt(localStorage.getItem('prog_' + m) || 0); });
  var media = Math.round(total / ORDEM.length);
  var fillEl = document.getElementById('painel-fill');
  var pctEl  = document.getElementById('painel-pct');
  var descEl = document.getElementById('painel-desc');
  if (fillEl) fillEl.style.width = media + '%';
  if (pctEl)  pctEl.textContent  = media + '%';
  if (descEl) {
    var conc = ORDEM.filter(function(m) { return parseInt(localStorage.getItem('prog_' + m) || 0) >= 100; }).length;
    var total_mod = ORDEM.length;
    if (media === 0)          descEl.textContent = 'Você ainda não começou nenhum módulo.';
    else if (conc === total_mod) descEl.textContent = 'Trilha concluida! Parabens!';
    else                      descEl.textContent = conc + ' de ' + total_mod + ' modulo(s) concluido(s).';
  }
}

function atualizarBotaoAvaliacao() {
  var btn = document.getElementById('btn-avaliacao-fixo');
  if (!btn) return;
  btn.style.display = 'flex';
}

window.addEventListener('pageshow', function() {
  carregarProgresso();
});

// ── BOTÃO FIXO DE AVALIAÇÃO ──
document.addEventListener('DOMContentLoaded', function() {
  var FORMS_URL = 'https://forms.gle/iqquYnGKmpm8BdcW6';
  var btn = document.createElement('a');
  btn.id = 'btn-avaliacao-fixo';
  btn.href = FORMS_URL;
  btn.target = '_blank';
  btn.rel = 'noopener';
  btn.title = 'Avaliar a plataforma';
  btn.style.cssText = 'display:flex;position:fixed;bottom:24px;right:24px;background:#982424;color:#fff;border-radius:50px;padding:10px 18px;font-size:13px;font-weight:600;text-decoration:none;box-shadow:0 4px 16px rgba(152,36,36,0.3);z-index:999;align-items:center;gap:8px;transition:background 0.2s;';
  btn.innerHTML = '&#128203; Avaliar';
  btn.onmouseenter = function() { this.style.background = '#6b0000'; };
  btn.onmouseleave = function() { this.style.background = '#982424'; };
  document.body.appendChild(btn);
});
