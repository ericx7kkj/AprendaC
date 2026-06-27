// ── QUIZ ──
var MODULO='intro', TOTAL_QUIZ=12, TOTAL_CODIGO=5;
var concluidos={quiz:false,intro_1:false,intro_2:false,intro_3:false,intro_4:false,intro_5:false};

var QUIZZES=[
  {p:'Em que ano a linguagem C foi criada?',o:['1960','1972','1985','1991'],c:1},
  {p:'Quem criou a linguagem C?',o:['Linus Torvalds','Bjarne Stroustrup','Dennis Ritchie','James Gosling'],c:2},
  {p:'O que o #include &lt;stdio.h&gt; faz?',o:['Define a função main()','Encerra o programa','Inclui a biblioteca padrão de entrada e saída','Declara variáveis globais'],c:2},
  {p:'Qual é o valor de retorno correto de main() com sucesso?',o:['1','-1','0','void'],c:2},
  {p:'O que o caractere \\n representa dentro de uma string em C?',o:['Nulo','Nova linha','Tabulação','Barra invertida'],c:1},
  {p:'C é uma linguagem:',o:['Interpretada','Compilada','Ambas','Nenhuma das anteriores'],c:1},
  {p:'Qual símbolo encerra toda instrução em C?',o:[':','.','!',';'],c:3},
  {p:'O que as chaves { } delimitam em C?',o:['Comentários','Strings','Blocos de código','Tipos de dados'],c:2},
  {p:'Qual das opções é um comentário válido em C?',o:['## comentario','&lt;!-- comentario --&gt;','// comentario','** comentario'],c:2},
  {p:'Para que serve o return 0; no final do main()?',o:['Imprime zero na tela','Indica que o programa encerrou com sucesso','Libera memória','Reinicia o programa'],c:1},
  {p:'Qual extensão têm arquivos de código-fonte em C?',o:['.cpp','.java','.c','.py'],c:2},
  {p:'O que o \\t dentro de uma string representa?',o:['Nova linha','Tabulação (tab)','Retorno de carro','Espaço simples'],c:1}
];

function renderizarQuiz(){
  var letras=['A','B','C','D'],html='';
  QUIZZES.forEach(function(q,i){
    html+='<div class="quiz-item"><div class="quiz-pergunta"><span class="quiz-pergunta-num">Questão '+(i+1)+' de '+QUIZZES.length+'</span>'+q.p+'</div><div class="quiz-opcoes">';
    q.o.forEach(function(op,oi){html+='<label class="quiz-opcao"><input type="radio" name="q'+i+'" value="'+oi+'"> <span>'+letras[oi]+') '+op+'</span></label>';});
    html+='</div></div>';
  });
  document.getElementById('quiz-intro').innerHTML=html;
  document.getElementById('excount-intro').textContent='— 0/'+QUIZZES.length+' corretos';
}

function verificarQuiz(){
  var acertos=0,tudoRespondido=true;
  QUIZZES.forEach(function(q,i){
    var sel=document.querySelector('input[name="q'+i+'"]:checked');
    document.querySelectorAll('input[name="q'+i+'"]').forEach(function(inp){inp.parentElement.classList.remove('correta-marcada','errada-marcada');inp.disabled=true;});
    if(!sel){tudoRespondido=false;document.querySelectorAll('input[name="q'+i+'"]').forEach(function(inp){inp.disabled=false;});return;}
    if(parseInt(sel.value)===q.c){sel.parentElement.classList.add('correta-marcada');acertos++;}
    else{sel.parentElement.classList.add('errada-marcada');var corr=document.querySelector('input[name="q'+i+'"][value="'+q.c+'"]');if(corr)corr.parentElement.classList.add('correta-marcada');}
  });
  var res=document.getElementById('res-intro');
  if(!tudoRespondido){res.textContent='Responda todas as questões antes de verificar.';res.className='quiz-resultado parcial';return;}
  var pct=Math.round((acertos/QUIZZES.length)*100);
  document.getElementById('excount-intro').textContent='— '+acertos+'/'+QUIZZES.length+' corretos';
  if(acertos===QUIZZES.length){res.textContent='🎉 Perfeito! Você acertou todas as '+QUIZZES.length+' questões!';res.className='quiz-resultado certo';}
  else if(acertos>=Math.ceil(QUIZZES.length/2)){res.textContent='👍 Você acertou '+acertos+' de '+QUIZZES.length+' ('+pct+'%). Bom trabalho!';res.className='quiz-resultado parcial';}
  else{res.textContent='📖 Você acertou '+acertos+' de '+QUIZZES.length+'. Revise a teoria e tente novamente.';res.className='quiz-resultado errado';}
  var btn=document.getElementById('btn-quiz-intro');if(btn){btn.disabled=true;btn.textContent='Verificado ✓';}
  var respostas={};QUIZZES.forEach(function(q,i){var s=document.querySelector('input[name="q'+i+'"]:checked');if(s)respostas[i]=s.value;});localStorage.setItem('modulo_intro_quiz_respostas',JSON.stringify(respostas));var melhorAnterior=parseInt(localStorage.getItem('modulo_intro_quiz')||0);if(pct>melhorAnterior){localStorage.setItem('modulo_intro_quiz',pct);}concluidos.quiz=true;atualizarProgresso();
}

function marcarConcluido(exId){if(concluidos[exId])return;concluidos[exId]=true;localStorage.setItem('modulo_intro_'+exId,'true');atualizarProgresso();}

function atualizarProgresso(){
  var keys=['intro_1','intro_2','intro_3','intro_4','intro_5'];
  var codOk=keys.filter(function(k){return concluidos[k];}).length;
  var quizFeito=concluidos.quiz ? 1 : 0;
  // Quiz concluido = 50pts; cada exercicio = 10pts (5x10=50); total = 100
  var pct=Math.min(100, Math.round((quizFeito*50)+(codOk/TOTAL_CODIGO*50)));
  document.getElementById('barra-progresso').style.width=pct+'%';
  document.getElementById('texto-progresso').textContent='Quiz: '+(quizFeito?'feito \u2713':'pendente')+' \u00B7 C\u00f3digo: '+codOk+' de '+TOTAL_CODIGO;
  document.getElementById('pct-progresso').textContent=pct+'%';
  localStorage.setItem('prog_intro',pct);
}

function irPara(id){var el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}

document.addEventListener("DOMContentLoaded",function(){
  renderizarQuiz();
  // Restaurar respostas do quiz
  var _respostasJSON = localStorage.getItem('modulo_intro_quiz_respostas');
  if (_respostasJSON) {
    try {
      var _respostas = JSON.parse(_respostasJSON);
      Object.keys(_respostas).forEach(function(i) {
        var inp = document.querySelector('input[name="q' + i + '"][value="' + _respostas[i] + '"]');
        if (inp) inp.checked = true;
      });
      // Se o quiz foi verificado, reaplicar estado bloqueado
      if (localStorage.getItem('modulo_intro_quiz')) {
        setTimeout(function() { verificarQuiz(); }, 0);
      }
    } catch(e) {}
  }
  if(localStorage.getItem('modulo_intro_quiz'))concluidos.quiz=true;
  ['intro_1','intro_2','intro_3','intro_4','intro_5'].forEach(function(k){if(localStorage.getItem('modulo_intro_'+k)==='true')concluidos[k]=true;});
  atualizarProgresso();
});
document.querySelectorAll('.sidebar-item').forEach(function(item){
  item.addEventListener('click',function(){document.querySelectorAll('.sidebar-item').forEach(function(i){i.classList.remove('ativo');});this.classList.add('ativo');});
});
