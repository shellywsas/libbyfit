// LibiFit Data & Config
const DEFAULT_TEMPLATES = [
  {
    id: 'tmpl-1',
    name: 'רגליים וניתור לכדורעף',
    sport: 'gym',
    category: 'חדר כושר',
    color: '#2563EB',
    description: 'סקוואט, היפ טראסט וקפיצות פליאומטריות לשיפור הניתור והעוצמה במגרש',
    exercises: [
      { name: 'סקוואט עם מוט', isBodyweight: false, defaultSets: 4, defaultReps: 8, defaultWeight: 40 },
      { name: 'היפ טראסט', isBodyweight: false, defaultSets: 4, defaultReps: 8, defaultWeight: 50 },
      { name: 'קפיצות בוקס (Box Jumps)', isBodyweight: true, defaultSets: 3, defaultReps: 8, defaultWeight: 0 },
      { name: 'לאנג\'ים בהליכה עם משקולות', isBodyweight: false, defaultSets: 3, defaultReps: 12, defaultWeight: 10 }
    ]
  },
  {
    id: 'tmpl-2',
    name: 'פלג גוף עליון וליבה',
    sport: 'gym',
    category: 'חדר כושר',
    color: '#2563EB',
    description: 'חיזוק כתפיים, גב, חזה ושרירי ליבה לשליטה בחבטות ובחסימות',
    exercises: [
      { name: 'מתח / מתח בגרביטון', isBodyweight: true, defaultSets: 3, defaultReps: 6, defaultWeight: 0 },
      { name: 'לחיצת חזה בדמבלים', isBodyweight: false, defaultSets: 4, defaultReps: 8, defaultWeight: 12 },
      { name: 'לחיצת כתפיים בישיבה', isBodyweight: false, defaultSets: 3, defaultReps: 8, defaultWeight: 8 },
      { name: 'פלאנק סטטי (שניות)', isBodyweight: true, defaultSets: 3, defaultReps: 45, defaultWeight: 0 }
    ]
  },
  {
    id: 'tmpl-3',
    name: 'אימון כוח כללי (Full Body)',
    sport: 'gym',
    category: 'חדר כושר',
    color: '#2563EB',
    description: 'אימון מאוזן לכל הגוף לשמירה על כושר וחוזק',
    exercises: [
      { name: 'סקוואט גובלט', isBodyweight: false, defaultSets: 3, defaultReps: 12, defaultWeight: 14 },
      { name: 'שכיבות סמיכה', isBodyweight: true, defaultSets: 3, defaultReps: 12, defaultWeight: 0 },
      { name: 'חתירה בדמבלים לגב', isBodyweight: false, defaultSets: 3, defaultReps: 8, defaultWeight: 10 },
      { name: 'הרמות רגליים לבטן', isBodyweight: true, defaultSets: 3, defaultReps: 15, defaultWeight: 0 }
    ]
  },
  {
    id: 'tmpl-4',
    name: 'אימון כדורעף - טכניקה וקבלות',
    sport: 'volleyball',
    category: 'כדורעף',
    color: '#06B6D4',
    partner: 'נועה, מאי',
    description: 'קבלות תחתית, הנחתות מהירות, סרבים ותרגול הגנה קבוצתית',
    notes: 'דגש על מעבר מהיר מהגנה להתקפה, עבודה על סרב קופץ יציב',
    exercises: []
  },
  {
    id: 'tmpl-5',
    name: 'משחק כדורעף - 6 על 6',
    sport: 'volleyball',
    category: 'כדורעף',
    color: '#06B6D4',
    partner: 'שירה, עמית, דניאל',
    description: 'משחק אימון מלא, טקטיקת חסימה ותיאום חבטות',
    notes: 'משחק 3 מערכות מלאות',
    exercises: []
  },
  {
    id: 'tmpl-6',
    name: 'בולדרינג אינטנסיבי',
    sport: 'climbing',
    category: 'טיפוס',
    color: '#10B981',
    description: 'פרויקטים ומסלולי בולדרינג, חיזוק אחיזות קרימפ ופלאש',
    notes: 'חימום יסודי באצבעות, עבודה על זוויות חיוביות ושיפועים',
    exercises: []
  },
  {
    id: 'tmpl-7',
    name: 'אימון טניס - סרבים ומשחק רשת',
    sport: 'tennis',
    category: 'טניס',
    color: '#84CC16',
    partner: 'עמית',
    description: 'הגשות ראשונות ושניות, וולי ליד הרשת וחבטות כף יד עמוקות',
    notes: 'עבודה על עבודת רגליים מהירה ותנועה לפינות המגרש',
    exercises: []
  },
  {
    id: 'tmpl-8',
    name: 'ריצת אינטרוולים (הפוגות)',
    sport: 'running',
    category: 'ריצה',
    color: '#8B5CF6',
    description: 'אימון מהירות וסיבולת לב-ריאה לשיפור הזריזות במגרש',
    notes: '10 דק חימום, 8 ספרינטים של 400 מ\' עם דקה מנוחה ביניהם, שחרור',
    exercises: []
  },
  {
    id: 'tmpl-9',
    name: 'פילאטיס מזרן והתאוששות',
    sport: 'pilates',
    category: 'פילאטיס',
    color: '#EC4899',
    description: 'חיזוק שרירי ליבה עמוקים, גמישות ושחרור עומסים אחרי אימונים',
    notes: 'דגש על נשימות, פתיחת בית חזה ומתיחות לשרירי הרגליים והגב',
    exercises: []
  }
];

