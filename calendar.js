// Calendar Views & Logic for LibbyFit

function renderCalendarTab() {
  return `
    <div class="space-y-3.5">
      <div class="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex flex-col gap-2.5">
        <div class="flex items-center justify-between">
          <div class="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
            <button onclick="app.setCalendarView('weekly')" class="px-3 py-1.5 rounded-lg transition ${app.calendarView === 'weekly' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}">שבועי</button>
            <button onclick="app.setCalendarView('monthly')" class="px-3 py-1.5 rounded-lg transition ${app.calendarView === 'monthly' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}">חודשי</button>
            <button onclick="app.setCalendarView('daily')" class="px-3 py-1.5 rounded-lg transition ${app.calendarView === 'daily' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}">יומי</button>
          </div>
          <div class="flex items-center gap-1">
            <button onclick="app.navCalendar(-1)" class="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 active:scale-95">
              <i data-lucide="chevron-right" class="w-5 h-5"></i>
            </button>
            <button onclick="app.resetToToday()" class="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg hover:bg-brand-100">
              היום
            </button>
            <button onclick="app.navCalendar(1)" class="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 active:scale-95">
              <i data-lucide="chevron-left" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
        <div class="text-sm font-bold text-slate-700 text-center">
          ${getCalendarHeaderLabel()}
        </div>
      </div>

      ${app.calendarView === 'weekly' ? renderWeeklyCalendar() :
        app.calendarView === 'monthly' ? renderMonthlyCalendar() :
        renderDailyCalendar()}
    </div>
  `;
}

function getCalendarHeaderLabel() {
  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  if (app.calendarView === 'weekly') {
    const start = app.getWeekStartDate(app.currentDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
  } else if (app.calendarView === 'monthly') {
    return `${months[app.currentDate.getMonth()]} ${app.currentDate.getFullYear()}`;
  } else {
    return app.formatHebrewDate(app.formatDate(app.currentDate));
  }
}

function renderWeeklyCalendar() {
  const weekStart = app.getWeekStartDate(app.currentDate);
  const days = [];
  const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  const todayStr = app.formatDate(new Date());

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dStr = app.formatDate(d);
    const dayWorkouts = app.workouts.filter(w => w.date === dStr);
    const recovery = app.recoveryLogs[dStr];
    const isToday = dStr === todayStr;

    days.push({
      date: d,
      dateStr: dStr,
      dayName: dayNames[i],
      dayNum: d.getDate(),
      workouts: dayWorkouts,
      recovery: recovery,
      isToday: isToday
    });
  }

  return `
    <div class="space-y-2.5">
      ${days.map(d => `
        <div class="bg-white rounded-2xl border ${d.isToday ? 'border-brand-400 ring-2 ring-brand-100 shadow-sm' : 'border-slate-100'} p-3 transition">
          <div class="flex items-center justify-between border-b border-slate-50 pb-2 mb-2">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${d.isToday ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 text-slate-700'}">
                ${d.dayName}
              </span>
              <span class="text-xs font-bold ${d.isToday ? 'text-brand-700' : 'text-slate-600'}">
                ${d.dayNum} ${d.isToday ? '• היום ✨' : ''}
              </span>
            </div>
            <div class="flex items-center gap-2">
              ${d.recovery ? `
                <div class="flex items-center gap-1 text-[11px] bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 font-semibold">
                  <span title="אנרגיה">🔋 ${d.recovery.fatigue}</span>
                  <span class="text-slate-300">|</span>
                  <span title="מצב רוח">😊 ${d.recovery.mood}</span>
                </div>
              ` : ''}
              <button onclick="app.openNewWorkoutModal('${d.dateStr}')" class="text-xs text-brand-600 hover:text-brand-800 font-semibold p-1 hover:bg-brand-50 rounded-lg flex items-center gap-0.5">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>אימון</span>
              </button>
            </div>
          </div>

          ${d.workouts.length === 0 ? `
            <div class="py-2 text-center text-xs text-slate-300 font-light">
              יום מנוחה / ללא אימונים
            </div>
          ` : `
            <div class="space-y-1.5">
              ${d.workouts.map(w => renderWorkoutCard(w)).join('')}
            </div>
          `}
        </div>
      `).join('')}
    </div>
  `;
}

function renderMonthlyCalendar() {
  const year = app.currentDate.getFullYear();
  const month = app.currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const todayStr = app.formatDate(new Date());

  const dayHeaders = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  let cellsHtml = '';

  for (let i = 0; i < firstDayIndex; i++) {
    cellsHtml += `<div class="h-16 bg-slate-50/50 rounded-xl"></div>`;
  }

  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day);
    const dStr = app.formatDate(d);
    const dayWorkouts = app.workouts.filter(w => w.date === dStr);
    const isToday = dStr === todayStr;

    cellsHtml += `
      <div onclick="app.selectDateAndGoDaily('${dStr}')" class="h-16 bg-white border ${isToday ? 'border-brand-500 ring-1 ring-brand-300' : 'border-slate-100'} rounded-xl p-1 flex flex-col justify-between cursor-pointer hover:bg-slate-50 transition">
        <div class="flex justify-between items-center">
          <span class="text-[11px] font-bold ${isToday ? 'w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center' : 'text-slate-600'}">
            ${day}
          </span>
        </div>
        <div class="flex flex-wrap gap-1 overflow-hidden">
          ${dayWorkouts.map(w => {
            const cfg = SPORT_CONFIGS[w.type] || SPORT_CONFIGS.other;
            return `<span class="w-2 h-2 rounded-full" style="background-color: ${cfg.accentColor};" title="${cfg.name}"></span>`;
          }).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-2">
      <div class="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 pb-1 border-b border-slate-100">
        ${dayHeaders.map(h => `<div>${h}</div>`).join('')}
      </div>
      <div class="grid grid-cols-7 gap-1">
        ${cellsHtml}
      </div>
    </div>
  `;
}

