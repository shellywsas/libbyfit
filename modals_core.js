// Modals Core: Workout Form, Complete Planned Modal, and Container

function renderModalContainer() {
  if (!app.activeModal) return '';

  let content = '';
  if (app.activeModal === 'workoutForm') content = renderWorkoutFormModal();
  if (app.activeModal === 'completePlanned') content = renderCompletePlannedModal();
  if (app.activeModal === 'workoutDetail') content = renderWorkoutDetailModal();
  if (app.activeModal === 'templateForm') content = renderTemplateFormModal();
  if (app.activeModal === 'prForm') content = renderPRFormModal();
  if (app.activeModal === 'updatePRModal') content = renderUpdatePRModal();
  if (app.activeModal === 'backupModal') content = renderBackupModal();
  if (app.activeModal === 'installGuideModal') content = renderInstallGuideModal();

  return `
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 overflow-y-auto">
      <div class="bg-white rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        ${content}
      </div>
    </div>
  `;
}

function renderWorkoutFormModal() {
  const w = app.editingWorkout;
  const isGym = w.type === 'gym';
  const isVolleyball = w.type === 'volleyball';
  const isPlanned = !!w.isPlanned;

  return `
    <div class="p-4 border-b border-slate-100 flex items-center justify-between ${isPlanned ? 'bg-amber-50' : 'bg-slate-50'}">
      <h3 class="font-bold text-sm text-slate-800 flex items-center gap-1.5">
        <span>${isPlanned ? '⏳ תכנון אימון עתידי' : '✨ רישום אימון'}</span>
      </h3>
      <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 p-1">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="p-4 overflow-y-auto space-y-4 flex-1">
      <!-- Future / Planned Workout Toggle Banner -->
      <div class="bg-amber-50/80 border border-amber-200 p-3 rounded-2xl flex items-center justify-between">
        <div class="space-y-0.5">
          <span class="font-bold text-xs text-amber-900 flex items-center gap-1">
            <span>⏳ האם זה אימון עתידי?</span>
          </span>
          <p class="text-[10px] text-amber-700">באימון עתידי רק שומרים מועד, ורק כשתלחצי וי תמלאי מה עשית</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="w-is-planned" ${isPlanned ? 'checked' : ''} onchange="app.toggleWorkoutPlanned(this.checked)" class="sr-only peer">
          <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>

      <!-- Date & Times (Start Time & End Time) -->
      <div class="space-y-2">
        <div>
          <label class="text-[11px] font-bold text-slate-600">תאריך האימון</label>
          <input type="date" id="w-date" value="${w.date}" class="w-full text-xs p-2 rounded-xl border border-slate-200 mt-1 font-semibold">
        </div>

        <div class="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div>
            <label class="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-brand-500"></i>
              <span>משעה:</span>
            </label>
            <input type="time" id="w-start-time" value="${w.startTime || '18:00'}" class="w-full text-xs p-1.5 rounded-lg border border-slate-200 mt-1 text-center font-bold">
          </div>
          <div>
            <label class="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-brand-500"></i>
              <span>עד שעה:</span>
            </label>
            <input type="time" id="w-end-time" value="${w.endTime || '19:30'}" class="w-full text-xs p-1.5 rounded-lg border border-slate-200 mt-1 text-center font-bold">
          </div>
        </div>
      </div>

      <!-- Title / Goal -->
      <div>
        <label class="text-[11px] font-bold text-slate-600">כותרת או יעד לאימון</label>
        <input type="text" id="w-title" value="${w.title || ''}" placeholder="${isPlanned ? 'אימון מתוכנן' : 'אימון...'}" class="w-full text-xs p-2 rounded-xl border border-slate-200 mt-1 font-bold">
      </div>

      <!-- If NOT planned: show full details builder -->
      ${!isPlanned ? `
        <!-- Quick Template Loader for any sport -->
        <div class="bg-sky-50/80 p-2.5 rounded-2xl border border-sky-200 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 text-xs font-bold text-sky-900">
            <i data-lucide="clipboard-list" class="w-4 h-4 text-sky-600"></i>
            <span>טעינה מתבנית קבועה:</span>
          </div>
          <select onchange="app.loadTemplateIntoCurrentWorkout(this.value)" class="p-1.5 rounded-xl border border-sky-200 text-xs font-bold text-sky-800 bg-white focus:outline-none flex-1 max-w-[210px]">
            <option value="">בחרי תבנית מוכנה...</option>
            ${app.templates.map(t => {
              const sp = SPORT_CONFIGS[t.sport || 'gym']?.emoji || '📋';
              return `<option value="${t.id}">${sp} ${t.name}</option>`;
            }).join('')}
          </select>
        </div>

        <div>
          <label class="text-[11px] font-bold text-slate-600 mb-1 block">סוג האימון</label>
          <div class="grid grid-cols-3 gap-1.5">
            ${Object.values(SPORT_CONFIGS).filter(c => c.id !== 'planned').map(cfg => `
              <button type="button" onclick="app.changeWorkoutType('${cfg.id}')" class="p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${w.type === cfg.id ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-300' : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'}">
                <span class="text-base">${cfg.emoji}</span>
                <span>${cfg.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Custom Color Picker -->
        <div class="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <span>🎨 בחרי צבע לאימון ביומן:</span>
            </label>
            <span class="text-[10px] text-slate-400 font-medium">בלחיצה אחת</span>
          </div>
          <div class="flex items-center gap-1.5 flex-wrap">
            ${WORKOUT_COLORS.map(c => {
              const isSelected = (w.color || getWorkoutColor(w)) === c.hex;
              return `
                <button
                  type="button"
                  onclick="app.setWorkoutColor('${c.hex}')"
                  class="w-7 h-7 rounded-full transition-all active:scale-90 flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-brand-500 scale-110 shadow-sm' : 'hover:scale-105'}"
                  style="background-color: ${c.hex};"
                  title="${c.name}">
                  ${isSelected ? '<i data-lucide="check" class="w-3.5 h-3.5 text-white stroke-[3]"></i>' : ''}
                </button>
              `;
            }).join('')}
            <label class="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 hover:border-brand-500 flex items-center justify-center cursor-pointer relative bg-white" title="בחירת כל צבע אחר">
              <input type="color" value="${w.color || getWorkoutColor(w)}" onchange="app.setWorkoutColor(this.value)" class="opacity-0 absolute inset-0 w-full h-full cursor-pointer">
              <i data-lucide="palette" class="w-3.5 h-3.5 text-slate-400"></i>
            </label>
          </div>
        </div>

        ${isVolleyball ? `
          <div class="bg-cyan-50/70 border border-cyan-200 p-3 rounded-2xl space-y-3">
            <h4 class="text-xs font-bold text-cyan-800 flex items-center gap-1">
              <span>🏐 פרטי כדורעף ייעודיים</span>
            </h4>
            
            <div>
              <label class="text-[11px] font-bold text-slate-600">עם מי שיחקת? (שותפות/חברות)</label>
              <input type="text" id="w-partner" value="${w.partner || ''}" placeholder="למשל: נועה, מאי, שירה" class="w-full text-xs p-2 rounded-xl border border-slate-200 mt-1 bg-white">
              <div class="flex flex-wrap gap-1 mt-1.5">
                <span class="text-[10px] text-slate-400 self-center">מהיר:</span>
                ${app.recentTeammates.map(name => `
                  <button type="button" onclick="app.addTeammateToInput('${name}')" class="text-[10px] bg-white border border-cyan-200 text-cyan-700 px-2 py-0.5 rounded-full hover:bg-cyan-100">
                    + ${name}
                  </button>
                `).join('')}
              </div>
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-600">קישור לווידאו של האימון / המשחק:</label>
              <input type="url" id="w-video" value="${w.videoUrl || ''}" placeholder="https://..." class="w-full text-xs p-2 rounded-xl border border-slate-200 mt-1 bg-white" dir="ltr">
            </div>
          </div>
        ` : ''}

        ${isGym ? `
          <div class="bg-blue-50/70 border border-blue-200 p-3 rounded-2xl space-y-3">
            <div class="flex justify-between items-center">
              <h4 class="text-xs font-bold text-blue-800">🏋️‍♀️ תרגילי האימון</h4>
              <button type="button" onclick="app.addExerciseToWorkout()" class="text-[11px] bg-blue-600 text-white font-bold px-2 py-1 rounded-lg hover:bg-blue-700">
                + תרגיל
              </button>
            </div>

            <div class="bg-white p-2 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
              <span class="text-slate-500">טען מתבנית קבועה:</span>
              <select onchange="app.loadTemplateIntoCurrentWorkout(this.value)" class="p-1 rounded-lg border border-slate-200 text-xs font-bold text-blue-700 focus:outline-none">
                <option value="">בחרי תבנית...</option>
                ${app.templates.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
              </select>
            </div>

            <div class="space-y-2.5" id="workout-exercises-container">
              ${w.exercises.map((ex, exIdx) => `
                <div class="bg-white p-2.5 rounded-xl border border-blue-100 space-y-2">
                  <div class="flex items-center justify-between">
                    <input type="text" value="${ex.name}" onchange="app.updateExName(${exIdx}, this.value)" placeholder="שם התרגיל" class="text-xs font-bold text-slate-800 border-b border-slate-200 focus:border-blue-500 focus:outline-none p-1 flex-1 ml-2">
                    
                    <label class="text-[11px] text-slate-500 flex items-center gap-1 cursor-pointer ml-2">
                      <input type="checkbox" ${ex.isBodyweight ? 'checked' : ''} onchange="app.toggleExBodyweight(${exIdx}, this.checked)">
                      <span>משקל גוף</span>
                    </label>

                    <button type="button" onclick="app.removeExerciseFromWorkout(${exIdx})" class="text-slate-300 hover:text-red-500">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>

                  <div class="space-y-1">
                    <div class="grid grid-cols-12 gap-1 text-[10px] font-bold text-slate-400 text-center">
                      <span class="col-span-2">סט</span>
                      <span class="col-span-4">משקל (ק"ג)</span>
                      <span class="col-span-4">חזרות</span>
                      <span class="col-span-2">בוצע</span>
                    </div>
                    ${ex.sets.map((s, sIdx) => `
                      <div class="grid grid-cols-12 gap-1 items-center">
                        <span class="col-span-2 text-center text-xs font-bold text-slate-400">${s.setNum || (sIdx + 1)}</span>
                        <div class="col-span-4">
                          <input type="number" ${ex.isBodyweight ? 'disabled placeholder="-"' : `value="${s.weight}" placeholder="0"`} onchange="app.updateSetWeight(${exIdx}, ${sIdx}, this.value)" class="w-full text-center text-xs p-1 rounded-lg border border-slate-200 ${ex.isBodyweight ? 'bg-slate-100 text-slate-400' : ''}">
                        </div>
                        <div class="col-span-4">
                          <input type="number" value="${s.reps}" placeholder="10" onchange="app.updateSetReps(${exIdx}, ${sIdx}, this.value)" class="w-full text-center text-xs p-1 rounded-lg border border-slate-200">
                        </div>
                        <div class="col-span-2 text-center">
                          <input type="checkbox" ${s.done ? 'checked' : ''} onchange="app.updateSetDone(${exIdx}, ${sIdx}, this.checked)" class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500">
                        </div>
                      </div>
                    `).join('')}
                  </div>

                  <button type="button" onclick="app.addSetToExercise(${exIdx})" class="text-[10px] text-blue-600 font-bold hover:underline">
                    + הוסיפי סט
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      ` : `
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center text-xs text-amber-800">
          אימון זה ישמר כמתוכנן ביומן. כשתסיימי את האימון, תלחצי על כפתור ה-וי ✓ ותוכלי להזין בדיוק מה עשית או לבחור מאימון קיים!
        </div>
      `}

      <div>
        <label class="text-[11px] font-bold text-slate-600">הערות ודגשים</label>
        <textarea id="w-notes" rows="2" placeholder="דגשים לאימון..." class="w-full text-xs p-2 rounded-xl border border-slate-200 mt-1">${w.notes || ''}</textarea>
      </div>
    </div>

    <div class="p-3 border-t border-slate-100 flex gap-2 bg-slate-50">
      <button type="button" onclick="app.closeModal()" class="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition">
        ביטול
      </button>
      <button type="button" onclick="app.saveWorkoutFromForm()" class="flex-2 ${isPlanned ? 'bg-amber-500 hover:bg-amber-600' : 'bg-brand-600 hover:bg-brand-700'} text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow transition active:scale-95">
        ${isPlanned ? 'שמירת תכנון עתידי ⏳' : 'שמירת אימון ✨'}
      </button>
    </div>
  `;
}

function renderCompletePlannedModal() {
  const w = app.completingWorkout;
  const isGym = w.type === 'gym';
  const isVolleyball = w.type === 'volleyball';

  return `
    <div class="p-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🎉</span>
        <div>
          <h3 class="font-bold text-sm text-emerald-900">השלמת אימון מתוכנן!</h3>
          <p class="text-[11px] text-emerald-700">מה עשית באימון הזה? עדכני ושמרי</p>
        </div>
      </div>
      <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 p-1">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
      <div class="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <div>
          <label class="font-bold text-slate-700 block text-[11px]">משעה:</label>
          <input type="time" id="c-start-time" value="${w.startTime || '18:00'}" class="w-full p-1.5 rounded-lg border border-slate-200 mt-1 font-bold text-center">
        </div>
        <div>
          <label class="font-bold text-slate-700 block text-[11px]">עד שעה:</label>
          <input type="time" id="c-end-time" value="${w.endTime || '19:30'}" class="w-full p-1.5 rounded-lg border border-slate-200 mt-1 font-bold text-center">
        </div>
      </div>

      <!-- Quick Template Loader for Completing -->
      <div class="bg-emerald-50/80 p-2.5 rounded-2xl border border-emerald-200 flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
          <i data-lucide="clipboard-list" class="w-4 h-4 text-emerald-600"></i>
          <span>השלמה מתבנית קבועה:</span>
        </div>
        <select onchange="app.loadTemplateIntoCompleting(this.value)" class="p-1.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 bg-white focus:outline-none flex-1 max-w-[210px]">
          <option value="">בחרי תבנית מוכנה...</option>
          ${app.templates.map(t => {
            const sp = SPORT_CONFIGS[t.sport || 'gym']?.emoji || '📋';
            return `<option value="${t.id}">${sp} ${t.name}</option>`;
          }).join('')}
        </select>
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">איזה סוג אימון עשית?</label>
        <div class="grid grid-cols-3 gap-1.5">
          ${Object.values(SPORT_CONFIGS).filter(c => c.id !== 'planned').map(cfg => `
            <button type="button" onclick="app.changeCompletingWorkoutType('${cfg.id}')" class="p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${w.type === cfg.id ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-300' : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'}">
              <span class="text-base">${cfg.emoji}</span>
              <span>${cfg.name}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Custom Color Picker for Completing -->
      <div class="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
        <div class="flex items-center justify-between mb-1.5">
          <label class="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
            <span>🎨 בחרי צבע לאימון ביומן:</span>
          </label>
          <span class="text-[10px] text-slate-400 font-medium">בלחיצה אחת</span>
        </div>
        <div class="flex items-center gap-1.5 flex-wrap">
          ${WORKOUT_COLORS.map(c => {
            const isSelected = (w.color || getWorkoutColor(w)) === c.hex;
            return `
              <button
                type="button"
                onclick="app.setCompletingColor('${c.hex}')"
                class="w-7 h-7 rounded-full transition-all active:scale-90 flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110 shadow-sm' : 'hover:scale-105'}"
                style="background-color: ${c.hex};"
                title="${c.name}">
                ${isSelected ? '<i data-lucide="check" class="w-3.5 h-3.5 text-white stroke-[3]"></i>' : ''}
              </button>
            `;
          }).join('')}
          <label class="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 hover:border-emerald-500 flex items-center justify-center cursor-pointer relative bg-white" title="בחירת כל צבע אחר">
            <input type="color" value="${w.color || getWorkoutColor(w)}" onchange="app.setCompletingColor(this.value)" class="opacity-0 absolute inset-0 w-full h-full cursor-pointer">
            <i data-lucide="palette" class="w-3.5 h-3.5 text-slate-400"></i>
          </label>
        </div>
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">כותרת האימון</label>
        <input type="text" id="c-title" value="${w.title && w.title !== 'אימון מתוכנן' ? w.title : SPORT_CONFIGS[w.type]?.name || 'אימון'}" class="w-full p-2 rounded-xl border border-slate-200 font-bold">
      </div>

      ${isGym ? `
        <div class="bg-blue-50/70 border border-blue-200 p-3 rounded-2xl space-y-3">
          <div class="flex justify-between items-center">
            <h4 class="font-bold text-blue-900">תרגילי חדר כושר</h4>
            <button type="button" onclick="app.addExerciseToCompleting()" class="text-[11px] bg-blue-600 text-white font-bold px-2 py-1 rounded-lg">
              + תרגיל
            </button>
          </div>

          <div class="bg-white p-2 rounded-xl border border-blue-100 flex items-center justify-between">
            <span class="text-slate-500">טען מאימון קבוע (תבנית):</span>
            <select onchange="app.loadTemplateIntoCompleting(this.value)" class="p-1 rounded-lg border border-slate-200 text-xs font-bold text-blue-700">
              <option value="">בחרי תבנית שמורה...</option>
              ${app.templates.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
            </select>
          </div>

          <div class="space-y-2">
            ${w.exercises.map((ex, exIdx) => `
              <div class="bg-white p-2.5 rounded-xl border border-blue-100 space-y-2">
                <div class="flex items-center justify-between">
                  <input type="text" value="${ex.name}" onchange="app.updateCompletingExName(${exIdx}, this.value)" placeholder="שם התרגיל" class="font-bold border-b border-slate-200 p-1 flex-1 ml-2">
                  <label class="text-[10px] text-slate-500 flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" ${ex.isBodyweight ? 'checked' : ''} onchange="app.toggleCompletingExBodyweight(${exIdx}, this.checked)">
                    משקל גוף
                  </label>
                  <button type="button" onclick="app.removeExerciseFromCompleting(${exIdx})" class="text-slate-300 hover:text-red-500 mr-2">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>

                <div class="space-y-1">
                  ${ex.sets.map((s, sIdx) => `
                    <div class="grid grid-cols-12 gap-1 items-center">
                      <span class="col-span-2 text-center text-slate-400 font-bold">סט ${s.setNum || (sIdx + 1)}</span>
                      <div class="col-span-5">
                        <input type="number" ${ex.isBodyweight ? 'disabled placeholder="-"' : `value="${s.weight}" placeholder="ק\"ג"`} onchange="app.updateCompletingSetWeight(${exIdx}, ${sIdx}, this.value)" class="w-full text-center p-1 rounded border border-slate-200">
                      </div>
                      <div class="col-span-5">
                        <input type="number" value="${s.reps}" placeholder="חזרות" onchange="app.updateCompletingSetReps(${exIdx}, ${sIdx}, this.value)" class="w-full text-center p-1 rounded border border-slate-200">
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${isVolleyball ? `
        <div class="bg-cyan-50/70 border border-cyan-200 p-3 rounded-2xl space-y-3">
          <div>
            <label class="font-bold text-slate-600 block mb-1">עם מי שיחקת?</label>
            <input type="text" id="c-partner" value="${w.partner || ''}" placeholder="נועה, מאי, שירה..." class="w-full p-2 rounded-xl border border-slate-200 bg-white">
          </div>
          <div>
            <label class="font-bold text-slate-600 block mb-1">קישור לווידאו:</label>
            <input type="url" id="c-video" value="${w.videoUrl || ''}" placeholder="https://..." class="w-full p-2 rounded-xl border border-slate-200 bg-white" dir="ltr">
          </div>
        </div>
      ` : ''}

      <div>
        <label class="font-bold text-slate-600 block mb-1">הערות ודגשים לאימון</label>
        <textarea id="c-notes" rows="2" placeholder="איך הרגיש?..." class="w-full p-2 rounded-xl border border-slate-200">${w.notes || ''}</textarea>
      </div>
    </div>

    <div class="p-3 border-t border-slate-100 flex gap-2 bg-slate-50">
      <button onclick="app.closeModal()" class="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl">ביטול</button>
      <button onclick="app.saveCompletedPlannedWorkout()" class="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow transition active:scale-95 flex items-center justify-center gap-1.5">
        <i data-lucide="check" class="w-4 h-4"></i>
        שמרי אימון שהושלם ✓
      </button>
    </div>
  `;
}
