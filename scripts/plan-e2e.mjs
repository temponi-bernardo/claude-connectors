#!/usr/bin/env node
// Browser test of the /planejamento-faculdade page (npm run plan:e2e): builds the fictitious plan with the versioned
// script and template, serves it on localhost and checks it in Chromium with Playwright: no console errors,
// counters, one chip and card per course, bars adding up to 100%, ticks kept after a reload and after the plan
// is regenerated with the same ids, no horizontal scroll at 390 px and the dark theme.
// Needs Playwright with Chromium (`npm i -g playwright && npx playwright install chromium`).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SCRIPT = join(
  ROOT,
  'connectors/canvas-puc/plugin/skills/planejamento-faculdade/scripts/plan.mjs',
);
const SAMPLE = join(ROOT, 'connectors/canvas-puc/src/fixtures/plan-sample.json');
const failures = [];

function loadPlaywright() {
  try {
    return createRequire(import.meta.url)('playwright');
  } catch {
    console.error('✖ Playwright not found: npm i -g playwright && npx playwright install chromium');
    process.exit(1);
  }
}

function check(name, ok, detail = '') {
  console.log(`${ok ? '✔' : '✖'} ${name}${ok ? '' : ` — ${detail}`}`);
  if (!ok) failures.push(name);
}

function buildPage(dir, plan, name) {
  const data = join(dir, `${name}.json`);
  const out = join(dir, `${name}.html`);
  writeFileSync(data, JSON.stringify(plan));
  execFileSync(process.execPath, [SCRIPT, 'build', data, '--out', out]);
  return readFileSync(out, 'utf8');
}

function serve(state) {
  const server = createServer((_req, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(state.html);
  });
  return new Promise((done) => server.listen(0, '127.0.0.1', () => done(server)));
}

async function openPage(browser, url, options = {}) {
  const context = await browser.newContext(options);
  await context.route(/fonts\.(googleapis|gstatic)\.com/, (route) =>
    route.fulfill({ status: 200, contentType: 'text/css', body: '' }),
  );
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url);
  await page.waitForSelector('.card');
  return { context, page, errors };
}

function barSums(page) {
  return page.$$eval('.bar', (bars) =>
    bars.map((bar) => {
      const segs = [...bar.querySelectorAll('.seg')].map((s) => s.getBoundingClientRect().width);
      return segs.reduce((a, b) => a + b, 0) - bar.getBoundingClientRect().width;
    }),
  );
}

async function checkDesktop(page, errors) {
  check('no console errors', errors.length === 0, errors.join(' | '));
  check('one chip per course', (await page.locator('#risk-list .chip').count()) === 3);
  check('one card per course', (await page.locator('#course-list .card').count()) === 3);
  check('study counter', (await page.textContent('#study-progress')) === '1 de 5 feitos');
  check('timeline counter', (await page.textContent('#timeline-progress')) === '1 de 6 concluídos');
  const gaps = await barSums(page);
  check(
    'bars add up to 100%',
    gaps.every((gap) => Math.abs(gap) < 1),
    gaps.join(','),
  );
}

async function checkPersistence(page, state, regenerated) {
  await page.check('#chk-s-eda-avl');
  check(
    'counter follows the tick',
    (await page.textContent('#study-progress')) === '2 de 5 feitos',
  );
  await page.reload();
  await page.waitForSelector('.card');
  check('tick kept after reload', await page.isChecked('#chk-s-eda-avl'));
  state.html = regenerated;
  await page.reload();
  await page.waitForSelector('.card');
  const label = await page.textContent('label[for="chk-s-eda-avl"]');
  check('page regenerated', label?.includes('texto revisto') === true, label ?? '');
  check('tick kept after regenerating with the same ids', await page.isChecked('#chk-s-eda-avl'));
}

async function checkPhoneAndDark(browser, url) {
  const phone = await openPage(browser, url, { viewport: { width: 390, height: 844 } });
  const overflow = await phone.page.evaluate(
    () => document.documentElement.scrollWidth - innerWidth,
  );
  check('no horizontal scroll at 390 px', overflow <= 0, `${overflow}px wider`);
  await phone.context.close();
  const dark = await openPage(browser, url, { colorScheme: 'dark' });
  const background = await dark.page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  check('dark theme', background === 'rgb(17, 20, 18)', background);
  check('no console errors in dark mode', dark.errors.length === 0, dark.errors.join(' | '));
  await dark.context.close();
}

async function main() {
  const { chromium } = loadPlaywright();
  const dir = mkdtempSync(join(tmpdir(), 'plan-e2e-'));
  const plan = JSON.parse(readFileSync(SAMPLE, 'utf8'));
  const state = { html: buildPage(dir, plan, 'first') };
  plan.study[1].items[0].task = 'Rotações AVL (texto revisto)';
  const regenerated = buildPage(dir, plan, 'second');
  const server = await serve(state);
  const url = `http://127.0.0.1:${server.address().port}/plano.html`;
  const browser = await chromium.launch();
  try {
    const desktop = await openPage(browser, url, { viewport: { width: 1280, height: 900 } });
    await checkDesktop(desktop.page, desktop.errors);
    await checkPersistence(desktop.page, state, regenerated);
    await desktop.context.close();
    state.html = buildPage(dir, JSON.parse(readFileSync(SAMPLE, 'utf8')), 'third');
    await checkPhoneAndDark(browser, url);
  } finally {
    await browser.close();
    server.close();
    rmSync(dir, { recursive: true, force: true });
  }
  if (failures.length > 0) process.exit(1);
  console.log('✔ plan page e2e green');
}

await main();