function renderDailyCalendar() {
  const dStr = app.formatDate(app.currentDate);
  const dayWorkouts = app.workouts.filter(w => w.date === dStr);
  const recovery = app.recoveryLogs[dStr];

  return `
    <div class="space-y-3">
      <div class="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div class="space-y-0.5">
          <h4 class="text-xs font-bold text-slate-500">התאוששות ומצב רוח להיום:</h4>
          ${recovery ? `
            <div class="flex items-center gap-2 text-xs font-bold mt-1">
              <span class="px-2 py-0.5 rounded-full ${app.getScoreBadgeClass(recovery.fatigue)}">🔋 אנרגיה: ${recovery.fatigue}/10</span>
              <span class="px-2 py-0.5 rounded-full ${app.getScoreBadgeClass(recovery.mood)}">😊 מצב רוח: ${recovery.mood}/10</span>
            </div>
            ${recovery.notes ? `<p class="text-xs text-slate-600 mt-1 italic font-light">"${recovery.notes}"</p>` : ''}
          ` : `
            <p class="text-xs text-slate-400">טרם מילאת סקר ליום זה</p>
          `}
        </div>
        <button onclick="app.setTab('recovery')" class="text-xs text-brand-600 font-semibold bg-brand-50 px-2.5 py-1.5 rounded-xl hover:bg-brand-100">
          ${recovery ? 'עדכני' : 'מלאי סקר'}
        </button>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-700">אימונים שבוצעו (${dayWorkouts.length})</h3>
          <button onclick="app.openNewWorkoutModal('${dStr}')" class="text-xs text-brand-600 font-bold hover:underline flex items-center gap-1">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            הוסיפי אימון
          </button>
        </div>

        ${dayWorkouts.length === 0 ? `
          <div class="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm space-y-2">
            <span class="text-3xl">🏖️</span>
            <p class="text-sm font-semibold text-slate-600">אין אימונים רשומים ביום זה</p>
            <p class="text-xs text-slate-400">יום מעולה למנוחה, או ללחוץ למעלה ולהוסיף אימון!</p>
          </div>
        ` : `
          <div class="space-y-2">
            ${dayWorkouts.map(w => renderWorkoutCard(w, true)).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

function renderWorkoutCard(w, expanded = false) {
  const cfg = SPORT_CONFIGS[w.type] || SPORT_CONFIGS.other;
  return `
    <div onclick="app.openWorkoutDetail('${w.id}')" class="cursor-pointer bg-white rounded-xl border border-slate-100 hover:border-slate-200 p-2.5 shadow-sm transition hover:shadow flex flex-col gap-1.5 relative overflow-hidden">
      <div class="absolute right-0 top-0 bottom-0 w-1.5" style="background-color: ${cfg.accentColor};"></div>
      <div class="flex items-center justify-between pr-2">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-md text-[11px] font-bold ${cfg.badgeClass} flex items-center gap-1">
            <span>${cfg.emoji}</span>
            <span>${cfg.name}</span>
          </span>
          <span class="font-bold text-xs text-slate-800">${w.title || cfg.name}</span>
        </div>
        ${w.duration ? `<span class="text-[11px] text-slate-400 font-medium">${w.duration} דק'</span>` : ''}
      </div>

      <div class="text-xs text-slate-500 pr-2 flex flex-wrap gap-2 items-center">
        ${w.partner ? `
          <span class="bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px]">
            <i data-lucide="users" class="w-3 h-3"></i>
            ${w.partner}
          </span>
        ` : ''}
        ${w.videoUrl ? `
          <a href="${w.videoUrl}" target="_blank" onclick="event.stopPropagation()" class="bg-red-50 text-red-600 hover:bg-red-100 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] font-semibold">
            <i data-lucide="play-circle" class="w-3 h-3"></i>
            וידאו
          </a>
        ` : ''}
        ${w.exercises && w.exercises.length > 0 ? `
          <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[11px]">
            ${w.exercises.length} תרגילים
          </span>
        ` : ''}
        ${w.notes ? `
          <span class="text-slate-400 text-[11px] truncate max-w-[180px]">📝 ${w.notes}</span>
        ` : ''}
      </div>
    </div>
  `;
}
