const assert=require('node:assert/strict');
const {levels}=require('../levels');
const replays=require('./replays.json');
let total=0;
for(const level of levels){
  const clear=replays[level.number].reduce((sum,[,ticks])=>sum+ticks,0)/120;
  const expectedDeaths=level.number===1?2:8+level.group*3+level.spikes.length*3+level.motions.length*2+level.portals.length*3+level.buttons.length*2;
  const failedAttempt=Math.min(3,Math.max(1.2,clear*.65));
  const estimate=clear+expectedDeaths*(failedAttempt+.78);
  level.difficultyEstimate={clearSeconds:clear,expectedDeaths,estimateSeconds:estimate};
  total+=estimate;
}
const average=total/levels.length;
assert(average>=45&&average<=75,`expected average outside one-minute target: ${average.toFixed(1)}s`);
assert(levels.slice(29).every(l=>l.difficultyEstimate.expectedDeaths>=20),'late worlds need repeated attempts');
console.log(`Difficulty model: ${average.toFixed(1)}s average including expected retries; portal/button worlds require 20+ expected deaths.`);
