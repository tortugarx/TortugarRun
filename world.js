/* Deterministic room simulation shared by the game and replay checks. */
(function (root) {
  "use strict";
  const STEP = 1 / 120;
  const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  const rect = (a) => ({ x: a[0], y: a[1], w: a[2], h: a[3] });
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  class World {
    constructor(level) {
      this.level = level;
      this.time = 0;
      this.status = "playing";
      this.signals = {};
      this.events = [];
      this.p = { x: level.spawn[0], y: level.spawn[1] - 18, w: 24, h: 18, vx: 0, vy: 0, face: 1, ground: false, held: false, coyote: 0, buffer: 0 };
      this.solid = level.blocks.map((b, i) => ({ ...rect(b), id: b[4] || `s${i}`, originX: b[0], originY: b[1] }));
      this.haz = (level.spikes || []).map((s, i) => ({ ...s, baseX: s.baseX ?? s.x, baseY: s.baseY ?? s.y, id: s.id || `h${i}`, type: "spike", active: !!s.initial || !s.when, progress: s.initial || !s.when ? 1 : 0, mode: s.when ? "hidden" : "on", started: null }));
      this.motions = (level.motions || []).map(m => ({ ...m, t: 0, started: false, done: false }));
      this.portals = (level.portals || []).map(p => ({ ...p, originX: p.x, originY: p.y, w: 36, h: 40, blocked: false }));
      this.buttons = (level.buttons || []).map(b => ({ ...b, originX:b.x, originY:b.y, w: b.w || 30, h: 10, pressed: false }));
      this.exit = [...level.exit];
      this.locked = !!level.locked;
      this.teleport = null;
      this.jumpNow = false;
    }
    object(id) { return this.solid.find(s => s.id === id); }
    condition(c) {
      if (!c) return true;
      if (this.teleport && (c.zone || c.stand || c.jump)) return false;
      const p = this.p;
      if (c.zone && !hit(p, rect(c.zone))) return false;
      if (c.jump && !this.jumpNow) return false;
      if (c.stand) {
        const b = this.object(c.stand);
        if (!b || Math.abs(p.y + p.h - b.y) > 1 || p.x + p.w <= b.x || p.x >= b.x + b.w) return false;
      }
      if (c.signal && this.signals[c.signal] === undefined) return false;
      if (c.time !== undefined && this.time < c.time) return false;
      return true;
    }
    spikeBox(h) {
      const depth = 9 * h.progress;
      if (h.dir === "down") return { x: h.x, y: h.y, w: h.w, h: depth };
      if (h.dir === "right") return { x: h.x, y: h.y, w: depth, h: h.w };
      if (h.dir === "left") return { x: h.x - depth, y: h.y, w: depth, h: h.w };
      return { x: h.x, y: h.y - depth, w: h.w, h: depth };
    }
    portalBox(p) { return { x: p.x - 18, y: p.y - 40, w: 36, h: 40 }; }
    emit(type, data = {}) { this.events.push({ type, ...data }); }
    signal(name) { if (this.signals[name] === undefined) this.signals[name] = this.time; }
    moveActor(dx, dy, omit) {
      const p = this.p;
      if (dx) {
        const old = p.x;
        p.x = clamp(p.x + dx, 0, 960 - p.w);
        for (const b of this.solid) {
          if (b === omit || !hit(p, b)) continue;
          if (old + p.w <= b.x + 0.1) p.x = b.x - p.w;
          else if (old >= b.x + b.w - 0.1) p.x = b.x + b.w;
        }
      }
      if (dy) {
        const old = p.y;
        p.y += dy;
        for (const b of this.solid) {
          if (b === omit || !hit(p, b)) continue;
          if (old + p.h <= b.y + 0.1) { p.y = b.y - p.h; p.vy = 0; p.ground = true; }
          else if (old >= b.y + b.h - 0.1) { p.y = b.y + b.h; p.vy = 0; }
        }
      }
    }
    moveBlock(b, x, y) {
      const p = this.p, bx = b.x, by = b.y, px = p.x, py = p.y;
      const dx = x - bx, dy = y - by;
      // During transit the player has no physical body in either room.
      if(this.teleport){b.x=x;b.y=y;return true;}
      const rider = this.supportId === b.id || (Math.abs(p.y + p.h - by) < 1.5 && p.x + p.w > bx && p.x < bx + b.w && p.vy >= 0);
      b.x = x; b.y = y;
      if (rider) this.moveActor(dx, dy, b);
      if (hit(p, b)) {
        if (dx > 0 && px >= bx + b.w - 1) this.moveActor(b.x + b.w - p.x, 0, b);
        else if (dx < 0 && px + p.w <= bx + 1) this.moveActor(b.x - p.w - p.x, 0, b);
        else if (dy < 0 && py + p.h <= by + 1.5) this.moveActor(0, b.y - p.h - p.y, b);
        else if (dy > 0 && py >= by + b.h - 1) this.moveActor(0, b.y + b.h - p.y, b);
      }
      // Motion never waits for the player. Walls keep their authored timeline
      // and shove the turtle toward actual hazards; stone contact itself is safe.
      return true;
    }
    resize(size, anchor = "center") {
      const p = this.p, w = 24 * size[0], h = 18 * size[1];
      let x = anchor === "left" ? p.x : anchor === "right" ? p.x + p.w - w : p.x + (p.w - w) / 2;
      let y = p.y + p.h - h;
      const proposed = { x, y, w, h };
      // Defer expansion inside ordinary stone, rather than kill or teleport.
      if (this.solid.some(b => hit(proposed, b))) return false;
      Object.assign(p, proposed);
      return true;
    }
    tick(keys) {
      if (this.status !== "playing") return;
      const dt = STEP, p = this.p;
      this.events = [];
      // Support displacement is added once, independently of walking velocity.
      const support = p.vy >= 0 ? this.solid.find(b => Math.abs(p.y+p.h-b.y)<1.5 && p.x+p.w>b.x && p.x<b.x+b.w) : null;
      this.supportId = support?.id || null;
      this.time += dt;
      p.coyote = p.ground ? 0.075 : Math.max(0, p.coyote - dt);
      p.buffer = keys.jump && !p.held ? 0.08 : Math.max(0, p.buffer - dt);
      this.jumpNow = !this.teleport && p.buffer > 0 && p.coyote > 0;
      p.held = !!keys.jump;
      if (this.jumpNow) { p.vy = -365; p.ground = false; this.supportId=null; p.coyote = 0; p.buffer = 0; this.emit("jump"); }
      for (const m of this.motions) {
        if (!m.started && this.condition(m.when)) { m.started = true; this.signal(`motion:${m.id}`); }
        if (!m.started || m.done) continue;
        const b = this.object(m.id);
        let t = m.t + dt - (m.delay || 0), prevX = 0, prevY = 0, dx = 0, dy = 0;
        if (t < 0) { m.t += dt; continue; }
        let ended = true;
        for (const frame of m.path) {
          if (t <= frame[2]) {
            const phase = clamp(t / frame[2], 0, 1);
            const mix = m.ease ? phase * phase * (3 - 2 * phase) : phase;
            dx = prevX + (frame[0] - prevX) * mix;
            dy = prevY + (frame[1] - prevY) * mix;
            ended = false; break;
          }
          t -= frame[2]; prevX = dx = frame[0]; prevY = dy = frame[1];
        }
        if (this.moveBlock(b, b.originX + dx, b.originY + dy)) {
          m.t += dt;
          if (ended) { if (m.loop) m.t = m.delay || 0; else { m.done = true; this.signal(`done:${m.id}`); } }
        }
      }
      for (const portal of this.portals) {
        if (!portal.attach) continue;
        const carrier = this.object(portal.attach);
        portal.x = carrier.x + (portal.originX - carrier.originX);
        portal.y = carrier.y + (portal.originY - carrier.originY);
      }
      for (const button of this.buttons) {
        if (!button.attach) continue;
        const carrier = this.object(button.attach);
        button.x = carrier.x + (button.originX - carrier.originX);
        button.y = carrier.y + (button.originY - carrier.originY);
      }
      for (const h of this.haz) {
        if (h.started === null && this.condition(h.when)) h.started = this.time;
        if (h.started !== null) {
          const elapsed = this.time - h.started - (h.delay || 0);
          h.active = h.vanish ? elapsed < 0 : h.retractFor !== undefined ? elapsed >= h.retractFor : elapsed >= 0 && (h.duration === undefined || elapsed < h.duration);
          h.progress = clamp(h.progress + (h.active ? 1 : -1) * dt * (h.speed || 15), 0, 1);
          if (h.path && elapsed >= 0) {
            const length = h.path.reduce((sum, f) => sum + f[2], 0);
            let t = h.loop ? elapsed % length : elapsed, px = 0, py = 0;
            for (const [x, y, duration] of h.path) {
              const phase = clamp(t / duration, 0, 1), mix = phase * phase * (3 - 2 * phase);
              h.x = h.baseX + px + (x - px) * mix;
              h.y = h.baseY + py + (y - py) * mix;
              if (t <= duration) break;
              t -= duration; px = x; py = y;
            }
          }
        }
        if (h.attach) {
          const b = this.object(h.attach);
          h.x = h.baseX + b.x - b.originX; h.y = h.baseY + b.y - b.originY;
        }
      }
      // Mechanisms keep running during the short portal transition.
      if (this.teleport) {
        this.teleport.t = Math.min(1, this.teleport.t + dt / 0.28);
        if(this.level.exitOn){const b=this.object(this.level.exitOn);this.exit=[this.level.exit[0]+b.x-b.originX,this.level.exit[1]+b.y-b.originY];}
        if (this.teleport.t < 1) return;
        const entry = this.portals.find(v => v.id === this.teleport.from);
        p.x = entry.targetX - p.w / 2; p.y = entry.targetY - p.h;
        p.vx = entry.preserveVelocity ? p.vx : entry.targetVx ?? 0;
        p.vy = entry.targetVy ?? 0;
        p.ground = false; p.coyote = 0; p.buffer = 0;
        this.signal(`arrival:${entry.id}`);
        this.teleport = null;
        this.emit('arrival');
        return;
      }
      const target = (keys.right ? 220 : 0) - (keys.left ? 220 : 0);
      p.vx += clamp(target - p.vx, -(p.ground ? 1500 : 850) * dt, (p.ground ? 1500 : 850) * dt);
      if (p.vx) p.face = Math.sign(p.vx);
      if (!keys.jump && p.vy < -120) p.vy += 900 * dt;
      p.vy = Math.min(720, p.vy + 1100 * dt);
      this.moveActor(p.vx * dt, 0);
      p.ground = false;
      this.moveActor(0, p.vy * dt);
      for (const b of this.buttons) {
        if (b.pressed || !hit(p, b)) continue;
        if (b.size && !this.resize(b.size, b.anchor)) continue;
        b.pressed = true; this.signal(`button:${b.id}`);
        if (b.unlock) this.locked = false;
        this.emit("button");
      }
      if (this.level.exitOn) {
        const b = this.object(this.level.exitOn);
        this.exit = [this.level.exit[0] + b.x - b.originX, this.level.exit[1] + b.y - b.originY];
      }
      // Hazards take priority over a simultaneous door contact.
      if (p.y > 585 || this.haz.some(h => h.progress > 0.25 && hit(p, this.spikeBox(h)))) { this.status = "dead"; return; }
      if (!this.locked && hit(p, this.exitBox())) { this.status = "won"; return; }
      for (const portal of this.portals) {
        const inside = hit(p, this.portalBox(portal));
        if (!inside) portal.blocked = false;
        if (!inside || portal.blocked) continue;
        portal.blocked = true;
        this.teleport = { from: portal.id, t: 0 };
        this.emit("teleport"); break;
      }
    }
  }
  World.prototype.exitBox = function () { return { x: this.exit[0] + 11, y: this.exit[1] + 26, w: 24, h: 38 }; };
  const api = { World, STEP, hit };
  if (typeof module !== "undefined") module.exports = api;
  else root.DevilWorld = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
