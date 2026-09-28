// Firebase Realtime Database Service for LibiFit (Username & Password only - No email required!)

const firebaseConfig = {
  apiKey: "AIzaSyBrOrQAinqDgYtv6QwCot6xlR8MsYAa0kc",
  authDomain: "libifit-e9777.firebaseapp.com",
  databaseURL: "https://libifit-e9777-default-rtdb.firebaseio.com",
  projectId: "libifit-e9777",
  storageBucket: "libifit-e9777.firebasestorage.app",
  messagingSenderId: "367037311107",
  appId: "1:367037311107:web:884e8631c21cbd3fdd53b6"
};

class FirebaseService {
  constructor() {
    this.initialized = false;
    this.db = null;
    this.currentUser = null; // { username: 'ליבי', key: 'ליבי' }
    this.userRef = null;
    this.isSyncing = false;
    this.init();
  }

  // Convert username to a safe database key (Hebrew and English friendly)
  toUserKey(name) {
    if (!name) return '';
    return name.trim().toLowerCase().replace(/[.#$\[\]\/]/g, '_');
  }

  init() {
    try {
      if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        this.db = firebase.database();
        this.initialized = true;

        // Auto-login from saved credentials on device
        const saved = localStorage.getItem('libi_cloud_user');
        if (saved) {
          try {
            const userObj = JSON.parse(saved);
            if (userObj && userObj.key) {
              this.connectUser(userObj.key, userObj.username);
            }
          } catch (e) {
            console.warn('Auto-login error:', e);
          }
        }
      }
    } catch (e) {
      console.error('Firebase initialization error:', e);
    }
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  getUserName() {
    if (this.currentUser && this.currentUser.username) {
      return this.currentUser.username;
    }
    return localStorage.getItem('libi_username') || 'ליבי';
  }

  // Connect active session to user node and listen for realtime updates
  connectUser(userKey, displayName) {
    if (!this.db) return;
    this.currentUser = { username: displayName, key: userKey };
    localStorage.setItem('libi_cloud_user', JSON.stringify(this.currentUser));
    localStorage.setItem('libi_username', displayName);

    if (this.userRef) {
      this.userRef.off();
    }

    this.userRef = this.db.ref('users/' + userKey);

    // Listen to real-time changes across devices
    this.userRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      if (data.username && this.currentUser) {
        this.currentUser.username = data.username;
        localStorage.setItem('libi_username', data.username);
      }

      if (window.app && data.updatedBySession !== window.app.sessionId) {
        if (data.workouts) window.app.workouts = data.workouts;
        if (data.templates) window.app.templates = data.templates;
        if (data.recoveryLogs) window.app.recoveryLogs = data.recoveryLogs;
        if (data.personalRecords) window.app.personalRecords = data.personalRecords;
        if (data.teammates) window.app.recentTeammates = data.teammates;
        if (data.customSports) window.app.customSports = data.customSports;

        window.app.saveStateLocally();
        window.app.render();
      }
    });

    if (window.app) {
      window.app.render();
    }
  }

  // Register a new user with username and password
  async register(username, password) {
    if (!this.initialized || !this.db) {
      throw new Error('החיבור לענן אינו זמין כרגע. נסי שוב בעוד מספר שניות.');
    }

    const cleanName = (username || '').trim();
    const cleanPass = (password || '').trim();
    const userKey = this.toUserKey(cleanName);

    if (!cleanName) throw new Error('נא להזין שם משתמש!');
    if (!cleanPass) throw new Error('נא להזין סיסמה!');

    const snap = await this.db.ref('users/' + userKey).once('value');
    if (snap.exists()) {
      throw new Error('שם המשתמש כבר תפוס! אם זה החשבון שלך, עברי ללשונית "התחברות".');
    }

    const workouts = (window.app && window.app.workouts) ? window.app.workouts : [];
    const templates = (window.app && window.app.templates) ? window.app.templates : (typeof DEFAULT_TEMPLATES !== 'undefined' ? DEFAULT_TEMPLATES : []);
    const recoveryLogs = (window.app && window.app.recoveryLogs) ? window.app.recoveryLogs : {};
    const personalRecords = (window.app && window.app.personalRecords) ? window.app.personalRecords : (typeof DEFAULT_PRS !== 'undefined' ? DEFAULT_PRS : []);
    const teammates = (window.app && window.app.recentTeammates) ? window.app.recentTeammates : [];
    const customSports = (window.app && window.app.customSports) ? window.app.customSports : [];

    await this.db.ref('users/' + userKey).set({
      username: cleanName,
      password: cleanPass,
      workouts: workouts,
      templates: templates,
      recoveryLogs: recoveryLogs,
      personalRecords: personalRecords,
      teammates: teammates,
      customSports: customSports,
      updatedBySession: window.app ? window.app.sessionId : 'sess-reg',
      updatedAt: Date.now()
    });

    this.connectUser(userKey, cleanName);
    return cleanName;
  }

