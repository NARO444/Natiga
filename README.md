# Results API — خطوات التشغيل والـ Deploy

سيرفر Node.js بسيط بيقرأ بيانات الطلاب من ملف `students.csv` (مُصدَّر من Access) ويعرضها كـ API.

## 1) تصدير البيانات من Access لملف CSV

كل ما تتحدث النتيجة في ملف الـ Access:

1. افتح ملف الـ Access، وافتح الجدول أو الاستعلام اللي فيه النتائج.
2. من تبويب **External Data** اختار **Export → Text File**.
3. اختار **Delimited**، وحدد الفاصلة **Comma**.
4. لازم يكون عندك 3 أعمدة بالظبط بالترتيب ده وبنفس الأسماء:
   - `seat` (رقم الجلوس)
   - `name` (اسم الطالب)
   - `total` (مجموع الدرجات كرقم)
5. احفظ الملف باسم `students.csv` واستبدل بيه الملف الموجود في المجلد ده.

> النسبة والتقدير والحالة (ناجح/راسب) بيتحسبوا تلقائيًا في السيرفر، مش محتاج تصدّرهم من Access.
> لو المجموع الكلي للدرجات مختلف عن 320، غيّر قيمة `MAX_TOTAL` في `server.js`.

## 2) تجربة السيرفر على جهازك

```bash
npm install
npm start
```

هيشتغل على `http://localhost:3000`. جرّب في المتصفح:
- `http://localhost:3000/api/student?q=1024`
- `http://localhost:3000/api/student?q=أحمد`

## 3) رفع المشروع على GitHub

```bash
git init
git add .
git commit -m "Results API"
```

اعمل repo جديد على GitHub وارفع الكود:
```bash
git remote add origin https://github.com/USERNAME/results-api.git
git branch -M main
git push -u origin main
```

## 4) الـ Deploy على Render (مجاني، من غير سيرفر خاص أو ويندوز)

1. سجّل دخول على **https://render.com** (تقدر تدخل بحساب GitHub).
2. من الداشبورد: **New +** → **Web Service**.
3. اختار الـ repo اللي رفعته.
4. الإعدادات:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. دوس **Create Web Service**. خد شوية دقايق وهيديك رابط زي:
   `https://results-api-xxxx.onrender.com`

> ملحوظة: الخطة المجانية بتنام لو مفيش زيارات لفترة، وأول طلب بعد النوم بياخد كام ثانية زيادة. لو عايز يفضل صاحي 24 ساعة، محتاج خطة مدفوعة صغيرة أو تستخدم بديل زي Railway/Fly.io.

## 5) ربط الموقع (الفرونت إند) بالـ API

في ملف `نتيجة_الطلاب.html`، هتلاقي في الأعلى داخل الـ `<script>`:

```js
const API_BASE = "";
```

غيّرها لرابط الـ API اللي طلع من Render:

```js
const API_BASE = "https://results-api-xxxx.onrender.com";
```

احفظ الملف وارفعه لأي استضافة استاتيك (Netlify, Vercel, GitHub Pages، أو حتى نفس مجلد الموقع اللي عندك). خلاص الموقع هيبقى شغال بالبيانات الحقيقية.

## 6) تحديث النتائج لاحقًا

كل مرة النتيجة تتحدث:
1. صدّر `students.csv` جديد من Access زي الخطوة 1.
2. استبدل الملف في الـ repo وادفعه:
   ```bash
   git add students.csv
   git commit -m "Update results"
   git push
   ```
3. Render هيعمل إعادة نشر تلقائيًا للنسخة الجديدة.

(بديل أسرع بدون git: لو رفعت الملف يدويًا على السيرفر، تقدر تنادي `/api/reload` بدل ما تعيد تشغيل السيرفر بالكامل.)

## أمان — مهم

البيانات دي درجات طلاب حقيقية. لو الموقع هيبقى عام:
- متسيبش أي endpoint يرجع كل الطلاب دفعة واحدة (الكود الحالي بيرجع طالب واحد بس مطابق للبحث، وده مقصود).
- فكّر تضيف rate limiting بسيط (مكتبة `express-rate-limit`) عشان حد ميعملش سحب جماعي للبيانات بالتجربة المتكررة لأرقام الجلوس.
