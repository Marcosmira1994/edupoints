/* Historical results: saved names/points stay authoritative, current students only enable profiles. */
(function(root){
  'use strict';
  function groups(records){
    var map=new Map();
    (records||[]).forEach(function(r){
      var key=String(r.bimestre||'Bimestre sem nome');
      if(!map.has(key))map.set(key,{name:key,createdAt:0,items:[]});
      var g=map.get(key),date=new Date(r.criadoEm).getTime();
      if(Number.isFinite(date))g.createdAt=Math.max(g.createdAt,date);
      g.items.push(r);
    });
    return Array.from(map.values()).sort(function(a,b){return b.createdAt-a.createdAt;}).map(function(g){
      var sorted=g.items.slice().sort(function(a,b){return Number(b.pontos)-Number(a.pontos)||Number(a.posicao)-Number(b.posicao);});
      var tiers=[];
      g.items=sorted.map(function(r,i){
        var points=Number.isFinite(Number(r.pontos))?Number(r.pontos):0;
        if(!tiers.includes(points))tiers.push(points);
        var rank=sorted.findIndex(function(x){return Number(x.pontos)===points;})+1;
        return {record:r,points:points,rank:rank||i+1,tier:tiers.indexOf(points)+1};
      });
      return g;
    });
  }

  /* Titles: one star per student per saved bimester whose highest saved score was theirs.
     Only saved Hall records are used (never current points). Bimesters are identified by saved
     name; unnamed ones are excluded and reported, repeated saves of one name are merged and reported. */
  function champions(records){
    var periods=new Map(),skipped={unnamed:0,noStudent:0,badPoints:0},dupNames=[];
    (records||[]).forEach(function(r){
      if(!r)return;
      var name=String(r.bimestre==null?'':r.bimestre).trim();
      if(!name){skipped.unnamed++;return;}
      var id=r.alunoId==null?'':String(r.alunoId);
      if(!id){skipped.noStudent++;return;}
      var pts=Number(r.pontos);
      if(!Number.isFinite(pts)){skipped.badPoints++;return;}
      var p=periods.get(name);
      if(!p){p={name:name,createdAt:0,lots:new Set(),students:new Map()};periods.set(name,p);}
      var at=new Date(r.criadoEm).getTime();
      if(Number.isFinite(at)){p.createdAt=Math.max(p.createdAt,at);}
      p.lots.add(String(r.criadoEm));
      var cur=p.students.get(id);
      if(!cur||pts>cur.points)p.students.set(id,{points:pts});
    });
    var people=new Map();
    function person(id){var x=people.get(id);if(!x){x={alunoId:id,name:'',fotoUrl:null,seenAt:-1,titles:[]};people.set(id,x);}return x;}
    (records||[]).forEach(function(r){
      if(!r||r.alunoId==null||r.alunoId==='')return;
      var x=person(String(r.alunoId)),at=new Date(r.criadoEm).getTime();at=Number.isFinite(at)?at:0;
      if(at>=x.seenAt){x.seenAt=at;if(r.alunoNome)x.name=r.alunoNome;if(r.fotoUrl)x.fotoUrl=r.fotoUrl;}
      else{if(!x.name&&r.alunoNome)x.name=r.alunoNome;if(!x.fotoUrl&&r.fotoUrl)x.fotoUrl=r.fotoUrl;}
    });
    periods.forEach(function(p){
      if(p.lots.size>1)dupNames.push(p.name);
      var best=-Infinity;p.students.forEach(function(v){if(v.points>best)best=v.points;});
      if(!(best>0))return;
      p.students.forEach(function(v,id){if(v.points===best)person(id).titles.push({period:p.name,createdAt:p.createdAt,points:v.points});});
    });
    var list=[];
    people.forEach(function(x){if(x.titles.length){x.titles.sort(function(a,b){return a.createdAt-b.createdAt||a.period.localeCompare(b.period,'pt-BR');});x.count=x.titles.length;list.push(x);}});
    list.sort(function(a,b){return b.count-a.count||String(a.name).localeCompare(String(b.name),'pt-BR');});
    list.forEach(function(x,i){x.position=i&&list[i-1].count===x.count?list[i-1].position:i+1;});
    return {ranking:list,periodCount:periods.size,duplicateNames:dupNames,skipped:skipped,
      partial:dupNames.length>0||skipped.unnamed>0||skipped.noStudent>0||skipped.badPoints>0};
  }
  var memo={src:null,len:-1,value:null};
  function index(){
    var src=root.hallAura||[];
    if(memo.src!==src||memo.len!==src.length){
      var c=champions(src),byId=new Map();c.ranking.forEach(function(x){byId.set(x.alunoId,x);});
      memo={src:src,len:src.length,value:{data:c,byId:byId}};
    }
    return memo.value;
  }
  function titlesFor(id){var x=index().byId.get(String(id));return x?x.count:0;}
  function titleDetails(id){var x=index().byId.get(String(id));return x?x.titles.slice():[];}
  function plural(n){return n+' título'+(n===1?'':'s');}
  var SVG='http://www.w3.org/2000/svg';
  function star(){
    var s=document.createElementNS(SVG,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('class','hall-star');s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false');
    var p=document.createElementNS(SVG,'path');p.setAttribute('d','M12 2.6l2.8 6 6.6.8-4.9 4.5 1.3 6.5L12 17.1 6.2 20.4l1.3-6.5L2.6 9.4l6.6-.8z');s.appendChild(p);return s;
  }
  // Up to five individual stars; above that a single star with "x N".
  function stars(count){
    var w=document.createElement('span');w.className='hall-stars';w.setAttribute('role','img');w.setAttribute('aria-label',plural(count));
    if(count<=5){for(var i=0;i<count;i++)w.appendChild(star());}
    else{w.appendChild(star());var t=document.createElement('span');t.className='hall-stars-n';t.textContent='\u00d7 '+count;w.appendChild(t);}
    return w;
  }
  // Compact marker for lists/profile: historical titles, not current position.
  function mark(id){
    var n=titlesFor(id);if(!n)return null;
    var m=document.createElement('span');m.className='title-mark';m.setAttribute('role','img');
    m.setAttribute('aria-label',plural(n)+' de bimestre no Hall (histórico)');m.title=plural(n)+' de bimestre no Hall da Aura (histórico, não é a posição atual)';
    m.appendChild(star());var t=document.createElement('span');t.textContent=String(n);m.appendChild(t);return m;
  }
  var selected=null;
  function render(){
    var host=document.getElementById('hall-list');if(!host)return;
    var status=host.querySelector('#hall-status'),el=host.querySelector('.hall-content');
    if(!status){status=document.createElement('div');status.id='hall-status';status.className='hall-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.tabIndex=-1;host.append(status);}
    if(!el){el=document.createElement('div');el.className='hall-content';host.append(el);}
    var data=groups(root.hallAura),state=root.hallState||'idle';
    el.setAttribute('aria-busy',String(state==='loading'));
    status.textContent=state==='loading'?'Atualizando os bimestres…':state==='error'?'Não foi possível atualizar o Hall.':data.length?'Bimestres carregados.':'Nenhum bimestre registrado.';
    el.replaceChildren();
    function node(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
    function icon(name){var e=node('span','hall-icon');e.innerHTML=root.epIcon(name);return e;}
    function action(text,fn,cls){var b=node('button',cls||'btn btn-gh',text);b.type='button';b.addEventListener('click',fn);return b;}
    function retry(){
      var ownedFocus=el.contains(document.activeElement),attempt=root.fetchHallAura();render();
      if(ownedFocus)status.focus({preventScroll:true});
      attempt.then(function(){var restore=ownedFocus&&document.activeElement===status;render();if(!restore)return;var focus=root.hallState==='error'?el.querySelector('.hall-empty button,.hall-notice button'):el.querySelector('#hall-period,.hall-empty button');if(focus)focus.focus();});
    }
    if(!data.length){
      var empty=node('section','es hall-empty');empty.setAttribute('role','status');empty.append(icon('award'));
      var offline=state==='idle'&&!navigator.onLine,failed=state==='error'||offline,loading=state==='loading';
      empty.append(node('h2','',loading?'Carregando os campeões…':offline?'Conecte-se para ver os campeões':failed?'Não foi possível carregar o Hall':'Cada conquista merece ficar na história.'));
      empty.append(node('p','',loading?'Buscando os bimestres salvos.':failed?'Confira a conexão e tente novamente.':'Os resultados dos bimestres encerrados aparecerão aqui, com os alunos e as pontuações daquela época.'));
      if(failed)empty.append(action('Tentar novamente',retry));
      if(!failed&&!loading&&root.isAdmin)empty.append(action('Encerrar um bimestre',root.openEncerrarBimestre,'btn btn-p'));
      el.append(empty);return;
    }
    if(state==='error'){
      var warn=node('div','hall-notice','Não foi possível atualizar. Exibindo os resultados já carregados.');warn.setAttribute('role','status');warn.append(action('Tentar novamente',retry));el.append(warn);
    }
    if(state==='loading')el.append(node('div','hall-notice','Atualizando os bimestres…'));
    if(!data.some(function(g){return g.name===selected;}))selected=data[0].name;
    function current(item){return (root.S.students||[]).find(function(s){return s.id===item.record.alunoId;});}
    function avatar(item,cls){
      var r=item.record,student=current(item),wrap=node('span',cls),url=r.fotoUrl||(student&&student.fotoUrl);
      var initial=String(r.alunoNome||'?').charAt(0).toUpperCase(),fallback=node('span','hall-avatar-initial',initial);fallback.setAttribute('aria-hidden','true');wrap.append(fallback);
      if(url){var img=document.createElement('img');img.alt='';img.loading='lazy';img.decoding='async';img.src=url;
        img.addEventListener('load',function(){fallback.hidden=true;});
        img.addEventListener('error',function(){img.remove();fallback.hidden=false;});wrap.append(img);}
      return wrap;
    }

    var champs=index().data,expanded=render.expanded||(render.expanded=new Set());
    var cs=node('section','hall-champions'),ch=node('div','hall-champions-heading'),ct=node('h2','','Ranking dos Campeões');ct.id='hall-champions-title';
    cs.setAttribute('aria-labelledby',ct.id);ch.append(ct,node('p','','Uma estrela por bimestre encerrado em 1º lugar, com base nos bimestres salvos no Hall.'));cs.append(ch);
    if(!champs.ranking.length){cs.append(node('p','hall-champions-empty','Ainda não há campeões registrados nos bimestres salvos.'));}
    else{
      var cl=node('ol','hall-champions-list');
      champs.ranking.forEach(function(c){
        var li=node('li','hall-champion'),id='hall-champ-'+String(c.alunoId).replace(/[^\w-]/g,'_');
        var stu=(root.S.students||[]).find(function(s){return s.id===c.alunoId;});
        var head=node('button','hall-champion-head');head.type='button';head.setAttribute('aria-expanded',String(expanded.has(c.alunoId)));head.setAttribute('aria-controls',id);
        head.append(node('span','hall-champion-pos',c.position+'º'),avatar({record:{alunoId:c.alunoId,alunoNome:c.name,fotoUrl:c.fotoUrl}},'hall-list-avatar hall-champ-avatar'));
        var who=node('span','hall-champion-who');who.append(node('strong','',c.name||'Aluno sem nome'));if(!stu)who.append(node('small','','Registro histórico'));head.append(who);
        var tot=node('span','hall-champion-total');tot.append(stars(c.count),node('small','',plural(c.count)));head.append(tot);
        var det=node('div','hall-champion-details');det.id=id;det.hidden=!expanded.has(c.alunoId);
        var ul=node('ul','');c.titles.forEach(function(t){var l=node('li','');l.append(node('strong','',t.period),node('span','',t.points.toLocaleString('pt-BR')+' pontos'));ul.append(l);});det.append(ul);
        if(stu){det.append(action('Abrir perfil atual',function(){root.openProfile(c.alunoId);}));}
        head.addEventListener('click',function(){var on=det.hidden;det.hidden=!on;head.setAttribute('aria-expanded',String(on));if(on)expanded.add(c.alunoId);else expanded.delete(c.alunoId);});
        li.append(head,det);cl.append(li);
      });
      cs.append(cl);
    }
    var cnote=champs.partial?'Atenção: há registros sem identificação clara ou bimestres salvos mais de uma vez'+(champs.duplicateNames.length?' ('+champs.duplicateNames.join(', ')+')':'')+'. Confira antes de usar a contagem como definitiva.':'Contagem feita com '+champs.periodCount+' bimestre'+(champs.periodCount===1?'':'s')+' salvo'+(champs.periodCount===1?'':'s')+' no Hall. Bimestres que não foram salvos não entram.';
    cs.append(node('p','hall-history-note',cnote));el.append(cs);
    var toolbar=node('div','hall-toolbar'),field=node('div','hall-period-field'),label=node('label','','Bimestre');label.htmlFor='hall-period';
    var select=node('select','sel');select.id='hall-period';
    data.forEach(function(g){var option=node('option','',g.name);option.value=g.name;select.append(option);});select.value=selected;
    select.addEventListener('change',function(){selected=select.value;render();var next=document.getElementById('hall-period');if(next)next.focus();});
    field.append(label,select);toolbar.append(field,node('p','hall-archive-count',data.length+' bimestre'+(data.length===1?' registrado':'s registrados')));el.append(toolbar);
    var group=data.find(function(g){return g.name===selected;}),section=node('section','hall-season');
    var head=node('div','hall-season-heading'),heading=node('h2','',group.name);heading.id='hall-season-title';section.setAttribute('aria-labelledby',heading.id);
    var details=group.items.length+' aluno'+(group.items.length===1?' reconhecido':'s reconhecidos');
    if(group.createdAt)details+=' · Encerrado em '+new Date(group.createdAt).toLocaleDateString('pt-BR');
    head.append(heading,node('p','',details));section.append(head);
    var honors=node('div','hall-honors');honors.setAttribute('aria-label','Destaques do bimestre');
    function recordElement(item,cls){
      var student=current(item),e=node(student?'button':'article',cls);
      if(student){e.type='button';e.setAttribute('aria-label','Abrir perfil atual de '+(item.record.alunoNome||'Aluno sem nome')+', '+item.rank+'º lugar em '+group.name+', '+item.points.toLocaleString('pt-BR')+' pontos');e.addEventListener('click',function(){root.openProfile(item.record.alunoId);});}
      return e;
    }
    group.items.filter(function(item){return item.tier<=3;}).forEach(function(item){
      var r=item.record,card=recordElement(item,'hall-honor hall-tier-'+item.tier),top=node('div','hall-honor-top');
      var position=node('span','hall-placement');position.append(icon(item.tier===1?'trophy':'award'),document.createTextNode(item.rank+'º lugar'));top.append(position);
      card.append(top,avatar(item,'hall-portrait'),node('h3','hall-student-name',r.alunoNome||'Aluno sem nome'));
      var score=node('div','hall-honor-score');score.append(node('strong','',item.points.toLocaleString('pt-BR')),node('span','','pontos'));card.append(score);
      if(current(item)){var link=node('span','hall-profile-link','Perfil atual ');link.append(icon('arrow'));card.append(link);}else card.append(node('span','hall-profile-link','Registro histórico'));
      honors.append(card);
    });section.append(honors);
    var sub=node('div','classification-heading');sub.append(node('h3','','Classificação do bimestre'),node('span','','Pontuação final'));section.append(sub);
    var list=node('div','hall-results');
    group.items.forEach(function(item){var r=item.record,row=recordElement(item,'hall-result'),who=node('span','hall-result-person'),text=node('span','hall-result-name');
      text.append(node('strong','',r.alunoNome||'Aluno sem nome'));if(!current(item))text.append(node('small','','Registro histórico'));
      who.append(avatar(item,'hall-list-avatar'),text);row.append(node('span','hall-result-rank',String(item.rank).padStart(2,'0')),who);
      var value=node('span','hall-result-points');value.append(node('strong','',item.points.toLocaleString('pt-BR')),node('small','','pontos'));row.append(value);if(current(item))row.append(icon('arrow'));else row.append(node('span','hall-result-end','—'));list.append(row);
    });section.append(list,node('p','hall-history-note','Este é o resultado salvo ao encerrar o bimestre. O perfil, quando disponível, mostra os dados atuais do aluno.'));el.append(section);
  }
  var api={groups:groups,render:render,champions:champions,titlesFor:titlesFor,titleDetails:titleDetails,mark:mark,stars:stars};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.EPhall=api;
})(typeof window!=='undefined'?window:globalThis);
