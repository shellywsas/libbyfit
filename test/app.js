// LibiFit Main Application Controller

class LibiFitApp {
  constructor() {
    this.currentTab = 'calendar';
    this.calendarView = 'weekly';
    this.templateFilter = 'all';
    this.currentDate = new Date();
    this.selectedDateStr = this.formatDate(new Date());

    this.loadState();

    this.timer = {
      secondsLeft: 0,
      totalSeconds: 0,
      interval: null,
      running: false
    };

    this.activeModal = null;
    this.editingWorkout = null;
    this.completingWorkout = null;
    this.detailWorkout = null;
    this.editingTemplate = null;
    this.editingPR = null;

    this.recentTeammates = this.loadTeammates();
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches || !!window.navigator.standalone;
    this.isWhatsApp = /WhatsApp/i.test(navigator.userAgent);

    this.sessionId = 'sess-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    this.authTab = 'login';
    this.authError = '';
    this.authLoading = false;

    this.customSports = [];
    this.surveyActiveTab = 'daily';
    this.trendsMetric = 'energy';
    this.trendsDate = new Date();
    this.editingCustomSport = null;
  }

  getUserName() {
    if (window.firebaseService) {
      return window.firebaseService.getUserName();
    }
    return localStorage.getItem('libi_username') || 'ליבי';
  }

  getSportsList() {
    return getAllSportsList(this.customSports);
  }

  getAllSportsMap() {
    return getAllSportsMap(this.customSports);
  }

  openCustomSportModal() {
    this.editingCustomSport = {
      id: 'custom-' + Date.now(),
      name: '',
      emoji: '🏊‍♀️',
      accentColor: '#06B6D4'
    };
    this.openModal('customSport');
  }

  saveCustomSport(sportData) {
    if (!sportData || !sportData.name || !sportData.name.trim()) return;
    const cleanName = sportData.name.trim();
    const newSport = {
      id: sportData.id || ('custom-' + Date.now()),
      name: cleanName,
      emoji: sportData.emoji || '⭐',
      accentColor: sportData.accentColor || '#0284C7',
      lightBg: sportData.lightBg || '#F0F9FF',
      isCustom: true
    };
    const existingIdx = this.customSports.findIndex(s => s.id === newSport.id);
    if (existingIdx >= 0) {
      this.customSports[existingIdx] = newSport;
    } else {
      this.customSports.push(newSport);
    }
    this.saveState();
    this.closeModal();
    if (this.editingWorkout) {
      this.changeWorkoutType(newSport.id);
    } else {
      this.render();
    }
  }

  deleteCustomSport(id) {
    if (!confirm('האם את בטוחה שברצונך למחוק ספורט זה?')) return;
    this.customSports = this.customSports.filter(s => s.id !== id);
    this.saveState();
    this.render();
  }

  setTemplateFilter(sportId) {
    this.templateFilter = sportId || 'all';
    this.render();
  }

  loadState() {
    try {
      this.workouts = JSON.parse(localStorage.getItem('libi_workouts')) || JSON.parse(localStorage.getItem('libby_workouts')) || [];
      this.templates = JSON.parse(localStorage.getItem('libi_templates')) || JSON.parse(localStorage.getItem('libby_templates')) || DEFAULT_TEMPLATES;
      this.recoveryLogs = JSON.parse(localStorage.getItem('libi_recovery')) || JSON.parse(localStorage.getItem('libby_recovery')) || {};
      this.personalRecords = JSON.parse(localStorage.getItem('libi_prs')) || JSON.parse(localStorage.getItem('libby_prs')) || DEFAULT_PRS;
      this.customSports = JSON.parse(localStorage.getItem('libi_custom_sports')) || [];
    } catch (e) {
      console.error('Error loading state:', e);
      this.workouts = [];
      this.templates = DEFAULT_TEMPLATES;
      this.recoveryLogs = {};
      this.personalRecords = DEFAULT_PRS;
      this.customSports = [];
    }
  }

  saveStateLocally() {
    try {
      const wJson = JSON.stringify(this.workouts);
      const tJson = JSON.stringify(this.templates);
      const rJson = JSON.stringify(this.recoveryLogs);
      const pJson = JSON.stringify(this.personalRecords);
      const csJson = JSON.stringify(this.customSports);

      // Save to primary Libi keys
      localStorage.setItem('libi_workouts', wJson);
      localStorage.setItem('libi_templates', tJson);
      localStorage.setItem('libi_recovery', rJson);
      localStorage.setItem('libi_prs', pJson);
      localStorage.setItem('libi_custom_sports', csJson);

      // Also mirror to legacy keys for safety
      localStorage.setItem('libby_workouts', wJson);
      localStorage.setItem('libby_templates', tJson);
      localStorage.setItem('libby_recovery', rJson);
      localStorage.setItem('libby_prs', pJson);
    } catch (e) {
      console.error('Error saving state locally:', e);
    }
  }

  saveState() {
    this.saveStateLocally();
    if (window.firebaseService && window.firebaseService.isLoggedIn()) {
      window.firebaseService.syncToCloud();
    }
  }

  loadTeammates() {
    const fromStorage = localStorage.getItem('libi_teammates') || localStorage.getItem('libby_teammates');
    if (fromStorage) return JSON.parse(fromStorage);
    return ['נועה', 'מאי', 'שירה', 'עמית', 'דניאל', 'רוני'];
  }

  saveTeammate(name) {
    if (!name || !name.trim()) return;
    const clean = name.trim();
    if (!this.recentTeammates.includes(clean)) {
      this.recentTeammates.unshift(clean);
      if (this.recentTeammates.length > 15) this.recentTeammates.pop();
      const tJson = JSON.stringify(this.recentTeammates);
      localStorage.setItem('libi_teammates', tJson);
      localStorage.setItem('libby_teammates', tJson);
    }
  }

  formatDate(date) {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  formatHebrewDate(dateStr) {
    const d = new Date(dateStr);
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
    return `${days[d.getDay()]}', ${d.getDate()} ב${months[d.getMonth()]}`;
  }

  playBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  startRestTimer(seconds) {
    clearInterval(this.timer.interval);
    this.timer.totalSeconds = seconds;
    this.timer.secondsLeft = seconds;
    this.timer.running = true;

    this.timer.interval = setInterval(() => {
      this.timer.secondsLeft--;
      if (this.timer.secondsLeft <= 0) {
        clearInterval(this.timer.interval);
        this.timer.running = false;
        this.playBeep();
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
      this.updateTimerUI();
    }, 1000);

    this.updateTimerUI();
  }

  stopRestTimer() {
    clearInterval(this.timer.interval);
    this.timer.running = false;
    this.timer.secondsLeft = 0;
    this.updateTimerUI();
  }

  updateTimerUI() {
    const el = document.getElementById('timer-bar');
    if (!el) return;
    if (!this.timer.running && this.timer.secondsLeft === 0) {
      el.classList.add('hidden');
      return;
    }
    el.classList.remove('hidden');
    const mins = Math.floor(this.timer.secondsLeft / 60);
    const secs = this.timer.secondsLeft % 60;
    const timeDisplay = `${mins}:${secs.toString().padStart(2, '0')}`;
    const pct = Math.round((this.timer.secondsLeft / this.timer.totalSeconds) * 100);

    const txt = document.getElementById('timer-text');
    const prog = document.getElementById('timer-progress');
    if (txt) txt.innerText = timeDisplay;
    if (prog) prog.style.width = `${pct}%`;
  }

  init() {
    this.render();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW error:', err));
    }
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(persistent => {
        console.log('Persistent storage enabled:', persistent);
      }).catch(err => console.log('Storage persist error:', err));
    }

    // First time entry check: show registration or login screen
    const hasPrompted = localStorage.getItem('libi_auth_welcomed');
    const isLoggedIn = window.firebaseService && window.firebaseService.isLoggedIn();
    if (!isLoggedIn && !hasPrompted) {
      localStorage.setItem('libi_auth_welcomed', 'true');
      this.authTab = 'register';
      this.openModal('authModal');
    }
  }

