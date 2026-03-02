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

  el.innerHTML = `
    <span class="mini-stat"><b>${fmtInt(apps.length)}</b> uygulama</span>
    <span class="mini-stat"><b>${apps.filter(a => a.play_url).length}</b> Play link</span>
    <span class="mini-stat"><b>${apps.filter(a => a.privacy_official_url).length}</b> Privacy link</span>
  `;
}

function appCard(app) {
  const initial = (app.name || "A").trim().charAt(0).toUpperCase();

  const icon = app.icon_url
    ? `<img class="app-icon-img" src="${escapeHtml(app.icon_url)}" alt="${escapeHtml(app.name || "App")} icon" />`
    : `<div class="app-icon" aria-hidden="true">${escapeHtml(initial)}</div>`;

  const downloadsText = app.downloads_text ? escapeHtml(app.downloads_text) : "-";
  const ratingText = (typeof app.rating === "number") ? app.rating.toFixed(1) : "-";
  const reviewsText = (typeof app.reviews_count === "number") ? fmtInt(app.reviews_count) : "-";

  return `
    <a class="card app-card" href="./app.html?id=${encodeURIComponent(app.id)}">
      <div class="app-head">
        ${icon}
        <div class="app-meta">
          <div class="name">${escapeHtml(app.name || "Uygulama")}</div>
          <div class="tag">${escapeHtml(app.tagline || "Kısa açıklama")}</div>
        </div>
      </div>
      <div class="kpis">
        <span class="kpi"><b>${downloadsText}</b> indirme</span>
        <span class="kpi"><b>${ratingText}</b> puan</span>
        <span class="kpi"><b>${reviewsText}</b> yorum</span>
      </div>
    </a>
  `;
}

function renderIndex(apps) {
  const grid = document.getElementById("apps-grid");
  if (!grid) return;

  if (!apps.length) {
    grid.innerHTML = `<div class="card">Henüz uygulama yok. <code>data/apps.json</code> dolduralım.</div>`;
    return;
  }

  grid.innerHTML = apps.map(appCard).join("");
  renderMiniStats(apps);
}

function stars(n) {
  const x = Math.max(0, Math.min(5, Number(n) || 0));
  return "★".repeat(x) + "☆".repeat(5 - x);
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

  const icon = app.icon_url
    ? `<img class="app-icon-img" src="${escapeHtml(app.icon_url)}" alt="${escapeHtml(app.name || "App")} icon" />`
    : `<div class="app-icon" aria-hidden="true">${escapeHtml((app.name||"A").charAt(0).toUpperCase())}</div>`;

  const inAppReviews = Array.isArray(app.in_app_reviews) ? app.in_app_reviews : [];

  root.innerHTML = `
    <a class="btn" href="./">← Geri</a>

    <div class="card" style="margin-top:14px;">
      <div class="app-head">
        ${icon}
        <div class="app-meta">
          <div class="name" style="font-size:20px;">${escapeHtml(app.name || "")}</div>
          <div class="tag">${escapeHtml(app.tagline || "")}</div>
        </div>
      </div>

      <div class="kpis" style="margin-top:14px;">
        <span class="kpi"><b>${escapeHtml(app.downloads_text || "-")}</b> indirme</span>
        <span class="kpi"><b>${(typeof app.rating === "number") ? app.rating.toFixed(1) : "-"}</b> puan</span>
        <span class="kpi"><b>${(typeof app.reviews_count === "number") ? fmtInt(app.reviews_count) : "-"}</b> yorum</span>
      </div>

      <div class="cta" style="margin-top:14px;">
        ${app.play_url ? `<a class="btn primary" target="_blank" rel="noreferrer" href="${escapeHtml(app.play_url)}">Google Play</a>` : ""}
        ${app.privacy_url ? `<a class="btn" href="${escapeHtml(app.privacy_url)}">Site içi gizlilik</a>` : ""}
        ${app.privacy_official_url ? `<a class="btn" target="_blank" rel="noreferrer" href="${escapeHtml(app.privacy_official_url)}">Official Privacy</a>` : ""}
        ${app.app_ads_file_url ? `<a class="btn" href="${escapeHtml(app.app_ads_file_url)}">Bu uygulama app-ads.txt</a>` : ""}
      </div>

      <div class="divider"></div>

      <div class="card-kicker">Kısa açıklama</div>
      <div class="card-sub">${escapeHtml(app.short_desc || "-")}</div>

      <div class="divider"></div>

      <div class="card-kicker">Tam açıklama</div>
      <div class="card-sub" style="white-space:pre-wrap;">${escapeHtml(app.long_desc || "-")}</div>
    </div>

    <div class="section" style="padding-top:18px;">
      <div class="section-head">
        <h2>Uygulama içi yorumlar</h2>
        <p class="muted">Bunlar JSON’dan geliyor (istersen sonra gerçek yorum sistemi ekleriz).</p>
      </div>

      <div class="grid">
        ${
          inAppReviews.length
            ? inAppReviews.map(r => `
              <div class="card">
                <div class="card-kicker">${escapeHtml(r.user || "Kullanıcı")} • ${escapeHtml(r.date || "")}</div>
                <div class="card-title">${escapeHtml(stars(r.rating))}</div>
                <div class="card-sub">${escapeHtml(r.text || "")}</div>
              </div>
            `).join("")
            : `<div class="card">Henüz yorum yok.</div>`
        }
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
      <p class="muted">Her uygulamanın site içi sayfası + official linki var.</p>
    </div>

    <div class="grid">
      ${
        apps.length
          ? apps.map(a => `
            <div class="card">
              <div class="card-title">${escapeHtml(a.name || "")}</div>
              <div class="card-sub">${escapeHtml(a.tagline || "")}</div>
              <div class="cta" style="margin-top:12px;">
                ${a.privacy_url ? `<a class="btn" href="${escapeHtml(a.privacy_url)}">Site içi</a>` : ""}
                ${a.privacy_official_url ? `<a class="btn" target="_blank" rel="noreferrer" href="${escapeHtml(a.privacy_official_url)}">Official</a>` : ""}
              </div>
            </div>
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
    const msg = escapeHtml(e.message || "Bilinmeyen hata");
    const grid = document.getElementById("apps-grid");
    if (grid) grid.innerHTML = `<div class="card">Hata: ${msg}</div>`;
    const root = document.getElementById("app-root");
    if (root) root.innerHTML = `<div class="card">Hata: ${msg}</div>`;
    const pr = document.getElementById("privacy-root");
    if (pr) pr.innerHTML = `<div class="card">Hata: ${msg}</div>`;
  }
});
