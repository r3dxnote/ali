// قاموس توطين أسماء المنتخبات المشاركة في كأس العالم إلى اللغة العربية
const teamTranslations = {
  idMap: {
    1: 'بلجيكا',
    2: 'فرنسا',
    3: 'كرواتيا',
    5: 'السويد',
    6: 'البرازيل',
    7: 'الأوروغواي',
    8: 'كولومبيا',
    9: 'إسبانيا',
    10: 'إنجلترا',
    11: 'بنما',
    12: 'اليابان',
    13: 'السنغال',
    15: 'سويسرا',
    16: 'المكسيك',
    17: 'كوريا الجنوبية',
    20: 'أستراليا',
    22: 'إيران',
    23: 'السعودية',
    25: 'ألمانيا',
    26: 'الأرجنتين',
    27: 'البرتغال',
    28: 'تونس',
    31: 'المغرب',
    32: 'مصر',
    770: 'التشيك',
    775: 'النمسا',
    777: 'تركيا',
    1090: 'النرويج',
    1108: 'اسكتلندا',
    1113: 'البوسنة والهرسك',
    1118: 'هولندا',
    1501: 'ساحل العاج',
    1504: 'غانا',
    1508: 'الكونغو الديمقراطية',
    1531: 'جنوب أفريقيا',
    1532: 'الجزائر',
    1533: 'الرأس الأخضر',
    1548: 'الأردن',
    1567: 'العراق',
    1568: 'أوزبكستان',
    1569: 'قطر',
    2380: 'باراغواي',
    2382: 'الإكوادور',
    2384: 'الولايات المتحدة',
    2386: 'هايتي',
    4673: 'نيوزيلندا',
    5529: 'كندا',
    5530: 'كوراساو'
  },
  codeMap: {
    'BEL': 'بلجيكا',
    'FRA': 'فرنسا',
    'CRO': 'كرواتيا',
    'SWE': 'السويد',
    'BRA': 'البرازيل',
    'URU': 'الأوروغواي',
    'COL': 'كولومبيا',
    'ESP': 'إسبانيا',
    'ENG': 'إنجلترا',
    'PAN': 'بنما',
    'JPN': 'اليابان',
    'SEN': 'السنغال',
    'SUI': 'سويسرا',
    'MEX': 'المكسيك',
    'KOR': 'كوريا الجنوبية',
    'AUS': 'أستراليا',
    'IRN': 'إيران',
    'KSA': 'السعودية',
    'GER': 'ألمانيا',
    'ARG': 'الأرجنتين',
    'POR': 'البرتغال',
    'TUN': 'تونس',
    'MAR': 'المغرب',
    'EGY': 'مصر',
    'CZE': 'التشيك',
    'AUT': 'النمسا',
    'TUR': 'تركيا',
    'NOR': 'النرويج',
    'SCO': 'اسكتلندا',
    'BIH': 'البوسنة والهرسك',
    'NED': 'هولندا',
    'CIV': 'ساحل العاج',
    'GHA': 'غانا',
    'CGO': 'الكونغو الديمقراطية',
    'RSA': 'جنوب أفريقيا',
    'ALG': 'الجزائر',
    'CPV': 'الرأس الأخضر',
    'JOR': 'الأردن',
    'IRQ': 'العراق',
    'UZB': 'أوزبكستان',
    'QAT': 'قطر',
    'PAR': 'باراغواي',
    'ECU': 'الإكوادور',
    'USA': 'الولايات المتحدة',
    'HAI': 'هايتي',
    'NZL': 'نيوزيلندا',
    'CAN': 'كندا',
    'CUR': 'كوراساو'
  },
  nameMap: {
    'belgium': 'بلجيكا',
    'france': 'فرنسا',
    'croatia': 'كرواتيا',
    'sweden': 'السويد',
    'brazil': 'البرازيل',
    'uruguay': 'الأوروغواي',
    'colombia': 'كولومبيا',
    'spain': 'إسبانيا',
    'england': 'إنجلترا',
    'panama': 'بنما',
    'japan': 'اليابان',
    'senegal': 'السنغال',
    'switzerland': 'سويسرا',
    'mexico': 'المكسيك',
    'south korea': 'كوريا الجنوبية',
    'korea republic': 'كوريا الجنوبية',
    'rep. korea': 'كوريا الجنوبية',
    'australia': 'أستراليا',
    'iran': 'إيران',
    'ir iran': 'إيران',
    'saudi arabia': 'السعودية',
    'germany': 'ألمانيا',
    'argentina': 'الأرجنتين',
    'portugal': 'البرتغال',
    'tunisia': 'تونس',
    'morocco': 'المغرب',
    'egypt': 'مصر',
    'czechia': 'التشيك',
    'czech republic': 'التشيك',
    'austria': 'النمسا',
    'türkiye': 'تركيا',
    'turkey': 'تركيا',
    'norway': 'النرويج',
    'scotland': 'اسكتلندا',
    'bosnia & herzegovina': 'البوسنة والهرسك',
    'bosnia and herzegovina': 'البوسنة والهرسك',
    'netherlands': 'هولندا',
    'ivory coast': 'ساحل العاج',
    'côte d\'ivoire': 'ساحل العاج',
    'cote d\'ivoire': 'ساحل العاج',
    'ghana': 'غانا',
    'congo dr': 'الكونغو الديمقراطية',
    'dr congo': 'الكونغو الديمقراطية',
    'south africa': 'جنوب أفريقيا',
    'algeria': 'الجزائر',
    'cape verde': 'الرأس الأخضر',
    'cape verde islands': 'الرأس الأخضر',
    'cabo verde': 'الرأس الأخضر',
    'jordan': 'الأردن',
    'iraq': 'العراق',
    'uzbekistan': 'أوزبكستان',
    'qatar': 'قطر',
    'paraguay': 'باراغواي',
    'ecuador': 'الإكوادور',
    'usa': 'الولايات المتحدة',
    'united states': 'الولايات المتحدة',
    'united states of america': 'الولايات المتحدة',
    'haiti': 'هايتي',
    'new zealand': 'نيوزيلندا',
    'canada': 'كندا',
    'curaçao': 'كوراساو',
    'curacao': 'كوراساو'
  }
};

