// Video XƯỞNG "Mua ROSTAR – Quà thả ga": 9 cảnh. Mốc thời gian lấy từ vo.js (window.AN: thời điểm từng cụm chữ trong lời đọc).
// ---------- bố cục cảnh ----------
const VO = window.VO_DUR, AN = window.AN, N = VO.length;
const LEAD = [0.6,0.45,0.45,0.45,0.45,0.45,0.45,0.45,0.45];
const TAIL = [0.5,0.4,0.45,0.9,0.5,0.4,0.45,2.6,2.6];
const C = {o:'#EF6A12', c:'#F7F0E3'};
const BG = [C.c,C.o,C.c,C.o,C.c,C.c,C.o,C.c,C.o];
const SC = []; let acc = 0;
for (let i=0;i<N;i++){ const d=LEAD[i]+VO[i]+TAIL[i]; SC.push({start:acc, dur:d, vo:acc+LEAD[i]}); acc+=d; }
const TOTAL = acc;
window.TIMING = {total:TOTAL, scenes:SC};
const A = (s,k) => AN['s'+s][k];          // mốc (giây, tính từ lúc giọng của cảnh bắt đầu)

// ---------- helpers ----------
const $ = id => document.getElementById(id);
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const P=(t,a,d)=>clamp((t-a)/d);
const eOut=x=>1-Math.pow(1-x,3);
const eIO=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const eBack=x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
const lerp=(a,b,x)=>a+(b-a)*x;
const fmt=n=>Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');
function st(el,{x=0,y=0,s=1,r=0,o=1,b=0,sx=null,sy=null,ry=0}={}){
  if(typeof el==='string') el=$(el);
  const scl = (sx!==null||sy!==null)?`scale(${sx??s},${sy??s})`:`scale(${s})`;
  el.style.transform=`translate(${x}px,${y}px) ${scl} rotate(${r}deg)` + (ry?` perspective(1400px) rotateY(${ry}deg)`:'');
  el.style.opacity=o; el.style.filter=b>0.05?`blur(${b}px)`:'none';
}
function rise(el,t,a,d=0.55,dist=70){const k=P(t,a,d),e=eOut(k);st(el,{y:(1-e)*dist,o:e,b:(1-e)*10});}
function pop(el,t,a,d=0.45,from=0.4){const k=P(t,a,d);st(el,{s:lerp(from,1,eBack(k)),o:clamp(k*3),b:(1-k)*6});}
function slam(el,t,a,d=0.28,from=2.4,r0=-18,r1=0){const k=P(t,a,d),e=eOut(k);st(el,{s:lerp(from,1,e),r:lerp(r0,r1,e),o:clamp(k*2.5),b:(1-k)*8});}
function slideX(el,t,a,d=0.55,dist=900){const k=P(t,a,d),e=eOut(k);st(el,{x:(1-e)*dist,o:clamp(k*2),b:(1-e)*18});}
function punch(el,t,a,d=0.4,from=1.9){const k=P(t,a,d),e=eOut(k);st(el,{s:lerp(from,1,e),o:clamp(k*2),b:(1-e)*14});}
function count(el,t,a,d,target,suffix=''){const k=eOut(P(t,a,d)); el.firstChild.nodeValue = fmt(target*k)+suffix;}
function phase(id,t,a,d=0.45,dy=-140){const k=eIO(P(t,a,d)); const el=$(id); el.style.opacity=1-k; el.style.transform=`translateY(${k*dy}px)`;}

// Anton + dấu tiếng Việt: giãn dòng để dấu không lấn dòng trên / viền khung
document.querySelectorAll('.anton:not(.nofix)').forEach(el=>{
  const cs=getComputedStyle(el), fs=parseFloat(cs.fontSize);
  const old=parseFloat(cs.lineHeight)||fs*1.08, nl=fs*1.34;
  el.style.lineHeight=nl+'px';
  if(el.style.top && cs.position==='absolute'){ el.style.top=(parseFloat(el.style.top)-(nl-old)/2)+'px'; }
});
// ô mã 8 ký tự
(()=>{const box=$('codes'); for(let i=0;i<8;i++){const d=document.createElement('div'); d.className='codebox'; d.id='cb'+i; d.style.left=(i*108)+'px'; box.appendChild(d);} })();
const CODE='X7K2M9QA';
// giọt bia
const DROPS=[]; (()=>{ const box=$('drops'); for(let i=0;i<14;i++){ const d=document.createElement('div'); const r=10+(i*7)%14;
  d.style.cssText=`position:absolute;left:0;top:0;width:${r}px;height:${r*1.3}px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:${i%3?'#f6b42a':'#fff6dc'};opacity:0`; box.appendChild(d);
  const ang=-Math.PI/2+(i/13-0.5)*2.6; DROPS.push({el:d,vx:Math.cos(ang)*(260+(i*53)%160),vy:Math.sin(ang)*(380+(i*37)%200)}); } })();
