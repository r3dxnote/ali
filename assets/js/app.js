// متغيرات التطبيق
let matchesDB = [];
let groupsDB = [];
let metaDB = {};
let activeTab = 'today'; // التبويب الافتراضي النشط

// تهيئة المفضلة من LocalStorage
let favorites = JSON.parse(localStorage.getItem('korah_favorites')) || [];

// عند تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
  // مراجعة الـ sessionStorage لكي لا تظهر شاشة الترحيب مجدداً في الجلسة الواحدة
  if (sessionStorage.getItem('splashDismissed')) {
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';
  }
  
  initApp();
  setupSearchListeners();
});

// تهيئة التطبيق وجلب البيانات
async function initApp() {
  const contentArea = document.getElementById('view-today');
  showLoader(contentArea);

  try {
    // جلب البيانات الوصفية والمباريات بالتوازي باستخدام مسارات نسبية
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

    // تحديث ترويسة التطبيق والبيانات الوصفية
    updateAppHeader();

    // رندرة البيانات للتبويب النشط
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
  if (headerSubtitleEl && metaDB.description) {
    headerSubtitleEl.textContent = metaDB.description;
  }

  const disclaimerTextEl = document.getElementById('disclaimer-text');
  if (disclaimerTextEl && metaDB.disclaimer) {
    disclaimerTextEl.textContent = metaDB.disclaimer;
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
  showToast('أهلاً بك! تم ضبط التوقيت حسب توقيت مكة المكرمة 🇸🇦', 'info');
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
}

// رندرة تبويب مباريات اليوم
function renderTodayTab() {
  const container = document.getElementById('view-today');
  container.innerHTML = '';

  const targetDate = metaDB.demoToday || '2026-06-17';
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
    return m.homeTeam.name.toLowerCase().includes(search) || 
           m.awayTeam.name.toLowerCase().includes(search) || 
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
    return m.homeTeam.name.toLowerCase().includes(search) || 
           m.awayTeam.name.toLowerCase().includes(search) || 
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

      tableRows += `
        <tr class="${isArab ? 'highlighted-row' : ''}" onclick="showTeamStats('${team.name}')" style="cursor: pointer;" title="انقر لمشاهدة التفاصيل">
          <td>${idx + 1}</td>
          <td>
            <div class="table-team-name">
              <span>${team.flag}</span>
              <span style="${isArab ? 'color: var(--ksa-text); font-weight: 800;' : ''}">${team.name}</span>
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
  
  // شارات التمييز للمنتخبات العربية
  let badgeHTML = '';
  if (match.homeTeam.name === 'السعودية' || match.awayTeam.name === 'السعودية') {
    badgeHTML = `<span class="arab-badge">مباراة الأخضر 🇸🇦</span>`;
  } else if (isArabMatch) {
    badgeHTML = `<span class="arab-badge">مواجهة عربية 🌟</span>`;
  }

  // حالة المباراة
  let statusText = 'لم تبدأ';
  let statusClass = 'status-scheduled';
  if (match.status === 'live') {
    statusText = 'مباشر';
    statusClass = 'status-live';
  } else if (match.status === 'finished') {
    statusText = 'انتهت';
    statusClass = 'status-finished';
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
        <span class="team-flag-emoji">${match.homeTeam.flag}</span>
        <span class="team-name" style="${match.homeTeam.isArab ? 'color: var(--ksa-text); font-weight: 800;' : ''}">${match.homeTeam.name}</span>
      </div>
      
      <!-- المنتصف والنتيجة -->
      <div class="match-score-center">
        ${centerHTML}
      </div>
      
      <!-- فريق الضيف -->
      <div class="team-info" onclick="event.stopPropagation(); showTeamStats('${match.awayTeam.name}')" title="اضغط للتفاصيل">
        <span class="team-flag-emoji">${match.awayTeam.flag}</span>
        <span class="team-name" style="${match.awayTeam.isArab ? 'color: var(--ksa-text); font-weight: 800;' : ''}">${match.awayTeam.name}</span>
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
  const teamsName = match ? `${match.homeTeam.name} ضد ${match.awayTeam.name}` : '';

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

// إظهار التنبيهات (Toast)
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toast-icon');
  const text = document.getElementById('toast-text');

  if (!toast || !text) return;

  text.textContent = message;
  icon.textContent = type === 'success' ? '⭐' : 'ℹ️';

  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// عرض شاشة تفاصيل المنتخب (Bottom Sheet) مع إحصائيات مستوحاة من الترتيب
function showTeamStats(teamName) {
  // البحث عن بيانات المنتخب في قاعدة البيانات
  let teamObj = null;
  for (let match of matchesDB) {
    if (match.homeTeam.name === teamName) {
      teamObj = match.homeTeam;
      break;
    } else if (match.awayTeam.name === teamName) {
      teamObj = match.awayTeam;
      break;
    }
  }

  // إذا لم نجدها في المباريات، نبحث في ترتيب المجموعات
  if (!teamObj) {
    for (let group of groupsDB) {
      const found = group.teams.find(t => t.name === teamName);
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
  document.getElementById('sheet-team-name').textContent = teamObj.name;
  document.getElementById('sheet-team-rank').textContent = `تصنيف الفيفا العالمي: #${rank}`;
  document.getElementById('sheet-flag-container').textContent = teamObj.flag;

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
