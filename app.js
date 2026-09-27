// LibbyFit Main Application Controller

class LibbyFitApp {
  constructor() {
    this.currentTab = 'calendar';
    this.calendarView = 'weekly';
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
    this.detailWorkout = null;
    this.editingTemplate = null;
    this.editingPR = null;

    this.recentTeammates = this.loadTeammates();
  }

  loadState() {
    try {
      this.workouts = JSON.parse(localStorage.getItem('libby_workouts')) || [];
      this.templates = JSON.parse(localStorage.getItem('libby_templates')) || DEFAULT_TEMPLATES;
      this.recoveryLogs = JSON.parse(localStorage.getItem('libby_recovery')) || {};
      this.personalRecords = JSON.parse(localStorage.getItem('libby_prs')) || DEFAULT_PRS;
    } catch (e) {
      console.error('Error loading state:', e);
      this.workouts = [];
      this.templates = DEFAULT_TEMPLATES;
      this.recoveryLogs = {};
      this.personalRecords = DEFAULT_PRS;
    }
  }

  saveState() {
    try {
      localStorage.setItem('libby_workouts', JSON.stringify(this.workouts));
      localStorage.setItem('libby_templates', JSON.stringify(this.templates));
      localStorage.setItem('libby_recovery', JSON.stringify(this.recoveryLogs));
      localStorage.setItem('libby_prs', JSON.stringify(this.personalRecords));
    } catch (e) {
      console.error('Error saving state:', e);
      alert('שגיאה בשמירת הנתונים במכשיר!');
    }
  }

  loadTeammates() {
    const fromStorage = localStorage.getItem('libby_teammates');
    if (fromStorage) return JSON.parse(fromStorage);
    return ['נועה', 'מאי', 'שירה', 'עמית', 'דניאל', 'רוני'];
  }

  saveTeammate(name) {
    if (!name || !name.trim()) return;
    const clean = name.trim();
    if (!this.recentTeammates.includes(clean)) {
      this.recentTeammates.unshift(clean);
      if (this.recentTeammates.length > 15) this.recentTeammates.pop();
      localStorage.setItem('libby_teammates', JSON.stringify(this.recentTeammates));
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
  }

  render() {
    const appEl = document.getElementById('app');
    appEl.innerHTML = `
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

  renderHeader() {
    return `
      <header class="bg-gradient-to-l from-brand-600 via-sky-500 to-cyan-500 text-white pt-4 pb-3 px-4 shadow-md sticky top-0 z-30">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 space-x-reverse">
            <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <span class="text-2xl">🏐</span>
            </div>
            <div>
              <h1 class="text-xl font-bold font-display tracking-tight flex items-center gap-1.5">
                LibbyFit
                <span class="text-xs bg-white/25 px-2 py-0.5 rounded-full font-normal">ליבי ✨</span>
              </h1>
              <p class="text-xs text-brand-100 font-medium">כדורעף • כושר • התאוששות</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
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
      { id: 'gym', label: 'חדר כושר', icon: 'dumbbell' },
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
      type: 'volleyball',
      title: '',
      duration: 60,
      notes: '',
      partner: '',
      videoUrl: '',
      exercises: []
    };
    this.openModal('workoutForm');
  }

  changeWorkoutType(typeId) {
    this.editingWorkout.type = typeId;
    if (typeId === 'gym' && (!this.editingWorkout.exercises || this.editingWorkout.exercises.length === 0)) {
      this.editingWorkout.exercises = [
        { name: 'סקוואט עם מוט', isBodyweight: false, sets: [{ setNum: 1, weight: 40, reps: 8, done: true }, { setNum: 2, weight: 40, reps: 8, done: true }] }
      ];
    }
    this.render();
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
  }

  loadTemplateIntoCurrentWorkout(tmplId) {
    if (!tmplId) return;
    const tmpl = this.templates.find(t => t.id === tmplId);
    if (!tmpl) return;

    this.editingWorkout.title = tmpl.name;
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
    this.render();
  }

  addExerciseToWorkout() {
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
    this.editingWorkout.exercises.splice(idx, 1);
    this.render();
  }

