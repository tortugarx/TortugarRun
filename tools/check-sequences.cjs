// Audit the entire room mechanism timeline, independently of a winning path.
const assert=require('node:assert/strict');
const {levels}=require('../levels');
const {World,hit}=require('../world');
const near=(a,b)=>Math.abs(a-b)<1e-6;
// These are reviewed root/docking intersections: moving stone starts hidden in
// its parent wall or floor. Any new pair is a visible authoring regression.
const allowedIntersections=new Set([
  '27:leftjaw>s2','27:leftjaw>s6','27:rightjaw>s2','27:rightjaw>s7','27:rightjaw>s11',
  '12:leftpiston>s3','12:rightpiston>s4',
  '19:gate>s7',
  '31:leftwall>s3','31:rightwall>s4','33:lowerwall>s5',
  '44:gate>s2','44:gate>s3','45:lift>s3'
]);
function attached(w,h){
  const boxes=h.attach?[w.object(h.attach)]:w.solid;
  return boxes.some(b=>{
    if(h.dir==='down')return near(b.y+b.h,h.y)&&b.x<=h.x+1e-6&&b.x+b.w>=h.x+h.w-1e-6;
    if(h.dir==='right')return near(b.x+b.w,h.x)&&b.y<=h.y+1e-6&&b.y+b.h>=h.y+h.w-1e-6;
    if(h.dir==='left')return near(b.x,h.x)&&b.y<=h.y+1e-6&&b.y+b.h>=h.y+h.w-1e-6;
    return near(b.y,h.y)&&b.x<=h.x+1e-6&&b.x+b.w>=h.x+h.w-1e-6;
  });
}
function inspect(w,label){
  const touches=(a,b)=>a.x<=b.x+b.w&&a.x+a.w>=b.x&&a.y<=b.y+b.h&&a.y+a.h>=b.y;
  const anchored=new Set(w.solid.filter(b=>b.y<=0||b.y+b.h>=540||b.x<=0||b.x+b.w>=960||w.motions.some(m=>m.id===b.id)||(w.level.functionalFloatIds||[]).includes(b.id)));
  for(let changed=true;changed;){changed=false;for(const b of w.solid)if(!anchored.has(b)&&[...anchored].some(a=>touches(a,b))){anchored.add(b);changed=true;}}
  assert.equal(anchored.size,w.solid.length,`${label}: disconnected stone`);
  for(const h of w.haz)assert(attached(w,h),`${label}: detached spike ${h.id}`);
  const items=[w.exitBox(),...w.portals.map(p=>w.portalBox(p)),...w.buttons.map(b=>({...b,h:8}))];
  for(const [i,a] of items.entries()){
    const inner={x:a.x+.001,y:a.y+.001,w:a.w-.002,h:a.h-.002};
    assert(!w.solid.some(b=>hit(inner,b)),`${label}: item ${i} intersects terrain`);
    for(const b of items.slice(i+1))assert(!hit({...a,x:a.x-16,y:a.y-8,w:a.w+32,h:a.h+16},b),`${label}: crowded items`);
  }
  for(const button of w.buttons)for(const h of w.haz)if(h.progress>.01)assert(!hit({...button,h:8},w.spikeBox(h)),`${label}: button/spike overlap`);
  if(w.level.number===50)for(const item of items)for(const h of w.haz)if(h.progress>.01)
    assert(!hit(item,w.spikeBox(h)),`${label}: finale item/spike overlap`);
}
for(const l of levels){
  assert(l.spikes.length<=(l.number===50?12:l.number===10?4:3)&&l.motions.length<=5,`room ${l.number}: overload`);
  for(const order of ['together','staggered']){
    const w=new World(l);
    const overlaps=new Map();
    // Isolate authored world motion from player obstruction or terminal state.
    w.p.x=-1000;w.p.y=-1000;w.moveActor=()=>{};w.locked=true;
    w.condition=function(c){if(!c)return true;if(c.signal)return this.signals[c.signal]!==undefined;if(c.stand)return this.time>.2;return this.time>.1;};
    for(let t=0;t<1800;t++){
      w.status='playing';
      for(const [i,b] of w.buttons.entries())if(t>(order==='together'?10:10+i*90))w.signal(`button:${b.id}`);
      for(const [i,p] of w.portals.entries())if(t>(order==='together'?10:80+i*120))w.signal(`arrival:${p.id}`);
      w.tick({});inspect(w,`${l.number}/${order}/${t}`);
      for(const motion of w.motions){
        const moving=w.object(motion.id);
        for(const fixed of w.solid)if(fixed!==moving&&moving.x<fixed.x+fixed.w-.01&&moving.x+moving.w>fixed.x+.01&&moving.y<fixed.y+fixed.h-.01&&moving.y+moving.h>fixed.y+.01){
          const key=`${motion.id}>${fixed.id}`,span=overlaps.get(key)||{first:t,last:t};span.last=t;overlaps.set(key,span);
        }
      }
    }
    for(const [pair] of overlaps)assert(allowedIntersections.has(`${l.number}:${pair}`),`${l.number}: unreviewed moving-part/terrain overlap (${pair})`);
    for(const motion of w.motions){
      assert(motion.done||motion.loop,`${l.number}: incomplete ${motion.id}`);
      if(motion.loop)continue;
      const b=w.object(motion.id),last=motion.path.at(-1);
      assert(near(b.x,b.originX+last[0])&&near(b.y,b.originY+last[1]),`${l.number}: wrong endpoint`);
    }
  }
}
console.log('50 rooms: full 15-second simultaneous/staggered timelines, grounded geometry, attachments, item spacing and exact motion endpoints.');