// tiền & voucher bay
function makeFly(id,n,cashOnly){ const box=$(id), arr=[]; for(let i=0;i<n;i++){ const im=document.createElement('img');
  im.src=(!cashOnly&&i%3===2)?'../assets/gift_voucher_t.png':'../assets/gift_cash_t.png';
  im.style.cssText='position:absolute;left:0;top:0;width:'+(230+(i*37)%90)+'px;opacity:0;filter:drop-shadow(0 8px 10px rgba(0,0,0,.35))'; box.appendChild(im);
  arr.push({el:im,t0:i*0.22,x0:(i*173)%900-60,dir:i%2?1:-1,rot:(i*47)%60-30,dur:2.6+(i%4)*0.35}); } return arr; }
function flyRun(arr,v,t0){ arr.forEach(p=>{ const k=(v-t0-p.t0)/p.dur; if(k<0||k>1){p.el.style.opacity=0;return;}
  const x=p.x0+Math.sin(k*Math.PI*2.2+p.t0)*90*p.dir, y=1750-k*1650+Math.sin(k*9+p.t0)*25;
  p.el.style.opacity=Math.min(1,k*6,(1-k)*5); p.el.style.transform=`translate(${x}px,${y}px) rotate(${p.rot+Math.sin(k*8+p.t0)*35}deg) scale(${0.8+0.3*Math.sin(k*5+p.t0)})`; }); }
const FLY4=makeFly('fly4',14,true), FLY5=makeFly('fly5',9,false);
// lưới phiếu nhân lên (cảnh 8)
const TIX=[]; (()=>{ const box=$('tix'); for(let i=0;i<24;i++){ const d=document.createElement('div'); const c=i%6, r=Math.floor(i/6);
  d.style.cssText=`position:absolute;left:${60+c*165}px;top:${250+r*(r<2?190:190)+(r>=2?520:0)}px;width:140px;height:170px;background:#FFF7EC;border:4px solid #1B1B1B;border-radius:18px;box-shadow:5px 6px 0 #1B1B1B;overflow:hidden;opacity:0`;
  d.innerHTML='<div style="height:46px;background:#EF6A12;border-bottom:3px dashed #1B1B1B"></div><div style="font-family:Anton;font-size:52px;text-align:center;color:#EF6A12;line-height:1.6">🎟️</div>';
  box.appendChild(d); TIX.push(d);} })();

