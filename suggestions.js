const { loadStudents } = require('../lib/students');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const q = (req.query.q || '').toString().trim();
  if (!q || /^\d+$/.test(q)) {
    res.status(200).json([]);
    return;
  }

  const students = loadStudents();
  const matches = students
    .filter(s => s.name.includes(q))
    .slice(0, 5)
    .map(s => ({ seat: s.seat, name: s.name }));

  res.status(200).json(matches);
};
