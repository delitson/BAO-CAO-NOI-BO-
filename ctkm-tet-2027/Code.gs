/**
 * ROSTAR – TRANG NHẬN QUÀ (Google Apps Script)
 * ------------------------------------------------------------
 * Chạy trên Google Sheets đã tải từ file "Du_lieu_phieu_Rostar_FINAL.xlsx".
 * Đọc/ghi các tab: DB_The, DB_DaiLy, DB_NhanGiai, DB_NhatKy (giữ nguyên tên tab).
 *
 * Luồng: mã 8 ký tự in rõ trên phiếu (không lớp cào). Xưởng quét QR, nhập mã + tên xưởng + SĐT + tên đại lý
 *   → kiểm tra mã → khóa mã vào SĐT đó → hiện giải ngay trên web
 *   → xưởng chụp màn hình gửi Zalo/Fanpage → Rostar gọi xác minh, đối chiếu hóa đơn rồi trao quà.
 *
 * Danh sách mã và giải chỉ nằm trong Sheet, KHÔNG BAO GIỜ gửi xuống trình duyệt.
 * Trình duyệt chỉ nhận lại giải của đúng mã vừa nhập hợp lệ.
 */

const CFG = {
  SHEET_THE: 'DB_The',
  SHEET_DL: 'DB_DaiLy',
  SHEET_NG: 'DB_NhanGiai',
  SHEET_LOG: 'DB_NhatKy',
  STATUS_ACTIVE: 'Đã giao ĐL',          // chỉ phiếu ở trạng thái này mới mở được
  STATUS_CLAIMED: 'Chờ xác minh',        // trạng thái sau khi xưởng mở phiếu
  STATUS_DONE: ['Chờ xác minh', 'Đã xác minh', 'Đã trao'],
  STATUS_CANCEL: 'Hủy',
  DEADLINE: new Date('2027-01-28T23:59:59+07:00'), // hạn nhận giải
  ALPHABET: '23456789ABCDEFGHJKMNPQRSTUVWXYZ',     // bỏ 0, O, 1, I, L
  CODE_LEN: 8,
  MAX_FAIL: 5,             // số lần nhập sai tối đa cho 1 SĐT ...
  FAIL_WINDOW_SEC: 900,    // ... trong 15 phút
  MANY_CARDS_FLAG: 16,     // 1 SĐT mở từ phiếu thứ 16 trở lên thì gắn cờ (thể lệ: trên 15 phiếu kiểm tra trực tiếp)
  PRIZE_TITLE: { DB: 'Giải Đặc biệt', NHAT: 'Giải Nhất', NHI: 'Giải Nhì', BA: 'Giải Ba', TU: 'Giải Tư', NAM: 'Giải Năm' }
};

/* ============ CỔNG VÀO ============ */

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'dealers') {
    return json_(api({ action: 'dealers' }));
  }
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Nhận quà Rostar')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  let req = {};
  try { req = JSON.parse(e.postData.contents); } catch (err) { return json_(fail_('LOI', 'Dữ liệu gửi lên không đọc được.')); }
  return json_(api(req));
}

/** Gọi được cả từ google.script.run (chạy trong Apps Script) lẫn doPost (host ngoài). */
function api(req) {
  try {
    req = typeof req === 'string' ? JSON.parse(req) : (req || {});
    if (req.action === 'dealers') return { ok: true, dealers: getDealers_() };
    if (req.action === 'claim') return claim_(req);
    return fail_('LOI', 'Yêu cầu không hợp lệ.');
  } catch (err) {
    console.error(err);
    return fail_('LOI', 'Hệ thống đang bận, thử lại sau ít phút.');
  }
}

/* ============ MỞ PHIẾU ============ */

