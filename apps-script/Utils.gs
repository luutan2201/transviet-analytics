/**
 * Utils.gs
 * Small, single-responsibility helper functions shared across the Apps Script project.
 */

function logInfo(message) {
  if (CONFIG.DEBUG_MODE) {
    Logger.log("[INFO] " + message);
  }
}

function logError(message) {
  Logger.log("[ERROR] " + message);
}

/**
 * Coerces a cell value to a non-negative number.
 * Handles Vietnamese-style formatting where "." is a thousands separator and
 * "," is the decimal separator (e.g. "9.873" -> 9873, "4808,70" -> 4808.7),
 * per the user's real sheet. Defaults invalid/empty values to 0.
 */
function toSafeNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value < 0 ? 0 : value;

  var str = String(value).trim().replace(/%/g, "");
  // Vietnamese format: remove thousands dots, convert decimal comma to dot.
  str = str.replace(/\./g, "").replace(/,/g, ".");

  var num = Number(str);
  if (isNaN(num) || num < 0) return 0;
  return num;
}

/** Coerces a cell value to a trimmed string, defaulting to empty string. */
function toSafeString(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

/** Derives calendar quarter (1-4) from a month number (1-12). */
function monthToQuarter(month) {
  return Math.ceil(month / 3);
}

/**
 * Parses a week's date range string (e.g. "01/01 - 04/01", "28/01-03/02") and
 * returns the month (1-12) of the RANGE'S START DATE, used as the week's month.
 * Returns null if the string can't be parsed.
 */
function parseWeekRangeMonth(rangeStr) {
  var match = String(rangeStr).match(/(\d{1,2})\/(\d{1,2})/);
  if (!match) return null;
  var month = parseInt(match[2], 10);
  if (month < 1 || month > 12) return null;
  return month;
}
