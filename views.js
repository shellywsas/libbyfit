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

// --- TAB 3: DAILY VIBE, RECOVERY, STRESS & PERIOD TRACKER ---
function renderRecoveryTab() {
  const todayStr = app.formatDate(new Date());
  if (!app.recoveryLogs[todayStr]) {
    app.recoveryLogs[todayStr] = {
      fatigue: 7,
      mood: 8,
      stress: 3,
      notes: '',
      period: { isPeriod: false, flow: 'medium', symptoms: [] }
    };
  }
  const existing = app.recoveryLogs[todayStr];
  if (existing.stress === undefined) existing.stress = 3;
  if (!existing.period) {
    existing.period = { isPeriod: false, flow: 'medium', symptoms: [] };
  }

  const fatigueItem = getScoreItem(existing.fatigue);
  const moodItem = getScoreItem(existing.mood);
  const stressItem = getStressItem(existing.stress);

  // Period stats
  const cycleInfo = app.getCycleInsights();

  return `
    <div class="space-y-4">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 text-white rounded-2xl p-4 shadow-md flex justify-between items-center">
        <div>
          <h3 class="font-bold text-base flex items-center gap-1.5">
            🧘‍♀️ התאוששות, מצב רוח, לחץ ומחזור
          </h3>
          <p class="text-xs text-teal-100 mt-0.5">מעקב יומי של רמת אנרגיה, עומס נפשי וווסת</p>
        </div>
        ${existing.period.isPeriod ? `
          <div class="bg-rose-500/40 border border-white/40 text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs">
            <span>🩸</span>
            <span>במחזור</span>
          </div>
        ` : ''}
      </div>

      <!-- Survey Card -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 class="font-bold text-sm text-slate-800">סקר יומי לליבי (${app.formatHebrewDate(todayStr)})</h4>
          <span class="text-[11px] text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-bold">היום</span>
        </div>

        <!-- SURVEY 1: FATIGUE & ENERGY (1-10) -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>🔋 רמת עייפות ואנרגיה:</span>
            </label>
            <div id="fatigue-preview-badge" class="text-xs font-extrabold px-3 py-1 rounded-xl text-white shadow-xs transition-all" style="background-color: ${fatigueItem.color};">
              ${fatigueItem.val} • ${fatigueItem.label}
            </div>
          </div>
          <p class="text-[11px] text-slate-400">1 = מותשת לגמרי, אפס כוח | 10 = שיא האנרגיה והעירנות!</p>

          <div class="grid grid-cols-10 gap-1.5 pt-1">
            ${SCORE_SCALE.map(s => {
              const isSelected = existing.fatigue === s.val;
              return `
                <button
                  type="button"
                  onmouseenter="app.previewScore('fatigue', ${s.val})"
                  onmouseleave="app.resetPreviewScore('fatigue')"
                  onclick="app.setSurveyVal('fatigue', ${s.val})"
                  title="${s.val}: ${s.label}"
                  class="py-2.5 rounded-xl font-black text-xs text-white transition-all transform active:scale-90 flex flex-col items-center justify-center relative shadow-xs ${isSelected ? 'ring-3 ring-slate-900 scale-110 z-10' : 'opacity-90 hover:opacity-100 hover:scale-105'}"
                  style="background-color: ${s.color};">
                  <span>${s.val}</span>
                  ${isSelected ? `<span class="w-1 h-1 bg-white rounded-full mt-0.5"></span>` : ''}
                </button>
              `;
            }).join('')}
          </div>
          <div id="fatigue-desc" class="text-[11px] font-semibold text-slate-500 text-center py-0.5">
            נבחר: ${fatigueItem.val}/10 - ${fatigueItem.label}
          </div>
        </div>

        <!-- SURVEY 2: MOOD (1-10) -->
        <div class="space-y-2 pt-3 border-t border-slate-100">
          <div class="flex justify-between items-center">
            <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>😊 מצב רוח יומי:</span>
            </label>
            <div id="mood-preview-badge" class="text-xs font-extrabold px-3 py-1 rounded-xl text-white shadow-xs transition-all" style="background-color: ${moodItem.color};">
              ${moodItem.val} • ${moodItem.label}
            </div>
          </div>
          <p class="text-[11px] text-slate-400">1 = ירוד ומבאס | 10 = בעננים, שמחה ומלאת מוטיבציה!</p>

          <div class="grid grid-cols-10 gap-1.5 pt-1">
            ${SCORE_SCALE.map(s => {
              const isSelected = existing.mood === s.val;
              return `
                <button
                  type="button"
                  onmouseenter="app.previewScore('mood', ${s.val})"
                  onmouseleave="app.resetPreviewScore('mood')"
                  onclick="app.setSurveyVal('mood', ${s.val})"
                  title="${s.val}: ${s.label}"
                  class="py-2.5 rounded-xl font-black text-xs text-white transition-all transform active:scale-90 flex flex-col items-center justify-center relative shadow-xs ${isSelected ? 'ring-3 ring-slate-900 scale-110 z-10' : 'opacity-90 hover:opacity-100 hover:scale-105'}"
                  style="background-color: ${s.color};">
                  <span>${s.val}</span>
                  ${isSelected ? `<span class="w-1 h-1 bg-white rounded-full mt-0.5"></span>` : ''}
                </button>
              `;
            }).join('')}
          </div>
          <div id="mood-desc" class="text-[11px] font-semibold text-slate-500 text-center py-0.5">
            נבחר: ${moodItem.val}/10 - ${moodItem.label}
          </div>
        </div>

        <!-- SURVEY 3: STRESS LEVEL (1-10) -->
        <div class="space-y-2 pt-3 border-t border-slate-100">
          <div class="flex justify-between items-center">
            <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>⚡ רמת לחץ וסטרס:</span>
            </label>
            <div id="stress-preview-badge" class="text-xs font-extrabold px-3 py-1 rounded-xl text-white shadow-xs transition-all" style="background-color: ${stressItem.color};">
              ${stressItem.val} • ${stressItem.label}
            </div>
          </div>
          <p class="text-[11px] text-slate-400">1 = רוגע מוחלט, שלווה ושקט | 10 = סטרס ועומס קיצוני</p>

          <div class="grid grid-cols-10 gap-1.5 pt-1">
            ${STRESS_SCALE.map(s => {
              const isSelected = existing.stress === s.val;
              return `
                <button
                  type="button"
                  onmouseenter="app.previewStress(${s.val})"
                  onmouseleave="app.resetPreviewStress()"
                  onclick="app.setSurveyVal('stress', ${s.val})"
                  title="${s.val}: ${s.label}"
                  class="py-2.5 rounded-xl font-black text-xs text-white transition-all transform active:scale-90 flex flex-col items-center justify-center relative shadow-xs ${isSelected ? 'ring-3 ring-slate-900 scale-110 z-10' : 'opacity-90 hover:opacity-100 hover:scale-105'}"
                  style="background-color: ${s.color};">
                  <span>${s.val}</span>
                  ${isSelected ? `<span class="w-1 h-1 bg-white rounded-full mt-0.5"></span>` : ''}
                </button>
              `;
            }).join('')}
          </div>
          <div id="stress-desc" class="text-[11px] font-semibold text-slate-500 text-center py-0.5">
            נבחר: ${stressItem.val}/10 - ${stressItem.label}
          </div>
        </div>

        <!-- SECTION 4: PERIOD / MENSTRUAL CYCLE TRACKING -->
        <div class="space-y-3 pt-3 border-t border-slate-100 bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">🩸</span>
              <div>
                <h5 class="font-bold text-xs text-rose-900">מעקב ווסת / מחזור</h5>
                <p class="text-[10px] text-rose-600">${cycleInfo}</p>
              </div>
            </div>
            <button
              type="button"
              onclick="app.togglePeriod()"
              class="px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 ${existing.period.isPeriod ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-rose-50'}">
              <span>${existing.period.isPeriod ? '✓ יום מחזור' : '+ סמני מחזור'}</span>
            </button>
          </div>

          ${existing.period.isPeriod ? `
            <div class="space-y-1.5 pt-1">
              <span class="text-[11px] font-bold text-rose-800 block">עוצמת דימום:</span>
              <div class="grid grid-cols-3 gap-1.5 text-xs font-bold">
                <button type="button" onclick="app.setPeriodFlow('light')" class="py-1.5 rounded-lg border transition ${existing.period.flow === 'light' ? 'bg-rose-500 text-white border-rose-600 shadow-xs' : 'bg-white text-rose-700 border-rose-200'}">
                  קל 💧
                </button>
                <button type="button" onclick="app.setPeriodFlow('medium')" class="py-1.5 rounded-lg border transition ${existing.period.flow === 'medium' ? 'bg-rose-500 text-white border-rose-600 shadow-xs' : 'bg-white text-rose-700 border-rose-200'}">
                  בינוני 🩸
                </button>
                <button type="button" onclick="app.setPeriodFlow('heavy')" class="py-1.5 rounded-lg border transition ${existing.period.flow === 'heavy' ? 'bg-rose-500 text-white border-rose-600 shadow-xs' : 'bg-white text-rose-700 border-rose-200'}">
                  כבד 🩸🩸
                </button>
              </div>
            </div>

            <div class="space-y-1.5 pt-1">
              <span class="text-[11px] font-bold text-rose-800 block">תחושות ותופעות:</span>
              <div class="flex flex-wrap gap-1.5">
                ${['כאבי בטן', 'כאבי גב', 'עייפות מוגברת', 'רגישות יתר', 'הרגשה טובה', 'נפיחות'].map(sym => {
                  const has = existing.period.symptoms && existing.period.symptoms.includes(sym);
                  return `
                    <button type="button" onclick="app.togglePeriodSymptom('${sym}')" class="text-[11px] px-2.5 py-1 rounded-full border transition ${has ? 'bg-rose-600 text-white border-rose-700 font-bold' : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-100'}">
                      ${has ? '✓ ' : '+ '}${sym}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Notes field -->
        <div class="space-y-1.5 pt-2 border-t border-slate-100">
          <label class="text-xs font-bold text-slate-700">הערות על הגוף והשרירים (איפה תפוס? מה מרגיש טוב?):</label>
          <textarea id="recovery-notes-input" rows="2" placeholder="למשל: כתף ימין קצת תפוסה אחרי הסרבים אתמול, רגליים קלילות..." class="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-400">${existing.notes || ''}</textarea>
        </div>

        <button onclick="app.saveTodayRecovery()" class="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs shadow hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-1.5">
          <i data-lucide="check" class="w-4 h-4"></i>
          שמרי מדד התאוששות, לחץ ומחזור להיום
        </button>
      </div>

      <!-- Recent Logs History -->
      <div class="space-y-2">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider pr-1">היסטוריית ימים אחרונים</h4>
        <div class="space-y-2">
          ${Object.keys(app.recoveryLogs).sort().reverse().slice(0, 10).map(dStr => {
            const log = app.recoveryLogs[dStr];
            const fItem = getScoreItem(log.fatigue);
            const mItem = getScoreItem(log.mood);
            const sItem = log.stress ? getStressItem(log.stress) : null;
            const isPer = log.period && log.period.isPeriod;

            return `
              <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between text-xs">
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-slate-700">${app.formatHebrewDate(dStr)}</span>
                    ${isPer ? `<span class="bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-md text-[10px]">🩸 ווסת</span>` : ''}
                  </div>
                  ${log.notes ? `<p class="text-slate-400 text-[11px] mt-0.5 truncate max-w-[190px]">"${log.notes}"</p>` : ''}
                </div>
                <div class="flex items-center gap-1 font-bold">
                  <span class="px-1.5 py-0.5 rounded text-white shadow-xs" style="background-color: ${fItem.color};">🔋${log.fatigue}</span>
                  <span class="px-1.5 py-0.5 rounded text-white shadow-xs" style="background-color: ${mItem.color};">😊${log.mood}</span>
                  ${sItem ? `<span class="px-1.5 py-0.5 rounded text-white shadow-xs" style="background-color: ${sItem.color};">⚡${log.stress}</span>` : ''}
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