  toggleExBodyweight(idx, checked) {
    this.editingWorkout.exercises[idx].isBodyweight = checked;
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
    w.date = document.getElementById('w-date').value || w.date;
    w.duration = parseInt(document.getElementById('w-duration').value) || 60;
    w.title = document.getElementById('w-title').value.trim() || SPORT_CONFIGS[w.type]?.name || 'אימון';
    w.notes = document.getElementById('w-notes')?.value.trim() || '';

    if (w.type === 'volleyball') {
      const partnerVal = document.getElementById('w-partner')?.value.trim() || '';
      w.partner = partnerVal;
      w.videoUrl = document.getElementById('w-video')?.value.trim() || '';
      if (partnerVal) {
        partnerVal.split(',').forEach(p => this.saveTeammate(p.trim()));
      }
    }

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

  openWorkoutDetail(id) {
    this.detailWorkout = this.workouts.find(w => w.id === id);
    if (this.detailWorkout) {
      this.openModal('workoutDetail');
    }
  }

  deleteWorkout(id) {
    if (!confirm('בטוחה שברצונך למחוק אימון זה?')) return;
    this.workouts = this.workouts.filter(w => w.id !== id);
    this.saveState();
    this.closeModal();
  }

  // Template Methods
  openTemplateModal() {
    this.editingTemplate = {
      id: 'tmpl-' + Date.now(),
      name: '',
      category: 'חדר כושר',
      description: '',
      exercises: [
        { name: '', isBodyweight: false, defaultSets: 3, defaultReps: 10, defaultWeight: 20 }
      ]
    };
    this.openModal('templateForm');
  }

  startWorkoutFromTemplate(tmplId) {
    const tmpl = this.templates.find(t => t.id === tmplId);
    if (!tmpl) return;

    const newWorkout = {
      id: 'w-' + Date.now(),
      date: this.formatDate(new Date()),
      type: 'gym',
      title: tmpl.name,
      duration: 60,
      notes: '',
      partner: '',
      videoUrl: '',
      exercises: tmpl.exercises.map(ex => {
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
      })
    };

    this.editingWorkout = newWorkout;
    this.openModal('workoutForm');
  }

  addExerciseToTemplate() {
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
    tmpl.name = document.getElementById('tmpl-name').value.trim();
    tmpl.description = document.getElementById('tmpl-desc').value.trim();

    if (!tmpl.name) {
      alert('נא להזין שם לתבנית');
      return;
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

  // Recovery & Mood
  getValBgColor(val) {
    if (val <= 3) return 'bg-red-500';
    if (val <= 5) return 'bg-amber-500';
    if (val <= 7) return 'bg-emerald-500';
    return 'bg-cyan-500';
  }

  getScoreBadgeClass(val) {
    if (val <= 3) return 'bg-red-100 text-red-700';
    if (val <= 5) return 'bg-amber-100 text-amber-700';
    if (val <= 7) return 'bg-emerald-100 text-emerald-700';
    return 'bg-cyan-100 text-cyan-800';
  }

  setSurveyVal(type, val) {
    const todayStr = this.formatDate(new Date());
    if (!this.recoveryLogs[todayStr]) {
      this.recoveryLogs[todayStr] = { fatigue: 7, mood: 8, notes: '' };
    }
    this.recoveryLogs[todayStr][type] = val;
    this.render();
  }

  saveTodayRecovery() {
    const todayStr = this.formatDate(new Date());
    if (!this.recoveryLogs[todayStr]) {
      this.recoveryLogs[todayStr] = { fatigue: 7, mood: 8, notes: '' };
    }
    const notesEl = document.getElementById('recovery-notes-input');
    if (notesEl) {
      this.recoveryLogs[todayStr].notes = notesEl.value;
    }
    this.saveState();
    if (window.confetti) {
      window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }
    alert('מדד ההתאוששות נשמר בהצלחה! 💙');
    this.render();
  }

  // PR Methods
  openPRModal() {
    this.openModal('prForm');
  }

  saveNewPR() {
    const title = document.getElementById('new-pr-title').value.trim();
    const unit = document.getElementById('new-pr-unit').value;
    const val = parseFloat(document.getElementById('new-pr-val').value) || 0;
    const note = document.getElementById('new-pr-note').value.trim();

    if (!title || !val) {
      alert('נא להזין שם וערך שיא תקינים');
      return;
    }

    const todayStr = this.formatDate(new Date());
    const newRecord = {
      id: 'pr-' + Date.now(),
      title: title,
      category: 'מותאם אישית',
      unit: unit,
      currentPR: val,
      history: [
        { date: todayStr, value: val, note: note || 'שיא ראשוני' }
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
    const val = parseFloat(document.getElementById('update-pr-val').value);
    const note = document.getElementById('update-pr-note').value.trim();

    if (!val) {
      alert('נא להזין ערך שיא תקין');
      return;
    }

    const todayStr = this.formatDate(new Date());
    this.editingPR.currentPR = val;
    if (!this.editingPR.history) this.editingPR.history = [];
    this.editingPR.history.push({
      date: todayStr,
      value: val,
      note: note
    });

    this.saveState();
    this.closeModal();

    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 } });
    }
  }

  // Backup & Modal Control
  openModal(name) {
    this.activeModal = name;
    this.render();
  }

  closeModal() {
    this.activeModal = null;
    this.editingWorkout = null;
    this.detailWorkout = null;
    this.editingTemplate = null;
    this.render();
  }

  exportBackup() {
    const data = {
      version: '1.0',
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
    a.download = `libbyfit_backup_${this.formatDate(new Date())}.json`;
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
}

window.app = new LibbyFitApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