function getArabicTeamName(team) {
  if (!team) return '';
  
  // 1. التفضيل الأول: البحث بالمعرف الفريد (id)
  const id = team.id || team.teamId;
  if (id !== undefined && id !== null && teamTranslations.idMap[id]) {
    return teamTranslations.idMap[id];
  }
  
  // 2. البديل الثاني: البحث برمز المنتخب (code)
  const code = team.code || team.teamCode;
  if (code && typeof code === 'string' && teamTranslations.codeMap[code.toUpperCase()]) {
    return teamTranslations.codeMap[code.toUpperCase()];
  }
  
  // 3. البديل الثالث: البحث بالاسم
  const name = team.name || team.teamName;
  if (name && typeof name === 'string') {
    const lowerName = name.trim().toLowerCase();
    if (teamTranslations.nameMap[lowerName]) {
      return teamTranslations.nameMap[lowerName];
    }
  }
  
  // 4. البديل الأخير: الاسم الأصلي الممرر من البيانات
  return team.name || team.teamName || '';
}

// متغيرات التطبيق
let matchesDB = [];
let groupsDB = [];
let metaDB = {};
let activeTab = 'today'; // التبويب الافتراضي النشط


// تهيئة المفضلة من LocalStorage
let favorites = JSON.parse(localStorage.getItem('korah_favorites')) || [];

// عند تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
  // تسجيل عامل الخدمة (Service Worker) لتأسيس PWA
  registerServiceWorker();

  // مراجعة الـ sessionStorage لكي لا تظهر شاشة الترحيب مجدداً في الجلسة الواحدة
  if (sessionStorage.getItem('splashDismissed')) {
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';
  }
  
  initApp();
  setupSearchListeners();
});

// تسجيل عامل الخدمة
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then((reg) => {
          console.log('[Service Worker] Registered successfully with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[Service Worker] Registration failed:', err);
        });
    });
  }
}

// رندرة شريط المباراة المباشرة المميز (Spotlight)
function renderLiveSpotlight() {
  const container = document.querySelector('.app-container');
  const viewContainer = document.querySelector('.view-container');
  if (!container || !viewContainer) return;

  let spotlightEl = document.getElementById('live-match-spotlight');

  const liveMatches = matchesDB.filter(m => m.status === 'live');
  if (liveMatches.length === 0) {
    if (spotlightEl) {
      spotlightEl.style.display = 'none';
    }
    return;
  }

  // اختيار أول مباراة مباشرة لعرضها
  const match = liveMatches[0];

  if (!spotlightEl) {
    spotlightEl = document.createElement('div');
    spotlightEl.id = 'live-match-spotlight';
    spotlightEl.className = 'live-spotlight-container';
    container.insertBefore(spotlightEl, viewContainer);
  }

  spotlightEl.style.display = 'block';

  const homeArabic = getArabicTeamName(match.homeTeam);
  const awayArabic = getArabicTeamName(match.awayTeam);
  
  const scoreHome = (match.scoreHome !== null && match.scoreHome !== undefined) ? match.scoreHome : '-';
  const scoreAway = (match.scoreAway !== null && match.scoreAway !== undefined) ? match.scoreAway : '-';
  
  const elapsedText = match.elapsed ? `الدقيقة ${match.elapsed}` : 'مباشر';
  
  const homeFlagHTML = (match.homeTeam.flag && match.homeTeam.flag.startsWith('http'))
    ? `<img src="${match.homeTeam.flag}" class="spotlight-flag" onerror="this.style.display='none'">`
    : `<span class="spotlight-emoji">${match.homeTeam.flag || ''}</span>`;

  const awayFlagHTML = (match.awayTeam.flag && match.awayTeam.flag.startsWith('http'))
    ? `<img src="${match.awayTeam.flag}" class="spotlight-flag" onerror="this.style.display='none'">`
    : `<span class="spotlight-emoji">${match.awayTeam.flag || ''}</span>`;

  spotlightEl.innerHTML = `
    <div class="spotlight-badge-row">
      <span class="spotlight-live-tag">
        <span class="spotlight-pulse-dot"></span>
        مباشرة الآن
      </span>
      <span class="spotlight-stage">${match.stage}</span>
    </div>
    <div class="spotlight-match-row">
      <div class="spotlight-team" onclick="event.stopPropagation(); showTeamStats('${match.homeTeam.name}')" title="اضغط للتفاصيل">
        ${homeFlagHTML}
        <span class="spotlight-team-name">${homeArabic}</span>
      </div>
      <div class="spotlight-score-col">
        <div class="spotlight-score">
          <span>${scoreHome}</span>
          <span class="spotlight-score-dash">-</span>
          <span>${scoreAway}</span>
        </div>
        <div class="spotlight-time">${elapsedText}</div>
      </div>
      <div class="spotlight-team" onclick="event.stopPropagation(); showTeamStats('${match.awayTeam.name}')" title="اضغط للتفاصيل">
        ${awayFlagHTML}
        <span class="spotlight-team-name">${awayArabic}</span>
      </div>
    </div>
    <div class="spotlight-status-text">المباراة تُلعب حالياً</div>
  `;
}

