// Kiểm tra chồng chữ / tràn khung ở trạng thái cuối của từng cảnh.
// node qa.js  -> in danh sách lỗi
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.waitForFunction(() => window.READY === true);
  const issues = await page.evaluate(async () => {
    const out = [];
    const SC = window.TIMING.scenes;
    // các mốc kiểm tra: cuối mỗi cảnh, và giữa cảnh với các cảnh có 2 pha
    const checks = SC.map((s, i) => ({ i, t: s.start + s.dur - 0.45 }));
    for (const extra of (window.QA_EXTRA || [])) checks.push(extra);
    for (const { i, t } of checks) {
      window.render(t);
      const scene = document.getElementById('s' + (i + 1));
      const vis = el => { let e = el; while (e && e !== scene) { const cs = getComputedStyle(e); if (parseFloat(cs.opacity) < 0.5 || cs.display === 'none') return false; e = e.parentElement; } return true; };
      const els = [...scene.querySelectorAll('*')].filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && vis(el));
      const cv = document.createElement('canvas').getContext('2d');
      const ink = el => {
        const cs = getComputedStyle(el); const fs = parseFloat(cs.fontSize);
        cv.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
        let L = 1e9, T = 1e9, Rr = -1e9, B = -1e9;
        for (const n of el.childNodes) {
          if (n.nodeType !== 3 || !n.textContent.trim()) continue;
          const m = cv.measureText(n.textContent.trim());
          const rg = document.createRange(); rg.selectNodeContents(n);
          for (const r of rg.getClientRects()) {
            if (r.width < 1) continue;
            const k = r.height / (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent);
            L = Math.min(L, r.left); Rr = Math.max(Rr, r.right);
            T = Math.min(T, r.top + (m.fontBoundingBoxAscent - m.actualBoundingBoxAscent) * k);
            B = Math.max(B, r.bottom - (m.fontBoundingBoxDescent - m.actualBoundingBoxDescent) * k);
          }
        }
        return { left: L, top: T, right: Rr, bottom: B };
      };
      const R = els.map(el => ({ el, r: ink(el), txt: el.textContent.trim().slice(0, 28) })).filter(a => a.r.right > a.r.left);
      for (const a of R) {
        if (a.r.left < 24 || a.r.right > 1056) out.push(`S${i + 1} @${t.toFixed(1)} TRÀN NGANG: "${a.txt}" [${a.r.left.toFixed(0)}..${a.r.right.toFixed(0)}]`);
        const cs = getComputedStyle(a.el);
        if (a.el.scrollWidth > a.el.clientWidth + 2 && cs.overflow !== 'visible') out.push(`S${i + 1} CẮT CHỮ: "${a.txt}"`);
      }
      for (let x = 0; x < R.length; x++) for (let y = x + 1; y < R.length; y++) {
        const a = R[x], b = R[y];
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const ox = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
        const oy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
        if (ox > 6 && oy > 6) out.push(`S${i + 1} @${t.toFixed(1)} CHỒNG: "${a.txt}" × "${b.txt}" (${ox.toFixed(0)}x${oy.toFixed(0)})`);
      }
      // chữ phải nằm trọn trong thẻ/khung chứa có viền
      for (const a of R) {
        let p = a.el.parentElement;
        while (p && p !== scene) { const cs = getComputedStyle(p); if (parseFloat(cs.borderTopWidth) >= 3) break; p = p.parentElement; }
        if (p && p !== scene) { const pr = p.getBoundingClientRect(); if (a.r.top < pr.top - 2 || a.r.bottom > pr.bottom + 2 || a.r.left < pr.left - 2 || a.r.right > pr.right + 2) out.push(`S${i + 1} @${t.toFixed(1)} RA NGOÀI KHUNG: "${a.txt}"`); }
      }
    }
    return out;
  });
  console.log(issues.length ? issues.join('\n') : 'OK – không phát hiện chồng/tràn');
  await browser.close();
})();
