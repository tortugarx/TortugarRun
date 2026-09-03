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
    P,
    R,
    particles = [];
  const L = [
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
        [345, 350, 72, 18],
        [485, 280, 72, 18],
        [625, 215, 72, 18],
        [770, 150, 190, 18],
      ],
      haz: [
        ["spike", 98, 465, 38, 20, "near", 65],
        ["riser", 228, 415, 28, 10, "near", 180],
        ["saw", 315, 312, 16, 58, "vertical"],
        ["riser", 510, 270, 28, 10, "near", 450],
        ["saw", 735, 178, 17, 50, "horizontal"],
        ["spike", 818, 130, 42, 20, "hidden"],
      ],
      crumb: [
        [345, 350, 72, 18, 0.48],
        [625, 215, 72, 18, 0.44],
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
      exit: [882, 67],
      fake: [690, 322],
      solid: [
        [0, 485, 140, 55],
        [195, 425, 72, 18],
        [330, 360, 72, 18],
        [465, 300, 72, 18],
        [610, 360, 120, 18],
        [770, 275, 76, 18],
        [850, 140, 110, 18],
      ],
      haz: [
        ["spike", 92, 465, 38, 20, "hidden"],
        ["riser", 350, 350, 30, 10, "near", 290],
        ["spike", 642, 340, 40, 20, "near", 565],
        ["saw", 735, 235, 18, 62, "vertical"],
        ["spike", 796, 255, 38, 20, "hidden"],
        ["spike", 866, 120, 36, 20, "hidden"],
      ],
      crumb: [
        [195, 425, 72, 18, 0.4],
        [465, 300, 72, 18, 0.4],
        [770, 275, 76, 18, 0.45],
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
      exit: [883, 68],
      tide: true,
      solid: [
        [0, 485, 110, 55],
        [155, 425, 62, 18],
        [265, 345, 62, 18],
        [375, 415, 62, 18],
        [490, 325, 62, 18],
        [605, 240, 62, 18],
        [720, 320, 62, 18],
        [850, 140, 110, 18],
      ],
      haz: [
        ["spike", 64, 465, 38, 20, "near", 48],
        ["saw", 240, 300, 16, 68, "vertical"],
        ["riser", 392, 405, 28, 10, "near", 350],
        ["saw", 570, 282, 18, 72, "horizontal"],
        ["spike", 622, 220, 36, 20, "hidden"],
        ["riser", 740, 310, 25, 10, "near", 690],
        ["spike", 866, 120, 36, 20, "hidden"],
      ],
      crumb: [
        [155, 425, 62, 18, 0.36],
        [265, 345, 62, 18, 0.4],
        [490, 325, 62, 18, 0.34],
        [605, 240, 62, 18, 0.4],
        [720, 320, 62, 18, 0.36],
      ],
    },
  ];
  const hit = (a, b) =>
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  function reset(hint = true) {
    const l = L[li];
    P = {
      x: l.spawn[0],
      y: l.spawn[1],
      w: 36,
      h: 30,
      vx: 0,
      vy: 0,
      ground: 0,
      coyote: 0,
      held: 0,
      face: 1,
      px: 0,
      py: 0,
    };
    R = {
      solid: l.solid.map((v, i) => ({
        x: v[0],
        y: v[1],
        w: v[2],
        h: v[3],
        id: "s" + i,
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
      haz: l.haz.map((v, i) => {
        const active = ["on", "orbit", "vertical", "horizontal"].includes(v[5]);
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
        };
      }),
      tide: H + 60,
      fakeLock: 0,
    };
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
    UI.start.classList.add("hidden");
    UI.win.classList.add("hidden");
    reset();
    beep(260, 0.08, "triangle");
  }
  function die() {
    if (state !== "playing") return;
    state = "dead";
    deaths++;
    UI.deaths.textContent = String(deaths).padStart(2, "0");
    shake = 17;
    burst(P.x + 18, P.y + 15, "#ff765f", 22);
    beep(75, 0.24, "sawtooth");
    setTimeout(() => reset(false), 520);
  }
  function finish() {
    if (state !== "playing") return;
    state = "transition";
    burst(P.x + 18, P.y + 15, "#9dffc3", 30);
    beep(620, 0.12, "sine");
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
        vx: (Math.random() - 0.5) * 280,
        vy: (Math.random() - 0.85) * 250,
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
    if (h.mode === "vertical") y += Math.sin(clock * 2.7 + h.phase) * h.range;
    if (h.mode === "horizontal") x += Math.sin(clock * 2.5 + h.phase) * h.range;
    if (h.mode === "orbit") {
      x += Math.cos(clock * 2.2) * 62;
      y += Math.sin(clock * 2.2) * 42;
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
    P.vx = (K.left ? -245 : 0) + (K.right ? 245 : 0);
    if (P.vx) P.face = Math.sign(P.vx);
    P.coyote = P.ground ? 0.105 : Math.max(0, P.coyote - dt);
    if (K.jump && !P.held && P.coyote > 0) {
      P.vy = -430;
      P.ground = 0;
      P.coyote = 0;
      P.held = 1;
      beep(300, 0.05);
    }
    if (!K.jump) P.held = 0;
    P.vy = Math.min(780, P.vy + 1210 * dt);
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
      l.fake &&
      !R.fakeLock &&
      hit(P, { x: l.fake[0], y: l.fake[1], w: 46, h: 60 })
    ) {
      R.fakeLock = 1;
      R.haz.forEach((h) => (h.active = true));
      toast("Das war nicht der Mond.", 1200);
      P.x -= 28;
      P.vy = -330;
    }
    if (hit(P, { x: l.exit[0], y: l.exit[1], w: 48, h: 70 })) finish();
    pulse = Math.max(0, pulse - dt * 0.74);
    energy = Math.min(100, energy + dt * 7);
    UI.meter.style.width = energy + "%";
  }
  function platform(r, crumb = false) {
    X.fillStyle = crumb ? "#705e42" : "#315c4a";
    X.beginPath();
    X.roundRect(r.x, r.y, r.w, r.h, crumb ? 3 : 8);
    X.fill();
    X.fillStyle = crumb ? "#e1a66a" : "#9cd092";
    X.fillRect(r.x + 5, r.y, r.w - 10, 3);
    X.fillStyle = "rgba(8,30,24,.6)";
    for (let x = r.x + 12; x < r.x + r.w; x += 19)
      X.fillRect(x, r.y + 6, 3, Math.min(9, r.h - 6));
  }
  function hazard(h) {
    X.save();
    const b = hbox(h);
    if (h.type === "spike") {
      X.fillStyle = "#725f58";
      X.fillRect(h.x, h.y + 16, h.w, 4);
      X.fillStyle = "#b08d78";
      for (let q = h.x + 5; q < h.x + h.w - 4; q += 10)
        X.fillRect(q, h.y + 17, 5, 2);
      if (!h.active && h.mode === "hidden" && !pulse) {
        X.restore();
        return;
      }
      X.globalAlpha = h.active ? 1 : Math.max(0.25, pulse);
      X.fillStyle = "#ddd5bc";
      const n = Math.max(1, Math.floor(h.w / 12));
      for (let i = 0; i < n; i++) {
        const base = h.y + 20,
          top = base - 20 * h.progress;
        X.beginPath();
        X.moveTo(h.x + (i * h.w) / n, base);
        X.lineTo(h.x + ((i + 0.5) * h.w) / n, top);
        X.lineTo(h.x + ((i + 1) * h.w) / n, base);
        X.fill();
      }
    } else if (h.type === "riser") {
      X.fillStyle = "#c75a50";
      X.fillRect(b.x, b.y, b.w, b.h);
      X.fillStyle = "#ead39b";
      X.fillRect(b.x, b.y, b.w, 4);
    } else {
      X.translate(b.x + b.w / 2, b.y + b.h / 2);
      X.rotate(clock * 3);
      X.fillStyle = "#d9cfaa";
      for (let i = 0; i < 10; i++) {
        X.rotate(Math.PI / 5);
        X.fillRect(h.w * 0.55, -2, h.w * 0.65, 4);
      }
      X.fillStyle = "#594c49";
      X.beginPath();
      X.arc(0, 0, h.w * 0.68, 0, Math.PI * 2);
      X.fill();
    }
    X.restore();
  }
  function gate(x, y, fake) {
    X.save();
    X.translate(x + 23, y + 34);
    X.shadowBlur = 22;
    X.shadowColor = fake ? "#ff755f" : "#d7ffc8";
    X.strokeStyle = fake ? "#ff755f" : "#edffd4";
    X.lineWidth = 5;
    X.beginPath();
    X.ellipse(0, 0, 18, 32, 0, 0, Math.PI * 2);
    X.stroke();
    X.setLineDash([4, 7]);
    X.rotate(clock * (fake ? -1 : 1));
    X.beginPath();
    X.ellipse(0, 0, 27, 39, 0, 0, Math.PI * 2);
    X.stroke();
    X.restore();
  }
  function drawHero() {
    X.save();
    X.translate(Math.round(P.x + P.w / 2), Math.round(P.y + P.h / 2));
    if (P.face < 0) X.scale(-1, 1);
    const b = P.ground && Math.abs(P.vx) ? Math.round(Math.sin(clock * 16)) : 0;
    X.fillStyle = "#25333a";
    X.fillRect(-14, -9 + b, 22, 17);
    X.fillStyle = "#6f9e65";
    X.fillRect(-11, -12 + b, 18, 5);
    X.fillStyle = "#91bd72";
    X.fillRect(7, -7 + b, 11, 10);
    X.fillRect(-13, 8 + b, 7, 5);
    X.fillRect(5, 8 + b, 7, 5);
    X.fillStyle = "#e8e0a2";
    X.fillRect(15, -4 + b, 2, 2);
    X.fillStyle = "#ca6658";
    X.fillRect(-17, -7 + b, 5, 3);
    X.restore();
  }
  function draw() {
    X.save();
    if (shake) {
      X.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      shake *= 0.82;
    }
    X.imageSmoothingEnabled = false;
    X.fillStyle = "#192b38";
    X.fillRect(0, 0, W, H);
    X.fillStyle = "#223d49";
    for (let x = 24; x < W; x += 112) {
      const h = 80 + ((x * 7) % 140);
      X.fillRect(x, H - h, 68, h);
      X.fillStyle = "#294651";
      for (let y = H - h + 16; y < H; y += 30) X.fillRect(x + 9, y, 7, 11);
      X.fillStyle = "#223d49";
    }
    X.fillStyle = "#eadc9c";
    X.fillRect(785, 58, 38, 38);
    X.fillStyle = "#192b38";
    X.fillRect(773, 48, 38, 38);
    X.fillStyle = "rgba(105,155,143,.16)";
    for (let y = 330; y < H; y += 24) X.fillRect(0, y, W, 2);
    if (state !== "menu" && R) {
      const l = L[Math.min(li, L.length - 1)];
      R.solid.forEach((r) => platform(r));
      R.crumb.forEach((c) => {
        if (c.fall < 180) platform({ ...c, y: c.y + c.fall }, true);
      });
      R.haz.forEach(hazard);
      gate(l.exit[0], l.exit[1], 0);
      if (l.fake) gate(l.fake[0], l.fake[1], 1);
      if (l.tide) {
        const g = X.createLinearGradient(0, R.tide, 0, H);
        g.addColorStop(0, "rgba(255,97,103,.82)");
        g.addColorStop(1, "#3d0c22");
        X.fillStyle = g;
        X.fillRect(0, R.tide, W, H - R.tide);
        X.strokeStyle = "#ffc17f";
        X.lineWidth = 3;
        X.beginPath();
        for (let x = 0; x <= W; x += 12)
          X.lineTo(x, R.tide + Math.sin(x * 0.05 + clock * 5) * 4);
        X.stroke();
      }
      if (P && state !== "dead") drawHero();
      particles.forEach((p) => {
        X.globalAlpha = p.life;
        X.fillStyle = p.color;
        X.beginPath();
        X.arc(p.x, p.y, 3, 0, Math.PI * 2);
        X.fill();
        X.globalAlpha = 1;
      });
      if (pulse) {
        X.strokeStyle = `rgba(150,255,202,${pulse * 0.7})`;
        X.lineWidth = 4;
        X.beginPath();
        X.arc(P.x + 18, P.y + 15, (1 - pulse) * 550, 0, Math.PI * 2);
        X.stroke();
      }
      const v = X.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 570);
      v.addColorStop(0, "transparent");
      v.addColorStop(1, "rgba(0,7,12,.68)");
      X.fillStyle = v;
      X.fillRect(0, 0, W, H);
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
  document.querySelectorAll("[data-key]").forEach((b) => {
    const k = b.dataset.key,
      down = (e) => {
        e.preventDefault();
        k === "focus" ? focus() : (K[k] = 1);
      },
      up = (e) => {
        e.preventDefault();
        if (k !== "focus") K[k] = 0;
      };
    b.addEventListener("pointerdown", down);
    b.addEventListener("pointerup", up);
    b.addEventListener("pointercancel", up);
  });
  function toggle() {
    muted = !muted;
    $("#soundBtn").textContent = muted ? "×" : "♪";
  }
  $("#startBtn").onclick = start;
  $("#againBtn").onclick = start;
  $("#restartBtn").onclick = () => {
    if (state !== "menu") reset(false);
  };
  $("#soundBtn").onclick = toggle;
  requestAnimationFrame(loop);
})();