// تهيئة التطبيق وجلب البيانات
async function initApp() {
  const contentArea = document.getElementById('view-today');
  showLoader(contentArea);

  try {
    // 1. محاولة جلب البيانات الحية
    try {
      const [metaRes, matchesRes, standingsRes, teamsRes, eventsRes] = await Promise.all([
        fetch('./assets/data/live/meta.json'),
        fetch('./assets/data/live/matches.json'),
        fetch('./assets/data/live/standings.json'),
        fetch('./assets/data/live/teams.json'),
        fetch('./assets/data/live/events.json')
      ]);

      if (metaRes.ok && matchesRes.ok && standingsRes.ok && teamsRes.ok && eventsRes.ok) {
        metaDB = await metaRes.json();
        const matchesData = await matchesRes.json();
        const standingsData = await standingsRes.json();
        const teamsData = await teamsRes.json();
        const eventsData = await eventsRes.json();

        // حفظ بيانات الفرق والأحداث للاستخدام اللاحق بشكل آمن
        window.__aliLiveTeams = teamsData;
        window.__aliLiveEvents = eventsData;

        // تحويل المباريات الحية إلى النموذج البرمجي للواجهة
        matchesDB = matchesData.map(m => {
          const homeTeamObj = { id: m.homeTeam.id, code: m.homeTeam.code, name: m.homeTeam.name };
          const awayTeamObj = { id: m.awayTeam.id, code: m.awayTeam.code, name: m.awayTeam.name };
          const arabicHome = getArabicTeamName(homeTeamObj);
          const arabicAway = getArabicTeamName(awayTeamObj);
          
          const isArabHome = ['السعودية', 'مصر', 'المغرب', 'تونس', 'الجزائر', 'قطر', 'العراق', 'الأردن', 'الإمارات'].includes(arabicHome);
          const isArabAway = ['السعودية', 'مصر', 'المغرب', 'تونس', 'الجزائر', 'قطر', 'العراق', 'الأردن', 'الإمارات'].includes(arabicAway);
          
          let status = 'scheduled';
          if (m.isLive) status = 'live';
          else if (m.isFinished) status = 'finished';

          let stage = m.group ? m.group : (m.round || 'المجموعات');
          if (stage.startsWith('Group ')) {
            stage = stage.replace('Group ', 'المجموعة ');
          }

          return {
            id: String(m.id),
            date: m.dateSaudi || (m.dateUtc ? m.dateUtc.split('T')[0] : ''),
            time: m.timeSaudi || '00:00',
            status: status,
            statusShort: m.statusShort,
            statusLong: m.statusLong,
            elapsed: m.elapsed,
            scoreHome: m.goals?.home ?? null,
            scoreAway: m.goals?.away ?? null,
            stage: stage,
            stadium: m.venueName ? `${m.venueName}، ${m.venueCity || ''}` : 'ملعب المونديال',
            homeTeam: {
              id: m.homeTeam.id,
              code: m.homeTeam.code,
              name: m.homeTeam.name,
              flag: m.homeTeam.logo,
              isArab: isArabHome
            },
            awayTeam: {
              id: m.awayTeam.id,
              code: m.awayTeam.code,
              name: m.awayTeam.name,
              flag: m.awayTeam.logo,
              isArab: isArabAway
            }
          };
        });

        // تحويل الترتيب الحي إلى النموذج البرمجي للواجهة (مع تصفية المجموعات الحقيقية فقط A-L)
        const realStandingsGroups = Array.isArray(standingsData.groups)
          ? standingsData.groups.filter(group => /^Group [A-L]$/.test(group.name))
          : [];

        groupsDB = realStandingsGroups.map(group => ({
          name: group.name.startsWith('Group ') ? group.name.replace('Group ', 'المجموعة ') : group.name,
          teams: group.standings.map(row => {
            let code = '';
            if (window.__aliLiveTeams) {
              const foundTeam = window.__aliLiveTeams.find(t => t.id === row.teamId);
              if (foundTeam) code = foundTeam.code;
            }
            const teamObj = { id: row.teamId, code: code, name: row.teamName };
            const arabicName = getArabicTeamName(teamObj);
            const isArab = ['السعودية', 'مصر', 'المغرب', 'تونس', 'الجزائر', 'قطر', 'العراق', 'الأردن', 'الإمارات'].includes(arabicName);
            return {
              id: row.teamId,
              code: code,
              name: row.teamName,
              logo: row.teamLogo,
              flag: row.teamLogo,
              played: row.allPlayed,
              won: row.allWin,
              drawn: row.allDraw,
              lost: row.allLose,
              goalsFor: row.goalsFor,
              goalsAgainst: row.goalsAgainst,
              points: row.points,
              isArab: isArab
            };
          })
        }));

        console.log("Loaded API-Football live data successfully.");
        updateAppHeader();
        renderActiveTab();
        return;
      }
    } catch (liveErr) {
      console.warn("Live JSON fetch failed, falling back to demo data:", liveErr.message);
    }

    // 2. البديل التلقائي: تحميل البيانات التجريبية
    const [metaRes, matchesRes] = await Promise.all([
      fetch('./assets/data/meta.json'),
      fetch('./assets/data/matches.json')
    ]);

    if (!metaRes.ok || !matchesRes.ok) {
      throw new Error('فشل في تحميل ملفات البيانات من الخادم.');
    }

    metaDB = await metaRes.json();
    const data = await matchesRes.json();
    matchesDB = data.matches || [];
    groupsDB = data.groups || [];

    updateAppHeader();
    renderActiveTab();

  } catch (error) {
    console.error('Error loading data:', error);
    renderError(contentArea, 'حدث خطأ أثناء تحميل بيانات المباريات. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.');
  }
}

