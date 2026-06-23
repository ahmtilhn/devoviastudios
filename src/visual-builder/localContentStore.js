const ADMIN_SESSION_KEY = 'devovia-admin-session';
const DRAFT_KEY = 'devovia-site-draft';
const PUBLISHED_KEY = 'devovia-site-published';
const PASSWORD_HASH = 'b73b027eb1ecb04e98c0e9858d927166baaa7905c239baebc6551363b570870e';

export const ownerEmail = 'admin@devoviastudio.com';

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function observeAdminUser(callback) {
  const signedIn = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active';
  callback(signedIn ? { email: ownerEmail } : null, '');
  return Promise.resolve(() => {});
}

export async function signInAdmin(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await sha256(password);

  if (normalizedEmail !== ownerEmail || passwordHash !== PASSWORD_HASH) {
    throw new Error('E-posta veya şifre yanlış.');
  }

  sessionStorage.setItem(ADMIN_SESSION_KEY, 'active');
  return { email: ownerEmail };
}

export function signOutAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.reload();
}

export async function loadPublishedContent() {
  const localPublished = localStorage.getItem(PUBLISHED_KEY);
  if (localPublished) {
    try {
      return JSON.parse(localPublished);
    } catch {
      localStorage.removeItem(PUBLISHED_KEY);
    }
  }

  try {
    const response = await fetch(`/data/site-content.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function loadDraftContent() {
  const draft = localStorage.getItem(DRAFT_KEY);
  if (draft) {
    try {
      return JSON.parse(draft);
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }

  return loadPublishedContent();
}

export async function saveDraftContent(content) {
  const payload = { ...content, updatedAt: new Date().toISOString() };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
}

export async function publishSiteContent(content) {
  const payload = { ...content, updatedAt: new Date().toISOString() };
  localStorage.setItem(PUBLISHED_KEY, JSON.stringify(payload));
  localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
}
