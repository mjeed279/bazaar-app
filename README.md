# Bazaar - منصة تسوق إلكتروني متكاملة

![Bazaar Logo](https://via.placeholder.com/200x100?text=Bazaar)

## نظرة عامة
Bazaar هي منصة تسوق إلكتروني متكاملة تعمل كوسيط بين المستخدمين وعلي إكسبريس، مع إضافة هامش ربح 30% على المنتجات. المنصة تدعم الويب وتطبيقات iOS وAndroid، وتوفر تجربة تسوق سلسة مع مجموعة متنوعة من خيارات الدفع المتوافقة مع السوق السعودي.

## الميزات الرئيسية
- تكامل كامل مع واجهة برمجة تطبيقات علي إكسبريس
- تصفية تلقائية للمنتجات الممنوعة في السعودية
- واجهة مستخدم عصرية وسهلة الاستخدام ومتجاوبة مع جميع الأجهزة
- دعم متعدد المنصات (ويب، iOS، Android)
- تكامل مع بوابات الدفع الشائعة في السعودية:
  - مدى (Mada)
  - فيزا وماستركارد (Visa/Mastercard) عبر Stripe
  - أبل باي (Apple Pay)
  - ستسي باي (STC Pay)
  - تمارا (Tamara) - الدفع الآجل
  - تابي (Tabby) - الدفع على أقساط
- هامش ربح 30% مضاف تلقائياً بطريقة شفافة للمستخدم النهائي

## هيكل المشروع
- `backend/`: الخادم الخلفي (Node.js/Express)
- `frontend/`: تطبيق الويب الأمامي (Next.js)
- `mobile/`: تطبيقات الموبايل (React Native)
- `docs/`: وثائق المشروع والمتطلبات

## المتطلبات التقنية
- Node.js v14 أو أحدث
- React 18
- Next.js 14
- React Native 0.72 أو أحدث
- MongoDB (قاعدة البيانات)

## البدء بالمشروع

### متطلبات ما قبل التثبيت
- Node.js و npm
- Git

### تثبيت وتشغيل المشروع محلياً

1. استنساخ المستودع:
```bash
git clone https://github.com/mjeed279/bazaar-app.git
cd bazaar-app
```

2. تثبيت وتشغيل الخادم الخلفي:
```bash
cd backend
npm install
npm run dev
```

3. تثبيت وتشغيل تطبيق الويب:
```bash
cd frontend
npm install
npm run dev
```

4. تثبيت وتشغيل تطبيق الموبايل:
```bash
cd mobile
npm install
npx react-native run-android  # لتشغيل تطبيق Android
# أو
npx react-native run-ios      # لتشغيل تطبيق iOS
```

## النشر
يرجى الاطلاع على [دليل النشر](DEPLOYMENT.md) للحصول على تعليمات مفصلة حول كيفية نشر التطبيق على Vercel وإعداد متغيرات البيئة المطلوبة.

## المساهمة
نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:
1. قم بعمل fork للمستودع
2. قم بإنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. قم بإجراء التغييرات المطلوبة
4. قم بعمل commit للتغييرات (`git commit -m 'إضافة ميزة رائعة'`)
5. قم بدفع التغييرات إلى الفرع (`git push origin feature/amazing-feature`)
6. قم بفتح طلب سحب (Pull Request)

## الترخيص
هذا المشروع مرخص بموجب [ترخيص MIT](LICENSE).

## الاتصال والدعم
إذا كان لديك أي أسئلة أو استفسارات، يرجى التواصل معنا عبر [البريد الإلكتروني/رقم الهاتف].
