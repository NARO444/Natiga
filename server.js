const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const app = express();
app.use(cors());

// غيّر الرقم ده لو المجموع الكلي للدرجات مختلف عندك
const MAX_TOTAL = 320;
const CSV_PATH = path.join(__dirname, 'students.csv');

function loadStudents() {
  const raw = fs.readFileSync(CSV_PATH, 'utf8');
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

let students = loadStudents();
console.log(`تم تحميل ${students.length} سجل من students.csv`);

// نقطة صحّة للتأكد إن السيرفر شغال
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Results API is running', count: students.length });
});

// إعادة تحميل الملف بدون إعادة تشغيل السيرفر (بعد ما تستبدل students.csv)
app.get('/api/reload', (req, res) => {
  try {
    students = loadStudents();
    res.json({ ok: true, count: students.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// متوسط النسب لكل الطلاب (يُستخدم في شريط المقارنة بالواجهة)
app.get('/api/stats', (req, res) => {
  const avg = students.length
    ? Math.round((students.reduce((a, s) => a + s.pct, 0) / students.length) * 10) / 10
    : 0;
  res.json({ average: avg, count: students.length });
});

// البحث برقم الجلوس أو الاسم
app.get('/api/student', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'أرسل رقم الجلوس أو الاسم في المتغيّر q' });

  let result;
  if (/^\d+$/.test(q)) {
    result = students.find(s => s.seat === q);
  } else {
    result = students.find(s => s.name.includes(q));
  }

  if (!result) return res.status(404).json({ error: 'لم يتم العثور على نتيجة' });
  res.json(result);
});

// اقتراحات أثناء الكتابة بالاسم
app.get('/api/suggestions', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q || /^\d+$/.test(q)) return res.json([]);
  const matches = students
    .filter(s => s.name.includes(q))
    .slice(0, 5)
    .map(s => ({ seat: s.seat, name: s.name }));
  res.json(matches);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Results API listening on port ${PORT}`));
