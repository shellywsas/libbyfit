// Modals Extra: Workout Detail, Templates, PRs, Backup

function renderWorkoutDetailModal() {
  const w = app.detailWorkout;
  const cfg = SPORT_CONFIGS[w.type] || SPORT_CONFIGS.other;
  const timeDisplay = formatWorkoutTime(w.startTime, w.endTime);

  return `
    <div class="p-4 border-b border-slate-100 flex items-center justify-between" style="background-color: ${cfg.lightBg};">
      <div class="flex items-center gap-2">
        <span class="text-2xl">${cfg.emoji}</span>
        <div>
          <h3 class="font-bold text-sm text-slate-800">${w.title || cfg.name}</h3>
          <span class="text-xs text-slate-500">${app.formatHebrewDate(w.date)} ${timeDisplay ? `• ⏰ ${timeDisplay}` : ''}</span>
        </div>
      </div>
      <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 p-1">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
      ${w.isPlanned ? `
        <div class="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
          <span class="font-bold text-amber-800">אימון זה מסומן כמתוכנן ⏳</span>
          <button onclick="app.completePlannedWorkout('${w.id}')" class="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-700">
            סמני כבוצע ✓
          </button>
        </div>
      ` : ''}

      ${w.partner ? `
        <div class="bg-cyan-50 border border-cyan-100 p-2.5 rounded-xl flex items-center gap-2">
          <i data-lucide="users" class="w-4 h-4 text-cyan-600"></i>
          <div>
            <span class="text-slate-400 text-[10px] block">שותפות לאימון:</span>
            <span class="font-bold text-cyan-800">${w.partner}</span>
          </div>
        </div>
      ` : ''}

      ${w.videoUrl ? `
        <div class="bg-red-50 border border-red-100 p-2.5 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="video" class="w-4 h-4 text-red-600"></i>
            <span class="font-bold text-red-800">סרטון וידאו מצורף</span>
          </div>
          <a href="${w.videoUrl}" target="_blank" class="bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-[11px] hover:bg-red-700">
            צפי בסרטון 🔗
          </a>
        </div>
      ` : ''}

      ${w.exercises && w.exercises.length > 0 ? `
        <div class="space-y-2">
          <h4 class="font-bold text-slate-700">תרגילים שבוצעו:</h4>
          ${w.exercises.map(ex => `
            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
              <div class="font-bold text-slate-800 flex justify-between">
                <span>${ex.name}</span>
                ${ex.isBodyweight ? '<span class="text-[10px] text-slate-400 font-normal">משקל גוף</span>' : ''}
              </div>
              <div class="grid grid-cols-3 gap-1 text-[11px] text-slate-600 pt-1">
                ${ex.sets.map(s => `
                  <div class="bg-white p-1 rounded border border-slate-100 text-center">
                    <span class="text-slate-400 text-[9px] block">סט ${s.setNum}</span>
                    <span class="font-bold">${ex.isBodyweight ? '' : (s.weight ? s.weight + ' ק"ג • ' : '')}${s.reps} חז'</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${w.notes ? `
        <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span class="text-slate-400 text-[10px] block font-bold">הערות:</span>
          <p class="text-slate-700 mt-0.5 leading-relaxed">${w.notes}</p>
        </div>
      ` : ''}

      <!-- Quick Change Workout Color -->
      <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="font-bold text-slate-700 text-[11px] flex items-center gap-1">
            <span>🎨 שינוי צבע האימון ביומן:</span>
          </span>
          <span class="text-[10px] text-slate-400">מתעדכן מיד</span>
        </div>
        <div class="flex items-center gap-1.5 flex-wrap">
          ${WORKOUT_COLORS.map(c => `
            <button
              type="button"
              onclick="app.updateWorkoutColorDirect('${w.id}', '${c.hex}')"
              class="w-6 h-6 rounded-full transition-all active:scale-90 flex items-center justify-center ${w.color === c.hex ? 'ring-2 ring-brand-500 scale-110 shadow-sm' : ''}"
              style="background-color: ${c.hex};"
              title="${c.name}">
              ${w.color === c.hex ? '<i data-lucide="check" class="w-3 h-3 text-white stroke-[3]"></i>' : ''}
            </button>
          `).join('')}
          <label class="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center cursor-pointer relative bg-white" title="בחירת צבע אישי">
            <input type="color" value="${w.color || getWorkoutColor(w)}" onchange="app.updateWorkoutColorDirect('${w.id}', this.value)" class="opacity-0 absolute inset-0 w-full h-full cursor-pointer">
            <i data-lucide="palette" class="w-3 h-3 text-slate-400"></i>
          </label>
        </div>
      </div>
    </div>

    <div class="p-3 border-t border-slate-100 flex justify-between bg-slate-50">
      <button onclick="app.deleteWorkout('${w.id}')" class="text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl text-xs font-bold transition">
        מחק אימון
      </button>
      <button onclick="app.closeModal()" class="bg-brand-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-brand-700">
        סגור
      </button>
    </div>
  `;
}

function renderTemplateFormModal() {
  const tmpl = app.editingTemplate;
  const currentSport = tmpl.sport || 'gym';
  const isGym = currentSport === 'gym';
  const isVolleyball = currentSport === 'volleyball';
  const isTennis = currentSport === 'tennis';
  const isPartnerSport = isVolleyball || isTennis;
  const cfg = SPORT_CONFIGS[currentSport] || SPORT_CONFIGS.other;
  const tColor = tmpl.color || cfg.accentColor;

  return `
    <div class="p-4 border-b border-slate-100 flex items-center justify-between" style="background-color: ${tColor}18;">
      <h3 class="font-bold text-sm flex items-center gap-1.5" style="color: ${tColor};">
        <span>📋 יצירת תבנית אימון קבועה (${cfg.emoji} ${cfg.name})</span>
      </h3>
      <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 p-1">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
      <!-- Sport Selector -->
      <div>
        <label class="font-bold text-slate-700 block mb-1">סוג הספורט עבור התבנית:</label>
        <div class="grid grid-cols-3 gap-1.5">
          ${Object.values(SPORT_CONFIGS).filter(c => c.id !== 'planned').map(c => `
            <button
              type="button"
              onclick="app.changeTemplateSport('${c.id}')"
              class="p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${currentSport === c.id ? 'shadow-xs ring-2 ring-brand-500 bg-brand-50 text-brand-700' : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'}">
              <span class="text-base">${c.emoji}</span>
              <span>${c.name}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Color Selector -->
      <div class="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
        <div class="flex items-center justify-between mb-1.5">
          <label class="text-[11px] font-bold text-slate-700">🎨 צבע התבנית ביומן:</label>
          <span class="text-[10px] text-slate-400">לבחירה מהירה</span>
        </div>
        <div class="flex items-center gap-1.5 flex-wrap">
          ${WORKOUT_COLORS.map(c => {
            const isSelected = tColor === c.hex;
            return `
              <button
                type="button"
                onclick="app.setTemplateColor('${c.hex}')"
                class="w-6 h-6 rounded-full transition-all active:scale-90 flex items-center justify-center ${isSelected ? 'ring-2 ring-brand-500 scale-110 shadow-sm' : ''}"
                style="background-color: ${c.hex};"
                title="${c.name}">
                ${isSelected ? '<i data-lucide="check" class="w-3 h-3 text-white stroke-[3]"></i>' : ''}
              </button>
            `;
          }).join('')}
          <label class="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center cursor-pointer relative bg-white" title="בחירת צבע אישי">
            <input type="color" value="${tColor}" onchange="app.setTemplateColor(this.value)" class="opacity-0 absolute inset-0 w-full h-full cursor-pointer">
            <i data-lucide="palette" class="w-3 h-3 text-slate-400"></i>
          </label>
        </div>
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">שם התבנית (למשל: אימון רגליים וניתור / משחק זוגות)</label>
        <input type="text" id="tmpl-name" value="${tmpl.name || ''}" placeholder="שם האימון..." class="w-full p-2 rounded-xl border border-slate-200 font-bold">
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">תיאור קצר או מטרת התבנית</label>
        <input type="text" id="tmpl-desc" value="${tmpl.description || ''}" placeholder="למשל: חיזוק ניתור, אימון סרבים, בולדרים בדירוג V4..." class="w-full p-2 rounded-xl border border-slate-200">
      </div>

      ${isPartnerSport ? `
        <div>
          <label class="font-bold text-slate-700 block mb-1">שותפות קבועות / הרכב (אופציונלי):</label>
          <input type="text" id="tmpl-partner" value="${tmpl.partner || ''}" placeholder="למשל: נועה, מאי, שירה" class="w-full p-2 rounded-xl border border-slate-200">
          <div class="flex flex-wrap gap-1 mt-1.5">
            <span class="text-[10px] text-slate-400 self-center">מהיר:</span>
            ${(app.recentTeammates || []).slice(0, 5).map(name => `
              <button type="button" onclick="app.addTeammateToTmplInput('${name}')" class="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full transition">
                + ${name}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div>
        <label class="font-bold text-slate-700 block mb-1">דגשים, תרגילים ומבנה האימון (הערות קבועות):</label>
        <textarea id="tmpl-notes" rows="2.5" placeholder="דגשים קבועים לאימון זה..." class="w-full p-2 rounded-xl border border-slate-200">${tmpl.notes || ''}</textarea>
      </div>

      ${isGym ? `
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <div class="flex justify-between items-center">
            <span class="font-bold text-slate-800">תרגילי חדר כושר מוגדרים מראש:</span>
            <button type="button" onclick="app.addExerciseToTemplate()" class="text-[11px] bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded-lg hover:bg-blue-100">
              + תרגיל נוסף
            </button>
          </div>

          ${(tmpl.exercises || []).map((ex, exIdx) => `
            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2">
              <div class="flex items-center justify-between gap-2">
                <input type="text" value="${ex.name}" onchange="app.updateTmplExName(${exIdx}, this.value)" placeholder="שם התרגיל" class="p-1.5 rounded-lg border border-slate-200 flex-1 font-bold">
                <label class="text-[10px] text-slate-500 flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" ${ex.isBodyweight ? 'checked' : ''} onchange="app.toggleTmplExBodyweight(${exIdx}, this.checked)">
                  משקל גוף
                </label>
                <button type="button" onclick="app.removeExerciseFromTemplate(${exIdx})" class="text-slate-300 hover:text-red-500">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>

              <div class="grid grid-cols-3 gap-2 text-[10px]">
                <div>
                  <span class="text-slate-400 block">מס' סטים</span>
                  <input type="number" value="${ex.defaultSets || 3}" onchange="app.updateTmplExField(${exIdx}, 'defaultSets', this.value)" class="w-full p-1 rounded border border-slate-200 text-center">
                </div>
                <div>
                  <span class="text-slate-400 block">חזרות לסט</span>
                  <input type="number" value="${ex.defaultReps || 10}" onchange="app.updateTmplExField(${exIdx}, 'defaultReps', this.value)" class="w-full p-1 rounded border border-slate-200 text-center">
                </div>
                <div>
                  <span class="text-slate-400 block">משקל יעד (ק"ג)</span>
                  <input type="number" ${ex.isBodyweight ? 'disabled placeholder="-"' : `value="${ex.defaultWeight || ''}"`} onchange="app.updateTmplExField(${exIdx}, 'defaultWeight', this.value)" class="w-full p-1 rounded border border-slate-200 text-center ${ex.isBodyweight ? 'bg-slate-200 text-slate-400' : ''}">
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>

    <div class="p-3 border-t border-slate-100 flex gap-2 bg-slate-50">
      <button onclick="app.closeModal()" class="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl">ביטול</button>
      <button onclick="app.saveTemplateFromForm()" class="flex-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow">שמירת תבנית ✨</button>
    </div>
  `;
}

function renderPRFormModal() {
  return `
    <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-amber-50">
      <h3 class="font-bold text-sm text-amber-900 flex items-center gap-1.5">
        <span>🏆 הוספת יעד / שיא חדש</span>
      </h3>
      <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 p-1">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="p-4 space-y-3 text-xs">
      <div>
        <label class="font-bold text-slate-700 block mb-1">שם התרגיל או השיא (למשל: סקוואט / ניתור אנכי)</label>
        <input type="text" id="new-pr-title" placeholder="למשל: היפ טראסט" class="w-full p-2 rounded-xl border border-slate-200 font-bold">
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="font-bold text-slate-700 block mb-1">יחידת מידה</label>
          <select id="new-pr-unit" class="w-full p-2 rounded-xl border border-slate-200">
            <option value='ק"ג'>ק"ג</option>
            <option value="חזרות">חזרות</option>
            <option value='ס"מ'>ס"מ</option>
            <option value="שניות">שניות</option>
            <option value="דקות">דקות</option>
          </select>
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">ערך השיא הנוכחי</label>
          <input type="number" step="0.5" id="new-pr-val" placeholder="50" class="w-full p-2 rounded-xl border border-slate-200 font-bold">
        </div>
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">הערה לשיא (אופציונלי)</label>
        <input type="text" id="new-pr-note" placeholder="למשל: עלה קל, 3 חזרות" class="w-full p-2 rounded-xl border border-slate-200">
      </div>
    </div>

    <div class="p-3 border-t border-slate-100 flex gap-2 bg-slate-50">
      <button onclick="app.closeModal()" class="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl">ביטול</button>
      <button onclick="app.saveNewPR()" class="flex-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow">שמירת שיא 🌟</button>
    </div>
  `;
}

function renderUpdatePRModal() {
  const pr = app.editingPR;
  return `
    <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-amber-50">
      <h3 class="font-bold text-sm text-amber-900 flex items-center gap-1.5">
        <span>🎉 שבירת שיא: ${pr.title}</span>
      </h3>
      <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 p-1">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="p-4 space-y-3 text-xs">
      <div class="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-center">
        <span class="text-slate-500 text-[11px] block">שיא קודם:</span>
        <span class="text-xl font-bold text-amber-700">${pr.currentPR} ${pr.unit}</span>
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">השיא החדש שלך! (${pr.unit})</label>
        <input type="number" step="0.5" id="update-pr-val" placeholder="${pr.currentPR + 2.5}" class="w-full p-2.5 rounded-xl border border-slate-200 text-center font-extrabold text-lg text-amber-600">
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">הערה / דגש לשבירת השיא</label>
        <input type="text" id="update-pr-note" placeholder="למשל: סקוואט עמוק, הרגיש מדהים!" class="w-full p-2 rounded-xl border border-slate-200">
      </div>
    </div>

    <div class="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50">
      <button type="button" onclick="app.deletePR('${pr.id}')" class="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95">
        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        <span>מחק שיא</span>
      </button>
      <div class="flex gap-2">
        <button type="button" onclick="app.closeModal()" class="py-2 px-3 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl">ביטול</button>
        <button type="button" onclick="app.saveUpdatedPR()" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow transition active:scale-95">עדכני שיא! 👑</button>
      </div>
    </div>
  `;
}

function renderBackupModal() {
  return `
    <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-brand-50">
      <h3 class="font-bold text-sm text-brand-900 flex items-center gap-1.5">
        <span>🛡️ שמירת נתונים, גיבוי והתקנה</span>
      </h3>
      <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 p-1">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="p-4 space-y-4 text-xs overflow-y-auto max-h-[70vh]">
      <div class="bg-cyan-50/70 border border-cyan-200 p-3 rounded-2xl space-y-2">
        <h4 class="font-bold text-cyan-900 flex items-center gap-1.5">
          <span>📱 איך להתקין כאפליקציה בטלפון?</span>
        </h4>
        <ol class="list-decimal list-inside space-y-1 text-cyan-800 text-[11px] leading-relaxed">
          <li>פתחי את האתר בדפדפן <strong>Chrome</strong> בטלפון שלך.</li>
          <li>לחצי על <strong>שלוש הנקודות (⋮)</strong> בפינה למעלה.</li>
          <li>בחרי באפשרות <strong>"הוסף למסך הבית"</strong> (או "התקן אפליקציה").</li>
          <li>זהו! LibiFit תופיע כאפליקציה רגילה עם האייקון שלך במסך הבית 🏐🏋️‍♀️🎾🧗‍♀️</li>
        </ol>
      </div>

      <div class="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-2">
        <h4 class="font-bold text-slate-800 flex items-center gap-1.5">
          <i data-lucide="download" class="w-4 h-4 text-brand-500"></i>
          <span>גיבוי קובץ (שלא ימחק לעולם!)</span>
        </h4>
        <p class="text-slate-500 text-[11px]">הורידי קובץ גיבוי של כל האימונים, התבניות והשיאים שלך. תוכלי לשלוח אותו לעצמך בוואטסאפ או לשמור בדרייב.</p>
        <button onclick="app.exportBackup()" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition">
          <i data-lucide="download" class="w-3.5 h-3.5"></i>
          הורידי קובץ גיבוי (JSON)
        </button>
      </div>

      <div class="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-2">
        <h4 class="font-bold text-slate-800 flex items-center gap-1.5">
          <i data-lucide="upload" class="w-4 h-4 text-emerald-500"></i>
          <span>שחזור נתונים מקובץ גיבוי</span>
        </h4>
        <p class="text-slate-500 text-[11px]">עברת טלפון? בחרי קובץ גיבוי קודם וכל הנתונים ישוחזרו מיידית.</p>
        <label class="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition">
          <i data-lucide="file-up" class="w-3.5 h-3.5"></i>
          בחרי קובץ גיבוי לשחזור
          <input type="file" accept=".json" onchange="app.importBackup(event)" class="hidden">
        </label>
      </div>
    </div>

    <div class="p-3 border-t border-slate-100 flex justify-end bg-slate-50">
      <button onclick="app.closeModal()" class="bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs">
        סגור
      </button>
    </div>
  `;
}

function renderInstallGuideModal() {
  return `
    <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-l from-brand-600 via-sky-500 to-cyan-500 text-white">
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-xl bg-white/20 p-1 flex items-center justify-center border border-white/30 shadow-inner">
          <img src="./app-logo.png" alt="LibiFit" class="w-full h-full object-contain drop-shadow">
        </div>
        <div>
          <h3 class="font-bold text-sm font-display">התקנת LibiFit בטלפון</h3>
          <p class="text-[11px] text-brand-100">אפליקציה מלאה במסך הבית ✨</p>
        </div>
      </div>
      <button onclick="app.closeModal()" class="text-white/80 hover:text-white p-1">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
      <div class="text-center p-3 bg-gradient-to-br from-brand-50 to-cyan-50 rounded-2xl border border-brand-200 space-y-2">
        <div class="w-16 h-16 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-white">
          <img src="./app-logo.png" alt="Logo" class="w-full h-full object-cover">
        </div>
        <h4 class="font-bold text-sm text-brand-900">LibiFit - יומן האימונים של ליבי</h4>
        <p class="text-[11px] text-brand-700">עובד חלק כמו אפליקציה מחנות האפליקציות, שומר נתונים ועובד גם ללא קליטה!</p>
      </div>

      <!-- If prompt is ready, offer 1-click install button -->
      ${window.deferredInstallPrompt ? `
        <button onclick="app.triggerNativeInstall()" class="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold py-3 px-4 rounded-2xl shadow-md text-sm flex items-center justify-center gap-2 transition">
          <i data-lucide="download" class="w-5 h-5 stroke-[2.5]"></i>
          <span>לחצי כאן להתקנה מיידית! 📲</span>
        </button>
      ` : ''}

      <!-- WhatsApp Warning & Fix -->
      <div class="bg-amber-50 border border-amber-200 p-3 rounded-2xl space-y-1.5">
        <div class="flex items-center gap-1.5 text-amber-900 font-bold">
          <span>⚠️ הגעת מקישור בוואטסאפ (WhatsApp)?</span>
        </div>
        <p class="text-[11px] text-amber-800 leading-relaxed">
          וואטסאפ פותח אתרים בתוך דפדפן פנימי סגור שחוסם התקנת אפליקציות.<br>
          <b>הפתרון הפשוט:</b> לחצי על <b>3 הנקודות (⋮)</b> בפינה העליונה ובחרי <b>"פתח בדפדפן" / "פתח ב-Chrome"</b>!
        </p>
      </div>

      <!-- Android Chrome Instructions -->
      <div class="bg-sky-50 border border-sky-200 p-3 rounded-2xl space-y-2">
        <div class="flex items-center gap-1.5 text-sky-900 font-bold">
          <i data-lucide="smartphone" class="w-4 h-4 text-sky-600"></i>
          <span>התקנה ב-Android בדפדפן Chrome:</span>
        </div>
        <ol class="list-decimal list-inside space-y-1 text-sky-800 text-[11px] font-medium leading-relaxed pr-1">
          <li>פתחי את האתר בדפדפן <b>Chrome</b>.</li>
          <li>לחצי על <b>3 הנקודות (⋮)</b> בפינה העליונה.</li>
          <li>בחרי באפשרות <b>"הוספה למסך הבית" (Add to Home screen)</b> או <b>"התקנת אפליקציה"</b>.</li>
          <li>אשרי - והאפליקציה תופיע במסך הבית עם האייקון החדש! 🎉</li>
        </ol>
      </div>

      <!-- iPhone Safari Instructions -->
      <div class="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-2">
        <div class="flex items-center gap-1.5 text-slate-800 font-bold">
          <i data-lucide="apple" class="w-4 h-4 text-slate-700"></i>
          <span>התקנה ב-iPhone (Safari):</span>
        </div>
        <ol class="list-decimal list-inside space-y-1 text-slate-600 text-[11px] pr-1">
          <li>פתחי את האתר בדפדפן <b>Safari</b>.</li>
          <li>לחצי על כפתור השיתוף בתחתית המסך (ריבוע עם חץ עולה ⬆️).</li>
          <li>גללי ובחרי <b>"הוסף למסך הבית"</b> (Add to Home Screen).</li>
        </ol>
      </div>
    </div>

    <div class="p-3 border-t border-slate-100 flex justify-end bg-slate-50">
      <button onclick="app.closeModal()" class="w-full bg-brand-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-brand-700 transition">
        הבנתי, תודה!
      </button>
    </div>
  `;
}