// ---------- các cảnh: (lt = thời gian trong cảnh, v = tính từ lúc giọng đọc bắt đầu) ----------
const scenes = [
  // 1 — chữ hiện từng cụm theo giọng; sau khoảng lặng: nền cam loang, cửa nhôm tự vẽ, BIẾT LẮNG NGHE / DÁM THAY ĐỔI
  (lt,v)=>{
    const S=1; pop('w1',v,A(S,'w1')-0.05,0.35,0.6);
    { const k=P(v,A(S,'w2')-0.05,0.3),e=eOut(k); st('w2',{s:lerp(1.6,1,e),o:clamp(k*2.5),b:(1-e)*10}); st('w2u',{sx:eOut(P(v,A(S,'w2')+0.35,0.4)),sy:1}); }
    rise('w3',v,A(S,'w3')-0.05,0.4,40); rise('w4',v,A(S,'w4')-0.05,0.4,40);
    const kB=eIO(P(v,A(S,'B')-0.35,0.7)); $('s1B').style.clipPath=`circle(${kB*1200}px at 540px 960px)`; $('s1A').style.opacity=kB>=1?0:1;
    document.querySelectorAll('#door .dl').forEach((el,i)=>{ const L=2600; el.style.strokeDasharray=L; el.style.strokeDashoffset=L*(1-eIO(P(v,A(S,'B')+0.1+i*0.12,1.6))); });
    rise('b0',v,A(S,'b0'),0.45,40); slam('b1',v,A(S,'b1')-0.05,0.3,1.9,-4,0); slam('b2',v,A(S,'b2')-0.05,0.3,2.1,4,0);
    pop('c1',v,A(S,'c1'),0.4,0.5); pop('c2',v,A(S,'c2'),0.4,0.5); pop('c3',v,A(S,'c3'),0.4,0.5);
    pop('s1logo',v,A(S,'logo'),0.55,0.6);
  },
  // 2 — NIỀM TIN ⇄ GIÁ TRỊ, rồi tên chương trình, thời gian, gần 2.000 quà
  (lt,v)=>{
    const S=2; rise('nt0',v,-0.1,0.45,40); punch('nt1',v,A(S,'nt')-0.05,0.4,1.7);
    pop('ntA',v,A(S,'tl')-0.35,0.4,0.4); rise('nt3',v,A(S,'tl')-0.2,0.4,30); slam('nt2',v,A(S,'gt')-0.05,0.3,1.8,-4,0);
    phase('s2A',v,A(S,'B')-0.25,0.35); $('s2B').style.opacity=P(v,A(S,'B')-0.1,0.2);
    { const k=P(v,A(S,'B')-0.1,0.5),e=eOut(k); st('p0',{s:lerp(1.5,1,e),o:k,b:(1-e)*16}); }
    pop('d1',v,A(S,'d1'),0.45,0.6); { const k=eIO(P(v,A(S,'d1')+0.3,0.6)); st('dl',{sx:k,sy:1,o:k>0?1:0}); } pop('d2',v,A(S,'d1')+0.8,0.45,0.6);
    rise('p1',v,A(S,'mua')-0.4,0.4,30); pop('p2',v,A(S,'mua'),0.35); pop('p3',v,A(S,'mua')+0.25,0.4);
    pop('p4',v,A(S,'qua'),0.35); pop('p5',v,A(S,'qua')+0.2,0.35); pop('p6',v,A(S,'qua')+0.4,0.4);
    rise('qbox',v,A(S,'gan')-0.2,0.5,120); count($('q2k'),v,A(S,'gan'),1.2,2000); rise('q3',v,A(S,'gan')+0.6,0.45,40);
  },
  // 3 — 100% PHIẾU CÓ QUÀ, phiếu lật mở, gạch "không bốc thăm / không chờ quay số"
  (lt,v)=>{
    const S=3; { const k=P(v,-0.15,0.45),e=eOut(k); st('h100',{s:lerp(2.2,1,e),o:clamp(k*2),b:(1-e)*18}); }
    rise('h101',v,A(S,'phieu'),0.45,50); pop('tk',v,0.4,0.5,0.6);
    { const k=eIO(P(v,A(S,'mo')-0.1,0.6)); $('tk').style.transform+=` perspective(1600px) rotateY(${k*180}deg)`; $('tkF').style.opacity=k<0.5?1:0; $('tkB').style.opacity=k<0.5?0:1; }
    pop('n1',v,A(S,'n1')-0.05,0.35,0.6); st('n1s',{sx:eOut(P(v,A(S,'n1')+0.45,0.35)),sy:1});
    pop('n2',v,A(S,'n2')-0.05,0.35,0.6); st('n2s',{sx:eOut(P(v,A(S,'n2')+0.55,0.35)),sy:1});
    punch('h102',v,A(S,'biet')-0.1,0.45,1.5);
  },
  // 4 — GIẢI ĐẶC BIỆT 5.000.000đ, tiền bay
  (lt,v)=>{
    const S=4; rise('gd',v,-0.2,0.5,200); count($('gdc'),v,A(S,'nam'),1.0,5000000);
    flyRun(FLY4,v,A(S,'nam')+0.2);
  },
  // 5 — bia vector: lon rót, ly đầy, cụng ly; thẻ ~300 THÙNG
  (lt,v)=>{
    const S=5, B={can:0.0,pourEnd:A(S,'B')-0.35,clink:A(S,'B')+0.05}; B.shrink=A(S,'ba')+0.15;
    rise('b5k',v,-0.1,0.45,40);
    { const kin=eOut(P(v,B.can,0.6)), kpour=eIO(P(v,B.can+0.5,0.4)), kout=eIO(P(v,B.pourEnd,0.45));
      st('can',{x:(1-kin)*420+kout*520,y:-(1-kin)*520-kout*420,r:lerp(20,100,kin)+lerp(0,28,kpour)-lerp(0,70,kout),o:kin*(1-kout)}); }
    const level=eIO(P(v,B.can+0.65,B.pourEnd-B.can-0.65));
    { const on=v>B.can+0.6&&v<B.pourEnd+0.12; const surf=1010+(1-level)*330; const el=$('stream');
      el.style.height=on?(surf-650)+'px':'0px'; el.style.transform=`translateX(${Math.sin(v*23)*2}px)`; el.style.opacity=on?1:0; }
    $('mugLfill').style.clipPath=`inset(${(1-level)*88+6}% 0 0 0)`;
    { const km=eIO(P(v,B.clink-0.5,0.5)); const kb=P(v,B.clink,0.5); const bounce=Math.sin(kb*Math.PI*2)*(1-kb)*10;
      st('mugL',{x:lerp(0,-200,km)-bounce,r:lerp(0,-6,km)-bounce*0.6});
      st('mugR',{x:lerp(560,0,km)+bounce,r:lerp(25,6,km)+bounce*0.6,o:km>0?1:0});
      const kbu=P(v,B.clink,0.35); st('burst',{s:lerp(0.5,1.3,eOut(kbu)),o:kbu>0&&kbu<1?1-kbu:0});
      DROPS.forEach(d=>{ const tt=(v-B.clink)/1.1; if(tt<0||tt>1){d.el.style.opacity=0;return;}
        d.el.style.opacity=1-tt; d.el.style.transform=`translate(${540+d.vx*tt}px,${1000+d.vy*tt+900*tt*tt}px)`; }); }
    st('glow',{s:1+0.06*Math.sin(v*3),o:0.9});
    { const k=eIO(P(v,B.shrink,0.6)); $('beer').style.transform=`scale(${lerp(1,0.62,k)}) translateY(${lerp(0,-20,k)}px)`; }
    slideX('t300',v,B.shrink+0.2,0.5,-900); flyRun(FLY5,v,B.clink+0.1);
    rise('chau',v,A(S,'trung')-0.1,0.5,50);
  },
  // 6 — 3 thẻ quà trượt ngang, hạ nhịp
  (lt,v)=>{
    const S=6; rise('s6h',v,-0.15,0.45,40);
    slideX('g1',v,A(S,'g1')-0.1,0.6,900); slideX('g2',v,A(S,'g2')-0.1,0.6,-900); slideX('g3',v,A(S,'g3')-0.1,0.6,900);
  },
  // 7 — khung sản phẩm + mặt cắt anode vs sơn tĩnh điện
  (lt,v)=>{
    const S=7; rise('pf',v,-0.2,0.55,160); pop('pfl',v,0.3,0.45,0.5);
    { const k=((v+0.4)%2.2)/2.2; st('shine',{x:lerp(-260,1000,eIO(clamp(k*1.6))),r:20,o:1}); }
    for(let i=0;i<4;i++){ const ph=v*2.2+i*1.7; st('sp'+i,{s:(0.55+0.45*Math.abs(Math.sin(ph)))*clamp(P(v,0.2+i*0.15,0.4)*1),r:v*40+i*30,o:clamp(P(v,0.2+i*0.15,0.4))}); }
    rise('z0',v,0.0,0.4,30); punch('z1',v,0.25,0.4,1.7); phase('s7Z',v,A(S,'kc')-0.35,0.3,-120);
    rise('h0',v,A(S,'kc')-0.15,0.4,30); punch('h1',v,A(S,'kc')+0.3,0.4,1.7);
    rise('h2',v,A(S,'nd')-0.25,0.4,30); slam('h3',v,A(S,'nd')+0.1,0.3,1.8,-3,0);
    phase('s7A',v,A(S,'ma')-0.55,0.3,-120); { const k=P(v,0,6); $('pfimg').style.transform=`translate(-50%,-50%) scale(${1+0.08*k}) rotate(${-3+6*k}deg)`; }
    rise('cmpk',v,A(S,'ma')-0.35,0.4,30); rise('cA',v,A(S,'ma')-0.25,0.5,160); rise('cB',v,A(S,'ma')-0.05,0.5,160);
    st('anoL',{sx:1,sy:eOut(P(v,A(S,'ma'),0.6)),o:1}); pop('okA',v,A(S,'ben')-0.1,0.4,0.3);
    { const k=eIO(P(v,A(S,'bong'),0.8)); st('peel',{r:-38*k,y:-30*k,x:12*k,o:1}); }
    punch('bm',v,A(S,'bong')+0.2,0.45,1.5); rise('yt',v,A(S,'lap')-0.1,0.45,40);
  },
  // 8 — nhận quà 3 bước; cuối cảnh: phiếu nhân lên, CÀNG NHIỀU ĐƠN – CÀNG NHIỀU PHIẾU
  (lt,v)=>{
    const S=8; rise('s8k',v,-0.1,0.4,30); punch('s8h',v,0.05,0.4,1.5);
    slideX('k1',v,A(S,'k1')-0.2); slideX('k2',v,A(S,'k2')-0.2); slideX('k3',v,A(S,'k3')-0.2);
    for(let i=0;i<8;i++){ const k=P(v,A(S,'nhap')+i*0.13,0.1); const el=$('cb'+i); el.textContent=k>0.5?CODE[i]:''; el.style.borderColor=k>0.5?'#EF6A12':'#1B1B1B'; }
    const E=VO[7]+0.15; phase('s8A',v,E,0.4,-120); $('s8B').style.opacity=P(v,E+0.05,0.2);
    TIX.forEach((d,i)=>{ const k=P(v,E+0.1+i*0.045,0.35); d.style.opacity=clamp(k*3); d.style.transform=`scale(${lerp(0.2,1,eBack(k))}) rotate(${(i%5-2)*5}deg)`; });
    slam('cn',v,E+0.9,0.3,1.6,-3,0);
  },
  // 9 — kết: hạn 25.01.2027 nhấp nháy vàng, hotline
  (lt,v)=>{
    const S=9; pop('s9logo',v,-0.2,0.5,0.6); rise('e0',v,0.0,0.4,30);
    punch('e1',v,A(S,'han')-0.1,0.45,1.6);
    { const k=v>A(S,'han')+0.6 ? (0.5+0.5*Math.cos((v-A(S,'han')-0.6)*Math.PI*2.4)) : 1; $('e1').style.color = k>0.5?'#E7AA2E':'#F7F0E3'; }
    rise('e2',v,A(S,'han')+0.6,0.4,30);
    rise('e4',v,A(S,'lh')-0.1,0.4,30); pop('e5',v,A(S,'lh')+0.1,0.4,0.6); pop('e6',v,A(S,'lh')+0.35,0.4,0.6);
    punch('e3',v,A(S,'qua')-0.1,0.45,1.7); pop('e7',v,A(S,'qua')+0.4,0.45,0.5);
  },
];

