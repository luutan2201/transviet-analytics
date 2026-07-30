/**
 * Sync.gs
 * Handles the ?action=sync endpoint. Clears the dashboard cache for the given
 * year and re-reads the sheet immediately, so the next ?action=dashboard call
 * returns fresh data. Per 05_GG_Sheet_Data_Structure.md: "Manual Sync always
 * bypasses cache."
 */

function handleSync(year) {
  var startedAt = new Date();
  var cache = CacheService.getScriptCache();
  cache.remove("dashboard_" + year);
  cache.remove("kpi_" + year);
  cache.remove("linkedin_" + year);

  var data = getDashboardData(year, true);
  getLinkedInData(year, true);
  var executionTime = new Date().getTime() - startedAt.getTime();

  return {
    success: true,
    updatedAt: new Date().toISOString(),
    records: data.weekly.length,
    executionTime: executionTime,
  };
}
