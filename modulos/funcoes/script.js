var concluidos = { quiz: false, fn_1: false, fn_2: false, fn_3: false, fn_4: false, fn_5: false };
var QUIZZES = [
  {p:'Qual tipo de retorno indica que a função não retorna nada?', o:['int','null','void','empty'], c:2},
  {p:'O que é um protótipo de função?', o:['Outra função dentro da função','Declaração antecipada da função','Chamada da função no main','Comentário da função'], c:1},
  {p:'Como chamar uma função "somar(3, 4)" e guardar o resultado?', o:['somar = 3 + 4;','int r = somar(3, 4);','call somar(3, 4);','int r = call somar(3,4);'], c:1},
  {p:'O que o "return" faz numa função?', o:['Imprime o valor','Encerra o programa','Retorna um valor e encerra a função','Declara uma variável'], c:2},
  {p:'Uma função void pode ter "return;"?', o:['Nao, gera erro','Sim, para encerrar antecipadamente','Só se tiver valor','Apenas no main'], c:1},
  {p:'Onde os parâmetros de uma função são declarados?', o:['Antes do #include','Dentro do corpo da função','Entre os parênteses do cabeçalho','Após o return'], c:2},
  {p:'O que é recursão?', o:['Uma função chamar outra função','Uma função chamar a si mesma','Um tipo de laço','Uma variável global'], c:1},
  {p:'O que acontece sem condição de parada em uma função recursiva?', o:['O programa fica mais rápido','Stack overflow — estouro de pilha','A função retorna 0','Erro de compilação'], c:1},
  {p:'Uma variável declarada dentro de uma função é:', o:['Global','Local — existe só dentro daquela função','Estática por padrão','Acessível em todo o programa'], c:1},
  {p:'C passa argumentos para funções por padrão:', o:['Por referência','Por ponteiro','Por valor (cópia)','Por endereço'], c:2},
  {p:'O que é uma função inline em C?', o:['Uma função sem retorno','Uma função definida dentro de outra','Uma sugestão ao compilador para inserir o código da função no local da chamada','Uma função recursiva'], c:2},
  {p:'Para modificar uma variável original dentro de uma função, deve-se usar:', o:['return','global','ponteiro (*)','static'], c:2},
  {p:'Qual das opções declara corretamente uma função que retorna int e recebe dois ints?', o:['void soma(int a, int b)','int soma(int a, int b)','soma(int, int) -> int','int soma(a, b)'], c:1},
  {p:'Variável global em C é declarada:', o:['Dentro do main','Dentro de qualquer função','Fora de todas as funções','Com a palavra-chave global'], c:2},
  {p:'Para que serve a palavra static em uma variável local?', o:['Torna global','Mantém o valor entre chamadas da função','Impede modificação','Remove da memória ao sair'], c:1}
];
function renderizarQuiz() {
  var letras = ['A','B','C','D']; var html = '';
  QUIZZES.forEach(function(q, i) {
    html += '<div class="quiz-item"><div class="quiz-pergunta"><span class="quiz-pergunta-num">Questão ' + (i+1) + ' de ' + QUIZZES.length + '</span>' + q.p + '</div><div class="quiz-opcoes">';
    q.o.forEach(function(op, oi) { html += '<label class="quiz-opcao"><input type="radio" name="q' + i + '" value="' + oi + '"> <span>' + letras[oi] + ') ' + op + '</span></label>'; });
    html += '</div></div>';
  });
  document.getElementById('quiz-funcoes').innerHTML = html;
  document.getElementById('excount-funcoes').textContent = '— 0/' + QUIZZES.length + ' corretos';
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
  var res = document.getElementById('res-funcoes');
  if (!tudoRespondido) { res.textContent = 'Responda todas as questoes antes de verificar.'; res.className = 'quiz-resultado parcial'; return; }
  var pct = Math.round((acertos / QUIZZES.length) * 100);
  document.getElementById('excount-funcoes').textContent = '— ' + acertos + '/' + QUIZZES.length + ' corretos';
  if (acertos === QUIZZES.length) { res.textContent = 'Perfeito! Voce acertou todas!'; res.className = 'quiz-resultado certo'; }
  else if (acertos >= Math.ceil(QUIZZES.length/2)) { res.textContent = 'Voce acertou ' + acertos + ' de ' + QUIZZES.length + '. Bom trabalho!'; res.className = 'quiz-resultado parcial'; }
  else { res.textContent = 'Voce acertou ' + acertos + ' de ' + QUIZZES.length + '. Revise a teoria.'; res.className = 'quiz-resultado errado'; }
  var btn = document.getElementById('btn-quiz-funcoes'); if (btn) { btn.disabled = true; btn.textContent = 'Verificado'; }
  var respostas={};QUIZZES.forEach(function(q,i){var s=document.querySelector('input[name="q'+i+'"]:checked');if(s)respostas[i]=s.value;});localStorage.setItem('modulo_funcoes_quiz_respostas',JSON.stringify(respostas));localStorage.setItem('modulo_funcoes_quiz',100);concluidos.quiz=true;atualizarProgresso();
}
function marcarConcluido(exId) { if (concluidos[exId]) return; concluidos[exId] = true; localStorage.setItem('modulo_funcoes_' + exId, 'true'); atualizarProgresso(); }
function atualizarProgresso() {
  var codOk = (concluidos['fn_1'] ? 1 : 0) + (concluidos['fn_2'] ? 1 : 0) + (concluidos['fn_3'] ? 1 : 0) + (concluidos['fn_4'] ? 1 : 0) + (concluidos['fn_5'] ? 1 : 0);
  var quizPct = parseInt(localStorage.getItem('modulo_funcoes_quiz') || 0);
  var pct = Math.round((quizPct * 0.6) + (codOk / 5 * 100 * 0.4));
  document.getElementById('barra-progresso').style.width = pct + '%';
  document.getElementById('texto-progresso').textContent = 'Quiz: ' + (quizPct > 0 ? 'feito' : 'pendente') + ' · Código: ' + codOk + ' de 5';
  document.getElementById('pct-progresso').textContent = pct + '%';
  localStorage.setItem('prog_funcoes', pct);
}
function irPara(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
document.addEventListener("DOMContentLoaded", function() {
  renderizarQuiz();
  var _respostasJSON = localStorage.getItem('modulo_funcoes_quiz_respostas');
  if (_respostasJSON) {
    try {
      var _respostas = JSON.parse(_respostasJSON);
      Object.keys(_respostas).forEach(function(i) {
        var inp = document.querySelector('input[name="q' + i + '"][value="' + _respostas[i] + '"]');
        if (inp) inp.checked = true;
      });
      if (localStorage.getItem('modulo_funcoes_quiz')) { setTimeout(function() { verificarQuiz(); }, 0); }
    } catch(e) {}
  }
  if (localStorage.getItem('modulo_funcoes_quiz')) concluidos.quiz = true;
  if (localStorage.getItem('modulo_funcoes_fn_1') === 'true') concluidos['fn_1'] = true;
  if (localStorage.getItem('modulo_funcoes_fn_2') === 'true') concluidos['fn_2'] = true;
  if (localStorage.getItem('modulo_funcoes_fn_3') === 'true') concluidos['fn_3'] = true;
  if (localStorage.getItem('modulo_funcoes_fn_4') === 'true') concluidos['fn_4'] = true;
  if (localStorage.getItem('modulo_funcoes_fn_5') === 'true') concluidos['fn_5'] = true;
  atualizarProgresso();
});
document.querySelectorAll('.sidebar-item').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.sidebar-item').forEach(function(i) { i.classList.remove('ativo'); });
    this.classList.add('ativo');
  });
});
