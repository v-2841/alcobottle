import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1280,height:900}});
await p.addInitScript(()=>localStorage.setItem('alcobottle:age-confirmed','1'));
await p.goto('http://localhost:3000/',{waitUntil:'networkidle'});await p.waitForTimeout(500);
// маркер: переживёт client-nav, обнулится при полной перезагрузке
await p.evaluate(()=>{window.__noReload='kept'; window.scrollTo(0,500);});
const beforeScroll=await p.evaluate(()=>window.scrollY);
// кликнуть инфо-ссылку первой карточки
await p.locator('article a[aria-label^="Информация"]').first().click();
await p.waitForTimeout(700);
const after=await p.evaluate(()=>({
  url:location.pathname,
  marker:window.__noReload||'LOST(full reload)',
  scrollY:Math.round(window.scrollY),
  dialog:!!document.querySelector('[role="dialog"]'),
  cards:document.querySelectorAll('article').length,
  bodyOverflow:getComputedStyle(document.body).overflow,
}));
console.log('beforeScroll',beforeScroll); console.log(JSON.stringify(after,null,2));
await b.close();
