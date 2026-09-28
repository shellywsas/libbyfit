// LibiFit Views (Templates, Recovery, PRs)

// --- TAB 2: MULTI-SPORT SAVED TEMPLATES & REST TIMER ---
function renderGymTab() {
  const currentFilter = app.templateFilter || 'all';
  const allSports = app.getSportsList ? app.getSportsList() : [];
  const filterSports = [
    { id: 'all', name: 'הכל', emoji: '✨' },
    ...allSports
  ];

  const filtered = (currentFilter === 'all')
    ? app.templates
    : app.templates.filter(t => (t.sport === currentFilter) || (!t.sport && currentFilter === 'gym'));

  return `
    <div class="space-y-3.5">
      <div class="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 text-white rounded-2xl p-4 shadow-md flex justify-between items-center">
        <div class="space-y-0.5">
          <h3 class="font-bold text-base flex items-center gap-1.5">
            📋 תבניות אימון קבועות
          </h3>
          <p class="text-xs text-blue-100">אימונים מוכנים מראש לכל ענפי הספורט שלך בלחיצה אחת</p>
        </div>
        <button onclick="app.openTemplateModal()" class="bg-white text-blue-700 font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm hover:bg-blue-50 active:scale-95 transition whitespace-nowrap">
          + תבנית חדשה
        </button>
      </div>

      <!-- Quick Sport Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        ${filterSports.map(s => {
          const isActive = currentFilter === s.id;
          return `
            <button
              onclick="app.setTemplateFilter('${s.id}')"
              class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 flex items-center gap-1 ${isActive ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}">
              <span>${s.emoji}</span>
              <span>${s.name}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Rest Timer -->
      <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-2">
        <div class="flex items-center justify-between text-xs font-bold text-slate-700">
          <span class="flex items-center gap-1">
            <i data-lucide="clock" class="w-4 h-4 text-brand-500"></i>
            טיימר מנוחה בין סטים ומקצים:
          </span>
          <span class="text-slate-400 font-normal">לחצי להפעלה</span>
        </div>
        <div class="grid grid-cols-4 gap-2 text-xs font-bold">
          <button onclick="app.startRestTimer(30)" class="py-2 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 transition">30 שניות</button>
          <button onclick="app.startRestTimer(60)" class="py-2 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 transition">60 שניות</button>
          <button onclick="app.startRestTimer(90)" class="py-2 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 transition">90 שניות</button>
          <button onclick="app.startRestTimer(120)" class="py-2 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 transition">2 דקות</button>
        </div>
      </div>

      <!-- Templates List -->
      <div class="space-y-3">
        <div class="flex items-center justify-between pr-1">
          <h4 class="text-xs font-bold text-slate-500">תבניות שמורות (${filtered.length})</h4>
          <span class="text-[11px] text-brand-600 font-medium">לחיצה מתחילה אימון מיד</span>
        </div>

        ${filtered.length === 0 ? `
          <div class="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm space-y-2">
            <span class="text-3xl">📝</span>
            <p class="text-sm font-semibold text-slate-600">אין תבניות בקטגוריה זו</p>
            <p class="text-xs text-slate-400">לחצי על "+ תבנית חדשה" כדי ליצור אימון קבוע בספורט זה!</p>
          </div>
        ` : filtered.map(tmpl => {
          const spId = tmpl.sport || 'gym';
          const cfg = SPORT_CONFIGS[spId] || SPORT_CONFIGS.other;
          const tColor = tmpl.color || cfg.accentColor;

          return `
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 hover:border-slate-200 transition relative overflow-hidden">
              <div class="absolute right-0 top-0 bottom-0 w-1.5" style="background-color: ${tColor};"></div>
              
              <div class="flex items-start justify-between pr-1">
                <div class="space-y-1">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[11px] font-bold px-2 py-0.5 rounded-md text-white shadow-xs" style="background-color: ${tColor};">
                      ${cfg.emoji} ${cfg.name}
                    </span>
                    <h4 class="font-bold text-sm text-slate-800">${tmpl.name}</h4>
                  </div>
                  ${tmpl.description ? `<p class="text-xs text-slate-500">${tmpl.description}</p>` : ''}
                </div>
                <button onclick="app.deleteTemplate('${tmpl.id}')" class="text-slate-300 hover:text-red-500 p-1.5 rounded-lg active:scale-90" title="מחק תבנית">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>

              ${tmpl.exercises && tmpl.exercises.length > 0 ? `
                <div class="bg-slate-50 rounded-xl p-2.5 space-y-1.5 text-xs text-slate-600 pr-2">
                  <span class="text-[10px] font-bold text-slate-400 block mb-1">תרגילי האימון:</span>
                  ${tmpl.exercises.map((ex, idx) => `
                    <div class="flex justify-between items-center text-[11px]">
                      <span class="font-medium">${idx + 1}. ${ex.name}</span>
                      <span class="text-slate-400 text-[10px]">
                        ${ex.defaultSets} סטים × ${ex.defaultReps} חזרות ${ex.isBodyweight ? '(משקל גוף)' : (ex.defaultWeight ? `• ${ex.defaultWeight} ק"ג` : '')}
                      </span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              ${tmpl.partner ? `
                <div class="bg-cyan-50/70 border border-cyan-100 rounded-xl px-2.5 py-1.5 text-xs text-cyan-800 flex items-center gap-1.5">
                  <i data-lucide="users" class="w-3.5 h-3.5"></i>
                  <span><b>שותפות קבועות:</b> ${tmpl.partner}</span>
                </div>
              ` : ''}

              ${tmpl.notes ? `
                <div class="bg-slate-50 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 flex items-center gap-1.5">
                  <i data-lucide="info" class="w-3.5 h-3.5 text-slate-400"></i>
                  <span class="truncate"><b>דגשים:</b> ${tmpl.notes}</span>
                </div>
              ` : ''}

              <button onclick="app.startWorkoutFromTemplate('${tmpl.id}')" class="w-full text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition" style="background-color: ${tColor};">
                <i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i>
                התחילי אימון מתבנית זו
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// --- TAB 3: DAILY VIBE, RECOVERY, STRESS & PERIOD TRACKER ---
function renderRecoveryTab() {
  const todayStr = app.formatDate(new Date());
  const existing = app.recoveryLogs[todayStr] || {};
  const fatigueVal = (existing.fatigue !== undefined && existing.fatigue !== null) ? Number(existing.fatigue) : null;
  const moodVal = (existing.mood !== undefined && existing.mood !== null) ? Number(existing.mood) : null;
  const stressVal = (existing.stress !== undefined && existing.stress !== null) ? Number(existing.stress) : null;
  const periodData = existing.period || { isPeriod: false, flow: 'medium', symptoms: [] };
  const isPeriod = !!periodData.isPeriod;

  const fatigueItem = fatigueVal ? getScoreItem(fatigueVal) : null;
  const moodItem = moodVal ? getScoreItem(moodVal) : null;
  const stressItem = stressVal ? getStressItem(stressVal) : null;

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
        ${isPeriod ? `
          <div class="bg-rose-500/40 border border-white/40 text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs">
            <span>🩸</span>
            <span>במחזור</span>
          </div>
        ` : ''}
      </div>

      <!-- View Switcher Tabs: Daily Survey vs Monthly Analytics -->
      <div class="flex bg-slate-100 p-1 rounded-2xl gap-1 text-xs font-bold shadow-xs">
        <button
          type="button"
          onclick="app.setSurveyView('daily')"
          class="flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${app.surveyActiveTab !== 'trends' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}">
          <span>📝</span>
          <span>סקר יומי</span>
        </button>
        <button
          type="button"
          onclick="app.setSurveyView('trends')"
          class="flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${app.surveyActiveTab === 'trends' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}">
          <span>📈</span>
          <span>מגמות וסטטיסטיקה חודשית</span>
        </button>
      </div>

      ${app.surveyActiveTab === 'trends' ? renderMonthlyTrendsView() : `
        <!-- Survey Card -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 class="font-bold text-sm text-slate-800">סקר יומי ל${app.getUserName()} (${app.formatHebrewDate(todayStr)})</h4>
            <span class="text-[11px] text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-bold">היום</span>
          </div>

          <!-- SURVEY 1: FATIGUE & ENERGY (1-10) -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>🔋 רמת עייפות ואנרגיה:</span>
              </label>
              <div id="fatigue-preview-badge" class="text-xs font-extrabold px-3 py-1 rounded-xl text-white shadow-xs transition-all ${fatigueItem ? '' : 'bg-slate-500'}" style="${fatigueItem ? `background-color: ${fatigueItem.color};` : ''}">
                ${fatigueItem ? `${fatigueItem.val} • ${fatigueItem.label}` : 'טרם נבחר'}
              </div>
            </div>
            <p class="text-[11px] text-slate-400">1 = מותשת לגמרי, אפס כוח | 10 = שיא האנרגיה והעירנות!</p>

            <div class="grid grid-cols-10 gap-1.5 pt-1">
              ${SCORE_SCALE.map(s => {
                const isSelected = fatigueVal !== null && fatigueVal === s.val;
                return `
                  <button
                    type="button"
                    onmouseenter="app.previewScore('fatigue', ${s.val})"
                    onmouseleave="app.resetPreviewScore('fatigue')"
                    onclick="app.setSurveyVal('fatigue', ${s.val})"
                    title="${s.val}: ${s.label}"
                    class="py-2 rounded-xl font-bold text-xs text-white transition-all transform active:scale-95 flex flex-col items-center justify-center relative shadow-xs ${isSelected ? 'ring-2 ring-offset-2 ring-slate-800 scale-105 shadow-sm' : 'opacity-85 hover:opacity-100 hover:scale-105'}"
                    style="background-color: ${s.color};">
                    <span>${s.val}</span>
                    ${isSelected ? `<span class="w-1.5 h-1.5 bg-white rounded-full mt-1 shadow-sm"></span>` : `<span class="w-1.5 h-1.5 bg-transparent mt-1"></span>`}
                  </button>
                `;
              }).join('')}
            </div>
            <div id="fatigue-desc" class="text-xs font-medium text-slate-500 text-center py-1">
              נבחר: <span id="fatigue-desc-text" class="font-bold text-slate-700">${fatigueItem ? `${fatigueItem.val}/10 - ${fatigueItem.label}` : 'טרם נבחר'}</span>
            </div>
          </div>

          <!-- SURVEY 2: MOOD (1-10) -->
          <div class="space-y-2 pt-3 border-t border-slate-100">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>😊 מצב רוח יומי:</span>
              </label>
              <div id="mood-preview-badge" class="text-xs font-extrabold px-3 py-1 rounded-xl text-white shadow-xs transition-all ${moodItem ? '' : 'bg-slate-500'}" style="${moodItem ? `background-color: ${moodItem.color};` : ''}">
                ${moodItem ? `${moodItem.val} • ${moodItem.label}` : 'טרם נבחר'}
              </div>
            </div>
            <p class="text-[11px] text-slate-400">1 = ירוד ומבאס | 10 = בעננים, שמחה ומלאת מוטיבציה!</p>

            <div class="grid grid-cols-10 gap-1.5 pt-1">
              ${SCORE_SCALE.map(s => {
                const isSelected = moodVal !== null && moodVal === s.val;
                return `
                  <button
                    type="button"
                    onmouseenter="app.previewScore('mood', ${s.val})"
                    onmouseleave="app.resetPreviewScore('mood')"
                    onclick="app.setSurveyVal('mood', ${s.val})"
                    title="${s.val}: ${s.label}"
                    class="py-2 rounded-xl font-bold text-xs text-white transition-all transform active:scale-95 flex flex-col items-center justify-center relative shadow-xs ${isSelected ? 'ring-2 ring-offset-2 ring-slate-800 scale-105 shadow-sm' : 'opacity-85 hover:opacity-100 hover:scale-105'}"
                    style="background-color: ${s.color};">
                    <span>${s.val}</span>
                    ${isSelected ? `<span class="w-1.5 h-1.5 bg-white rounded-full mt-1 shadow-sm"></span>` : `<span class="w-1.5 h-1.5 bg-transparent mt-1"></span>`}
                  </button>
                `;
              }).join('')}
            </div>
            <div id="mood-desc" class="text-xs font-medium text-slate-500 text-center py-1">
              נבחר: <span id="mood-desc-text" class="font-bold text-slate-700">${moodItem ? `${moodItem.val}/10 - ${moodItem.label}` : 'טרם נבחר'}</span>
            </div>
          </div>

          <!-- SURVEY 3: STRESS LEVEL (1-10) -->
          <div class="space-y-2 pt-3 border-t border-slate-100">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>⚡ רמת לחץ וסטרס:</span>
              </label>
              <div id="stress-preview-badge" class="text-xs font-extrabold px-3 py-1 rounded-xl text-white shadow-xs transition-all ${stressItem ? '' : 'bg-slate-500'}" style="${stressItem ? `background-color: ${stressItem.color};` : ''}">
                ${stressItem ? `${stressItem.val} • ${stressItem.label}` : 'טרם נבחר'}
              </div>
            </div>
            <p class="text-[11px] text-slate-400">1 = רוגע מוחלט, שלווה ושקט | 10 = סטרס ועומס קיצוני</p>

            <div class="grid grid-cols-10 gap-1.5 pt-1">
              ${STRESS_SCALE.map(s => {
                const isSelected = stressVal !== null && stressVal === s.val;
                return `
                  <button
                    type="button"
                    onmouseenter="app.previewStress(${s.val})"
                    onmouseleave="app.resetPreviewStress()"
                    onclick="app.setSurveyVal('stress', ${s.val})"
                    title="${s.val}: ${s.label}"
                    class="py-2 rounded-xl font-bold text-xs text-white transition-all transform active:scale-95 flex flex-col items-center justify-center relative shadow-xs ${isSelected ? 'ring-2 ring-offset-2 ring-slate-800 scale-105 shadow-sm' : 'opacity-85 hover:opacity-100 hover:scale-105'}"
                    style="background-color: ${s.color};">
                    <span>${s.val}</span>
                    ${isSelected ? `<span class="w-1.5 h-1.5 bg-white rounded-full mt-1 shadow-sm"></span>` : `<span class="w-1.5 h-1.5 bg-transparent mt-1"></span>`}
                  </button>
                `;
              }).join('')}
            </div>
            <div id="stress-desc" class="text-xs font-medium text-slate-500 text-center py-1">
              נבחר: <span id="stress-desc-text" class="font-bold text-slate-700">${stressItem ? `${stressItem.val}/10 - ${stressItem.label}` : 'טרם נבחר'}</span>
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
                class="px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 ${isPeriod ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-rose-50'}">
                <span>${isPeriod ? '✓ יום מחזור' : '+ סמני מחזור'}</span>
              </button>
            </div>

            ${isPeriod ? `
              <div class="space-y-1.5 pt-1">
                <span class="text-[11px] font-bold text-rose-800 block">עוצמת דימום:</span>
                <div class="grid grid-cols-3 gap-1.5 text-xs font-bold">
                  <button type="button" onclick="app.setPeriodFlow('light')" class="py-1.5 rounded-lg border transition ${periodData.flow === 'light' ? 'bg-rose-500 text-white border-rose-600 shadow-xs' : 'bg-white text-rose-700 border-rose-200'}">
                    קל 💧
                  </button>
                  <button type="button" onclick="app.setPeriodFlow('medium')" class="py-1.5 rounded-lg border transition ${periodData.flow === 'medium' ? 'bg-rose-500 text-white border-rose-600 shadow-xs' : 'bg-white text-rose-700 border-rose-200'}">
                    בינוני 🩸
                  </button>
                  <button type="button" onclick="app.setPeriodFlow('heavy')" class="py-1.5 rounded-lg border transition ${periodData.flow === 'heavy' ? 'bg-rose-500 text-white border-rose-600 shadow-xs' : 'bg-white text-rose-700 border-rose-200'}">
                    כבד 🩸🩸
                  </button>
                </div>
              </div>

              <div class="space-y-1.5 pt-1">
                <span class="text-[11px] font-bold text-rose-800 block">תחושות ותופעות:</span>
                <div class="flex flex-wrap gap-1.5">
                  ${['כאבי בטן', 'כאבי גב', 'עייפות מוגברת', 'רגישות יתר', 'הרגשה טובה', 'נפיחות'].map(sym => {
                    const has = periodData.symptoms && periodData.symptoms.includes(sym);
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
              const fItem = log.fatigue ? getScoreItem(log.fatigue) : null;
              const mItem = log.mood ? getScoreItem(log.mood) : null;
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
                    ${fItem ? `<span class="px-1.5 py-0.5 rounded text-white shadow-xs" style="background-color: ${fItem.color};">🔋${log.fatigue}</span>` : ''}
                    ${mItem ? `<span class="px-1.5 py-0.5 rounded text-white shadow-xs" style="background-color: ${mItem.color};">😊${log.mood}</span>` : ''}
                    ${sItem ? `<span class="px-1.5 py-0.5 rounded text-white shadow-xs" style="background-color: ${sItem.color};">⚡${log.stress}</span>` : ''}
                  </div>
                </div>
              `;
            }).join('') || '<p class="text-xs text-slate-400 text-center py-4">עדיין אין ימים מתועדים</p>'}
          </div>
        </div>
      `}
    </div>
  `;
}

// --- MONTHLY TRENDS & WORKOUT BREAKDOWN ---
function renderMonthlyTrendsView() {
  const targetDate = app.trendsDate || new Date();
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const totalDays = new Date(year, month + 1, 0).getDate();
  const activeMetric = app.trendsMetric || 'energy'; // 'energy', 'mood', 'stress'

  const hebrewMonthName = new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' }).format(targetDate);
  const now = new Date();
  const isCurrentRealMonth = (year === now.getFullYear() && month === now.getMonth());

  // Get days in selected month that have logs
  const monthLogs = [];
  let sumEnergy = 0, countEnergy = 0;
  let sumMood = 0, countMood = 0;
  let sumStress = 0, countStress = 0;
  let periodDaysCount = 0;

  for (let d = 1; d <= totalDays; d++) {
    const dStr = `${monthPrefix}-${String(d).padStart(2, '0')}`;
    const log = app.recoveryLogs[dStr];
    if (log) {
      monthLogs.push({ day: d, dateStr: dStr, log });
      if (log.fatigue !== undefined && log.fatigue !== null) {
        sumEnergy += Number(log.fatigue);
        countEnergy++;
      }
      if (log.mood !== undefined && log.mood !== null) {
        sumMood += Number(log.mood);
        countMood++;
      }
      if (log.stress !== undefined && log.stress !== null) {
        sumStress += Number(log.stress);
        countStress++;
      }
      if (log.period && log.period.isPeriod) {
        periodDaysCount++;
      }
    }
  }

  const avgEnergy = countEnergy > 0 ? (sumEnergy / countEnergy).toFixed(1) : '-';
  const avgMood = countMood > 0 ? (sumMood / countMood).toFixed(1) : '-';
  const avgStress = countStress > 0 ? (sumStress / countStress).toFixed(1) : '-';

  // Calculate monthly completed workouts
  const monthWorkouts = app.workouts.filter(w => !w.isPlanned && w.date && w.date.startsWith(monthPrefix));
  const sportCounts = {};
  monthWorkouts.forEach(w => {
    const type = w.type || 'volleyball';
    sportCounts[type] = (sportCounts[type] || 0) + 1;
  });
  const sportsMap = app.getAllSportsMap();

  // SVG Chart calculation for active metric
  const chartWidth = 330;
  const chartHeight = 140;
  const paddingX = 25;
  const paddingY = 20;
  const plotW = chartWidth - (paddingX * 2);
  const plotH = chartHeight - (paddingY * 2);

  // Generate data points for active metric
  const points = [];
  monthLogs.forEach(item => {
    let val = null;
    if (activeMetric === 'energy') val = item.log.fatigue;
    else if (activeMetric === 'mood') val = item.log.mood;
    else if (activeMetric === 'stress') val = item.log.stress;

    if (val !== null && val !== undefined) {
      const x = paddingX + ((item.day - 1) / Math.max(totalDays - 1, 1)) * plotW;
      const y = paddingY + plotH - ((Number(val) - 1) / 9) * plotH;
      points.push({ x, y, day: item.day, val: Number(val) });
    }
  });

  let polylinePoints = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  let areaPoints = '';
  if (points.length > 0) {
    const firstX = points[0].x.toFixed(1);
    const lastX = points[points.length - 1].x.toFixed(1);
    const bottomY = (paddingY + plotH).toFixed(1);
    areaPoints = `${firstX},${bottomY} ${polylinePoints} ${lastX},${bottomY}`;
  }

  const metricColors = {
    energy: { stroke: '#06B6D4', fill: '#CFFAFE', dot: '#0891B2', name: 'אנרגיה ועייפות' },
    mood: { stroke: '#10B981', fill: '#D1FAE5', dot: '#059669', name: 'מצב רוח יומי' },
    stress: { stroke: '#F59E0B', fill: '#FEF3C7', dot: '#D97706', name: 'רמת לחץ וסטרס' }
  };
  const activeColor = metricColors[activeMetric] || metricColors.energy;

  return `
    <div class="space-y-4">
      <!-- Month Navigation Bar -->
      <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <button onclick="app.changeTrendsMonth(-1)" class="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition flex items-center gap-1 text-xs font-bold active:scale-95 shadow-2xs" title="חודש קודם">
          <i data-lucide="chevron-right" class="w-4 h-4"></i>
          <span>חודש קודם</span>
        </button>
        
        <div class="text-center">
          <span class="font-extrabold text-sm text-slate-800 block">${hebrewMonthName}</span>
          ${!isCurrentRealMonth ? `
            <button onclick="app.resetTrendsMonth()" class="text-[10px] text-brand-600 font-bold hover:underline">
              חזרה לחודש הנוכחי ↩️
            </button>
          ` : `<span class="text-[10px] text-slate-400 font-medium">חודש נוכחי</span>`}
        </div>

        <button onclick="app.changeTrendsMonth(1)" class="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition flex items-center gap-1 text-xs font-bold active:scale-95 shadow-2xs" title="חודש הבא">
          <span>חודש הבא</span>
          <i data-lucide="chevron-left" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Metric Selector Cards -->
      <div class="grid grid-cols-3 gap-2">
        <div onclick="app.setTrendsMetric('energy')" class="cursor-pointer p-2.5 rounded-2xl border text-center transition ${activeMetric === 'energy' ? 'bg-cyan-50 border-cyan-400 ring-2 ring-cyan-300' : 'bg-white border-slate-100'}">
          <span class="text-xs block text-slate-500 font-bold">🔋 אנרגיה</span>
          <span class="text-lg font-extrabold text-cyan-600">${avgEnergy}</span>
          <span class="text-[9px] text-slate-400 block">${countEnergy} ימים</span>
        </div>
        <div onclick="app.setTrendsMetric('mood')" class="cursor-pointer p-2.5 rounded-2xl border text-center transition ${activeMetric === 'mood' ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300' : 'bg-white border-slate-100'}">
          <span class="text-xs block text-slate-500 font-bold">😊 מצב רוח</span>
          <span class="text-lg font-extrabold text-emerald-600">${avgMood}</span>
          <span class="text-[9px] text-slate-400 block">${countMood} ימים</span>
        </div>
        <div onclick="app.setTrendsMetric('stress')" class="cursor-pointer p-2.5 rounded-2xl border text-center transition ${activeMetric === 'stress' ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300' : 'bg-white border-slate-100'}">
          <span class="text-xs block text-slate-500 font-bold">⚡ סטרס</span>
          <span class="text-lg font-extrabold text-amber-600">${avgStress}</span>
          <span class="text-[9px] text-slate-400 block">${countStress} ימים</span>
        </div>
      </div>

      <!-- Trend SVG Chart Card -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <span>📈 מגמת ${activeColor.name} (${hebrewMonthName})</span>
          </h4>
          <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">${points.length} תיעודים</span>
        </div>

        ${points.length === 0 ? `
          <div class="py-10 text-center text-slate-400 text-xs">
            אין עדיין תיעודים של מדד זה בחודש ${hebrewMonthName}.
          </div>
        ` : `
          <div class="w-full overflow-x-auto">
            <svg viewBox="0 0 ${chartWidth} ${chartHeight}" class="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="trendGrad-${activeMetric}" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="${activeColor.stroke}" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="${activeColor.fill}" stop-opacity="0.02"/>
                </linearGradient>
              </defs>

              <!-- Grid lines -->
              <line x1="${paddingX}" y1="${paddingY}" x2="${chartWidth - paddingX}" y2="${paddingY}" stroke="#F1F5F9" stroke-width="1"/>
              <line x1="${paddingX}" y1="${paddingY + plotH / 2}" x2="${chartWidth - paddingX}" y2="${paddingY + plotH / 2}" stroke="#F1F5F9" stroke-width="1" stroke-dasharray="3,3"/>
              <line x1="${paddingX}" y1="${paddingY + plotH}" x2="${chartWidth - paddingX}" y2="${paddingY + plotH}" stroke="#E2E8F0" stroke-width="1"/>

              <!-- Y Axis labels -->
              <text x="${paddingX - 6}" y="${paddingY + 4}" font-size="9" fill="#94A3B8" text-anchor="end" font-weight="bold">10</text>
              <text x="${paddingX - 6}" y="${paddingY + plotH / 2 + 3}" font-size="9" fill="#94A3B8" text-anchor="end">5</text>
              <text x="${paddingX - 6}" y="${paddingY + plotH + 2}" font-size="9" fill="#94A3B8" text-anchor="end" font-weight="bold">1</text>

              <!-- Filled Area -->
              ${areaPoints ? `<polygon points="${areaPoints}" fill="url(#trendGrad-${activeMetric})"/>` : ''}

              <!-- Line -->
              <polyline points="${polylinePoints}" fill="none" stroke="${activeColor.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

              <!-- Data dots & values -->
              ${points.map(p => `
                <g>
                  <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="#FFFFFF" stroke="${activeColor.dot}" stroke-width="2.5"/>
                  <text x="${p.x.toFixed(1)}" y="${(p.y - 7).toFixed(1)}" font-size="9" font-weight="bold" fill="${activeColor.dot}" text-anchor="middle">${p.val}</text>
                  <text x="${p.x.toFixed(1)}" y="${(chartHeight - 3).toFixed(1)}" font-size="8" fill="#94A3B8" text-anchor="middle">${p.day}</text>
                </g>
              `).join('')}
            </svg>
          </div>
          <div class="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100">
            <span>יום 1 בחודש</span>
            <span>ציר הימים (1 - ${totalDays})</span>
            <span>יום ${totalDays} בחודש</span>
          </div>
        `}
      </div>

      <!-- Menstrual Period Summary Card -->
      <div class="bg-rose-50/70 rounded-2xl border border-rose-200 p-3.5 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-xs font-bold text-rose-900">
            <span>🩸 מעקב ווסת (${hebrewMonthName})</span>
          </div>
          <span class="text-xs font-extrabold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">
            ${periodDaysCount} ימי מחזור סומנו
          </span>
        </div>
        <p class="text-[11px] text-rose-700">
          ${periodDaysCount > 0 ? `סומנו ${periodDaysCount} ימי מחזור בחודש ${hebrewMonthName}. המשיכי לתעד כדי לקבל תובנות על קשר בין המחזור לרמת האנרגיה!` : `לא סומנו ימי מחזור בחודש ${hebrewMonthName}.`}
        </p>
      </div>

      <!-- Monthly Workout Distribution Breakdown -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <span>📊 פילוח אימונים (${hebrewMonthName})</span>
          </h4>
          <span class="text-xs font-extrabold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
            ${monthWorkouts.length} אימונים שהושלמו 🎉
          </span>
        </div>

        ${monthWorkouts.length === 0 ? `
          <div class="py-6 text-center text-slate-400 text-xs">
            אין אימונים שהושלמו בחודש ${hebrewMonthName}.
          </div>
        ` : `
          <div class="space-y-2.5 pt-1">
            ${Object.keys(sportCounts).map(sportId => {
              const count = sportCounts[sportId];
              const pct = Math.round((count / monthWorkouts.length) * 100);
              const cfg = sportsMap[sportId] || sportsMap.other || { name: 'ספורט', emoji: '⭐', accentColor: '#0284C7' };
              return `
                <div class="space-y-1">
                  <div class="flex justify-between items-center text-xs">
                    <span class="font-bold text-slate-700 flex items-center gap-1">
                      <span>${cfg.emoji}</span>
                      <span>${cfg.name}</span>
                    </span>
                    <span class="font-bold text-slate-600">${count} אימונים (${pct}%)</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div class="h-2.5 rounded-full transition-all duration-500" style="width: ${pct}%; background-color: ${cfg.accentColor || '#0284C7'};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
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
            🏆 לוח שיאי העוצמה של ${app.getUserName()}
          </h3>
          <p class="text-xs text-amber-100">מעקב שיאים אישיים (PR) עם תאריכים והיסטוריה</p>
        </div>
        <button onclick="app.openPRModal()" class="bg-white text-amber-700 font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm hover:bg-amber-50 active:scale-95 transition">
          + שיא חדש
        </button>
      </div>

      <div class="space-y-3">
        ${app.personalRecords.length === 0 ? `
          <div class="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm space-y-2">
            <span class="text-3xl">🏆</span>
            <p class="text-sm font-semibold text-slate-600">אין עדיין שיאים ברשימה</p>
            <p class="text-xs text-slate-400">לחצי על "+ שיא חדש" למעלה כדי להוסיף את השיא הראשון שלך!</p>
          </div>
        ` : app.personalRecords.map(pr => `
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 hover:border-amber-200 transition">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md">${pr.category || 'כללי'}</span>
                <h4 class="font-bold text-sm text-slate-800 mt-1">${pr.title}</h4>
              </div>
              <div class="flex items-center gap-2">
                <div class="text-left">
                  <div class="text-2xl font-extrabold text-amber-600 font-display flex items-baseline gap-1">
                    <span>${pr.currentPR}</span>
                    <span class="text-xs font-semibold text-slate-400">${pr.unit}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onclick="event.stopPropagation(); app.deletePR('${pr.id}')"
                  class="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition active:scale-90"
                  title="מחיקת שיא זה לצמיתות">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
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
