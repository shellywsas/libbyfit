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

  return `
    <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-blue-50">
      <h3 class="font-bold text-sm text-blue-900 flex items-center gap-1.5">
        <span>📋 יצירת תבנית אימון קבועה</span>
      </h3>
      <button onclick="app.closeModal()" class="text-slate-400 hover:text-slate-600 p-1">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
      <div>
        <label class="font-bold text-slate-700 block mb-1">שם התבנית (למשל: אימון רגליים וניתור)</label>
        <input type="text" id="tmpl-name" value="${tmpl.name}" placeholder="שם האימון..." class="w-full p-2 rounded-xl border border-slate-200">
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">תיאור קצר או מטרה</label>
        <input type="text" id="tmpl-desc" value="${tmpl.description}" placeholder="למשל: חיזוק ניתור והנחתות..." class="w-full p-2 rounded-xl border border-slate-200">
      </div>

      <div class="space-y-2 pt-2 border-t border-slate-100">
        <div class="flex justify-between items-center">
          <span class="font-bold text-slate-800">תרגילים מוגדרים מראש:</span>
          <button type="button" onclick="app.addExerciseToTemplate()" class="text-[11px] bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded-lg hover:bg-blue-100">
            + תרגיל נוסף
          </button>
        </div>

        ${tmpl.exercises.map((ex, exIdx) => `
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
                <input type="number" value="${ex.defaultSets}" onchange="app.updateTmplExField(${exIdx}, 'defaultSets', this.value)" class="w-full p-1 rounded border border-slate-200 text-center">
              </div>
              <div>
                <span class="text-slate-400 block">חזרות לסט</span>
                <input type="number" value="${ex.defaultReps}" onchange="app.updateTmplExField(${exIdx}, 'defaultReps', this.value)" class="w-full p-1 rounded border border-slate-200 text-center">
              </div>
              <div>
                <span class="text-slate-400 block">משקל יעד (ק"ג)</span>
                <input type="number" ${ex.isBodyweight ? 'disabled placeholder="-"' : `value="${ex.defaultWeight}"`} onchange="app.updateTmplExField(${exIdx}, 'defaultWeight', this.value)" class="w-full p-1 rounded border border-slate-200 text-center ${ex.isBodyweight ? 'bg-slate-200 text-slate-400' : ''}">
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="p-3 border-t border-slate-100 flex gap-2 bg-slate-50">
      <button onclick="app.closeModal()" class="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl">ביטול</button>
      <button onclick="app.saveTemplateFromForm()" class="flex-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow">שמירת תבנית ✨</button>
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

    <div class="p-3 border-t border-slate-100 flex gap-2 bg-slate-50">
      <button onclick="app.closeModal()" class="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl">ביטול</button>
      <button onclick="app.saveUpdatedPR()" class="flex-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow">עדכני שיא חדש! 👑</button>
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
          <li>זהו! LibbyFit תופיע כאפליקציה רגילה עם האייקון שלך במסך הבית 🏐🏋️‍♀️🎾🧗‍♀️</li>
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
