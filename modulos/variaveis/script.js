var TOTAL_QUIZ = 9;
var TOTAL_CODIGO = 5;
var concluidos = { quiz: false, var_1: false, var_2: false, var_3: false, var_4: false, var_5: false };
var QUIZZES = [
  {p:'Qual tipo armazena números inteiros em C?', o:['float','char','int','double'], c:2},
  {p:'Qual especificador imprime um float com printf()?', o:['%d','%c','%s','%f'], c:3},
  {p:'Como declarar int "idade" com valor 18?', o:['idade = 18;','int idade = 18;','var idade = 18;','integer idade = 18;'], c:1},
  {p:'Qual função lê dados do usuário em C?', o:['input()','read()','scanf()','gets()'], c:2},
  {p:'O que acontece ao declarar "int x;" sem inicializar?', o:['x vale 0','x tem valor indefinido','Erro de compilação','x vale -1'], c:1},
  {p:'Qual operador retorna o resto da divisão?', o:['/','*','%','//'], c:2},
  {p:'Como se declara uma constante em C usando o pré-processador?', o:['const PI = 3.14;','#define PI 3.14','constant PI 3.14;','define PI = 3.14;'], c:1},
  {p:'Qual a diferença entre float e double?', o:['Nenhuma, são iguais','double ocupa mais memória e tem maior precisão','float tem mais precisão','double só aceita inteiros'], c:1},
  {p:'O que significa o especificador %.2f no printf?', o:['Imprime 2 números inteiros','Imprime float com 2 casas decimais','Imprime 2 floats','Erro de sintaxe'], c:1},
];
function renderizarQuiz() {
  var letras = ['A','B','C','D']; var html = '';
  QUIZZES.forEach(function(q, i) {
    html += '<div class="quiz-item"><div class="quiz-pergunta"><span class="quiz-pergunta-num">Questão ' + (i+1) + ' de ' + QUIZZES.length + '</span>' + q.p + '</div><div class="quiz-opcoes">';
    q.o.forEach(function(op, oi) { html += '<label class="quiz-opcao"><input type="radio" name="q' + i + '" value="' + oi + '"> <span>' + letras[oi] + ') ' + op + '</span></label>'; });
    html += '</div></div>';
  });
  document.getElementById('quiz-variaveis').innerHTML = html;
  document.getElementById('excount-variaveis').textContent = '— 0/' + QUIZZES.length + ' corretos';
}
function verificarQuiz() {
  var acertos = 0; var tudoRespondido = true;
  QUIZZES.forEach(function(q, i) {
    var sel = document.querySelector('input[name="q' + i + '"]:checked');
    document.querySelectorAll('input[name="q' + i + '"]').forEach(function(inp) { inp.parentElement.classList.remove('correta-marcada','errada-marcada'); inp.disabled = true; });
    if (!sel) { tudoRespondido = false; document.querySelectorAll('input[name="q' + i + '"]').forEach(function(inp) { inp.disabled = false; }); return; }
    if (parseInt(sel.value) === q.c) { sel.parentElement.classList.add('correta-marcada'); acertos++; }
    else { sel.parentElement.classList.add('errada-marcada'); var corr = document.querySelector('input[name="q' + i + '"][value="' + q.c + '"]'); if (corr) corr.parentElement.classList.add('correta-marcada'); }
  });
  var res = document.getElementById('res-variaveis');
  if (!tudoRespondido) { res.textContent = 'Responda todas as questoes antes de verificar.'; res.className = 'quiz-resultado parcial'; return; }
  var pct = Math.round((acertos / QUIZZES.length) * 100);
  document.getElementById('excount-variaveis').textContent = '— ' + acertos + '/' + QUIZZES.length + ' corretos';
  if (acertos === QUIZZES.length) { res.textContent = 'Perfeito! Voce acertou todas as ' + QUIZZES.length + ' questoes!'; res.className = 'quiz-resultado certo'; }
  else if (acertos >= Math.ceil(QUIZZES.length/2)) { res.textContent = 'Voce acertou ' + acertos + ' de ' + QUIZZES.length + ' (' + pct + '%). Bom trabalho!'; res.className = 'quiz-resultado parcial'; }
  else { res.textContent = 'Voce acertou ' + acertos + ' de ' + QUIZZES.length + '. Revise a teoria e tente novamente.'; res.className = 'quiz-resultado errado'; }
  var btn = document.getElementById('btn-quiz-variaveis'); if (btn) { btn.disabled = true; btn.textContent = 'Verificado'; }
  var respostas={};QUIZZES.forEach(function(q,i){var s=document.querySelector('input[name="q'+i+'"]:checked');if(s)respostas[i]=s.value;});localStorage.setItem('modulo_variaveis_quiz_respostas',JSON.stringify(respostas));localStorage.setItem('modulo_variaveis_quiz',100);concluidos.quiz=true;atualizarProgresso();
}
function marcarConcluido(exId) { if (concluidos[exId]) return; concluidos[exId] = true; localStorage.setItem('modulo_variaveis_' + exId, 'true'); atualizarProgresso(); }
function atualizarProgresso() {
  var codOk = (concluidos['var_1'] ? 1 : 0) + (concluidos['var_2'] ? 1 : 0) + (concluidos['var_3'] ? 1 : 0) + (concluidos['var_4'] ? 1 : 0) + (concluidos['var_5'] ? 1 : 0);
  var quizPct = parseInt(localStorage.getItem('modulo_variaveis_quiz') || 0);
  var pct = Math.round((quizPct * 0.6) + (codOk / TOTAL_CODIGO * 100 * 0.4));
  document.getElementById('barra-progresso').style.width = pct + '%';
  document.getElementById('texto-progresso').textContent = 'Quiz: ' + (quizPct > 0 ? 'feito' : 'pendente') + ' · Código: ' + codOk + ' de ' + TOTAL_CODIGO;
  document.getElementById('pct-progresso').textContent = pct + '%';
  localStorage.setItem('prog_variaveis', pct);
}
function irPara(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
document.addEventListener("DOMContentLoaded", function() {
  renderizarQuiz();
  var _respostasJSON = localStorage.getItem('modulo_variaveis_quiz_respostas');
  if (_respostasJSON) {
    try {
      var _respostas = JSON.parse(_respostasJSON);
      Object.keys(_respostas).forEach(function(i) {
        var inp = document.querySelector('input[name="q' + i + '"][value="' + _respostas[i] + '"]');
        if (inp) inp.checked = true;
      });
      if (localStorage.getItem('modulo_variaveis_quiz')) {
        setTimeout(function() { verificarQuiz(); }, 0);
      }
    } catch(e) {}
  }
  if (localStorage.getItem('modulo_variaveis_quiz')) concluidos.quiz = true;
  if (localStorage.getItem('modulo_variaveis_var_1') === 'true') concluidos['var_1'] = true;
  if (localStorage.getItem('modulo_variaveis_var_2') === 'true') concluidos['var_2'] = true;
  if (localStorage.getItem('modulo_variaveis_var_3') === 'true') concluidos['var_3'] = true;
  if (localStorage.getItem('modulo_variaveis_var_4') === 'true') concluidos['var_4'] = true;
  if (localStorage.getItem('modulo_variaveis_var_5') === 'true') concluidos['var_5'] = true;
  atualizarProgresso();
});
document.querySelectorAll('.sidebar-item').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.sidebar-item').forEach(function(i) { i.classList.remove('ativo'); });
    this.classList.add('ativo');
  });
});