// تحديث نصوص الترويسة من ملف meta.json
function updateAppHeader() {
  if (metaDB.title) {
    document.title = metaDB.title;
    const headerTitleEl = document.getElementById('header-title-text');
    if (headerTitleEl) headerTitleEl.textContent = metaDB.title;
  }
  
  const headerSubtitleEl = document.getElementById('header-subtitle-text');
  if (headerSubtitleEl) {
    if (metaDB.provider) {
      headerSubtitleEl.textContent = "جدول المباريات والترتيب المباشر لمونديال 2026";
    } else if (metaDB.description) {
      headerSubtitleEl.textContent = metaDB.description;
    }
  }

  const disclaimerTextEl = document.getElementById('disclaimer-text');
  if (disclaimerTextEl && metaDB.disclaimer) {
    disclaimerTextEl.textContent = metaDB.disclaimer;
  }

  const disclaimerBadge = document.getElementById('disclaimer-badge');
  if (disclaimerBadge) {
    if (metaDB.provider && metaDB.updatedAt) {
      const timeStr = new Date(metaDB.updatedAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      disclaimerBadge.textContent = `مباشر: ${metaDB.provider} (محدث ${timeStr})`;
    } else if (metaDB.disclaimer) {
      disclaimerBadge.textContent = metaDB.disclaimer;
    }
  }
}

// إخفاء شاشة الترحيب بنعومة
function enterApp() {
  const splash = document.getElementById('splash');
  if (splash) {
    splash.classList.add('fade-out');
    sessionStorage.setItem('splashDismissed', 'true');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 600);
  }
  showToast('أهلاً بك في المركاز! تم ضبط التوقيت حسب توقيت مكة المكرمة 🇸🇦', 'info');
}

// إعداد مستمعي البحث الحي للتبويبات
function setupSearchListeners() {
  const searchUpcoming = document.getElementById('search-upcoming');
  if (searchUpcoming) {
    searchUpcoming.addEventListener('input', (e) => {
      renderUpcomingList(e.target.value.trim());
    });
  }

  const searchResults = document.getElementById('search-results');
  if (searchResults) {
    searchResults.addEventListener('input', (e) => {
      renderResultsList(e.target.value.trim());
    });
  }
}

// تبديل التبويبات الفوري من خلال الأزرار السفلية
function switchTab(tabId, el) {
  // إزالة نشاط جميع أزرار التنقل السفلي
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  // تحديد الزر الحالي كـ نشط
  el.classList.add('active');

  // إخفاء جميع الواجهات
  document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
  // إظهار الواجهة المطلوبة
  const activeView = document.getElementById(`view-${tabId}`);
  if (activeView) activeView.classList.add('active');

  activeTab = tabId;
  renderActiveTab();
}