// ---------- render ----------
const HDR = c => c===C.c ? '#EF6A12' : '#1B1B1B';
function render(t){
  let idx=SC.findIndex(s=>t>=s.start && t<s.start+s.dur); if(idx<0) idx=SC.length-1;
  const s=SC[idx], lt=t-s.start, v=t-s.vo;
  $('bgBase').style.background = idx>0?BG[idx-1]:BG[0];
  const w=$('wipe'); w.style.background=BG[idx];
  const kw=idx===0?1:eIO(P(lt,0,0.6)); w.style.clipPath=`circle(${kw*1150}px at 540px 960px)`;
  // cảnh 1 phần sau đổi sang nền cam
  const s1orange = idx===0 && v>A(1,'B')-0.1;
  const bgNow = s1orange ? C.o : BG[idx];
  $('dots').style.color = bgNow===C.o?'#fff':'#000';
  $('hdrL').style.color=HDR(bgNow); $('hdrR').style.color=HDR(bgNow);
  for(let i=0;i<N;i++) $('s'+(i+1)).style.opacity=0;
  const el=$('s'+(idx+1));
  const kin=idx===0?1:eOut(P(lt,0.15,0.4));
  const kout=idx===N-1?0:eIO(P(lt,s.dur-0.35,0.35));
  const push = 1 + 0.025*(lt/s.dur);
  el.style.opacity=kin*(1-kout);
  el.style.transform=`scale(${(lerp(0.96,1,kin))*push*(1+kout*0.06)})`;
  el.style.filter=kout>0.02?`blur(${kout*8}px)`:'none';
  scenes[idx](lt,v);
  if(idx===3){ const k=P(v,A(4,'nam')+0.95,0.25); if(k>0&&k<1){ const a=(1-k)*12; el.style.transform+=` translate(${Math.sin(k*60)*a}px,0)`; } }
  const endk=P(t,TOTAL-0.8,0.8); $('stage').style.filter=endk>0?`brightness(${1-endk})`:'none';
  $('progi').style.width=(100*clamp(t/TOTAL))+'%';
  $('prog').style.background = (bgNow===C.c)?'rgba(0,0,0,.12)':'rgba(255,255,255,.22)';
}
window.render=render;

