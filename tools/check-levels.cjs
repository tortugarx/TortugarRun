const { levels } = require('../levels.js');
const { World, STEP, hit } = require('../world.js');
const assert = require('node:assert/strict');
for (const [i,l] of levels.entries()) {
  assert.equal(l.number,i+1);
  assert.equal(l.group,i<14?0:i<29?1:i<39?2:3);
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
    assert(l.portals.some(q=>q.id===p.to),`missing destination ${i+1}`);
    const body={x:p.x-12,y:p.y-18,w:24,h:18};
    assert(!world.solid.some(b=>hit(body,b)),`portal in stone: ${i+1} ${p.id}`);
  }
  for(const m of l.motions) assert(world.object(m.id),`missing map part ${i+1}`);
  const other=new World(l);
  for(let t=0;t<900;t++) {
    const input={right:t%180<120,left:t%180>=150,jump:t%75<24};
    world.tick(input);other.tick(input);
  }
  assert.deepEqual(world,other,`nondeterministic ${i+1}`);
}
console.log(`Checked ${levels.length} rooms: categories, spawns, portal destinations, deterministic replay.`);
if(require('node:fs').existsSync(__dirname+'/replays.json')) {
  const replays=require('./replays.json');
  assert.equal(Object.keys(replays).length,levels.length,'every room needs a winning replay');
  for(const [id,actions] of Object.entries(replays)) {
    const w=new World(levels[Number(id)-1]);
    for(const [mask,ticks] of actions) for(let t=0;t<ticks;t++) {
      w.tick({right:!!(mask&1),left:!!(mask&2),jump:!!(mask&4)});
      assert(!w.solid.some(b=>hit(w.p,b)),`player intersects map on route ${id}`);
      for(const r of [w.exitBox(),...w.portals.map(p=>w.portalBox(p))]) {
        const inner={x:r.x+0.001,y:r.y+0.001,w:r.w-0.002,h:r.h-0.002};
        assert(!w.solid.some(b=>hit(inner,b)),`door or portal intersects moving map on route ${id}`);
      }
    }
    assert.equal(w.status,'won',`winning route ${id}`);
  }
  console.log(`Verified ${Object.keys(replays).length} complete winning replays at ${1/STEP} Hz.`);
}
