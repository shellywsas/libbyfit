// Firebase Service for LibiFit Multi-User Cloud Sync

const firebaseConfig = {
  apiKey: "AIzaSyBrOrQAinqDgYtv6QwCot6xlR8MsYAa0kc",
  authDomain: "libifit-e9777.firebaseapp.com",
  projectId: "libifit-e9777",
  storageBucket: "libifit-e9777.firebasestorage.app",
  messagingSenderId: "367037311107",
  appId: "1:367037311107:web:884e8631c21cbd3fdd53b6"
};

class FirebaseService {
  constructor() {
    this.initialized = false;
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.profile = null;
    this.unsubSnapshot = null;
    this.isSyncing = false;
    this.init();
  }

  init() {
    try {
      if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.initialized = true;

        // Offline cache for Firestore
        this.db.enablePersistence({ synchronizeTabs: true }).catch(err => {
          console.warn('Firestore offline persistence status:', err.code);
        });

        // Listen for authentication changes
        this.auth.onAuthStateChanged(async (user) => {
          this.currentUser = user;
          if (user) {
            await this.handleUserLogin(user);
          } else {
            this.handleUserLogout();
          }
          if (window.app) {
            window.app.render();
          }
        });
      }
    } catch (e) {
      console.error('Firebase initialization error:', e);
    }
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  getUserName() {
    if (this.profile && this.profile.displayName && this.profile.displayName.trim()) {
      return this.profile.displayName.trim();
    }
    if (this.currentUser && this.currentUser.displayName && this.currentUser.displayName.trim()) {
      return this.currentUser.displayName.trim();
    }
    return localStorage.getItem('libi_username') || 'ליבי';
  }

  getUserEmail() {
    if (this.currentUser && this.currentUser.email) return this.currentUser.email;
    return '';
  }

  async handleUserLogin(user) {
    if (!this.db) return;
    try {
      const userDocRef = this.db.collection('users').doc(user.uid);
      const doc = await userDocRef.get();

      if (doc.exists) {
        const data = doc.data();
        this.profile = data.profile || { displayName: user.displayName || 'משתמשת' };
        if (this.profile.displayName) {
          localStorage.setItem('libi_username', this.profile.displayName);
        }
        if (window.app) {
          if (data.workouts) window.app.workouts = data.workouts;
          if (data.templates) window.app.templates = data.templates;
          if (data.recoveryLogs) window.app.recoveryLogs = data.recoveryLogs;
          if (data.personalRecords) window.app.personalRecords = data.personalRecords;
          if (data.teammates) window.app.recentTeammates = data.teammates;
          window.app.saveStateLocally();
          window.app.render();
        }
      } else {
        // First login for this account: upload current state so nothing is lost
        const displayName = user.displayName || localStorage.getItem('libi_username') || 'ליבי';
        this.profile = {
          displayName: displayName,
          email: user.email || '',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        localStorage.setItem('libi_username', displayName);
        const w = (window.app && window.app.workouts) ? window.app.workouts : [];
        const t = (window.app && window.app.templates) ? window.app.templates : (typeof DEFAULT_TEMPLATES !== 'undefined' ? DEFAULT_TEMPLATES : []);
        const r = (window.app && window.app.recoveryLogs) ? window.app.recoveryLogs : {};
        const p = (window.app && window.app.personalRecords) ? window.app.personalRecords : (typeof DEFAULT_PRS !== 'undefined' ? DEFAULT_PRS : []);
        const tm = (window.app && window.app.recentTeammates) ? window.app.recentTeammates : [];

        await userDocRef.set({
          profile: this.profile,
          workouts: w,
          templates: t,
          recoveryLogs: r,
          personalRecords: p,
          teammates: tm,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      }

      // Realtime listener for cross-device synchronization
      if (this.unsubSnapshot) this.unsubSnapshot();
      this.unsubSnapshot = userDocRef.onSnapshot((snapshot) => {
        if (!snapshot.exists) return;
        const fresh = snapshot.data();
        if (fresh && window.app && fresh.updatedBySession !== window.app.sessionId) {
          if (fresh.profile && fresh.profile.displayName) {
            this.profile = fresh.profile;
            localStorage.setItem('libi_username', fresh.profile.displayName);
          }
          if (fresh.workouts) window.app.workouts = fresh.workouts;
          if (fresh.templates) window.app.templates = fresh.templates;
          if (fresh.recoveryLogs) window.app.recoveryLogs = fresh.recoveryLogs;
          if (fresh.personalRecords) window.app.personalRecords = fresh.personalRecords;
          if (fresh.teammates) window.app.recentTeammates = fresh.teammates;
          window.app.saveStateLocally();
          window.app.render();
        }
      });
    } catch (e) {
      console.error('Error handling user login in cloud:', e);
    }
  }

  handleUserLogout() {
    this.currentUser = null;
    this.profile = null;
    if (this.unsubSnapshot) {
      this.unsubSnapshot();
      this.unsubSnapshot = null;
    }
    if (window.app) {
      window.app.loadState();
      window.app.render();
    }
  }

  async syncToCloud() {
    if (!this.initialized || !this.currentUser || !this.db || this.isSyncing) return;
    this.isSyncing = true;
    try {
      const userDocRef = this.db.collection('users').doc(this.currentUser.uid);
      await userDocRef.set({
        profile: this.profile || { displayName: this.getUserName() },
        workouts: window.app.workouts,
        templates: window.app.templates,
        recoveryLogs: window.app.recoveryLogs,
        personalRecords: window.app.personalRecords,
        teammates: window.app.recentTeammates,
        updatedBySession: window.app.sessionId,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.error('Error syncing to cloud:', e);
    } finally {
      this.isSyncing = false;
    }
  }

  async signInWithGoogle() {
    if (!this.auth) throw new Error('Firebase Auth not ready');
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      return await this.auth.signInWithPopup(provider);
    } catch (e) {
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/cancelled-popup-request') {
        return await this.auth.signInWithRedirect(provider);
      }
      throw e;
    }
  }

  async signInWithEmail(email, password) {
    if (!this.auth) throw new Error('Firebase Auth not ready');
    return await this.auth.signInWithEmailAndPassword(email.trim(), password);
  }

  async signUpWithEmail(name, email, password) {
    if (!this.auth) throw new Error('Firebase Auth not ready');
    const cred = await this.auth.createUserWithEmailAndPassword(email.trim(), password);
    if (cred && cred.user) {
      await cred.user.updateProfile({ displayName: name.trim() });
      this.profile = { displayName: name.trim(), email: email.trim() };
      localStorage.setItem('libi_username', name.trim());
      await this.syncToCloud();
    }
    return cred;
  }

  async updateDisplayName(newName) {
    if (!newName || !newName.trim()) return;
    const clean = newName.trim();
    localStorage.setItem('libi_username', clean);
    if (this.currentUser) {
      try {
        await this.currentUser.updateProfile({ displayName: clean });
        if (!this.profile) this.profile = {};
        this.profile.displayName = clean;
        await this.syncToCloud();
      } catch (err) {
        console.warn('Profile name update in auth:', err);
      }
    }
    if (window.app) window.app.render();
  }

  async signOut() {
    if (!this.auth) return;
    await this.auth.signOut();
  }
}

window.firebaseService = new FirebaseService();
