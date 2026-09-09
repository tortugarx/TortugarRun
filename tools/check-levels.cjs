const { levels } = require('../levels.js');
const { World, STEP, hit } = require('../world.js');
const assert = require('node:assert/strict');
const touches=(a,b)=>a.x<=b.x+b.w&&a.x+a.w>=b.x&&a.y<=b.y+b.h&&a.y+a.h>=b.y;
function supported(level,h,x,y) {
  return level.blocks.some(b=>{
    const dir=h.dir||'up';
    if(dir==='up') return b[1]===y&&b[0]<=x&&b[0]+b[2]>=x+h.w;
    if(dir==='down') return b[1]+b[3]===y&&b[0]<=x&&b[0]+b[2]>=x+h.w;
    if(dir==='right') return b[0]+b[2]===x&&b[1]<=y&&b[1]+b[3]>=y+h.w;
    return b[0]===x&&b[1]<=y&&b[1]+b[3]>=y+h.w;
  });
}
for (const [i,l] of levels.entries()) {
  assert.equal(l.number,i+1);
  assert.equal(l.group,i<14?0:i<29?1:i<39?2:3);
  assert(l.identity?.silhouette&&l.identity?.direction&&l.identity?.trigger&&l.identity?.door,`missing identity matrix row: ${i+1}`);
  if(i<14) assert.equal(l.motions.length,0);
  if(i<29) assert.equal(l.portals.length,0);
  if(i<39) assert.equal(l.buttons.length,0);
  const world=new World(l);
  assert(!world.solid.some(b=>hit(world.p,b)),`spawn intersects map: ${i+1}`);
  for(const [name,r] of [['door',world.exitBox()],...world.portals.map(p=>[p.id,world.portalBox(p)]),...world.buttons.map(b=>[b.id,{...b,h:8}])]) {
    assert(!world.solid.some(b=>hit(r,b)),`visible ${name} intersects stone: ${i+1}`);
  }
  for(const b of world.buttons) for(const h of world.haz) {
    assert(!(h.progress&&hit({...b,h:8},world.spikeBox(h))),`button overlaps visible spike: ${i+1}`);
  }
  for(const p of l.portals) {
    assert(Number.isFinite(p.targetX)&&Number.isFinite(p.targetY),`missing free portal target ${i+1}`);
    const body={x:p.x-12,y:p.y-18,w:24,h:18};
    assert(!world.solid.some(b=>hit(body,b)),`portal in stone: ${i+1} ${p.id}`);
    const target={x:p.targetX-12,y:p.targetY-18,w:24,h:18};
    assert(!world.solid.some(b=>hit(target,b)),`portal target in stone: ${i+1} ${p.id}`);
    assert(!l.portals.some(q=>q!==p&&Math.abs(q.x-p.targetX)<24&&Math.abs(q.y-p.targetY)<24),`visible portal at target ${i+1} ${p.id}`);
  }
  for(const m of l.motions) assert(world.object(m.id),`missing map part ${i+1}`);
  const anchored=new Set(world.solid.filter(b=>b.x<=32||b.x+b.w>=928||b.y<=104||b.y+b.h>=540||l.motions.some(m=>m.id===b.id)||(l.functionalFloatIds||[]).includes(b.id)));
  for(let changed=true;changed;) { changed=false; for(const b of world.solid) if(!anchored.has(b)&&[...anchored].some(a=>touches(a,b))) { anchored.add(b);changed=true; } }
  assert.equal(anchored.size,world.solid.length,`detached static terrain: ${i+1}`);
  for(const [j,h] of l.spikes.entries()) {
    if(h.attach) {
      const carrier=l.blocks.find(b=>b[4]===h.attach);
      assert(carrier,`missing spike carrier: ${i+1}.${j}`);
      assert(supported({blocks:[carrier]},h,h.x,h.y),`spike detached from carrier: ${i+1}.${j}`);
    } else {
      const points=[[h.x,h.y],...(h.path||[]).map(p=>[h.x+p[0],h.y+p[1]])];
      assert(points.every(([x,y])=>supported(l,h,x,y)),`unsupported spike path: ${i+1}.${j}`);
    }
  }
  const animation=new World(l); animation.p.x=-1000; animation.p.y=-1000; animation.moveActor=()=>{};
  animation.haz=[]; animation.portals=[]; animation.buttons=[]; animation.locked=true;
  for(const m of animation.motions) { m.when=null; m.delay=0; }
  for(let t=0;t<2400;t++) animation.tick({});
  for(const m of animation.motions) assert(m.done||m.loop,`unfinished map animation: ${i+1} ${m.id}`);
  const other=new World(l);
  for(let t=0;t<900;t++) {
    const input={right:t%180<120,left:t%180>=150,jump:t%75<24};
    world.tick(input);other.tick(input);
  }
  assert.deepEqual(world,other,`nondeterministic ${i+1}`);
}
assert.equal(new Set(levels.map(l=>l.identity.silhouette)).size,50,'duplicate silhouette');
assert.equal(new Set(levels.map(l=>Object.values(l.identity).join('|'))).size,50,'duplicate identity combination');
// Identity labels are not enough: the authored terrain itself must produce 50
// different coarse silhouettes when rendered as black masses.
const terrainSignature=l=>{
  const blocks=l.blocks.slice(3);let out='';
  for(let y=100;y<540;y+=40)for(let x=32;x<928;x+=40)
    out+=blocks.some(b=>x<b[0]+b[2]&&x+40>b[0]&&y<b[1]+b[3]&&y+40>b[1])?'1':'0';
  return out;
};
assert.equal(new Set(levels.map(terrainSignature)).size,50,'duplicate rendered terrain silhouette');
const detailedSignature=l=>{
  const blocks=l.blocks.slice(3);let out='';
  for(let y=100;y<540;y+=30)for(let x=32;x<928;x+=30)
    out+=blocks.some(b=>x<b[0]+b[2]&&x+30>b[0]&&y<b[1]+b[3]&&y+30>b[1])?'1':'0';
  return out;
};
const detailed=levels.map(detailedSignature);
for(let i=0;i<detailed.length;i++)for(let j=i+1;j<detailed.length;j++){
  let distance=0;for(let p=0;p<detailed[i].length;p++)distance+=detailed[i][p]!==detailed[j][p];
  assert(distance>=15,`terrain silhouettes too similar: ${i+1}/${j+1} (${distance})`);
}
for(const l of levels)for(const hazard of l.spikes)if(hazard.when&&!hazard.initial){
  assert(hazard.delay<=.02,`early hidden hazard: ${l.number}`);
  assert(hazard.speed>=5.55&&hazard.speed<=8.34,`hidden hazard outside 120-180ms: ${l.number}`);
  if(hazard.when.zone&&((hazard.dir||'up')==='up'||hazard.dir==='down')){
    const q=hazard.when.zone;
    const edgeGap=Math.min(Math.abs(q[0]+q[2]-hazard.x),Math.abs(q[0]-(hazard.x+hazard.w)));
    assert(edgeGap<=10,`hazard trigger is not last-moment: ${l.number}`);
  }
}
console.log(`Checked ${levels.length} rooms: categories, spawns, portal destinations, deterministic replay.`);
if(require('node:fs').existsSync(__dirname+'/replays.json')) {
  const replays=require('./replays.json');
  assert.equal(Object.keys(replays).length,levels.length,'every room needs a winning replay');
  for(const [id,actions] of Object.entries(replays)) {
    const w=new World(levels[Number(id)-1]);
    for(const [mask,ticks] of actions) for(let t=0;t<ticks;t++) {
      w.tick({right:!!(mask&1),left:!!(mask&2),jump:!!(mask&4)});
      if(!w.teleport) assert(!w.solid.some(b=>hit(w.p,b)),`player intersects map on route ${id}`);
      for(const r of [w.exitBox(),...w.portals.map(p=>w.portalBox(p))]) {
        const inner={x:r.x+0.001,y:r.y+0.001,w:r.w-0.002,h:r.h-0.002};
        assert(!w.solid.some(b=>hit(inner,b)),`door or portal intersects moving map on route ${id}`);
      }
    }
    assert.equal(w.status,'won',`winning route ${id}`);
  }
  console.log(`Verified ${Object.keys(replays).length} complete winning replays at ${1/STEP} Hz.`);
}
