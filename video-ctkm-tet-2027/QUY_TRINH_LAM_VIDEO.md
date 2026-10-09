# Quy trình làm video "MUA ROSTAR – QUÀ THẢ GA" (gửi Đại lý, Tết 2027)

> Ghi lại toàn bộ quá trình làm việc và **cách dựng lại bản cuối (bản 4)**, bản đã được duyệt.
> Thành phẩm: `ROSTAR_MuaRostar_QuaThaGa_DaiLy_9x16_v4.mp4`. Khung dọc 9:16, 1080×1920, 30fps, dài **2:03**.
> Topview Canvas (cả 4 bản): https://www.topview.ai/canvas/68118a67b58748d488981c902ddd0b05

---

## 1. Mục tiêu video

- **Người xem:** đại lý ROSTAR Miền Trung, đa số ở tuổi trung niên. Chữ cần to, mỗi cảnh một ý, các con số đứng yên đủ lâu để đọc.
- **Nội dung:** giải thích chương trình *"Mua ROSTAR – Quà thả ga"* (10/10/2026 – 25/01/2027). Chương trình **dành cho khách hàng xưởng**, nhưng đại lý là người triển khai xuống xưởng.
- **Thông điệp chính:**
  1. ROSTAR đứng ra chuẩn bị quà để tri ân khách xưởng, cũng chính là khách của đại lý.
  2. Đại lý có điểm và phiếu từ đâu: **20 triệu doanh số đã thanh toán = 1 điểm + 5 phiếu**.
  3. Phiếu đến tay xưởng thế nào: **mỗi đơn từ 4 triệu tiền hàng ROSTAR/KLV, phát 1 phiếu cho xưởng**.
  4. Quà hấp dẫn, 100% phiếu có quà. Đại lý được thưởng theo bậc điểm.
  5. Bán ROSTAR và KLV thì biên lợi nhuận ổn định, các bên cùng có lợi, cùng đi đường dài.
- **Nguồn dữ liệu:** thông báo CTKM (file .docx), poster đại lý, poster xưởng, tấm vé mở quà (ảnh do anh/chị cung cấp).

---

## 2. Nhật ký các phiên bản và góp ý

| Bản | Thời lượng | Thay đổi chính | Góp ý nhận được |
|---|---|---|---|
| **1** | 1:30 | 8 cảnh, giọng nam "Đức" (Topview), motion graphics tự dựng, nhạc Tết Topview | Cần thêm nội dung, nói rõ phiếu từ đâu ra. Phát âm **Rốt-ta**, **Ka Lờ Vê**. Đọc nhanh hơn một chút. Dài khoảng 2:10. |
| **2** | 2:15 | 14 cảnh, đổi thứ tự (điểm và phiếu trước, rồi phiếu đến xưởng), thêm cảnh tri ân, biên lợi nhuận, các bên cùng có lợi | Chữ chồng lên nhau, dấu bị cắt. Tên quà: **Bia Tiger Cool Pack**, **Bản lề 4D ROSTAR 17cm**. Muốn có cảnh rót bia, cụng ly, tiền bay. Bỏ dòng "phiếu giao kèm đơn 19/10". Đổi sang giọng nữ có nhấn nhá. |
| **3** | 2:22 | Giọng nữ "Huệ", tự động giãn dòng cho font Anton, công cụ kiểm tra chồng chữ, clip AI rót bia (Wan 3.0) | Không ưng giọng và nhịp. Muốn nghe thử giọng trước khi tạo. Video nhanh hơn 1.1 lần. |
| (thử) | 2:09 | Bản 3 tăng tốc 1.1 lần, chỉ để xem nhịp (`ROSTAR_v3_nhanh1.1x_xemthu.mp4`) | Chọn giọng **Diệu**. Bỏ cảnh 1–1,5%. Bia làm **vector, không nền**, dùng lon Tiger Crystal thật. Giọng Huệ đọc "giải thưởng" thành "giải thương", ngắt nghỉ không hợp lý, nhấn nhá chưa đủ. |
| **4 ✅** | **2:03** | Giọng Diệu tốc độ 1.1, kiểm tra phát âm bằng nhận dạng giọng nói, rút khoảng ngắt, nhấn từ khoá, khớp hình theo từng chữ, hoạt hình bia vector | **Đã duyệt.** |

