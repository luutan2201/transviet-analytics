/**
 * Dashboard.gs
 * Handles the ?action=dashboard endpoint.
 * Per 05_GG_Sheet_Data_Structure.md, this returns RAW weekly rows only —
 * monthly/quarterly/yearly aggregation is business logic that belongs to the
 * frontend Transformer, not Apps Script.
 */

function getDashboardData(year, forceBypassCache) {
  var cache = CacheService.getScriptCache();
  var cacheKey = "dashboard_" + year;

  if (!forceBypassCache) {
    var cached = cache.get(cacheKey);
    if (cached) {
      logInfo("Dashboard cache hit for year " + year);
      return JSON.parse(cached);
    }
  }

  var sheet = validateSheetExists(CONFIG.SHEET_NAMES.WEEKLY_DATA);
  var allValues = sheet.getDataRange().getValues();
  if (allValues.length === 0) {
    throw new ApiError("DATA_NOT_FOUND", "Weekly Data sheet is empty.");
  }

  // Skip any rows above the real header row (e.g. a title row like
  // "📘 FACEBOOK WEEKLY REPORT" in row 1) — see CONFIG.WEEKLY_DATA_HEADER_ROW.
  var values = allValues.slice(CONFIG.WEEKLY_DATA_HEADER_ROW - 1);
  if (values.length === 0) {
    throw new ApiError("DATA_NOT_FOUND", "Weekly Data sheet has no rows after the header row.");
  }

  var headers = values[0];
  validateHeaders(headers, WEEKLY_DATA_COLUMNS);

  var rawRows = sheetValuesToObjects(values);
  var weekly = [];
  var skipped = 0;

  for (var i = 0; i < rawRows.length; i++) {
    if (!isValidWeeklyRow(rawRows[i])) {
      skipped++;
      continue;
    }
    var mapped = mapWeeklyRow(rawRows[i]);
    if (Number(mapped.year) === Number(year)) {
      weekly.push(mapped);
    }
  }

  if (skipped > 0) {
    logInfo("Skipped " + skipped + " invalid row(s) in Weekly Data.");
  }

  var summary = weekly.reduce(
    function (acc, row) {
      acc.reach += row.reach;
      acc.impressions += row.impressions;
      acc.followers = row.followers; // cumulative — last value wins
      acc.reactions += row.reactions;
      acc.comments += row.comments;
      acc.shares += row.shares;
      acc.clicks += row.clicks;
      acc.videoViews += row.videoViews;
      return acc;
    },
    {
      reach: 0,
      impressions: 0,
      followers: 0,
      reactions: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      videoViews: 0,
    }
  );

  var data = {
    summary: summary,
    weekly: weekly,
    monthly: [],
    quarterly: [],
    yearly: [],
  };

  cache.put(cacheKey, JSON.stringify(data), CONFIG.CACHE_SECONDS.DASHBOARD);
  return data;
}
