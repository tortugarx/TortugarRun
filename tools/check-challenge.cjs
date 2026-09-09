const assert=require('node:assert/strict');
const {levels}=require('../levels');
const {World}=require('../world');
const replays=require('./replays.json');

const input=mask=>({right:!!(mask&1),left:!!(mask&2),jump:!!(mask&4)});
function run(level,actions){
  const world=new World(level),timeline=[];
  for(const [mask,ticks] of actions)for(let tick=0;tick<ticks;tick++){
    const before=new Set(Object.keys(world.signals));
    world.tick(input(mask));
    for(const name of Object.keys(world.signals))if(!before.has(name))timeline.push(name);
    if(world.status!=='playing')return {status:world.status,seconds:world.time,timeline};
  }
  return {status:world.status,seconds:world.time,timeline};
}
const altered=(actions,index,delta)=>actions.map(([mask,ticks],i)=>[mask,i===index?Math.max(1,ticks+delta):ticks]);
const direction=mask=>mask&1?'R':mask&2?'L':'N';
const portalTraces=new Set();
for(const level of levels){
  const actions=replays[level.number],clear=run(level,actions);
  assert.equal(clear.status,'won',`stored route no longer wins level ${level.number}`);
  let trials=0,wins=0;
  for(let i=0;i<actions.length;i+=Math.max(1,Math.floor(actions.length/8)))for(const delta of [-8,-4,4,8]){
    trials++;if(run(level,altered(actions,i,delta)).status==='won')wins++;
  }
  const dirs=actions.map(a=>direction(a[0])).filter(x=>x!=='N');
  const reversals=dirs.slice(1).filter((x,i)=>x!==dirs[i]).length;
  const jumps=actions.filter(a=>a[0]&4).length;
  const tolerance=wins/trials;
  const mechanics=[level.spikes.length&&'spike',level.motions.length&&'motion',level.portals.length&&'portal',level.buttons.length&&'button'].filter(Boolean).join('+')||'terrain';
  if(level.number>=30&&level.number<=39){
    const portalKinds=level.portals.map(p=>p.attach?'moving':p.targetVx!==undefined||p.targetVy!==undefined?'impulse':'fixed').join(',');
    const trace=[portalKinds,clear.timeline.join('>'),level.motions.map(m=>Object.keys(m.when||{})[0]||'start').join(','),reversals].join('|');
    assert(!portalTraces.has(trace),`portal levels repeat the same mechanical sequence: ${level.number}`);
    portalTraces.add(trace);
    if(level.number<39) assert(clear.timeline.some(name=>name.startsWith('motion:')),`portal route skips its moving mechanic: ${level.number}`);
  }
  console.log(`${String(level.number).padStart(2)} - ${clear.seconds.toFixed(1)}s clear  ${jumps} jump inputs  ${reversals} reversals  ${Math.round(tolerance*100)}% timing tolerance  ${mechanics}`);
}