**Bài học rút ra:**
- Không đưa con số hoặc chữ tiếng Việt cho AI tạo video vẽ, vì AI hay viết sai dấu và sai số. Toàn bộ chữ và số phải **tự dựng bằng HTML**.
- Phải **kiểm tra phát âm bằng nhận dạng giọng nói (ASR)** trước khi gửi. Giọng Huệ đọc "thưởng" thành "thượng/thường", giọng Diệu đọc đúng.
- "QR" đọc không ổn ở mọi giọng. Lời đọc nên nói **"quét mã trên phiếu"**, còn chữ QR để trên hình.
- Viết "Rốt tạ" thì đọc rõ chữ "Rốt" nhưng bị dấu nặng. Giữ cách viết **"Rốt ta"** cho đúng "Rốt-ta".
- Font Anton có dòng sát nhau, chữ có dấu chồng lên dòng trên. Cần giãn dòng khoảng 1.34 lần cỡ chữ và kiểm tra theo nét chữ thật.
- Nên hỏi trước khi tốn credit, và cho nghe mẫu giọng trước khi tạo cả bộ.

---

## 3. Kịch bản bản cuối (13 cảnh)

Giọng **Diệu**: Topview voiceId `RrX5R95zGMJ9L2jAfvOurLjjBdDMpoPz` (MiniMax v2.5), `voiceSpeed = 1.1`.

**Quy tắc phát âm (pronRules) dùng chung:**

| Chữ gốc | Đọc thành |
|---|---|
| ROSTAR | Rốt ta |
| KLV | Ka Lờ Vê |
| Tiger Cool Pack | Thai gơ Cun Pách |
| 4D | bốn đê |

Các con số viết thành chữ, ví dụ "hai mươi triệu", "hai không hai sáu".

