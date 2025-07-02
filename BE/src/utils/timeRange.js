// utils/timeRange.js
const moment = require("moment");

const timeMap = {
  "24h": { unit: "hour", count: 24 },
  "7d": { unit: "day", count: 7 },
  "30d": { unit: "day", count: 30 },
  "90d": { unit: "day", count: 90 },
};

function getStartDate(range = "7d") {
  const config = timeMap[range] || timeMap["7d"];
  return moment().subtract(config.count, config.unit).startOf(config.unit);
}

function getPreviousRange(range = "7d") {
  const config = timeMap[range] || timeMap["7d"];
  const end = moment().subtract(config.count, config.unit).startOf(config.unit);
  const start = moment(end).subtract(config.count, config.unit);
  return { start, end };
}

module.exports = {
  timeMap,
  getStartDate,
  getPreviousRange,
};
