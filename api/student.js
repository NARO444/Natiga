const { loadStudents } = require('../lib/students');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const q = (req.query.q || '').toString().trim();
  if (!q) {
    res.status(400).json({ error: 'أرسل رقم الجلوس أو الاسم في المتغيّر q' });
    return;
  }

  const students = loadStudents();
  const result = /^\d+$/.test(q)
    ? students.find(s => s.seat === q)
    : students.find(s => s.name.includes(q));

  if (!result) {
    res.status(404).json({ error: 'لم يتم العثور على نتيجة' });
    return;
  }

  res.status(200).json(result);
};