  render() {
    const appEl = document.getElementById('app');
    appEl.innerHTML = `
      ${this.renderStagingBanner()}
      ${this.renderWhatsAppBanner()}
      ${this.renderHeader()}
      ${this.renderTimerBar()}
      <main class="flex-1 overflow-y-auto px-4 py-3">
        ${this.renderActiveTab()}
      </main>
      ${this.renderBottomNav()}
      ${renderModalContainer()}
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderStagingBanner() {
    return `
      <div class="bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900 text-white px-3 py-1.5 text-xs font-bold flex items-center justify-between shadow-xs sticky top-0 z-50">
        <span class="flex items-center gap-1.5 truncate">
          <span class="text-sm animate-pulse">🧪</span>
          <span>אתר בדיקות • גרסה מעודכנת (14:00)</span>
        </span>
        <div class="flex items-center gap-1.5 shrink-0">
          <button onclick="app.clearCacheAndReload()" class="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-2 py-0.5 rounded text-[10px] whitespace-nowrap shadow-xs active:scale-95 transition" title="ניקוי זיכרון מטמון וטעינת הגרסה הכי חדשה">
            רענון גרסה 🔄
          </button>
          <a href="../" class="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded text-[10px] whitespace-nowrap transition">
            לאתר הרשמי ↗
          </a>
        </div>
      </div>
    `;
  }

  async clearCacheAndReload() {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(r => r.unregister()));
      }
    } catch (e) {
      console.log('Cache clear error:', e);
    }
    window.location.href = window.location.pathname + '?v=' + Date.now();
  }

  renderWhatsAppBanner() {
    if (!this.isWhatsApp || this.isInstalled) return '';
    return `
      <div class="bg-amber-400 text-amber-950 px-3 py-1.5 text-[11px] font-bold flex items-center justify-between shadow-xs sticky top-0 z-40">
        <span class="flex items-center gap-1.5 truncate">
          <span>⚠️</span>
          <span>נפתח בוואטסאפ? לחצי ⋮ למעלה ובחרי "פתח בכרום" להתקנה!</span>
        </span>
        <button onclick="app.openModal('installGuideModal')" class="bg-amber-950 text-white px-2 py-0.5 rounded text-[10px] whitespace-nowrap mr-1 hover:bg-amber-900">
          מדריך
        </button>
      </div>
    `;
  }

  renderHeader() {
    const userName = this.getUserName();
    const isLoggedIn = window.firebaseService && window.firebaseService.isLoggedIn();

    return `
      <header class="bg-gradient-to-l from-brand-600 via-sky-500 to-cyan-500 text-white pt-4 pb-3 px-4 shadow-md sticky top-0 z-30">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 space-x-reverse">
            <!-- Custom Multi-Sport Logo Badge (Dumbbell, Volleyball, Tennis, Climbing) -->
            <div class="w-11 h-11 rounded-2xl overflow-hidden shadow-md border-2 border-white/40 flex-shrink-0 bg-white">
              <img src="./app-logo.png" alt="LibiFit Logo" class="w-full h-full object-cover">
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h1 class="text-xl font-bold font-display tracking-tight">LibiFit</h1>
                <button
                  onclick="app.openModal('authModal')"
                  class="text-xs bg-white/25 hover:bg-white/35 active:scale-95 transition px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 cursor-pointer border border-white/30"
                  title="לחצי לשינוי שם או כניסה לחשבון בענן">
                  <span>${userName} ✨</span>
                  ${isLoggedIn ? '<span class="w-2 h-2 rounded-full bg-emerald-300 inline-block shadow-xs"></span>' : ''}
                </button>
              </div>
              <p class="text-[11px] text-brand-100 font-medium">כדורעף • כושר • טניס • טיפוס</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            ${!this.isInstalled ? `
              <button onclick="app.promptInstall()" class="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-2.5 py-1.5 rounded-xl shadow-sm text-xs transition active:scale-95 border border-emerald-400" title="התקנת האפליקציה בטלפון">
                <i data-lucide="download" class="w-4 h-4"></i>
                <span>התקנה</span>
              </button>
            ` : ''}
            <button
              onclick="app.openModal('authModal')"
              class="p-2 rounded-xl ${isLoggedIn ? 'bg-emerald-500/80 hover:bg-emerald-600' : 'bg-white/15 hover:bg-white/25'} transition active:scale-95 flex items-center justify-center shadow-xs"
              title="${isLoggedIn ? 'חשבון מחובר ומסונכרן לענן' : 'כניסה לחשבון / סנכרון ענן'}">
              <i data-lucide="${isLoggedIn ? 'cloud' : 'user'}" class="w-5 h-5 text-white"></i>
            </button>
            <button onclick="app.openModal('backupModal')" class="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition active:scale-95" title="גיבוי ושמירה">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
            </button>
            <button onclick="app.openNewWorkoutModal()" class="flex items-center gap-1 bg-white text-brand-700 font-bold px-3 py-1.5 rounded-xl shadow-sm hover:bg-brand-50 transition active:scale-95 text-xs">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>אימון חדש</span>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  renderTimerBar() {
    return `
      <div id="timer-bar" class="hidden bg-cyan-900 text-white px-4 py-2 flex items-center justify-between text-xs sticky top-[68px] z-20 shadow-md">
        <div class="flex items-center gap-2">
          <i data-lucide="timer" class="w-4 h-4 text-cyan-300 animate-pulse"></i>
          <span>טיימר מנוחה:</span>
          <span id="timer-text" class="font-bold text-sm font-mono text-cyan-200">00:00</span>
        </div>
        <div class="w-32 bg-cyan-950 rounded-full h-2 overflow-hidden mx-2">
          <div id="timer-progress" class="bg-cyan-400 h-full w-full transition-all duration-1000"></div>
        </div>
        <button onclick="app.stopRestTimer()" class="text-cyan-300 hover:text-white px-2 py-0.5 bg-white/10 rounded">
          עצור
        </button>
      </div>
    `;
  }

  renderBottomNav() {
    const tabs = [
      { id: 'calendar', label: 'יומן', icon: 'calendar-days' },
      { id: 'gym', label: 'תבניות וכושר', icon: 'clipboard-list' },
      { id: 'recovery', label: 'מצב רוח וגוף', icon: 'activity' },
      { id: 'records', label: 'שיאים', icon: 'trophy' }
    ];

    return `
      <nav class="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex justify-around items-center z-30 safe-bottom shadow-lg">
        ${tabs.map(t => {
          const active = this.currentTab === t.id;
          return `
            <button onclick="app.setTab('${t.id}')" class="flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${active ? 'text-brand-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'}">
              <div class="relative p-1">
                <i data-lucide="${t.icon}" class="w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}"></i>
                ${active ? '<span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-500 rounded-full"></span>' : ''}
              </div>
              <span class="text-[11px] mt-0.5">${t.label}</span>
            </button>
          `;
        }).join('')}
      </nav>
    `;
  }

  setTab(tabId) {
    this.currentTab = tabId;
    this.render();
  }

  renderActiveTab() {
    switch (this.currentTab) {
      case 'calendar': return renderCalendarTab();
      case 'gym': return renderGymTab();
      case 'recovery': return renderRecoveryTab();
      case 'records': return renderRecordsTab();
      default: return renderCalendarTab();
    }
  }

  // Calendar Helpers
  setCalendarView(view) {
    this.calendarView = view;
    this.render();
  }

  getWeekStartDate(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  }

  navCalendar(direction) {
    if (this.calendarView === 'weekly') {
      this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
    } else if (this.calendarView === 'monthly') {
      this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() + direction);
      this.selectedDateStr = this.formatDate(this.currentDate);
    }
    this.render();
  }