const DEFAULT_PRS = [
  {
    id: 'pr-1',
    title: 'שיא מתח',
    category: 'משקל גוף',
    unit: 'חזרות',
    currentPR: 8,
    history: [
      { date: '2026-08-10', value: 5, note: 'התחלה עם גרביטון' },
      { date: '2026-09-12', value: 8, note: 'מתח חופשי נקי!' }
    ]
  },
  {
    id: 'pr-2',
    title: 'סקוואט עם מוט',
    category: 'חדר כושר',
    unit: 'ק"ג',
    currentPR: 55,
    history: [
      { date: '2026-07-20', value: 45, note: 'טכניקה טובה' },
      { date: '2026-09-05', value: 55, note: '3 חזרות מלאות!' }
    ]
  },
  {
    id: 'pr-3',
    title: 'היפ טראסט',
    category: 'חדר כושר',
    unit: 'ק"ג',
    currentPR: 75,
    history: [
      { date: '2026-08-15', value: 65, note: 'עם ספוג למוט' },
      { date: '2026-09-18', value: 75, note: 'חזקה ברמות!' }
    ]
  },
  {
    id: 'pr-4',
    title: 'דדליפט',
    category: 'חדר כושר',
    unit: 'ק"ג',
    currentPR: 60,
    history: [
      { date: '2026-08-01', value: 50, note: 'עבודה על גב ישר' },
      { date: '2026-09-15', value: 60, note: 'עלה קליל' }
    ]
  },
  {
    id: 'pr-5',
    title: 'ניתור אנכי (Touch)',
    category: 'כדורעף',
    unit: 'ס"מ',
    currentPR: 52,
    history: [
      { date: '2026-06-10', value: 47, note: 'מדידה בתחילת עונה' },
      { date: '2026-09-01', value: 52, note: 'שיפור ניכר בזכות הפליאומטריה' }
    ]
  },
  {
    id: 'pr-6',
    title: 'ריצת מרחק רציפה',
    category: 'אירובי וריצה',
    unit: 'ק"מ',
    currentPR: 10,
    history: [
      { date: '2026-08-12', value: 7.5, note: 'קצב קל בפארק' },
      { date: '2026-09-18', value: 10, note: '10 קילומטרים ראשונים!' }
    ]
  },
  {
    id: 'pr-7',
    title: 'ספרינט מהיר',
    category: 'אירובי וריצה',
    unit: 'מטרים',
    currentPR: 400,
    history: [
      { date: '2026-08-20', value: 200, note: 'אינטרוולים' },
      { date: '2026-09-10', value: 400, note: 'ספרינט מלא' }
    ]
  }
];

