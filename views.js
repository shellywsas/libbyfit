// Gym, Recovery and PR Views for LibbyFit

// --- TAB 2: GYM & SAVED TEMPLATES ---
function renderGymTab() {
  return `
    <div class="space-y-4">
      <div class="bg-gradient-to-r from-blue-600 to-brand-600 text-white rounded-2xl p-4 shadow-md flex justify-between items-center">
        <div class="space-y-1">
          <h3 class="font-bold text-base flex items-center gap-1.5">
            🏋️‍♀️ אימוני כוח ותבניות
          </h3>
          <p class="text-xs text-blue-100">בחרי תבנית אימון קבועה בלחיצה אחת או צרי חדשה</p>
        </div>
        <button onclick="app.openTemplateModal()" class="bg-white text-blue-700 font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm hover:bg-blue-50 active:scale-95 transition">
          + תבנית חדשה
        </button>
      </div>

      <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-xs font-bold text-slate-700">
          <span class="flex items-center gap-1">
            <i data-lucide="clock" class="w-4 h-4 text-brand-500"></i>
            טיימר מנוחה בין סטים:
          </span>
          <span class="text-slate-400 font-normal">לחצי להפעלה מיידית</span>
        </div>
        <div class="grid grid-cols-4 gap-2 text-xs font-bold">
          <button onclick="app.startRestTimer(30)" class="py-2 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 transition">30 שניות</button>
          <button onclick="app.startRestTimer(60)" class="py-2 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 transition">60 שניות</button>
          <button onclick="app.startRestTimer(90)" class="py-2 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 transition">90 שניות</button>
          <button onclick="app.startRestTimer(120)" class="py-2 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 transition">2 דקות</button>
        </div>
      </div>

      <div class="space-y-3">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider pr-1">תבניות אימון שמורות (${app.templates.length})</h4>
        ${app.templates.map(tmpl => `
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 hover:border-blue-200 transition">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">${tmpl.category || 'חדר כושר'}</span>
                <h4 class="font-bold text-sm text-slate-800 mt-1">${tmpl.name}</h4>
                ${tmpl.description ? `<p class="text-xs text-slate-400 mt-0.5">${tmpl.description}</p>` : ''}
              </div>
              <div class="flex items-center gap-1">
                <button onclick="app.deleteTemplate('${tmpl.id}')" class="text-slate-300 hover:text-red-500 p-1.5 rounded-lg" title="מחק תבנית">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>

            <div class="bg-slate-50 rounded-xl p-2.5 space-y-1.5 text-xs text-slate-600">
              ${tmpl.exercises.map((ex, idx) => `
                <div class="flex justify-between items-center text-[12px]">
                  <span class="font-medium">${idx + 1}. ${ex.name}</span>
                  <span class="text-slate-400 text-[11px]">
                    ${ex.defaultSets} סטים × ${ex.defaultReps} חזרות ${ex.isBodyweight ? '(משקל גוף)' : (ex.defaultWeight ? `• ${ex.defaultWeight} ק"ג` : '')}
                  </span>
                </div>
              `).join('')}
            </div>

            <button onclick="app.startWorkoutFromTemplate('${tmpl.id}')" class="w-full bg-gradient-to-r from-blue-600 to-brand-500 hover:from-blue-700 hover:to-brand-600 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition">
              <i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i>
              התחילי אימון מתבנית זו
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// --- TAB 3: DAILY VIBE & RECOVERY ---
function renderRecoveryTab() {
  const todayStr = app.formatDate(new Date());
  const existing = app.recoveryLogs[todayStr] || { fatigue: 7, mood: 8, notes: '' };

  return `
    <div class="space-y-4">
      <div class="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl p-4 shadow-md">
        <h3 class="font-bold text-base flex items-center gap-1.5">
          🧘‍♀️ התאוששות, עייפות ומצב רוח
        </h3>
        <p class="text-xs text-teal-100 mt-0.5">מעקב יומי של רמת אנרגיה והרגשה כללית (מ-1 עד 10)</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 class="font-bold text-sm text-slate-800">איך את מרגישה היום? (${app.formatHebrewDate(todayStr)})</h4>
          <span class="text-[11px] text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-bold">היום</span>
        </div>

        <!-- Survey 1: Fatigue / Energy -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>🔋 רמת עייפות ואנרגיה</span>
            </label>
            <span id="fatigue-score-display" class="text-sm font-extrabold px-3 py-0.5 rounded-full ${app.getScoreBadgeClass(existing.fatigue)}">
              ${existing.fatigue} מתוך 10
            </span>
          </div>
          <p class="text-[11px] text-slate-400">1 = מותשת לגמרי בלי כוח | 10 = עירנית ומלאת אנרגיה בשיא</p>
          
          <div class="grid grid-cols-10 gap-1 pt-1">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => `
              <button type="button" onclick="app.setSurveyVal('fatigue', ${val})" class="py-2 text-xs font-bold rounded-lg transition active:scale-95 ${existing.fatigue === val ? 'ring-2 ring-slate-800 ring-offset-1 text-white ' + app.getValBgColor(val) : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                ${val}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Survey 2: Mood -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <div class="flex justify-between items-center">
            <label class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>😊 מצב רוח יומי</span>
            </label>
            <span id="mood-score-display" class="text-sm font-extrabold px-3 py-0.5 rounded-full ${app.getScoreBadgeClass(existing.mood)}">
              ${existing.mood} מתוך 10
            </span>
          </div>
          <p class="text-[11px] text-slate-400">1 = ירוד ומבאס | 10 = בעננים, שמחה ומוטיבציה בשמיים</p>
          
          <div class="grid grid-cols-10 gap-1 pt-1">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => `
              <button type="button" onclick="app.setSurveyVal('mood', ${val})" class="py-2 text-xs font-bold rounded-lg transition active:scale-95 ${existing.mood === val ? 'ring-2 ring-slate-800 ring-offset-1 text-white ' + app.getValBgColor(val) : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                ${val}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="space-y-1.5 pt-2 border-t border-slate-100">
          <label class="text-xs font-bold text-slate-700">הערות על הגוף והשרירים (איפה תפוס? מה מרגיש טוב?):</label>
          <textarea id="recovery-notes-input" rows="2" placeholder="למשל: כתף ימין קצת תפוסה אחרי הסרבים אתמול, הרגליים קלילות..." class="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-400">${existing.notes || ''}</textarea>
        </div>

        <button onclick="app.saveTodayRecovery()" class="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs shadow hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-1.5">
          <i data-lucide="check" class="w-4 h-4"></i>
          שמרי מדד התאוששות להיום
        </button>
      </div>

      <div class="space-y-2">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider pr-1">היסטוריית ימים אחרונים</h4>
        <div class="space-y-2">
          ${Object.keys(app.recoveryLogs).sort().reverse().slice(0, 7).map(dStr => {
            const log = app.recoveryLogs[dStr];
            return `
              <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between text-xs">
                <div>
                  <span class="font-bold text-slate-700">${app.formatHebrewDate(dStr)}</span>
                  ${log.notes ? `<p class="text-slate-400 text-[11px] mt-0.5 truncate max-w-[200px]">"${log.notes}"</p>` : ''}
                </div>
                <div class="flex items-center gap-2 font-bold">
                  <span class="px-2 py-0.5 rounded-md ${app.getScoreBadgeClass(log.fatigue)}">🔋 ${log.fatigue}</span>
                  <span class="px-2 py-0.5 rounded-md ${app.getScoreBadgeClass(log.mood)}">😊 ${log.mood}</span>
                </div>
              </div>
            `;
          }).join('') || '<p class="text-xs text-slate-400 text-center py-4">עדיין אין ימים מתועדים</p>'}
        </div>
      </div>
    </div>
  `;
}

// --- TAB 4: GOALS & PRs ---
function renderRecordsTab() {
  return `
    <div class="space-y-4">
      <div class="bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-2xl p-4 shadow-md flex justify-between items-center">
        <div class="space-y-1">
          <h3 class="font-bold text-base flex items-center gap-1.5">
            🏆 לוח שיאי העוצמה של ליבי
          </h3>
          <p class="text-xs text-amber-100">מעקב שיאים אישיים (PR) עם תאריכים והיסטוריה</p>
        </div>
        <button onclick="app.openPRModal()" class="bg-white text-amber-700 font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm hover:bg-amber-50 active:scale-95 transition">
          + שיא חדש
        </button>
      </div>

      <div class="space-y-3">
        ${app.personalRecords.map(pr => `
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 hover:border-amber-200 transition">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md">${pr.category || 'כללי'}</span>
                <h4 class="font-bold text-sm text-slate-800 mt-1">${pr.title}</h4>
              </div>
              <div class="text-left">
                <div class="text-2xl font-extrabold text-amber-600 font-display flex items-baseline gap-1">
                  <span>${pr.currentPR}</span>
                  <span class="text-xs font-semibold text-slate-400">${pr.unit}</span>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 rounded-xl p-2.5 space-y-1.5 text-xs">
              <div class="font-bold text-[11px] text-slate-400 flex justify-between">
                <span>היסטוריית שיאים קודמים:</span>
                <span>${pr.history ? pr.history.length : 0} עדכונים</span>
              </div>
              ${pr.history && pr.history.length > 0 ? pr.history.slice().reverse().map(h => `
                <div class="flex justify-between items-center text-[11px] border-b border-slate-100 last:border-0 pb-1">
                  <span class="text-slate-500">${app.formatHebrewDate(h.date)}</span>
                  <div class="flex items-center gap-2">
                    ${h.note ? `<span class="text-slate-400 text-[10px] italic">"${h.note}"</span>` : ''}
                    <span class="font-bold text-amber-600">${h.value} ${pr.unit}</span>
                  </div>
                </div>
              `).join('') : '<span class="text-slate-400 text-[11px]">אין היסטוריה קודמת</span>'}
            </div>

            <button onclick="app.openUpdatePRModal('${pr.id}')" class="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-500"></i>
              שברת שיא? עדכני כאן!
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
