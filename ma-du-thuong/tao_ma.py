#!/usr/bin/env python3
"""Tạo mã dự thưởng ROSTAR.

Chạy:  python3 tao_ma.py
Kết quả:
  - codes.js       : chỉ chứa mã băm (SHA-256), đưa lên website cùng index.html
  - danh_sach_ma.csv : mã gốc + giải, CHỈ giữ nội bộ để in thẻ và đối chiếu khi khách nhắn Zalo/Fanpage
"""
import csv
import hashlib
import json
import secrets

# Chuỗi bí mật trộn vào mã băm. Đổi chuỗi này mỗi đợt khuyến mãi.
SALT = "ROSTAR-2026-DOT-1"

# Cơ cấu giải: (tên giải, mô tả, số lượng)
PRIZES = [
    ("Giải Nhất", "Phần thưởng giá trị nhất của chương trình", 1),
    ("Giải Nhì", "Phần thưởng hấp dẫn từ ROSTAR", 5),
    ("Giải Ba", "Quà tặng từ ROSTAR", 20),
    ("Giải Khuyến Khích", "Quà tặng tri ân khách hàng", 200),
    ("Chúc bạn may mắn lần sau", "", 774),
]

# Bỏ các ký tự dễ nhầm: 0/O, 1/I/L
ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"


def new_code():
    return "".join(secrets.choice(ALPHABET) for _ in range(8))


def code_hash(code):
    return hashlib.sha256((SALT + code).encode()).hexdigest()


def main():
    used = set()
    rows = []
    for idx, (name, _desc, count) in enumerate(PRIZES):
        for _ in range(count):
            code = new_code()
            while code in used:
                code = new_code()
            used.add(code)
            rows.append((code, idx))
    secrets.SystemRandom().shuffle(rows)

    data = {
        "salt": SALT,
        "prizes": [{"name": n, "desc": d} for n, d, _ in PRIZES],
        "codes": {code_hash(c): i for c, i in rows},
    }
    with open("codes.js", "w", encoding="utf-8") as f:
        f.write("window.ROSTAR_CODES=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")

    with open("danh_sach_ma.csv", "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["STT", "Mã", "Giải"])
        for i, (c, idx) in enumerate(rows, 1):
            w.writerow([i, c[:4] + " " + c[4:], PRIZES[idx][0]])

    print(f"Đã tạo {len(rows)} mã -> codes.js, danh_sach_ma.csv")


if __name__ == "__main__":
    main()
