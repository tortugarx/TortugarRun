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
    meter: $("#focusMeter"),
    toast: $("#toast"),
  };
  const K = { left: 0, right: 0, jump: 0 };
  const PAL = [
    ["#dce8e3", "#a9c6bb", "#668f80", "#29483e"],
    ["#e8dfd5", "#c9ad91", "#987253", "#503b2b"],
    ["#dde4eb", "#aabdd0", "#6b88a4", "#344b62"],
    ["#e8dce2", "#c8a7b7", "#976a80", "#513747"],
    ["#e5e5d6", "#c2c19b", "#8b8956", "#48472b"],
    ["#e2ddea", "#b9acd0", "#806ba2", "#44375c"],
  ];
  const palette = () => PAL[li % PAL.length];
  let unlocked = DevilLevels.levels.length;
  localStorage.setItem("level-devil-unlocked", String(unlocked));
  let state = "menu",
    li = 0,
    deaths = 0,
    energy = 100,
    pulse = 0,
    shake = 0,
    muted = localStorage.getItem("level-devil-sound") === "off",
    autoRestart = localStorage.getItem("level-devil-auto-restart") === "on",
    last = 0,
    clock = 0,
    audio,
    toastTimer,
    levelReturnState = "menu",
    settingsReturnState = "menu",
    portalAnim = null,
    P,
    R,
    particles = [];
  const L = DevilLevels.levels;
  const GROUPS = DevilLevels.groups;
  let world, accumulator = 0, runId = 0;
  function reset(hint = true) {
    runId++;
    li = Math.max(0, Math.min(L.length - 1, li));
    world = new DevilWorld.World(L[li]);
    P = world.p;
    R = world;
    energy = 100; pulse = 0; particles = []; portalAnim = null;
    accumulator = 0;
    clock = 0;
    for (const id of ["#levelScreen", "#settingsScreen"]) $(id).classList.add("hidden");
    state = "playing";
    $("#deathScreen").classList.add("hidden");
    const colors = palette();
    document.documentElement.style.setProperty("--level-light", colors[0]);
    document.documentElement.style.setProperty("--level-mid", colors[2]);
    document.documentElement.style.setProperty("--level-dark", colors[3]);
    UI.level.textContent = String(li + 1).padStart(2,"0") + " / " + L.length;
    if (hint) toast(L[li].name, 1800);
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
    L.forEach((level, i) => {
      if (level.group !== selectedGroup) return;
      const b = document.createElement("button");
      b.disabled = i + 1 > unlocked;
      b.innerHTML = `${level.number}<small>${b.disabled ? "LOCKED" : "OPEN"}</small>`;
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
    state = "levelmenu";
    buildLevelGrid();
    $("#levelScreen").classList.remove("hidden");
  }
  function die() {
    if (state !== "playing") return;
    state = "dying";
    deaths++;
    UI.deaths.textContent = String(deaths).padStart(2, "0");
    shake = 17;
    burst(P.x + 12, P.y + 9, "#333", 12);
    beep(75, 0.24, "sawtooth");
    const deathRun = runId;
    setTimeout(() => {
      if (runId !== deathRun || state !== "dying") return;
      if (autoRestart) {
        reset(false);
        return;
      }
      state = "deathmenu";
      $("#deathScreen").classList.remove("hidden");
    }, 780);
  }
  function finish() {
    if (state !== "playing") return;
    state = "transition";
    burst(P.x + 12, P.y + 9, "#777", 16);
    beep(620, 0.12, "sine");
    unlocked = Math.max(unlocked, Math.min(L.length, li + 2));
    localStorage.setItem("level-devil-unlocked", unlocked);
    const finishRun = runId;
    setTimeout(() => {
      if (runId !== finishRun || state !== "transition") return;
      if (++li === L.length) {
        state = "won";
        $("#finalStats").textContent =
          `${deaths} deaths. All ${L.length} rooms cleared.`;
        UI.win.classList.remove("hidden");
      } else reset();
    }, 650);
  }
  function focus() {
    if (state !== "playing" || energy < 40 || pulse) return;
    energy -= 40;
    pulse = 1;
    beep(760, 0.12, "sine");
  }
  function toast(s, ms = 1600) {
    UI.toast.textContent = s;
    UI.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => UI.toast.classList.remove("show"), ms);
  }
  function beep(f, d = 0.06, type = "square") {
    if (muted) return;
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
    if (state !== "playing") return;
    accumulator += dt;
    while (accumulator + 1e-9 >= DevilWorld.STEP && state === "playing") {
      world.tick(K);
      accumulator = Math.max(0, accumulator - DevilWorld.STEP);
      for (const event of world.events) {
        if (event.type === "jump") beep(300,0.05);
        if (event.type === "button") beep(240,0.07);
        if (event.type === "teleport") beep(430,0.16);
        if (event.type === "arrival") beep(120,0.1);
      }
      if (world.status === "dead") die();
      else if (world.status === "won") finish();
    }
    if (world.teleport) {
      const from = R.portals.find(p => p.id === world.teleport.from);
      const to = R.portals.find(p => p.id === world.teleport.to);
      portalAnim = { t: world.teleport.t, from: {x:from.x,y:from.y-20}, to:{x:to.x,y:to.y-40} };
    } else portalAnim = null;
    pulse = Math.max(0, pulse - dt*0.74);
    energy = Math.min(100, energy + dt*7);
    UI.meter.style.width = energy + "%";
  }
  function platform(r, crumb = false) {
    const c = palette();
    X.fillStyle = crumb ? c[2] : c[3];
    X.beginPath();
    X.rect(r.x, r.y, r.w, r.h);
    X.fill();
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
    if (!h.progress && !pulse) return;
    X.save();
    const c = palette(), raised = Math.round(9 * (h.progress || (pulse ? 1 : 0)));
    X.globalAlpha = h.progress ? 1 : pulse * 0.5;
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
  function drawPortal(p) { drawPortalEnd(p.x, p.y - 40, "floor", 0); }
  function drawPortalEnd(x, y, orientation, phase) {
    const c = palette();
    X.save();
    X.translate(Math.round(x), Math.round(y + 20));
    if (orientation === "ceiling") X.rotate(Math.PI / 2);
    const pulse = Math.floor(clock * 9 + phase) % 3;
    X.fillStyle = c[3];
    X.fillRect(-18, -20, 36, 40);
    X.fillStyle = c[0];
    X.fillRect(-13, -15, 26, 30);
    X.fillStyle = c[2];
    X.fillRect(-9 + pulse, -11 + pulse, 18 - pulse * 2, 22 - pulse * 2);
    X.fillStyle = c[0];
    X.fillRect(-5, -7, 10, 14);
    X.fillStyle = c[1];
    X.fillRect(-2, -2, 4, 4);
    X.restore();
  }
  function drawTeleport() {
    if (!portalAnim) return;
    const c = palette();
    for (let i = 0; i < 14; i++) {
      const delay = i / 55;
      const t = Math.max(0, Math.min(1, (portalAnim.t - delay) / 0.75));
      const x = portalAnim.from.x + (portalAnim.to.x - portalAnim.from.x) * t;
      const y =
        portalAnim.from.y +
        (portalAnim.to.y + 20 - portalAnim.from.y) * t +
        Math.sin(t * Math.PI) * (-44 - (i % 3) * 7);
      X.fillStyle = c[2 + (i % 2)];
      const size = i % 3 === 0 ? 5 : 3;
      X.fillRect(
        Math.round((x + ((i % 5) - 2) * 4) / 3) * 3,
        Math.round((y + (i % 4) * 3) / 3) * 3,
        size,
        size,
      );
    }
  }
  function drawButton(b) {
    const c = palette();
    const top = b.y + (b.pressed ? 5 : 0);
    X.fillStyle = c[3];
    X.fillRect(b.x, top, b.w, b.y + 8 - top);
    X.fillStyle = b.pressed ? c[2] : c[0];
    X.fillRect(b.x + 2, top + 2, b.w - 4, b.pressed ? 1 : 4);
    X.fillStyle = c[3];
    if (!b.pressed) for (let x = b.x + 5; x < b.x + b.w - 3; x += 6) X.fillRect(x,top+3,2,2);
    X.fillStyle = c[2];
    X.fillRect(b.x, b.y + 6, b.w, 2);
  }
  function drawHero() {
    X.save();
    const c = palette();
    X.translate(Math.round(P.x + P.w / 2), Math.round(P.y + P.h / 2));
    X.scale(P.w / 24, P.h / 18);
    if (P.face < 0) X.scale(-1, 1);
    const b = P.ground && Math.abs(P.vx) ? Math.round(Math.sin(clock * 16)) : 0;
    X.fillStyle = c[3];
    X.fillRect(-10, -6 + b, 15, 11);
    X.fillStyle = c[2];
    X.fillRect(-8, -8 + b, 12, 4);
    X.fillRect(5, -4 + b, 7, 7);
    X.fillRect(-9, 5 + b, 4, 3);
    X.fillRect(2, 5 + b, 4, 3);
    X.fillStyle = c[0];
    X.fillRect(10, -2 + b, 1, 1);
    X.restore();
  }
  function draw() {
    X.save();
    if (shake) {
      X.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      shake *= 0.82;
    }
    X.imageSmoothingEnabled = false;
    const c = palette();
    X.fillStyle = c[0];
    X.fillRect(0, 0, W, H);
    if (state !== "menu" && R) {
      R.buttons.forEach(drawButton);
      R.solid.forEach((r) => platform(r));
      R.solid.forEach(stoneEdges);
      R.haz.forEach(hazard);
      R.portals.forEach(drawPortal);
      drawTeleport();
      gate(R.exit[0], R.exit[1], R.locked);
      if (P && state === "playing" && !portalAnim) drawHero();
      particles.forEach((p) => {
        X.globalAlpha = p.life;
        X.fillStyle = p.color;
        X.fillRect(Math.round(p.x / 4) * 4, Math.round(p.y / 4) * 4, 5, 5);
        X.globalAlpha = 1;
      });
      if (pulse) {
        X.strokeStyle = `rgba(40,40,40,${pulse * 0.5})`;
        X.lineWidth = 2;
        X.beginPath();
        X.arc(P.x + 18, P.y + 15, (1 - pulse) * 550, 0, Math.PI * 2);
        X.stroke();
      }
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
    if (e.code === "KeyF" || e.code === "ShiftLeft") focus();
    if (e.code === "KeyR" && state !== "menu") reset(false);
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
        if (k === "focus") focus();
        else {
          activePointers[k].add(e.pointerId);
          K[k] = 1;
        }
      },
      up = (e) => {
        if (e.pointerType === "touch") return;
        e.preventDefault();
        if (k !== "focus") {
          activePointers[k].delete(e.pointerId);
          K[k] = activePointers[k].size ? 1 : 0;
        }
      };
    b.addEventListener("pointerdown", down);
    b.addEventListener("pointerup", up);
    b.addEventListener("pointercancel", up);
    b.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        if (k === "focus") return focus();
        for (const touch of e.changedTouches)
          activeTouches[k].add(touch.identifier);
        K[k] = 1;
      },
      { passive: false },
    );
    const touchUp = (e) => {
      e.preventDefault();
      if (k === "focus") return;
      for (const touch of e.changedTouches)
        activeTouches[k].delete(touch.identifier);
      K[k] = activeTouches[k].size || activePointers[k].size ? 1 : 0;
    };
    b.addEventListener("touchend", touchUp, { passive: false });
    b.addEventListener("touchcancel", touchUp, { passive: false });
  });
  function toggle() {
    muted = !muted;
    localStorage.setItem("level-devil-sound", muted ? "off" : "on");
    updateSettings();
  }
  function updateSettings() {
    $("#soundValue").textContent = muted ? "OFF" : "ON";
    $("#autoRestartValue").textContent = autoRestart ? "ON" : "OFF";
  }
  function openSettings() {
    if (state === "dying" || state === "transition") return;
    settingsReturnState = state;
    state = "settings";
    updateSettings();
    $("#settingsScreen").classList.remove("hidden");
  }
  if ($("#startBtn")) $("#startBtn").onclick = start;
  if ($("#levelsBtn")) $("#levelsBtn").onclick = openLevels;
  $("#mapBtn").onclick = openLevels;
  $("#focusBtn").onclick = focus;
  $("#closeLevelsBtn").onclick = () => {
    $("#levelScreen").classList.add("hidden");
    state = levelReturnState;
    if (state === "deathmenu") $("#deathScreen").classList.remove("hidden");
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
  $("#closeSettingsBtn").onclick = () => {
    $("#settingsScreen").classList.add("hidden");
    state = settingsReturnState;
  };
  $("#soundSetting").onclick = toggle;
  $("#autoRestartSetting").onclick = () => {
    autoRestart = !autoRestart;
    localStorage.setItem(
      "level-devil-auto-restart",
      autoRestart ? "on" : "off",
    );
    updateSettings();
  };
  addEventListener("blur", () => {
    K.left = K.right = K.jump = 0;
    for (const set of [...Object.values(activePointers), ...Object.values(activeTouches)]) set.clear();
  });
  updateSettings();
  start();
  requestAnimationFrame(loop);
})();
