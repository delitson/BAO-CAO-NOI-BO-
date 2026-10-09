# Hậu kỳ giọng đọc: rút ngắn khoảng lặng quá dài, nhấn (tăng âm lượng nhẹ) các cụm từ khoá,
# rồi xuất WAV + JSON mốc thời gian từng chữ (dùng để đồng bộ hình).
# python3 process_vo.py in_dir out_dir
import sys, os, json, subprocess, numpy as np, sherpa_onnx

SR = 48000
M = '/tmp/asr/sherpa-onnx-zipformer-vi-int8-2025-04-20/'
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=M + 'encoder-epoch-12-avg-8.int8.onnx', decoder=M + 'decoder-epoch-12-avg-8.onnx',
    joiner=M + 'joiner-epoch-12-avg-8.int8.onnx', tokens=M + 'tokens.txt', num_threads=4)

# cụm cần nhấn (theo chữ ASR in hoa)
KEYS = ['ĐƠN GIẢN', 'HAI MƯƠI TRIỆU', 'MỘT ĐIỂM THƯỞNG', 'NĂM PHIẾU', 'BỐN TRIỆU', 'MỘT PHIẾU', 'THẬT HẤP DẪN',
        'MỘT TRĂM PHẦN TRĂM', 'NĂM TRIỆU ĐỒNG', 'BA TRĂM THÙNG', 'HAI NGHÌN', 'HAI TRĂM NGHÌN', 'BA TRĂM NGHÌN',
        'TOÀN BỘ SỐ ĐIỂM', 'ỔN ĐỊNH', 'LẠI THẤP', 'CỰC KỲ HẤP DẪN', 'CÙNG CÓ LỢI', 'ĐƯỜNG DÀI', 'QUÀ THẢ GA',
        'KHÁCH HÀNG CỦA QUÝ ĐẠI LÝ', 'TRI ÂN', 'TÁM KÝ TỰ', 'KHÔNG THUỘC', 'HIỆU ỨNG TỐT', 'KÉO THÊM KHÁCH HÀNG']

def load(f):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(pcm, dtype='<i2').astype(np.float32) / 32768

def words(x):
    y = x[::3]  # 48k -> 16k
    s = rec.create_stream(); s.accept_waveform(16000, y); rec.decode_stream(s)
    out = []
    for tok, ts in zip(s.result.tokens, s.result.timestamps):
        if tok.startswith(' ') or not out: out.append([tok.strip(), ts])
        else: out[-1][0] += tok
    return out

def squeeze_pauses(x, max_pause=0.36, keep=0.34, thr_db=-50):
    win = int(0.01 * SR); n = len(x) // win
    e = np.array([np.sqrt(np.mean(x[i*win:(i+1)*win] ** 2) + 1e-12) for i in range(n)])
    silent = 20 * np.log10(e) < thr_db
    segs = []; i = 0
    while i < n:
        if silent[i]:
            j = i
            while j < n and silent[j]: j += 1
            segs.append((i, j)); i = j
        else: i += 1
    out = []; last = 0
    for a, b in segs:
        dur = (b - a) * win / SR
        if a == 0:  # đầu câu: giữ 0.05s
            out.append(x[:0]); last = max(0, b * win - int(0.05 * SR)); continue
        if b >= n:  # cuối câu: giữ 0.15s
            out.append(x[last:a * win + int(0.15 * SR)]); last = len(x); break
        if dur > max_pause:
            cut_a = a * win + int(keep / 2 * SR); cut_b = b * win - int(keep / 2 * SR)
            out.append(x[last:cut_a]); last = cut_b
    out.append(x[last:])
    y = np.concatenate(out)
    # nối mượt: không cần crossfade vì cắt trong vùng lặng
    return y

def emphasize(x, ws):
    g = np.ones_like(x)
    txt = [w for w, _ in ws]
    for key in KEYS:
        k = key.split()
        for i in range(len(txt) - len(k) + 1):
            if txt[i:i + len(k)] == k:
                t0 = ws[i][1] - 0.04
                t1 = ws[i + len(k)][1] - 0.02 if i + len(k) < len(ws) else len(x) / SR
                a, b = max(0, int(t0 * SR)), min(len(x), int(t1 * SR))
                if b - a < int(0.08 * SR): continue
                ramp = int(0.03 * SR)
                env = np.ones(b - a) * 1.38  # ~ +2.8 dB
                env[:ramp] = np.linspace(1, 1.38, ramp); env[-ramp:] = np.linspace(1.38, 1, ramp)
                g[a:b] = np.maximum(g[a:b], env)
    return x * g

if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]; os.makedirs(dst, exist_ok=True)
    meta = {}
    for f in sorted(os.listdir(src)):
        if not f.endswith('.mp3'): continue
        x = load(os.path.join(src, f))
        y = squeeze_pauses(x)
        ws = words(y)
        y = emphasize(y, ws)
        y = np.clip(y, -1, 1)
        name = f.replace('.mp3', '')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', os.path.join(dst, name + '.wav')],
                       input=(y * 32767).astype('<i2').tobytes())
        meta[name] = {'dur': round(len(y) / SR, 3), 'raw': round(len(x) / SR, 3), 'words': [[w, round(t, 2)] for w, t in ws]}
        print(name, meta[name]['raw'], '->', meta[name]['dur'], ' '.join(w for w, _ in ws))
    json.dump(meta, open(os.path.join(dst, 'words.json'), 'w'), ensure_ascii=False, indent=1)
