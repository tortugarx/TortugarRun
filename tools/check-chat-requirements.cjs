// Regression audit for the concrete player requests accumulated in this chat.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {levels,groups}=require('../levels');
const {PORTAL_DURATION}=require('../world');
const read=name=>fs.readFileSync(require.resolve('../'+name),'utf8');
const html=read('index.html'),game=read('game.js'),style=read('style.css');

assert(!html.includes('focusBtn')&&!html.includes('focusMeter')&&!html.includes('id="toast"'),'sonar or level-name toast returned');
assert(!game.includes('KeyF')&&!game.includes('function focus(')&&!game.includes('toast(L[li]'),'removed reveal mechanic returned');
assert(game.includes('drawTutorial()')&&html.includes('MOVE')&&html.includes('JUMP')&&html.includes('REACH THE DOOR'),'room-one tutorial missing');
assert(html.includes('id="tutorialCard"')&&style.includes('.tutorial-card')&&style.includes('--game-font: "Courier New"')&&style.includes('font-family: var(--game-font)'),'shared readable pixel font missing');
assert(game.includes('doorAnim={')&&game.includes('drawDoorSuction()'),'door pixel suction missing');
assert(game.includes('size:5')&&game.includes('Math.round(x/5)*5')&&game.includes('pixel.vx*scatter'),'door suction must use a death-style pixel burst');
assert.equal(PORTAL_DURATION,.34,'portal timing changed');
assert(game.includes('defaultTracking()')&&game.includes('trackingOverride')&&game.includes('trackingSetting").disabled = false'),'switchable device-default tracking missing');
assert(game.includes('Math.floor(r.x)')&&game.includes('stoneEdges(r)'),'seam-safe terrain rendering missing');
assert(game.includes('X.fillStyle = c[3]')&&game.includes('X.fillRect(32,96,896,H-96)'),'dark shake overscan missing');

assert.equal(groups.length,5,'level menu must have five equal acts');
assert.deepEqual(groups,['SPIKES','MOVING WALLS','PORTALS','BUTTONS','FINAL TRIALS']);
assert.equal(levels.length,50);assert(levels.every(level=>/^[\x20-\x7E]+$/.test(level.name+level.story)),'all runtime level copy must be English ASCII');
assert.deepEqual(groups.map((_,group)=>levels.filter(level=>level.group===group).length),[10,10,10,10,10]);
assert(style.includes('grid-template-columns: repeat(5, minmax(48px, 1fr))'),'desktop 5x2 grid missing');
assert(style.includes('.group-tabs { grid-template-columns: repeat(5, 1fr)'),'mobile five-tab layout missing');
assert(levels.every((level,index)=>!index||level.difficulty>levels[index-1].difficulty),'difficulty is not strictly increasing');
for(const level of levels)for(const spike of level.spikes)if(spike.when?.zone)assert.equal(spike.when.column,true,`overhead spike sensor missing in room ${level.number}`);

assert(levels[9].blocks.length>=7&&levels[9].spikes.length===4,'room 10 no longer uses its full ascending route');
assert.equal(levels[2].spikes[0].duration,undefined,'room 3 first spike must remain extended');
assert.equal(levels[3].spikes.length,3,'room 4 needs three spikes');
assert(levels[3].spikes[0].when?.zone&&!levels[3].spikes.some(spike=>spike.when?.jump),'room 4 spike must use a position trigger, not jump input');
assert(levels[21].motions.length===3,'room 22 lost its three-stage route');
assert(levels[22].motions.every(m=>m.path[1]?.[2]===.85),'room 23 timing tolerance regressed');
assert(levels[36].portals.length===2&&levels[36].spikes.length===3,'room 37 lost its full zigzag');
assert(levels[40].motions.length===3&&levels[40].spikes.length===3,'room 41 became sparse again');
const finale=levels[49];
assert.equal(finale.name,'THE FINAL ASCENT');
assert.equal(finale.targetMinutes,7);assert.equal(finale.spikes.length,12);
assert.equal(finale.motions.length,2);assert.equal(finale.portals.length,2);assert.equal(finale.requiredButtons.length,4);

const nixpacks=read('nixpacks.toml'),server=read('tools/serve.cjs');
assert(html.includes('<title>Tortuga Trials</title>')&&html.includes('VERSION 1.0')&&html.includes('by StoiberRules')&&!html.includes('NEW:'),'clean version 1.0 about dialog missing');
assert(html.includes('id="aboutSetting"')&&html.includes('id="aboutScreen"')&&game.includes('showSection('),'about dialog or section arrival missing');
assert(style.includes('border-radius: 0'),'buttons must use square pixel corners');
assert(game.includes('tortuga-trials-progress')&&game.includes('localStorage.setItem("level-devil-unlocked","1")'),'level progression migration missing');
assert(html.includes('id="deathMessage"')&&game.includes('world.deathCause')&&game.includes('button-trap'),'cause-specific death messages missing');
assert(game.includes('THE VOID SAYS HI.')&&game.includes('THE BUTTON PRESSED BACK.')&&game.includes('THE CEILING BIT BACK.'),'funny English death-message variants missing');
assert(style.includes('#deathMessage')&&style.includes('font-size: 12px')&&style.includes('text-align: center'),'death message must be larger and centered');
assert(nixpacks.includes('nodejs_22')&&nixpacks.includes('node tools/serve.cjs'),'Nixpacks start configuration missing');
assert(server.includes('process.env.PORT')&&server.includes("'0.0.0.0'"),'host port binding missing');
console.log('Verified all chat requirements: UI, tutorial, tracking, seams, spike sensors, five equal acts, reworked rooms, finale and Nixpacks.');
