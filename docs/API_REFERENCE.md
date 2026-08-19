# مرجع واجهات برمجة التطبيقات (API Reference)

يوثق هذا الدليل نقاط نهاية واجهات البرمجة (RESTful Endpoints) الخاصة بمنصة «شخّصني».

---

## 🔒 المصادقة والأمان (Authentication)
تعتمد جميع الطلبات المحمية على تضمين رمز JWT أو مفتاح API في الترويسة:
```http
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

---

## 📡 نقاط النهاية الرئيسية (Core Endpoints)

### 1. فحص صحة النظام (System Health Check)
- **المسار:** `GET /api/health`
- **الوصف:** التحقق من جاهزية وحالة الخادم وقاعدة البيانات.
- **الاستجابة الناجحة (200 OK):**
```json
{
  "status": "healthy",
  "system": "منصة شخّصني (Shakhesni Platform)",
  "version": "1.0.0",
  "timestamp": "2026-08-19T06:34:47.000Z",
  "uptimeSeconds": 1420,
  "checks": {
    "api": "operational",
    "database": "connected",
    "storage": "ready",
    "aiAssistant": "online"
  }
}
```

### 2. إدارة طلبات التشخيص (Diagnosis Requests)
- **`GET /api/requests`**: جلب قائمة الطلبات مع الفلترة حسب الحالة، المدرسة، أو الفئة.
- **`POST /api/requests`**: إنشاء طلب تشخيص جديد من المدرسة أو ولي الأمر.
- **`GET /api/requests/{id}`**: جلب كامل تفاصيل الطلب والمستندات والتقييمات.
- **`PATCH /api/requests/{id}/status`**: تحديث حالة الطلب وفق قواعد محرك الحالات (State Machine).

### 3. مساحة التقييمات الإكلينيكية (Diagnostic Assessments)
- **`POST /api/requests/{id}/assessments`**: تسجيل نتائج تطبيق مقياس معياري (WISC-V, GARS-3, Vineland-3).
- **`GET /api/requests/{id}/assessments`**: جلب كافة التقييمات الإكلينيكية المسجلة للحالة.

### 4. الخطة التربوية الفردية (IEP Hub)
- **`GET /api/requests/{id}/iep`**: جلب الخطة التربوية الفردية والأهداف الحالية ونسب الإنجاز.
- **`PUT /api/requests/{id}/iep`**: تحديث أو حفظ بيانات الخطة الفردية.
- **`PATCH /api/requests/{id}/iep/goals/{goalId}`**: تحديث نسبة إنجاز هدف محدد وحالته.

### 5. مركز مراسلات أولياء الأمور (Parent Communications)
- **`POST /api/communications/dispatch`**: إرسال رسالة SMS أو WhatsApp لولي الأمر مع القالب المحدد.
- **`GET /api/requests/{id}/messages`**: جلب سجل المراسلات التاريخي للطالب.

### 6. بوابة التحقق الرقمي العامة (Public QR Verification)
- **`GET /verify/{token}`**: التحقق المفتوح من صحة وسريان التقرير التشخيصي بالرمز المعتمد.
