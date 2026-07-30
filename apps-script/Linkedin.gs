/**
 * Linkedin.gs
 * Handles the ?action=linkedin endpoint. Reads the "LinkedIn Monthly" tab —
 * one row per month, no weekly breakdown. Real sheet columns:
 * Tháng | Impressions | New Followers | Followers | Reactions | Comments |
 * Reposts | Page Views (row 1 = title, row 2 = headers, a TOTAL/summary
 * row sits at the bottom — both are skipped automatically).
 */

function getLinkedInData(year, forceBypassCache) {
  var cache = CacheService.getScriptCache();
  var cacheKey = "linkedin_" + year;

  if (!forceBypassCache) {
    var cached = cache.get(cacheKey);
    if (cached) {
      logInfo("LinkedIn cache hit for year " + year);
      return JSON.parse(cached);
    }
  }

  var emptyPayload = {
    summary: {
      reach: 0,
      impressions: 0,
      followers: 0,
      newFollowers: 0,
      reactions: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      videoViews: 0,
    },
    weekly: [],
    monthly: [],
    quarterly: [],
    yearly: [],
  };

  var sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(
    CONFIG.SHEET_NAMES.LINKEDIN_MONTHLY
  );

  if (!sheet) {
    // LinkedIn tab not created yet — return a valid empty payload instead of
    // erroring, so the LinkedIn page renders an empty state, not a crash.
    cache.put(cacheKey, JSON.stringify(emptyPayload), CONFIG.CACHE_SECONDS.DASHBOARD);
    return emptyPayload;
  }

  var allValues = sheet.getDataRange().getValues();
  if (allValues.length === 0) {
    return emptyPayload;
  }

  // Skip the title row above the real header row.
  var values = allValues.slice(CONFIG.LINKEDIN_HEADER_ROW - 1);
  if (values.length === 0) {
    return emptyPayload;
  }

  var headers = values[0];
  validateHeaders(headers, LINKEDIN_MONTHLY_COLUMNS);

  var rawRows = sheetValuesToObjects(values);
  var monthly = [];
  var skipped = 0;

  for (var i = 0; i < rawRows.length; i++) {
    if (!isValidLinkedInRow(rawRows[i])) {
      skipped++;
      continue;
    }
    var mapped = mapLinkedInRow(rawRows[i]);
    mapped.year = CONFIG.DEFAULT_SHEET_YEAR;
    if (Number(year) === Number(CONFIG.DEFAULT_SHEET_YEAR)) {
      monthly.push(mapped);
    }
  }

  if (skipped > 0) {
    logInfo("Skipped " + skipped + " row(s) in LinkedIn Monthly (future/unfilled or summary row).");
  }

  monthly.sort(function (a, b) {
    return a.month - b.month;
  });

  var summary = monthly.reduce(
    function (acc, row) {
      acc.impressions += row.impressions;
      acc.followers = row.followers; // cumulative — last value wins
      acc.newFollowers += row.newFollowers;
      acc.reactions += row.reactions;
      acc.comments += row.comments;
      acc.shares += row.shares;
      acc.clicks += row.clicks;
      return acc;
    },
    {
      reach: 0,
      impressions: 0,
      followers: 0,
      newFollowers: 0,
      reactions: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      videoViews: 0,
    }
  );

  var data = { summary: summary, weekly: [], monthly: monthly, quarterly: [], yearly: [] };
  cache.put(cacheKey, JSON.stringify(data), CONFIG.CACHE_SECONDS.DASHBOARD);
  return data;
}
