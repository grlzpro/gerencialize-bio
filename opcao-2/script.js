/* Barra de navegação: some ao rolar para baixo, volta com o mouse no topo da tela ou ao rolar para cima */
(()=>{const bar=document.querySelector('nav.bar');let lastY=scrollY,over=false;
 const set=h=>bar.classList.toggle('hide',h&&!over);
 addEventListener('scroll',()=>{const y=scrollY;if(y<80)set(false);else if(y>lastY+4)set(true);else if(y<lastY-4)set(false);lastY=y},{passive:true});
 addEventListener('mousemove',e=>{const near=e.clientY<90;if(near!==over){over=near;if(over)set(false)}});
 bar.addEventListener('focusin',()=>set(false));})();
/* Vidro da barra: escuro sobre a capa e o rodapé, claro sobre as seções brancas */
(()=>{const bar=document.querySelector('nav.bar');
 const tone=()=>{const r=bar.querySelector('.bar-in').getBoundingClientRect();const y=r.top+r.height/2;
  const under=[...document.querySelectorAll('header.hero,section,footer')].find(el=>{const b=el.getBoundingClientRect();return b.top<=y&&b.bottom>y});
  bar.classList.toggle('on-light',!!under&&under.tagName==='SECTION'&&!under.classList.contains('is-dark'))};
 addEventListener('scroll',tone,{passive:true});addEventListener('resize',tone);tone();})();
/* Seletor da barra: pílula roxa translúcida que aparece e desliza só com o mouse sobre os links */
(()=>{const links=document.querySelector('nav.bar .links');if(!links)return;
 const ind=document.createElement('span');ind.className='ind';ind.setAttribute('aria-hidden','true');links.prepend(ind);
 let on=false;
 const place=a=>{ind.style.width=a.offsetWidth+'px';ind.style.transform='translateX('+a.offsetLeft+'px)'};
 links.querySelectorAll('a').forEach(a=>a.addEventListener('mouseenter',()=>{
  if(!on){ind.style.transition='none';place(a);ind.offsetWidth;ind.style.transition='';on=true}else place(a);
  ind.style.opacity=1}));
 links.addEventListener('mouseleave',()=>{ind.style.opacity=0;on=false});})();

document.querySelectorAll('a[href="WA"]').forEach(a=>{a.href="https://wa.me/5584996764404?text="+encodeURIComponent("Olá! Vim pelo site da Gerencialize e quero falar com um especialista.");a.target="_blank";a.rel="noopener"});
/* Depoimentos: carrossel centralizado que passa sozinho; o cartão do meio fica em destaque */
(()=>{const tr=document.getElementById('rvTrack');if(!tr)return;
 const cards=[...tr.querySelectorAll('.rv-card')],p=document.getElementById('rvPrev'),n=document.getElementById('rvNext');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;let idx=0,timer,raf,visible=false,hover=false;
 const left=c=>c.offsetLeft-(tr.clientWidth-c.offsetWidth)/2;
 const go=(i,smooth=true)=>{idx=(i+cards.length)%cards.length;tr.scrollTo({left:left(cards[idx]),behavior:smooth&&!reduce?'smooth':'auto'})};
 const mark=()=>{const mid=tr.scrollLeft+tr.clientWidth/2;let best=0,bd=Infinity;
  cards.forEach((c,i)=>{const d=Math.abs(c.offsetLeft+c.offsetWidth/2-mid);if(d<bd){bd=d;best=i}});
  idx=best;cards.forEach((c,i)=>c.classList.toggle('active',i===best))};
 const stop=()=>clearInterval(timer);
 const start=()=>{stop();if(!reduce&&visible&&!hover)timer=setInterval(()=>go(idx+1),4500)};
 p.onclick=()=>{go(idx-1);start()};n.onclick=()=>{go(idx+1);start()};
 cards.forEach((c,i)=>c.addEventListener('click',e=>{if(i!==idx&&!e.target.closest('a')){go(i);start()}}));
 tr.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(mark)},{passive:true});
 tr.addEventListener('mouseenter',()=>{hover=true;stop()});tr.addEventListener('mouseleave',()=>{hover=false;start()});
 new IntersectionObserver(([e])=>{visible=e.isIntersecting;start()},{threshold:.4}).observe(tr);
 addEventListener('resize',()=>go(idx,false));
 go(Math.floor(cards.length/2),false);mark();})();

/* Chat da capa (estilo typebot): faz as perguntas uma a uma e, no final,
   abre o WhatsApp da agência com as respostas. Para mudar as perguntas, edite PASSOS. */
