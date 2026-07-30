/**
 * Linkedin.gs
 * Handles the ?action=linkedin endpoint. Reads the "LinkedIn Monthly" tab —
 * one row per month, no weekly breakdown. Real sheet columns:
 * Tháng | Impressions | New Followers | Reactions | Comments | Reposts | Page Views
 * (row 1 = title, row 2 = headers, a TOTAL/summary row sits at the bottom).
 *
 * "New Followers" is a monthly delta — this function converts it into a
 * running cumulative total (assigned to the `followers` field) so the rest
 * of the app can treat LinkedIn followers the same way as Facebook's.
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
  var mappedRows = [];
  var skipped = 0;

  for (var i = 0; i < rawRows.length; i++) {
    if (!isValidLinkedInRow(rawRows[i])) {
      skipped++;
      continue;
    }
    mappedRows.push(mapLinkedInRow(rawRows[i]));
  }

  if (skipped > 0) {
    logInfo("Skipped " + skipped + " row(s) in LinkedIn Monthly (future/unfilled or summary row).");
  }

  // Sort by month ascending, then build the running cumulative follower total.
  mappedRows.sort(function (a, b) {
    return a.month - b.month;
  });

  var monthly = [];
  var cumulativeFollowers = 0;

  for (var j = 0; j < mappedRows.length; j++) {
    var row = mappedRows[j];
    cumulativeFollowers += row.newFollowers;

    if (Number(year) !== Number(CONFIG.DEFAULT_SHEET_YEAR)) continue; // single-year sheet

    monthly.push({
      week: "M" + (row.month < 10 ? "0" + row.month : "" + row.month),
      month: row.month,
      quarter: row.quarter,
      year: CONFIG.DEFAULT_SHEET_YEAR,
      reach: 0,
      impressions: row.impressions,
      followers: cumulativeFollowers,
      reactions: row.reactions,
      comments: row.comments,
      shares: row.shares,
      clicks: row.clicks,
      videoViews: 0,
    });
  }

  var summary = monthly.reduce(
    function (acc, row) {
      acc.impressions += row.impressions;
      acc.followers = row.followers; // cumulative — last value wins
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
