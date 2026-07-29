const { getSuggestions } = require("../lib/students");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const q = (req.query.q || "").toString().trim();
  if (!q || /^\d+$/.test(q)) {
    res.status(200).json([]);
    return;
  }

  try {
    const matches = await getSuggestions(q);
    res.status(200).json(matches);
  } catch (err) {
    console.error("suggestions lookup failed:", err.message);
    res.status(500).json({ error: "تعذّر الاتصال بقاعدة البيانات" });
  }
};