| # | Cảnh (hình) | Lời đọc | Cảm xúc |
|---|---|---|---|
| 1 | Logo ROSTAR \| KLV, "Kính gửi QUÝ ĐẠI LÝ", con dấu "Dành cho Đại lý" đập xuống | Kính gửi Quý Đại lý ROSTAR Miền Trung! | happy |
| 2 | "THÔNG BÁO", tên chương trình hiện từng chữ, thanh thời gian 10.10.2026 → 25.01.2027 | ROSTAR trân trọng giới thiệu chương trình: Mua ROSTAR, Quà thả ga! Diễn ra từ ngày mười tháng mười năm hai không hai sáu, đến hết ngày hai mươi lăm tháng một năm hai không hai bảy. | happy |
| 3 | "KHÁCH HÀNG XƯỞNG", "cũng chính là khách hàng của Quý Đại lý", sơ đồ ROSTAR → ĐẠI LÝ → XƯỞNG | Đây là chương trình dành cho khách hàng xưởng, cũng chính là khách hàng của Quý Đại lý. ROSTAR đứng ra chuẩn bị phần quà, thay lời tri ân, gửi đến các xưởng đã tin dùng sản phẩm ROSTAR và KLV. | neutral |
| 4 | "CÁCH THỨC RẤT ĐƠN GIẢN", 20.000.000đ chạy số = **1 ĐIỂM** + **5 PHIẾU** | Cách thức rất đơn giản! Cứ mỗi hai mươi triệu đồng doanh số đã thanh toán, Quý Đại lý được tính một điểm thưởng, đồng thời nhận năm phiếu mở quà từ ROSTAR. | happy |
| 5 | 5 tấm phiếu, hoá đơn "4.000.000đ", phiếu 01 bay xuống thẻ xưởng, "20 triệu = 5 đơn × 4 triệu = 5 phiếu" | Năm phiếu này dùng để phát cho xưởng. Mỗi đơn hàng từ bốn triệu đồng, tiền hàng ROSTAR hoặc KLV, Quý Đại lý phát một phiếu cho xưởng mua hàng, để xưởng có cơ hội trúng những phần quà thật hấp dẫn! | happy |
| 6 | "100% PHIẾU CÓ QUÀ", 5.000.000đ, 4 thẻ quà (~300 thùng bia Tiger Cool Pack, 100 bộ bản lề 4D ROSTAR 17cm, tiền mặt, voucher), "HƠN 2.000 QUÀ TẶNG" | Một trăm phần trăm phiếu đều có quà! Giải đặc biệt: năm triệu đồng tiền mặt! Khoảng ba trăm thùng bia Tiger Cool Pack. Một trăm bộ bản lề 4D ROSTAR, mười bảy xăng ti mét. Cùng tiền mặt, và voucher mua khóa. Hơn hai nghìn phần quà đang chờ được mở! | happy |
| 7 | "XƯỞNG NHẬN QUÀ – CHỈ 3 BƯỚC": quét QR, nhập mã 8 ký tự (gõ từng ô), mở quà | Xưởng chỉ cần quét mã trên phiếu, nhập mã tám ký tự, và mở quà ngay trên website. | neutral |
| 8 | "THƯỞNG DOANH SỐ", cột bậc thang: dưới 5 điểm không thưởng, 5–10 điểm 200.000đ, từ 11 điểm 300.000đ, "ÁP DỤNG CHO TOÀN BỘ SỐ ĐIỂM", chi trả trước 04.02.2027 | Về phần Quý Đại lý, điểm thưởng được cộng dồn suốt chương trình. Đạt từ năm đến mười điểm: thưởng hai trăm nghìn đồng mỗi điểm. Từ mười một điểm trở lên: thưởng ba trăm nghìn đồng mỗi điểm, áp dụng cho toàn bộ số điểm! | happy |
| 9 | "QUAN TRỌNG HƠN", logo ROSTAR \| KLV, so sánh biên lợi nhuận: hàng thịnh hành THẤP, ROSTAR & KLV ỔN ĐỊNH | Quan trọng hơn, qua chương trình này, chúng tôi tin rằng Quý Đại lý sẽ bán thêm được nhiều sản phẩm ROSTAR và KLV, với biên lợi nhuận ổn định. Không như nhiều sản phẩm đang thịnh hành: bán nhiều, nhưng lợi nhuận mang về lại thấp. | neutral |
| 10 | "QUÀ CỰC KỲ HẤP DẪN": **lon Tiger Crystal rót vào ly vector, ly đầy dần, 2 ly cụng nhau** (tia sáng, giọt bia), tiền và voucher bay, thẻ "Hiệu ứng tốt", "Thêm khách hàng", rồi tam giác ROSTAR – ĐẠI LÝ – XƯỞNG "CÙNG CÓ LỢI", "CÙNG ĐI ĐƯỜNG DÀI" | Với những phần quà cực kỳ hấp dẫn, như bia Tiger Cool Pack và tiền mặt, chúng tôi tin chương trình sẽ tạo hiệu ứng tốt cho sản phẩm, đồng thời kéo thêm khách hàng về cho Quý Đại lý. Các bên cùng có lợi, để chúng ta cùng nhau đi đường dài! | happy |
| 11 | "ĐẠI LÝ CẦN THỰC HIỆN" 3 thẻ (01 phát đúng số phiếu, 02 giữ hoá đơn, 03 hướng dẫn xưởng quét QR) | Để chương trình diễn ra thuận lợi, Quý Đại lý vui lòng: phát đúng số phiếu, và ghi đủ thông tin xưởng. Giữ hóa đơn, gửi danh sách phiếu cho Sale Admin hai tuần một lần. Và hướng dẫn xưởng quét mã trên phiếu, nhập mã tám ký tự. | neutral |
| 12 | Khung "LƯU Ý" 3 dòng | Xin lưu ý: doanh số được tính từ ngày mười tháng mười. Chủ, người nhà và nhân viên đại lý không thuộc đối tượng nhận giải. Thưởng đại lý được chi trả trước ngày bốn tháng hai năm hai không hai bảy. | neutral |
| 13 | Logo, HOTLINE 0819 157 576 · 0935 000 176, "TRÂN TRỌNG CẢM ƠN QUÝ ĐẠI LÝ!" | Mọi thông tin chi tiết, xin liên hệ số hotline trên màn hình. Trân trọng cảm ơn Quý Đại lý! | happy |

