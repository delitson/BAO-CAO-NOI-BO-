# Tạo hiệu ứng âm thanh tổng hợp (không cần tải về): đóng dấu, pop, whoosh, lật vé, ding, tiền, cụng ly, bia sủi bọt.
# python3 tools/make_sfx.py audio/sfx
import sys, os, wave, numpy as np

SR = 48000
out = sys.argv[1] if len(sys.argv) > 1 else 'audio/sfx'
os.makedirs(out, exist_ok=True)

def save(name, x):
    x = np.clip(x / (np.max(np.abs(x)) + 1e-9) * 0.9, -1, 1)
    with wave.open(os.path.join(out, name + '.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())

def t(d): return np.arange(int(SR * d)) / SR

def lp(x, a):  # lọc thông thấp 1 cực
    y = np.zeros_like(x); s = 0
    for i, v in enumerate(x): s += a * (v - s); y[i] = s
    return y

rng = np.random.default_rng(7)
tt = t(0.35); save('stamp', np.sin(2*np.pi*(55+90*np.exp(-tt*30))*tt)*np.exp(-tt*14) + lp(rng.standard_normal(len(tt)), 0.35)*np.exp(-tt*60)*0.6)
tt = t(0.12); save('pop', np.sin(2*np.pi*(500+700*np.exp(-tt*40))*tt)*np.exp(-tt*35))
tt = t(0.5); n = rng.standard_normal(len(tt)); a = 0.03+0.25*(tt/0.5); y = np.zeros_like(n); s = 0
for i in range(len(n)): s += a[i]*(n[i]-s); y[i] = s
save('whoosh', y*np.sin(np.pi*tt/0.5)**2)
tt = t(0.22); save('flip', lp(rng.standard_normal(len(tt)), 0.5)*(np.exp(-((tt-0.03)/0.012)**2)+0.8*np.exp(-((tt-0.11)/0.015)**2)))
tt = t(1.0); save('ding', (np.sin(2*np.pi*1568*tt)+0.5*np.sin(2*np.pi*2350*tt)+0.25*np.sin(2*np.pi*3136*tt))*np.exp(-tt*5))
tt = t(1.0); t2 = np.clip(tt-0.09, 0, None)
save('cash', lp(rng.standard_normal(len(tt)), 0.6)*np.exp(-tt*80)*0.8 + np.sin(2*np.pi*2093*tt)*np.exp(-tt*6)*0.5
     + (np.sin(2*np.pi*2637*t2)+0.4*np.sin(2*np.pi*3951*t2))*np.exp(-t2*5)*(tt > 0.09)*0.7)
rng = np.random.default_rng(3)
tt = t(1.2); save('clink', sum(a*np.sin(2*np.pi*f*tt)*np.exp(-tt*d) for f, a, d in [(2630,1,7),(3950,.6,9),(5270,.45,11),(6620,.3,14),(3310,.5,8)]))
tt = t(3.0); n = rng.standard_normal(len(tt)); b = (rng.random(len(tt)) < 0.004)*rng.random(len(tt))
fizz = np.diff(n, prepend=0)*0.15 + np.convolve(b, np.exp(-np.arange(200)/30), 'same')*np.sign(rng.standard_normal(len(tt)))
save('fizz', fizz*np.minimum(1, tt/0.3)*np.minimum(1, (3.0-tt)/0.6))
tt = t(0.09); save('tick', (np.sin(2*np.pi*1900*tt)*0.6+lp(rng.standard_normal(len(tt)), 0.7)*0.8)*np.exp(-tt*70))
print('đã tạo SFX trong', out)
