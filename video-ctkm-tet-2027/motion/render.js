// node render.js preview t1 t2 ...   -> preview_<t>.png
// node render.js video out.mp4 [fps]  -> render toàn bộ khung hình qua ffmpeg
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const [mode, ...args] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--font-render-hinting=none'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.waitForFunction(() => window.READY === true);
  await page.waitForTimeout(300);
  const timing = await page.evaluate(() => ({ ...window.TIMING, sfx: window.SFX }));
  fs.writeFileSync(path.join(__dirname, 'timing.json'), JSON.stringify(timing, null, 1));

  if (mode === 'preview') {
    for (const a of args) {
      const t = parseFloat(a);
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(__dirname, `preview_${a}.png`) });
    }
  } else if (mode === 'video') {
    const out = args[0];
    const fps = parseInt(args[1] || '30', 10);
    const n = Math.ceil(timing.total * fps);
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.render(t), i / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 300 === 0) console.log(`frame ${i}/${n}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