const SPORT_CONFIGS = {
  volleyball: {
    id: 'volleyball',
    name: 'כדורעף',
    emoji: '🏐',
    badgeClass: 'bg-cyan-500 text-white',
    lightBg: '#ECFEFF',
    accentColor: '#06B6D4'
  },
  gym: {
    id: 'gym',
    name: 'חדר כושר',
    emoji: '🏋️‍♀️',
    badgeClass: 'bg-blue-600 text-white',
    lightBg: '#EFF6FF',
    accentColor: '#2563EB'
  },
  climbing: {
    id: 'climbing',
    name: 'טיפוס',
    emoji: '🧗‍♀️',
    badgeClass: 'bg-emerald-500 text-white',
    lightBg: '#ECFDF5',
    accentColor: '#10B981'
  },
  tennis: {
    id: 'tennis',
    name: 'טניס',
    emoji: '🎾',
    badgeClass: 'bg-lime-600 text-white',
    lightBg: '#F7FEE7',
    accentColor: '#65A30D'
  },
  running: {
    id: 'running',
    name: 'ריצה / אירובי',
    emoji: '🏃‍♀️',
    badgeClass: 'bg-violet-500 text-white',
    lightBg: '#F5F3FF',
    accentColor: '#8B5CF6'
  },
  pilates: {
    id: 'pilates',
    name: 'פילאטיס / יוגה',
    emoji: '🧘‍♀️',
    badgeClass: 'bg-pink-500 text-white',
    lightBg: '#FDF2F8',
    accentColor: '#EC4899'
  },
  planned: {
    id: 'planned',
    name: 'מתוכנן',
    emoji: '⏳',
    badgeClass: 'bg-amber-500 text-white',
    lightBg: '#FFFBEB',
    accentColor: '#F59E0B'
  },
  other: {
    id: 'other',
    name: 'ספורט אחר',
    emoji: '⭐',
    badgeClass: 'bg-sky-500 text-white',
    lightBg: '#F0F9FF',
    accentColor: '#0EA5E9'
  }
};

function getAllSportsMap(customSports = []) {
  const map = { ...SPORT_CONFIGS };
  if (Array.isArray(customSports)) {
    customSports.forEach(cs => {
      if (cs && cs.id) {
        map[cs.id] = {
          id: cs.id,
          name: cs.name,
          emoji: cs.emoji || '⭐',
          badgeClass: cs.badgeClass || 'bg-brand-600 text-white',
          lightBg: cs.lightBg || '#F0F9FF',
          accentColor: cs.accentColor || '#0284C7',
          isCustom: true
        };
      }
    });
  }
  return map;
}

function getAllSportsList(customSports = []) {
  const map = getAllSportsMap(customSports);
  return Object.values(map).filter(s => s.id !== 'planned');
}

// 10 Distinct Vibrant Color Palette for Energy / Mood
const SCORE_SCALE = [
  { val: 1, color: '#DC2626', bgClass: 'bg-red-600', textClass: 'text-red-700', label: 'מותשת / ירוד מאוד' },
  { val: 2, color: '#EF4444', bgClass: 'bg-red-500', textClass: 'text-red-600', label: 'עייפות כבדה / מצב רוח נמוך' },
  { val: 3, color: '#EA580C', bgClass: 'bg-orange-600', textClass: 'text-orange-700', label: 'עייפה / חלשה' },
  { val: 4, color: '#F97316', bgClass: 'bg-orange-500', textClass: 'text-orange-600', label: 'קצת עייפה' },
  { val: 5, color: '#EAB308', bgClass: 'bg-yellow-500', textClass: 'text-yellow-700', label: 'סבבה / בינוני' },
  { val: 6, color: '#84CC16', bgClass: 'bg-lime-500', textClass: 'text-lime-700', label: 'סבבה לגמרי' },
  { val: 7, color: '#22C55E', bgClass: 'bg-green-500', textClass: 'text-green-700', label: 'אנרגיה טובה ומרוממת' },
  { val: 8, color: '#14B8A6', bgClass: 'bg-teal-500', textClass: 'text-teal-700', label: 'ערנית ומלאת כוח' },
  { val: 9, color: '#06B6D4', bgClass: 'bg-cyan-500', textClass: 'text-cyan-700', label: 'אנרגיית שיא!' },
  { val: 10, color: '#0284C7', bgClass: 'bg-sky-600', textClass: 'text-sky-700', label: 'בעננים, עוצמה מקסימלית! 🚀' }
];