  // Login with username and password
  async login(username, password) {
    if (!this.initialized || !this.db) {
      throw new Error('החיבור לענן אינו זמין כרגע. נסי שוב בעוד מספר שניות.');
    }

    const cleanName = (username || '').trim();
    const cleanPass = (password || '').trim();
    const userKey = this.toUserKey(cleanName);

    if (!cleanName) throw new Error('נא להזין שם משתמש!');
    if (!cleanPass) throw new Error('נא להזין סיסמה!');

    const snap = await this.db.ref('users/' + userKey).once('value');
    if (!snap.exists()) {
      throw new Error('שם המשתמש לא נמצא. בדקי את השם או צרי חשבון חדש בהרשמה.');
    }

    const data = snap.val();
    if (data.password !== cleanPass) {
      throw new Error('הסיסמה שגויה! נסי שוב.');
    }

    if (window.app) {
      if (data.workouts) window.app.workouts = data.workouts;
      if (data.templates) window.app.templates = data.templates;
      if (data.recoveryLogs) window.app.recoveryLogs = data.recoveryLogs;
      if (data.personalRecords) window.app.personalRecords = data.personalRecords;
      if (data.teammates) window.app.recentTeammates = data.teammates;
      if (data.customSports) window.app.customSports = data.customSports;
      window.app.saveStateLocally();
    }

    this.connectUser(userKey, data.username || cleanName);
    return data.username || cleanName;
  }

  // Sync latest app state to cloud
  async syncToCloud() {
    if (!this.initialized || !this.currentUser || !this.db || this.isSyncing) return;
    this.isSyncing = true;
    try {
      await this.db.ref('users/' + this.currentUser.key).update({
        workouts: window.app.workouts || [],
        templates: window.app.templates || [],
        recoveryLogs: window.app.recoveryLogs || {},
        personalRecords: window.app.personalRecords || [],
        teammates: window.app.recentTeammates || [],
        customSports: window.app.customSports || [],
        updatedBySession: window.app ? window.app.sessionId : 'sess',
        updatedAt: Date.now()
      });
    } catch (e) {
      console.error('Error syncing to cloud:', e);
    } finally {
      this.isSyncing = false;
    }
  }

  // Update display name
  async updateDisplayName(newName) {
    if (!newName || !newName.trim()) return;
    const clean = newName.trim();
    localStorage.setItem('libi_username', clean);

    if (this.currentUser && this.db) {
      try {
        await this.db.ref('users/' + this.currentUser.key).update({
          username: clean,
          updatedAt: Date.now()
        });
        this.currentUser.username = clean;
        localStorage.setItem('libi_cloud_user', JSON.stringify(this.currentUser));
      } catch (err) {
        console.warn('Error updating name in cloud:', err);
      }
    }

    if (window.app) window.app.render();
  }

  // Update password
  async updatePassword(newPassword) {
    if (!newPassword || !newPassword.trim()) throw new Error('נא להזין סיסמה חדשה');
    if (!this.currentUser || !this.db) throw new Error('אין משתמשת מחוברת');
    await this.db.ref('users/' + this.currentUser.key).update({
      password: newPassword.trim(),
      updatedAt: Date.now()
    });
  }

  // Sign out
  signOut() {
    if (this.userRef) {
      this.userRef.off();
      this.userRef = null;
    }
    this.currentUser = null;
    localStorage.removeItem('libi_cloud_user');

    if (window.app) {
      window.app.loadState();
      window.app.render();
    }
  }
}

window.firebaseService = new FirebaseService();

