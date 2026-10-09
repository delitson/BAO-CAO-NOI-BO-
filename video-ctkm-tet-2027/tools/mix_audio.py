# Trộn âm thanh cuối: giọng đọc (đặt đúng mốc từng cảnh) + SFX + nhạc nền tự giảm khi có giọng, chuẩn hoá -15 LUFS.
# python3 tools/mix_audio.py motion-v4/timing.json audio/voice-v4 audio/sfx audio/music.mp3 audio/mix4.m4a
import sys, json, subprocess

timing, vdir, sdir, music, out = sys.argv[1:6]
T = json.load(open(timing)); total = T['total']
VOL = {'stamp': 0.5, 'pop': 0.22, 'whoosh': 0.28, 'flip': 0.5, 'ding': 0.2, 'cash': 0.32, 'fizz': 0.35, 'clink': 0.45}
inputs, flt = [], []
for i, s in enumerate(T['scenes']):
    inputs += ['-i', f'{vdir}/d{i+1:02d}.wav']; d = int(s['vo'] * 1000)
    flt.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={d}|{d}[v{i}]")
n = len(T['scenes'])
flt.append(''.join(f'[v{i}]' for i in range(n)) + f"amix=inputs={n}:normalize=0,apad,atrim=0:{total:.3f},volume=1.5[vo]")
k = n; labs = []
for j, e in enumerate(T['sfx']):
    inputs += ['-i', f"{sdir}/{e['k']}.wav"]; d = max(0, int(e['t'] * 1000))
    flt.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,volume={VOL[e['k']]},adelay={d}|{d}[x{j}]"); labs.append(f'[x{j}]'); k += 1
flt.append(''.join(labs) + f"amix=inputs={len(labs)}:normalize=0,apad,atrim=0:{total:.3f}[sfx]")
inputs += ['-i', music]
flt.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{total:.3f},volume=0.30,afade=t=in:d=0.8,afade=t=out:st={total-3:.3f}:d=3[mus]")
flt.append("[vo]asplit=2[vo1][vosc]")
flt.append("[mus][vosc]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=500[mduck]")
flt.append("[vo1][sfx][mduck]amix=inputs=3:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9[out]")
r = subprocess.run(['ffmpeg', '-y', '-v', 'error', *inputs, '-filter_complex', ';'.join(flt), '-map', '[out]',
                    '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', out], capture_output=True, text=True)
print('OK' if r.returncode == 0 else r.stderr[-1500:])
