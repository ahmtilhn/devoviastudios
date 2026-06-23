const SDK_VERSION = '10.14.1';
const SCRIPT_BASE = `https://www.gstatic.com/firebasejs/${SDK_VERSION}`;

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const ownerEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'info@devoviastudio.com').toLowerCase();

let sdkPromise;

export const isFirebaseConfigured = () => Boolean(
  config.apiKey && config.authDomain && config.projectId && config.storageBucket && config.appId,
);

function loadScript(src) {
  const existing = document.querySelector(`script[data-firebase-src="${src}"]`);
  if (existing?.dataset.loaded === 'true') return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = existing || document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.firebaseSrc = src;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Firebase SDK could not load: ${src}`)), { once: true });
    if (!existing) document.head.appendChild(script);
  });
}

async function getServices() {
  if (!isFirebaseConfigured()) throw new Error('Firebase environment variables are not configured.');

  if (!sdkPromise) {
    sdkPromise = (async () => {
      await loadScript(`${SCRIPT_BASE}/firebase-app-compat.js`);
      await Promise.all([
        loadScript(`${SCRIPT_BASE}/firebase-auth-compat.js`),
        loadScript(`${SCRIPT_BASE}/firebase-firestore-compat.js`),
        loadScript(`${SCRIPT_BASE}/firebase-storage-compat.js`),
      ]);

      const firebase = window.firebase;
      const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(config);
      return {
        firebase,
        auth: app.auth(),
        db: app.firestore(),
        storage: app.storage(),
      };
    })();
  }

  return sdkPromise;
}

export async function observeAdminUser(callback) {
  const { auth } = await getServices();
  return auth.onAuthStateChanged((user) => {
    const allowed = Boolean(user?.email && user.email.toLowerCase() === ownerEmail && user.emailVerified);
    callback(allowed ? user : null, user && !allowed ? 'This account is not authorized or its email is not verified.' : '');
  });
}

export async function signInAdmin(email, password) {
  if (email.trim().toLowerCase() !== ownerEmail) throw new Error('This email address is not authorized.');
  const { auth } = await getServices();
  const result = await auth.signInWithEmailAndPassword(email.trim(), password);
  if (!result.user.emailVerified) {
    await auth.signOut();
    throw new Error('Verify the admin email address before signing in.');
  }
  return result.user;
}

export async function signOutAdmin() {
  const { auth } = await getServices();
  return auth.signOut();
}

export async function loadDraftContent() {
  const { db } = await getServices();
  const snapshot = await db.collection('siteContent').doc('draft').get();
  return snapshot.exists ? snapshot.data().content : null;
}

export async function saveDraftContent(content) {
  const { db, firebase } = await getServices();
  await db.collection('siteContent').doc('draft').set({
    content,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

export async function publishSiteContent(content) {
  const { db, firebase } = await getServices();
  const batch = db.batch();
  const payload = {
    content,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  batch.set(db.collection('siteContent').doc('draft'), payload);
  batch.set(db.collection('siteContent').doc('published'), payload);
  await batch.commit();
}

export async function loadPublishedContent() {
  const { db } = await getServices();
  const snapshot = await db.collection('siteContent').doc('published').get();
  return snapshot.exists ? snapshot.data().content : null;
}

export async function uploadSiteImage(file, onProgress) {
  if (!file?.type?.startsWith('image/')) throw new Error('Only image files can be uploaded.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Images must be smaller than 10 MB.');

  const { auth, storage } = await getServices();
  const user = auth.currentUser;
  if (!user || user.email?.toLowerCase() !== ownerEmail) throw new Error('Admin session is required.');

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
  const path = `site-assets/${Date.now()}-${safeName}`;
  const task = storage.ref(path).put(file, { contentType: file.type });

  return new Promise((resolve, reject) => {
    task.on('state_changed', (snapshot) => {
      onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
    }, reject, async () => resolve(task.snapshot.ref.getDownloadURL()));
  });
}
