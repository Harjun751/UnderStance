const express = require("express");
const router = express.Router();
const { getAnalyticsReport } = require("../utils/analytics.utils");

router.get("/ping", (_req, res) => {
  res.json({ message: "Analytics route reachable" });
});

router.get("/", async (_req, res) => {
  try {
    const data = await getAnalyticsReport();
    res.json(data);
  } catch (err) {
    console.error("Analytics API error:", err.message);
    res.status(500).json({ error: "Analytics not available" });
  }
});

module.exports = router;