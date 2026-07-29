/**
 * Settings.gs
 * Handles the ?action=settings endpoint — reads a simple key/value Settings sheet
 * (column A = key, column B = value) if present; otherwise returns sensible defaults.
 */

function getSettingsData() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get("settings");
  if (cached) return JSON.parse(cached);

  var defaults = {
    theme: "dark",
    brandColor: "#147E93",
    defaultYear: new Date().getFullYear(),
    defaultFilter: "month",
  };

  var sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(
    CONFIG.SHEET_NAMES.SETTINGS
  );
  if (!sheet) {
    cache.put("settings", JSON.stringify(defaults), CONFIG.CACHE_SECONDS.SETTINGS);
    return defaults;
  }

  var values = sheet.getDataRange().getValues();
  var result = Object.assign({}, defaults);

  for (var i = 0; i < values.length; i++) {
    var key = toSafeString(values[i][0]);
    var value = values[i][1];
    if (key) result[key] = value;
  }

  cache.put("settings", JSON.stringify(result), CONFIG.CACHE_SECONDS.SETTINGS);
  return result;
}
