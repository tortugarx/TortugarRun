// Run with PLAYWRIGHT_MODULE pointing to an installed playwright package.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1200,height:800}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:4173');
  const images=[];
  for(let id=1;id<=50;id++){
    await page.locator('#mapBtn').click();
    await page.locator('.group-tabs button').nth(id<15?0:id<30?1:id<40?2:3).click();
    const number=String(id).padStart(2,'0');
    await page.locator(`#levelGrid > button[title^="${number} ·"]`).click();
    await page.waitForTimeout(40);
    if(id===30)await page.locator('#game').screenshot({path:'/tmp/leveldevil-portal.png'});
    if(id===40)await page.locator('#game').screenshot({path:'/tmp/leveldevil-button.png'});
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
  const mobilePage=await browser.newPage({viewport:{width:390,height:844}});
  mobilePage.on('pageerror',e=>errors.push(e.message));
  await mobilePage.goto(process.env.BASE_URL||'http://127.0.0.1:4173');
  const mobileLayout=await mobilePage.evaluate(()=>{
    const wrap=document.querySelector('.game-wrap').getBoundingClientRect();
    const canvas=getComputedStyle(document.querySelector('#game'));
    return {width:wrap.width,height:wrap.height,fit:canvas.objectFit};
  });
  assert.deepEqual(mobileLayout,{width:390,height:758,fit:'cover'});
  for(let id=1;id<=50;id++){
    await mobilePage.locator('#mapBtn').click();
    await mobilePage.locator('.group-tabs button').nth(id<15?0:id<30?1:id<40?2:3).click();
    await mobilePage.locator(`#levelGrid > button[title^="${String(id).padStart(2,'0')} ·"]`).click();
    await mobilePage.waitForTimeout(20);
  }
  await mobilePage.locator('#mapBtn').click();
  await mobilePage.locator('.group-tabs button').nth(2).click();
  await mobilePage.locator('#levelGrid > button[title^="36 ·"]').click();
  await mobilePage.keyboard.down('ArrowRight');
  await mobilePage.waitForTimeout(720);
  await mobilePage.keyboard.up('ArrowRight');
  await mobilePage.waitForTimeout(700);
  await mobilePage.screenshot({path:'/tmp/leveldevil-mobile-gameplay.png'});
  await mobilePage.close();
  await browser.close();
  if(errors.length)throw Error(errors.join('\n'));
  console.log('All 50 rooms rendered in Chromium; 390x844 portrait fills 390x758 above controls without distortion; no page errors.');
})().catch(e=>{console.error(e);process.exitCode=1;});
