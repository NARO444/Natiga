const { loadStudents } = require('../lib/students');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const students = loadStudents();
  const average = students.length
    ? Math.round((students.reduce((a, s) => a + s.pct, 0) / students.length) * 10) / 10
    : 0;

  res.status(200).json({ average, count: students.length });
};
