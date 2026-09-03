(() => {
  "use strict";
  const canvas = document.querySelector("#game"), ctx = canvas.getContext("2d");
  const W = 960, H = 540, $ = (s) => document.querySelector(s);
  const ui = { wrap:$("#gameWrap"), level:$("#levelLabel"), deaths:$("#deathLabel"), toast:$("#toast"), levels:$("#levelScreen"), death:$("#deathScreen"), win:$("#winScreen"), grid:$("#levelGrid") };
  const keys = { left:false, right:false, jump:false }, activePointers = new Map();
  const PALETTES = [
    {bg:"#f2ece4",far:"#dfd2c5",mid:"#b88f79",solid:"#493a36",haz:"#d94f4f"},
    {bg:"#e7f0ed",far:"#cbded6",mid:"#7ea395",solid:"#29453f",haz:"#cf5151"},
    {bg:"#eceaf4",far:"#d5d0e4",mid:"#9384b0",solid:"#3d354d",haz:"#d55364"},
    {bg:"#f3edda",far:"#dfd2a7",mid:"#b1914e",solid:"#443b29",haz:"#ca4d42"},
    {bg:"#e8edf4",far:"#cad5e4",mid:"#718ba9",solid:"#2d3d52",haz:"#d34d59"},
    {bg:"#f1e7ed",far:"#dbc6d2",mid:"#a77791",solid:"#4b3340",haz:"#d74e62"}
  ];
  const P=(x,y,w,h=120,type="solid",extra={})=>({x,y,w,h,type,...extra});
  const S=(x,y=396,trigger=null,dir="up")=>({type:"spike",x,y,w:34,h:24,trigger,dir});
  const D=(x,y,w=48,h=48,trigger=75)=>({type:"drop",x,y,w,h,trigger});
  const M=(x,y,w,h,axis,range,speed)=>P(x,y,w,h,"move",{axis,range,speed});
  const C=(x,y,w,h=18,delay=.42)=>P(x,y,w,h,"crumb",{delay});
  const lv=(name,palette,spawn,exit,platforms,hazards=[],special={})=>({name,palette,spawn,exit,platforms,hazards,...special});
  // Every room is intentionally authored. Repeated mechanics return in new spatial problems, not generated templates.
  const LEVELS = [
    lv("ERWACHEN",0,[34,382],[878,356],[P(0,420,250),P(304,420,656)],[S(170,396,125)]),
    lv("DER ZWEITE BODEN",1,[32,382],[875,306],[P(0,420,190),P(242,388,150,152),P(448,350,190,190),P(700,370,260,170)],[S(305,364,null),S(535,326,470)]),
    lv("NACHZÜGLER",2,[32,382],[882,356],[P(0,420,960)],[S(250,396,190),S(515,396,445),S(750,396,690)]),
    lv("HOHLRAUM",3,[32,382],[875,356],[P(0,420,220),C(220,420,82,18,.55),P(302,420,210),P(574,420,386)],[S(640,396,585)]),
    lv("VON OBEN",4,[36,382],[875,356],[P(0,420,960)],[D(270,92,54,54,95),D(520,70,56,56,85),D(745,105,46,46,75)]),
    lv("KLEINE SCHRITTE",5,[30,382],[878,316],[P(0,420,155),P(210,390,90,150),P(350,360,85,180),P(490,405,85,135),P(630,350,90,190),P(780,380,180,160)],[S(370,336,null),S(650,326,600)]),
    lv("GEGENVERKEHR",0,[34,382],[874,356],[P(0,420,260),M(310,384,125,18,"x",45,1.5),P(485,420,195),M(705,360,105,18,"y",42,1.8),P(840,420,120)],[S(565,396,null)]),
    lv("DAS DACH HÖRT ZU",1,[32,382],[878,356],[P(0,420,960),P(210,250,40,110),P(465,230,40,130),P(725,260,40,100)],[D(320,40,64,50,110),S(610,396,555)]),
    lv("ZWEI TÜREN",2,[34,382],[874,356],[P(0,420,390),P(450,420,510)],[S(520,396,465)],{fake:[310,356]}),
    lv("KEIN ZURÜCK",3,[32,382],[874,316],[P(0,420,170),C(220,390,110),C(380,360,110),C(540,390,110),P(710,380,250,160)],[S(765,356,700)]),
    lv("SCHIEFLAGE",4,[34,342],[878,356],[P(0,380,170,160),P(220,420,150),P(420,365,150,175),P(620,415,120,125),P(790,420,170)],[S(275,396,null),S(660,391,600)]),
    lv("FAHRSTUHL",5,[36,382],[870,156],[P(0,420,180),M(235,390,110,18,"y",105,1.25),P(390,300,165,240),M(600,270,110,18,"y",82,1.55),P(760,220,200,320)],[S(445,276,390)]),
    lv("DIE PRESSE",0,[34,382],[875,356],[P(0,420,960)],[D(245,105,54,54,85),D(500,75,58,58,80),D(740,120,50,50,75)]),
    lv("FALSCHE SICHERHEIT",1,[34,382],[878,356],[P(0,420,260),P(320,420,280),P(660,420,300)],[S(370,396,310),S(535,396,485),S(720,396,650)]),
    lv("TREPPENWITZ",2,[34,382],[872,176],[P(0,420,145),P(190,380,125,160),P(355,330,120,210),P(515,280,120,260),P(680,330,100,210),P(820,240,140,300)],[S(390,306,null),S(710,306,655)]),
    lv("UMWEG",3,[35,382],[878,356],[P(0,420,210),P(255,420,155),P(455,420,150),P(650,420,310),P(285,300,345,18)],[S(325,396,270),S(495,276,null),S(705,396,630)]),
    lv("RHYTHMUS",4,[34,382],[875,356],[P(0,420,175),M(220,390,95,18,"y",48,2.2),M(365,345,95,18,"x",35,1.8),M(510,390,95,18,"y",62,1.6),M(660,350,95,18,"x",42,2),P(805,420,155)],[S(850,396,790)]),
    lv("KAMM",5,[32,382],[878,356],[P(0,420,960)],[S(190,396,null),S(285,396,240),S(390,396,345),S(505,396,460),S(630,396,585),S(760,396,715)]),
    lv("DER KURZE WEG",0,[34,382],[875,356],[P(0,420,280),P(380,420,160),P(640,420,320),M(290,315,330,18,"x",55,1.1)],[S(430,396,null),S(705,396,625)]),
    lv("TÜR AUF REISEN",1,[34,382],[640,356],[P(0,420,960)],[S(270,396,215),S(520,396,455)],{movingExit:{trigger:585,to:[875,356]}}),
    lv("SCHACHT",2,[36,82],[874,356],[P(0,120,180,420),P(230,190,135,350),P(415,265,130,275),P(595,340,125,200),P(770,420,190,120)],[S(275,166,null),S(640,316,570)]),
    lv("DOPPELSCHLAG",3,[32,382],[877,296],[P(0,420,200),C(245,380,115),P(405,420,130),C(580,340,110),P(735,360,225,180)],[D(450,155,52,52,80),S(790,336,720)]),
    lv("PENDEL",4,[34,382],[878,356],[P(0,420,225),P(290,420,170),P(525,420,165),P(755,420,205)],[{type:"saw",x:260,y:310,r:18,axis:"x",range:70,speed:2},{type:"saw",x:610,y:310,r:20,axis:"y",range:75,speed:1.7},S(820,396,745)]),
    lv("DURCH DIE WAND",5,[34,382],[877,356],[P(0,420,960),P(300,270,24,150),P(585,240,24,180)],[S(410,396,345)],{pushers:[{x:205,y:350,w:26,h:70,trigger:175,travel:95},{x:500,y:340,w:26,h:80,trigger:465,travel:90}]}),
    lv("SEITENWECHSEL",0,[34,382],[875,356],[P(0,420,160),P(235,380,145,160),P(460,420,130),P(670,365,130,175),P(870,420,90)],[S(285,356,null),S(715,341,645)],{wrap:true}),
    lv("DAS AUGE",1,[34,382],[877,356],[P(0,420,250),P(320,420,260),P(650,420,310)],[{type:"saw",x:450,y:330,r:22,axis:"x",range:115,speed:2.1},S(735,396,675)],{dark:true}),
    lv("ABKÜRZUNG",2,[34,382],[875,206],[P(0,420,170),P(225,370,140,170),P(420,315,130,225),P(610,370,120,170),P(790,270,170,270),M(365,230,310,18,"x",70,1.4)],[S(465,291,395),S(650,346,null)]),
    lv("DOMINO",3,[34,382],[875,356],[P(0,420,960)],[D(230,75,48,48,85),D(310,90,50,50,80),D(390,105,52,52,75),D(600,85,56,56,95),S(780,396,720)]),
    lv("ALLES BEWEGT SICH",4,[34,382],[875,296],[P(0,420,165),M(210,390,110,18,"x",38,1.8),M(370,340,110,18,"y",55,1.5),M(535,390,105,18,"x",52,1.3),M(700,325,100,18,"y",48,1.9),P(835,360,125,180)],[{type:"saw",x:570,y:285,r:17,axis:"y",range:50,speed:2.3}]),
    lv("DER LETZTE SCHERZ",5,[34,382],[876,156],[P(0,420,160),C(205,385,105,18,.36),P(355,340,120,200),M(520,315,105,18,"y",62,1.7),C(675,285,105,18,.34),P(825,220,135,320)],[S(390,316,330),D(565,75,52,52,80),S(715,261,650)],{movingExit:{trigger:815,to:[830,156]}})
  ];

  let index=Math.min(LEVELS.length-1,Math.max(0,(+localStorage.getItem("moss-current")||1)-1));
  let unlocked=Math.min(LEVELS.length,Math.max(1,+localStorage.getItem("moss-unlocked")||1));
  if(new URLSearchParams(location.search).get("unlock")==="all") unlocked=LEVELS.length;
  let hero,room,state="playing",deaths=0,last=0,time=0,shake=0,muted=localStorage.getItem("moss-muted")==="1",audio,toastTimer;
  const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  const clone=(v)=>JSON.parse(JSON.stringify(v));

  function reset(showHint=true){
    const l=LEVELS[index]; room=clone(l); room.platforms.forEach((p,i)=>{p.id=i;p.ox=p.x;p.oy=p.y;p.fall=0;p.timer=0;p.armed=false});
    room.hazards.forEach((h,i)=>{h.id=i;h.ox=h.x;h.oy=h.y;h.progress=h.trigger===null?1:0;h.active=h.trigger===null;h.vy=0;h.fallen=false});
    room.pushers=(room.pushers||[]).map(w=>({...w,ox:w.x,progress:0}));
    hero={x:l.spawn[0],y:l.spawn[1],w:24,h:38,vx:0,vy:0,px:l.spawn[0],py:l.spawn[1],ground:false,coyote:0,buffer:0,jumpHeld:false,face:1};
    state="playing"; time=0; keys.left=keys.right=keys.jump=false;
    [ui.death,ui.levels,ui.win].forEach(e=>e.classList.add("hidden"));
    setTheme(l.palette); ui.level.textContent=`${String(index+1).padStart(2,"0")} · ${l.name}`; ui.deaths.textContent=deaths;
    localStorage.setItem("moss-current",index+1); if(showHint) toast(index===0?"A / D oder ← / → · Springen mit W, ↑ oder Leertaste":l.name,1900);
    ui.wrap.focus({preventScroll:true});
  }
  function setTheme(i){const c=PALETTES[i];document.documentElement.style.setProperty("--ui-light",c.bg);document.documentElement.style.setProperty("--ui-dark",c.solid)}
  function solids(){return room.platforms.filter(p=>!(p.type==="crumb"&&p.fall>150)).map(p=>p.type==="crumb"?{...p,y:p.y+p.fall}:p)}
  function resolveX(){for(const p of solids()){if(!hit(hero,p))continue;if(hero.px+hero.w<=p.x+4)hero.x=p.x-hero.w;else if(hero.px>=p.x+p.w-4)hero.x=p.x+p.w;hero.vx=0}}
  function resolveY(){for(const p of solids()){if(!hit(hero,p))continue;if(hero.vy>=0&&hero.py+hero.h<=p.y+8){hero.y=p.y-hero.h;hero.vy=0;hero.ground=true;const original=room.platforms.find(q=>q.id===p.id);if(original?.type==="crumb")original.armed=true}else if(hero.vy<0&&hero.py>=p.y+p.h-5){hero.y=p.y+p.h;hero.vy=0}}}
  function spikeBox(h){const pr=h.progress*h.progress*(3-2*h.progress);return h.dir==="down"?{x:h.x+6,y:h.y,w:h.w-12,h:h.h*pr}:{x:h.x+6,y:h.y+h.h*(1-pr),w:h.w-12,h:h.h*pr}}
  function hazardBox(h){if(h.type==="spike")return spikeBox(h);if(h.type==="drop")return{x:h.x,y:h.y,w:h.w,h:h.h};if(h.type==="saw"){let x=h.ox,y=h.oy;if(h.axis==="x")x+=Math.sin(time*h.speed)*h.range;else y+=Math.sin(time*h.speed)*h.range;return{x:x-h.r,y:y-h.r,w:h.r*2,h:h.r*2}}}
  function die(){if(state!=="playing")return;state="dying";deaths++;ui.deaths.textContent=deaths;shake=13;beep(75,.18,"sawtooth");setTimeout(()=>{state="dead";ui.death.classList.remove("hidden")},460)}
  function finish(){if(state!=="playing")return;state="transition";beep(660,.1,"sine");unlocked=Math.max(unlocked,Math.min(LEVELS.length,index+2));localStorage.setItem("moss-unlocked",unlocked);setTimeout(()=>{if(index===LEVELS.length-1){state="won";$("#finalStats").textContent=`${deaths} Versuche · 30 einzigartige Räume`;ui.win.classList.remove("hidden")}else{index++;reset()}},430)}
  function update(dt){
    if(state!=="playing")return;time+=dt;
    const l=room, direction=(keys.right?1:0)-(keys.left?1:0), target=direction*225, accel=hero.ground?1700:950;
    hero.px=hero.x;hero.py=hero.y;hero.vx+=Math.max(-accel*dt,Math.min(accel*dt,target-hero.vx));if(direction)hero.face=direction;
    hero.coyote=hero.ground?.105:Math.max(0,hero.coyote-dt);hero.buffer=keys.jump&&!hero.jumpHeld?.12:Math.max(0,hero.buffer-dt);
    if(hero.buffer>0&&hero.coyote>0){hero.vy=-420;hero.ground=false;hero.coyote=0;hero.buffer=0;hero.jumpHeld=true;beep(260,.035)}if(!keys.jump)hero.jumpHeld=false;if(!keys.jump&&hero.vy<-135)hero.vy+=1050*dt;
    hero.vy=Math.min(760,hero.vy+1350*dt);hero.x+=hero.vx*dt;resolveX();hero.y+=hero.vy*dt;hero.ground=false;resolveY();
    if(l.wrap){if(hero.x>W)hero.x=-hero.w+2;if(hero.x+hero.w<0)hero.x=W-2}else hero.x=Math.max(0,Math.min(W-hero.w,hero.x));
    l.platforms.forEach(p=>{if(p.type==="move"){const q=Math.sin(time*p.speed)*p.range;p.x=p.ox+(p.axis==="x"?q:0);p.y=p.oy+(p.axis==="y"?q:0)}if(p.type==="crumb"&&p.armed){p.timer+=dt;if(p.timer>p.delay)p.fall+=430*dt}});
    l.hazards.forEach(h=>{if(h.type==="spike"&&!h.active&&hero.x+hero.w>h.trigger){h.active=true}if(h.type==="spike"&&h.active)h.progress=Math.min(1,h.progress+dt*7);if(h.type==="drop"&&!h.fallen&&Math.abs(hero.x+h.w/2-(h.x+h.w/2))<h.trigger){h.fallen=true;h.vy=35}if(h.type==="drop"&&h.fallen){h.vy+=1150*dt;h.y+=h.vy*dt;const floor=solids().filter(p=>h.x+h.w>p.x&&h.x<p.x+p.w&&h.y+h.h>=p.y&&h.y+h.h-h.vy*dt<=p.y+5).sort((a,b)=>a.y-b.y)[0];if(floor){h.y=floor.y-h.h;h.vy=0}}const b=hazardBox(h);if(b&&((h.type!=="spike")||h.progress>.28)&&hit(hero,b))die()});
    l.pushers.forEach(w=>{if(hero.x>w.trigger)w.progress=Math.min(1,w.progress+dt*1.8);w.x=w.ox+w.progress*w.travel;const b={x:w.x,y:w.y,w:w.w,h:w.h};if(hit(hero,b)){hero.x=b.x+b.w;hero.vx=Math.max(80,hero.vx)}});
    if(l.movingExit&&hero.x>l.movingExit.trigger){const t=Math.min(1,(hero.x-l.movingExit.trigger)/100);l.exit[0]+= (l.movingExit.to[0]-l.exit[0])*Math.min(1,dt*5);l.exit[1]+= (l.movingExit.to[1]-l.exit[1])*Math.min(1,dt*5)}
    if(l.fake&&hit(hero,{x:l.fake[0],y:l.fake[1],w:46,h:64})){toast("Falsche Tür.");hero.vx=-260;hero.vy=-260;l.fake=null}
    if(hit(hero,{x:l.exit[0],y:l.exit[1],w:46,h:64}))finish();if(hero.y>H+70)die();
  }

  function drawPlatform(p,c){ctx.fillStyle=p.type==="crumb"?c.mid:c.solid;ctx.fillRect(Math.round(p.x),Math.round(p.y+(p.fall||0)),p.w,p.h);ctx.fillStyle=p.type==="crumb"?c.bg:c.mid;ctx.fillRect(Math.round(p.x),Math.round(p.y+(p.fall||0)),p.w,3);if(p.type==="crumb"){ctx.fillStyle=c.solid;for(let x=p.x+14;x<p.x+p.w;x+=28)ctx.fillRect(x,p.y+(p.fall||0)+5,2,7)}}
  function drawSpike(h,c){if(!h.active&&h.progress===0)return;const pr=h.progress*h.progress*(3-2*h.progress);ctx.fillStyle=c.haz;const base=h.dir==="down"?h.y:h.y+h.h,sign=h.dir==="down"?1:-1;for(let i=0;i<3;i++){const x=h.x+i*11;ctx.beginPath();ctx.moveTo(x,base);ctx.lineTo(x+5.5,base+sign*h.h*pr);ctx.lineTo(x+11,base);ctx.fill()}}
  function drawHazard(h,c){if(h.type==="spike")return drawSpike(h,c);const b=hazardBox(h);if(h.type==="drop"){ctx.fillStyle=c.solid;ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle=c.mid;ctx.fillRect(b.x,b.y,b.w,4);ctx.fillRect(b.x+8,b.y+10,b.w-16,3)}else{ctx.save();ctx.translate(b.x+b.w/2,b.y+b.h/2);ctx.rotate(time*3);ctx.fillStyle=c.haz;for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.fillRect(h.r*.58,-3,h.r*.7,6)}ctx.beginPath();ctx.arc(0,0,h.r*.68,0,Math.PI*2);ctx.fill();ctx.fillStyle=c.bg;ctx.fillRect(-3,-3,6,6);ctx.restore()}}
  function door(pos,c,fake=false){const[x,y]=pos;ctx.fillStyle=fake?c.mid:c.solid;ctx.fillRect(x,y,46,64);ctx.fillStyle=c.bg;ctx.fillRect(x+9,y+10,28,54);ctx.fillStyle=fake?c.mid:c.haz;ctx.fillRect(x+30,y+34,4,4)}
  function drawHero(c){ctx.save();ctx.translate(Math.round(hero.x+12),Math.round(hero.y+19));if(hero.face<0)ctx.scale(-1,1);const bob=hero.ground&&Math.abs(hero.vx)>20?Math.round(Math.sin(time*18)*2):0;ctx.fillStyle=c.solid;ctx.fillRect(-10,-10+bob,17,19);ctx.fillStyle=c.mid;ctx.fillRect(-7,-14+bob,13,5);ctx.fillRect(7,-7+bob,7,10);ctx.fillStyle=c.bg;ctx.fillRect(11,-4+bob,2,2);ctx.fillStyle=c.solid;ctx.fillRect(-8,9+bob,5,5);ctx.fillRect(3,9+bob,5,5);ctx.restore()}
  function draw(){
    const l=room||LEVELS[index],c=PALETTES[l.palette];ctx.save();if(shake){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake*=.78}ctx.fillStyle=c.bg;ctx.fillRect(0,0,W,H);
    // Quiet, low-contrast scenery is kept well above/below gameplay silhouettes.
    ctx.fillStyle=c.far;for(let i=0;i<4;i++){const x=(index*149+i*251)%940-35,w=50+(index*17+i*23)%80,h=28+(index*31+i*19)%72;ctx.fillRect(x,H-h,w,h)}ctx.globalAlpha=.3;ctx.fillStyle=c.mid;for(let i=0;i<3;i++){const x=(index*97+i*337)%900+20,y=105+(i*83+index*29)%120;ctx.fillRect(x,y,10+(index+i)%3*8,10+(index+i)%3*8)}ctx.globalAlpha=1;
    if(l.dark){const g=ctx.createRadialGradient(hero.x+12,hero.y+18,55,hero.x+12,hero.y+18,340);g.addColorStop(0,c.bg);g.addColorStop(1,c.far);ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
    l.platforms.forEach(p=>{if(!(p.type==="crumb"&&p.fall>180))drawPlatform(p,c)});l.hazards.forEach(h=>drawHazard(h,c));(l.pushers||[]).forEach(w=>{ctx.fillStyle=c.solid;ctx.fillRect(w.x,w.y,w.w,w.h);ctx.fillStyle=c.mid;ctx.fillRect(w.x,w.y,w.w,3)});door(l.exit,c);if(l.fake)door(l.fake,c,true);if(state==="playing"||state==="transition")drawHero(c);ctx.restore();
  }
  function loop(now){const dt=Math.min(.024,(now-last)/1000||0);last=now;update(dt);draw();requestAnimationFrame(loop)}
  function toast(text,ms=1400){ui.toast.textContent=text;ui.toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>ui.toast.classList.remove("show"),ms)}
  function beep(freq,duration=.05,type="square"){if(muted)return;try{audio||=new(window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.025,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}catch{}}
  function buildGrid(){ui.grid.textContent="";LEVELS.forEach((l,i)=>{const b=document.createElement("button");b.disabled=i>=unlocked;b.className=i===index?"current":"";b.innerHTML=`${String(i+1).padStart(2,"0")}<small>${l.name}</small>`;b.onclick=()=>{index=i;ui.levels.classList.add("hidden");reset()};ui.grid.appendChild(b)})}
  function openLevels(){buildGrid();state="menu";ui.levels.classList.remove("hidden");keys.left=keys.right=keys.jump=false}
  function closeLevels(){ui.levels.classList.add("hidden");reset(false)}
  const keyMap={ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right",ArrowUp:"jump",KeyW:"jump",Space:"jump"};
  addEventListener("keydown",e=>{if(keyMap[e.code]){keys[keyMap[e.code]]=true;e.preventDefault()}if(e.code==="KeyR"){reset(false);e.preventDefault()}if(e.code==="KeyM")toggleSound();if(e.code==="Escape"&&!ui.levels.classList.contains("hidden"))closeLevels()},{passive:false});
  addEventListener("keyup",e=>{if(keyMap[e.code]){keys[keyMap[e.code]]=false;e.preventDefault()}},{passive:false});addEventListener("blur",()=>{keys.left=keys.right=keys.jump=false});
  document.querySelectorAll("[data-key]").forEach(b=>{const name=b.dataset.key;b.addEventListener("pointerdown",e=>{e.preventDefault();b.setPointerCapture(e.pointerId);activePointers.set(e.pointerId,name);keys[name]=true});const up=e=>{e.preventDefault();activePointers.delete(e.pointerId);keys[name]=[...activePointers.values()].includes(name)};b.addEventListener("pointerup",up);b.addEventListener("pointercancel",up)});
  function toggleSound(){muted=!muted;localStorage.setItem("moss-muted",muted?"1":"0");$("#soundBtn").setAttribute("aria-label",muted?"Ton einschalten":"Ton ausschalten");toast(muted?"TON AUS":"TON AN",800)}
  $("#levelsBtn").onclick=openLevels;$("#closeLevelsBtn").onclick=closeLevels;$("#restartBtn").onclick=()=>reset(false);$("#soundBtn").onclick=toggleSound;$("#deathRestartBtn").onclick=()=>reset(false);$("#deathLevelsBtn").onclick=()=>{ui.death.classList.add("hidden");openLevels()};$("#againBtn").onclick=()=>{index=0;deaths=0;reset()};
  reset();requestAnimationFrame(loop);
})();