(function(){
  var WA_NUMERO='5584996764404';
  var body=document.getElementById('chatBody'); if(!body) return;
  var form=document.getElementById('chatForm'), inp=document.getElementById('chatIn'), send=document.getElementById('chatSend');
  var R={}, wait=null, run=0;
  var SERVICOS=['Redes sociais','Tráfego pago','Landing page','Automações','Identidade visual','Treinamentos','Ainda não sei'];
  var PASSOS=[
    {diz:['Olá! 👋 Que bom te ver por aqui.','Vou fazer 4 perguntas rápidas para preparar o seu diagnóstico gratuito. Qual é o seu nome?'],campo:'nome',tipo:'texto',ph:'Seu nome'},
    {diz:[function(){return 'Prazer, '+R.nome.split(' ')[0]+'! Qual é o nome da sua empresa?';}],campo:'empresa',tipo:'texto',ph:'Nome da empresa',pular:'Ainda não tenho empresa'},
    {diz:['O que você está buscando agora?'],campo:'servico',tipo:'opcoes',opcoes:SERVICOS},
    {diz:['Qual é o seu WhatsApp? Um especialista vai continuar a conversa por lá.'],campo:'whats',tipo:'tel',ph:'(84) 9 0000-0000'}
  ];
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
  function down(){body.scrollTop=body.scrollHeight;}
  function bot(txt,id){return new Promise(function(ok){
    var t=el('div','msg bot typing');t.innerHTML='<i></i><i></i><i></i>';body.appendChild(t);down();
    setTimeout(function(){if(id!==run)return;t.remove();body.appendChild(el('div','msg bot',txt));down();ok();},Math.min(1300,450+txt.length*12));
  });}
  function me(txt){body.appendChild(el('div','msg me',txt));down();}
  function lock(on,ph){inp.disabled=send.disabled=on;inp.placeholder=ph||'Digite sua resposta…';if(!on)inp.focus({preventScroll:true});}
  function opts(list,cb){var o=el('div','opts');list.forEach(function(x){var b=el('button',x.cls||'',x.txt||x);b.type='button';b.onclick=function(){o.remove();cb(x.txt||x);};o.appendChild(b);});body.appendChild(o);down();return o;}
  function passo(n,id){
    if(n>=PASSOS.length) return fim(id);
    var p=PASSOS[n], seq=Promise.resolve();
    p.diz.forEach(function(d){seq=seq.then(function(){return bot(typeof d==='function'?d():d,id);});});
    seq.then(function(){
      if(id!==run) return;
      var done=function(v){R[p.campo]=v;passo(n+1,id);}, extra=null;
      if(p.tipo==='opcoes'){lock(true,'Escolha uma opção acima');opts(p.opcoes,function(v){me(v);done(v);});return;}
      if(p.pular) extra=opts([p.pular],function(v){wait=null;lock(true);me(v);done('');});
      inp.type=p.tipo==='tel'?'tel':'text';inp.inputMode=p.tipo==='tel'?'tel':'text';
      lock(false,p.ph);
      wait=function(v){
        if(p.tipo==='tel'&&v.replace(/\D/g,'').length<10){bot('Hmm, esse número parece incompleto. Pode digitar com DDD?',id).then(function(){lock(false,p.ph);});return false;}
        if(extra)extra.remove();done(v);return true;
      };
    });
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();var v=inp.value.trim();if(!v||!wait)return;
    var w=wait;wait=null;inp.value='';lock(true);me(v);if(!w(v))wait=w;
  });
  function fim(id){
    var nome=R.nome.split(' ')[0];
    bot('Perfeito, '+nome+'! ✅ Já tenho tudo o que preciso.',id).then(function(){return bot('Toque no botão abaixo para enviar ao nosso especialista no WhatsApp.',id);}).then(function(){
      if(id!==run)return;lock(true,'Conversa concluída');
      var msg='Olá! Vim pelo site e quero um diagnóstico gratuito.\n\nNome: '+R.nome+(R.empresa?'\nEmpresa: '+R.empresa:'')+'\nInteresse: '+R.servico+'\nWhatsApp: '+R.whats;
      var o=opts([{txt:'Enviar no WhatsApp →',cls:'wa-go'}],function(){window.open('https://wa.me/'+WA_NUMERO+'?text='+encodeURIComponent(msg),'_blank');setTimeout(function(){body.appendChild(o);down();},100);});
    });
  }
  function start(){run++;R={};wait=null;body.innerHTML='';inp.value='';lock(true);passo(0,run);}
  document.getElementById('chatRestart').onclick=start;
  start();
})();
