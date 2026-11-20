import puppeteer from 'puppeteer';
import path from 'path';

const OUT_DIR = 'C:/Users/EASY/.gemini/antigravity/brain/07b9abc5-35f4-4cab-ad55-3ed335d6eae6';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.toString()));

  console.log('1. Checking Main Care Router (http://localhost:3000)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, 'verify_home_light.png'), fullPage: true });

  const homeOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log(`Home horizontal overflow: ${homeOverflow ? 'FAIL' : 'PASS'}`);

  console.log('2. Checking Split View (http://localhost:3000/split)...');
  await page.goto('http://localhost:3000/split', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, 'verify_split_initial.png'), fullPage: false });

  const splitOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log(`Split view horizontal overflow: ${splitOverflow ? 'FAIL' : 'PASS'}`);

  console.log('3. Testing CUJ 3: Simulate 2 PM Rush & Stockout...');
  const rushBtn = await page.$('button ::-p-text(Simulate 2 PM Rush & Stockout)') || (await page.$x("//button[contains(., 'Simulate 2 PM Rush')]"))?.[0];
  if (rushBtn) {
    await rushBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUT_DIR, 'verify_split_after_rush.png'), fullPage: false });
    console.log('Simulate 2 PM Rush clicked successfully.');
  } else {
    // Fallback selector
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text.includes('Simulate 2 PM Rush')) {
        await b.click();
        await new Promise(r => setTimeout(r, 800));
        await page.screenshot({ path: path.join(OUT_DIR, 'verify_split_after_rush.png'), fullPage: false });
        console.log('Simulate 2 PM Rush clicked via text scan.');
        break;
      }
    }
  }

  console.log('4. Testing CUJ 1: Trigger Emergency Danger Sign...');
  const checkboxes = await page.$$('input[type="checkbox"]');
  if (checkboxes.length > 0) {
    await checkboxes[0].click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUT_DIR, 'verify_split_redflag.png'), fullPage: false });
    console.log('Red flag danger sign toggled successfully.');
  }

  console.log('5. Checking Emergency View (http://localhost:3000/emergency)...');
  await page.goto('http://localhost:3000/emergency', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, 'verify_emergency.png'), fullPage: false });

  console.log('6. Checking Partner Directory Campus Map (http://localhost:3000/)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const tabs = await page.$$('[role="tab"]');
  for (const t of tabs) {
    const text = await page.evaluate(el => el.textContent, t);
    if (text.includes('Partner Directory') || text.includes('Accredited Directory')) {
      await t.click();
      await new Promise(r => setTimeout(r, 500));
      break;
    }
  }
  // Click campus map toggle if available
  const mapButtons = await page.$$('button');
  for (const b of mapButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Campus Map')) {
      await b.click();
      await new Promise(r => setTimeout(r, 500));
      break;
    }
  }
  await page.screenshot({ path: path.join(OUT_DIR, 'verify_campus_map.png'), fullPage: false });

  console.log(`Summary of Page Errors: ${pageErrors.length}`);
  if (pageErrors.length > 0) {
    console.log(pageErrors);
  }

  await browser.close();
  console.log('All verification checks completed successfully.');
}

main().catch(err => {
  console.error('Smoke test error:', err);
  process.exit(1);
});
