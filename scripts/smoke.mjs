import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:3001';
const out = 'scripts/shots';

const log = (...a) => console.log('•', ...a);
let failures = 0;
function check(cond, msg) {
  if (cond) log('PASS', msg);
  else {
    failures++;
    console.log('✗ FAIL', msg);
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => {
  failures++;
  console.log('✗ PAGE ERROR', e.message);
});

// --- Accueil ---
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.screenshot({ path: `${out}/01-home.png`, fullPage: false });
check(await page.getByRole('heading', { name: /d.arriver/i }).first().isVisible(), 'Hero visible');

// --- Ouvrir le configurateur ---
await page.getByRole('button', { name: 'Composer ma mission' }).click();
const dialog = page.getByRole('dialog');
await dialog.waitFor({ state: 'visible' });
await page.waitForTimeout(1100); // laisse jouer l'effet télé
await page.screenshot({ path: `${out}/02-config-formule.png` });
check(await dialog.isVisible(), 'Configurateur ouvert (effet télé)');

// Continuer doit être désactivé tant qu'aucune formule
const cont = page.getByRole('button', { name: /Continuer/ });
check(await cont.isDisabled(), 'Continuer désactivé sans formule choisie');

// --- Règle chauffeur : TRANSFERT saute l'étape chauffeur ---
await page.getByRole('button', { name: /Transfert/ }).click();
check(await cont.isEnabled(), 'Continuer activé après choix formule');
await cont.click(); // -> Véhicule
check(await dialog.getByRole('heading', { name: /véhicule/i }).isVisible(), 'Étape Véhicule');
await cont.click(); // -> Options (chauffeur sauté)
const isChauffeur = await dialog.getByRole('heading', { name: /conduit/i }).isVisible().catch(() => false);
check(!isChauffeur, 'Étape Chauffeur SAUTÉE pour un Transfert');
check(await dialog.getByRole('heading', { name: /détails/i }).isVisible(), 'Étape Options atteinte');
await cont.click(); // -> Quand
check(await dialog.getByRole('heading', { name: /où/i }).isVisible(), 'Étape Date & trajet');
// Contact obligatoire : Continuer bloqué tant que nom + téléphone manquent
check(await cont.isDisabled(), 'Continuer bloqué sans contact (nom/téléphone)');
await page.getByPlaceholder('Prénom et nom').fill('Jean Test');
await page.getByPlaceholder(/\+41/).fill('+41790000000');
check(await cont.isEnabled(), 'Continuer débloqué après saisie du contact');
await cont.click(); // -> Récap
check(await dialog.getByRole('heading', { name: /mission/i }).first().isVisible(), 'Étape Récapitulatif');
check((await dialog.textContent())?.includes('[PRIX] CHF'), 'Récap affiche [PRIX] CHF (transfert)');
await page.screenshot({ path: `${out}/03-config-recap.png` });

// --- Envoyer la demande ---
await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
await dialog.getByRole('heading', { name: /reçue/i }).waitFor({ state: 'visible' });
check(true, 'Écran « Demande reçue »');
await page.screenshot({ path: `${out}/04-config-sent.png` });
await page.getByRole('button', { name: /Retour au site/i }).click();
await page.waitForTimeout(800);

// --- Règle chauffeur : DEMI-JOURNÉE montre l'étape chauffeur ---
await page.getByRole('button', { name: 'Composer ma mission' }).click();
await dialog.waitFor({ state: 'visible' });
await page.waitForTimeout(1100);
await page.getByRole('button', { name: /Demi-journée/ }).click();
await cont.click(); // Véhicule
await cont.click(); // Chauffeur (ne doit PAS sauter)
check(await dialog.getByRole('heading', { name: /conduit/i }).isVisible(), 'Étape Chauffeur présente dès la demi-journée');
await page.screenshot({ path: `${out}/05-config-chauffeur.png` });
await page.keyboard.press('Escape');
await page.waitForTimeout(800);

// --- Mode All-in-Now depuis le hero ---
await page.getByRole('button', { name: /Urgence All-in-Now/ }).click();
await dialog.waitFor({ state: 'visible' });
await page.waitForTimeout(1100);
check(await page.getByText('ALERTE ACTIVÉE').isVisible(), 'All-in-Now : écran alerte directe');
check(await page.getByRole('button', { name: /Déclencher la mission/ }).isVisible(), 'All-in-Now : bouton déclencher');
await page.screenshot({ path: `${out}/06-config-allin.png` });

// --- Changement de langue (EN) ---
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
await page.getByRole('button', { name: 'EN', exact: true }).click();
await page.waitForURL(/\/en$/);
check(await page.getByRole('heading', { name: /of arriving/i }).first().isVisible(), 'Bascule en anglais');
await page.screenshot({ path: `${out}/07-home-en.png` });

// --- Nav mobile : burger + tiroir ---
const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await mob.goto(BASE, { waitUntil: 'networkidle' });
const burger = mob.getByRole('button', { name: /Ouvrir le menu/i });
check(await burger.isVisible(), 'Burger visible sur mobile');
await burger.click();
const drawer = mob.locator('#wv-mobile-menu');
check(await drawer.getByRole('button', { name: 'Réserver', exact: true }).isVisible(), 'Tiroir mobile ouvert (bouton Réserver)');
await drawer.getByRole('link', { name: 'Flotte' }).click();
await mob.waitForTimeout(400);
check(!(await mob.locator('#wv-mobile-menu').count()), 'Tiroir se ferme après clic sur un lien');
await mob.close();

await browser.close();
console.log(failures === 0 ? '\n✅ TOUS LES TESTS PASSENT' : `\n❌ ${failures} échec(s)`);
process.exit(failures === 0 ? 0 : 1);
