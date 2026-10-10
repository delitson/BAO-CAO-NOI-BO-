# Video XƯỞNG: hậu kỳ giọng + ghép đoạn có ⏸ (lặng 0,45s) + sinh mốc thời gian cho motion-xuong/vo.js
# Chạy từ thư mục video-ctkm-tet-2027:  python3 tools/build_xuong.py
import os, json, subprocess, shutil, numpy as np

RAW, TMP, OUT = 'audio/voice-xuong-raw', 'audio/voice-xuong-parts', 'audio/voice-xuong'
PAUSE = 0.45
PAUSE_AT = {2: 1.0}  # cảnh 2: giữ chữ GIÁ TRỊ lâu hơn trước khi sang THÔNG BÁO
SR = 48000
os.makedirs(OUT, exist_ok=True)
env = dict(os.environ, PV_KEYS='tools/keys_xuong.txt')
subprocess.run(['python3', 'tools/process_vo.py', RAW, TMP], check=True, env=env)
W = json.load(open(f'{TMP}/words.json'))

def pcm(name):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{TMP}/{name}.wav', '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(b, '<i2')

scenes = {}  # d01..d09: (danh sách phần, mốc B = thời điểm bắt đầu phần sau)
for i in range(1, 10):
    parts = [f'x{i:02d}a', f'x{i:02d}b'] if f'x{i:02d}a' in W else [f'x{i:02d}']
    audio, words, off, B = [], [], 0.0, None
    for j, p in enumerate(parts):
        if j: pz = PAUSE_AT.get(i, PAUSE); audio.append(np.zeros(int(pz * SR), '<i2')); off += pz; B = off
        x = pcm(p); audio.append(x)
        words += [[w, round(t + off, 2)] for w, t in W[p]['words']]
        off += len(x) / SR
    y = np.concatenate(audio)
    name = f'd{i:02d}'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', f'{OUT}/{name}.wav'], input=y.tobytes(), check=True)
    scenes[i] = {'dur': round(len(y) / SR, 3), 'B': B, 'words': words}

def find(i, phrase, nth=0):
    ws = [w for w, _ in scenes[i]['words']]; k = phrase.split(); c = 0
    for j in range(len(ws) - len(k) + 1):
        if ws[j:j + len(k)] == k:
            if c == nth: return scenes[i]['words'][j][1]
            c += 1
    raise SystemExit(f'Cảnh {i}: không thấy "{phrase}" trong: {" ".join(ws)}')

AN = {
 's1': {'w1': 0.0, 'w2': find(1, 'KHÔNG PHẢI'), 'w3': find(1, 'LÀ HÃNG'), 'w4': find(1, 'QUAN TÂM'), 'B': scenes[1]['B'],
        'b0': find(1, 'CHÚNG TÔI MUỐN'), 'b1': find(1, 'BIẾT LẮNG NGHE'), 'b2': find(1, 'DÁM THAY ĐỔI'), 'c1': find(1, 'CHỦ XƯỞNG'),
        'c2': find(1, 'NHÀ THẦU'), 'c3': find(1, 'NHỮNG NGƯỜI'), 'logo': find(1, 'SẢN PHẨM')},
 's2': {'nt': find(2, 'NIỀM TIN'), 'tl': find(2, 'TRAO LẠI'), 'gt': find(2, 'GIÁ TRỊ'), 'B': scenes[2]['B'], 'd1': find(2, 'TỪ NGÀY'), 'mua': find(2, 'MUA'), 'qua': find(2, 'QUÀ THẢ GA'), 'gan': find(2, 'GẦN HAI NGHÌN')},
 's3': {'phieu': find(3, 'PHIẾU ĐỀU'), 'n1': find(3, 'KHÔNG BỐC THĂM'), 'n2': find(3, 'KHÔNG CHỜ'), 'mo': find(3, 'MỞ PHIẾU'), 'biet': find(3, 'BIẾT QUÀ NGAY')},
 's4': {'nam': find(4, 'NĂM TRIỆU')},
 's5': {'B': scenes[5]['B'], 'ba': find(5, 'BA TRĂM THÙNG'), 'trung': find(5, 'TRÚNG THÙNG')},
 's6': {'g1': 0.0, 'g2': find(6, 'TIỀN MẶT'), 'g3': find(6, 'VOUCHER')},
 's7': {'kc': find(7, 'KHÔNG CHỈ'), 'nd': find(7, 'NHẬN ĐÚNG'), 'ma': round(find(7, 'PHỤ KIỆN') + 0.55, 2), 'ben': find(7, 'BỀN MÀU'), 'bong': find(7, 'KHÔNG BONG'), 'lap': find(7, 'LẮP LÊN')},
 's8': {'k1': find(8, 'LIÊN HỆ'), 'k2': find(8, 'NHẬN PHIẾU'), 'k3': find(8, 'QUÉT MÃ'), 'nhap': find(8, 'NHẬP MÃ')},
 's9': {'han': find(9, 'HAI MƯƠI LĂM'), 'lh': find(9, 'LIÊN HỆ'), 'qua': find(9, 'QUÀ THẢ GA')},
}
dur = [scenes[i]['dur'] for i in range(1, 10)]
open('motion-xuong/vo.js', 'w').write('window.VO_DUR=' + json.dumps(dur) + ';\nwindow.AN=' + json.dumps(AN) + ';\n')
json.dump({f'd{i:02d}': scenes[i] for i in scenes}, open(f'{OUT}/words.json', 'w'), ensure_ascii=False, indent=1)
print('VO tổng', round(sum(dur), 1), 's', dur)
