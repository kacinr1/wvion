import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:3002';
const out = 'scripts/shots';
const b = await chromium.launch();

// Desktop pleine page (rythme vertical)
const d = await b.newPage({ viewport: { width: 1440, height: 900 } });
await d.goto(BASE, { waitUntil: 'networkidle' });
await d.waitForTimeout(1500);
await d.screenshot({ path: `${out}/A-home-full.png`, fullPage: true });

// Mobile
const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await m.goto(BASE, { waitUntil: 'networkidle' });
await m.waitForTimeout(1200);
await m.screenshot({ path: `${out}/B-mobile-hero.png` });
await m.getByRole('button', { name: 'Composer ma mission' }).click();
await m.waitForTimeout(1200);
await m.screenshot({ path: `${out}/C-mobile-config.png` });

// Arabe RTL
const a = await b.newPage({ viewport: { width: 1440, height: 900 } });
await a.goto(`${BASE}/ar`, { waitUntil: 'networkidle' });
await a.waitForTimeout(1200);
await a.screenshot({ path: `${out}/D-ar-rtl.png` });

await b.close();
console.log('captures ok');
