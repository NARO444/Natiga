const { getStats } = require("../lib/students");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const stats = await getStats();
    res.status(200).json(stats);
  } catch (err) {
    console.error("stats lookup failed:", err.message);
    res.status(500).json({ error: "تعذّر الاتصال بقاعدة البيانات" });
  }
};