  resetToToday() {
    this.currentDate = new Date();
    this.selectedDateStr = this.formatDate(this.currentDate);
    this.render();
  }

  selectDateAndGoDaily(dStr) {
    this.currentDate = new Date(dStr);
    this.selectedDateStr = dStr;
    this.calendarView = 'daily';
    this.render();
  }

  // Workout Logger Methods
  openNewWorkoutModal(dateStr) {
    this.editingWorkout = {
      id: 'w-' + Date.now(),
      date: dateStr || this.formatDate(new Date()),
      startTime: '18:00',
      endTime: '19:30',
      type: 'volleyball',
      title: '',
      notes: '',
      partner: '',
      videoUrls: [''],
      videoUrl: '',
      isPlanned: false,
      color: '#06B6D4',
      exercises: []
    };
    this.openModal('workoutForm');
  }

  openEditWorkoutModal(workoutId) {
    const w = this.workouts.find(item => item.id === workoutId);
    if (!w) return;
    this.editingWorkout = JSON.parse(JSON.stringify(w));
    if (!this.editingWorkout.videoUrls) {
      this.editingWorkout.videoUrls = getWorkoutVideoUrls(this.editingWorkout);
    }
    if (!this.editingWorkout.videoUrls || this.editingWorkout.videoUrls.length === 0) {
      this.editingWorkout.videoUrls = [''];
    }
    this.closeModal();
    this.openModal('workoutForm');
  }

  syncWorkoutFormInputs() {
    if (!this.editingWorkout) return;
    const titleEl = document.getElementById('w-title');
    if (titleEl) this.editingWorkout.title = titleEl.value;

    const dateEl = document.getElementById('w-date');
    if (dateEl) this.editingWorkout.date = dateEl.value;

    const startTimeEl = document.getElementById('w-start-time');
    if (startTimeEl) this.editingWorkout.startTime = startTimeEl.value;

    const endTimeEl = document.getElementById('w-end-time');
    if (endTimeEl) this.editingWorkout.endTime = endTimeEl.value;

    const notesEl = document.getElementById('w-notes');
    if (notesEl) this.editingWorkout.notes = notesEl.value;

    const partnerEl = document.getElementById('w-partner');
    if (partnerEl) this.editingWorkout.partner = partnerEl.value;
  }

  toggleWorkoutPlanned(checked) {
    this.syncWorkoutFormInputs();
    this.editingWorkout.isPlanned = checked;
    this.render();
  }

  changeWorkoutType(typeId) {
    this.syncWorkoutFormInputs();
    this.editingWorkout.type = typeId;
    const sportsMap = this.getAllSportsMap();
    this.editingWorkout.color = sportsMap[typeId]?.accentColor || '#0EA5E9';
    if (typeId === 'gym' && (!this.editingWorkout.exercises || this.editingWorkout.exercises.length === 0)) {
      this.editingWorkout.exercises = [
        { name: 'סקוואט עם מוט', isBodyweight: false, sets: [{ setNum: 1, weight: 40, reps: 8, done: true }, { setNum: 2, weight: 40, reps: 8, done: true }] }
      ];
    }
    this.render();
  }

  setWorkoutColor(hex) {
    if (this.editingWorkout) {
      this.syncWorkoutFormInputs();
      this.editingWorkout.color = hex;
      this.render();
    }
  }

  setCompletingColor(hex) {
    if (this.completingWorkout) {
      this.syncCompletingWorkoutFormInputs();
      this.completingWorkout.color = hex;
      this.render();
    }
  }

  updateWorkoutColorDirect(id, hex) {
    const w = this.workouts.find(item => item.id === id);
    if (w) {
      w.color = hex;
      this.saveState();
      if (this.detailWorkout && this.detailWorkout.id === id) {
        this.detailWorkout.color = hex;
      }
      this.render();
    }
  }

  addTeammateToInput(name) {
    const input = document.getElementById('w-partner');
    if (!input) return;
    const current = input.value.trim();
    if (!current) {
      input.value = name;
    } else if (!current.includes(name)) {
      input.value = current + ', ' + name;
    }
    if (this.editingWorkout) {
      this.editingWorkout.partner = input.value;
    }
  }

  addWorkoutVideoUrl() {
    this.syncWorkoutFormInputs();
    if (!this.editingWorkout.videoUrls) {
      this.editingWorkout.videoUrls = this.editingWorkout.videoUrl ? [this.editingWorkout.videoUrl] : [];
    }
    this.editingWorkout.videoUrls.push('');
    this.render();
  }

  updateWorkoutVideoUrl(idx, val) {
    if (!this.editingWorkout.videoUrls) {
      this.editingWorkout.videoUrls = [''];
    }
    this.editingWorkout.videoUrls[idx] = val;
  }

  removeWorkoutVideoUrl(idx) {
    this.syncWorkoutFormInputs();
    if (!this.editingWorkout.videoUrls) return;
    this.editingWorkout.videoUrls.splice(idx, 1);
    if (this.editingWorkout.videoUrls.length === 0) {
      this.editingWorkout.videoUrls.push('');
    }
    this.render();
  }

