import puppeteer from 'puppeteer';
import path from 'path';

const OUT_DIR = 'C:/Users/EASY/.gemini/antigravity/brain/07b9abc5-35f4-4cab-ad55-3ed335d6eae6';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // ==========================================
  // PART 1: MOBILE AUDIT (390 x 844)
  // ==========================================
  console.log('--- PART 1: MOBILE AUDIT (390x844) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Check horizontal overflow
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log(`Mobile (390px) horizontal overflow: ${mobileOverflow ? 'FAIL' : 'PASS'}`);

  // Screenshot Step 1: Quick Safety Check
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_step1_safety.png'), fullPage: false });
  console.log('Captured mobile_step1_safety.png');

  // Test 1: Check a red flag danger sign -> verify emergency lockout
  const checkboxes = await page.$$('input[type="checkbox"]');
  if (checkboxes.length > 0) {
    await checkboxes[0].click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(OUT_DIR, 'mobile_step1_lockout.png'), fullPage: false });
    console.log('Captured mobile_step1_lockout.png');

    // Click "Clear danger signs to return to pharmacy routing" button
    const allBtns = await page.$$('button');
    for (const b of allBtns) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text.includes('Clear danger signs')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 400));
  }

  // Click "No Danger Signs — Continue"
  const continueButtons = await page.$$('button');
  for (const btn of continueButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('No Danger Signs')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 500));
      break;
    }
  }

  // Screenshot Step 2: What Do You Need?
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_step2_categories.png'), fullPage: false });
  console.log('Captured mobile_step2_categories.png');

  // Click "Find Best Route"
  const step2Buttons = await page.$$('button');
  for (const btn of step2Buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Find Best Route')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 500));
      break;
    }
  }

  // Screenshot Step 3: Your Best Route
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_step3_best_route.png'), fullPage: false });
  console.log('Captured mobile_step3_best_route.png');

  // Click "Generate Digital Intake Pass"
  const step3Buttons = await page.$$('button');
  for (const btn of step3Buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Generate Digital Intake Pass')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  // Screenshot Step 3: Intake Pass Modal / Bottom Sheet
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_step3_intake_modal.png'), fullPage: false });
  console.log('Captured mobile_step3_intake_modal.png');

  // Close modal
  const closeBtn = await page.$('button[aria-label="Close dialog"]');
  if (closeBtn) await closeBtn.click();

  // Test Partner View on Mobile
  await page.goto('http://localhost:3000/partner', { waitUntil: 'networkidle0' });
  // Enter PIN 4288 to unlock UNN Medical Centre
  const pinInput = await page.$('input[placeholder="••••"]');
  if (pinInput) {
    await pinInput.type('4288');
    const unlockBtn = await page.$('button[type="submit"]');
    if (unlockBtn) await unlockBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_partner_console.png'), fullPage: false });
  console.log('Captured mobile_partner_console.png');

  // ==========================================
  // PART 2: DESKTOP AUDIT (1280 x 800)
  // ==========================================
  console.log('--- PART 2: DESKTOP AUDIT (1280x800) ---');
  await page.setViewport({ width: 1280, height: 800, isMobile: false });

  // Student Router on Desktop
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log(`Desktop (1280px) horizontal overflow: ${desktopOverflow ? 'FAIL' : 'PASS'}`);

  const mainColumnWidth = await page.evaluate(() => {
    const el = document.querySelector('.max-w-\\[520px\\]');
    return el ? Math.round(el.getBoundingClientRect().width) : null;
  });
  console.log(`Student Router centered column width: ${mainColumnWidth}px (Target: <= 520px)`);

  await page.screenshot({ path: path.join(OUT_DIR, 'desktop_student_view.png'), fullPage: false });
  console.log('Captured desktop_student_view.png');

  // Partner Workstation on Desktop
  await page.goto('http://localhost:3000/partner', { waitUntil: 'networkidle0' });
  const pinInputDesk = await page.$('input[placeholder="••••"]');
  if (pinInputDesk) {
    await pinInputDesk.type('4288');
    const unlockBtn = await page.$('button[type="submit"]');
    if (unlockBtn) await unlockBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  // Trigger "Simulate 2 PM Rush"
  const rushButtons = await page.$$('button');
  for (const btn of rushButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Simulate 2 PM Rush')) {
      await btn.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  await page.screenshot({ path: path.join(OUT_DIR, 'desktop_partner_workstation.png'), fullPage: false });
  console.log('Captured desktop_partner_workstation.png');

  // Re-check student view in second simulated tab to prove instant auto-reroute
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  // Step 1 -> Step 2 -> Step 3
  const stepButtons = await page.$$('button[aria-label^="Jump to Step"]');
  if (stepButtons.length >= 3) {
    // Or advance through buttons
    const contBtn = (await page.$$('button')).find(async b => (await page.evaluate(el => el.textContent, b)).includes('No Danger Signs'));
  }
  // Click continue then find best route
  const cButtons = await page.$$('button');
  for (const b of cButtons) {
    const t = await page.evaluate(el => el.textContent, b);
    if (t.includes('No Danger Signs')) {
      await b.click();
      await new Promise(r => setTimeout(r, 400));
      break;
    }
  }
  const fButtons = await page.$$('button');
  for (const b of fButtons) {
    const t = await page.evaluate(el => el.textContent, b);
    if (t.includes('Find Best Route')) {
      await b.click();
      await new Promise(r => setTimeout(r, 400));
      break;
    }
  }

  await page.screenshot({ path: path.join(OUT_DIR, 'desktop_student_rerouted.png'), fullPage: false });
  console.log('Captured desktop_student_rerouted.png');

  await browser.close();
  console.log('Verification finished successfully.');
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