function claim_(req) {
  const code = normCode_(req.code);
  const phone = normPhone_(req.phone);
  const name = clean_(req.name, 80);
  const dealerText = clean_(req.dealer, 100);

  // 1. Kiểm tra dữ liệu nhập
  if (new Date() > CFG.DEADLINE) return fail_('HET_HAN', 'Chương trình đã hết hạn nhận quà (28/01/2027).');
  if (!new RegExp('^[' + CFG.ALPHABET + ']{' + CFG.CODE_LEN + '}$').test(code)) {
    return fail_('MA_SAI_DANG', 'Mã gồm 8 ký tự, không có chữ O, I, L và số 0, 1. Kiểm tra lại mã trên phiếu.');
  }
  if (!phone) return fail_('SDT_SAI', 'Số điện thoại chưa đúng. Nhập số di động 10 số, ví dụ 0905 123 456.');
  if (!name) return fail_('THIEU', 'Nhập tên xưởng như đại lý ghi trên phiếu.');
  if (!dealerText) return fail_('THIEU', 'Nhập tên đại lý đã bán hàng cho xưởng.');

  // Đại lý xưởng gõ tay → dò theo Mã KH hoặc Tên đại lý trong DB_DaiLy (không khớp vẫn cho mở, chỉ gắn cờ)
  const dealer = matchDealer_(dealerText);

  // 2. Chặn nhập sai liên tục
  const cache = CacheService.getScriptCache();
  const failKey = 'fail:' + phone;
  const fails = Number(cache.get(failKey) || 0);
  if (fails >= CFG.MAX_FAIL) {
    log_(phone, code, 'Tạm khóa', 'Nhập sai quá ' + CFG.MAX_FAIL + ' lần');
    return fail_('QUA_NHIEU', 'Nhập sai quá nhiều lần. Thử lại sau 15 phút hoặc gọi hotline.');
  }
  const addFail = () => cache.put(failKey, String(fails + 1), CFG.FAIL_WINDOW_SEC);

  // 3. SĐT nội bộ đại lý (chủ, người nhà, NV) không được nhận
  if (isBlockedPhone_(phone)) {
    log_(phone, code, 'SĐT bị chặn', 'Trùng SĐT nội bộ khai báo trong DB_DaiLy');
    return fail_('SDT_CHAN', 'Số điện thoại này không đủ điều kiện nhận quà theo thể lệ. Cần hỗ trợ, gọi hotline Rostar.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sh = SpreadsheetApp.getActive().getSheetByName(CFG.SHEET_THE);
    const H = headerMap_(sh);
    const found = sh.getRange(2, H['Mã nhận giải'], Math.max(sh.getLastRow() - 1, 1), 1)
      .createTextFinder(code).matchEntireCell(true).matchCase(false).findNext();

    if (!found) {
      addFail();
      log_(phone, code, 'Sai mã', '');
      return fail_('MA_SAI', 'Không tìm thấy mã này. Kiểm tra lại 8 ký tự trên phiếu (chữ in hoa).');
    }

    const r = found.getRow();
    const row = sh.getRange(r, 1, 1, sh.getLastColumn()).getValues()[0];
    const get = h => row[H[h] - 1];
    const status = String(get('Trạng thái') || '').trim();
    const prize = prizeOf_(get('Mã giải'), get('Giải'));
    const seri = String(get('Seri') || '');

    // Mã đã mở trước đó
    if (CFG.STATUS_DONE.indexOf(status) >= 0) {
      const owner = normPhone_(get('SĐT nhận'));
      if (owner === phone) {
        log_(phone, code, 'Tra lại', status);
        return Object.assign({ ok: true, again: true, status: status, seri: seri, phoneMasked: mask_(phone),
          openedAt: fmtTime_(get('Ngày nhận')) }, prize);
      }
      addFail();
      log_(phone, code, 'Đã dùng', 'Đã mở bởi ' + mask_(owner));
      return fail_('DA_DUNG', 'Mã này đã được mở bằng số ' + mask_(owner) + '. Nếu đây là phiếu của xưởng bạn, gọi hotline Rostar.');
    }
    if (status === CFG.STATUS_CANCEL) {
      log_(phone, code, 'Phiếu đã hủy', '');
      return fail_('HUY', 'Phiếu này đã bị hủy. Gọi hotline Rostar để được hỗ trợ.');
    }
    if (status !== CFG.STATUS_ACTIVE) {
      addFail();
      log_(phone, code, 'Chưa giao ĐL', 'Trạng thái: ' + status);
      return fail_('CHUA_KICH_HOAT', 'Phiếu chưa được kích hoạt. Gọi hotline Rostar, đọc seri và mã trên phiếu để được kiểm tra.');
    }

    // 4. Cờ cảnh báo cho sale admin (không chặn xưởng)
    const flags = [];
    const assigned = String(get('Mã đại lý') || '').trim();
    if (!dealer) flags.push('Đại lý xưởng nhập ("' + dealerText + '") không có trong DB_DaiLy');
    else if (assigned && assigned !== dealer.id) flags.push('Đại lý xưởng nhập (' + dealer.id + ') khác đại lý được giao seri (' + assigned + ')');
    const opened = countClaimsByPhone_(phone);
    if (opened + 1 >= CFG.MANY_CARDS_FLAG) flags.push('SĐT này đã mở ' + (opened + 1) + ' phiếu, kiểm tra trực tiếp');

    // 5. Khóa mã vào SĐT
    const now = new Date();
    sh.getRange(r, H['Trạng thái']).setValue(CFG.STATUS_CLAIMED);
    sh.getRange(r, H['SĐT nhận']).setNumberFormat('@').setValue(phone);
    sh.getRange(r, H['Ngày nhận']).setValue(now);

    // 6. Ghi 1 dòng nhận giải (Số HĐ, ảnh màn hình, kênh xác nhận: sale admin điền khi xưởng nhắn Zalo/Fanpage)
    appendByHeader_(CFG.SHEET_NG, {
      'Thời gian': now,
      'Kênh': 'Web',
      'Seri': seri,
      'Mã nhận giải': code,
      'SĐT trên phiếu': phone,
      'Tên xưởng': name,
      'Tỉnh': dealer ? dealer.tinh : '',
      'Cờ cảnh báo': flags.join('; '),
      'Đã báo giải': 'Xưởng tự xem trên web',
      'Đại lý (xưởng nhập)': dealer ? dealerText + ' → ' + dealer.id : dealerText,
      'Giải (hiện trên web)': prize.title + ' – ' + prize.desc
    }, ['SĐT trên phiếu']);

    log_(phone, code, 'Hợp lệ', flags.join('; '));
    cache.remove(failKey);
    return Object.assign({ ok: true, again: false, status: CFG.STATUS_CLAIMED, seri: seri,
      phoneMasked: mask_(phone), openedAt: fmtTime_(now) }, prize);
  } finally {
    lock.releaseLock();
  }
}

/* ============ DỮ LIỆU PHỤ ============ */

/** Danh sách đại lý cho ô chọn. DB_DaiLy có cột "Tên đại lý" thì hiện tên (và ẩn dòng để trống tên); chưa có cột thì hiện Mã KH. */
function getDealers_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('dealers');
  if (hit) return JSON.parse(hit);
  const sh = SpreadsheetApp.getActive().getSheetByName(CFG.SHEET_DL);
  const vals = sh.getDataRange().getValues();
  const head = vals[0].map(h => String(h).trim());
  const iId = head.indexOf('Mã KH');
  const iTinh = head.indexOf('Tỉnh');
  let iName = head.findIndex(h => h.indexOf('Tên đại lý') === 0);
  // Cột tên có nhưng chưa điền dòng nào thì tạm hiện Mã KH cho tất cả
  if (iName >= 0 && !vals.slice(1).some(v => String(v[iName] || '').trim())) iName = -1;
  // Có cột "Tên đại lý" thì chỉ hiện đại lý đã điền tên (để trống = ẩn, dùng cho tài khoản nội bộ, khách lẻ)
  const list = vals.slice(1)
    .filter(v => String(v[iId] || '').trim() && (iName < 0 || String(v[iName] || '').trim()))
    .map(v => ({
      id: String(v[iId]).trim(),
      name: iName >= 0 && String(v[iName] || '').trim() ? String(v[iName]).trim() : String(v[iId]).trim(),
      tinh: String(v[iTinh] || 'Khác').trim()
    }))
    .sort((a, b) => a.tinh.localeCompare(b.tinh, 'vi') || a.name.localeCompare(b.name, 'vi'));
  cache.put('dealers', JSON.stringify(list), 600);
  return list;
}