  loadTemplateIntoCurrentWorkout(tmplId) {
    if (!tmplId) return;
    this.syncWorkoutFormInputs();
    const tmpl = this.templates.find(t => t.id === tmplId);
    if (!tmpl) return;

    this.editingWorkout.title = tmpl.name;
    const sport = tmpl.sport || 'gym';
    this.editingWorkout.type = sport;
    const cfg = SPORT_CONFIGS[sport] || SPORT_CONFIGS.other;
    this.editingWorkout.color = tmpl.color || cfg.accentColor;

    if (tmpl.partner) {
      this.editingWorkout.partner = tmpl.partner;
    }
    if (tmpl.notes || tmpl.description) {
      this.editingWorkout.notes = tmpl.notes || tmpl.description;
    }

    if (tmpl.exercises && tmpl.exercises.length > 0) {
      this.editingWorkout.exercises = tmpl.exercises.map(ex => {
        const sets = [];
        const count = ex.defaultSets || 3;
        for (let s = 1; s <= count; s++) {
          sets.push({
            setNum: s,
            weight: ex.isBodyweight ? '' : (ex.defaultWeight || ''),
            reps: ex.defaultReps || 10,
            done: false
          });
        }
        return {
          name: ex.name,
          isBodyweight: !!ex.isBodyweight,
          sets: sets
        };
      });
    } else if (sport !== 'gym') {
      this.editingWorkout.exercises = [];
    }
    this.render();
  }

  addExerciseToWorkout() {
    this.syncWorkoutFormInputs();
    this.editingWorkout.exercises.push({
      name: '',
      isBodyweight: false,
      sets: [
        { setNum: 1, weight: '', reps: 10, done: false },
        { setNum: 2, weight: '', reps: 10, done: false },
        { setNum: 3, weight: '', reps: 10, done: false }
      ]
    });
    this.render();
  }

  removeExerciseFromWorkout(idx) {
    this.syncWorkoutFormInputs();
    this.editingWorkout.exercises.splice(idx, 1);
    this.render();
  }

  toggleExBodyweight(idx, checked) {
    this.syncWorkoutFormInputs();
    this.editingWorkout.exercises[idx].isBodyweight = checked;
    this.render();
  }

  addSetToExercise(idx) {
    this.syncWorkoutFormInputs();
    const ex = this.editingWorkout.exercises[idx];
    const nextNum = ex.sets.length + 1;
    const lastWeight = ex.sets.length > 0 ? ex.sets[ex.sets.length - 1].weight : '';
    const lastReps = ex.sets.length > 0 ? ex.sets[ex.sets.length - 1].reps : 10;
    ex.sets.push({
      setNum: nextNum,
      weight: lastWeight,
      reps: lastReps,
      done: false
    });
    this.render();
  }

  updateExName(idx, val) {
    this.editingWorkout.exercises[idx].name = val;
  }

  addSetToExercise(idx) {
    const ex = this.editingWorkout.exercises[idx];
    const nextNum = ex.sets.length + 1;
    const lastWeight = ex.sets.length > 0 ? ex.sets[ex.sets.length - 1].weight : '';
    const lastReps = ex.sets.length > 0 ? ex.sets[ex.sets.length - 1].reps : 10;
    ex.sets.push({
      setNum: nextNum,
      weight: lastWeight,
      reps: lastReps,
      done: false
    });
    this.render();
  }

  updateSetWeight(exIdx, sIdx, val) {
    this.editingWorkout.exercises[exIdx].sets[sIdx].weight = val;
  }

  updateSetReps(exIdx, sIdx, val) {
    this.editingWorkout.exercises[exIdx].sets[sIdx].reps = val;
  }

  updateSetDone(exIdx, sIdx, checked) {
    this.editingWorkout.exercises[exIdx].sets[sIdx].done = checked;
  }

  saveWorkoutFromForm() {
    const w = this.editingWorkout;
    const sportsMap = this.getAllSportsMap();
    w.date = document.getElementById('w-date')?.value || w.date;
    w.startTime = document.getElementById('w-start-time')?.value || '18:00';
    w.endTime = document.getElementById('w-end-time')?.value || '19:30';
    const titleVal = document.getElementById('w-title')?.value.trim();
    w.title = titleVal || (w.isPlanned ? 'אימון מתוכנן' : (sportsMap[w.type]?.name || 'אימון'));
    w.notes = document.getElementById('w-notes')?.value.trim() || '';

    // Partner support (save regardless of planned, if entered)
    const partnerEl = document.getElementById('w-partner');
    if (partnerEl) {
      const partnerVal = partnerEl.value.trim();
      w.partner = partnerVal;
      if (partnerVal) {
        partnerVal.split(',').forEach(p => this.saveTeammate(p.trim()));
      }
    }

    // Clean and normalize video URLs
    if (Array.isArray(w.videoUrls)) {
      w.videoUrls = w.videoUrls.map(u => (u || '').trim()).filter(Boolean);
      w.videoUrl = w.videoUrls[0] || '';
    } else if (w.videoUrl && w.videoUrl.trim()) {
      w.videoUrls = [w.videoUrl.trim()];
    } else {
      w.videoUrls = [];
      w.videoUrl = '';
    }

    w.color = w.color || getWorkoutColor(w);

    const existingIdx = this.workouts.findIndex(item => item.id === w.id);
    if (existingIdx >= 0) {
      this.workouts[existingIdx] = w;
    } else {
      this.workouts.unshift(w);
    }

    this.saveState();
    this.closeModal();

    if (window.confetti) {
      window.confetti({ particleCount: 35, spread: 60 });
    }
  }

  // Completing a planned workout flow
  completePlannedWorkout(id) {
    const target = this.workouts.find(w => w.id === id);
    if (!target) return;

    const vUrls = getWorkoutVideoUrls(target);
    this.completingWorkout = JSON.parse(JSON.stringify(target));
    this.completingWorkout.type = (target.type === 'planned' || !target.type) ? 'volleyball' : target.type;
    this.completingWorkout.exercises = target.exercises || [];
    this.completingWorkout.partner = target.partner || '';
    this.completingWorkout.videoUrls = vUrls.length > 0 ? [...vUrls] : [''];
    this.completingWorkout.videoUrl = target.videoUrl || '';
    this.openModal('completePlanned');
  }

  syncCompletingWorkoutFormInputs() {
    if (!this.completingWorkout) return;
    const titleEl = document.getElementById('c-title');
    if (titleEl) this.completingWorkout.title = titleEl.value;

    const startTimeEl = document.getElementById('c-start-time');
    if (startTimeEl) this.completingWorkout.startTime = startTimeEl.value;

    const endTimeEl = document.getElementById('c-end-time');
    if (endTimeEl) this.completingWorkout.endTime = endTimeEl.value;

    const notesEl = document.getElementById('c-notes');
    if (notesEl) this.completingWorkout.notes = notesEl.value;

    const partnerEl = document.getElementById('c-partner');
    if (partnerEl) this.completingWorkout.partner = partnerEl.value;
  }

