import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:3002';
const out = 'scripts/shots';
const b = await chromium.launch();

// Mobile : hero avec burger
const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await m.goto(BASE, { waitUntil: 'networkidle' });
await m.waitForTimeout(1200);
await m.screenshot({ path: `${out}/E-mobile-nav.png` });
// Tiroir ouvert
await m.getByRole('button', { name: /Ouvrir le menu/i }).click();
await m.waitForTimeout(300);
await m.screenshot({ path: `${out}/F-mobile-drawer.png` });

// Desktop : étape contact du configurateur
const d = await b.newPage({ viewport: { width: 1440, height: 900 } });
await d.goto(BASE, { waitUntil: 'networkidle' });
await d.getByRole('button', { name: 'Composer ma mission' }).click();
await d.waitForTimeout(1100);
await d.getByRole('button', { name: /Transfert/ }).click();
const cont = d.getByRole('button', { name: /Continuer/ });
await cont.click(); // véhicule
await cont.click(); // options
await cont.click(); // quand
await d.waitForTimeout(500);
await d.screenshot({ path: `${out}/G-config-contact.png` });

await b.close();
console.log('audit2 ok');
