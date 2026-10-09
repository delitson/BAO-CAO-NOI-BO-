import json, difflib, subprocess, numpy as np, sherpa_onnx
M='/tmp/asr/sherpa-onnx-zipformer-vi-int8-2025-04-20/'
rec=sherpa_onnx.OfflineRecognizer.from_transducer(encoder=M+'encoder-epoch-12-avg-8.int8.onnx',decoder=M+'decoder-epoch-12-avg-8.onnx',joiner=M+'joiner-epoch-12-avg-8.int8.onnx',tokens=M+'tokens.txt',num_threads=4)
def words(f):
    pcm=subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
    x=np.frombuffer(pcm,'<i2').astype(np.float32)/32768; s=rec.create_stream(); s.accept_waveform(16000,x); rec.decode_stream(s)
    out=[]
    for t,ts in zip(s.result.tokens,s.result.timestamps):
        if t.startswith(' ') or not out: out.append([t.strip(),ts])
        else: out[-1][0]+=t
    return out
W=json.load(open('vo4p/words.json'))
names=[f'd{i:02d}' for i in range(1,14)]
REF={0:'vo2/v01.mp3',1:'vo2/v02.mp3',2:'vo2/v03.mp3',3:'vo2/v04.mp3',4:'vo2/v05.mp3',5:'vo3/v06.mp3',6:'vo2/v07.mp3',7:'vo2/v08.mp3',8:'vo2/v10.mp3'}
warp={}
for i,ref in REF.items():
    rw=words(ref); dw=W[names[i]]['words']; ddur=W[names[i]]['dur']
    rdur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',ref]))
    sm=difflib.SequenceMatcher(a=[w for w,_ in dw],b=[w for w,_ in rw],autojunk=False)
    pairs=[[0,0]]
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            td,tr=dw[blk.a+k][1],rw[blk.b+k][1]
            if td>pairs[-1][0]+0.05 and tr>pairs[-1][1]+0.02: pairs.append([round(td,2),round(tr,2)])
    pairs.append([round(ddur,2),round(rdur,2)])
    warp[i]=pairs; print(i, len(dw), len(rw), 'cặp khớp', len(pairs))
def t(name,seq,nth=0):
    ws=[w for w,_ in W[name]['words']]; k=seq.split(); c=0
    for j in range(len(ws)-len(k)+1):
        if ws[j:j+len(k)]==k:
            if c==nth: return round(W[name]['words'][j][1],2)
            c+=1
    raise SystemExit(f'không thấy "{seq}" trong {name}')
B11={'can':0.2,'pourEnd':t('d10','TIỀN MẶT')-0.1,'clink':t('d10','TIỀN MẶT')+0.45,'shrink':t('d10','CHÚNG TÔI')+0.2,
     'r1':t('d10','TẠO HIỆU ỨNG')-0.3,'r2':t('d10','KÉO THÊM')-0.2,'win':t('d10','CÁC BÊN'),'road':t('d10','ĐỂ CHÚNG TA')}
S12=[t('d11','PHÁT ĐÚNG')-0.2,t('d11','GIỮ HÓA ĐƠN')-0.2,t('d11','HƯỚNG DẪN')-0.2]
S13=[t('d12','DOANH SỐ')-0.3,t('d12','CHỦ')-0.2,t('d12','THƯỞNG ĐẠI LÝ')-0.2]
S14=t('d13','TRÂN TRỌNG')-0.1
dur=[W[n]['dur'] for n in names]
js=f"""window.SPD=1;
window.VO_DUR={json.dumps(dur)};
window.F={json.dumps([1]*13)};
window.WARP={json.dumps({str(k):v for k,v in warp.items()})};
window.S12={json.dumps([round(x,2) for x in S12])}; window.S13={json.dumps([round(x,2) for x in S13])}; window.S14={S14};
window.B11={json.dumps({k:round(v,2) for k,v in B11.items()})};
"""
open('motion4/vo.js','w').write(js); print(js[-400:])
