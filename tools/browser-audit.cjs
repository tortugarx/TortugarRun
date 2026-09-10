// Run with PLAYWRIGHT_MODULE pointing to an installed playwright package.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1200,height:800}});
  await page.addInitScript(()=>{localStorage.setItem('level-devil-unlocked','50');localStorage.setItem('tortuga-trials-progress','1');});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173');
  assert.equal(await page.locator('#focusBtn, #toast').count(),0,'sonar and level-name toast removed');
  await page.locator('#settingsBtn').click();
  assert.equal(await page.locator('#trackingValue').textContent(),'OFF','desktop tracking reads OFF');
  assert.equal(await page.title(),'Tortuga Trials','game title missing');
  assert.equal(await page.locator('.about').filter({hasText:'VERSION 1.5.1'}).count(),1,'about version missing');
  assert.equal(await page.locator('.about').filter({hasText:'by StoiberRules'}).count(),1,'about credit missing');
  await page.screenshot({path:'/tmp/leveldevil-settings.png'});
  await page.locator('#closeSettingsBtn').click();
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(1300);
  await page.keyboard.up('ArrowRight');
  await page.waitForTimeout(950);
  assert.equal(await page.locator('#deathScreen').isVisible(),true,'death dialog missing');
  assert.match(await page.locator('#deathMessage').textContent(),/^[A-Z0-9 .!?':-]+$/,'death message must be English');
  assert.equal(await page.locator('#deathMessage').evaluate(el=>getComputedStyle(el).fontSize),await page.locator('#deathRestartBtn').evaluate(el=>getComputedStyle(el).fontSize),'death message and buttons need equal font size');
  await page.screenshot({path:'/tmp/leveldevil-death-message.png'});
  await page.locator('#deathRestartBtn').click();
  await page.locator('#mapBtn').click();
  assert.deepEqual(await page.locator('.group-tabs button').allTextContents(),['STACHELN','BEWEGUNG','PORTALE','KNÖPFE','FINALE']);
  for(let group=0;group<5;group++){
    await page.locator('.group-tabs button').nth(group).click();
    assert.equal(await page.locator('#levelGrid > button').count(),10,`act ${group+1} has ten rooms`);
  }
  await page.locator('#closeLevelsBtn').click();
  const images=[];
  for(let id=1;id<=50;id++){
    await page.locator('#mapBtn').click();
    await page.locator('.group-tabs button').nth(Math.floor((id-1)/10)).click();
    const number=String(id).padStart(2,'0');
    await page.locator(`#levelGrid > button[title^="${number} ·"]`).click();
    await page.waitForTimeout(40);
    if(id===1)await page.locator('.game-wrap').screenshot({path:'/tmp/leveldevil-tutorial-desktop.png'});
    if(id===30)await page.locator('#game').screenshot({path:'/tmp/leveldevil-portal.png'});
    if(id===40)await page.locator('#game').screenshot({path:'/tmp/leveldevil-button.png'});
    if(id===50)await page.locator('#game').screenshot({path:'/tmp/leveldevil-finale.png'});
    images.push(await page.locator('#game').evaluate(c=>c.toDataURL()));
  }
  await page.locator('#mapBtn').click();
  await page.locator('.group-tabs button').nth(2).click();
  await page.locator('#levelGrid > button[title^="30 ·"]').click();
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(500);
  await page.locator('#game').screenshot({path:'/tmp/leveldevil-portal-flight.png'});
  await page.keyboard.up('ArrowRight');
  await page.locator('#mapBtn').click();
  await page.screenshot({path:'/tmp/leveldevil-desktop.png'});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'/tmp/leveldevil-mobile.png'});
  await page.setViewportSize({width:1600,height:2400});
  await page.evaluate(images=>{
    document.body.innerHTML='';document.body.style.cssText='margin:0;background:#fff;display:grid;grid-template-columns:repeat(5,320px)';
    images.forEach((src,i)=>{const box=document.createElement('div');box.style.cssText='width:320px;height:230px;color:black;font:16px sans-serif';const img=new Image();img.src=src;img.style.width='320px';box.append(String(i+1).padStart(2,'0'),img);document.body.append(box);});
  },images);
  await page.screenshot({path:'/tmp/leveldevil-all-rooms.png',fullPage:true});
  const mobileContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const mobilePage=await mobileContext.newPage();
  await mobilePage.addInitScript(()=>{localStorage.setItem('level-devil-unlocked','50');localStorage.setItem('tortuga-trials-progress','1');});
  mobilePage.on('pageerror',e=>errors.push(e.message));
  await mobilePage.goto(process.env.BASE_URL||'http://127.0.0.1:4173');
  await mobilePage.waitForTimeout(80);
  assert.equal(await mobilePage.locator('#trackingValue').textContent(),'ON','portrait mobile tracking defaults on');
  await mobilePage.screenshot({path:'/tmp/leveldevil-tutorial-mobile.png'});
  await mobilePage.locator('#settingsBtn').click();
  assert.equal(await mobilePage.locator('.about').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}),true,'mobile about panel clipped');
  await mobilePage.screenshot({path:'/tmp/leveldevil-settings-mobile.png'});
  await mobilePage.locator('#closeSettingsBtn').click();
  const mobileLayout=await mobilePage.evaluate(()=>{
    const wrap=document.querySelector('.game-wrap').getBoundingClientRect();
    const canvas=getComputedStyle(document.querySelector('#game'));
    return {width:wrap.width,height:wrap.height,fit:canvas.objectFit};
  });
  assert.deepEqual(mobileLayout,{width:390,height:758,fit:'cover'});
  for(let id=1;id<=50;id++){
    await mobilePage.locator('#mapBtn').click();
    await mobilePage.locator('.group-tabs button').nth(Math.floor((id-1)/10)).click();
    await mobilePage.locator(`#levelGrid > button[title^="${String(id).padStart(2,'0')} ·"]`).click();
    await mobilePage.waitForTimeout(20);
  }
  await mobilePage.locator('#mapBtn').click();
  await mobilePage.locator('.group-tabs button').nth(3).click();
  await mobilePage.locator('#levelGrid > button[title^="36 ·"]').click();
  await mobilePage.keyboard.down('ArrowRight');
  await mobilePage.waitForTimeout(720);
  await mobilePage.keyboard.up('ArrowRight');
  await mobilePage.waitForTimeout(700);
  await mobilePage.screenshot({path:'/tmp/leveldevil-mobile-gameplay.png'});
  await mobileContext.close();
  const freshContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const freshPage=await freshContext.newPage();
  await freshPage.goto(process.env.BASE_URL||'http://127.0.0.1:4173');
  await freshPage.locator('#mapBtn').click();
  assert.equal(await freshPage.locator('#levelGrid > button[title^="01 ·"]').isDisabled(),false,'room one must start open');
  assert.equal(await freshPage.locator('#levelGrid > button[title^="02 ·"]').isDisabled(),true,'room two must start locked');
  await freshPage.screenshot({path:'/tmp/leveldevil-fresh-locks.png'});
  await freshContext.close();
  await browser.close();
  if(errors.length)throw Error(errors.join('\n'));
  console.log('All 50 rooms rendered in Chromium; 390x844 portrait fills 390x758 above controls without distortion; no page errors.');
})().catch(e=>{console.error(e);process.exitCode=1;});
