// Regression audit for the concrete player requests accumulated in this chat.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {levels,groups}=require('../levels');
const {PORTAL_DURATION}=require('../world');
const read=name=>fs.readFileSync(require.resolve('../'+name),'utf8');
const html=read('index.html'),game=read('game.js'),style=read('style.css');

assert(!html.includes('focusBtn')&&!html.includes('focusMeter')&&!html.includes('id="toast"'),'sonar or level-name toast returned');
assert(!game.includes('KeyF')&&!game.includes('function focus(')&&!game.includes('toast(L[li]'),'removed reveal mechanic returned');
assert(game.includes('drawTutorial()')&&game.includes('LAUFEN')&&game.includes('SPRINGEN'),'room-one tutorial missing');
assert(game.includes('doorAnim={')&&game.includes('drawDoorSuction()'),'door pixel suction missing');
assert.equal(PORTAL_DURATION,.34,'portal timing changed');
assert(game.includes('landscapeTablet')&&game.includes('return coarse && !landscapeTablet'),'automatic tracking disable missing');
assert(game.includes('Math.floor(r.x)')&&game.includes('stoneEdges(r)'),'seam-safe terrain rendering missing');

assert.equal(groups.length,5,'level menu must have five equal acts');
assert.deepEqual(groups.map((_,group)=>levels.filter(level=>level.group===group).length),[10,10,10,10,10]);
assert(style.includes('grid-template-columns: repeat(5, minmax(48px, 1fr))'),'desktop 5x2 grid missing');
assert(style.includes('.group-tabs { grid-template-columns: repeat(5, 1fr)'),'mobile five-tab layout missing');
assert(levels.every((level,index)=>!index||level.difficulty>levels[index-1].difficulty),'difficulty is not strictly increasing');
for(const level of levels)for(const spike of level.spikes)if(spike.when?.zone)assert.equal(spike.when.column,true,`overhead spike sensor missing in room ${level.number}`);

assert(levels[9].blocks.length>=12&&levels[9].spikes.length===3,'room 10 no longer uses the full C route');
assert(levels[21].motions.length===3,'room 22 lost its three-stage route');
assert(levels[22].motions.every(m=>m.path[1]?.[2]===.85),'room 23 timing tolerance regressed');
assert(levels[36].portals.length===2&&levels[36].spikes.length===3,'room 37 lost its full zigzag');
assert(levels[40].motions.length===3&&levels[40].spikes.length===3,'room 41 became sparse again');
const finale=levels[49];
assert.equal(finale.name,'DER LETZTE AUFSTIEG');
assert.equal(finale.targetMinutes,7);assert.equal(finale.spikes.length,12);
assert.equal(finale.motions.length,2);assert.equal(finale.portals.length,2);assert.equal(finale.requiredButtons.length,4);

const nixpacks=read('nixpacks.toml'),server=read('tools/serve.cjs');
assert(nixpacks.includes('nodejs_22')&&nixpacks.includes('node tools/serve.cjs'),'Nixpacks start configuration missing');
assert(server.includes('process.env.PORT')&&server.includes("'0.0.0.0'"),'host port binding missing');
console.log('Verified all chat requirements: UI, tutorial, tracking, seams, spike sensors, five equal acts, reworked rooms, finale and Nixpacks.');