  changeCompletingWorkoutType(typeId) {
    this.syncCompletingWorkoutFormInputs();
    this.completingWorkout.type = typeId;
    if (typeId === 'gym' && (!this.completingWorkout.exercises || this.completingWorkout.exercises.length === 0)) {
      this.completingWorkout.exercises = [
        { name: 'סקוואט עם מוט', isBodyweight: false, sets: [{ setNum: 1, weight: 40, reps: 8 }, { setNum: 2, weight: 40, reps: 8 }] }
      ];
    }
    this.render();
  }

  loadTemplateIntoCompleting(tmplId) {
    if (!tmplId) return;
    this.syncCompletingWorkoutFormInputs();
    const tmpl = this.templates.find(t => t.id === tmplId);
    if (!tmpl) return;

    this.completingWorkout.title = tmpl.name;
    const sport = tmpl.sport || 'gym';
    this.completingWorkout.type = sport;
    const cfg = SPORT_CONFIGS[sport] || SPORT_CONFIGS.other;
    this.completingWorkout.color = tmpl.color || cfg.accentColor;

    if (tmpl.partner) {
      this.completingWorkout.partner = tmpl.partner;
    }
    if (tmpl.notes || tmpl.description) {
      this.completingWorkout.notes = tmpl.notes || tmpl.description;
    }

    if (tmpl.exercises && tmpl.exercises.length > 0) {
      this.completingWorkout.exercises = tmpl.exercises.map(ex => {
        const sets = [];
        const count = ex.defaultSets || 3;
        for (let s = 1; s <= count; s++) {
          sets.push({
            setNum: s,
            weight: ex.isBodyweight ? '' : (ex.defaultWeight || ''),
            reps: ex.defaultReps || 10
          });
        }
        return {
          name: ex.name,
          isBodyweight: !!ex.isBodyweight,
          sets: sets
        };
      });
    } else if (sport !== 'gym') {
      this.completingWorkout.exercises = [];
    }
    this.render();
  }

  addExerciseToCompleting() {
    this.syncCompletingWorkoutFormInputs();
    this.completingWorkout.exercises.push({
      name: '',
      isBodyweight: false,
      sets: [
        { setNum: 1, weight: '', reps: 10 },
        { setNum: 2, weight: '', reps: 10 }
      ]
    });
    this.render();
  }

  removeExerciseFromCompleting(idx) {
    this.syncCompletingWorkoutFormInputs();
    this.completingWorkout.exercises.splice(idx, 1);
    this.render();
  }

  toggleCompletingExBodyweight(idx, checked) {
    this.syncCompletingWorkoutFormInputs();
    this.completingWorkout.exercises[idx].isBodyweight = checked;
    this.render();
  }

  updateCompletingExName(idx, val) {
    this.completingWorkout.exercises[idx].name = val;
  }

  updateCompletingSetWeight(exIdx, sIdx, val) {
    this.completingWorkout.exercises[exIdx].sets[sIdx].weight = val;
  }

  updateCompletingSetReps(exIdx, sIdx, val) {
    this.completingWorkout.exercises[exIdx].sets[sIdx].reps = val;
  }

  addCompletingVideoUrl() {
    this.syncCompletingWorkoutFormInputs();
    if (!this.completingWorkout.videoUrls) {
      this.completingWorkout.videoUrls = this.completingWorkout.videoUrl ? [this.completingWorkout.videoUrl] : [];
    }
    this.completingWorkout.videoUrls.push('');
    this.render();
  }

  updateCompletingVideoUrl(idx, val) {
    if (!this.completingWorkout.videoUrls) {
      this.completingWorkout.videoUrls = [''];
    }
    this.completingWorkout.videoUrls[idx] = val;
  }

  removeCompletingVideoUrl(idx) {
    this.syncCompletingWorkoutFormInputs();
    if (!this.completingWorkout.videoUrls) return;
    this.completingWorkout.videoUrls.splice(idx, 1);
    if (this.completingWorkout.videoUrls.length === 0) {
      this.completingWorkout.videoUrls.push('');
    }
    this.render();
  }