**Nhạc nền:** Topview Music, không lời. Styles: *Vietnamese Lunar New Year (Tet), warm corporate background, light pentatonic melody with dan tranh and soft pizzicato strings, gentle percussion, positive and trustworthy, ~96 BPM, no vocals*. File: `audio/music.mp3`.

---

## 4. Nhận diện hình ảnh (Brand Motion System)

- **Màu:**

  | Tên | Mã màu | Dùng cho |
  |---|---|---|
  | Xanh rêu | `#1F4434` | Màu đại lý |
  | Cam | `#EF6A12` | Màu xưởng |
  | Vàng | `#E7AA2E` | Giải thưởng |
  | Kem | `#F7F0E3` | Nền |
  | Đen | `#1B1B1B` | Chữ, viền |
  | Vàng cát | `#F2DC96` | Khung lưu ý |

- **Font:**
  - **Anton** cho tiêu đề và số, giãn dòng 1.34 lần cỡ chữ để dấu không lấn dòng.
  - **Be Vietnam Pro** cho chữ thường.
  - **DejaVu Sans Mono** cho dòng mã số "N° CTKM TẾT 2027".
- **Chuyển động:**
  - Đổi cảnh bằng vòng tròn màu loang từ giữa ra.
  - Mỗi cảnh zoom chậm vào khoảng 2,5%.
  - Chữ trượt lên kèm làm mờ chuyển động. Số "đập" vào (punch). Con dấu đập xuống kèm rung nhẹ.
  - Con số chạy (count-up). Thẻ trượt ngang. Cột thưởng mọc từ dưới lên.
- **Khung thẻ:** viền đen 5px, đổ bóng đặc lệch 10–12px, đúng kiểu poster.
- **Thanh tiến trình** màu vàng ở đáy màn hình.

---

## 5. Cấu trúc thư mục

```
video-ctkm-tet-2027/
├── ROSTAR_MuaRostar_QuaThaGa_DaiLy_9x16_v4.mp4   ← BẢN CUỐI
├── QUY_TRINH_LAM_VIDEO.md                        ← file này
├── motion-v4/            index.html (toàn bộ hình + hoạt hình), vo.js (thời lượng + mốc từng chữ),
│                         render.js (xuất khung hình), qa.js (kiểm tra chồng chữ), timing.json
├── assets/               logo, ảnh quà, QR, tiger_can.png, mug_left/right.png (đã tách nền),
│                         src_*.png (ảnh gốc anh/chị gửi)
├── audio/
│   ├── voice-v4-raw/     d01..d13.mp3: giọng Diệu gốc từ Topview
│   ├── voice-v4/         d01..d13.wav: đã rút khoảng lặng + nhấn từ khoá; words.json (mốc từng chữ)
│   ├── sfx/              stamp, pop, whoosh, flip, ding, cash, clink, fizz (.wav)
│   ├── music.mp3         nhạc nền Topview
│   └── mix4.m4a          âm thanh hoàn chỉnh bản 4
└── tools/                asr.py, process_vo.py, build_vo4.py, make_sfx.py, mix_audio.py
```

Các bản cũ (`motion/`, `motion-v2/`, `motion-v3/`, các file mp4 v1–v3) giữ lại để tham khảo.

---

## 6. Cách dựng lại bản cuối (từng bước)

### 6.1. Chuẩn bị môi trường (Linux)

