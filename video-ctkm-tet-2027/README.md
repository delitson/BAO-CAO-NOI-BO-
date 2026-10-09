# Video CTKM Tết 2027 – "Mua ROSTAR – Quà thả ga" (dành cho Đại lý)

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
