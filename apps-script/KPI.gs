/**
 * KPI.gs
 * Handles the ?action=kpi endpoint — returns configured KPI targets.
 * Calculation (completion/forecast/status) is frontend business logic (KPI Engine).
 */

function getKpiData(year) {
  var cache = CacheService.getScriptCache();
  var cacheKey = "kpi_" + year;

  var cached = cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  var sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEET_NAMES.KPI);
  if (!sheet) {
    // KPI sheet is optional — return an empty, valid payload rather than erroring.
    var empty = { year: year, month: new Date().getMonth() + 1, metrics: [] };
    cache.put(cacheKey, JSON.stringify(empty), CONFIG.CACHE_SECONDS.KPI);
    return empty;
  }

  var values = sheet.getDataRange().getValues();
  var rawRows = sheetValuesToObjects(values);

  var metrics = rawRows
    .filter(function (row) {
      return toSafeString(row.Metric) !== "" && Number(row.Year) === Number(year);
    })
    .map(mapKpiRow);

  var data = { year: year, month: new Date().getMonth() + 1, metrics: metrics };
  cache.put(cacheKey, JSON.stringify(data), CONFIG.CACHE_SECONDS.KPI);
  return data;
}
