(() => {
  'use strict';
  const canvas = document.querySelector('#game');
  const ctx = canvas.getContext('2d');
  const W = 960, H = 540, FLOOR = 490;
  const $ = s => document.querySelector(s);
  const ui = { start:$('#startScreen'), win:$('#winScreen'), level:$('#levelLabel'), deaths:$('#deathLabel'), focus:$('#focusMeter'), toast:$('#toast') };
  const keys = { left:false, right:false, jump:false };
  let state = 'menu', levelIndex = 0, deaths = 0, focus = 100, pulse = 0, shake = 0, muted = false, last = 0, toastTimer;
  let player, runtime, particles = [], audio;

  const levels = [
    { name:'Ein ehrlicher Anfang', hint:'Fokus zeigt, was nicht gezeigt werden will.', spawn:[62,430], exit:[870,416],
      platforms:[[0,490,320,50],[390,490,570,50],[355,430,78,18],[590,405,110,18]],
      traps:[{type:'spikes',x:320,y:470,w:70,h:20,hidden:true},{type:'drop',x:590,y:405,w:110,h:18,trigger:535}] },
    { name:'Der Boden hört mit', hint:'Manche Dinge wachen erst auf, wenn du näher kommst.', spawn:[45,430], exit:[875,166],
      platforms:[[0,490,960,50],[205,390,130,18],[430,310,135,18],[665,230,120,18],[845,190,115,18]],
      traps:[{type:'spikes',x:260,y:470,w:62,h:20,trigger:180},{type:'spikes',x:510,y:290,w:42,h:20,hidden:true},{type:'riser',x:710,y:480,w:55,h:10,trigger:625}] },
    { name:'Falsche Sicherheit', hint:'Der kürzeste Weg hat manchmal Zähne.', spawn:[50,430], exit:[866,66],
      platforms:[[0,490,250,50],[325,430,120,18],[505,355,115,18],[690,280,110,18],[835,215,125,18],[740,125,100,18],[850,90,110,18]],
      traps:[{type:'spikes',x:250,y:470,w:75,h:20,hidden:true},{type:'drop',x:505,y:355,w:115,h:18,trigger:455},{type:'spikes',x:750,y:105,w:38,h:20,hidden:true}] },
    { name:'Nach dir', hint:'Nicht jede Plattform möchte eine bleiben.', spawn:[50,430], exit:[875,416],
      platforms:[[0,490,185,50],[250,440,95,18],[405,380,95,18],[560,320,95,18],[715,390,95,18],[855,490,105,50]],
      traps:[{type:'drop',x:250,y:440,w:95,h:18,trigger:185},{type:'drop',x:405,y:380,w:95,h:18,trigger:350},{type:'drop',x:560,y:320,w:95,h:18,trigger:505},{type:'spikes',x:810,y:470,w:45,h:20,hidden:true}] },
    { name:'Der letzte Riss', hint:'Der Raum kennt jetzt deine Gewohnheiten.', spawn:[48,430], exit:[875,126],
      platforms:[[0,490,220,50],[285,430,110,18],[465,365,100,18],[635,300,105,18],[795,240,80,18],[850,160,110,18]],
      traps:[{type:'spikes',x:220,y:470,w:65,h:20,trigger:145},{type:'riser',x:505,y:355,w:42,h:10,trigger:420},{type:'drop',x:635,y:300,w:105,h:18,trigger:575},{type:'spikes',x:810,y:220,w:38,h:20,hidden:true}] }
  ];

  function resetLevel(showHint=true) {
    const l=levels[levelIndex]; player={x:l.spawn[0],y:l.spawn[1],w:25,h:38,vx:0,vy:0,onGround:false,coyote:0,jumpLock:false,facing:1};
    runtime={ traps:l.traps.map(t=>({...t,active:!t.hidden,offset:0,falling:false})), platforms:l.platforms.map(p=>[...p]) };
    pulse=0; focus=100; particles=[]; state='playing'; ui.level.textContent=`${String(levelIndex+1).padStart(2,'0')} / ${String(levels.length).padStart(2,'0')}`;
    if(showHint) showToast(`${l.name} — ${l.hint}`,3300);
  }
  function startGame(){ levelIndex=0; deaths=0; ui.deaths.textContent='00'; ui.start.classList.add('hidden'); ui.win.classList.add('hidden'); resetLevel(); beep(280,.08,'triangle'); }
  function die(){ if(state!=='playing')return; state='dead'; deaths++; ui.deaths.textContent=String(deaths).padStart(2,'0'); shake=14; burst(player.x+12,player.y+18,'#ff5470',18); beep(85,.22,'sawtooth'); setTimeout(()=>resetLevel(false),520); }
  function complete(){ if(state!=='playing')return; state='transition'; burst(player.x+12,player.y+18,'#62f6df',28); beep(540,.1); setTimeout(()=>{ if(++levelIndex>=levels.length){ state='won'; $('#finalStats').textContent=`${deaths} Fehltritte. Aber der Riss ist geschlossen.`; ui.win.classList.remove('hidden'); } else resetLevel(); },650); }
  function showToast(text,ms=1800){ ui.toast.textContent=text; ui.toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>ui.toast.classList.remove('show'),ms); }
  function focusPulse(){ if(state!=='playing'||focus<35||pulse>0)return; focus-=35; pulse=1; runtime.traps.forEach(t=>{ if(t.hidden)t.active=true; }); beep(720,.08,'sine'); }
  function beep(freq,d=.06,type='square'){ if(muted)return; audio ||= new (window.AudioContext||window.webkitAudioContext)(); const o=audio.createOscillator(),g=audio.createGain(); o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+d); }
  const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  function burst(x,y,color,n){ for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*260,vy:(Math.random()-.8)*240,life:1,color}); }

  function update(dt){
    particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=420*dt;p.life-=dt*1.8}); particles=particles.filter(p=>p.life>0);
    if(state!=='playing')return;
    const p=player, speed=230; p.vx=(keys.left?-speed:0)+(keys.right?speed:0); if(p.vx)p.facing=Math.sign(p.vx);
    p.coyote=p.onGround?.11:Math.max(0,p.coyote-dt);
    if(keys.jump&&!p.jumpLock&&p.coyote>0){p.vy=-420;p.onGround=false;p.coyote=0;p.jumpLock=true;beep(310,.05,'square');}
    if(!keys.jump)p.jumpLock=false;
    p.vy=Math.min(760,p.vy+1180*dt);
    p.x+=p.vx*dt; resolve('x'); p.y+=p.vy*dt; p.onGround=false; resolve('y');
    p.x=Math.max(0,Math.min(W-p.w,p.x)); if(p.y>H+70)die();
    runtime.traps.forEach(t=>{
      if(t.trigger!==undefined&&p.x>t.trigger)t.active=true;
      if(t.type==='drop'&&t.active&&p.x>t.x-35){t.falling=true;}
      if(t.falling)t.offset=Math.min(190,t.offset+180*dt);
      if(t.type==='riser'&&t.active)t.offset=Math.min(30,t.offset+130*dt);
      const box=trapBox(t); if(t.active&&overlap(p,box))die();
    });
    const ex=levels[levelIndex].exit; if(overlap(p,{x:ex[0],y:ex[1],w:46,h:74}))complete();
    pulse=Math.max(0,pulse-dt*.72); focus=Math.min(100,focus+dt*9); ui.focus.style.width=`${focus}%`;
  }
  function resolve(axis){
    const p=player;
    runtime.platforms.forEach((pl,i)=>{
      const trap=runtime.traps.find(t=>t.type==='drop'&&t.x===pl[0]&&t.y===pl[1]); const r={x:pl[0],y:pl[1]+(trap?.offset||0),w:pl[2],h:pl[3]};
      if(!overlap(p,r))return;
      if(axis==='x'){ if(p.vx>0)p.x=r.x-p.w; else if(p.vx<0)p.x=r.x+r.w; p.vx=0; }
      else if(p.vy>0){p.y=r.y-p.h;p.vy=0;p.onGround=true;} else if(p.vy<0){p.y=r.y+r.h;p.vy=0;}
    });
  }
  function trapBox(t){ if(t.type==='spikes')return{x:t.x+4,y:t.y+(t.active?0:18),w:t.w-8,h:t.h}; if(t.type==='riser')return{x:t.x,y:t.y-t.offset,w:t.w,h:t.h+t.offset}; return{x:-99,y:-99,w:0,h:0}; }

  function draw(){
    ctx.save(); if(shake>0){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake*=.84;}
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#11172a');g.addColorStop(1,'#080b14');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(120,140,190,.055)';ctx.lineWidth=1; for(let x=0;x<W;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    if(state!=='menu'){
      const l=levels[Math.min(levelIndex,levels.length-1)];
      const ex=l.exit; ctx.save();ctx.shadowBlur=28;ctx.shadowColor='#9a7cff';ctx.strokeStyle='#9a7cff';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(ex[0]+23,ex[1]+37,17,34,0,0,Math.PI*2);ctx.stroke();ctx.restore();
      runtime?.platforms.forEach(pl=>{ const t=runtime.traps.find(v=>v.type==='drop'&&v.x===pl[0]&&v.y===pl[1]); platform(pl[0],pl[1]+(t?.offset||0),pl[2],pl[3]); });
      runtime?.traps.forEach(drawTrap);
      if(player&&state!=='dead')drawPlayer();
      particles.forEach(p=>{ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,4,4);ctx.globalAlpha=1;});
      if(pulse>0){ctx.strokeStyle=`rgba(98,246,223,${pulse*.5})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(player.x+12,player.y+19,(1-pulse)*520,0,Math.PI*2);ctx.stroke();ctx.fillStyle=`rgba(98,246,223,${pulse*.035})`;ctx.fillRect(0,0,W,H);}
    }
    ctx.restore();
  }
  function platform(x,y,w,h){ctx.fillStyle='#242b43';ctx.fillRect(x,y,w,h);ctx.fillStyle='#3b4666';ctx.fillRect(x,y,w,3);ctx.fillStyle='rgba(98,246,223,.1)';ctx.fillRect(x,y+3,3,h-3);}
  function drawTrap(t){
    const revealed=t.active||pulse>0; if(!revealed&&t.hidden)return;
    ctx.save();ctx.globalAlpha=t.active?1:Math.max(.18,pulse);
    if(t.type==='spikes'){ctx.fillStyle='#ff5470';const n=Math.max(1,Math.floor(t.w/18));for(let i=0;i<n;i++){ctx.beginPath();ctx.moveTo(t.x+i*t.w/n,t.y+20);ctx.lineTo(t.x+(i+.5)*t.w/n,t.y);ctx.lineTo(t.x+(i+1)*t.w/n,t.y+20);ctx.fill();}}
    else if(t.type==='riser'){ctx.fillStyle='#ff5470';ctx.fillRect(t.x,t.y-t.offset,t.w,t.h+t.offset);ctx.fillStyle='#ff96a8';ctx.fillRect(t.x,t.y-t.offset,t.w,3);}
    ctx.restore();
  }
  function drawPlayer(){const p=player;ctx.save();ctx.shadowBlur=16;ctx.shadowColor='#62f6df';ctx.fillStyle='#62f6df';ctx.fillRect(p.x,p.y,p.w,p.h);ctx.shadowBlur=0;ctx.fillStyle='#07120f';ctx.fillRect(p.x+(p.facing>0?15:6),p.y+10,4,5);ctx.fillStyle='#b8fff3';ctx.fillRect(p.x+4,p.y+4,4,4);ctx.restore();}
  function loop(t){const dt=Math.min(.025,(t-last)/1000||0);last=t;update(dt);draw();requestAnimationFrame(loop);}

  const map={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump'};
  addEventListener('keydown',e=>{if(map[e.code]){keys[map[e.code]]=true;e.preventDefault();}if(e.code==='KeyF'||e.code==='ShiftLeft')focusPulse();if(e.code==='KeyR')resetLevel(false);if(e.code==='KeyM')toggleSound();});
  addEventListener('keyup',e=>{if(map[e.code])keys[map[e.code]]=false;});
  document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;const down=e=>{e.preventDefault();if(k==='focus')focusPulse();else keys[k]=true;};const up=e=>{e.preventDefault();if(k!=='focus')keys[k]=false;};b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);});
  function toggleSound(){muted=!muted;$('#soundBtn').textContent=muted?'×':'♪';}
  $('#startBtn').onclick=startGame;$('#againBtn').onclick=startGame;$('#restartBtn').onclick=()=>{if(state!=='menu')resetLevel(false)};$('#soundBtn').onclick=toggleSound;
  requestAnimationFrame(loop);
})();
