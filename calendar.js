// Calendar Views & Logic for LibiFit

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
      ${days.map(d => {
        const rec = d.recovery;
        const fatigueItem = rec ? getScoreItem(rec.fatigue) : null;
        const moodItem = rec ? getScoreItem(rec.mood) : null;
        const stressItem = rec && rec.stress ? getStressItem(rec.stress) : null;
        const isPeriod = rec && rec.period && rec.period.isPeriod;

        return `
          <div class="bg-white rounded-2xl border ${d.isToday ? 'border-brand-400 ring-2 ring-brand-100 shadow-sm' : 'border-slate-100'} p-3 transition">
            <div class="flex items-center justify-between border-b border-slate-50 pb-2 mb-2">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${d.isToday ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 text-slate-700'}">
                  ${d.dayName}
                </span>
                <span class="text-xs font-bold ${d.isToday ? 'text-brand-700' : 'text-slate-600'}">
                  ${d.dayNum} ${d.isToday ? '• היום ✨' : ''}
                </span>
                ${isPeriod ? `
                  <span class="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5" title="מחזור / ווסת">
                    🩸 ווסת
                  </span>
                ` : ''}
              </div>
              <div class="flex items-center gap-1.5">
                ${rec ? `
                  <div class="flex items-center gap-1 text-[10px] font-bold">
                    <span class="px-1.5 py-0.5 rounded text-white" style="background-color: ${fatigueItem.color};" title="אנרגיה: ${rec.fatigue}">
                      🔋${rec.fatigue}
                    </span>
                    <span class="px-1.5 py-0.5 rounded text-white" style="background-color: ${moodItem.color};" title="מצב רוח: ${rec.mood}">
                      😊${rec.mood}
                    </span>
                    ${stressItem ? `
                      <span class="px-1.5 py-0.5 rounded text-white" style="background-color: ${stressItem.color};" title="רמת לחץ: ${rec.stress}">
                        ⚡${rec.stress}
                      </span>
                    ` : ''}
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
        `;
      }).join('')}
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
    cellsHtml += `<div class="h-20 bg-slate-50/50 rounded-xl"></div>`;
  }

  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day);
    const dStr = app.formatDate(d);
    const dayWorkouts = app.workouts.filter(w => w.date === dStr);
    const recovery = app.recoveryLogs[dStr];
    const isToday = dStr === todayStr;

    const fatigueItem = recovery ? getScoreItem(recovery.fatigue) : null;
    const moodItem = recovery ? getScoreItem(recovery.mood) : null;
    const stressItem = recovery && recovery.stress ? getStressItem(recovery.stress) : null;
    const isPeriod = recovery && recovery.period && recovery.period.isPeriod;

    cellsHtml += `
      <div onclick="app.selectDateAndGoDaily('${dStr}')" class="h-20 bg-white border ${isToday ? 'border-brand-500 ring-2 ring-brand-300' : 'border-slate-100'} rounded-xl p-1 flex flex-col justify-between cursor-pointer hover:bg-slate-50 transition shadow-xs relative overflow-hidden">
        <div class="flex justify-between items-center">
          <span class="text-[11px] font-bold ${isToday ? 'w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px]' : 'text-slate-700'}">
            ${day}
          </span>
          ${isPeriod ? `<span class="text-[10px]" title="יום מחזור">🩸</span>` : ''}
        </div>

        ${recovery ? `
          <div class="flex items-center justify-center gap-0.5 my-0.5">
            <span class="text-[8px] font-black text-white px-1 py-0.2 rounded" style="background-color: ${fatigueItem.color};" title="אנרגיה: ${recovery.fatigue}">
              🔋${recovery.fatigue}
            </span>
            <span class="text-[8px] font-black text-white px-1 py-0.2 rounded" style="background-color: ${moodItem.color};" title="מצב רוח: ${recovery.mood}">
              😊${recovery.mood}
            </span>
            ${stressItem ? `
              <span class="text-[8px] font-black text-white px-1 py-0.2 rounded" style="background-color: ${stressItem.color};" title="לחץ: ${recovery.stress}">
                ⚡${recovery.stress}
              </span>
            ` : ''}
          </div>
        ` : `
          <div class="h-3.5"></div>
        `}

        <div class="flex flex-wrap gap-1 items-center justify-center overflow-hidden">
          ${dayWorkouts.map(w => {
            const wColor = getWorkoutColor(w);
            if (w.isPlanned) {
              return `<span class="w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-amber-100 shadow-xs" title="מתוכנן: ${w.title}"></span>`;
            }
            const cfg = SPORT_CONFIGS[w.type] || SPORT_CONFIGS.other;
            return `<span class="w-2.5 h-2.5 rounded-full shadow-xs" style="background-color: ${wColor};" title="${w.title || cfg.name}"></span>`;
          }).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-2">
      <div class="flex items-center justify-between text-[11px] text-slate-500 pb-1 border-b border-slate-100">
        <span class="font-bold text-slate-700">תצוגה חודשית מורחבת</span>
        <div class="flex items-center gap-2 text-[10px]">
          <span title="אנרגיה">🔋</span>
          <span title="מצב רוח">😊</span>
          <span title="לחץ">⚡</span>
          <span title="ווסת">🩸</span>
          <span title="אימון מתוכנן">⏳ מתוכנן</span>
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 pb-1">
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

  const fatigueItem = recovery ? getScoreItem(recovery.fatigue) : null;
  const moodItem = recovery ? getScoreItem(recovery.mood) : null;
  const stressItem = recovery && recovery.stress ? getStressItem(recovery.stress) : null;
  const isPeriod = recovery && recovery.period && recovery.period.isPeriod;

  return `
    <div class="space-y-3">
      <div class="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h4 class="text-xs font-bold text-slate-500">התאוששות ומצב רוח:</h4>
            ${isPeriod ? `
              <span class="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-0.5">
                🩸 יום ווסת
              </span>
            ` : ''}
          </div>
          ${recovery ? `
            <div class="flex flex-wrap items-center gap-1.5 text-xs font-bold mt-1">
              <span class="px-2 py-0.5 rounded-lg text-white font-extrabold shadow-xs" style="background-color: ${fatigueItem.color};">
                🔋 אנרגיה: ${recovery.fatigue}/10
              </span>
              <span class="px-2 py-0.5 rounded-lg text-white font-extrabold shadow-xs" style="background-color: ${moodItem.color};">
                😊 מצב רוח: ${recovery.mood}/10
              </span>
              ${stressItem ? `
                <span class="px-2 py-0.5 rounded-lg text-white font-extrabold shadow-xs" style="background-color: ${stressItem.color};">
                  ⚡ לחץ: ${recovery.stress}/10
                </span>
              ` : ''}
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
          <h3 class="text-sm font-bold text-slate-700">אימונים ליום זה (${dayWorkouts.length})</h3>
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
  // If it's a planned/future workout
  if (w.isPlanned) {
    const timeDisplay = formatWorkoutTime(w.startTime, w.endTime);
    return `
      <div class="bg-amber-50/70 rounded-xl border-2 border-dashed border-amber-300 p-3 shadow-xs flex items-center justify-between gap-2 hover:bg-amber-100/50 transition">
        <div class="flex items-center gap-2.5 flex-1 cursor-pointer" onclick="app.openWorkoutDetail('${w.id}')">
          <div class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            ⏳
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-xs text-slate-800">${w.title || 'אימון מתוכנן'}</span>
              <span class="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded-md">מתוכנן</span>
            </div>
            ${timeDisplay ? `<span class="text-[11px] text-amber-800 font-medium block">⏰ ${timeDisplay}</span>` : ''}
            ${w.notes ? `<span class="text-[10px] text-slate-500 italic block truncate max-w-[170px]">${w.notes}</span>` : ''}
          </div>
        </div>

        <!-- Big checkmark button to complete and fill in workout -->
        <button
          onclick="event.stopPropagation(); app.completePlannedWorkout('${w.id}')"
          class="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm active:scale-95 transition"
          title="לחצי כשסיימת את האימון כדי לעדכן מה עשית!">
          <span>סמני כבוצע</span>
          <i data-lucide="check" class="w-4 h-4 stroke-[3]"></i>
        </button>
      </div>
    `;
  }

  // Regular completed workout
  const cfg = SPORT_CONFIGS[w.type] || SPORT_CONFIGS.other;
  const wColor = getWorkoutColor(w);
  const timeDisplay = formatWorkoutTime(w.startTime, w.endTime);
  const videoUrls = getWorkoutVideoUrls(w);

  return `
    <div onclick="app.openWorkoutDetail('${w.id}')" class="cursor-pointer bg-white rounded-xl border border-slate-100 hover:border-slate-200 p-2.5 shadow-sm transition hover:shadow flex flex-col gap-1.5 relative overflow-hidden">
      <div class="absolute right-0 top-0 bottom-0 w-1.5" style="background-color: ${wColor};"></div>
      <div class="flex items-center justify-between pr-2">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-md text-[11px] font-bold text-white flex items-center gap-1 shadow-xs" style="background-color: ${wColor};">
            <span>${cfg.emoji}</span>
            <span>${cfg.name}</span>
          </span>
          <span class="font-bold text-xs text-slate-800">${w.title || cfg.name}</span>
        </div>
        ${timeDisplay ? `<span class="text-[11px] text-slate-500 font-semibold">⏰ ${timeDisplay}</span>` : (w.duration ? `<span class="text-[11px] text-slate-400 font-medium">${w.duration} דק'</span>` : '')}
      </div>

      <div class="text-xs text-slate-500 pr-2 flex flex-wrap gap-2 items-center">
        ${w.partner ? `
          <span class="bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px]">
            <i data-lucide="users" class="w-3 h-3"></i>
            ${w.partner}
          </span>
        ` : ''}
        ${videoUrls.length > 0 ? `
          ${videoUrls.length === 1 ? `
            <a href="${videoUrls[0]}" target="_blank" onclick="event.stopPropagation()" class="bg-red-50 text-red-600 hover:bg-red-100 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] font-semibold">
              <i data-lucide="play-circle" class="w-3 h-3"></i>
              וידאו
            </a>
          ` : `
            <span class="bg-red-50 text-red-600 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] font-semibold">
              <i data-lucide="video" class="w-3 h-3"></i>
              ${videoUrls.length} סרטונים
            </span>
          `}
        ` : ''}
        ${w.exercises && w.exercises.length > 0 ? `
          <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[11px]">
            ${w.exercises.length} תרגילים
          </span>
        ` : ''}
        ${w.notes ? `
          <span class="text-slate-400 text-[11px] truncate max-w-[160px]">📝 ${w.notes}</span>
        ` : ''}

        <!-- WhatsApp Share Button on Card -->
        <button
          type="button"
          onclick="event.stopPropagation(); app.shareWorkoutWhatsApp('${w.id}')"
          class="mr-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] font-bold active:scale-95 transition"
          title="שיתוף פרטי האימון לוואטסאפ">
          <i data-lucide="share-2" class="w-3 h-3 text-emerald-600"></i>
          <span>ווצאפ</span>
        </button>
      </div>
    </div>
  `;
}
