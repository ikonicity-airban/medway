import puppeteer from 'puppeteer';
import path from 'path';

const OUT_DIR = 'C:/Users/EASY/.gemini/antigravity/brain/07b9abc5-35f4-4cab-ad55-3ed335d6eae6';

async function main() {
  console.log('Launching browser for prescription flow verification...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // 1. Visit Student Router
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Step 1: Click "No Danger Signs, Continue"
  const buttonsStep1 = await page.$$('button');
  for (const b of buttonsStep1) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('No Danger Signs')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 500));

  // Step 2: Click "Use Sample Doctor Rx"
  console.log('Attaching sample doctor written prescription slip...');
  const buttonsStep2 = await page.$$('button');
  for (const b of buttonsStep2) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Use Sample Doctor Rx')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  // Capture Step 2 with attached prescription
  await page.screenshot({ path: path.join(OUT_DIR, 'rx_step2_upload.png'), fullPage: false });
  console.log('Captured rx_step2_upload.png');

  // Click "Find Best Route"
  const findRouteBtns = await page.$$('button');
  for (const b of findRouteBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Find Best Route')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  // Capture Step 3 with chosen pharmacy and ready prescription
  await page.screenshot({ path: path.join(OUT_DIR, 'rx_step3_review.png'), fullPage: false });
  console.log('Captured rx_step3_review.png');

  // Submit Prescription and Generate Pass
  console.log('Submitting prescription and generating student pass...');
  const submitBtns = await page.$$('button');
  for (const b of submitBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Submit Prescription') || text.includes('Generate Digital Intake Pass')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));

  // Capture generated pass awaiting pharmacist clarification
  await page.screenshot({ path: path.join(OUT_DIR, 'rx_student_pass_awaiting.png'), fullPage: false });
  console.log('Captured rx_student_pass_awaiting.png');

  // 2. Open Partner Workstation in second tab
  console.log('Opening Partner Dispenser Portal...');
  const partnerPage = await browser.newPage();
  await partnerPage.setViewport({ width: 1280, height: 900 });
  await partnerPage.goto('http://localhost:3000/partner', { waitUntil: 'networkidle0' });

  // Enter PIN 4288
  const pinInput = await partnerPage.$('input[type="password"]');
  if (pinInput) {
    await pinInput.type('4288');
    const authBtn = await partnerPage.$('button[type="submit"]');
    if (authBtn) await authBtn.click();
    await new Promise(r => setTimeout(r, 800));
  }

  // Scroll to Doctor Prescription Handwriting Review section
  await partnerPage.evaluate(() => {
    window.scrollBy(0, 450);
  });
  await new Promise(r => setTimeout(r, 600));

  // Select ACT and Paracetamol clinical preset
  console.log('Selecting ACT and Paracetamol clarification preset...');
  const presetBtns = await partnerPage.$$('button');
  for (const b of presetBtns) {
    const text = await partnerPage.evaluate(el => el.textContent, b);
    if (text.includes('ACT and Paracetamol')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 500));

  // Stamp and verify legible
  console.log('Stamping prescription legible as PCN Pharmacist...');
  const stampBtns = await partnerPage.$$('button');
  for (const b of stampBtns) {
    const text = await partnerPage.evaluate(el => el.textContent, b);
    if (text.includes('Verify and Stamp Legible')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));

  // Capture Partner Workstation with stamped prescription
  await partnerPage.screenshot({ path: path.join(OUT_DIR, 'rx_partner_workstation.png'), fullPage: false });
  console.log('Captured rx_partner_workstation.png');

  // 3. Switch back to student page and verify real time update
  console.log('Verifying student pass real time update...');
  await page.bringToFront();
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, 'rx_student_pass_clarified.png'), fullPage: false });
  console.log('Captured rx_student_pass_clarified.png');

  await browser.close();
  console.log('Prescription flow verification complete!');
}

main().catch(err => {
  console.error('Puppeteer verification failed:', err);
  process.exit(1);
});
