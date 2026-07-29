/**
 * Response.gs
 * Every endpoint must return a response built by these functions — never build
 * ContentService output ad-hoc elsewhere, per 33_API_CONTRACT.md.
 */

function buildSuccessResponse(data, executionTimeMs) {
  var payload = {
    success: true,
    message: "",
    version: CONFIG.API_VERSION,
    updatedAt: new Date().toISOString(),
    executionTime: executionTimeMs || 0,
    data: data,
  };
  return jsonOutput(payload);
}

function buildErrorResponse(errorCode, message) {
  var payload = {
    success: false,
    message: message,
    errorCode: errorCode,
    timestamp: new Date().toISOString(),
  };
  return jsonOutput(payload);
}

function jsonOutput(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
