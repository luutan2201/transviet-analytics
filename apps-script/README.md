# TransViet Analytics — Apps Script API

Backend nhẹ đóng vai trò REST API gateway giữa Google Sheet và frontend.

**Đã tuỳ chỉnh khớp đúng cấu trúc sheet thật của bạn** — không cần đổi tên cột trong Google Sheet.

## Cấu trúc Google Sheet của bạn

Tab `Weekly Data` với các cột:

```
Tuần | Khoảng thời gian | Reach | Impressions | Followers | Reactions | Comments | Shares | Clicks (Link) | Video Views | Engagement Rate (%) | Ghi chú
```

Ví dụ dòng dữ liệu:

```
W01 | 01/01 - 04/01 | 207 | 81 | 0 | 80 | 1 | 0 | 9.873 | 0 | 4808,70 | (trống)
```

Ghi chú xử lý:
- **Tháng/Quý/Năm** được tự suy ra từ cột "Khoảng thời gian" (lấy tháng của ngày bắt đầu) + `DEFAULT_SHEET_YEAR` trong `Config.gs` — sheet của bạn không cần cột Year/Month/Quarter riêng.
- **Số định dạng kiểu Việt Nam** (`.` = phân cách nghìn, `,` = thập phân, ví dụ `9.873` → 9873) được parse đúng tự động, dù ô là số hay chữ.
- **`Engagement Rate (%)` và `Ghi chú` bị bỏ qua** — dashboard tự tính lại engagement rate từ dữ liệu thô (Reactions+Comments+Shares / Reach).
- Mỗi đầu năm mới, cập nhật `CONFIG.DEFAULT_SHEET_YEAR` trong `Config.gs` (hoặc tạo sheet/tab mới cho năm mới và deploy lại).

### `KPI` (tuỳ chọn)

```
Metric | Target | PeriodType | Month | Quarter | Year | Enabled
Reach  | 300000 | month      | 7     | 1       | 2026 | true
```

### `Settings` (tuỳ chọn)

```
theme       | dark
brandColor  | #147E93
defaultYear | 2026
```

## Deploy

1. Mở Google Sheet → **Extensions → Apps Script**.
2. Xoá `Code.gs` mặc định, tạo lần lượt các file trong thư mục này (`Config.gs`, `Utils.gs`,
   `Validator.gs`, `Mapper.gs`, `Response.gs`, `Dashboard.gs`, `KPI.gs`, `Settings.gs`,
   `Sync.gs`, `Code.gs`) và copy đúng nội dung tương ứng.
3. Mở `Config.gs`, điền `SPREADSHEET_ID` (lấy từ URL sheet, đoạn giữa `/d/` và `/edit`).
   Kiểm tra `DEFAULT_SHEET_YEAR` đúng năm dữ liệu hiện tại (mặc định 2026).
4. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy **Web App URL** vừa tạo.
6. Dán vào `.env.local` của frontend:
   ```
   NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXX/exec
   ```
   Hoặc dán trực tiếp vào **Settings → Nguồn dữ liệu** trong app (có nút "Kiểm tra kết nối").
7. Restart `pnpm dev` (nếu dùng `.env.local`) — Dashboard sẽ tự động chuyển từ Mock Repository
   sang Google Sheet thật, không cần sửa code frontend.

## Test thủ công

Sau khi deploy, mở trực tiếp URL trong trình duyệt:

```
https://script.google.com/macros/s/XXXXX/exec?action=dashboard&year=2026
```

Kết quả phải là JSON có `success: true` và `data.weekly` chứa các tuần đã map đúng
(`week`, `month`, `quarter`, `year`, `reach`, `impressions`, `followers`, `reactions`,
`comments`, `shares`, `clicks`, `videoViews`).

## Lưu ý quan trọng về CORS

Apps Script Web App **không hỗ trợ set custom response header** (không có
`Access-Control-Allow-Origin` tuỳ chỉnh, không xử lý được preflight `OPTIONS`).
Vì vậy mọi request từ frontend đến Apps Script đều là **GET** hoặc **POST không kèm
body/JSON header** (tránh trigger preflight) — đã xử lý sẵn ở
`dashboard.repository.google-sheet.ts`.

## Xác thực (tuỳ chọn)

Đặt `CONFIG.API_TOKEN` trong `Config.gs` nếu muốn yêu cầu token khi gọi API
(`?token=xxx`). Mặc định để trống = không yêu cầu token.
