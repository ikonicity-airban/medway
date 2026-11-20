import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => consoleLogs.push({ type: 'pageerror', text: err.toString() }));

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Take screenshot
  const outDir = 'C:/Users/EASY/.gemini/antigravity/brain/07b9abc5-35f4-4cab-ad55-3ed335d6eae6';
  await page.screenshot({ path: path.join(outDir, 'live_desktop_1440.png'), fullPage: true });
  await page.screenshot({ path: path.join(outDir, 'live_desktop_fold.png'), fullPage: false });

  // Evaluate UI layout issues
  const report = await page.evaluate(() => {
    const issues = [];

    // Check horizontal scrollbar
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth) {
      issues.push(`Page has horizontal overflow: scrollWidth ${document.documentElement.scrollWidth} > clientWidth ${document.documentElement.clientWidth}`);
    }

    // Check for "N1," or "N2," instead of "₦"
    const textNodes = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walk.nextNode()) {
      const text = node.textContent.trim();
      if (/N\d+[\d,]*/.test(text) && !/UNN|None/i.test(text)) {
        issues.push(`Unrendered Naira symbol detected: "${text}"`);
      }
    }

    // Check all buttons have at least 44px or 48px touch targets
    const buttons = Array.from(document.querySelectorAll('button, a[role="button"], input[type="button"]'));
    const smallButtons = [];
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && (rect.width < 40 || rect.height < 40)) {
        smallButtons.push({ text: btn.innerText.slice(0, 30), width: Math.round(rect.width), height: Math.round(rect.height) });
      }
    });

    if (smallButtons.length > 0) {
      issues.push(`Small interactive targets found: ${JSON.stringify(smallButtons)}`);
    }

    // Check elements with text truncation / ellipsis / overflow
    const allElements = Array.from(document.querySelectorAll('*'));
    const truncated = [];
    allElements.forEach(el => {
      if (el.scrollWidth > el.clientWidth && el.clientWidth > 0) {
        const style = window.getComputedStyle(el);
        if (style.overflow === 'hidden' || style.overflowX === 'hidden' || style.textOverflow === 'ellipsis') {
          // intentional truncation
        } else if (el.tagName !== 'PRE' && el.tagName !== 'CODE' && el.children.length === 0) {
          truncated.push({ tag: el.tagName, class: el.className, text: el.innerText?.slice(0, 40), scrollW: el.scrollWidth, clientW: el.clientWidth });
        }
      }
    });

    return {
      title: document.title,
      issues,
      truncated
    };
  });

  console.log('--- UI AUDIT REPORT ---');
  console.log(JSON.stringify(report, null, 2));
  console.log('--- CONSOLE LOGS ---');
  console.log(JSON.stringify(consoleLogs, null, 2));

  await browser.close();
}

run().catch(err => {
  console.error('Error running audit:', err);
  process.exit(1);
});
