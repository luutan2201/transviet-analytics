export type ChartIntent =
  "timeSeries" | "category" | "composition" | "distribution" | "multiMetric" | "forecast";

export type RecommendedChartType = "area" | "bar" | "donut" | "pie" | "radar" | "lineWithForecast";

/**
 * Maps a data "intent" to the recommended chart type, per Dashboard_Engine.md CHART AUTOMATION.
 * Call sites decide the intent (they know whether they're showing a trend, a breakdown, etc.);
 * this function is the single place the intent→chart-type mapping lives, so it's never
 * duplicated or drifted between sections.
 */
export function selectChartType(intent: ChartIntent): RecommendedChartType {
  switch (intent) {
    case "timeSeries":
      return "area";
    case "category":
      return "bar";
    case "composition":
      return "donut";
    case "distribution":
      return "pie";
    case "multiMetric":
      return "radar";
    case "forecast":
      return "lineWithForecast";
    default:
      return "area";
  }
}