  saveCompletedPlannedWorkout() {
    const cw = this.completingWorkout;
    cw.startTime = document.getElementById('c-start-time')?.value || cw.startTime;
    cw.endTime = document.getElementById('c-end-time')?.value || cw.endTime;
    cw.title = document.getElementById('c-title')?.value.trim() || SPORT_CONFIGS[cw.type]?.name || 'אימון';
    cw.notes = document.getElementById('c-notes')?.value.trim() || '';

    if (cw.type === 'volleyball') {
      const partnerVal = document.getElementById('c-partner')?.value.trim() || '';
      cw.partner = partnerVal;
      if (partnerVal) {
        partnerVal.split(',').forEach(p => this.saveTeammate(p.trim()));
      }
    }

    // Clean and normalize video URLs
    if (Array.isArray(cw.videoUrls)) {
      cw.videoUrls = cw.videoUrls.map(u => (u || '').trim()).filter(Boolean);
      cw.videoUrl = cw.videoUrls[0] || '';
    } else if (cw.videoUrl && cw.videoUrl.trim()) {
      cw.videoUrls = [cw.videoUrl.trim()];
    } else {
      cw.videoUrls = [];
      cw.videoUrl = '';
    }

    // Mark as NO LONGER planned!
    cw.isPlanned = false;
    cw.color = cw.color || getWorkoutColor(cw);

    const idx = this.workouts.findIndex(w => w.id === cw.id);
    if (idx >= 0) {
      this.workouts[idx] = cw;
    }

    this.saveState();
    this.closeModal();

    if (window.confetti) {
      window.confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 } });
    }
    alert('איזה אלופה! האימון סומן כהושלם בהצלחה 🎉');
  }

  openWorkoutDetail(id) {
    this.detailWorkout = this.workouts.find(w => w.id === id);
    if (this.detailWorkout) {
      this.openModal('workoutDetail');
    }
  }

  shareWorkoutWhatsApp(workoutId) {
    const w = this.workouts.find(item => item.id === workoutId) || this.detailWorkout || this.editingWorkout;
    if (!w) return;

    const cfg = SPORT_CONFIGS[w.type] || SPORT_CONFIGS.other;
    const timeDisplay = formatWorkoutTime(w.startTime, w.endTime);
    const dateFormatted = this.formatHebrewDate(w.date);
    const videoUrls = getWorkoutVideoUrls(w);

    let msg = `${cfg.emoji} *אימון ${cfg.name}: ${w.title || cfg.name}* ✨\n`;
    msg += `📅 *תאריך:* ${dateFormatted}\n`;
    if (timeDisplay) {
      msg += `⏰ *שעות:* ${timeDisplay}\n`;
    }

    if (w.partner) {
      msg += `👭 *שותפות לאימון:* ${w.partner}\n`;
    }

    if (w.exercises && w.exercises.length > 0) {
      msg += `\n💪 *תרגילים שבוצעו:*\n`;
      w.exercises.forEach(ex => {
        const setsText = (ex.sets || []).map(s => {
          const wText = ex.isBodyweight ? '(משקל גוף)' : (s.weight ? `${s.weight} ק"ג × ` : '');
          return `${wText}${s.reps} חז'`;
        }).join(', ');
        msg += `• *${ex.name}:* ${setsText}\n`;
      });
    }

    if (w.notes) {
      msg += `\n📝 *הערות ודגשים:*\n${w.notes}\n`;
    }

    if (videoUrls.length > 0) {
      msg += `\n🎥 *סרטוני וידאו (${videoUrls.length}):*\n`;
      videoUrls.forEach((u, i) => {
        msg += `${i + 1}. ${u}\n`;
      });
    }

    msg += `\n📱 _נשלח מ-LibiFit 🏐💙_`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  deleteWorkout(id) {
    if (!confirm('בטוחה שברצונך למחוק אימון זה?')) return;
    this.workouts = this.workouts.filter(w => w.id !== id);
    this.saveState();
    this.closeModal();
  }

  // Template Methods
  openTemplateModal(defaultSport) {
    const sport = defaultSport || (this.templateFilter !== 'all' ? this.templateFilter : 'volleyball');
    const cfg = SPORT_CONFIGS[sport] || SPORT_CONFIGS.gym;

    this.editingTemplate = {
      id: 'tmpl-' + Date.now(),
      sport: sport,
      category: cfg.name,
      name: '',
      description: '',
      color: cfg.accentColor,
      partner: '',
      notes: '',
      exercises: sport === 'gym' ? [
        { name: '', isBodyweight: false, defaultSets: 3, defaultReps: 10, defaultWeight: 20 }
      ] : []
    };
    this.openModal('templateForm');
  }

  changeTemplateSport(sportId) {
    if (!this.editingTemplate) return;
    this.editingTemplate.sport = sportId;
    const cfg = SPORT_CONFIGS[sportId] || SPORT_CONFIGS.other;
    this.editingTemplate.category = cfg.name;
    this.editingTemplate.color = cfg.accentColor;

    if (sportId === 'gym' && (!this.editingTemplate.exercises || this.editingTemplate.exercises.length === 0)) {
      this.editingTemplate.exercises = [
        { name: '', isBodyweight: false, defaultSets: 3, defaultReps: 10, defaultWeight: 20 }
      ];
    }
    this.render();
  }

  setTemplateColor(hex) {
    if (!this.editingTemplate) return;
    this.editingTemplate.color = hex;
    this.render();
  }

  addTeammateToTmplInput(name) {
    const input = document.getElementById('tmpl-partner');
    if (!input) return;
    const current = input.value.trim();
    if (!current) {
      input.value = name;
    } else if (!current.includes(name)) {
      input.value = current + ', ' + name;
    }
    if (this.editingTemplate) {
      this.editingTemplate.partner = input.value;
    }
  }

  startWorkoutFromTemplate(tmplId) {
    const tmpl = this.templates.find(t => t.id === tmplId);
    if (!tmpl) return;

    const sport = tmpl.sport || 'gym';
    const cfg = SPORT_CONFIGS[sport] || SPORT_CONFIGS.other;

    const newWorkout = {
      id: 'w-' + Date.now(),
      date: this.selectedDateStr || this.formatDate(new Date()),
      startTime: '18:00',
      endTime: '19:30',
      type: sport,
      title: tmpl.name,
      color: tmpl.color || cfg.accentColor,
      notes: tmpl.notes || tmpl.description || '',
      partner: tmpl.partner || '',
      videoUrl: '',
      isPlanned: false,
      exercises: (tmpl.exercises && tmpl.exercises.length > 0) ? tmpl.exercises.map(ex => {
        const sets = [];
        const count = ex.defaultSets || 3;
        for (let s = 1; s <= count; s++) {
          sets.push({
            setNum: s,
            weight: ex.isBodyweight ? '' : (ex.defaultWeight || ''),
            reps: ex.defaultReps || 10,
            done: false
          });
        }
        return {
          name: ex.name,
          isBodyweight: !!ex.isBodyweight,
          sets: sets
        };
      }) : []
    };

    this.editingWorkout = newWorkout;
    this.openModal('workoutForm');
  }

  addExerciseToTemplate() {
    if (!this.editingTemplate.exercises) this.editingTemplate.exercises = [];
    this.editingTemplate.exercises.push({
      name: '',
      isBodyweight: false,
      defaultSets: 3,
      defaultReps: 10,
      defaultWeight: 20
    });
    this.render();
  }

  removeExerciseFromTemplate(idx) {
    this.editingTemplate.exercises.splice(idx, 1);
    this.render();
  }

  updateTmplExName(idx, val) {
    this.editingTemplate.exercises[idx].name = val;
  }

  toggleTmplExBodyweight(idx, checked) {
    this.editingTemplate.exercises[idx].isBodyweight = checked;
    this.render();
  }

  updateTmplExField(idx, field, val) {
    this.editingTemplate.exercises[idx][field] = parseInt(val) || 0;
  }

  saveTemplateFromForm() {
    const tmpl = this.editingTemplate;
    tmpl.name = document.getElementById('tmpl-name')?.value.trim() || '';
    tmpl.description = document.getElementById('tmpl-desc')?.value.trim() || '';
    tmpl.partner = document.getElementById('tmpl-partner')?.value.trim() || '';
    tmpl.notes = document.getElementById('tmpl-notes')?.value.trim() || '';

    if (!tmpl.name) {
      alert('נא להזין שם לתבנית');
      return;
    }

    if (tmpl.partner) {
      tmpl.partner.split(',').forEach(p => this.saveTeammate(p.trim()));
    }

    this.templates.unshift(tmpl);
    this.saveState();
    this.closeModal();
    alert('תבנית האימון נשמרה בהצלחה!');
  }

  deleteTemplate(id) {
    if (!confirm('בטוחה שברצונך למחוק תבנית זו?')) return;
    this.templates = this.templates.filter(t => t.id !== id);
    this.saveState();
    this.render();
  }

  // --- RECOVERY, PREVIEWS & PERIOD ---
  previewScore(type, val) {
    const item = getScoreItem(val);
    const badge = document.getElementById(`${type}-preview-badge`);
    const textEl = document.getElementById(`${type}-desc-text`);
    if (badge) {
      badge.style.backgroundColor = item.color;
      badge.innerText = `${item.val} • ${item.label}`;
    }
    if (textEl) {
      textEl.innerText = `${item.val}/10 - ${item.label}`;
    }
  }

  resetPreviewScore(type) {
    const todayStr = this.formatDate(new Date());
    const existing = this.recoveryLogs[todayStr];
    const badge = document.getElementById(`${type}-preview-badge`);
    const textEl = document.getElementById(`${type}-desc-text`);
    if (!existing || existing[type] === null || existing[type] === undefined) {
      if (badge) {
        badge.style.backgroundColor = '#64748B';
        badge.innerText = 'טרם נבחר';
      }
      if (textEl) {
        textEl.innerText = 'טרם נבחר';
      }
      return;
    }
    const item = getScoreItem(existing[type]);
    if (badge) {
      badge.style.backgroundColor = item.color;
      badge.innerText = `${item.val} • ${item.label}`;
    }
    if (textEl) {
      textEl.innerText = `${item.val}/10 - ${item.label}`;
    }
  }

  previewStress(val) {
    const item = getStressItem(val);
    const badge = document.getElementById(`stress-preview-badge`);
    const textEl = document.getElementById(`stress-desc-text`);
    if (badge) {
      badge.style.backgroundColor = item.color;
      badge.innerText = `${item.val} • ${item.label}`;
    }
    if (textEl) {
      textEl.innerText = `${item.val}/10 - ${item.label}`;
    }
  }

  resetPreviewStress() {
    const todayStr = this.formatDate(new Date());
    const existing = this.recoveryLogs[todayStr];
    const badge = document.getElementById('stress-preview-badge');
    const textEl = document.getElementById('stress-desc-text');
    if (!existing || existing.stress === null || existing.stress === undefined) {
      if (badge) {
        badge.style.backgroundColor = '#64748B';
        badge.innerText = 'טרם נבחר';
      }
      if (textEl) {
        textEl.innerText = 'טרם נבחר';
      }
      return;
    }
    const item = getStressItem(existing.stress);
    if (badge) {
      badge.style.backgroundColor = item.color;
      badge.innerText = `${item.val} • ${item.label}`;
    }
    if (textEl) {
      textEl.innerText = `${item.val}/10 - ${item.label}`;
    }
  }

  setSurveyView(view) {
    this.surveyActiveTab = view;
    this.render();
  }

  setTrendsMetric(metric) {
    this.trendsMetric = metric;
    this.render();
  }

  changeTrendsMonth(delta) {
    if (!this.trendsDate) {
      this.trendsDate = new Date();
    }
    this.trendsDate = new Date(this.trendsDate.getFullYear(), this.trendsDate.getMonth() + delta, 1);
    this.render();
  }

  resetTrendsMonth() {
    this.trendsDate = new Date();
    this.render();
  }

  setSurveyVal(type, val) {
    const todayStr = this.formatDate(new Date());
    if (!this.recoveryLogs[todayStr]) {
      this.recoveryLogs[todayStr] = {
        fatigue: null,
        mood: null,
        stress: null,
        notes: '',
        period: { isPeriod: false, flow: 'medium', symptoms: [] }
      };
    }
    const notesEl = document.getElementById('recovery-notes-input');
    if (notesEl) {
      this.recoveryLogs[todayStr].notes = notesEl.value;
    }
    this.recoveryLogs[todayStr][type] = val;
    this.saveState();
    this.render();
  }

  togglePeriod() {
    const todayStr = this.formatDate(new Date());
    if (!this.recoveryLogs[todayStr]) {
      this.recoveryLogs[todayStr] = {
        fatigue: null,
        mood: null,
        stress: null,
        notes: '',
        period: { isPeriod: false, flow: 'medium', symptoms: [] }
      };
    }
    if (!this.recoveryLogs[todayStr].period) {
      this.recoveryLogs[todayStr].period = { isPeriod: false, flow: 'medium', symptoms: [] };
    }
    const notesEl = document.getElementById('recovery-notes-input');
    if (notesEl) {
      this.recoveryLogs[todayStr].notes = notesEl.value;
    }
    this.recoveryLogs[todayStr].period.isPeriod = !this.recoveryLogs[todayStr].period.isPeriod;
    this.saveState();
    this.render();
  }

  setPeriodFlow(flow) {
    const todayStr = this.formatDate(new Date());
    if (this.recoveryLogs[todayStr] && this.recoveryLogs[todayStr].period) {
      this.recoveryLogs[todayStr].period.flow = flow;
      this.render();
    }
  }

  togglePeriodSymptom(sym) {
    const todayStr = this.formatDate(new Date());
    if (this.recoveryLogs[todayStr] && this.recoveryLogs[todayStr].period) {
      const arr = this.recoveryLogs[todayStr].period.symptoms || [];
      const idx = arr.indexOf(sym);
      if (idx >= 0) {
        arr.splice(idx, 1);
      } else {
        arr.push(sym);
      }
      this.recoveryLogs[todayStr].period.symptoms = arr;
      this.render();
    }
  }

  getCycleInsights() {
    const dates = Object.keys(this.recoveryLogs).sort().reverse();
    const periodDates = dates.filter(d => this.recoveryLogs[d].period && this.recoveryLogs[d].period.isPeriod);
    if (periodDates.length === 0) {
      return 'לחצי כדי לסמן ימי ווסת ומעקב';
    }
    const lastPeriodDate = new Date(periodDates[0]);
    const today = new Date();
    const diffTime = Math.abs(today - lastPeriodDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 5) {
      return `יום ${diffDays} למחזור 🩸`;
    }
    return `${diffDays} ימים מאז תחילת המחזור האחרון`;
  }

  saveTodayRecovery() {
    const todayStr = this.formatDate(new Date());
    const log = this.recoveryLogs[todayStr];
    if (!log || (log.fatigue === null && log.mood === null && log.stress === null && (!log.period || !log.period.isPeriod))) {
      alert('נא לבחור לפחות מדד אחד (עייפות, מצב רוח, סטרס או ווסת) לפני השמירה 😊');
      return;
    }
    const notesEl = document.getElementById('recovery-notes-input');
    if (notesEl) {
      log.notes = notesEl.value;
    }
    this.saveState();
    if (window.confetti) {
      window.confetti({ particleCount: 45, spread: 65, origin: { y: 0.8 } });
    }
    alert('הסקר היומי נשמר בהצלחה! 💙');
    this.render();
  }

  // PR Methods
  openPRModal() {
    this.openModal('prForm');
  }

  handlePRCategoryChange(val) {
    const box = document.getElementById('custom-category-box');
    if (box) {
      if (val === 'אחר') {
        box.classList.remove('hidden');
      } else {
        box.classList.add('hidden');
      }
    }
  }

  handlePRUnitChange(val) {
    const box = document.getElementById('custom-unit-box');
    if (box) {
      if (val === 'custom') {
        box.classList.remove('hidden');
      } else {
        box.classList.add('hidden');
      }
    }
  }

  saveNewPR() {
    const title = document.getElementById('new-pr-title')?.value.trim();
    const unitSelect = document.getElementById('new-pr-unit')?.value;
    const customUnit = document.getElementById('new-pr-custom-unit')?.value.trim();
    const unit = (unitSelect === 'custom' && customUnit) ? customUnit : (unitSelect === 'custom' ? 'יח׳' : unitSelect);
    const catSelect = document.getElementById('new-pr-category')?.value || 'חדר כושר';
    const customCat = document.getElementById('new-pr-custom-category')?.value.trim();
    const category = (catSelect === 'אחר' && customCat) ? customCat : catSelect;
    const val = parseFloat(document.getElementById('new-pr-val')?.value);
    const note = document.getElementById('new-pr-note')?.value.trim() || '';
    const dateInput = document.getElementById('new-pr-date')?.value || this.formatDate(new Date());

    if (!title || isNaN(val) || val <= 0) {
      alert('נא להזין שם וערך שיא תקינים');
      return;
    }

    const newRecord = {
      id: 'pr-' + Date.now(),
      title: title,
      category: category,
      unit: unit,
      currentPR: val,
      history: [
        { date: dateInput, value: val, note: note || 'שיא ראשוני' }
      ]
    };

    this.personalRecords.unshift(newRecord);
    this.saveState();
    this.closeModal();

    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 80 });
    }
  }

  openUpdatePRModal(prId) {
    this.editingPR = this.personalRecords.find(p => p.id === prId);
    if (this.editingPR) {
      this.openModal('updatePRModal');
    }
  }

  saveUpdatedPR() {
    const val = parseFloat(document.getElementById('update-pr-val')?.value);
    const note = document.getElementById('update-pr-note')?.value.trim() || '';
    const dateInput = document.getElementById('update-pr-date')?.value || this.formatDate(new Date());

    if (!val || isNaN(val)) {
      alert('נא להזין ערך שיא תקין');
      return;
    }

    this.editingPR.currentPR = val;
    if (!this.editingPR.history) this.editingPR.history = [];
    this.editingPR.history.push({
      date: dateInput,
      value: val,
      note: note
    });

    this.saveState();
    this.closeModal();

    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 } });
    }
  }

  deletePR(id) {
    const pr = this.personalRecords.find(p => p.id === id);
    const title = pr ? pr.title : 'שיא זה';
    if (!confirm(`בטוחה שברצונך למחוק את "${title}" לצמיתות מלוח השיאים?`)) return;
    this.personalRecords = this.personalRecords.filter(p => p.id !== id);
    this.saveState();
    this.closeModal();
    this.render();
  }

  // Backup & Modal Control
  openModal(name) {
    this.activeModal = name;
    this.render();
  }

  closeModal() {
    this.activeModal = null;
    this.editingWorkout = null;
    this.completingWorkout = null;
    this.detailWorkout = null;
    this.editingTemplate = null;
    this.render();
  }

  exportBackup() {
    const data = {
      version: '1.2',
      exportedAt: new Date().toISOString(),
      workouts: this.workouts,
      templates: this.templates,
      recoveryLogs: this.recoveryLogs,
      personalRecords: this.personalRecords,
      teammates: this.recentTeammates
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `libifit_backup_${this.formatDate(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.workouts) this.workouts = parsed.workouts;
        if (parsed.templates) this.templates = parsed.templates;
        if (parsed.recoveryLogs) this.recoveryLogs = parsed.recoveryLogs;
        if (parsed.personalRecords) this.personalRecords = parsed.personalRecords;
        if (parsed.teammates) this.recentTeammates = parsed.teammates;

        this.saveState();
        alert('הנתונים שוחזרו בהצלחה מתוך קובץ הגיבוי! 🎉');
        this.closeModal();
      } catch (err) {
        alert('קובץ לא תקין או פגום.');
      }
    };
    reader.readAsText(file);
  }

  promptInstall() {
    if (window.deferredInstallPrompt) {
      window.deferredInstallPrompt.prompt().then((choice) => {
        if (choice && choice.outcome === 'accepted') {
          window.deferredInstallPrompt = null;
          this.isInstalled = true;
          this.render();
        }
      });
    } else {
      this.openModal('installGuideModal');
    }
  }

  triggerNativeInstall() {
    if (window.deferredInstallPrompt) {
      window.deferredInstallPrompt.prompt().then((choice) => {
        if (choice && choice.outcome === 'accepted') {
          window.deferredInstallPrompt = null;
          this.isInstalled = true;
          this.closeModal();
          this.render();
        }
      });
    } else {
      alert('כדי להתקין: לחצי על 3 הנקודות ⋮ בפינת הדפדפן ובחרי "הוספה למסך הבית"');
    }
  }

  setAuthTab(tab) {
    this.authTab = tab;
    this.authError = '';
    this.render();
  }

  async loginAccount() {
    const username = document.getElementById('auth-username')?.value;
    const password = document.getElementById('auth-password')?.value;
    if (!username || !password) {
      this.authError = 'נא למלא שם משתמש וסיסמה';
      this.render();
      return;
    }
    this.authLoading = true;
    this.authError = '';
    this.render();
    try {
      await window.firebaseService.login(username, password);
      this.authLoading = false;
      this.closeModal();
    } catch (e) {
      console.error('Login error:', e);
      this.authError = e.message || 'שגיאה בהתחברות';
      this.authLoading = false;
      this.render();
    }
  }

  async registerAccount() {
    const username = document.getElementById('reg-username')?.value;
    const password = document.getElementById('reg-password')?.value;
    if (!username || !password) {
      this.authError = 'נא למלא שם משתמש וסיסמה';
      this.render();
      return;
    }
    this.authLoading = true;
    this.authError = '';
    this.render();
    try {
      await window.firebaseService.register(username, password);
      this.authLoading = false;
      this.closeModal();
    } catch (e) {
      console.error('Registration error:', e);
      this.authError = e.message || 'שגיאה ביצירת החשבון';
      this.authLoading = false;
      this.render();
    }
  }

  async updateUserDisplayName() {
    const input = document.getElementById('profile-display-name');
    if (!input || !input.value.trim()) return;
    const newName = input.value.trim();
    await window.firebaseService.updateDisplayName(newName);
    this.closeModal();
    this.render();
  }

  async updateUserPassword() {
    const input = document.getElementById('profile-new-password');
    if (!input || !input.value.trim()) {
      alert('נא להקליד סיסמה חדשה');
      return;
    }
    try {
      await window.firebaseService.updatePassword(input.value.trim());
      alert('הסיסמה עודכנה בהצלחה! 🔑');
      input.value = '';
    } catch (e) {
      alert('שגיאה בעדכון הסיסמה: ' + (e.message || e));
    }
  }

  updateLocalName() {
    const input = document.getElementById('offline-name-input');
    if (!input || !input.value.trim()) return;
    const clean = input.value.trim();
    localStorage.setItem('libi_username', clean);
    this.closeModal();
    this.render();
  }

  async manualCloudSync() {
    if (window.firebaseService && window.firebaseService.isLoggedIn()) {
      await window.firebaseService.syncToCloud();
      alert('כל הנתונים סונכרנו בהצלחה לענן! ☁️✨');
    }
  }

  signOutFirebase() {
    if (confirm('האם את בטוחה שברצונך להתנתק מהחשבון?')) {
      window.firebaseService.signOut();
      this.closeModal();
      this.render();
    }
  }
}

// Global PWA Installation Event Handlers
window.deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredInstallPrompt = e;
  if (window.app) {
    window.app.render();
  }
});

window.addEventListener('appinstalled', () => {
  window.deferredInstallPrompt = null;
  if (window.app) {
    window.app.isInstalled = true;
    window.app.render();
  }
});

window.LibiFitApp = LibiFitApp;
window.LibbyFitApp = LibiFitApp;
window.app = new LibiFitApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