function isBlockedPhone_(phone) {
  const cache = CacheService.getScriptCache();
  let set = cache.get('blocked');
  if (!set) {
    const sh = SpreadsheetApp.getActive().getSheetByName(CFG.SHEET_DL);
    const vals = sh.getDataRange().getValues();
    const i = vals[0].findIndex(h => String(h).indexOf('SĐT nội bộ') === 0);
    const nums = [];
    if (i >= 0) vals.slice(1).forEach(v => String(v[i] || '').split(/[,;\n/]+/).forEach(s => {
      const p = normPhone_(s); if (p) nums.push(p);
    }));
    set = '|' + nums.join('|') + '|';
    cache.put('blocked', set, 300);
  }
  return set.indexOf('|' + phone + '|') >= 0;
}

function countClaimsByPhone_(phone) {
  const sh = SpreadsheetApp.getActive().getSheetByName(CFG.SHEET_NG);
  if (sh.getLastRow() < 2) return 0;
  const H = headerMap_(sh);
  return sh.getRange(2, H['SĐT trên phiếu'], sh.getLastRow() - 1, 1).getValues()
    .filter(v => normPhone_(v[0]) === phone).length;
}

function prizeOf_(prizeCode, prizeText) {
  const key = String(prizeCode || '').trim().toUpperCase();
  const parts = String(prizeText || '').split(' – ');
  return {
    prizeCode: key,
    title: CFG.PRIZE_TITLE[key] || parts[0] || 'Quà Rostar',
    desc: parts.slice(1).join(' – ') || ''
  };
}

