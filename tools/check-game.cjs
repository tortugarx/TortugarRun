// Exercise the real game adapter, canvas draw calls and input listeners in a
// minimal DOM. Room physics are separately covered by the winning replays.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function boot(innerWidth=960,innerHeight=540,coarse=innerWidth<=760) {
  const nodes=new Map(),handlers={},timers=new Map(),transforms=[];let raf,time=0,timerId=0;
  const context2d=new Proxy({scale:(x,y)=>transforms.push(['scale',x,y]),translate:(x,y)=>transforms.push(['translate',x,y])}, {get:(o,k)=>k in o?o[k]:(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
  function node() {
    let text='';const classes=new Set(['hidden']);
    return {children:[],style:{setProperty(){}},dataset:{},listeners:{},
      classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)},
      get textContent(){return text;},set textContent(v){text=String(v);this.children=[];},
      appendChild(n){this.children.push(n);},addEventListener(k,f){this.listeners[k]=f;},getContext(){return context2d;}};
  }
  const $=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);};
  const touches=['left','right','jump'].map(key=>Object.assign(node(),{dataset:{key}}));
  const data=new Map([['level-devil-sound','off'],['level-devil-unlocked','50']]);
  const env={console,URLSearchParams,Math,innerWidth,innerHeight,DevilLevels:require('../levels.js'),DevilWorld:require('../world.js'),
    document:{querySelector:$,querySelectorAll:()=>touches,createElement:node,documentElement:node()},
    localStorage:{getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,String(v))},location:{search:''},
    addEventListener:(key,f)=>handlers[key]=f,matchMedia:()=>({matches:coarse}),requestAnimationFrame:f=>raf=f,
    setTimeout:(f,delay)=>{const id=++timerId;timers.set(id,{f,at:time+delay});return id;},clearTimeout:id=>timers.delete(id)};
  env.window=env;vm.runInNewContext(fs.readFileSync(require.resolve('../game.js'),'utf8'),env);
  const frame=()=>{time+=1000/120;raf(time);for(const [id,t]of timers)if(t.at<=time){timers.delete(id);t.f();}};
  const key=(code,down)=>handlers[down?'keydown':'keyup']({code,preventDefault(){}});
  function select(id) {
    $('#mapBtn').onclick();let grid=$('#levelGrid');
    const group=Math.floor((id-1)/10);
    grid.children[0].children[group].onclick();
    grid.children.find(n=>n.innerHTML?.startsWith(id+'<')).onclick();
  }
  return {$,frame,key,select,touches,transforms};
}
const app=boot();
for(const id of [1,6,15,24,30,38,40,43,50]) {
  app.select(id);app.frame();
  assert.equal(app.$('#levelLabel').textContent,String(id).padStart(2,'0')+' / 50');
  app.$('#mapBtn').onclick();
  const current=app.$('#levelGrid').children.find(n=>n.className==='current');
  assert(current?.innerHTML.includes('AKTUELL'),`current room marker ${id}`);
  app.$('#closeLevelsBtn').onclick();
}
// Every recorded route also passes through the production update/draw adapter.
const replays=require('./replays.json');
for(const id of Array.from({length:50},(_,i)=>i+1)) {
  const a=boot();a.frame();a.select(id);
  let previous=0;
  for(const [mask,ticks] of replays[id]) {
    for(const [bit,key]of [[1,'ArrowRight'],[2,'ArrowLeft'],[4,'Space']])if(!!(mask&bit)!==!!(previous&bit))a.key(key,!!(mask&bit));
    previous=mask;for(let t=0;t<ticks;t++)a.frame();
  }
  a.key('ArrowRight',false);a.key('ArrowLeft',false);a.key('Space',false);
  for(let t=0;t<130;t++)a.frame();
  if(id===50)assert(!a.$('#winScreen').classList.contains('hidden'),'final win overlay');
  else assert.equal(a.$('#levelLabel').textContent,String(id+1).padStart(2,'0')+' / 50',`game route ${id}`);
}
// Touch movement reaches the first trap; manual restart cancels the old death
// timer instead of unexpectedly reopening its overlay in the new attempt.
const touch=boot();touch.frame();
touch.touches[1].listeners.touchstart({changedTouches:[{identifier:1}],preventDefault(){}});
for(let t=0;t<430;t++)touch.frame();
assert.equal(touch.$('#deathLabel').textContent,'01');
touch.key('KeyR',true);touch.touches[1].listeners.touchend({changedTouches:[{identifier:1}],preventDefault(){}});
for(let t=0;t<130;t++)touch.frame();
assert(touch.$('#deathScreen').classList.contains('hidden'));
const delayed=boot();delayed.frame();
delayed.touches[1].listeners.touchstart({changedTouches:[{identifier:2}],preventDefault(){}});
for(let t=0;t<500&&delayed.$('#deathLabel').textContent!=='01';t++)delayed.frame();
delayed.touches[1].listeners.touchend({changedTouches:[{identifier:2}],preventDefault(){}});
assert.equal(delayed.$('#deathLabel').textContent,'01');
for(let t=0;t<100;t++)delayed.frame();
assert(delayed.$('#deathScreen').classList.contains('hidden'),'death animation remains unobstructed');
for(let t=0;t<12;t++)delayed.frame();
assert(!delayed.$('#deathScreen').classList.contains('hidden'),'dialog appears after completed animation');
const mobile=boot(390,844);mobile.frame();mobile.select(36);mobile.frame();
assert(mobile.transforms.some(t=>t[0]==='translate'&&t[2]===0),'portrait camera pan');
assert(!mobile.transforms.some(t=>t[0]==='scale'&&t[1]===1.55&&t[2]===1.55),'portrait camera preserves geometry');
mobile.$('#settingsBtn').onclick();
assert.equal(mobile.$('#trackingValue').textContent,'ON');
mobile.$('#trackingSetting').onclick();
assert.equal(mobile.$('#trackingValue').textContent,'OFF');
mobile.transforms.length=0;mobile.frame();
assert(!mobile.transforms.some(t=>t[0]==='translate'&&t[2]===0),'disabled tracking leaves the full room fixed');
const tablet=boot(1024,768,true);tablet.frame();tablet.$('#settingsBtn').onclick();
assert.equal(tablet.$('#trackingSetting').disabled,true);
assert.equal(tablet.$('#trackingValue').textContent,'AUTO OFF');
const desktop=boot(1200,800,false);desktop.frame();desktop.$('#settingsBtn').onclick();
assert.equal(desktop.$('#trackingSetting').disabled,true);
assert.equal(desktop.$('#trackingValue').textContent,'AUTO OFF');
console.log('Verified game rendering adapter, all 50 routes, touch input, restart timers, tracking toggle and automatic desktop/tablet-landscape disablement.');
