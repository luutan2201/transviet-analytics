/**
 * Debug.gs
 * Chạy hàm này thủ công (nút "Chạy" ở Apps Script editor, chọn debugListSheets)
 * rồi xem kết quả tại "Nhật ký thực thi" (Execution log) để kiểm tra:
 * 1. SPREADSHEET_ID có đang trỏ đúng file Sheet không.
 * 2. Tên chính xác (từng ký tự) của các tab hiện có.
 * Xoá file này sau khi debug xong nếu muốn dọn project.
 */
function debugListSheets() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  Logger.log("Tên file Sheet đang mở: " + ss.getName());

  var sheets = ss.getSheets();
  Logger.log("Số lượng tab: " + sheets.length);

  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName();
    Logger.log(i + ': "' + name + '" (length=' + name.length + ")");
  }
}

/**
 * Dumps the raw content of the first few rows of the Weekly Data sheet as JSON,
 * so hidden characters (newlines, extra spaces, wrong row position) become visible.
 */
function debugWeeklyHeaders() {
  var sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(
    CONFIG.SHEET_NAMES.WEEKLY_DATA
  );
  if (!sheet) {
    Logger.log("KHÔNG tìm thấy sheet: " + CONFIG.SHEET_NAMES.WEEKLY_DATA);
    return;
  }

  var values = sheet.getDataRange().getValues();
  Logger.log("Tổng số dòng đọc được: " + values.length);
  Logger.log("Tổng số cột đọc được: " + (values[0] ? values[0].length : 0));

  var rowsToShow = Math.min(3, values.length);
  for (var r = 0; r < rowsToShow; r++) {
    Logger.log("--- Dòng " + (r + 1) + " (raw JSON) ---");
    Logger.log(JSON.stringify(values[r]));
  }
}
