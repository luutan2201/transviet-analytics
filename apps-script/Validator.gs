/**
 * Validator.gs
 * Validates spreadsheet structure and individual rows before they are mapped.
 * Invalid rows are skipped and logged — the API never crashes on bad data.
 */

function validateSheetExists(sheetName) {
  var sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
  if (!sheet) {
    throw new ApiError("DATA_NOT_FOUND", 'Sheet "' + sheetName + '" was not found.');
  }
  return sheet;
}

function validateHeaders(headers, requiredColumns) {
  var normalized = headers.map(normalizeHeader);
  var missing = [];
  for (var i = 0; i < requiredColumns.length; i++) {
    if (normalized.indexOf(requiredColumns[i]) === -1) {
      missing.push(requiredColumns[i]);
    }
  }
  if (missing.length > 0) {
    throw new ApiError("INVALID_SCHEMA", "Missing required columns: " + missing.join(", "));
  }
}

/**
 * Returns true if a raw "Weekly Data" row has the minimum required fields to
 * be usable: a week label and a parseable date range.
 */
function isValidWeeklyRow(row) {
  if (!row["Tuần"] || toSafeString(row["Tuần"]) === "") return false;
  if (!parseWeekRangeMonth(row["Khoảng thời gian"])) return false;
  return true;
}

/** Minimal custom error type carrying an API error code, thrown/caught by Code.gs. */
function ApiError(code, message) {
  this.name = "ApiError";
  this.code = code;
  this.message = message;
}
ApiError.prototype = Object.create(Error.prototype);
