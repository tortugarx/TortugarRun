const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");

(async()=>{
  const calls=[],localData=new Map([["level-devil-unlocked","8"],["tortuga-shells","40"]]),cloudData=new Map();
  const storage=map=>({getItem:key=>map.has(key)?map.get(key):null,setItem:(key,value)=>map.set(key,String(value))});
  let adMode="finish",adCallbacks;
  const sdk={
    environment:"local",
    async init(){calls.push("init");},
    data:storage(cloudData),
    game:{
      settings:{muteAudio:false},
      loadingStart(){calls.push("loadingStart");},loadingStop(){calls.push("loadingStop");},
      gameplayStart(){calls.push("gameplayStart");},gameplayStop(){calls.push("gameplayStop");},
      setGameContext(context){calls.push(["context",context]);},clearGameContext(){calls.push("clearContext");},
      reportGameCompletedPercentage(value){calls.push(["progress",value]);},
      addSettingsChangeListener(listener){this.listener=listener;},
    },
    ad:{requestAd(type,callbacks){calls.push(["ad",type]);adCallbacks=callbacks;callbacks.adStarted();adMode==="finish"?callbacks.adFinished():callbacks.adError("no-fill");}},
  };
  const env={console,URLSearchParams,location:{hostname:"localhost",search:""},localStorage:storage(localData),CrazyGames:{SDK:sdk}};
  env.globalThis=env;
  vm.runInNewContext(fs.readFileSync(require.resolve("../crazygames.js"),"utf8"),env);
  await env.TortugaCrazy.ready;
  assert.equal(env.TortugaCrazy.available,true);
  assert.equal(cloudData.get("level-devil-unlocked"),"8","progress migrated to CrazyGames Data");
  assert.equal(cloudData.get("tortuga-shells"),"40","currency migrated to CrazyGames Data");
  env.TortugaCrazy.gameplayStart({level:"8"});env.TortugaCrazy.gameplayStop();env.TortugaCrazy.progress(130);env.TortugaCrazy.loadingDone();
  assert(calls.includes("gameplayStart")&&calls.includes("gameplayStop")&&calls.includes("loadingStop"));
  assert.deepEqual(calls.find(call=>Array.isArray(call)&&call[0]==="progress"),["progress",100]);
  assert.equal((await env.TortugaCrazy.requestAd("rewarded")).finished,true);
  adMode="error";
  assert.equal((await env.TortugaCrazy.requestAd("rewarded")).finished,false,"failed ad must not grant reward");
  sdk.game.settings.muteAudio=true;sdk.game.listener({muteAudio:true});
  assert.equal(env.TortugaCrazy.platformMuted,true,"platform mute setting must override game audio");
  assert(adCallbacks,"ad callbacks registered");
  console.log("Verified CrazyGames SDK init, Data migration, lifecycle, mute setting and success-only ad rewards.");
})().catch(error=>{console.error(error);process.exitCode=1;});
