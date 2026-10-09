# Nhận dạng giọng nói tiếng Việt (offline) để kiểm tra lời đọc TTS.
# python3 asr.py file1.mp3 file2.wav ...
import sys, subprocess, numpy as np, sherpa_onnx
M = '/tmp/asr/sherpa-onnx-zipformer-vi-int8-2025-04-20/'
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=M + 'encoder-epoch-12-avg-8.int8.onnx', decoder=M + 'decoder-epoch-12-avg-8.onnx',
    joiner=M + 'joiner-epoch-12-avg-8.int8.onnx', tokens=M + 'tokens.txt', num_threads=4, decoding_method='greedy_search')
for f in sys.argv[1:]:
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
    x = np.frombuffer(pcm, dtype='<i2').astype(np.float32) / 32768
    s = rec.create_stream(); s.accept_waveform(16000, x); rec.decode_stream(s)
    r = s.result
    words = []
    # gom token thành từ kèm thời điểm bắt đầu
    for tok, ts in zip(r.tokens, r.timestamps):
        if tok.startswith('▁') or not words: words.append([tok.replace('▁', ''), ts])
        else: words[-1][0] += tok
    print(f'== {f}\n{r.text}')
    print(' '.join(f'{w}@{t:.2f}' for w, t in words))