// ---------- hiệu ứng âm thanh ----------
const VT=(i,x)=>SC[i-1].vo+x;
window.SFX=[
  ...SC.slice(1).map(s=>({t:s.start,k:'whoosh'})),
  // cảnh 1: tiếng gõ nhẹ theo từng cụm chữ (chưa có nhạc), rồi whoosh khi nền cam loang
  ...['w1','w2','w3','w4'].map(k=>({t:VT(1,A(1,k)),k:'tick'})),
  {t:VT(1,A(1,'B')-0.35),k:'whoosh'},{t:VT(1,A(1,'b1')),k:'stamp'},{t:VT(1,A(1,'b2')),k:'stamp'},
  {t:VT(1,A(1,'c1')),k:'pop'},{t:VT(1,A(1,'c2')),k:'pop'},{t:VT(1,A(1,'c3')),k:'pop'},{t:VT(1,A(1,'logo')),k:'ding'},
  {t:VT(2,A(2,'nt')),k:'stamp'},{t:VT(2,A(2,'nt')+0.6),k:'whoosh'},{t:VT(2,A(2,'d1')),k:'pop'},{t:VT(2,A(2,'d1')+0.8),k:'pop'},
  {t:VT(2,A(2,'mua')),k:'pop'},{t:VT(2,A(2,'qua')),k:'pop'},{t:VT(2,A(2,'gan')+1.2),k:'ding'},
  {t:VT(3,0),k:'stamp'},{t:VT(3,A(3,'mo')),k:'flip'},{t:VT(3,A(3,'n1')+0.45),k:'whoosh'},{t:VT(3,A(3,'n2')+0.55),k:'whoosh'},{t:VT(3,A(3,'biet')),k:'ding'},
  {t:VT(4,A(4,'nam')+1.0),k:'cash'},{t:VT(4,A(4,'nam')+1.0),k:'stamp'},
  {t:VT(5,0.65),k:'fizz'},{t:VT(5,A(5,'B')+0.05),k:'clink'},{t:VT(5,A(5,'B')+0.15),k:'cash'},{t:VT(5,A(5,'ba')+0.35),k:'whoosh'},
  {t:VT(6,A(6,'g1')),k:'whoosh'},{t:VT(6,A(6,'g2')),k:'whoosh'},{t:VT(6,A(6,'g3')),k:'whoosh'},
  {t:VT(7,A(7,'ben')),k:'ding'},{t:VT(7,A(7,'bong')+0.2),k:'stamp'},
  {t:VT(8,A(8,'k1')),k:'whoosh'},{t:VT(8,A(8,'k2')),k:'whoosh'},{t:VT(8,A(8,'k3')),k:'whoosh'},
  ...[0,1,2,3,4,5,6,7].map(i=>({t:VT(8,A(8,'nhap')+i*0.13),k:'tick'})),
  {t:VT(8,VO[7]+0.3),k:'pop'},{t:VT(8,VO[7]+0.7),k:'pop'},{t:VT(8,VO[7]+1.05),k:'stamp'},
  {t:VT(9,A(9,'han')),k:'stamp'},{t:VT(9,A(9,'lh')+0.1),k:'pop'},{t:VT(9,A(9,'lh')+0.35),k:'pop'},{t:VT(9,A(9,'qua')),k:'ding'},
];
// nhạc vào khi cảnh 1 chuyển sang phần sau (khoảng giây thứ 6)
window.TIMING.musicStart = VT(1,A(1,'B')-0.35);
document.fonts.ready.then(()=>{ window.READY=true; render(0); });
