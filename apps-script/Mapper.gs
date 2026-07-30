/**
 * Mapper.gs
 * Converts raw 2D sheet values into an array of row objects keyed by header name.
 * The frontend never depends on spreadsheet column names — this is the only
 * place that translates between the two.
 */

/** Collapses multi-line header cells (e.g. "Clicks\n(Link)") into a single normalized string. */
function normalizeHeader(header) {
  return toSafeString(header).replace(/\s+/g, " ").trim();
}

function sheetValuesToObjects(values) {
  if (values.length === 0) return [];

  var headers = values[0].map(normalizeHeader);

  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var row = {};
    for (var col = 0; col < headers.length; col++) {
      row[headers[col]] = values[i][col];
    }
    rows.push(row);
  }
  return rows;
}

/**
 * Maps a raw "Weekly Data" row object (by header name) into the API's weekly
 * metric shape. Customized for the user's real column names:
 * Tuần | Khoảng thời gian | Reach | Impressions | Followers | Reactions |
 * Comments | Shares | Clicks (Link) | Video Views
 */
function mapWeeklyRow(row) {
  var month = resolveWeekMonth(row["Khoảng thời gian"], CONFIG.DEFAULT_SHEET_YEAR) || 1;
  return {
    week: toSafeString(row["Tuần"]),
    month: month,
    quarter: monthToQuarter(month),
    year: CONFIG.DEFAULT_SHEET_YEAR,
    reach: toSafeNumber(row["Reach"]),
    impressions: toSafeNumber(row["Impressions"]),
    followers: toSafeNumber(row["Followers"]),
    reactions: toSafeNumber(row["Reactions"]),
    comments: toSafeNumber(row["Comments"]),
    shares: toSafeNumber(row["Shares"]),
    clicks: toSafeNumber(row["Clicks (Link)"]),
    videoViews: toSafeNumber(row["Video Views"]),
  };
}

/** Maps a raw KPI sheet row into the API's KPI target shape. */
function mapKpiRow(row) {
  return {
    metric: toSafeString(row.Metric),
    target: toSafeNumber(row.Target),
    periodType: toSafeString(row.PeriodType),
    month: row.Month ? toSafeNumber(row.Month) : null,
    quarter: row.Quarter ? toSafeNumber(row.Quarter) : null,
    year: toSafeNumber(row.Year),
    enabled: toSafeString(row.Enabled).toLowerCase() !== "false",
  };
}

/**
 * Maps a raw "LinkedIn Monthly" row (by header name) into the API's monthly
 * metric shape. The sheet provides BOTH "New Followers" (monthly delta) and
 * "Followers" (real cumulative total, as tracked by the user) directly —
 * no computation needed on our end.
 */
function mapLinkedInRow(row) {
  var month = parseLinkedInMonth(row["Tháng"]);
  return {
    week: "M" + (month < 10 ? "0" + month : "" + month),
    month: month,
    quarter: monthToQuarter(month),
    reach: 0,
    impressions: toSafeNumber(row["Impressions"]),
    followers: toSafeNumber(row["Followers"]),
    newFollowers: toSafeNumber(row["New Followers"]),
    reactions: toSafeNumber(row["Reactions"]),
    comments: toSafeNumber(row["Comments"]),
    shares: toSafeNumber(row["Reposts"]), // LinkedIn's "Reposts" = our generic "shares"
    clicks: toSafeNumber(row["Page Views"]), // LinkedIn's "Page Views" = our generic "clicks"
    videoViews: 0,
  };
}

/**
 * Returns true if a raw LinkedIn row represents an actually-reported month:
 * the month must be parseable AND Impressions must not be blank. This skips
 * both the TOTAL/summary row and not-yet-reported future months (which have
 * a month label but empty metric cells).
 */
function isValidLinkedInRow(row) {
  if (!parseLinkedInMonth(row["Tháng"])) return false;
  var impressions = row["Impressions"];
  if (impressions === "" || impressions === null || impressions === undefined) return false;
  return true;
}
