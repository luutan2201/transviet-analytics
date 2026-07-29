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
 * Parses a week's date range string (e.g. "01/01 - 04/01", "29/06 - 05/07") and
 * returns which month (1-12) the MAJORITY of days in that range belong to.
 * If the range spans two months, whichever month has more days within the
 * range wins (ties go to the start month). Returns null if unparseable.
 */
function resolveWeekMonth(rangeStr, year) {
  var match = String(rangeStr).match(/(\d{1,2})\/(\d{1,2})\s*-\s*(\d{1,2})\/(\d{1,2})/);

  if (!match) {
    // Fallback: only one date found (e.g. malformed range) — use its month.
    var single = String(rangeStr).match(/(\d{1,2})\/(\d{1,2})/);
    if (!single) return null;
    var m = parseInt(single[2], 10);
    return m >= 1 && m <= 12 ? m : null;
  }

  var startDay = parseInt(match[1], 10);
  var startMonth = parseInt(match[2], 10);
  var endDay = parseInt(match[3], 10);
  var endMonth = parseInt(match[4], 10);

  if (startMonth === endMonth) return startMonth;

  // Days belonging to the start month: from startDay to the last day of startMonth.
  var lastDayOfStartMonth = new Date(year, startMonth, 0).getDate();
  var daysInStartMonth = lastDayOfStartMonth - startDay + 1;
  // Days belonging to the end month: from day 1 to endDay.
  var daysInEndMonth = endDay;

  return daysInStartMonth >= daysInEndMonth ? startMonth : endMonth;
}
