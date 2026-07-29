/**
 * Config.gs
 * Centralized configuration for the TransViet Analytics Apps Script API.
 * Fill in SPREADSHEET_ID before deploying (Extensions > Apps Script > this file).
 *
 * Customized for the user's real sheet structure:
 * Tab "Weekly Data" with columns:
 * Tuần | Khoảng thời gian | Reach | Impressions | Followers | Reactions |
 * Comments | Shares | Clicks (Link) | Video Views | Engagement Rate (%) | Ghi chú
 */

const CONFIG = {
  // Open your Google Sheet, copy the ID from the URL between /d/ and /edit.
  SPREADSHEET_ID: "PUT_YOUR_SPREADSHEET_ID_HERE",

  SHEET_NAMES: {
    WEEKLY_DATA: "📅 Weekly Data",
    KPI: "KPI",
    SETTINGS: "Settings",
  },

  // The "Weekly Data" tab has no Year column — it's a single-year sheet.
  // Update this every January when you start a new year's tab (or switch to a
  // fresh sheet per year, whichever you prefer).
  DEFAULT_SHEET_YEAR: 2026,

  // Row number (1-indexed) where the actual column headers live.
  // The user's sheet has a title row ("📘 FACEBOOK WEEKLY REPORT") in row 1,
  // so the real headers are on row 2.
  WEEKLY_DATA_HEADER_ROW: 2,

  API_VERSION: "1.0.0",

  // Cache durations in seconds — must mirror 03_Technical_Architecture.md CACHE STRATEGY.
  CACHE_SECONDS: {
    DASHBOARD: 5 * 60,
    SETTINGS: 30 * 60,
    KPI: 30 * 60,
  },

  // Optional shared-secret token. If set, requests must include ?token=<value>.
  // Leave empty to disable (per 21_GOOGLE_APPS_SCRIPT_SPEC.md "Optional API Token").
  API_TOKEN: "",

  DEBUG_MODE: false,
};

/**
 * Required weekly data columns — mapped by header name (after whitespace/newline
 * normalization, see Mapper.gs normalizeHeader), never by index.
 * "Engagement Rate (%)" and "Ghi chú" are intentionally NOT required — the
 * dashboard recalculates engagement rate itself and ignores free-text notes.
 */
const WEEKLY_DATA_COLUMNS = [
  "Tuần",
  "Khoảng thời gian",
  "Reach",
  "Impressions",
  "Followers",
  "Reactions",
  "Comments",
  "Shares",
  "Clicks (Link)",
  "Video Views",
];
