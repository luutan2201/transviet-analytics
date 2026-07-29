/**
 * Code.gs
 * Entry point for the TransViet Analytics Apps Script Web App.
 * Deploy: Deploy > New deployment > Web app > Execute as "Me" > Who has access "Anyone".
 * Copy the resulting Web App URL into NEXT_PUBLIC_APPS_SCRIPT_URL on the frontend.
 */

function doGet(e) {
  var startedAt = new Date();

  try {
    if (!isAuthorized(e)) {
      return buildErrorResponse("UNAUTHORIZED", "Invalid or missing API token.");
    }

    var action = e.parameter.action;
    var year = e.parameter.year ? Number(e.parameter.year) : new Date().getFullYear();

    switch (action) {
      case "dashboard": {
        var dashboardData = getDashboardData(year, e.parameter.force === "true");
        return buildSuccessResponse(dashboardData, elapsedMs(startedAt));
      }
      case "kpi": {
        var kpiData = getKpiData(year);
        return buildSuccessResponse(kpiData, elapsedMs(startedAt));
      }
      case "settings": {
        var settingsData = getSettingsData();
        return buildSuccessResponse(settingsData, elapsedMs(startedAt));
      }
      default:
        return buildErrorResponse("INVALID_REQUEST", "Unknown or missing action parameter.");
    }
  } catch (error) {
    return handleError(error);
  }
}

function doPost(e) {
  var startedAt = new Date();

  try {
    if (!isAuthorized(e)) {
      return buildErrorResponse("UNAUTHORIZED", "Invalid or missing API token.");
    }

    var action = e.parameter.action;
    var year = e.parameter.year ? Number(e.parameter.year) : new Date().getFullYear();

    if (action === "sync") {
      var result = handleSync(year);
      return jsonOutput(result);
    }

    return buildErrorResponse("INVALID_REQUEST", "Unknown or missing action parameter.");
  } catch (error) {
    return handleError(error);
  }
}

function isAuthorized(e) {
  if (!CONFIG.API_TOKEN) return true; // token disabled
  return e.parameter.token === CONFIG.API_TOKEN;
}

function elapsedMs(startedAt) {
  return new Date().getTime() - startedAt.getTime();
}

function handleError(error) {
  logError(error && error.message ? error.message : String(error));
  if (error && error.name === "ApiError") {
    return buildErrorResponse(error.code, error.message);
  }
  return buildErrorResponse("INTERNAL_ERROR", "Đã có lỗi xảy ra khi xử lý yêu cầu.");
}
