var concluidos = { quiz: false, pt_1: false, pt_2: false, pt_3: false, pt_4: false, pt_5: false };
var TOTAL_CODIGO = 5;

var QUIZZES = [
  {p:'O que é um ponteiro em C?', o:['Uma variável que guarda texto','Uma variável que guarda o endereço de outra variável','Um tipo de laço','Uma função sem retorno'], c:1},
  {p:'O operador & antes de uma variável retorna:', o:['Seu valor','Seu tipo','Seu endereço na memória','Uma cópia dela'], c:2},
  {p:'Como declarar um ponteiro para int?', o:['int p;','int &p;','int *p;','pointer int p;'], c:2},
  {p:'O operador * antes de um ponteiro (em uso) faz o quê?', o:['Declara o ponteiro','Multiplica por 2','Acessa o valor no endereço apontado','Libera a memória'], c:2},
  {p:'O que é um ponteiro nulo (NULL)?', o:['Um ponteiro que aponta para zero','Um ponteiro que não aponta para nenhum endereço válido','Um ponteiro para string vazia','Um erro de compilação'], c:1},
  {p:'O que acontece ao usar um ponteiro não inicializado?', o:['Sempre retorna 0','Comportamento indefinido — pode travar o programa','Gera erro de compilação','Aponta para NULL automaticamente'], c:1},
  {p:'Dado int v[] = {1,2,3} e int *p = v, o que é *(p+1)?', o:['1','2','3','Erro'], c:1},
  {p:'Qual a relação entre arrays e ponteiros em C?', o:['Não têm relação','O nome do array é um ponteiro para o primeiro elemento','Arrays são sempre maiores que ponteiros','Ponteiros não podem apontar para arrays'], c:1},
  {p:'Para modificar o valor original de uma variável dentro de uma função, deve-se:', o:['Retornar o novo valor','Passar a variável por valor','Passar o endereço da variável (ponteiro)','Declarar a variável como global'], c:2},
  {p:'O que faz p++ quando p é um ponteiro para int?', o:['Soma 1 ao valor apontado','Avança p para o próximo int na memória','Gera erro de compilação','Duplica o endereço'], c:1},
  {p:'Qual especificador de formato imprime um endereço de memória?', o:['%d','%s','%p','%x'], c:2},
  {p:'int *p = NULL; O que significa *p = 5 neste caso?', o:['Atribui 5 ao ponteiro','Comportamento indefinido — acesso a endereço inválido','Inicializa p com 5','Cria uma variável nova'], c:1},
  {p:'Dado int x = 10 e int *p = &x, o que é *p = 20?', o:['Muda o endereço de p','Muda x para 20','Cria uma cópia de x','Erro de compilação'], c:1},
  {p:'Quantos bytes avança p++ se p é um ponteiro para double (8 bytes)?', o:['1 byte','4 bytes','8 bytes','Depende do compilador'], c:2},
  {p:'Qual é a diferença entre *p e &p?', o:['Nenhuma','*p acessa o valor apontado; &p é o endereço do próprio ponteiro','*p é o endereço; &p é o valor','Ambos retornam o endereço de p'], c:1}
];

