# Video CTKM Tết 2027 – "Mua ROSTAR – Quà thả ga" (dành cho Đại lý)

## Bản 3 (mới nhất): `ROSTAR_MuaRostar_QuaThaGa_DaiLy_9x16_v3.mp4` – ~2:22
Nguồn: `motion-v3/` (clip AI rót bia/cụng ly: `motion-v3/clip/tiger_pour_clink.mp4`, tạo bằng Topview Wan 3.0),
âm thanh `audio/mix3.m4a`. Giọng nữ "Huệ" (Topview TTS), tăng tốc 15% khi ghép.
- Sửa chồng chữ / dấu bị cắt: font Anton được giãn dòng tự động; `motion-v3/qa.js` kiểm tra va chạm theo nét chữ thực.
- Quà: "Bia Tiger Cool Pack", "Bộ bản lề 4D ROSTAR 17cm"; bỏ dòng "phiếu giao kèm đơn từ 19/10".
- Cảnh "Quà cực kỳ hấp dẫn": clip rót bia Tiger, cụng ly, tiền & voucher bay.

Trước khi render: tách khung clip `ffmpeg -i clip/tiger_pour_clink.mp4 -vf "fps=30,scale=800:-2" -q:v 3 clip/f%04d.jpg`.

## Bản 2: `ROSTAR_MuaRostar_QuaThaGa_DaiLy_9x16_v2.mp4` – ~2:15
Nguồn: `motion-v2/` (độ dài giọng đọc ở `motion-v2/vo.js`), âm thanh `audio/mix2.m4a`.
Giọng đọc "Đức" tốc độ 1.05 và tăng thêm 8% khi ghép. Phát âm: ROSTAR = "Rốt-ta", KLV = "Ka Lờ Vê".

14 cảnh: mở đầu → tên chương trình → chương trình tri ân khách hàng xưởng (ROSTAR → Đại lý → Xưởng)
→ 20 triệu = 1 điểm + 5 phiếu → mỗi đơn từ 4 triệu phát 1 phiếu cho xưởng → giải thưởng → xưởng mở quà 3 bước
→ bậc thưởng đại lý → 1–1,5% doanh số → biên lợi nhuận ổn định so với hàng thịnh hành → các bên cùng có lợi
→ đại lý cần thực hiện → lưu ý → hotline.

## Bản 1: `ROSTAR_MuaRostar_QuaThaGa_DaiLy_9x16.mp4` – ~1:30 (nguồn `motion/`)

- **Thành phẩm:** `ROSTAR_MuaRostar_QuaThaGa_DaiLy_9x16.mp4` (1080×1920, 30fps, ~1:30)
- **Giọng đọc:** Topview TTS, giọng nam "Đức" (tiếng Việt), tốc độ 0.95
- **Nhạc nền:** Topview Music (không lời), tự giảm âm lượng khi có giọng đọc
- **Hình:** motion graphics dựng bằng HTML (`motion/index.html`), chữ và số liệu lấy đúng theo thông báo CTKM

## 8 cảnh
1. Kính gửi Quý Đại lý (logo + con dấu "Dành cho Đại lý")
2. Tên chương trình + thời gian 10.10.2026 → 25.01.2027
3. Xưởng: mỗi 4 triệu tiền hàng = 1 phiếu
4. 100% phiếu có quà, giải đặc biệt 5.000.000đ, các quà tặng
5. Thưởng đại lý: 20 triệu = 1 điểm + 5 phiếu; bậc 200.000đ / 300.000đ mỗi điểm
6. Đại lý được thêm 1–1,5% doanh số, biên lợi nhuận được đảm bảo, cùng xây dựng thương hiệu
7. Ba việc đại lý cần làm
8. Lưu ý + hotline + lời cảm ơn

## Dựng lại hình
Cần font Anton và Be Vietnam Pro trong `~/.fonts`, Playwright và ffmpeg.

```bash
cd motion
node render.js preview 10 40     # xem thử khung hình tại giây 10, 40
node render.js video visual.mp4  # xuất toàn bộ phần hình
ffmpeg -i visual.mp4 -i ../audio/mix.m4a -map 0:v -map 1:a -c copy -shortest out.mp4
```

Thời lượng từng cảnh được tính từ độ dài giọng đọc (mảng `VO` trong `index.html`).