```bash
# ffmpeg, Node + Playwright (Chromium), Python 3 + numpy + Pillow
pip install sherpa-onnx numpy pillow
# Font (từ repo google/fonts trên GitHub)
mkdir -p ~/.fonts && cd ~/.fonts
for f in ofl/anton/Anton-Regular.ttf ofl/bevietnampro/BeVietnamPro-{Medium,SemiBold,Bold,ExtraBold,Black}.ttf; do
  curl -sSfLO "https://raw.githubusercontent.com/google/fonts/main/$f"; done
fc-cache -f
# Model nhận dạng tiếng Việt (chỉ cần khi tạo lại giọng đọc)
mkdir -p /tmp/asr && cd /tmp/asr
curl -sSLO https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-zipformer-vi-int8-2025-04-20.tar.bz2
tar xjf sherpa-onnx-zipformer-vi-int8-2025-04-20.tar.bz2
```

### 6.2. Dựng lại y hệt từ file đã lưu (không tốn credit)

```bash
cd video-ctkm-tet-2027
# 1) Xuất hình (~3.700 khung, khoảng 15 phút)
cd motion-v4 && node render.js video visual.mp4 30 && cd ..
# 2) Âm thanh (đã có sẵn audio/mix4.m4a; hoặc trộn lại)
python3 tools/mix_audio.py motion-v4/timing.json audio/voice-v4 audio/sfx audio/music.mp3 audio/mix4.m4a
# 3) Ghép
ffmpeg -i motion-v4/visual.mp4 -i audio/mix4.m4a -map 0:v -map 1:a -c copy -shortest -movflags +faststart out_v4.mp4
```

- **Xem nhanh khung hình:** `node render.js preview 10 45.5 80` sẽ tạo `preview_<giây>.png`.
- **Xuất lại một đoạn:** `node render.js video seg.mp4 30 <giây_bắt_đầu> <giây_kết_thúc>`, rồi ghép đè đoạn đó vào video bằng ffmpeg (trim + concat).
- **Kiểm tra chồng chữ, dấu bị cắt, tràn khung:** `node qa.js`. Hiện chỉ còn báo con dấu xoay nghiêng ở cảnh 1, đây là báo nhầm, đã xem tận mắt.

### 6.3. Khi cần sửa lời đọc (tốn khoảng 0,1 credit mỗi câu)

1. **Tạo giọng trên Topview** (`topview_generate_voice`) với giọng Diệu, `voiceSpeed: 1.1`, `emotionName` và `pronRules` như mục 3.
   - Lấy file bằng `topview_query_task` với `needCloudFrontUrl: false`, để được link `aigc.s3.amazonaws.com` tải được. Link CloudFront và `api.topview.ai` bị chặn trong môi trường cloud.
   - Topview chỉ cho chạy **tối đa 4 tác vụ cùng lúc**.
2. **Kiểm tra phát âm:** `python3 tools/asr.py audio/voice-v4-raw/dXX.mp3`. Đọc kết quả xem có sai chữ không ("thưởng", "quý", "xưởng", ...).
3. **Hậu kỳ:** đặt file mới vào `audio/voice-v4-raw/`, rồi chạy `python3 tools/process_vo.py audio/voice-v4-raw audio/voice-v4`.
   - Khoảng lặng dài hơn 0,36 giây được rút còn khoảng 0,34 giây, ngưỡng -50 dB để không cắt lẹm phụ âm "x".
   - Các cụm trong danh sách `KEYS` được tăng khoảng 2,8 dB.
   - Mốc từng chữ xuất ra `words.json`.
   - Chạy lại `asr.py` trên file `.wav` đã xử lý để chắc không mất chữ.
4. **Đồng bộ hình:**
   - Cập nhật `VO_DUR` trong `motion-v4/vo.js` theo thời lượng mới.
   - Cập nhật các mốc `B11` (cảnh bia), `S12`, `S13`, `S14` theo `words.json`.
   - `WARP` là bảng ánh xạ thời gian theo từng chữ, do `tools/build_vo4.py` sinh ra. Script này cần các file giọng tham chiếu cũ (Đức/Huệ). Nếu không có, chỉ cần chỉnh tay các mốc của cảnh vừa đổi.
