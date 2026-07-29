const { findStudent } = require("../lib/students");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const q = (req.query.q || "").toString().trim();
  if (!q) {
    res.status(400).json({ error: "أرسل رقم الجلوس أو الاسم في المتغيّر q" });
    return;
  }

  try {
    const result = await findStudent(q);

    if (!result) {
      res.status(404).json({ error: "لم يتم العثور على نتيجة" });
      return;
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("student lookup failed:", err.message);
    res.status(500).json({ error: "تعذّر الاتصال بقاعدة البيانات" });
  }
};