// رندرة التبويب النشط
function renderActiveTab() {
  if (activeTab === 'today') {
    renderTodayTab();
  } else if (activeTab === 'upcoming') {
    renderUpcomingList('');
  } else if (activeTab === 'results') {
    renderResultsList('');
  } else if (activeTab === 'groups') {
    renderGroupsTab();
  }
  renderLiveSpotlight();
}

// رندرة تبويب مباريات اليوم
function renderTodayTab() {
  const container = document.getElementById('view-today');
  container.innerHTML = '';

  let targetDate = '2026-06-17';
  if (metaDB.updatedAt) {
    const utcMs = new Date(metaDB.updatedAt).getTime();
    const saudiDateObj = new Date(utcMs + 3 * 3600 * 1000);
    const yyyy = saudiDateObj.getUTCFullYear();
    const mm = String(saudiDateObj.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(saudiDateObj.getUTCDate()).padStart(2, '0');
    targetDate = `${yyyy}-${mm}-${dd}`;
  } else if (metaDB.demoToday) {
    targetDate = metaDB.demoToday;
  }

  const todayMatches = matchesDB.filter(m => m.date === targetDate);

  if (todayMatches.length === 0) {
    renderEmptyState(container, '⚡', 'لا توجد مباريات اليوم', `لم يتم العثور على مباريات تجريبية مجدولة لتاريخ اليوم (${targetDate}).`);
    return;
  }

  const header = document.createElement('h2');
  header.className = 'date-group-header';
  header.textContent = `مواجهات اليوم (${formatDateArabic(targetDate)})`;
  container.appendChild(header);

  todayMatches.forEach(match => {
    container.appendChild(createMatchCard(match));
  });
}

// رندرة قائمة المباريات القادمة مع البحث الحركي
function renderUpcomingList(query = '') {
  const container = document.getElementById('upcoming-list');
  container.innerHTML = '';

  const upcomingMatches = matchesDB.filter(m => {
    if (m.status !== 'scheduled') return false;
    if (!query) return true;
    
    const search = query.toLowerCase();
    const homeArabic = getArabicTeamName(m.homeTeam).toLowerCase();
    const awayArabic = getArabicTeamName(m.awayTeam).toLowerCase();
    return m.homeTeam.name.toLowerCase().includes(search) || 
           homeArabic.includes(search) ||
           m.awayTeam.name.toLowerCase().includes(search) || 
           awayArabic.includes(search) ||
           m.stage.toLowerCase().includes(search);
  });

  if (upcomingMatches.length === 0) {
    renderEmptyState(container, '🔍', 'لا توجد مباريات قادمة مطابقة', 'جرب البحث عن منتخب آخر أو تفقد جدول التبويب لاحقاً.');
    return;
  }

  const grouped = groupBy(upcomingMatches, 'date');
  Object.keys(grouped).sort().forEach(date => {
    const header = document.createElement('h2');
    header.className = 'date-group-header';
    header.textContent = formatDateArabic(date);
    container.appendChild(header);

    grouped[date].forEach(match => {
      container.appendChild(createMatchCard(match));
    });
  });
}

// رندرة قائمة النتائج مع البحث الحركي
function renderResultsList(query = '') {
  const container = document.getElementById('results-list');
  container.innerHTML = '';

  const resultsMatches = matchesDB.filter(m => {
    if (m.status !== 'finished') return false;
    if (!query) return true;
    
    const search = query.toLowerCase();
    const homeArabic = getArabicTeamName(m.homeTeam).toLowerCase();
    const awayArabic = getArabicTeamName(m.awayTeam).toLowerCase();
    return m.homeTeam.name.toLowerCase().includes(search) || 
           homeArabic.includes(search) ||
           m.awayTeam.name.toLowerCase().includes(search) || 
           awayArabic.includes(search) ||
           m.stage.toLowerCase().includes(search);
  });

  if (resultsMatches.length === 0) {
    renderEmptyState(container, '🔍', 'لا توجد نتائج مطابقة لطلبك', 'تأكد من كتابة اسم المنتخب بشكل صحيح (مثال: مصر، المكسيك).');
    return;
  }

  const grouped = groupBy(resultsMatches, 'date');
  Object.keys(grouped).sort().reverse().forEach(date => {
    const header = document.createElement('h2');
    header.className = 'date-group-header';
    header.textContent = formatDateArabic(date);
    container.appendChild(header);

    grouped[date].forEach(match => {
      container.appendChild(createMatchCard(match));
    });
  });
}

// رندرة المجموعات
function renderGroupsTab() {
  const container = document.getElementById('view-groups');
  container.innerHTML = '';

  if (groupsDB.length === 0) {
    renderEmptyState(container, '🏆', 'بيانات المجموعات غير متوفرة', 'لم يتم العثور على بيانات المجموعات حالياً.');
    return;
  }

  groupsDB.forEach(group => {
    const card = document.createElement('div');
    card.className = 'group-table-card';

    let tableRows = '';
    group.teams.forEach((team, idx) => {
      const isArab = team.isArab === true;
      const teamPoints = team.points !== undefined ? team.points : 0;
      const played = team.played !== undefined ? team.played : 0;
      const won = team.won !== undefined ? team.won : 0;
      const drawn = team.drawn !== undefined ? team.drawn : 0;
      const lost = team.lost !== undefined ? team.lost : 0;
      const goalsFor = team.goalsFor !== undefined ? team.goalsFor : 0;
      const goalsAgainst = team.goalsAgainst !== undefined ? team.goalsAgainst : 0;

      const teamFlagHTML = (team.flag && team.flag.startsWith('http'))
        ? `<img src="${team.flag}" style="width: 18px; height: 18px; object-fit: contain; margin-left: 6px;" onerror="this.style.display='none'">`
        : `<span>${team.flag || ''}</span>`;

      tableRows += `
        <tr class="${isArab ? 'highlighted-row' : ''}" onclick="showTeamStats('${team.name}')" style="cursor: pointer;" title="انقر لمشاهدة التفاصيل">
          <td>${idx + 1}</td>
          <td>
            <div class="table-team-name">
              ${teamFlagHTML}
              <span style="${isArab ? 'color: var(--ksa-text); font-weight: 800;' : ''}">${getArabicTeamName(team)}</span>
            </div>
          </td>
          <td>${played}</td>
          <td>${won}</td>
          <td>${drawn}</td>
          <td>${lost}</td>
          <td>${goalsFor}:${goalsAgainst}</td>
          <td style="font-weight: 900; color: ${isArab ? 'var(--ksa-text)' : 'var(--text-color)'}">${teamPoints}</td>
        </tr>
      `;
    });

    card.innerHTML = `
      <h3 class="group-title">${group.name}</h3>
      <table class="group-table">
        <thead>
          <tr>
            <th style="width: 8%">م</th>
            <th style="text-align: right; width: 44%">المنتخب</th>
            <th style="width: 8%">ل</th>
            <th style="width: 8%">ف</th>
            <th style="width: 8%">ت</th>
            <th style="width: 8%">خ</th>
            <th style="width: 10%">أهداف</th>
            <th style="width: 8%">نقاط</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    container.appendChild(card);
  });
}

// إنشاء عنصر كارت المباراة
function createMatchCard(match) {
  const card = document.createElement('div');
  const isFav = favorites.includes(match.id);
  const isArabMatch = match.homeTeam.isArab || match.awayTeam.isArab;
  
  card.className = `match-card ${isArabMatch ? 'highlighted-match' : ''}`;
  
  const homeArabicName = getArabicTeamName(match.homeTeam);
  const awayArabicName = getArabicTeamName(match.awayTeam);

  // شارات التمييز للمنتخبات العربية
  let badgeHTML = '';
  if (homeArabicName === 'السعودية' || awayArabicName === 'السعودية') {
    badgeHTML = `<span class="arab-badge">مباراة الأخضر 🇸🇦</span>`;
  } else if (isArabMatch) {
    badgeHTML = `<span class="arab-badge">مواجهة عربية 🌟</span>`;
  }

  // حالة المباراة
  let statusText = 'لم تبدأ';
  let statusClass = 'status-scheduled';
  if (match.status === 'live') {
    statusText = 'مباشرة';
    statusClass = 'status-live';
  } else if (match.status === 'finished') {
    statusText = 'انتهت';
    statusClass = 'status-finished';
  } else if (match.status === 'scheduled') {
    statusText = 'قادمة';
    statusClass = 'status-scheduled';
  } else {
    statusText = match.statusLong || match.statusShort || 'قادمة';
    statusClass = 'status-scheduled';
  }

  // النتيجة أو التوقيت
  let centerHTML = '';
  if (match.status === 'scheduled') {
    centerHTML = `<div class="time-display">${formatTime(match.time)}</div>`;
  } else {
    centerHTML = `
      <div class="score-display">
        <span>${match.scoreHome}</span>
        <span class="score-dash">-</span>
        <span>${match.scoreAway}</span>
      </div>
      <div class="time-display" style="font-size: 0.7rem; background: rgba(0,0,0,0.03); color: var(--gray-dark); margin-top: 4px;">
        ${formatTime(match.time)}
      </div>
    `;
  }

  const homeFlagHTML = (match.homeTeam.flag && match.homeTeam.flag.startsWith('http'))
    ? `<img src="${match.homeTeam.flag}" style="width: 20px; height: 20px; object-fit: contain; margin-left: 8px;" onerror="this.style.display='none'">`
    : `<span class="team-flag-emoji">${match.homeTeam.flag || ''}</span>`;

  const awayFlagHTML = (match.awayTeam.flag && match.awayTeam.flag.startsWith('http'))
    ? `<img src="${match.awayTeam.flag}" style="width: 20px; height: 20px; object-fit: contain; margin-left: 8px;" onerror="this.style.display='none'">`
    : `<span class="team-flag-emoji">${match.awayTeam.flag || ''}</span>`;

  card.innerHTML = `
    ${badgeHTML}
    <div class="match-header">
      <div class="match-stage">
        <span>🏆</span>
        <span>${match.stage}</span>
      </div>
      <span class="match-status-badge ${statusClass}">${statusText}</span>
    </div>
    
    <div class="match-teams-row">
      <!-- فريق المستضيف -->
      <div class="team-info" onclick="event.stopPropagation(); showTeamStats('${match.homeTeam.name}')" title="اضغط للتفاصيل">
        ${homeFlagHTML}
        <span class="team-name" style="${match.homeTeam.isArab ? 'color: var(--ksa-text); font-weight: 800;' : ''}">${homeArabicName}</span>
      </div>
      
      <!-- المنتصف والنتيجة -->
      <div class="match-score-center">
        ${centerHTML}
      </div>
      
      <!-- فريق الضيف -->
      <div class="team-info" onclick="event.stopPropagation(); showTeamStats('${match.awayTeam.name}')" title="اضغط للتفاصيل">
        ${awayFlagHTML}
        <span class="team-name" style="${match.awayTeam.isArab ? 'color: var(--ksa-text); font-weight: 800;' : ''}">${awayArabicName}</span>
      </div>
    </div>
    
    <div class="match-meta match-venue" style="margin-bottom: 0; padding-bottom: 0; border-bottom: none; margin-top: 8px;">
      <span class="stadium-text">
        📍 ${match.stadium}
      </span>
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 0.68rem; color: var(--gray-dark)">
          📅 ${formatDateString(match.date)}
        </span>
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${match.id}', this)" title="إضافة للمفضلة">
          <span>${isFav ? '★' : '☆'}</span>
        </button>
      </div>
    </div>
  `;

  return card;
}

// تبديل حالة المفضلة وحفظها
function toggleFavorite(matchId, buttonElement) {
  const index = favorites.indexOf(matchId);
  
  // البحث عن معلومات المباراة للتوست
  const match = matchesDB.find(m => m.id === matchId);
  const teamsName = match ? `${getArabicTeamName(match.homeTeam)} ضد ${getArabicTeamName(match.awayTeam)}` : '';

  if (index === -1) {
    favorites.push(matchId);
    showToast(`تمت إضافة [${teamsName}] للمفضلة ⭐`, 'success');
    if (buttonElement) {
      buttonElement.classList.add('active');
      buttonElement.querySelector('span').textContent = '★';
    }
  } else {
    favorites.splice(index, 1);
    showToast('تمت إزالة المباراة من المفضلة 💨', 'info');
    if (buttonElement) {
      buttonElement.classList.remove('active');
      buttonElement.querySelector('span').textContent = '☆';
    }
  }

  localStorage.setItem('korah_favorites', JSON.stringify(favorites));
}

// متغير لتخزين معرّف التوقيت لمنع تداخل التنبيهات ونشوب أخطاء بقاء التوست
let toastTimeout = null;

// إظهار التنبيهات (Toast)
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toast-icon');
  const text = document.getElementById('toast-text');

  if (!toast || !text) return;

  text.textContent = message;
  icon.textContent = type === 'success' ? '⭐' : 'ℹ️';

  toast.classList.add('show');
  
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    toastTimeout = null;
  }, 3000); // إخفاء بعد 3 ثوانٍ تلقائياً
}

// عرض شاشة تفاصيل المنتخب (Bottom Sheet) مع إحصائيات مستوحاة من الترتيب
function showTeamStats(teamName) {
  // البحث عن بيانات المنتخب في قاعدة البيانات
  let teamObj = null;
  for (let match of matchesDB) {
    if (match.homeTeam.name === teamName || getArabicTeamName(match.homeTeam) === teamName) {
      teamObj = match.homeTeam;
      break;
    } else if (match.awayTeam.name === teamName || getArabicTeamName(match.awayTeam) === teamName) {
      teamObj = match.awayTeam;
      break;
    }
  }

  // إذا لم نجدها في المباريات، نبحث في ترتيب المجموعات
  if (!teamObj) {
    for (let group of groupsDB) {
      const found = group.teams.find(t => t.name === teamName || getArabicTeamName(t) === teamName);
      if (found) {
        teamObj = found;
        break;
      }
    }
  }

  if (!teamObj) return;

  // إعداد البيانات الافتراضية للـ Rank والـ Form
  const rank = teamObj.rank || 50;
  
  // توليد أداء تقديري واقعي (كلما قل رقم التصنيف كانت النتائج أفضل)
  let mockForm = ['ف', 'ت', 'ف', 'خ', 'ف'];
  if (rank < 10) mockForm = ['ف', 'ف', 'ف', 'ت', 'ف'];
  else if (rank < 25) mockForm = ['ف', 'ت', 'خ', 'ف', 'ف'];
  else if (rank > 45) mockForm = ['خ', 'ت', 'ف', 'خ', 'ت'];

  // تعبئة البيانات في الـ Bottom Sheet
  document.getElementById('sheet-team-name').textContent = getArabicTeamName(teamObj);
  document.getElementById('sheet-team-rank').textContent = `تصنيف الفيفا العالمي: #${rank}`;
  
  const flagContainer = document.getElementById('sheet-flag-container');
  if (flagContainer) {
    if (teamObj.flag && teamObj.flag.startsWith('http')) {
      flagContainer.innerHTML = `<img src="${teamObj.flag}" style="width: 42px; height: 42px; object-fit: contain;">`;
    } else {
      flagContainer.textContent = teamObj.flag || '';
    }
  }

  // رندرة شارات الأداء الأخير
  const formContainer = document.getElementById('sheet-form-container');
  formContainer.innerHTML = '';
  mockForm.forEach(result => {
    let classType = 'draw';
    if (result === 'ف') classType = 'win';
    if (result === 'خ') classType = 'loss';
    formContainer.innerHTML += `<span class="form-badge ${classType}">${result}</span>`;
  });

  // حساب مؤشرات أداء واقعية تقديرية
  const attackVal = Math.round(Math.max(55, 98 - (rank * 0.45)));
  const midfieldVal = Math.round(Math.max(55, 96 - (rank * 0.5)));
  const defenseVal = Math.round(Math.max(55, 95 - (rank * 0.55)));

  document.getElementById('stat-val-attack').textContent = `${attackVal}%`;
  document.getElementById('stat-val-midfield').textContent = `${midfieldVal}%`;
  document.getElementById('stat-val-defense').textContent = `${defenseVal}%`;

  // إظهار اللوحة والغطاء الشفاف
  document.getElementById('sheet-overlay').classList.add('active');
  document.getElementById('bottom-sheet').classList.add('active');

  // تحريك مؤشرات الإحصائيات
  setTimeout(() => {
    document.getElementById('stat-bar-attack').style.width = `${attackVal}%`;
    document.getElementById('stat-bar-midfield').style.width = `${midfieldVal}%`;
    document.getElementById('stat-bar-defense').style.width = `${defenseVal}%`;
  }, 150);
}

// إغلاق لوحة التفاصيل
function closeBottomSheet() {
  document.getElementById('sheet-overlay').classList.remove('active');
  document.getElementById('bottom-sheet').classList.remove('active');
  
  // تصفير المؤشرات للأنيميشن القادم
  document.getElementById('stat-bar-attack').style.width = '0%';
  document.getElementById('stat-bar-midfield').style.width = '0%';
  document.getElementById('stat-bar-defense').style.width = '0%';
}

// عرض علامة التحميل
function showLoader(container) {
  container.innerHTML = `
    <div class="loader">
      <div class="spinner"></div>
      <p style="font-weight: 700;">جاري تحميل جدول المباريات...</p>
    </div>
  `;
}

// عرض رسالة خطأ
function renderError(container, msg) {
  container.innerHTML = `
    <div class="error-message">
      <p>⚠️ ${msg}</p>
    </div>
  `;
}

// عرض شاشة فارغة
function renderEmptyState(container, icon, title, text) {
  container.innerHTML = `
    <div class="empty-state">
      <span class="empty-icon">${icon}</span>
      <h3 class="empty-title">${title}</h3>
      <p class="empty-text">${text}</p>
    </div>
  `;
}

// تنسيق وتجميع الوقت
function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

function formatTime(timeString) {
  const parts = timeString.split(':');
  let hour = parseInt(parts[0], 10);
  const minute = parts[1];
  
  const period = hour >= 12 ? 'م' : 'ص';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  
  return `${hour}:${minute} ${period}`;
}

function formatDateString(dateString) {
  const parts = dateString.split('-');
  return `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}`;
}

function formatDateArabic(dateString) {
  const days = {
    0: "الأحد",
    1: "الاثنين",
    2: "الثلاثاء",
    3: "الأربعاء",
    4: "الخميس",
    5: "الجمعة",
    6: "السبت"
  };
  const months = {
    1: "يناير",
    2: "فبراير",
    3: "مارس",
    4: "أبريل",
    5: "مايو",
    6: "يونيو",
    7: "يوليو",
    8: "أغسطس",
    9: "سبتمبر",
    10: "أكتوبر",
    11: "نوفمبر",
    12: "ديسمبر"
  };
  
  const parts = dateString.split('-');
  const year = parts[0];
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = days[dateObj.getDay()];
  const monthName = months[month];
  
  return `${dayOfWeek}، ${day} ${monthName} ${year}`;
}