// 10 Distinct Vibrant Color Palette for Stress (1 = calm, 10 = max stress)
const STRESS_SCALE = [
  { val: 1, color: '#0EA5E9', label: 'רוגע ושלווה מוחלטת 🧘‍♀️' },
  { val: 2, color: '#06B6D4', label: 'רגועה מאוד ושקטה' },
  { val: 3, color: '#14B8A6', label: 'נינוחה ורגועה' },
  { val: 4, color: '#22C55E', label: 'הכל תחת שליטה' },
  { val: 5, color: '#84CC16', label: 'עומס קל / נורמלי' },
  { val: 6, color: '#EAB308', label: 'קצת לחץ מורגש' },
  { val: 7, color: '#F97316', label: 'לחץ מורגש למדי' },
  { val: 8, color: '#EA580C', label: 'סטרס גבוה' },
  { val: 9, color: '#EF4444', label: 'סטרס כבד ועומס' },
  { val: 10, color: '#DC2626', label: 'סטרס ולחץ שיא! 🤯' }
];

function getScoreItem(val) {
  const num = parseInt(val) || 5;
  return SCORE_SCALE.find(s => s.val === num) || SCORE_SCALE[4];
}

function getStressItem(val) {
  const num = parseInt(val) || 3;
  return STRESS_SCALE.find(s => s.val === num) || STRESS_SCALE[2];
}

// Format time range & duration
function formatWorkoutTime(startTime, endTime) {
  if (!startTime) return '';
  if (!endTime) return startTime;

  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let totalMin = (eh * 60 + em) - (sh * 60 + sm);
  if (totalMin < 0) totalMin += 24 * 60; // if cross midnight

  let durationText = '';
  if (totalMin === 60) {
    durationText = 'שעה';
  } else if (totalMin === 90) {
    durationText = 'שעה וחצי';
  } else if (totalMin === 120) {
    durationText = 'שעתיים';
  } else if (totalMin > 60) {
    const hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    durationText = `${hours} ש' ${mins > 0 ? mins + " דק'" : ''}`;
  } else if (totalMin > 0) {
    durationText = `${totalMin} דק'`;
  }

  return `${startTime} - ${endTime} ${durationText ? `(${durationText})` : ''}`;
}

// Preset Workout Palette for Custom Colors
const WORKOUT_COLORS = [
  { name: 'טורקיז בוהק', hex: '#06B6D4' },
  { name: 'תכלת שמיים', hex: '#0284C7' },
  { name: 'כחול עמוק', hex: '#2563EB' },
  { name: 'ירוק מנטה', hex: '#10B981' },
  { name: 'ירוק ליים', hex: '#84CC16' },
  { name: 'סגול לבנדר', hex: '#8B5CF6' },
  { name: 'ורוד פוקסיה', hex: '#EC4899' },
  { name: 'קורל כתום', hex: '#F97316' },
  { name: 'צהוב זהב', hex: '#EAB308' },
  { name: 'אדום אנרגטי', hex: '#EF4444' }
];

function getWorkoutColor(w) {
  if (!w) return '#0284C7';
  if (w.color) return w.color;
  if (w.isPlanned) return '#F59E0B';
  const customList = (typeof window !== 'undefined' && window.app && window.app.customSports) ? window.app.customSports : [];
  const sportsMap = getAllSportsMap(customList);
  const cfg = sportsMap[w.type];
  return cfg ? cfg.accentColor : '#0EA5E9';
}

function getWorkoutVideoUrls(w) {
  if (!w) return [];
  if (Array.isArray(w.videoUrls)) {
    return w.videoUrls.map(u => (u || '').trim()).filter(Boolean);
  }
  if (w.videoUrl && typeof w.videoUrl === 'string' && w.videoUrl.trim()) {
    return [w.videoUrl.trim()];
  }
  return [];
}
