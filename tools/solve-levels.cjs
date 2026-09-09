// Offline reachability search using exactly the gameplay simulation.
const fs=require('node:fs');
const {levels}=require('../levels.js');
const {World}=require('../world.js');
function clone(w) {
  const n=Object.create(World.prototype);Object.assign(n,w);
  n.p={...w.p};n.solid=w.solid.map(x=>({...x}));n.haz=w.haz.map(x=>({...x}));
  n.motions=w.motions.map(x=>({...x}));n.portals=w.portals.map(x=>({...x}));n.buttons=w.buttons.map(x=>({...x}));
  n.signals={...w.signals};n.events=[];n.exit=[...w.exit];n.teleport=w.teleport?{...w.teleport}:null;
  return n;
}
function target(w,g) {
  if(typeof g?.[0]==='string') {
    const [type,id]=g[0].split(':');
    if(type==='button'){const b=w.buttons.find(b=>b.id===id);return [b.x+10,b.y];}
    if(type==='motion'||type==='done'){const b=w.object(id);return [b.x+b.w/2,b.y-18];}
    const p=w.portals.find(p=>p.id===id);return [p.x,p.y-18];
  }
  return g || [w.exit[0]+20,w.exit[1]+50];
}
function solve(id,width=260,limit=500) {
  const level=levels[id-1], route=level.guide||[];
  let beam=[{w:new World(level),stage:0,path:null}], visited=new Map();
  const keys=[1,5,0,4,2,6];let highest=0, best=null;
  for(let depth=0;depth<limit;depth++) {
    const next=[];
    for(const n of beam)for(const mask of keys) {
      const w=clone(n.w);const input={right:!!(mask&1),left:!!(mask&2),jump:!!(mask&4)};
      for(let t=0;t<8;t++)w.tick(input);
      if(w.status==='dead')continue;
      const path={mask,prev:n.path};
      if(w.status==='won') {
        const a=[];for(let p=path;p;p=p.prev)a.push(p.mask);a.reverse();
        const out=[];for(const m of a){if(out.at(-1)?.[0]===m)out.at(-1)[1]+=8;else out.push([m,8]);}
        return {actions:out,seconds:(depth+1)*8/120};
      }
      let stage=n.stage,g=route[stage];
      if(g && (typeof g[0]==='string'?w.signals[g[0]]!==undefined:Math.abs(w.p.x+12-g[0])<34&&Math.abs(w.p.y-g[1])<42))stage++;
      const [tx,ty]=target(w,route[stage]);
      const distance=Math.abs(w.p.x+12-tx)+Math.abs(w.p.y-ty)*1.3;
      const stamp=[stage,Math.round(w.p.x/5),Math.round(w.p.y/5),Math.round(w.p.vx/65),Math.round(w.p.vy/60),w.p.held?1:0,
        Object.keys(w.signals).join(','),w.teleport?.to||'',w.teleport?Math.floor(w.teleport.t*20):0,
        w.motions.map(m=>m.done?'d':Math.floor(m.t*4)).join(','),w.haz.map(h=>h.started===null?'n':Math.min(12,Math.floor((w.time-h.started)*8))).join(',')].join('|');
      if(visited.has(stamp)&&visited.get(stamp)<=depth)continue;visited.set(stamp,depth);
      next.push({w,stage,path,score:stage*4000-distance});highest=Math.max(highest,stage);
    }
    next.sort((a,b)=>b.score-a.score);if(next[0] && (!best || next[0].score > best.score)) best=next[0];beam=next.slice(0,width);
    if(!beam.length)break;
  }
  if(best && process.env.DEBUG_LEVELS)fs.writeFileSync(__dirname+"/failure-"+id+".json",JSON.stringify({p:best.w.p,stage:best.stage,signals:best.w.signals,motions:best.w.motions,solid:best.w.solid}));
  return {failed:true,stage:highest,total:route.length};
}
let replays=fs.existsSync(__dirname+'/replays.json')?JSON.parse(fs.readFileSync(__dirname+'/replays.json')):{};
const ids=process.argv[2]?process.argv[2].split(',').map(Number):levels.map(l=>l.number);
for(const id of ids) {
 const result=solve(id,Number(process.env.BEAM)||260,Number(process.env.DEPTH)||500);
 if(result.actions){replays[id]=result.actions;fs.writeFileSync(__dirname+'/replays.json',JSON.stringify(replays));console.log(id,'WIN',result.seconds.toFixed(1)+'s');}
 else {console.log(id,'FAIL',JSON.stringify(result));process.exitCode=1;}
}
