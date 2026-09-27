// LibbyFit Data & Config
const DEFAULT_TEMPLATES = [
  {
    id: 'tmpl-1',
    name: 'רגליים וניתור לכדורעף',
    category: 'כוח וניתור',
    description: 'סקוואט, היפ טראסט וקפיצות פליאומטריות לשיפור הניתור והעוצמה במגרש',
    exercises: [
      { name: 'סקוואט עם מוט', isBodyweight: false, defaultSets: 4, defaultReps: 8, defaultWeight: 40 },
      { name: 'היפ טראסט', isBodyweight: false, defaultSets: 4, defaultReps: 10, defaultWeight: 50 },
      { name: 'קפיצות בוקס (Box Jumps)', isBodyweight: true, defaultSets: 3, defaultReps: 10, defaultWeight: 0 },
      { name: 'לאנג\'ים בהליכה עם משקולות', isBodyweight: false, defaultSets: 3, defaultReps: 12, defaultWeight: 10 }
    ]
  },
  {
    id: 'tmpl-2',
    name: 'פלג גוף עליון וליבה',
    category: 'כוח עליון',
    description: 'חיזוק כתפיים, גב, חזה ושרירי ליבה לשליטה בחבטות ובחסימות',
    exercises: [
      { name: 'מתח / מתח בגרביטון', isBodyweight: true, defaultSets: 3, defaultReps: 6, defaultWeight: 0 },
      { name: 'לחיצת חזה בדמבלים', isBodyweight: false, defaultSets: 4, defaultReps: 10, defaultWeight: 12 },
      { name: 'לחיצת כתפיים בישיבה', isBodyweight: false, defaultSets: 3, defaultReps: 10, defaultWeight: 8 },
      { name: 'פלאנק סטטי (שניות)', isBodyweight: true, defaultSets: 3, defaultReps: 45, defaultWeight: 0 }
    ]
  },
  {
    id: 'tmpl-3',
    name: 'אימון כוח כללי (Full Body)',
    category: 'כללי',
    description: 'אימון מאוזן לכל הגוף לשמירה על כושר וחוזק',
    exercises: [
      { name: 'סקוואט גובלט', isBodyweight: false, defaultSets: 3, defaultReps: 12, defaultWeight: 14 },
      { name: 'שכיבות סמיכה', isBodyweight: true, defaultSets: 3, defaultReps: 12, defaultWeight: 0 },
      { name: 'חתירה בדמבלים לגב', isBodyweight: false, defaultSets: 3, defaultReps: 10, defaultWeight: 10 },
      { name: 'הרמות רגליים לבטן', isBodyweight: true, defaultSets: 3, defaultReps: 15, defaultWeight: 0 }
    ]
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
  other: {
    id: 'other',
    name: 'ספורט אחר',
    emoji: '⭐',
    badgeClass: 'bg-sky-500 text-white',
    lightBg: '#F0F9FF',
    accentColor: '#0EA5E9'
  }
};
