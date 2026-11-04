import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:3002';
const out = 'scripts/shots';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(BASE, { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);

// Sélectionne le paragraphe du hero pour montrer le surlignage doré
await p.evaluate(() => {
  const el = Array.from(document.querySelectorAll('p')).find((n) =>
    n.textContent?.includes('Chauffeurs privés en Mercedes-Benz'),
  );
  if (el) {
    const r = document.createRange();
    r.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
  }
});
await p.waitForTimeout(300);
await p.screenshot({ path: `${out}/H-selection-magic.png` });

// Flotte (vérifie next/image)
await p.evaluate(() => (window.getSelection()?.removeAllRanges()));
await p.locator('#flotte').scrollIntoViewIfNeeded();
await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}/I-fleet-nextimage.png` });

await b.close();
console.log('magic ok');
