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
  if (new URLSearchParams(location.search).get("unlock") === "all") {
    unlocked = 30;
    localStorage.setItem("level-devil-unlocked", "30");
  }
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
  const GROUPS = ["SPIKES", "MOVING WALLS", "PORTALS"];
  const TERRAINS = [
    [
      [0, 400, 430, 140],
      [470, 400, 490, 140],
    ],
    [
      [0, 400, 250, 140],
      [305, 400, 275, 140],
      [635, 400, 325, 140],
    ],
    [
      [0, 400, 195, 140],
      [245, 380, 190, 160],
      [490, 400, 180, 140],
      [725, 375, 235, 165],
    ],
    [
      [0, 400, 960, 140],
      [250, 105, 30, 245],
      [505, 90, 30, 260],
      [760, 120, 30, 230],
    ],
    [
      [0, 400, 175, 140],
      [225, 385, 160, 155],
      [435, 365, 150, 175],
      [635, 385, 155, 155],
      [840, 400, 120, 140],
    ],
    [
      [0, 400, 275, 140],
      [335, 400, 275, 140],
      [670, 400, 290, 140],
      [300, 285, 340, 18],
    ],
    [
      [0, 360, 180, 180],
      [230, 375, 175, 165],
      [455, 390, 170, 150],
      [675, 400, 285, 140],
    ],
    [
      [0, 400, 215, 140],
      [265, 390, 180, 150],
      [495, 375, 180, 165],
      [725, 360, 235, 180],
    ],
    [
      [0, 400, 235, 140],
      [290, 400, 165, 140],
      [510, 385, 170, 155],
      [735, 400, 225, 140],
      [330, 285, 310, 18],
    ],
    [
      [0, 385, 160, 155],
      [210, 400, 190, 140],
      [455, 370, 175, 170],
      [685, 395, 120, 145],
      [855, 365, 105, 175],
    ],
  ];
  function makeLevel(group, number) {
    const solid = TERRAINS[number - 1].map((p) => [...p]);
    const walkable = solid
      .filter((p) => p[1] >= 340)
      .sort((a, b) => a[0] - b[0]);
    const gaps = walkable
      .slice(0, -1)
      .map((p, i) => ({ start: p[0] + p[2], end: walkable[i + 1][0] }))
      .filter((g) => g.end - g.start > 12);
    if (group === 1) {
      const gap = gaps[0] || { start: 430, end: 470 };
      solid.push([
        gap.start - 8,
        365,
        Math.max(55, gap.end - gap.start + 16),
        16,
        {
          axis: number % 2 ? "x" : "y",
          range: 18 + number,
          speed: 0.8 + number * 0.04,
          trigger: Math.max(80, gap.start - 120),
        },
      ]);
    }
    const safeRanges = walkable.filter((p) => p[2] > 80);
    const haz = [];
    const count = 1 + Math.ceil(number / 4) + (group > 0 ? 1 : 0);
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
        floor[1] - 20,
        36,
        20,
        i % 3 === 1 ? "hidden" : "near",
        x - (i % 3 === 0 ? 30 : 48),
      ]);
    }
    const crumb =
      group === 0 && number >= 6
        ? [[walkable[1][0] + 25, walkable[1][1] - 18, 72, 16, 0.5]]
        : [];
    if (crumb.length)
      solid.push([crumb[0][0], crumb[0][1], crumb[0][2], crumb[0][3]]);
    const walls = [];
    if (group === 1) {
      const gap = gaps[0] || { start: 430, end: 470 };
      walls.push([
        Math.max(80, gap.start - 90),
        walkable[0][1] - 70,
        18,
        70,
        Math.max(45, gap.start - 130),
        gap.end - gap.start + 75,
      ]);
      if (number > 5 && gaps[1])
        walls.push([
          gaps[1].start - 85,
          walkable[1][1] - 70,
          18,
          70,
          gaps[1].start - 125,
          gaps[1].end - gaps[1].start + 70,
        ]);
    }
    if (group === 2) walls.push([520, 330, 20, 70, Infinity, 0, "gate"]);
    const portals =
      group === 2
        ? [
            [
              walkable[0][0] + walkable[0][2] - 55,
              walkable[0][1] - 40,
              walkable.at(-1)[0] + 45,
              walkable.at(-1)[1] - 40,
            ],
          ]
        : [];
    const buttons =
      group === 2
        ? [
            [
              walkable[Math.min(1, walkable.length - 1)][0] + 35,
              walkable[Math.min(1, walkable.length - 1)][1] - 10,
              30,
              10,
              number % 2 ? "size" : "gate",
            ],
          ]
        : [];
    return {
      group,
      number,
      name: `${GROUPS[group]} ${String(number).padStart(2, "0")}`,
      hint:
        group === 0
          ? "Watch the floor."
          : group === 1
            ? "Walls push. They do not kill."
            : "Portals and buttons change the room.",
      spawn: [28, walkable[0][1] - 38],
      exit: [
        walkable.at(-1)[0] + walkable.at(-1)[2] - 60,
        walkable.at(-1)[1] - 65,
      ],
      solid,
      haz,
      crumb,
      walls,
      portals,
      buttons,
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
      walls: l.walls.map((v) => ({
        x: v[0],
        y: v[1],
        w: v[2],
        h: v[3],
        trigger: v[4],
        range: v[5],
        kind: v[6] || "push",
        active: v[6] === "gate",
        progress: v[6] === "gate" ? 1 : 0,
        originX: v[0],
        bottom: v[1] + v[3],
        open: false,
        travel: 0,
      })),
      portals: l.portals.map((v) => ({
        ax: v[0],
        ay: v[1],
        bx: v[2],
        by: v[3],
        cooldown: 0,
      })),
      buttons: l.buttons.map((v) => ({
        x: v[0],
        y: v[1],
        w: v[2],
        h: v[3],
        action: v[4],
        pressed: false,
      })),
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
      if (p.y >= 480) p.y = 400;
      else if (p.y >= 430) p.y = 365;
      p.originX = p.x;
      p.originY = p.y;
    });
    P.y = l.spawn[1];
    R.haz.forEach((h, i) => {
      if (carriers[i]) h.y = carriers[i].y - 20;
    });
    R.exit = [...l.exit];
    energy = 100;
    pulse = 0;
    particles = [];
    state = "playing";
    const colors = palette();
    document.documentElement.style.setProperty("--level-light", colors[0]);
    document.documentElement.style.setProperty("--level-mid", colors[2]);
    document.documentElement.style.setProperty("--level-dark", colors[3]);
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
    setTimeout(() => {
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
    setTimeout(() => {
      if (++li === L.length) {
        state = "won";
        $("#finalStats").textContent =
          `${deaths} deaths. Moss beat the false path.`;
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
    if (h.type === "spike") {
      const eased = h.progress * h.progress * (3 - 2 * h.progress);
      return {
        x: h.x + h.w / 2 - 13,
        y: h.y + 20 - 9 * eased,
        w: 26,
        h: 9 * eased,
      };
    }
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
    if (state !== "playing" && state !== "dying") return;
    const alive = state === "playing";
    const l = L[li];
    P.px = P.x;
    P.py = P.y;
    const target = alive ? (K.left ? -220 : 0) + (K.right ? 220 : 0) : 0;
    const acceleration = P.ground ? 1500 : 850;
    const change = Math.max(
      -acceleration * dt,
      Math.min(acceleration * dt, target - P.vx),
    );
    P.vx += change;
    if (P.vx) P.face = Math.sign(P.vx);
    P.coyote = P.ground ? 0.105 : Math.max(0, P.coyote - dt);
    P.buffer = K.jump && !P.held ? 0.11 : Math.max(0, P.buffer - dt);
    if (alive && P.buffer > 0 && P.coyote > 0) {
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
    R.walls.forEach((w) => {
      if (P.x > w.trigger) w.active = true;
      if (w.kind === "gate" && w.open)
        w.progress = Math.max(0, w.progress - dt * 3);
      else if (w.active) w.progress = Math.min(1, w.progress + dt * 3);
      if (w.kind === "push" && w.progress >= 1)
        w.travel = Math.min(w.range, w.travel + dt * 18);
      w.x = w.originX + w.travel;
      const box = {
        x: w.x,
        y: w.bottom - w.h * w.progress,
        w: w.w,
        h: w.h * w.progress,
      };
      if (alive && w.progress > 0.05 && hit(P, box)) {
        if (P.x + P.w / 2 < box.x + box.w / 2) P.x = box.x - P.w;
        else P.x = box.x + box.w;
        if (w.kind === "push") P.vx = Math.max(P.vx, 120);
      }
    });
    R.buttons.forEach((b) => {
      if (!alive || b.pressed || !hit(P, b)) return;
      b.pressed = true;
      if (b.action === "size") {
        const feet = P.y + P.h;
        P.w = 14;
        P.h = 12;
        P.y = feet - P.h;
        toast("SMALL MODE", 1000);
      } else {
        R.walls
          .filter((w) => w.kind === "gate")
          .forEach((w) => (w.open = true));
        toast("WALL OPEN", 1000);
      }
    });
    R.portals.forEach((p) => {
      p.cooldown = Math.max(0, p.cooldown - dt);
      if (!alive || p.cooldown) return;
      const a = { x: p.ax - 9, y: p.ay, w: 18, h: 40 },
        b = { x: p.bx - 9, y: p.by, w: 18, h: 40 };
      if (hit(P, a)) {
        P.x = p.bx + 18;
        P.y = p.by + 40 - P.h;
        p.cooldown = 0.7;
      } else if (hit(P, b)) {
        P.x = p.ax + 18;
        P.y = p.ay + 40 - P.h;
        p.cooldown = 0.7;
      }
    });
    R.haz.forEach((h) => {
      if ((h.mode === "near" || h.mode === "hidden") && P.x > h.trigger)
        h.active = true;
      if (h.active) h.progress = Math.min(1, h.progress + dt * 5.5);
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
      toast("Wrong door.", 1200);
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
      X.globalAlpha = h.active ? 1 : Math.max(0.3, pulse);
      X.fillStyle = c[3];
      const shown = h.active ? h.progress : pulse > 0 ? 1 : 0;
      const eased = shown * shown * (3 - 2 * shown);
      const raised = Math.round(9 * eased),
        center = Math.round(h.x + h.w / 2);
      for (let spike = -1; spike <= 1; spike++) {
        const cx = center + spike * 9;
        for (let row = 0; row < raised; row += 3) {
          const width = Math.min(8, 2 + row * 0.7);
          X.fillRect(
            Math.round(cx - width / 2),
            h.y + 20 - raised + row,
            Math.round(width),
            Math.min(3, raised - row),
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
  function drawWall(w) {
    const c = palette(),
      h = w.h * w.progress,
      y = w.bottom - h;
    X.fillStyle = c[3];
    X.fillRect(Math.round(w.x), Math.round(y), w.w, Math.round(h));
    X.fillStyle = c[2];
    X.fillRect(Math.round(w.x), Math.round(y), w.w, 2);
  }
  function drawPortal(p) {
    const c = palette();
    for (const [x, y] of [
      [p.ax, p.ay],
      [p.bx, p.by],
    ]) {
      X.fillStyle = c[3];
      X.fillRect(x - 12, y + 8, 24, 32);
      X.fillRect(x - 8, y + 4, 16, 4);
      X.fillRect(x - 4, y, 8, 4);
      X.fillStyle = c[0];
      X.fillRect(x - 7, y + 12, 14, 28);
      X.fillRect(x - 4, y + 8, 8, 4);
      X.fillStyle = c[2];
      X.fillRect(x - 2, y + 20, 4, 4);
    }
  }
  function drawButton(b) {
    const c = palette();
    X.fillStyle = b.pressed ? c[1] : c[2];
    X.fillRect(b.x, b.y + (b.pressed ? 5 : 0), b.w, b.h - (b.pressed ? 5 : 0));
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
    const blockCount = 2 + (li % 5);
    for (let i = 0; i < blockCount; i++) {
      const bw = 38 + ((li * 17 + i * 29) % 105);
      const bh = 55 + ((li * 31 + i * 47) % 170);
      const bx = (li * 83 + i * 197 + 35) % (W - bw);
      X.fillRect(bx, H - bh, bw, bh);
    }
    X.fillStyle = c[2];
    const markSize = 16 + (li % 4) * 7;
    X.fillRect(
      70 + ((li * 137) % 800),
      55 + ((li * 53) % 130),
      markSize,
      markSize,
    );
    if (state !== "menu" && R) {
      const l = L[Math.min(li, L.length - 1)];
      R.solid.forEach((r) => platform(r));
      R.crumb.forEach((c) => {
        if (c.fall < 180) platform({ ...c, y: c.y + c.fall }, true);
      });
      R.haz.forEach(hazard);
      R.walls.forEach(drawWall);
      R.portals.forEach(drawPortal);
      R.buttons.forEach(drawButton);
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
      if (P && state === "playing") drawHero();
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
  $("#soundBtn").onclick = toggle;
  start();
  requestAnimationFrame(loop);
})();
