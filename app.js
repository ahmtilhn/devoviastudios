const DATA_URL = "./data/apps.json";

const escapeHtml = (s = "") =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const fmtInt = (n) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return "-";
  return x.toLocaleString("tr-TR");
};

const fmtDownloads = (n) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return "-";
  if (x >= 1_000_000) return `${(x / 1_000_000).toFixed(1).replace(".0","")}M+`;
  if (x >= 1_000) return `${(x / 1_000).toFixed(1).replace(".0","")}K+`;
  return `${x}+`;
};

async function loadApps() {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("apps.json yüklenemedi");
  const data = await res.json();
  return Array.isArray(data.apps) ? data.apps : [];
}

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

function renderMiniStats(apps) {
  const el = document.getElementById("mini-stats");
  if (!el) return;

  const totalDownloads = apps.reduce((sum, a) => sum + (Number(a.downloads) || 0), 0);
  const avgRating =
    apps.length ? (apps.reduce((sum, a) => sum + (Number(a.rating) || 0), 0) / apps.length) : 0;

  el.innerHTML = `
    <span class="mini-stat"><b>${fmtInt(apps.length)}</b> uygulama</span>
    <span class="mini-stat"><b>${fmtDownloads(totalDownloads)}</b> toplam indirme</span>
    <span class="mini-stat"><b>${avgRating ? avgRating.toFixed(1) : "-"}</b> ort. puan</span>
  `;
}

function appCard(app) {
  const initial = (app.name || "A").trim().charAt(0).toUpperCase();
  return `
    <a class="card app-card" href="./app.html?id=${encodeURIComponent(app.id)}">
      <div class="app-head">
        <div class="app-icon" aria-hidden="true">${escapeHtml(initial)}</div>
        <div class="app-meta">
          <div class="name">${escapeHtml(app.name || "Uygulama")}</div>
          <div class="tag">${escapeHtml(app.tagline || "Kısa açıklama")}</div>
        </div>
      </div>
      <div class="kpis">
        <span class="kpi"><b>${fmtDownloads(app.downloads)}</b> indirme</span>
        <span class="kpi"><b>${Number(app.rating || 0).toFixed(1)}</b> puan</span>
        <span class="kpi"><b>${fmtInt(app.reviews_count)}</b> yorum</span>
      </div>
    </a>
  `;
}

function renderIndex(apps) {
  const grid = document.getElementById("apps-grid");
  if (!grid) return;

  if (!apps.length) {
    grid.innerHTML = `<div class="card">Henüz uygulama yok. <code>data/apps.json</code> dolduracağız.</div>`;
    return;
  }

  grid.innerHTML = apps.map(appCard).join("");
  renderMiniStats(apps);
}

function renderAppPage(apps) {
  const root = document.getElementById("app-root");
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const app = apps.find(a => a.id === id);

  if (!app) {
    root.innerHTML = `
      <div class="card">
        <div class="card-title">Uygulama bulunamadı</div>
        <div class="card-sub">Link yanlış olabilir. <a class="btn" href="./">Ana sayfaya dön</a></div>
      </div>
    `;
    return;
  }

  const adsLines = Array.isArray(app.app_ads_txt) ? app.app_ads_txt : [];
  const inAppReviews = Array.isArray(app.in_app_reviews) ? app.in_app_reviews : [];

  root.innerHTML = `
    <a class="btn" href="./">← Geri</a>

    <div class="card" style="margin-top:14px;">
      <div class="app-head">
        <div class="app-icon" aria-hidden="true">${escapeHtml((app.name||"A").charAt(0).toUpperCase())}</div>
        <div class="app-meta">
          <div class="name" style="font-size:20px;">${escapeHtml(app.name || "")}</div>
          <div class="tag">${escapeHtml(app.tagline || "")}</div>
        </div>
      </div>

      <div class="kpis" style="margin-top:14px;">
        <span class="kpi"><b>${fmtDownloads(app.downloads)}</b> indirme</span>
        <span class="kpi"><b>${Number(app.rating || 0).toFixed(1)}</b> puan</span>
        <span class="kpi"><b>${fmtInt(app.reviews_count)}</b> yorum</span>
      </div>

      <div class="cta" style="margin-top:14px;">
        ${app.play_url ? `<a class="btn primary" target="_blank" rel="noreferrer" href="${escapeHtml(app.play_url)}">Google Play</a>` : ""}
        ${app.appstore_url ? `<a class="btn primary" target="_blank" rel="noreferrer" href="${escapeHtml(app.appstore_url)}">App Store</a>` : ""}
        ${app.privacy_url ? `<a class="btn" href="${escapeHtml(app.privacy_url)}">Gizlilik Politikası</a>` : ""}
      </div>
    </div>

    <div class="section" style="padding-top:18px;">
      <div class="section-head">
        <h2>Uygulama içi yorumlar</h2>
        <p class="muted">Bunlar örnek; sonra gerçek yorumları ekleyeceğiz.</p>
      </div>

      <div class="grid">
        ${
          inAppReviews.length
            ? inAppReviews.map(r => `
              <div class="card">
                <div class="card-kicker">${escapeHtml(r.user || "Kullanıcı")} • ${escapeHtml(r.date || "")}</div>
                <div class="card-title">${"★".repeat(Math.max(0, Math.min(5, Number(r.rating)||0)))}</div>
                <div class="card-sub">${escapeHtml(r.text || "")}</div>
              </div>
            `).join("")
            : `<div class="card">Henüz yorum yok.</div>`
        }
      </div>
    </div>

    <div class="section" style="padding-top:0;">
      <div class="section-head">
        <h2>app-ads.txt (içerik)</h2>
        <p class="muted">Şimdilik içerik gösteriyoruz; dosyaları bir sonraki adımda tek tek oluşturacağız.</p>
      </div>

      <div class="card">
        <pre style="margin:0; white-space:pre-wrap; color:rgba(255,255,255,.82);">${escapeHtml(adsLines.join("\n") || "# app-ads.txt satırları burada görünecek")}</pre>
      </div>
    </div>
  `;
}

function renderPrivacyIndex(apps) {
  const root = document.getElementById("privacy-root");
  if (!root) return;

  root.innerHTML = `
    <div class="section-head">
      <h2>Gizlilik Politikaları</h2>
      <p class="muted">Her uygulamanın ayrı gizlilik sayfası olacak.</p>
    </div>

    <div class="grid">
      ${
        apps.length
          ? apps.map(a => `
            <a class="card" href="${escapeHtml(a.privacy_url || "#")}">
              <div class="card-title">${escapeHtml(a.name || "")}</div>
              <div class="card-sub">Gizlilik politikasını aç</div>
            </a>
          `).join("")
          : `<div class="card">Önce <code>data/apps.json</code> dolduralım.</div>`
      }
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  setYear();

  try {
    const apps = await loadApps();
    renderIndex(apps);
    renderAppPage(apps);
    renderPrivacyIndex(apps);
  } catch (e) {
    const grid = document.getElementById("apps-grid");
    if (grid) grid.innerHTML = `<div class="card">Hata: ${escapeHtml(e.message)}</div>`;
    const root = document.getElementById("app-root");
    if (root) root.innerHTML = `<div class="card">Hata: ${escapeHtml(e.message)}</div>`;
    const pr = document.getElementById("privacy-root");
    if (pr) pr.innerHTML = `<div class="card">Hata: ${escapeHtml(e.message)}</div>`;
  }
});