var concluidos = { quiz: false, ctrl_1: false, ctrl_2: false, ctrl_3: false, ctrl_4: false, ctrl_5: false };
var QUIZZES = [
  {p:'O que o "break" faz no switch?', o:['Volta ao início','Encerra o loop','Sai do case atual','Imprime uma linha'], c:2},
  {p:'Qual laço garante executar ao menos uma vez?', o:['for','while','do-while','switch'], c:2},
  {p:'O for "for(i=0; i<3; i++)" executa quantas vezes?', o:['2','3','4','1'], c:1},
  {p:'Para somar todos de 1 a 100 qual estrutura usar?', o:['if/else','switch','for ou while','printf'], c:2},
  {p:'O que acontece se esquecer o break no switch?', o:['Erro','Executa só o case correto','Executa os cases seguintes também','Programa encerra'], c:2},
  {p:'O que o continue faz dentro de um laço?', o:['Encerra o laço','Reinicia o programa','Pula para a próxima iteração','Para o programa'], c:2},
  {p:'Qual operador representa E lógico em C?', o:['&','|','&&','||'], c:2},
  {p:'Qual operador representa OU lógico em C?', o:['&','||','&&','!'], c:1},
  {p:'Um while com condição false desde o início executa o bloco:', o:['Uma vez','Nunca','Duas vezes','Infinitamente'], c:1},
  {p:'Qual a diferença entre = e == em C?', o:['Nenhuma','= atribui valor, == compara','== atribui, = compara','Ambos comparam'], c:1},
  {p:'O que é um laço infinito?', o:['Laço que nunca começa','Laço cuja condição nunca se torna falsa','Laço com break','Erro de sintaxe'], c:1},
  {p:'Qual estrutura é ideal para testar múltiplos valores exatos de uma variável?', o:['if/else if','switch','for','while'], c:1},
  {p:'Para imprimir apenas números pares de 1 a 10, qual comando pula os ímpares?', o:['break','return','continue','exit'], c:2},
  {p:'O operador ! em C representa:', o:['AND','OR','NOT (negação)','XOR'], c:2},
  {p:'Qual será a saída de: for(int i=5;i>0;i--) printf("%d ",i);', o:['1 2 3 4 5','5 4 3 2 1','0 1 2 3 4','5 4 3 2 1 0'], c:1}
];
function renderizarQuiz() {
  var letras = ['A','B','C','D']; var html = '';
  QUIZZES.forEach(function(q, i) {
    html += '<div class="quiz-item"><div class="quiz-pergunta"><span class="quiz-pergunta-num">Questão ' + (i+1) + ' de ' + QUIZZES.length + '</span>' + q.p + '</div><div class="quiz-opcoes">';
    q.o.forEach(function(op, oi) { html += '<label class="quiz-opcao"><input type="radio" name="q' + i + '" value="' + oi + '"> <span>' + letras[oi] + ') ' + op + '</span></label>'; });
    html += '</div></div>';
  });
  document.getElementById('quiz-controle').innerHTML = html;
  document.getElementById('excount-controle').textContent = '— 0/' + QUIZZES.length + ' corretos';
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
  var res = document.getElementById('res-controle');
  if (!tudoRespondido) { res.textContent = 'Responda todas as questoes antes de verificar.'; res.className = 'quiz-resultado parcial'; return; }
  var pct = Math.round((acertos / QUIZZES.length) * 100);
  document.getElementById('excount-controle').textContent = '— ' + acertos + '/' + QUIZZES.length + ' corretos';
  if (acertos === QUIZZES.length) { res.textContent = 'Perfeito! Voce acertou todas!'; res.className = 'quiz-resultado certo'; }
  else if (acertos >= Math.ceil(QUIZZES.length/2)) { res.textContent = 'Voce acertou ' + acertos + ' de ' + QUIZZES.length + '. Bom trabalho!'; res.className = 'quiz-resultado parcial'; }
  else { res.textContent = 'Voce acertou ' + acertos + ' de ' + QUIZZES.length + '. Revise a teoria.'; res.className = 'quiz-resultado errado'; }
  var btn = document.getElementById('btn-quiz-controle'); if (btn) { btn.disabled = true; btn.textContent = 'Verificado'; }
  var respostas={};QUIZZES.forEach(function(q,i){var s=document.querySelector('input[name="q'+i+'"]:checked');if(s)respostas[i]=s.value;});localStorage.setItem('modulo_controle_quiz_respostas',JSON.stringify(respostas));localStorage.setItem('modulo_controle_quiz',100);concluidos.quiz=true;atualizarProgresso();
}
function marcarConcluido(exId) { if (concluidos[exId]) return; concluidos[exId] = true; localStorage.setItem('modulo_controle_' + exId, 'true'); atualizarProgresso(); }
function atualizarProgresso() {
  var codOk = (concluidos['ctrl_1'] ? 1 : 0) + (concluidos['ctrl_2'] ? 1 : 0) + (concluidos['ctrl_3'] ? 1 : 0) + (concluidos['ctrl_4'] ? 1 : 0) + (concluidos['ctrl_5'] ? 1 : 0);
  var quizPct = parseInt(localStorage.getItem('modulo_controle_quiz') || 0);
  var pct = Math.round((quizPct * 0.6) + (codOk / 5 * 100 * 0.4));
  document.getElementById('barra-progresso').style.width = pct + '%';
  document.getElementById('texto-progresso').textContent = 'Quiz: ' + (quizPct > 0 ? 'feito' : 'pendente') + ' · Código: ' + codOk + ' de 5';
  document.getElementById('pct-progresso').textContent = pct + '%';
  localStorage.setItem('prog_controle', pct);
}
function irPara(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
document.addEventListener("DOMContentLoaded", function() {
  renderizarQuiz();
  var _respostasJSON = localStorage.getItem('modulo_controle_quiz_respostas');
  if (_respostasJSON) {
    try {
      var _respostas = JSON.parse(_respostasJSON);
      Object.keys(_respostas).forEach(function(i) {
        var inp = document.querySelector('input[name="q' + i + '"][value="' + _respostas[i] + '"]');
        if (inp) inp.checked = true;
      });
      if (localStorage.getItem('modulo_controle_quiz')) { setTimeout(function() { verificarQuiz(); }, 0); }
    } catch(e) {}
  }
  if (localStorage.getItem('modulo_controle_quiz')) concluidos.quiz = true;
  if (localStorage.getItem('modulo_controle_ctrl_1') === 'true') concluidos['ctrl_1'] = true;
  if (localStorage.getItem('modulo_controle_ctrl_2') === 'true') concluidos['ctrl_2'] = true;
  if (localStorage.getItem('modulo_controle_ctrl_3') === 'true') concluidos['ctrl_3'] = true;
  if (localStorage.getItem('modulo_controle_ctrl_4') === 'true') concluidos['ctrl_4'] = true;
  if (localStorage.getItem('modulo_controle_ctrl_5') === 'true') concluidos['ctrl_5'] = true;
  atualizarProgresso();
});
document.querySelectorAll('.sidebar-item').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.sidebar-item').forEach(function(i) { i.classList.remove('ativo'); });
    this.classList.add('ativo');
  });
});
