const assert = require('node:assert/strict');
const {World,hit}=require('../world.js');
const base={spawn:[180,420],exit:[900,356],blocks:[[0,420,960,120]],spikes:[],motions:[],portals:[],buttons:[]};
const advance=(w,n,input={})=>{for(let i=0;i<n;i++)w.tick(input);};

// A moving wall is lethal on impact without an authored danger marker.
const push={...base,blocks:[...base.blocks,[120,380,30,40,'wall']],motions:[{id:'wall',path:[[330,0,1.5]]}]};
const impact=new World(push);advance(impact,240);
assert.equal(impact.status,'dead');
assert.equal('dangerous' in impact.motions[0],false);

// A closing wall also kills instead of silently stalling.
const trapped=new World({...push,blocks:[...push.blocks,[260,300,30,120]]});advance(trapped,240);
assert.equal(trapped.status,'dead');

// Docking into static terrain does not truncate a map-part animation.
const docking=new World({...base,spawn:[40,420],blocks:[...base.blocks,[120,380,30,40,'wall'],[300,300,40,120]],motions:[{id:'wall',path:[[190,0,1]]}]});
advance(docking,180);
assert.equal(docking.motions[0].done,true);
assert.equal(docking.object('wall').x,310);

// Feet stay attached to a rising support without requiring a jump.
const lift=new World({...base,spawn:[230,400],blocks:[[200,400,120,24,'lift']],motions:[{id:'lift',when:{stand:'lift'},path:[[0,-100,1]]}]});
advance(lift,150);assert.equal(lift.status,'playing');
assert(Math.abs(lift.p.y+lift.p.h-300)<0.001);

// A portal is one entrance with an invisible, freely positioned target.
const portalLevel={...base,spawn:[100,420],portals:[{id:'A',x:110,y:420,targetX:700,targetY:420}]};
const transport=new World(portalLevel);advance(transport,100);
assert('arrival:A' in transport.signals);
assert(transport.p.x>680);advance(transport,150);assert(!transport.teleport);
const retry=new World(portalLevel);advance(retry,100);
assert.deepEqual(retry.signals,transport.signals);

// Width-only buttons preserve height and set absolute dimensions.
const narrow=new World({...base,spawn:[200,420],buttons:[{id:'thin',x:200,y:412,size:[0.55,1]}]});
advance(narrow,10);assert.equal(narrow.p.w,24*0.55);assert.equal(narrow.p.h,18);
advance(narrow,60);assert.equal(narrow.p.w,24*0.55);
assert.equal(new World(base).p.w,24);

// A button can simultaneously open a door and start a specific map piece.
const coupled=new World({...push,spawn:[180,420],locked:true,buttons:[{id:'go',x:180,y:412,unlock:true}],motions:[{id:'wall',when:{signal:'button:go'},path:[[20,0,1]]}]});
advance(coupled,30);assert.equal(coupled.locked,false);assert(coupled.object('wall').x>120);

// Death wins when spike and goal overlap during the same step.
const finishTrap=new World({...base,spawn:[200,420],exit:[190,356],spikes:[{x:200,y:420,w:27}]});
advance(finishTrap,2);assert.equal(finishTrap.status,'dead');
console.log('Verified lethal moving-wall impacts, safe carrying, directed portals, re-entry lock, resize, coupled buttons and hazard priority.');

// A visible barrier waits for its trigger, retracts, and remains gone on this run.
const disappearing=new World({...base,spikes:[{x:350,y:420,w:45,initial:true,vanish:true,when:{signal:'open'}}]});
advance(disappearing,120);assert.equal(disappearing.haz[0].progress,1);
disappearing.signal('open');advance(disappearing,20);assert.equal(disappearing.haz[0].progress,0);
advance(disappearing,500);assert.equal(disappearing.haz[0].progress,0);
assert.equal(new World(disappearing.level).haz[0].progress,1);

// Moving spikes cross the player's route and stop at a fixed destination.
const chasing=new World({...base,spikes:[{x:340,y:420,w:27,path:[[-170,0,1]]}]});
advance(chasing,150);assert.equal(chasing.status,'dead');
const moving=new World({...base,spawn:[32,420],spikes:[{x:340,y:420,w:27,path:[[100,0,0.5],[-50,0,0.5]]}]});
advance(moving,200);assert.equal(moving.haz[0].x,290);

// Buttons can cause harm as well as open routes, always via hazards, not stone.
const betrayal=new World({...base,buttons:[{id:'trap',x:180,y:412}],spikes:[{x:180,y:420,w:27,when:{signal:'button:trap'},delay:0.1}]});
advance(betrayal,30);assert.equal(betrayal.status,'dead');
const smoothCarry=new World({...base,spawn:[230,400],blocks:[[200,400,120,24,'lift']],motions:[{id:'lift',ease:true,when:{stand:'lift'},path:[[0,-100,0.6]]}],spikes:[{x:285,y:400,w:18,attach:'lift'}]});
advance(smoothCarry,100);assert.equal(smoothCarry.status,'playing');
assert.equal(smoothCarry.haz[0].y,300);assert(Math.abs(smoothCarry.p.y+smoothCarry.p.h-300)<0.001);
console.log('Verified permanent retraction, restart restoration, moving spikes, harmful buttons and smooth carrier attachment.');

// Walking speed is relative to a grounded moving support, not overwritten by
// it. Same-direction motion is faster; counter-walking offsets the carrier.
function ride(input){
  const w=new World({...base,spawn:[400,400],blocks:[[0,400,900,400,'carrier']],motions:[{id:'carrier',path:[[100,0,1]]}]});
  advance(w,45,input);return w;
}
const still=ride({}),against=ride({left:true}),along=ride({right:true});
assert(still.p.x>430);
assert(against.p.x<still.p.x && along.p.x>still.p.x);
assert(Math.abs((along.p.x-still.p.x)-(still.p.x-against.p.x))<.01);
for(const w of [still,against,along])assert(Math.abs(w.p.y+w.p.h-w.object('carrier').y)<.01);
const descending=new World({...base,spawn:[230,300],blocks:[[200,300,120,500,'lift']],motions:[{id:'lift',path:[[0,100,1]]}]});
advance(descending,90);assert(Math.abs(descending.p.y+descending.p.h-descending.object('lift').y)<.01);
console.log('Verified relative walking in both directions and descending lift contact.');

const transitMotion=new World({...base,spawn:[100,420],blocks:[...base.blocks,[500,450,80,250,'lift']],motions:[{id:'lift',path:[[0,-80,2]]}],portals:[{id:'A',x:110,y:420,targetX:800,targetY:420}]});
advance(transitMotion,2);assert(transitMotion.teleport);
const beforeTransit=transitMotion.object('lift').y;
advance(transitMotion,15);assert(transitMotion.teleport);
assert(transitMotion.object('lift').y<beforeTransit,'world animation must continue during teleport');