/**
 * Dò tên đại lý xưởng gõ tay với DB_DaiLy: khớp Mã KH, hoặc khớp 1 trong các tên ở cột "Tên đại lý"
 * (nhiều tên cách nhau bằng dấu phẩy). So không dấu, không phân biệt hoa thường; tên này chứa tên kia cũng tính là khớp.
 * Khớp đúng 1 đại lý thì trả về {id, tinh}; không khớp hoặc khớp nhiều đại lý thì trả về null.
 */
function matchDealer_(text) {
  const q = fold_(text);
  if (!q) return null;
  const cache = CacheService.getScriptCache();
  let list = JSON.parse(cache.get('dealerIndex') || 'null');
  if (!list) {
    const vals = SpreadsheetApp.getActive().getSheetByName(CFG.SHEET_DL).getDataRange().getValues();
    const head = vals[0].map(h => String(h).trim());
    const iId = head.indexOf('Mã KH'), iTinh = head.indexOf('Tỉnh');
    const iName = head.findIndex(h => h.indexOf('Tên đại lý') === 0);
    list = vals.slice(1).filter(v => String(v[iId] || '').trim()).map(v => ({
      id: String(v[iId]).trim(),
      tinh: String(v[iTinh] || '').trim(),
      keys: [String(v[iId])].concat(iName >= 0 ? String(v[iName] || '').split(/[,;\n]+/) : [])
        .map(fold_).filter(k => k.length >= 3)
    }));
    cache.put('dealerIndex', JSON.stringify(list), 600);
  }
  const exact = list.filter(d => d.keys.indexOf(q) >= 0);
  const hits = exact.length ? exact : list.filter(d => d.keys.some(k => q.indexOf(k) >= 0 || (q.length >= 4 && k.indexOf(q) >= 0)));
  return hits.length === 1 ? { id: hits[0].id, tinh: hits[0].tinh } : null;
}

/** Bỏ dấu, chữ thường, bỏ khoảng trắng và ký tự lạ; bỏ chữ "đại lý"/"DL" đứng đầu. */
function fold_(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().replace(/^\s*(dai ly|dl)\s+/, '').replace(/[^a-z0-9]/g, '');
}

/* ============ TIỆN ÍCH ============ */

function headerMap_(sh) {
  const head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(h => String(h).trim());
  const map = {};
  head.forEach((h, i) => { if (h && !(h in map)) map[h] = i + 1; });
  return new Proxy(map, {
    get(t, k) {
      if (k in t) return t[k];
      const i = head.findIndex(h => h.indexOf(k) === 0);
      if (i < 0) throw new Error('Thiếu cột "' + String(k) + '" trong tab ' + sh.getName());
      return i + 1;
    }
  });
}

