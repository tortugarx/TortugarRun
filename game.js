(() => {
  "use strict";
  const C = document.querySelector("#game"),
    X = C.getContext("2d"),
    W = 960,
    H = 540,
    $ = (s) => document.querySelector(s);
  const UI = {
    start: $("#startScreen"),
    win: $("#winScreen"),
    level: $("#levelLabel"),
    deaths: $("#deathLabel"),
  };
  const K = { left: 0, right: 0, jump: 0 };
  const CG = globalThis.TortugaCrazy || {
    available: false, storage: localStorage, platformMuted: false,
    gameplayStart() {}, gameplayStop() {}, progress() {}, loadingDone() {},
    requestAd() { return Promise.resolve({ finished: false, error: "unavailable" }); },
    onSettings() {},
  };
  const SAVE = CG.storage || localStorage;
  // One unmistakable visual identity per world; rooms no longer cycle through
  // unrelated palettes and therefore read as four deliberate chapters.
  const PAL = [
    ["#e6eee4", "#b8ccb3", "#66855f", "#263c29"],
    ["#f0e0c9", "#d3aa77", "#9a643d", "#4b2d22"],
    ["#dce9f4", "#9ebed8", "#537fa5", "#263f63"],
    ["#eee0ef", "#c69bc9", "#8d5b92", "#472c52"],
    ["#f1dddd", "#d59a98", "#a34f50", "#4f252b"],
  ];
  const palette = () => PAL[L[Math.min(li, L.length - 1)]?.group || 0];
  const progressVersionKey="tortuga-trials-progress",progressVersion="1";
  if(SAVE.getItem(progressVersionKey)!==progressVersion){
    SAVE.setItem("level-devil-unlocked","1");
    SAVE.setItem(progressVersionKey,progressVersion);
  }
  let unlocked=Math.max(1,Math.min(DevilLevels.levels.length,Number(SAVE.getItem("level-devil-unlocked"))||1));
  const savedTracking=SAVE.getItem("level-devil-tracking");
  const SKINS = [
    {id:"classic", name:"CLASSIC", cost:0, shell:"#263c29", accent:"#66855f", body:"#66855f", eye:"#e6eee4"},
    {id:"ember", name:"EMBER", cost:100, shell:"#542920", accent:"#df7547", body:"#a9432d", eye:"#ffe3b3"},
    {id:"lagoon", name:"LAGOON", cost:150, shell:"#153c55", accent:"#4bbbd0", body:"#398aa2", eye:"#e1fbff"},
    {id:"orchid", name:"ORCHID", cost:200, shell:"#46234f", accent:"#b963bd", body:"#82528e", eye:"#f5dcff"},
    {id:"gold", name:"GOLD", cost:300, shell:"#60440d", accent:"#f0bd36", body:"#bd8121", eye:"#fff5c2"},
    {id:"ghost", name:"GHOST", cost:500, shell:"#394650", accent:"#d4f7f5", body:"#91bcbc", eye:"#ffffff"},
  ];
  let shells=Math.max(0,Number(SAVE.getItem("tortuga-shells"))||0);
  let ownedSkins;
  try { ownedSkins=new Set(JSON.parse(SAVE.getItem("tortuga-skins")||"[\"classic\"]")); }
  catch { ownedSkins=new Set(["classic"]); }
  ownedSkins.add("classic");
  let equippedSkin=SAVE.getItem("tortuga-equipped-skin")||"classic";
  if(!ownedSkins.has(equippedSkin))equippedSkin="classic";
  let state = "menu",
    li = 0,
    deaths = 0,
    shake = 0,
    muted = SAVE.getItem("level-devil-sound") === "off",
    autoRestart = SAVE.getItem("level-devil-auto-restart") === "on",
    tracking = savedTracking==null?defaultTracking():savedTracking==="on",
    trackingOverride = savedTracking!=null,
    last = 0,
    clock = 0,
    audio,
    levelReturnState = "menu",
    settingsReturnState = "menu",
    shopReturnState = "menu",
    announcedGroup = -1,
    bannerTimer = 0,
    portalAnim = null,
    doorAnim = null,
    camera = { x: 0, y: 0, ready: false },
    P,
    R,
    particles = [];
  const L = DevilLevels.levels;
  const GROUPS = DevilLevels.groups;
  let world, accumulator = 0, runId = 0;
  const clearKeys=()=>{ K.left=K.right=K.jump=0; };
  const currentSkin=()=>SKINS.find(s=>s.id===equippedSkin)||SKINS[0];
  function saveEconomy(){
    SAVE.setItem("tortuga-shells",String(shells));
    SAVE.setItem("tortuga-skins",JSON.stringify([...ownedSkins]));
    SAVE.setItem("tortuga-equipped-skin",equippedSkin);
    updateCurrency();
  }
  function updateCurrency(){
    $("#currencyLabel").textContent=String(shells);
    $("#shopCurrency").textContent=String(shells);
  }
  function showCurrencyGain(amount,label="SHELLS"){
    const gain=$("#currencyGain");
    gain.textContent=`+${amount} ${label}`;
    gain.classList.remove("hidden","pop");
    void gain.offsetWidth;
    gain.classList.add("pop");
    clearTimeout(showCurrencyGain.timer);
    showCurrencyGain.timer=setTimeout(()=>gain.classList.add("hidden"),1200);
  }
  function stopGameplay(){ clearKeys(); CG.gameplayStop(); }
  function startGameplay(){ CG.gameplayStart({level:String(li+1),skin:equippedSkin,shells:String(shells)}); }
  function reset() {
    runId++;
    li = Math.max(0, Math.min(L.length - 1, li));
    world = new DevilWorld.World(L[li]);
    P = world.p;
    R = world;
    particles = []; portalAnim = null; doorAnim = null;
    camera.ready = false;
    accumulator = 0;
    clock = 0;
    for (const id of ["#levelScreen", "#settingsScreen", "#aboutScreen", "#shopScreen", "#skipScreen", "#adBlocker"]) $(id).classList.add("hidden");
    state = "playing";
    $("#deathScreen").classList.add("hidden");
    const colors = palette();
    document.documentElement.style.setProperty("--level-light", colors[0]);
    document.documentElement.style.setProperty("--level-mid", colors[2]);
    document.documentElement.style.setProperty("--level-dark", colors[3]);
    UI.level.textContent = String(li + 1).padStart(2,"0") + " / " + L.length;
    $("#deathSkipBtn").classList[li>=L.length-1?"add":"remove"]("hidden");
    startGameplay();
    if (L[li].group !== announcedGroup) {
      if (announcedGroup < 0 && L[li].group === 0) announcedGroup = 0;
      else showSection(L[li].group);
    }
  }
  function showSection(group) {
    announcedGroup = group;
    const banner = $("#sectionBanner");
    $("#sectionBanner strong").textContent = GROUPS[group];
    banner.classList.remove("hidden");
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => banner.classList.add("hidden"), 1800);
  }
  function start() {
    li = 0;
    deaths = 0;
    UI.deaths.textContent = "00";
    UI.start?.classList.add("hidden");
    UI.win.classList.add("hidden");
    reset();
    beep(260, 0.08, "triangle");
  }
  function buildLevelGrid(selectedGroup = L[Math.min(li, L.length - 1)].group) {
    const grid = $("#levelGrid");
    grid.textContent = "";
    const tabs = document.createElement("div");
    tabs.className = "group-tabs";
    GROUPS.forEach((name, group) => {
      const tab = document.createElement("button");
      tab.textContent = name;
      tab.className = group === selectedGroup ? "active" : "";
      tab.onclick = () => buildLevelGrid(group);
      tabs.appendChild(tab);
    });
    grid.appendChild(tabs);
    const overview = document.createElement("div");
    overview.className = "level-overview";
    const first = selectedGroup * 10 + 1;
    overview.innerHTML = `<strong>${GROUPS[selectedGroup]}</strong><span>LEVEL ${String(first).padStart(2,"0")}–${first + 9}</span>`;
    grid.appendChild(overview);
    L.forEach((level, i) => {
      if (level.group !== selectedGroup) return;
      const b = document.createElement("button");
      b.disabled = i + 1 > unlocked;
      const status = i === li ? "CURRENT" : b.disabled ? "LOCKED" : i + 1 < unlocked ? "CLEARED" : "PLAY";
      b.className = i === li ? "current" : i + 1 < unlocked ? "complete" : "";
      b.setAttribute?.("aria-current", i === li ? "level" : "false");
      b.title = `${String(level.number).padStart(2,"0")} · ${level.name}`;
      b.innerHTML = `${level.number}<small>${status}</small>`;
      b.onclick = () => {
        li = i;
        UI.start?.classList.add("hidden");
        UI.win.classList.add("hidden");
        $("#deathScreen").classList.add("hidden");
        $("#levelScreen").classList.add("hidden");
        reset();
      };
      grid.appendChild(b);
    });
  }
  function openLevels() {
    if (state === "dying" || state === "transition") return;
    levelReturnState = state;
    if(state==="playing")stopGameplay();
    state = "levelmenu";
    buildLevelGrid();
    $("#levelScreen").classList.remove("hidden");
  }
  function die() {
    if (state !== "playing") return;
    state = "dying";
    stopGameplay();
    deaths++;
    UI.deaths.textContent = String(deaths).padStart(2, "0");
    if(deaths%10===0)$("#deathSkipBtn").classList.add("hidden");
    const messages={
      fall:["GRAVITY FILED A COMPLAINT.","THE VOID SAYS HI.","YOU MISSED THE FLOOR.","SHELL WE TRY THAT AGAIN?"],
      "button-trap":["THAT BUTTON HAD TRUST ISSUES.","PRESS HERE, REGRET EVERYWHERE.","THE BUTTON PRESSED BACK.","CURIOUS TURTLE, CLASSIC RESULT."],
      "moving-spike":["THE SPIKE HAD PLACES TO BE.","OUTRUN BY STATIONERY'S COUSIN.","THAT SPIKE KNOWS CARDIO.","MOVING HAZARD, STATIONARY PLAN."],
      "hidden-spike":["SURPRISE! THE FLOOR HAS TEETH.","THE GROUND REMEMBERED YOU.","STEALTH SPIKE: 1. TURTLE: 0.","TRUST ISSUES UNLOCKED."],
      "ceiling-spike":["HEADS UP. LESS UP.","THE CEILING BIT BACK.","TOO MUCH SHELL ALTITUDE.","AIRSPACE DENIED."],
      "side-spike":["FLANKED BY ARCHITECTURE.","THE WALL CHOSE VIOLENCE.","SIDE QUEST FAILED.","LOOK BOTH WAYS. EVEN INDOORS."],
      spike:["SPIKES: 1. TURTLE: 0.","A VERY POINTED ARGUMENT.","THE SPIKE MAKES A FAIR POINT.","SHELL MEETS SHARP."],
    };
    const pool=messages[world.deathCause]||["NOT THIS TIME."];
    $("#deathMessage").textContent=pool[(deaths-1)%pool.length];
    shake = 4;
    burst(P.x + 12, P.y + 9, "#333", 6);
    beep(75, 0.24, "sawtooth");
    const deathRun = runId;
    setTimeout(async () => {
      if (runId !== deathRun || state !== "dying") return;
      if(deaths%10===0){
        await playAd("midgame");
        if(runId!==deathRun||state!=="dying")return;
      }
      if (autoRestart) {
        reset(false);
        return;
      }
      state = "deathmenu";
      $("#deathScreen").classList.remove("hidden");
    }, 900);
  }
  function finish() {
    if (state !== "playing") return;
    state = "transition";
    stopGameplay();
    const pixels=[
      [-8,-5,-24,-18,2],[0,-5,8,-28,2],[8,-3,28,-15,3],[-8,2,-30,4,3],
      [0,2,10,18,3],[8,3,30,10,2],[-5,7,-18,26,3],[5,7,22,24,3],
    ].map(([x,y,vx,vy,tone])=>({x,y,vx,vy,size:5,color:palette()[tone]}));
    doorAnim={start:clock,duration:.82,fromX:P.x+P.w/2,fromY:P.y+P.h/2,toX:R.exit[0]+23,toY:R.exit[1]+48,pixels};
    beep(620, 0.12, "sine");
    unlocked = Math.max(unlocked, Math.min(L.length, li + 2));
    SAVE.setItem("level-devil-unlocked", unlocked);
    shells+=10;
    saveEconomy();
    showCurrencyGain(10);
    CG.progress(((li+1)/L.length)*100);
    const finishRun = runId;
    setTimeout(() => {
      if (runId !== finishRun || state !== "transition") return;
      if (++li === L.length) {
        state = "won";
        $("#finalStats").textContent =
          `${deaths} deaths. All ${L.length} rooms cleared.`;
        UI.win.classList.remove("hidden");
      } else reset();
    }, 900);
  }
  function beep(f, d = 0.06, type = "square") {
    if (muted || CG.platformMuted) return;
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(),
      g = audio.createGain();
    o.type = type;
    o.frequency.value = f;
    g.gain.setValueAtTime(0.03, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + d);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + d);
  }
  function burst(x, y, color, n) {
    for (let i = 0; i < n; i++)
      particles.push({
        x,
        y,
        vx: Math.round((Math.random() - 0.5) * 14) * 20,
        vy: Math.round((Math.random() - 0.85) * 12) * 20,
        life: 1,
        color,
      });
  }
  function update(dt) {
    clock += dt;
    particles.forEach(p => { p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 430*dt; p.life -= dt*1.7; });
    particles = particles.filter(p => p.life > 0);
    if (state === "dying") {
      accumulator += dt;
      while (accumulator + 1e-9 >= DevilWorld.STEP) {
        world.aftermathTick();
        accumulator = Math.max(0, accumulator - DevilWorld.STEP);
      }
      return;
    }
    if (state !== "playing") return;
    accumulator += dt;
    while (accumulator + 1e-9 >= DevilWorld.STEP && state === "playing") {
      world.tick(K);
      accumulator = Math.max(0, accumulator - DevilWorld.STEP);
      for (const event of world.events) {
        if (event.type === "jump") beep(300,0.05);
        if (event.type === "button") beep(240,0.07);
        if (event.type === "teleport") { beep(430,0.16); burst(P.x+P.w/2,P.y+P.h/2,palette()[3],12); }
        if (event.type === "arrival") { beep(120,0.1); burst(P.x+P.w/2,P.y+P.h/2,palette()[2],12); }
      }
      if (world.status === "dead") die();
      else if (world.status === "won") finish();
    }
    if (world.teleport) {
      const from = R.portals.find(p => p.id === world.teleport.from);
      portalAnim = { t: world.teleport.t, from: {x:from.x,y:from.y-20}, to:{x:from.targetX,y:from.targetY-20} };
    } else portalAnim = null;
  }
  function platform(r, crumb = false) {
    const c = palette();
    X.fillStyle = crumb ? c[2] : c[3];
    // Moving blocks often sit on fractional coordinates. Drawing every block
    // out to the surrounding whole pixels makes touching stone overlap by at
    // most one pixel instead of exposing a hairline of the light background.
    const left = Math.floor(r.x), top = Math.floor(r.y);
    X.fillRect(left, top, Math.ceil(r.x + r.w) - left, Math.ceil(r.y + r.h) - top);
  }
  function stoneEdges(r) {
    // Draw only exposed edges, so adjoining stone reads as one solid wall.
    const c = palette();
    for (const [y, probe] of [[r.y, r.y - 0.1], [r.y + r.h - 2, r.y + r.h + 0.1]]) {
      let spans = [[r.x, r.x + r.w]];
      for (const other of R.solid) {
        if (other === r || probe < other.y || probe >= other.y + other.h) continue;
        spans = spans.flatMap(([a,b]) => other.x >= b || other.x + other.w <= a ? [[a,b]] :
          [[a, Math.min(b,other.x)], [Math.max(a,other.x+other.w),b]].filter(([l,h])=>h>l));
      }
      X.fillStyle = c[2];
      for (const [a,b] of spans) X.fillRect(a,y,b-a,2);
    }
  }
  function hazard(h) {
    if (!h.progress) return;
    X.save();
    const c = palette(), raised = Math.round(9 * h.progress);
    X.globalAlpha = 1;
    X.fillStyle = c[3];
    X.translate(h.x,h.y);
    if (h.dir === "down") { X.translate(h.w,0); X.rotate(Math.PI); }
    if (h.dir === "right") X.rotate(Math.PI/2);
    if (h.dir === "left") { X.translate(0,h.w); X.rotate(-Math.PI/2); }
    for (let cx=4;cx<h.w;cx+=9) for (let row=0;row<raised;row+=3) {
      const width=Math.min(8,2+row*0.7);
      X.fillRect(Math.round(cx-width/2),-raised+row,Math.round(width),Math.min(3,raised-row));
    }
    X.restore();
  }
  function gate(x, y, fake) {
    X.save();
    const c = palette();
    X.translate(x + 11, y + 26);
    // A plain, open pixel arch with no panels, door leaf or ornamental hardware.
    X.fillStyle = c[3];
    X.fillRect(0, 8, 4, 30);
    X.fillRect(20, 8, 4, 30);
    X.fillRect(4, 4, 4, 4);
    X.fillRect(16, 4, 4, 4);
    X.fillRect(8, 1, 8, 4);
    X.fillStyle = c[0];
    X.fillRect(4, 9, 16, 29);
    if (fake) { X.fillStyle = c[2]; X.fillRect(4, 20, 16, 3); }
    X.restore();
  }
  function drawPortal(p) { drawPortalEnd(p.x, p.y - 40, "floor", clock * 3.5); }
  function drawPortalEnd(x, y, orientation, phase) {
    X.save();
    X.translate(Math.round(x), Math.round(y + 20));
    if (orientation === "ceiling") X.rotate(Math.PI / 2);
    // Four perfectly centred square frames: symmetric and unlike the door.
    const shades=["#3d3f43","#696c71","#989b9f","#d0d1d2"];
    for(let i=0;i<4;i++) {
      const size=32-i*8, half=size/2;
      X.strokeStyle=shades[(i+Math.floor(phase))%4];
      X.lineWidth=2;
      X.strokeRect(-half+.5,-half+.5,size,size);
    }
    X.fillStyle=shades[Math.floor(phase*2)%4];
    X.fillRect(-2,-2,4,4);
    X.restore();
  }
  function drawTeleport() {
    if(!portalAnim)return;
    const t=portalAnim.t,eased=t*t*(3-2*t),c=palette();
    X.save();
    for(let i=0;i<10;i++){
      const lane=(i-4.5)*3,lag=Math.max(0,Math.min(1,eased+(i%3-1)*.055));
      const x=portalAnim.from.x+(portalAnim.to.x-portalAnim.from.x)*lag;
      const y=portalAnim.from.y+(portalAnim.to.y-portalAnim.from.y)*lag+Math.sin(t*Math.PI)*lane;
      X.fillStyle=i%2?c[2]:c[3];
      X.fillRect(Math.round(x/3)*3,Math.round(y/3)*3,i%3===0?5:3,i%3===0?5:3);
    }
    X.restore();
  }
  function drawButton(b) {
    const c = palette();
    const w=8,h=b.pressed?4:15,x=Math.round(b.x+(b.w-w)/2),bottom=b.y+8;
    X.fillStyle=c[3];X.fillRect(x-2,bottom-2,w+4,2);
    X.fillStyle=b.pressed?c[2]:c[3];X.fillRect(x,bottom-h,w,h);
    if(!b.pressed){X.fillStyle=c[1];X.fillRect(x+2,bottom-h+2,w-4,4);}
  }
  function drawHero() {
    X.save();
    const skin=currentSkin();
    X.translate(Math.round(P.x + P.w / 2), Math.round(P.y + P.h / 2));
    X.scale(P.w / 24, P.h / 18);
    if (P.face < 0) X.scale(-1, 1);
    const b = P.ground && Math.abs(P.vx) ? Math.round(Math.sin(clock * 16)) : 0;
    X.fillStyle = skin.shell;
    X.fillRect(-10, -6 + b, 15, 11);
    X.fillStyle = skin.accent;
    X.fillRect(-8, -8 + b, 12, 4);
    X.fillRect(-5, -4 + b, 4, 4);
    X.fillStyle = skin.body;
    X.fillRect(5, -4 + b, 7, 7);
    X.fillRect(-9, 5 + b, 4, 3);
    X.fillRect(2, 5 + b, 4, 3);
    X.fillStyle = skin.eye;
    X.fillRect(10, -2 + b, 1, 1);
    X.restore();
  }
  function drawTutorial() {
    const card=$("#tutorialCard");
    if(!card)return;
    const show=li===0&&R&&R.time<=18&&state==="playing";
    card.classList[show?"remove":"add"]("hidden");
  }
  function drawDoorSuction() {
    if(!doorAnim)return;
    const elapsed=(clock-doorAnim.start)/doorAnim.duration;
    X.save();
    doorAnim.pixels.forEach((pixel,index)=>{
      const delay=index/doorAnim.pixels.length*.28;
      const t=Math.max(0,Math.min(1,(elapsed-delay)/(1-delay)));
      if(t>=1)return;
      const pull=t*t*(3-2*t),scatter=Math.sin(t*Math.PI)*(1-t*.2);
      const x=doorAnim.fromX+pixel.x+(doorAnim.toX-doorAnim.fromX-pixel.x)*pull+pixel.vx*scatter;
      const y=doorAnim.fromY+pixel.y+(doorAnim.toY-doorAnim.fromY-pixel.y)*pull+pixel.vy*scatter;
      const size=t<.78?pixel.size:3;
      X.fillStyle=pixel.color;
      X.fillRect(Math.round(x/5)*5,Math.round(y/5)*5,size,size);
    });
    X.restore();
  }
  function applyCamera() {
    const screenW = globalThis.innerWidth ?? W;
    const screenH = globalThis.innerHeight ?? H;
    const mobile = globalThis.matchMedia?.("(pointer: coarse)").matches ?? screenW <= 760;
    const portrait = mobile && screenH > screenW;
    if (!tracking || !P) { camera.x = camera.y = 0; camera.ready = false; return; }
    let focusX = P.x + P.w / 2, focusY = P.y + P.h / 2;
    if (portalAnim) {
      const t = portalAnim.t * portalAnim.t * (3 - 2 * portalAnim.t);
      focusX = portalAnim.from.x + (portalAnim.to.x - portalAnim.from.x) * t;
      focusY = portalAnim.from.y + (portalAnim.to.y - portalAnim.from.y) * t;
    }
    if (portrait) {
      // CSS fills the portrait play area with the 16:9 canvas via object-fit.
      // Only this centred source slice remains visible, so move the world behind
      // that slice while keeping its pixels and collision geometry undistorted.
      const playHeight = Math.max(1, screenH - 86);
      const viewW = Math.max(210, Math.min(W, H * screenW / playHeight));
      const targetX = Math.max(0, Math.min(W - viewW, focusX - viewW * .48));
      if (!camera.ready) { camera.x = targetX; camera.y = 0; camera.ready = true; }
      else camera.x += (targetX - camera.x) * .16;
      X.translate(Math.round((W - viewW) / 2 - camera.x), 0);
      return;
    }
    const zoom = 1.55, viewW = W / zoom, viewH = H / zoom;
    const targetX = Math.max(0, Math.min(W - viewW, focusX - viewW * .48));
    const targetY = Math.max(0, Math.min(H - viewH, focusY - viewH * .58));
    if (!camera.ready) { camera.x = targetX; camera.y = targetY; camera.ready = true; }
    else { camera.x += (targetX - camera.x) * .16; camera.y += (targetY - camera.y) * .16; }
    X.scale(zoom, zoom);
    X.translate(-Math.round(camera.x), -Math.round(camera.y));
  }
  function draw() {
    X.save();
    X.imageSmoothingEnabled = false;
    const c = palette();
    X.fillStyle = c[3];
    X.fillRect(0, 0, W, H);
    if (state !== "menu" && R) applyCamera();
    if (shake) {
      X.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      shake *= 0.82;
    }
    if (state !== "menu" && R) {
      X.fillStyle=c[0];X.fillRect(32,96,896,H-96);
      R.buttons.forEach(drawButton);
      const moving = new Set(R.motions.map(m => m.id));
      const ordered = [...R.solid.filter(r => moving.has(r.id)), ...R.solid.filter(r => !moving.has(r.id))];
      ordered.forEach((r) => platform(r));
      ordered.forEach(stoneEdges);
      R.haz.forEach(hazard);
      R.portals.forEach(drawPortal);
      drawTeleport();
      gate(R.exit[0], R.exit[1], R.locked);
      if (P && state === "playing" && !portalAnim) drawHero();
      drawTutorial();
      if (state === "transition") drawDoorSuction();
      particles.forEach((p) => {
        X.globalAlpha = p.life;
        X.fillStyle = p.color;
        X.fillRect(Math.round(p.x / 4) * 4, Math.round(p.y / 4) * 4, 5, 5);
        X.globalAlpha = 1;
      });
    }
    X.restore();
  }
  function loop(t) {
    const dt = Math.min(0.1, (t - last) / 1000 || 0);
    last = t;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }
  const map = {
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right",
    ArrowUp: "jump",
    KeyW: "jump",
    Space: "jump",
  };
  addEventListener("keydown", (e) => {
    if (map[e.code]) {
      K[map[e.code]] = 1;
      e.preventDefault();
    }
    if (e.code === "KeyR" && (state === "playing" || state === "deathmenu")) reset(false);
    if (e.code === "KeyM") toggle();
  });
  addEventListener("keyup", (e) => {
    if (map[e.code]) K[map[e.code]] = 0;
  });
  const activePointers = { left: new Set(), right: new Set(), jump: new Set() };
  const activeTouches = { left: new Set(), right: new Set(), jump: new Set() };
  document.querySelectorAll("[data-key]").forEach((b) => {
    const k = b.dataset.key,
      down = (e) => {
        if (e.pointerType === "touch") return;
        e.preventDefault();
        b.setPointerCapture?.(e.pointerId);
        activePointers[k].add(e.pointerId);
        K[k] = 1;
      },
      up = (e) => {
        if (e.pointerType === "touch") return;
        e.preventDefault();
        activePointers[k].delete(e.pointerId);
        K[k] = activePointers[k].size ? 1 : 0;
      };
    b.addEventListener("pointerdown", down);
    b.addEventListener("pointerup", up);
    b.addEventListener("pointercancel", up);
    b.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        for (const touch of e.changedTouches)
          activeTouches[k].add(touch.identifier);
        K[k] = 1;
      },
      { passive: false },
    );
    const touchUp = (e) => {
      e.preventDefault();
      for (const touch of e.changedTouches)
        activeTouches[k].delete(touch.identifier);
      K[k] = activeTouches[k].size || activePointers[k].size ? 1 : 0;
    };
    b.addEventListener("touchend", touchUp, { passive: false });
    b.addEventListener("touchcancel", touchUp, { passive: false });
  });
  function toggle() {
    muted = !muted;
    SAVE.setItem("level-devil-sound", muted ? "off" : "on");
    updateSettings();
  }
  function updateSettings() {
    $("#soundValue").textContent = muted ? "OFF" : "ON";
    $("#autoRestartValue").textContent = autoRestart ? "ON" : "OFF";
    if(!trackingOverride)tracking=defaultTracking();
    $("#trackingSetting").disabled = false;
    $("#trackingSetting").setAttribute?.("aria-disabled", "false");
    $("#trackingValue").textContent = tracking ? "ON" : "OFF";
  }
  function defaultTracking() {
    const screenW = globalThis.innerWidth ?? W;
    const screenH = globalThis.innerHeight ?? H;
    const coarse = globalThis.matchMedia?.("(pointer: coarse)").matches ?? screenW <= 760;
    const landscapeTablet = coarse && screenW >= screenH && Math.min(screenW, screenH) > 500;
    return coarse && !landscapeTablet;
  }
  function openSettings() {
    if (state === "dying" || state === "transition") return;
    settingsReturnState = state;
    if(state==="playing")stopGameplay();
    state = "settings";
    updateSettings();
    $("#settingsScreen").classList.remove("hidden");
  }
  function skinPreview(skin){
    return `<svg class="skin-preview" viewBox="0 0 58 38" style="--skin-shell:${skin.shell};--skin-accent:${skin.accent};--skin-body:${skin.body};--skin-eye:${skin.eye}" aria-hidden="true"><path class="shell" d="M7 11h29v5h5v14H4V16h3z"/><path class="accent" d="M11 6h21v5H11zm5 10h9v8h-9z"/><path class="body" d="M41 16h13v11H41zM7 30h8v6H7zm25 0h8v6h-8z"/><path class="eye" d="M50 19h3v3h-3z"/></svg>`;
  }
  function buildShop(){
    const grid=$("#skinGrid");
    grid.textContent="";
    for(const skin of SKINS){
      const owned=ownedSkins.has(skin.id), equipped=equippedSkin===skin.id;
      const card=document.createElement("button");
      card.className=`skin-card${equipped?" equipped":""}`;
      card.disabled=!owned&&shells<skin.cost;
      card.innerHTML=`${skinPreview(skin)}<b>${skin.name}</b><small>${equipped?"EQUIPPED":owned?"EQUIP":`${skin.cost} SHELLS`}</small>`;
      card.onclick=()=>{
        if(!ownedSkins.has(skin.id)){
          if(shells<skin.cost)return;
          shells-=skin.cost; ownedSkins.add(skin.id);
          beep(520,.11,"triangle");
        }
        equippedSkin=skin.id; saveEconomy(); buildShop();
      };
      grid.appendChild(card);
    }
    updateRewardButton();
  }
  function openShop(){
    if(state==="dying"||state==="transition"||state==="ad")return;
    shopReturnState=state;
    if(state==="playing")stopGameplay();
    state="shop"; $("#shopScreen").classList.remove("hidden"); buildShop();
  }
  function closeShop(){
    clearTimeout(updateRewardButton.timer);
    $("#shopScreen").classList.add("hidden");
    state=shopReturnState;
    if(state==="playing")startGameplay();
  }
  async function playAd(type){
    if(!CG.available)return {finished:false,error:"unavailable"};
    const previous=state;
    clearKeys(); state="ad";
    $("#adBlocker").classList.remove("hidden");
    const result=await CG.requestAd(type);
    $("#adBlocker").classList.add("hidden");
    if(state==="ad")state=previous;
    return result;
  }
  function rewardRemaining(){return Math.max(0,(Number(SAVE.getItem("tortuga-reward-cooldown"))||0)-Date.now());}
  function updateRewardButton(){
    const b=$("#rewardCurrencyBtn"), strong=b.querySelector("strong"), left=rewardRemaining();
    clearTimeout(updateRewardButton.timer);
    b.disabled=!CG.available||left>0;
    strong.textContent=!CG.available?"CRAZYGAMES ONLY":left>0?`READY IN ${Math.ceil(left/60000)}M` : "+50 SHELLS";
    if(left>0&&!$("#shopScreen").classList.contains("hidden"))updateRewardButton.timer=setTimeout(updateRewardButton,1000);
  }
  async function rewardCurrency(){
    if(rewardRemaining()>0||!CG.available)return;
    const result=await playAd("rewarded");
    if(!result.finished){
      $("#rewardCurrencyBtn").querySelector("strong").textContent="AD UNAVAILABLE";
      setTimeout(updateRewardButton,1500);
      return;
    }
    shells+=50;
    SAVE.setItem("tortuga-reward-cooldown",String(Date.now()+120000));
    saveEconomy(); showCurrencyGain(50); buildShop();
  }
  function openSkip(){
    if(li>=L.length-1)return;
    $("#deathScreen").classList.add("hidden");
    state="skipmenu";
    $("#skipScreen").classList.remove("hidden");
    $("#skipAdBtn").disabled=!CG.available;
    $("#skipAdBtn").querySelector("strong").textContent=CG.available?"SKIP":"CRAZYGAMES ONLY";
    $("#skipCoinsBtn").disabled=shells<100;
  }
  function skipLevel(){
    unlocked=Math.max(unlocked,Math.min(L.length,li+2));
    SAVE.setItem("level-devil-unlocked",String(unlocked));
    li=Math.min(L.length-1,li+1);
    $("#skipScreen").classList.add("hidden");
    reset();
  }
  async function skipWithAd(){
    const result=await playAd("rewarded");
    if(result.finished)skipLevel();
    else {
      $("#skipAdBtn").querySelector("strong").textContent="AD UNAVAILABLE";
      setTimeout(()=>{if(state==="skipmenu")$("#skipAdBtn").querySelector("strong").textContent="SKIP";},1500);
    }
  }
  if ($("#startBtn")) $("#startBtn").onclick = start;
  if ($("#levelsBtn")) $("#levelsBtn").onclick = openLevels;
  $("#mapBtn").onclick = openLevels;
  $("#closeLevelsBtn").onclick = () => {
    $("#levelScreen").classList.add("hidden");
    state = levelReturnState;
    if (state === "deathmenu") $("#deathScreen").classList.remove("hidden");
    if(state==="playing")startGameplay();
  };
  $("#deathRestartBtn").onclick = () => {
    $("#deathScreen").classList.add("hidden");
    reset(false);
  };
  $("#deathLevelsBtn").onclick = () => {
    $("#deathScreen").classList.add("hidden");
    openLevels();
  };
  $("#againBtn").onclick = start;
  $("#restartBtn").onclick = () => {
    if (state !== "menu") reset(false);
  };
  $("#settingsBtn").onclick = openSettings;
  $("#shopBtn").onclick = openShop;
  $("#closeShopBtn").onclick = closeShop;
  $("#rewardCurrencyBtn").onclick = rewardCurrency;
  $("#deathSkipBtn").onclick = openSkip;
  $("#closeSkipBtn").onclick = () => {
    $("#skipScreen").classList.add("hidden");
    state="deathmenu";
    $("#deathScreen").classList.remove("hidden");
  };
  $("#skipAdBtn").onclick = skipWithAd;
  $("#skipCoinsBtn").onclick = () => { if(shells>=100){shells-=100;saveEconomy();skipLevel();} };
  $("#aboutSetting").onclick = () => {
    $("#settingsScreen").classList.add("hidden");
    $("#aboutScreen").classList.remove("hidden");
  };
  $("#closeAboutBtn").onclick = () => {
    $("#aboutScreen").classList.add("hidden");
    $("#settingsScreen").classList.remove("hidden");
  };
  $("#closeSettingsBtn").onclick = () => {
    $("#settingsScreen").classList.add("hidden");
    state = settingsReturnState;
    if(state==="playing")startGameplay();
  };
  $("#soundSetting").onclick = toggle;
  $("#trackingSetting").onclick = () => {
    tracking = !tracking;
    trackingOverride = true;
    camera.ready = false;
    SAVE.setItem("level-devil-tracking", tracking ? "on" : "off");
    updateSettings();
  };
  $("#autoRestartSetting").onclick = () => {
    autoRestart = !autoRestart;
    SAVE.setItem(
      "level-devil-auto-restart",
      autoRestart ? "on" : "off",
    );
    updateSettings();
  };
  addEventListener("blur", () => {
    K.left = K.right = K.jump = 0;
    for (const set of [...Object.values(activePointers), ...Object.values(activeTouches)]) set.clear();
  });
  addEventListener("resize", updateSettings);
  CG.onSettings?.(()=>updateSettings());
  updateCurrency();
  updateSettings();
  start();
  CG.loadingDone();
  document.documentElement.dataset.gameReady="true";
  requestAnimationFrame(loop);
})();
