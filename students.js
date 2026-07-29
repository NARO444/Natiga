const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// غيّر الرقم ده لو المجموع الكلي للدرجات مختلف عندك
const MAX_TOTAL = 320;

function loadStudents() {
  const csvPath = path.join(__dirname, '..', 'students.csv');
  const raw = fs.readFileSync(csvPath, 'utf8');
  const records = parse(raw, { columns: true, skip_empty_lines: true, trim: true, bom: true });

  return records.map(r => {
    const total = Number(r.total);
    const pct = Math.round((total / MAX_TOTAL) * 1000) / 10;
    const pass = pct >= 50;
    const grade =
      pct >= 90 ? 'ممتاز' :
      pct >= 80 ? 'جيد جدًا' :
      pct >= 65 ? 'جيد' :
      pct >= 50 ? 'مقبول' : 'راسب';

    return {
      seat: String(r.seat).trim(),
      name: String(r.name).trim(),
      total,
      maxTotal: MAX_TOTAL,
      pct,
      pass,
      grade
    };
  });
}

module.exports = { loadStudents, MAX_TOTAL };