/** Ghi 1 dòng theo tên cột; cột nào chưa có thì thêm vào cuối hàng tiêu đề. */
function appendByHeader_(sheetName, obj, textCols) {
  const sh = SpreadsheetApp.getActive().getSheetByName(sheetName);
  let head = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0].map(h => String(h).trim());
  const colOf = k => head.findIndex(h => h === k || h.indexOf(k) === 0);
  Object.keys(obj).forEach(k => {
    if (colOf(k) < 0) { head.push(k); sh.getRange(1, head.length).setValue(k).setFontWeight('bold'); }
  });
  const row = new Array(head.length).fill('');
  Object.keys(obj).forEach(k => { row[colOf(k)] = obj[k]; });
  const r = sh.getLastRow() + 1;
  (textCols || []).forEach(k => sh.getRange(r, colOf(k) + 1).setNumberFormat('@'));
  sh.getRange(r, 1, 1, row.length).setValues([row]);
}

function log_(phone, code, result, note) {
  try {
    appendByHeader_(CFG.SHEET_LOG, { 'Thời gian': new Date(), 'SĐT': phone, 'Mã nhập': code, 'Kết quả': result, 'Ghi chú': note || '' }, ['SĐT']);
  } catch (e) { console.error(e); }
}

function normCode_(s) {
  return String(s || '').toUpperCase().replace(/[\s\-.]/g, '');
}

function normPhone_(s) {
  let p = String(s || '').replace(/[^\d+]/g, '');
  if (p.indexOf('+84') === 0) p = '0' + p.slice(3);
  else if (p.indexOf('84') === 0 && p.length === 11) p = '0' + p.slice(2);
  else if (/^[35789]\d{8}$/.test(p)) p = '0' + p;   // Sheets làm mất số 0 đầu
  return /^0[35789]\d{8}$/.test(p) ? p : '';
}

function mask_(p) { return p ? p.slice(0, 4) + ' xxx ' + p.slice(-3) : 'khác'; }

function clean_(s, max) { return String(s || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max); }

function fmtTime_(d) {
  return d instanceof Date ? Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'HH:mm dd/MM/yyyy') : '';
}

function fail_(code, msg) { return { ok: false, error: code, msg: msg }; }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ============ CHẠY 1 LẦN KHI CÀI ĐẶT ============ */

/** Bấm Chạy hàm này 1 lần: cấp quyền, kiểm tra đủ tab/cột. Xem kết quả ở Nhật ký thực thi. */
function kiemTraCaiDat() {
  const ss = SpreadsheetApp.getActive();
  [CFG.SHEET_THE, CFG.SHEET_DL, CFG.SHEET_NG, CFG.SHEET_LOG].forEach(n => {
    if (!ss.getSheetByName(n)) throw new Error('Thiếu tab ' + n);
  });
  const H = headerMap_(ss.getSheetByName(CFG.SHEET_THE));
  ['Seri', 'Mã nhận giải', 'Mã giải', 'Giải', 'Trạng thái', 'Mã đại lý', 'SĐT nhận', 'Ngày nhận'].forEach(h => H[h]);
  CacheService.getScriptCache().removeAll(['dealers', 'dealerIndex', 'blocked']);
  const dealers = getDealers_();
  const active = ss.getSheetByName(CFG.SHEET_THE).getRange(2, H['Trạng thái'], ss.getSheetByName(CFG.SHEET_THE).getLastRow() - 1, 1)
    .getValues().filter(v => v[0] === CFG.STATUS_ACTIVE).length;
  console.log('OK. Đại lý: ' + dealers.length + '. Phiếu đang "Đã giao ĐL": ' + active + '.');
}

/** Chạy sau khi sửa DB_DaiLy (thêm tên, thêm SĐT nội bộ) để web nhận ngay, không chờ 10 phút. */
function lamMoiDanhSach() {
  CacheService.getScriptCache().removeAll(['dealers', 'dealerIndex', 'blocked']);
  console.log('Đã làm mới danh sách đại lý và SĐT nội bộ.');
}
