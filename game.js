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
  const palette = () => PAL[Math.min(li, PAL.length - 1)];
  let unlocked = Math.max(
    1,
    Number(localStorage.getItem("level-devil-unlocked")) || 1,
  );
  let state = "menu",
    li = 0,
    deaths = 0,
    energy = 100,
    pulse = 0,
    shake = 0,
    muted = false,
    last = 0,
    clock = 0,
    audio,
    toastTimer,
    levelReturnState = "menu",
    P,
    R,
    particles = [];
  const OLD_LEVELS = [
    {
      name: "Die erste Lüge",
      hint: "Rissige Bodenplatten verraten Fallen.",
      spawn: [36, 444],
      exit: [885, 390],
      solid: [
        [0, 485, 190, 55],
        [260, 435, 80, 18],
        [410, 375, 82, 18],
        [565, 435, 78, 18],
        [710, 370, 78, 18],
        [850, 455, 110, 85],
      ],
      haz: [
        ["spike", 140, 465, 42, 20, "near", 105],
        ["spike", 292, 415, 38, 20, "hidden"],
        ["saw", 515, 320, 17, 55, "orbit"],
        ["spike", 590, 415, 42, 20, "hidden"],
        ["spike", 736, 350, 40, 20, "near", 680],
      ],
      crumb: [[410, 375, 82, 18, 0.65]],
    },
    {
      name: "Wurzeln mit Ohren",
      hint: "Bleib in Bewegung. Rissige Platten schlagen aus.",
      spawn: [34, 444],
      exit: [880, 78],
      solid: [
        [0, 485, 145, 55],
        [205, 425, 75, 18],
        [345, 360, 72, 18],
        [485, 295, 72, 18],
        [625, 230, 72, 18],
        [770, 150, 190, 18],
      ],
      haz: [
        ["spike", 98, 465, 38, 20, "near", 65],
        ["riser", 228, 415, 28, 10, "near", 180],
        ["saw", 315, 312, 16, 58, "vertical"],
        ["riser", 510, 285, 28, 10, "near", 450],
        ["saw", 735, 178, 17, 50, "horizontal"],
        ["spike", 818, 130, 42, 20, "hidden"],
      ],
      crumb: [
        [345, 360, 72, 18, 0.48],
        [625, 230, 72, 18, 0.44],
      ],
    },
    {
      name: "Das hungrige Tal",
      hint: "Die rote Flut steigt. Plane, dann lauf.",
      spawn: [30, 444],
      exit: [881, 71],
      tide: true,
      solid: [
        [0, 485, 135, 55],
        [185, 425, 68, 18],
        [305, 355, 66, 18],
        [425, 290, 66, 18],
        [550, 225, 66, 18],
        [680, 165, 66, 18],
        [815, 130, 145, 18],
      ],
      haz: [
        ["spike", 88, 465, 38, 20, "on"],
        ["saw", 280, 320, 16, 48, "horizontal"],
        ["spike", 326, 335, 36, 20, "hidden"],
        ["saw", 645, 190, 17, 55, "vertical"],
        ["spike", 698, 145, 38, 20, "near", 650],
      ],
      crumb: [
        [185, 425, 68, 18, 0.4],
        [425, 290, 66, 18, 0.42],
        [680, 165, 66, 18, 0.46],
      ],
    },
    {
      name: "Zwei falsche Monde",
      hint: "Nicht jedes Tor ist ein Ausgang.",
      spawn: [30, 444],
      exit: [882, 160],
      fake: [690, 322],
      solid: [
        [0, 485, 140, 55],
        [195, 425, 72, 18],
        [330, 360, 72, 18],
        [465, 300, 72, 18],
        [610, 360, 120, 18],
        [770, 295, 76, 18],
        [850, 230, 110, 18],
      ],
      haz: [
        ["spike", 92, 465, 38, 20, "hidden"],
        ["riser", 350, 350, 30, 10, "near", 290],
        ["spike", 642, 340, 40, 20, "near", 565],
        ["saw", 735, 235, 18, 62, "vertical"],
        ["spike", 796, 275, 38, 20, "hidden"],
        ["spike", 866, 210, 36, 20, "hidden"],
      ],
      crumb: [
        [195, 425, 72, 18, 0.4],
        [465, 300, 72, 18, 0.4],
        [770, 295, 76, 18, 0.45],
      ],
    },
    {
      name: "Der Panzerbrecher",
      hint: "Die Steine fallen in deiner Reihenfolge.",
      spawn: [30, 444],
      exit: [883, 390],
      solid: [
        [0, 485, 115, 55],
        [170, 435, 66, 18],
        [290, 375, 64, 18],
        [410, 315, 64, 18],
        [530, 375, 64, 18],
        [650, 315, 64, 18],
        [780, 455, 180, 85],
      ],
      haz: [
        ["spike", 68, 465, 38, 20, "on"],
        ["saw", 260, 335, 16, 58, "vertical"],
        ["spike", 305, 355, 38, 20, "hidden"],
        ["saw", 500, 275, 17, 55, "horizontal"],
        ["spike", 545, 355, 38, 20, "hidden"],
        ["spike", 805, 435, 40, 20, "near", 720],
      ],
      crumb: [
        [170, 435, 66, 18, 0.33],
        [290, 375, 64, 18, 0.36],
        [410, 315, 64, 18, 0.36],
        [530, 375, 64, 18, 0.34],
        [650, 315, 64, 18, 0.38],
      ],
    },
    {
      name: "Das Mondtor",
      hint: "Ein letzter Klang. Dann lauf.",
      spawn: [27, 444],
      exit: [883, 180],
      tide: true,
      solid: [
        [0, 485, 110, 55],
        [155, 425, 62, 18],
        [265, 355, 62, 18],
        [375, 415, 62, 18],
        [490, 345, 62, 18],
        [605, 275, 62, 18],
        [720, 320, 62, 18],
        [850, 250, 110, 18],
      ],
      haz: [
        ["spike", 64, 465, 38, 20, "near", 48],
        ["saw", 240, 300, 16, 68, "vertical"],
        ["riser", 392, 405, 28, 10, "near", 350],
        ["saw", 570, 282, 18, 72, "horizontal"],
        ["spike", 622, 255, 36, 20, "hidden"],
        ["riser", 740, 310, 25, 10, "near", 690],
        ["spike", 866, 230, 36, 20, "hidden"],
      ],
      crumb: [
        [155, 425, 62, 18, 0.36],
        [265, 355, 62, 18, 0.4],
        [490, 345, 62, 18, 0.34],
        [605, 275, 62, 18, 0.4],
        [720, 320, 62, 18, 0.36],
      ],
    },
  ];
  const GROUPS = ["STACHELN", "BEWEGUNG", "TRICKS"];
  function makeLevel(group, number) {
    const difficulty = group * 10 + number;
    const gapA = group === 0 && number < 4 ? 0 : 28 + Math.min(22, number * 2);
    const gapB = number < 2 ? 0 : 26 + Math.min(20, number * 2);
    const a = 245,
      b = 610;
    const solid = gapA
      ? [
          [0, 485, a, 55],
          [a + gapA, 485, b - a - gapA, 55],
          [b + gapB, 485, 960 - b - gapB, 55],
        ]
      : [
          [0, 485, b, 55],
          [b + gapB, 485, 960 - b - gapB, 55],
        ];
    if (!gapB) solid.splice(0, solid.length, [0, 485, 960, 55]);
    if (group >= 1) {
      solid.push([
        a - 12,
        448,
        72,
        16,
        {
          axis: number % 2 ? "x" : "y",
          range: 24 + number,
          speed: 1.2 + number * 0.07,
          trigger: 155,
        },
      ]);
      if (number > 5)
        solid.push([
          b - 18,
          448,
          76,
          16,
          { axis: number % 2 ? "y" : "x", range: 28, speed: 1.5, trigger: 525 },
        ]);
    }
    const safeRanges = solid.filter((p) => p[1] === 485 && p[2] > 80);
    const haz = [];
    const count = 2 + Math.floor(number / 2) + group;
    for (let i = 0; i < count; i++) {
      const floor = safeRanges[i % safeRanges.length];
      const min = floor[0] + (floor[0] === 0 ? 90 : 18);
      const max = floor[0] + floor[2] - 46;
      const x = Math.round(
        min + ((i * 83 + number * 37) % Math.max(1, max - min)),
      );
      haz.push([
        "spike",
        x,
        465,
        36,
        20,
        i % 3 === 1 ? "hidden" : "near",
        x - 48,
      ]);
    }
    const crumb =
      group === 2 && number > 2
        ? [[455, 448, 72, 16, 0.55 - Math.min(0.2, number * 0.02)]]
        : [];
    if (crumb.length) solid.push([455, 448, 72, 16]);
    return {
      group,
      number,
      name: `${GROUPS[group]} ${String(number).padStart(2, "0")}`,
      hint:
        group === 0
          ? "Achte auf den Boden."
          : group === 1
            ? "Der Boden bleibt nicht stehen."
            : "Bekannte Regeln. Neue Reihenfolge.",
      spawn: [28, 447],
      exit: [900, 415],
      solid,
      haz,
      crumb,
      fake: group === 2 && number === 7 ? [720, 425] : undefined,
      tide: group === 2 && number === 10,
    };
  }
  const L = GROUPS.flatMap((_, group) =>
    Array.from({ length: 10 }, (_, i) => makeLevel(group, i + 1)),
  );
  const hit = (a, b) =>
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  function reset(hint = true) {
    const l = L[li];
    P = {
      x: l.spawn[0],
      y: l.spawn[1],
      w: 24,
      h: 18,
      vx: 0,
      vy: 0,
      ground: 0,
      coyote: 0,
      held: 0,
      buffer: 0,
      face: 1,
      px: 0,
      py: 0,
    };
    R = {
      solid: l.solid
        .filter((v) => !l.crumb.some((c) => c[0] === v[0] && c[1] === v[1]))
        .map((v, i) => ({
          x: v[0],
          y: v[1],
          w: v[2],
          h: v[3],
          id: "s" + i,
          move: v[4] || null,
          moveActive: false,
        })),
      crumb: l.crumb.map((v, i) => ({
        x: v[0],
        y: v[1],
        w: v[2],
        h: v[3],
        delay: v[4],
        timer: 0,
        fall: 0,
        armed: 0,
        id: "c" + i,
      })),
      haz: l.haz
        .filter((v) => v[0] === "spike")
        .map((v, i) => {
          const active = ["on", "orbit", "vertical", "horizontal"].includes(
            v[5],
          );
          return {
            type: v[0],
            x: v[1],
            y: v[2],
            w: v[3],
            range: v[4],
            mode: v[5],
            trigger: v[6],
            active,
            progress: active ? 1 : 0,
            phase: i * 1.6,
            speed: 1.5 + Math.random() * 2.3,
            direction: Math.random() < 0.5 ? -1 : 1,
          };
        }),
      tide: H + 60,
      fakeLock: 0,
    };
    const terrain = [...R.solid, ...R.crumb];
    const carriers = R.haz.map((h) =>
      terrain.find(
        (p) =>
          Math.abs(p.y - (h.y + 20)) < 2 &&
          h.x >= p.x &&
          h.x + h.w <= p.x + p.w,
      ),
    );
    terrain.forEach((p) => {
      if (p.y < 480) p.y = 430;
      p.originX = p.x;
      p.originY = p.y;
    });
    R.haz.forEach((h, i) => {
      if (carriers[i]) h.y = carriers[i].y - 20;
    });
    const nearestFloor = (x) =>
      terrain.reduce((a, p) =>
        Math.abs(p.x + p.w / 2 - x) < Math.abs(a.x + a.w / 2 - x) ? p : a,
      );
    const exitFloor = nearestFloor(l.exit[0]);
    R.exit = [l.exit[0], exitFloor.y - 65];
    if (l.fake) {
      const fakeFloor = nearestFloor(l.fake[0]);
      R.fake = [l.fake[0], fakeFloor.y - 58];
    }
    R.haz.forEach((h) => {
      if (h.type !== "spike") return;
      const floor = [...R.solid, ...R.crumb].find(
        (p) =>
          Math.abs(p.y - (h.y + 20)) < 2 &&
          h.x >= p.x &&
          h.x + h.w <= p.x + p.w,
      );
      if (!floor) return;
      const min = floor.x === 0 ? Math.max(floor.x + 8, P.x + 48) : floor.x + 8;
      const max = floor.x + floor.w - h.w - 8;
      if (max > min) h.x = Math.round(min + Math.random() * (max - min));
      if (h.mode === "near") h.trigger = h.x - 45 - Math.random() * 28;
    });
    energy = 100;
    pulse = 0;
    particles = [];
    state = "playing";
    UI.level.textContent = `${String(li + 1).padStart(2, "0")} / ${String(L.length).padStart(2, "0")}`;
    if (hint) toast(`${l.name} — ${l.hint}`, 3200);
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
  function buildLevelGrid(selectedGroup = Math.floor(li / 10)) {
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
      b.innerHTML = `${level.number}<small>${b.disabled ? "GESPERRT" : "OFFEN"}</small>`;
      b.onclick = () => {
        li = i;
        UI.start?.classList.add("hidden");
        UI.win.classList.add("hidden");
        $("#levelScreen").classList.add("hidden");
        reset();
      };
      grid.appendChild(b);
    });
  }
  function openLevels() {
    levelReturnState = state === "playing" ? "playing" : "menu";
    state = "levelmenu";
    buildLevelGrid();
    $("#levelScreen").classList.remove("hidden");
  }
  function die() {
    if (state !== "playing") return;
    state = "dead";
    deaths++;
    UI.deaths.textContent = String(deaths).padStart(2, "0");
    shake = 17;
    burst(P.x + 12, P.y + 9, "#333", 12);
    beep(75, 0.24, "sawtooth");
    setTimeout(() => reset(false), 520);
  }
  function finish() {
    if (state !== "playing") return;
    state = "transition";
    burst(P.x + 12, P.y + 9, "#777", 16);
    beep(620, 0.12, "sine");
    unlocked = Math.max(unlocked, Math.min(L.length, li + 2));
    localStorage.setItem("level-devil-unlocked", unlocked);
    setTimeout(() => {
      if (++li === L.length) {
        state = "won";
        $("#finalStats").textContent =
          `${deaths} Fehltritte. Moss hat den falschen Pfad bezwungen.`;
        UI.win.classList.remove("hidden");
      } else reset();
    }, 650);
  }
  function focus() {
    if (state !== "playing" || energy < 40 || pulse) return;
    energy -= 40;
    pulse = 1;
    R.haz.forEach((h) => {
      if (h.mode === "hidden") h.active = true;
    });
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
  function platforms() {
    return [
      ...R.solid,
      ...R.crumb
        .filter((c) => c.fall < 160)
        .map((c) => ({ ...c, y: c.y + c.fall })),
    ];
  }
  function resolveX() {
    for (const r of platforms()) {
      if (!hit(P, r)) continue;
      if (P.px + P.w <= r.x + 3) P.x = r.x - P.w;
      else if (P.px >= r.x + r.w - 3) P.x = r.x + r.w;
      P.vx = 0;
    }
  }
  function resolveY() {
    for (const r of platforms()) {
      if (!hit(P, r)) continue;
      if (P.vy >= 0 && P.py + P.h <= r.y + 6) {
        P.y = r.y - P.h;
        P.vy = 0;
        P.ground = 1;
        const c = R.crumb.find((v) => v.id === r.id);
        if (c) c.armed = 1;
      } else if (P.vy < 0 && P.py >= r.y + r.h - 3) {
        P.y = r.y + r.h;
        P.vy = 0;
      }
    }
  }
  function hbox(h) {
    if (h.type === "spike")
      return {
        x: h.x + 4,
        y: h.y + 18 * (1 - h.progress),
        w: h.w - 8,
        h: 2 + 18 * h.progress,
      };
    if (h.type === "riser")
      return {
        x: h.x,
        y: h.y - 32 * h.progress,
        w: h.w,
        h: 10 + 32 * h.progress,
      };
    let x = h.x,
      y = h.y;
    const wobble = Math.sin(clock * 0.43 + h.phase) * 0.7;
    if (h.mode === "vertical")
      y += Math.sin(clock * h.speed * h.direction + h.phase + wobble) * h.range;
    if (h.mode === "horizontal")
      x += Math.sin(clock * h.speed * h.direction + h.phase + wobble) * h.range;
    if (h.mode === "orbit") {
      x += Math.cos(clock * h.speed * h.direction + h.phase + wobble) * 62;
      y += Math.sin(clock * h.speed * h.direction + h.phase) * 42;
    }
    return { x: x - h.w, y: y - h.w, w: h.w * 2, h: h.w * 2 };
  }
  function update(dt) {
    clock += dt;
    particles.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 430 * dt;
      p.life -= dt * 1.7;
    });
    particles = particles.filter((p) => p.life > 0);
    if (state !== "playing") return;
    const l = L[li];
    P.px = P.x;
    P.py = P.y;
    const target = (K.left ? -220 : 0) + (K.right ? 220 : 0);
    const acceleration = P.ground ? 1500 : 850;
    const change = Math.max(
      -acceleration * dt,
      Math.min(acceleration * dt, target - P.vx),
    );
    P.vx += change;
    if (P.vx) P.face = Math.sign(P.vx);
    P.coyote = P.ground ? 0.105 : Math.max(0, P.coyote - dt);
    P.buffer = K.jump && !P.held ? 0.11 : Math.max(0, P.buffer - dt);
    if (P.buffer > 0 && P.coyote > 0) {
      P.vy = -340;
      P.ground = 0;
      P.coyote = 0;
      P.buffer = 0;
      P.held = 1;
      beep(300, 0.05);
    }
    if (!K.jump) P.held = 0;
    if (!K.jump && P.vy < -120) P.vy += 900 * dt;
    P.vy = Math.min(720, P.vy + 1100 * dt);
    P.x += P.vx * dt;
    resolveX();
    P.y += P.vy * dt;
    P.ground = 0;
    resolveY();
    P.x = Math.max(0, Math.min(W - P.w, P.x));
    if (P.y > H + 45) die();
    R.crumb.forEach((c) => {
      if (c.armed) c.timer += dt;
      if (c.timer > c.delay) c.fall += 360 * dt;
    });
    R.solid.forEach((s) => {
      if (!s.move) return;
      if (P.x > s.move.trigger) s.moveActive = true;
      if (!s.moveActive) return;
      const amount = Math.sin(clock * s.move.speed) * s.move.range;
      s.x = s.originX + (s.move.axis === "x" ? amount : 0);
      s.y = s.originY + (s.move.axis === "y" ? amount : 0);
    });
    R.haz.forEach((h) => {
      if (h.mode === "near" && P.x > h.trigger) h.active = true;
      if (h.active) h.progress = Math.min(1, h.progress + dt * 3.2);
      if (h.active && h.progress > 0.35 && hit(P, hbox(h))) die();
    });
    if (l.tide) {
      R.tide -= 24 * dt;
      if (P.y + P.h > R.tide) die();
    }
    if (
      R.fake &&
      !R.fakeLock &&
      hit(P, { x: R.fake[0], y: R.fake[1], w: 46, h: 60 })
    ) {
      R.fakeLock = 1;
      R.haz.forEach((h) => (h.active = true));
      toast("Das war nicht der Mond.", 1200);
      P.x -= 28;
      P.vy = -330;
    }
    if (hit(P, { x: R.exit[0], y: R.exit[1], w: 48, h: 70 })) finish();
    pulse = Math.max(0, pulse - dt * 0.74);
    energy = Math.min(100, energy + dt * 7);
    UI.meter.style.width = energy + "%";
  }
  function platform(r, crumb = false) {
    const c = palette();
    X.fillStyle = crumb ? c[2] : c[3];
    X.beginPath();
    X.rect(r.x, r.y, r.w, r.h);
    X.fill();
    X.fillStyle = crumb ? c[1] : c[2];
    X.fillRect(r.x, r.y, r.w, 2);
  }
  function hazard(h) {
    X.save();
    const c = palette();
    const b = hbox(h);
    if (h.type === "spike") {
      if (!h.active && h.mode === "hidden" && !pulse) {
        X.restore();
        return;
      }
      X.globalAlpha = h.active ? 1 : Math.max(0.25, pulse);
      X.fillStyle = c[3];
      const n = Math.max(1, Math.floor(h.w / 12));
      for (let i = 0; i < n; i++) {
        const sx = Math.round(h.x + (i * h.w) / n);
        const raised = Math.round(16 * h.progress);
        const center = sx + 6;
        for (let row = 0; row < raised; row += 4) {
          const width = Math.min(12, 3 + row * 0.55);
          X.fillRect(
            Math.round(center - width / 2),
            h.y + 20 - raised + row,
            Math.round(width),
            Math.min(4, raised - row),
          );
        }
      }
    } else if (h.type === "riser") {
      X.fillStyle = c[3];
      X.fillRect(b.x, b.y, b.w, b.h);
      X.fillStyle = c[2];
      X.fillRect(b.x, b.y, b.w, 4);
    } else {
      X.translate(b.x + b.w / 2, b.y + b.h / 2);
      X.rotate(clock * 3);
      X.fillStyle = c[2];
      for (let i = 0; i < 10; i++) {
        X.rotate(Math.PI / 5);
        X.fillRect(h.w * 0.55, -2, h.w * 0.65, 4);
      }
      X.fillStyle = c[3];
      X.beginPath();
      X.arc(0, 0, h.w * 0.68, 0, Math.PI * 2);
      X.fill();
    }
    X.restore();
  }
  function gate(x, y, fake) {
    X.save();
    const c = palette();
    X.translate(x + 23, y + 34);
    X.fillStyle = fake ? c[2] : c[3];
    X.fillRect(-17, -31, 34, 62);
    X.fillStyle = c[0];
    X.fillRect(-11, -24, 22, 55);
    X.fillStyle = fake ? c[2] : c[3];
    X.fillRect(5, 2, 3, 3);
    X.restore();
  }
  function drawHero() {
    X.save();
    const c = palette();
    X.translate(Math.round(P.x + P.w / 2), Math.round(P.y + P.h / 2));
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
    X.fillStyle = c[1];
    X.fillRect(90, 395, 120, 145);
    X.fillRect(735, 350, 150, 190);
    X.fillStyle = c[2];
    X.fillRect(786, 68, 28, 28);
    if (state !== "menu" && R) {
      const l = L[Math.min(li, L.length - 1)];
      R.solid.forEach((r) => platform(r));
      R.crumb.forEach((c) => {
        if (c.fall < 180) platform({ ...c, y: c.y + c.fall }, true);
      });
      R.haz.forEach(hazard);
      gate(R.exit[0], R.exit[1], 0);
      if (R.fake) gate(R.fake[0], R.fake[1], 1);
      if (l.tide) {
        X.fillStyle = c[2];
        X.fillRect(0, R.tide, W, H - R.tide);
        X.strokeStyle = c[3];
        X.lineWidth = 2;
        X.beginPath();
        for (let x = 0; x <= W; x += 12)
          X.lineTo(x, R.tide + Math.sin(x * 0.05 + clock * 5) * 4);
        X.stroke();
      }
      if (P && state !== "dead") drawHero();
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
    const dt = Math.min(0.025, (t - last) / 1000 || 0);
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
    $("#soundBtn").textContent = muted ? "×" : "♪";
  }
  if ($("#startBtn")) $("#startBtn").onclick = start;
  if ($("#levelsBtn")) $("#levelsBtn").onclick = openLevels;
  $("#mapBtn").onclick = openLevels;
  $("#closeLevelsBtn").onclick = () => {
    $("#levelScreen").classList.add("hidden");
    state = levelReturnState;
  };
  $("#againBtn").onclick = start;
  $("#restartBtn").onclick = () => {
    if (state !== "menu") reset(false);
  };
  $("#soundBtn").onclick = toggle;
  start();
  requestAnimationFrame(loop);
})();
