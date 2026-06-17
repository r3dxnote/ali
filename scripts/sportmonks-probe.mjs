import fs from 'fs';
import path from 'path';

// الحصول على التاريخ الحالي بصيغة UTC (YYYY-MM-DD)
const todayUTC = new Date().toISOString().split('T')[0];

// قراءة المفتاح من متغيرات البيئة
const token = process.env.SPORTMONKS_API_TOKEN;

async function runProbe() {
  if (!token) {
    console.error("ERROR: SPORTMONKS_API_TOKEN environment variable is not defined.");
    process.exit(1);
  }

  console.log("Starting Sportmonks API connectivity probe...");
  
  // نقاط الاتصال المستكشفة المطلوبة
  const endpoints = {
    leagues: 'https://api.sportmonks.com/v3/football/leagues',
    fixturesToday: `https://api.sportmonks.com/v3/football/fixtures/date/${todayUTC}`,
    livescoresInplay: 'https://api.sportmonks.com/v3/football/livescores/inplay',
    livescoresLatest: 'https://api.sportmonks.com/v3/football/livescores/latest',
    standings: 'https://api.sportmonks.com/v3/football/standings'
  };

  const results = {
    timestamp: new Date().toISOString(),
    utcDateTested: todayUTC,
    endpoints: {},
    diagnostics: {
      hasToken: true
    }
  };

  let technicalSuccessCount = 0;

  for (const [key, baseUrl] of Object.entries(endpoints)) {
    console.log(`Probing: ${key}...`);
    let sanitizedUrlStr = baseUrl;
    try {
      // إنشاء رابط الطلب مع تمرير التوكين كمعامل استعلام
      const requestUrl = new URL(baseUrl);
      requestUrl.searchParams.set('api_token', token);

      // إنشاء رابط مطهر للتقرير والطباعة لحجب المفتاح السري
      const sanitizedUrl = new URL(baseUrl);
      sanitizedUrl.searchParams.set('api_token', '[REDACTED]');
      sanitizedUrlStr = sanitizedUrl.toString();

      const response = await fetch(requestUrl.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      const statusCode = response.status;
      const ok = response.ok;
      let json = null;
      let parseError = null;

      try {
        json = await response.json();
      } catch (err) {
        parseError = err.message;
      }

      const summary = {
        url: sanitizedUrlStr, // الرابط مطهر لضمان عدم تسريب التوكين
        statusCode: statusCode,
        ok: ok,
        parseError: parseError
      };

      if (ok && json) {
        technicalSuccessCount++;
        summary.dataExists = json.data !== undefined;
        summary.isArray = Array.isArray(json.data);
        summary.length = summary.isArray ? json.data.length : null;
        
        if (summary.isArray && json.data.length > 0) {
          const firstItem = json.data[0];
          summary.firstItemKeys = Object.keys(firstItem);
          // عرض عينة من المعرفات والأسماء الآمنة
          summary.firstItemsSummary = json.data.slice(0, 3).map(item => {
            return {
              id: item.id,
              name: item.name || item.name_ar || null,
              stage_id: item.stage_id || null,
              league_id: item.league_id || null
            };
          });
        }
        
        // رصد تفاصيل الاشتراك والحدود المسموحة إن وجدت
        if (json.subscription) {
          summary.subscription = json.subscription;
        }
        if (json.rate_limit) {
          summary.rateLimit = json.rate_limit;
        }
      } else if (json) {
        // رصد رسائل الخطأ والقيود من المزود
        summary.error = json.error || null;
        summary.message = json.message || null;
      }

      results.endpoints[key] = summary;
    } catch (error) {
      console.error(`Fetch error for ${key}:`, error.message);
      results.endpoints[key] = {
        url: sanitizedUrlStr,
        ok: false,
        fetchError: error.message
      };
    }
  }

  // التأكد من وجود مجلد artifacts وتوليده إن لم يكن موجوداً
  const artifactsDir = path.join(process.cwd(), 'artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  // حفظ التقرير المفصل والخالي من أي مفاتيح سرية
  const outputPath = path.join(artifactsDir, 'sportmonks-probe-result.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Probe report saved successfully to: ${outputPath}`);

  // فحص ما إذا كانت كل الطلبات التقنية قد فشلت
  if (technicalSuccessCount === 0) {
    console.error("ERROR: All API requests failed technically. Please check auth/network configuration.");
    process.exit(1);
  }

  console.log("Probe process completed successfully.");
  process.exit(0);
}

runProbe();