5. Xuất hình, trộn âm và ghép như mục 6.2.

### 6.4. Cảnh bia vector (cảnh 10): cách làm

- **Ảnh nguồn:** `assets/src_tiger_crystal_can.png` và `assets/src_mugs_vector.png`.
  - Nền trắng được xoá bằng flood-fill từ mép ảnh, ra `tiger_can.png`.
  - Ảnh hai ly được tách làm hai tại cột ít điểm ảnh nhất, giữ phần liền khối lớn nhất của mỗi bên, ra `mug_left.png` và `mug_right.png`.
- **Lon:** bay vào từ góc phải trên và xoay quanh miệng lon (`transform-origin: 50% 0`), từ 20° lên 128° để rót. Dòng bia là một div gradient vàng cam rơi từ miệng lon xuống mặt ly.
- **Ly đầy dần:**
  - Lớp dưới là ảnh ly chuyển xám, sáng và trong (`grayscale(1) brightness(1.9) opacity(.38)`), trông như ly rỗng.
  - Lớp trên là ảnh ly màu, cắt bằng `clip-path: inset(top)` giảm dần theo mức bia.
- **Cụng ly:** ly trái lùi sang trái và nghiêng -6°, ly phải trượt vào. Lúc chạm có tia sáng SVG, 14 giọt bia bay theo đường parabol, và tiếng "clink".
- **Thu nhỏ:** cả cụm thu về 0,6 lần và dời lên trên, chừa chỗ cho 2 thẻ lợi ích.
- **Mốc thời gian (`B11` trong vo.js):** `can`, `pourEnd`, `clink`, `shrink`, `r1`, `r2`, `win`, `road`, tính theo chữ trong lời đọc ("tiền mặt", "chúng tôi", "tạo hiệu ứng", "kéo thêm", "các bên", "để chúng ta").

---

## 7. Topview và chi phí

- **Tài khoản ban đầu:** 60 credit, kèm lượt miễn phí: 5 lượt MiniMax-H3, 5 lượt Wan 3.0, 10 lượt GPT Image 2.5.
- **Chi phí:**
  - Mỗi câu TTS khoảng 0,1 credit, một bản nhạc 1 credit.
  - Clip AI rót bia ở bản 3 dùng lượt miễn phí. Bản 4 không còn dùng clip này.
- **Sau bản 4:** còn khoảng **52,7 credit**.
- **Các mẫu giọng nữ tiếng Việt (để tham khảo khi đổi giọng):**

  | Giọng | voiceId | Tuổi | Nhà cung cấp |
  |---|---|---|---|
  | Thảo | `e3x7HMMVQjF8QwiifLZuTz0JPtUHrGKY` | Trẻ | minimax |
  | Linh | `9H147HxTYbWiMlMwkwNfiWRTP2WdTiu2` | Trẻ | minimax |
  | Ngọc | `ue7Helc3oHfFdOIa6mTQiPLvkUrwtRM6` | Trẻ | minimax |
  | Hương | `eowaPuc2clGL516rKnnGzqBSMLUvito5` | Trẻ | minimax |
  | Mai | `0XUlfbBk8RSVpCOdpKYghrKTMA9wTYM9` | Trẻ | minimax |
  | **Diệu** | `RrX5R95zGMJ9L2jAfvOurLjjBdDMpoPz` | Trẻ | minimax (**đang dùng**) |
  | Liên | `iDTTym2NrGRnFPqQ8fjzUGjPcllI37Hv` | Lớn tuổi | elevenlabs |
  | Huệ | `3hX3qAk6pUplBjo9EOjvOGlcuu0Oaiia` | Lớn tuổi | elevenlabs (đọc sai "thưởng") |

- **Giọng nam đã dùng ở bản 1–2:** Đức, `e5zquuJ5fILUxBHoySQqR9b0FxOGVRcH`.