function renderizarQuiz() {
  var letras = ['A','B','C','D']; var html = '';
  QUIZZES.forEach(function(q, i) {
    html += '<div class="quiz-item"><div class="quiz-pergunta"><span class="quiz-pergunta-num">Questão ' + (i+1) + ' de ' + QUIZZES.length + '</span>' + q.p + '</div><div class="quiz-opcoes">';
    q.o.forEach(function(op, oi) { html += '<label class="quiz-opcao"><input type="radio" name="q' + i + '" value="' + oi + '"> <span>' + letras[oi] + ') ' + op + '</span></label>'; });
    html += '</div></div>';
  });
  document.getElementById('quiz-ponteiros').innerHTML = html;
  document.getElementById('excount-ponteiros').textContent = '— 0/' + QUIZZES.length + ' corretos';
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
  var res = document.getElementById('res-ponteiros');
  if (!tudoRespondido) { res.textContent = 'Responda todas as questoes antes de verificar.'; res.className = 'quiz-resultado parcial'; return; }
  var pct = Math.round((acertos / QUIZZES.length) * 100);
  document.getElementById('excount-ponteiros').textContent = '— ' + acertos + '/' + QUIZZES.length + ' corretos';
  if (acertos === QUIZZES.length) { res.textContent = 'Perfeito! Voce acertou todas!'; res.className = 'quiz-resultado certo'; }
  else if (acertos >= Math.ceil(QUIZZES.length/2)) { res.textContent = 'Voce acertou ' + acertos + ' de ' + QUIZZES.length + '. Bom trabalho!'; res.className = 'quiz-resultado parcial'; }
  else { res.textContent = 'Voce acertou ' + acertos + ' de ' + QUIZZES.length + '. Revise a teoria.'; res.className = 'quiz-resultado errado'; }
  var btn = document.getElementById('btn-quiz-ponteiros'); if (btn) { btn.disabled = true; btn.textContent = 'Verificado'; }
  var respostas={};QUIZZES.forEach(function(q,i){var s=document.querySelector('input[name="q'+i+'"]:checked');if(s)respostas[i]=s.value;});localStorage.setItem('modulo_ponteiros_quiz_respostas',JSON.stringify(respostas));localStorage.setItem('modulo_ponteiros_quiz',100);concluidos.quiz=true;atualizarProgresso();
}
function marcarConcluido(exId) { if (concluidos[exId]) return; concluidos[exId] = true; localStorage.setItem('modulo_ponteiros_' + exId, 'true'); atualizarProgresso(); }
function atualizarProgresso() {
  var codOk = (concluidos['pt_1'] ? 1 : 0) + (concluidos['pt_2'] ? 1 : 0) + (concluidos['pt_3'] ? 1 : 0) + (concluidos['pt_4'] ? 1 : 0) + (concluidos['pt_5'] ? 1 : 0);
  var quizPct = parseInt(localStorage.getItem('modulo_ponteiros_quiz') || 0);
  var pct = Math.round((quizPct * 0.6) + (codOk / TOTAL_CODIGO * 100 * 0.4));
  document.getElementById('barra-progresso').style.width = pct + '%';
  document.getElementById('texto-progresso').textContent = 'Quiz: ' + (quizPct > 0 ? 'feito' : 'pendente') + ' · Código: ' + codOk + ' de ' + TOTAL_CODIGO;
  document.getElementById('pct-progresso').textContent = pct + '%';
  localStorage.setItem('prog_ponteiros', pct);
}
function irPara(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
document.addEventListener("DOMContentLoaded", function() {
  renderizarQuiz();
  var _respostasJSON = localStorage.getItem('modulo_ponteiros_quiz_respostas');
  if (_respostasJSON) {
    try {
      var _respostas = JSON.parse(_respostasJSON);
      Object.keys(_respostas).forEach(function(i) {
        var inp = document.querySelector('input[name="q' + i + '"][value="' + _respostas[i] + '"]');
        if (inp) inp.checked = true;
      });
      if (localStorage.getItem('modulo_ponteiros_quiz')) { setTimeout(function() { verificarQuiz(); }, 0); }
    } catch(e) {}
  }
  if (localStorage.getItem('modulo_ponteiros_quiz')) concluidos.quiz = true;
  if (localStorage.getItem('modulo_ponteiros_pt_1') === 'true') concluidos['pt_1'] = true;
  if (localStorage.getItem('modulo_ponteiros_pt_2') === 'true') concluidos['pt_2'] = true;
  if (localStorage.getItem('modulo_ponteiros_pt_3') === 'true') concluidos['pt_3'] = true;
  if (localStorage.getItem('modulo_ponteiros_pt_4') === 'true') concluidos['pt_4'] = true;
  if (localStorage.getItem('modulo_ponteiros_pt_5') === 'true') concluidos['pt_5'] = true;
  atualizarProgresso();
});
document.querySelectorAll('.sidebar-item').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.sidebar-item').forEach(function(i) { i.classList.remove('ativo'); });
    this.classList.add('ativo');
  });
});
