const esc = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function frame(id, theme, label, body) {
  const safeId = esc(id);
  const safeTheme = esc(theme);
  return `
    <svg class="v7-feature-svg" data-scene="${safeId}" viewBox="0 0 1200 860" role="img" aria-label="${esc(label)}">
      <defs>
        <linearGradient id="${safeId}-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="0.52" stop-color="#f4f8ff"/>
          <stop offset="1" stop-color="${safeTheme}" stop-opacity=".16"/>
        </linearGradient>
        <linearGradient id="${safeId}-theme" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${safeTheme}"/>
          <stop offset="1" stop-color="#7c3aed"/>
        </linearGradient>
        <filter id="${safeId}-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="20" stdDeviation="22" flood-color="#0f172a" flood-opacity=".14"/>
        </filter>
        <filter id="${safeId}-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="16" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="1200" height="860" rx="58" fill="url(#${safeId}-bg)"/>
      <g opacity=".38" stroke="#94a3b8" stroke-opacity=".25">
        ${Array.from({ length: 13 }, (_, i) => `<path d="M${80 + i * 88} 0V860"/>`).join('')}
        ${Array.from({ length: 10 }, (_, i) => `<path d="M0 ${70 + i * 82}H1200"/>`).join('')}
      </g>
      <circle cx="1020" cy="120" r="190" fill="${safeTheme}" opacity=".08"/>
      <circle cx="170" cy="740" r="230" fill="#22d3ee" opacity=".06"/>
      ${body}
    </svg>
  `;
}

const card = (x, y, w, h, radius = 30, fill = '#ffffff') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="#dfe7f1" filter="url(#scene-shadow)"/>`;

function stockCatalog(theme) {
  return frame('stock-catalog', theme, 'Stock Manager catalog and barcode scanning', `
    <g class="v7-scene-device" filter="url(#stock-catalog-shadow)">
      <rect x="108" y="108" width="470" height="642" rx="44" fill="#0f172a"/>
      <rect x="124" y="124" width="438" height="610" rx="34" fill="#f8fafc"/>
      <rect x="286" y="138" width="112" height="12" rx="6" fill="#1e293b"/>
      <text x="164" y="198" fill="#0f172a" font-family="Sora" font-size="34" font-weight="700">Product catalog</text>
      <rect x="160" y="230" width="364" height="54" rx="18" fill="#eef3fb"/>
      <circle cx="194" cy="257" r="11" fill="none" stroke="#64748b" stroke-width="4"/><path d="M202 265l11 11" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
      <text x="226" y="264" fill="#7b8798" font-family="Manrope" font-size="18">Search name, SKU or code</text>
      <g class="v7-catalog-row">
        <rect x="160" y="314" width="364" height="104" rx="24" fill="#fff" stroke="#dfe7f1"/>
        <rect x="178" y="332" width="68" height="68" rx="18" fill="${theme}" opacity=".12"/>
        <path d="M195 366h34M212 349v34" stroke="${theme}" stroke-width="7" stroke-linecap="round"/>
        <text x="264" y="352" fill="#172033" font-family="Sora" font-size="20" font-weight="700">Wireless Scanner</text>
        <text x="264" y="380" fill="#66758a" font-family="Manrope" font-size="16">SKU SCN-104 · 24 units</text>
        <rect x="445" y="344" width="58" height="28" rx="14" fill="#dcfce7"/><text x="459" y="364" fill="#15803d" font-family="Manrope" font-size="13" font-weight="700">IN STOCK</text>
      </g>
      <g class="v7-catalog-row v7-delay-1">
        <rect x="160" y="438" width="364" height="104" rx="24" fill="#fff" stroke="#dfe7f1"/>
        <rect x="178" y="456" width="68" height="68" rx="18" fill="#22d3ee" opacity=".13"/>
        <rect x="196" y="474" width="32" height="32" rx="7" fill="none" stroke="#0891b2" stroke-width="5"/>
        <text x="264" y="476" fill="#172033" font-family="Sora" font-size="20" font-weight="700">Storage Box</text>
        <text x="264" y="504" fill="#66758a" font-family="Manrope" font-size="16">SKU BOX-020 · 8 units</text>
        <rect x="445" y="468" width="58" height="28" rx="14" fill="#fef3c7"/><text x="454" y="488" fill="#a16207" font-family="Manrope" font-size="13" font-weight="700">LOW</text>
      </g>
      <rect x="160" y="574" width="364" height="112" rx="28" fill="url(#stock-catalog-theme)"/>
      <text x="190" y="616" fill="#fff" font-family="Sora" font-size="21" font-weight="700">Scan barcode or QR</text>
      <text x="190" y="646" fill="#fff" opacity=".78" font-family="Manrope" font-size="16">Find or create the product instantly</text>
      <path d="M450 608v42M429 629h42" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    </g>
    <g class="v7-scene-overlay v7-scanner-frame">
      <rect x="654" y="150" width="414" height="420" rx="38" fill="#0f172a" opacity=".92" filter="url(#stock-catalog-shadow)"/>
      <path d="M704 222v-28h28M990 194h28v28M704 496v28h28M990 524h28v-28" fill="none" stroke="${theme}" stroke-width="9" stroke-linecap="round"/>
      <g fill="#fff"><rect x="750" y="286" width="8" height="146"/><rect x="770" y="286" width="16" height="146"/><rect x="801" y="286" width="7" height="146"/><rect x="821" y="286" width="24" height="146"/><rect x="859" y="286" width="10" height="146"/><rect x="882" y="286" width="18" height="146"/><rect x="914" y="286" width="7" height="146"/><rect x="934" y="286" width="22" height="146"/></g>
      <rect class="v7-scan-beam" x="716" y="250" width="290" height="4" rx="2" fill="${theme}" filter="url(#stock-catalog-glow)"/>
      <text x="784" y="470" fill="#fff" font-family="Manrope" font-size="17" letter-spacing="3">SCANNING PRODUCT</text>
    </g>
    <g class="v7-result-chip" filter="url(#stock-catalog-shadow)">
      <rect x="690" y="610" width="342" height="116" rx="30" fill="#fff" stroke="#dfe7f1"/>
      <circle cx="742" cy="668" r="28" fill="#dcfce7"/><path d="M728 668l9 9 20-22" fill="none" stroke="#16a34a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="790" y="656" fill="#172033" font-family="Sora" font-size="20" font-weight="700">Product found</text>
      <text x="790" y="688" fill="#66758a" font-family="Manrope" font-size="16">SKU and stock record ready</text>
    </g>
  `);
}

function stockMovement(theme) {
  return frame('stock-movement', theme, 'Stock Manager inventory movement timeline', `
    <g filter="url(#stock-movement-shadow)">
      <rect x="116" y="120" width="968" height="620" rx="42" fill="#fff" stroke="#dfe7f1"/>
      <text x="168" y="188" fill="#0f172a" font-family="Sora" font-size="34" font-weight="700">Inventory movement history</text>
      <text x="168" y="220" fill="#66758a" font-family="Manrope" font-size="18">Every stock change keeps its reason, time and quantity.</text>
      <path class="v7-flow-line" d="M248 292V654" stroke="url(#stock-movement-theme)" stroke-width="7" stroke-linecap="round"/>
      ${[
        [298,'IN','+24','New delivery','Today · 09:18','#16a34a'],
        [414,'SALE','−3','Retail sale','Today · 11:42','#ef4444'],
        [530,'EDIT','+2','Manual correction','Today · 14:05',theme],
        [646,'IN','+10','Restock','Yesterday · 16:24','#16a34a'],
      ].map(([y,type,qty,title,time,color], i) => `
        <g class="v7-flow-event v7-delay-${i}">
          <circle cx="248" cy="${y}" r="18" fill="#fff" stroke="${color}" stroke-width="7"/>
          <rect x="298" y="${y-45}" width="692" height="90" rx="24" fill="#f9fbff" stroke="#e1e8f2"/>
          <rect x="320" y="${y-22}" width="72" height="44" rx="14" fill="${color}" opacity=".12"/>
          <text x="338" y="${y+7}" fill="${color}" font-family="Sora" font-size="15" font-weight="800">${type}</text>
          <text x="420" y="${y-5}" fill="#172033" font-family="Sora" font-size="20" font-weight="700">${title}</text>
          <text x="420" y="${y+22}" fill="#7a8698" font-family="Manrope" font-size="15">${time}</text>
          <text x="900" y="${y+7}" fill="${color}" font-family="Sora" font-size="23" font-weight="800">${qty}</text>
        </g>`).join('')}
      <rect x="806" y="160" width="204" height="76" rx="22" fill="url(#stock-movement-theme)"/>
      <text x="834" y="192" fill="#fff" opacity=".76" font-family="Manrope" font-size="14">CURRENT STOCK</text>
      <text x="834" y="220" fill="#fff" font-family="Sora" font-size="28" font-weight="800">33 units</text>
    </g>
  `);
}

function stockInsights(theme) {
  return frame('stock-insights', theme, 'Stock Manager dashboard and low stock alerts', `
    <g filter="url(#stock-insights-shadow)">
      <rect x="104" y="104" width="992" height="650" rx="44" fill="#fff" stroke="#dfe7f1"/>
      <text x="158" y="176" fill="#0f172a" font-family="Sora" font-size="34" font-weight="700">Inventory overview</text>
      <text x="158" y="210" fill="#66758a" font-family="Manrope" font-size="17">See value, quantity and risk before opening individual records.</text>
      ${[
        [156,252,250,126,'TOTAL PRODUCTS','286',theme],
        [426,252,250,126,'INVENTORY VALUE','€ 42,680','#7c3aed'],
        [696,252,250,126,'LOW STOCK','12','#f59e0b'],
      ].map(([x,y,w,h,label,value,color], i) => `
        <g class="v7-metric-card v7-delay-${i}">
          <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="28" fill="#f8faff" stroke="#e1e8f2"/>
          <circle cx="${x+42}" cy="${y+42}" r="18" fill="${color}" opacity=".14"/>
          <text x="${x+28}" y="${y+88}" fill="#7a8698" font-family="Manrope" font-size="13" font-weight="700">${label}</text>
          <text x="${x+28}" y="${y+118}" fill="${color}" font-family="Sora" font-size="28" font-weight="800">${value}</text>
        </g>`).join('')}
      <rect x="156" y="410" width="520" height="278" rx="30" fill="#f8faff" stroke="#e1e8f2"/>
      <text x="188" y="454" fill="#172033" font-family="Sora" font-size="20" font-weight="700">Stock value trend</text>
      <path d="M202 626L278 582L352 604L430 532L504 556L582 484L642 506" fill="none" stroke="${theme}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M202 626L278 582L352 604L430 532L504 556L582 484L642 506V660H202Z" fill="${theme}" opacity=".08"/>
      <g class="v7-chart-dots" fill="#fff" stroke="${theme}" stroke-width="6">${[[202,626],[278,582],[352,604],[430,532],[504,556],[582,484],[642,506]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9"/>`).join('')}</g>
      <rect x="704" y="410" width="242" height="278" rx="30" fill="#fff9ed" stroke="#fde5b4"/>
      <text x="736" y="454" fill="#92400e" font-family="Sora" font-size="20" font-weight="700">Needs attention</text>
      ${[['Printer paper','2 left'],['Shipping labels','4 left'],['Storage box','8 left']].map(([title,val],i)=>`<g class="v7-alert-row v7-delay-${i}"><rect x="730" y="${486+i*58}" width="190" height="46" rx="14" fill="#fff"/><circle cx="752" cy="${509+i*58}" r="7" fill="#f59e0b"/><text x="770" y="${506+i*58}" fill="#4b5563" font-family="Manrope" font-size="14" font-weight="700">${title}</text><text x="770" y="${522+i*58}" fill="#a16207" font-family="Manrope" font-size="12">${val}</text></g>`).join('')}
    </g>
  `);
}

function stockOffline(theme) {
  return frame('stock-offline', theme, 'Stock Manager offline storage export and backup', `
    <g filter="url(#stock-offline-shadow)">
      <rect x="126" y="116" width="948" height="626" rx="44" fill="#fff" stroke="#dfe7f1"/>
      <text x="178" y="184" fill="#0f172a" font-family="Sora" font-size="34" font-weight="700">Offline-first data control</text>
      <text x="178" y="218" fill="#66758a" font-family="Manrope" font-size="17">Manage records without internet, then export or restore when needed.</text>
      <g class="v7-database">
        <ellipse cx="348" cy="396" rx="132" ry="48" fill="${theme}" opacity=".2"/>
        <rect x="216" y="396" width="264" height="178" fill="${theme}" opacity=".12"/>
        <ellipse cx="348" cy="574" rx="132" ry="48" fill="${theme}" opacity=".18"/>
        <ellipse cx="348" cy="396" rx="132" ry="48" fill="url(#stock-offline-theme)"/>
        <path d="M216 454c0 27 59 48 132 48s132-21 132-48M216 514c0 27 59 48 132 48s132-21 132-48" fill="none" stroke="${theme}" stroke-width="7" opacity=".72"/>
        <text x="282" y="410" fill="#fff" font-family="Sora" font-size="22" font-weight="800">SQLITE</text>
      </g>
      <g class="v7-offline-badge"><circle cx="348" cy="636" r="48" fill="#0f172a"/><path d="M319 637c16-18 42-21 59-4M330 648c9-9 22-10 32-3M348 660h1" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M310 598l78 78" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/></g>
      <path class="v7-export-route" d="M510 476C610 476 622 338 714 338M510 500C612 500 642 602 730 602" fill="none" stroke="${theme}" stroke-width="6" stroke-dasharray="12 14" stroke-linecap="round"/>
      <g class="v7-export-card v7-delay-1">
        <rect x="714" y="276" width="250" height="142" rx="28" fill="#f8faff" stroke="#dfe7f1"/>
        <rect x="744" y="306" width="54" height="66" rx="12" fill="#dcfce7"/><text x="756" y="348" fill="#15803d" font-family="Sora" font-size="18" font-weight="800">CSV</text>
        <text x="824" y="330" fill="#172033" font-family="Sora" font-size="19" font-weight="700">Export records</text>
        <text x="824" y="358" fill="#66758a" font-family="Manrope" font-size="14">Share inventory data</text>
      </g>
      <g class="v7-export-card v7-delay-2">
        <rect x="714" y="532" width="250" height="142" rx="28" fill="#f8faff" stroke="#dfe7f1"/>
        <rect x="744" y="562" width="54" height="66" rx="12" fill="${theme}" opacity=".13"/><path d="M758 590h26M771 577v26" stroke="${theme}" stroke-width="6" stroke-linecap="round"/>
        <text x="824" y="586" fill="#172033" font-family="Sora" font-size="19" font-weight="700">.sfbak backup</text>
        <text x="824" y="614" fill="#66758a" font-family="Manrope" font-size="14">Restore through Android files</text>
      </g>
    </g>
  `);
}

function arrowMemory(theme) {
  const arrows = ['→','↑','←','↓','→','↓','↑','←','→','↑','←','↓','↑','→','↓','←'];
  return frame('arrow-memory', theme, 'Arrow Escape fading arrow memory puzzle', `
    <g filter="url(#arrow-memory-shadow)">
      <rect x="138" y="104" width="924" height="652" rx="44" fill="#170e2d"/>
      <circle cx="862" cy="220" r="190" fill="#7c3aed" opacity=".22"/>
      <text x="192" y="176" fill="#fff" font-family="Sora" font-size="34" font-weight="800">Remember the route</text>
      <text x="192" y="210" fill="#c4b5fd" font-family="Manrope" font-size="17">Arrow heads fade. The direction must remain in memory.</text>
      <g class="v7-arrow-board">
        ${arrows.map((a,i)=>{const x=232+(i%4)*142,y=284+Math.floor(i/4)*112;return `<g class="v7-arrow-cell v7-delay-${i%4}"><rect x="${x}" y="${y}" width="94" height="78" rx="22" fill="#251844" stroke="#6d28d9" stroke-opacity=".55"/><text class="v7-fading-arrow" x="${x+47}" y="${y+54}" text-anchor="middle" fill="#f5f3ff" font-family="Sora" font-size="38" font-weight="800">${a}</text></g>`}).join('')}
      </g>
      <g class="v7-path-guide" fill="none" stroke="#f472b6" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><path d="M280 323H422V435H564V547H706"/></g>
      <rect x="790" y="318" width="212" height="184" rx="30" fill="#23163f" stroke="#8b5cf6"/>
      <text x="826" y="366" fill="#c4b5fd" font-family="Manrope" font-size="14" letter-spacing="2">MEMORY PHASE</text>
      <text x="826" y="418" fill="#fff" font-family="Sora" font-size="48" font-weight="800">3.2s</text>
      <rect x="826" y="450" width="136" height="10" rx="5" fill="#3b2761"/><rect class="v7-memory-bar" x="826" y="450" width="104" height="10" rx="5" fill="url(#arrow-memory-theme)"/>
      <text x="826" y="544" fill="#f5f3ff" font-family="Manrope" font-size="16">Read now. Move later.</text>
    </g>
  `);
}

function arrowPressure(theme) {
  return frame('arrow-pressure', theme, 'Arrow Escape timer lives and mistake limit', `
    <g filter="url(#arrow-pressure-shadow)">
      <rect x="130" y="104" width="940" height="652" rx="44" fill="#160c2b"/>
      <text x="184" y="176" fill="#fff" font-family="Sora" font-size="34" font-weight="800">Pressure changes every decision</text>
      <text x="184" y="210" fill="#c4b5fd" font-family="Manrope" font-size="17">Time, lives and mistake limits punish random movement.</text>
      <circle cx="366" cy="448" r="176" fill="#21143d" stroke="#4c1d95" stroke-width="16"/>
      <circle class="v7-countdown-ring" cx="366" cy="448" r="176" fill="none" stroke="url(#arrow-pressure-theme)" stroke-width="18" stroke-linecap="round" stroke-dasharray="1105" stroke-dashoffset="280" transform="rotate(-90 366 448)"/>
      <text x="366" y="438" text-anchor="middle" fill="#fff" font-family="Sora" font-size="88" font-weight="800">12</text>
      <text x="366" y="478" text-anchor="middle" fill="#c4b5fd" font-family="Manrope" font-size="18" letter-spacing="4">SECONDS</text>
      <g class="v7-life-row">${[0,1,2].map((i)=>`<path class="v7-life v7-delay-${i}" d="M${290+i*76} 542c-18-18-48 10-18 38l18 18 18-18c30-28 0-56-18-38Z" fill="${i<2?'#f43f5e':'#46325f'}"/>`).join('')}</g>
      <rect x="640" y="280" width="334" height="336" rx="34" fill="#21143d" stroke="#6d28d9" stroke-opacity=".55"/>
      <text x="686" y="332" fill="#fff" font-family="Sora" font-size="23" font-weight="700">Decision window</text>
      ${[['Read direction','00:02'],['Choose path','00:05'],['Commit move','00:08'],['Escape tile','00:12']].map(([t,time],i)=>`<g class="v7-pressure-step v7-delay-${i}"><circle cx="700" cy="${382+i*58}" r="12" fill="${i<3?theme:'#475569'}"/><text x="728" y="${388+i*58}" fill="#f5f3ff" font-family="Manrope" font-size="17" font-weight="700">${t}</text><text x="892" y="${388+i*58}" fill="#a78bfa" font-family="Sora" font-size="15">${time}</text></g>`).join('')}
      <rect x="686" y="566" width="242" height="12" rx="6" fill="#3c275d"/><rect class="v7-pressure-bar" x="686" y="566" width="178" height="12" rx="6" fill="#f43f5e"/>
    </g>
  `);
}

function arrowBoosters(theme) {
  const cards = [
    ['VISION CARD','Reveal faded arrows','◉','#8b5cf6'],
    ['TIME FREEZE','Pause the countdown','Ⅱ','#06b6d4'],
    ['HINT','Show a useful move','→','#f59e0b'],
  ];
  return frame('arrow-boosters', theme, 'Arrow Escape boosters and hints', `
    <g filter="url(#arrow-boosters-shadow)">
      <rect x="128" y="108" width="944" height="644" rx="44" fill="#160d2c"/>
      <text x="182" y="182" fill="#fff" font-family="Sora" font-size="34" font-weight="800">Three ways to recover a difficult run</text>
      <text x="182" y="216" fill="#c4b5fd" font-family="Manrope" font-size="17">Each booster solves a different kind of pressure.</text>
      ${cards.map(([title,desc,icon,color],i)=>{const x=182+i*294;return `<g class="v7-booster-card v7-delay-${i}"><rect x="${x}" y="294" width="250" height="330" rx="34" fill="#241640" stroke="${color}" stroke-opacity=".7"/><circle cx="${x+125}" cy="394" r="58" fill="${color}" opacity=".18"/><text x="${x+125}" y="414" text-anchor="middle" fill="${color}" font-family="Sora" font-size="48" font-weight="800">${icon}</text><text x="${x+30}" y="500" fill="#fff" font-family="Sora" font-size="19" font-weight="800">${title}</text><text x="${x+30}" y="538" fill="#c4b5fd" font-family="Manrope" font-size="15">${desc}</text><rect x="${x+30}" y="568" width="190" height="38" rx="19" fill="${color}" opacity=".16"/><text x="${x+125}" y="593" text-anchor="middle" fill="${color}" font-family="Manrope" font-size="13" font-weight="800">USE WHEN NEEDED</text></g>`}).join('')}
      <path class="v7-booster-energy" d="M224 682C420 620 744 730 986 650" fill="none" stroke="url(#arrow-boosters-theme)" stroke-width="7" stroke-linecap="round" stroke-dasharray="18 15"/>
    </g>
  `);
}

function arrowProgression(theme) {
  return frame('arrow-progression', theme, 'Arrow Escape daily missions coins stars and streaks', `
    <g filter="url(#arrow-progression-shadow)">
      <rect x="126" y="106" width="948" height="650" rx="44" fill="#170d2e"/>
      <text x="180" y="178" fill="#fff" font-family="Sora" font-size="34" font-weight="800">A reward loop connected to puzzle play</text>
      <text x="180" y="212" fill="#c4b5fd" font-family="Manrope" font-size="17">Missions, streaks and level rewards make progress visible.</text>
      <rect x="178" y="270" width="538" height="392" rx="34" fill="#241640" stroke="#6d28d9" stroke-opacity=".55"/>
      <text x="220" y="320" fill="#fff" font-family="Sora" font-size="22" font-weight="700">Daily missions</text>
      ${[['Complete 3 levels','3 / 3',true],['Use one booster','1 / 1',true],['Earn 6 stars','4 / 6',false],['Finish without mistakes','0 / 1',false]].map(([title,progress,done],i)=>`<g class="v7-mission-row v7-delay-${i}"><rect x="210" y="${350+i*68}" width="474" height="54" rx="18" fill="#1b1132"/><circle cx="240" cy="${377+i*68}" r="14" fill="${done?'#22c55e':'#4c3a63'}"/>${done?`<path d="M233 ${377+i*68}l5 5 10-12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`:''}<text x="270" y="${383+i*68}" fill="#f5f3ff" font-family="Manrope" font-size="16" font-weight="700">${title}</text><text x="624" y="${383+i*68}" text-anchor="end" fill="${done?'#4ade80':'#c4b5fd'}" font-family="Sora" font-size="14">${progress}</text></g>`).join('')}
      <g class="v7-reward-column">
        <rect x="756" y="270" width="264" height="178" rx="34" fill="url(#arrow-progression-theme)"/>
        <text x="790" y="316" fill="#fff" opacity=".75" font-family="Manrope" font-size="14" letter-spacing="2">CURRENT STREAK</text>
        <text x="790" y="382" fill="#fff" font-family="Sora" font-size="64" font-weight="800">7</text>
        <text x="858" y="382" fill="#fff" font-family="Manrope" font-size="18">days</text>
        <path class="v7-streak-flame" d="M944 386c-42-30-8-72-22-100 50 36 62 74 32 110-10 12-24 18-38 16 20-12 24-36 28-26Z" fill="#fbbf24"/>
        <rect x="756" y="476" width="264" height="186" rx="34" fill="#241640" stroke="#6d28d9" stroke-opacity=".55"/>
        <text x="792" y="522" fill="#fff" font-family="Sora" font-size="19" font-weight="700">Level reward</text>
        <g class="v7-star-row">${[0,1,2].map(i=>`<text x="${796+i*54}" y="580" fill="#fbbf24" font-size="42">★</text>`).join('')}</g>
        <circle cx="930" cy="570" r="28" fill="#f59e0b"/><text x="930" y="580" text-anchor="middle" fill="#fff" font-family="Sora" font-size="22" font-weight="800">50</text>
        <text x="792" y="630" fill="#c4b5fd" font-family="Manrope" font-size="14">Stars + coins + booster chance</text>
      </g>
    </g>
  `);
}

function hadithDaily(theme) {
  return frame('hadith-daily', theme, 'Daily Hadith daily reading and quote experience', `
    <g filter="url(#hadith-daily-shadow)">
      <rect x="132" y="106" width="936" height="650" rx="44" fill="#071c2f"/>
      <circle cx="876" cy="184" r="220" fill="#0ea5e9" opacity=".16"/>
      <text x="188" y="180" fill="#fff" font-family="Sora" font-size="34" font-weight="700">A focused reading for today</text>
      <text x="188" y="214" fill="#bae6fd" font-family="Manrope" font-size="17">Trusted content without an endless feed.</text>
      <rect x="188" y="282" width="616" height="348" rx="36" fill="#0c2a43" stroke="#38bdf8" stroke-opacity=".35"/>
      <text x="234" y="336" fill="#7dd3fc" font-family="Manrope" font-size="14" font-weight="800" letter-spacing="3">HADITH OF THE DAY</text>
      <text x="234" y="410" fill="#fff" font-family="Georgia" font-size="32">“</text>
      <text x="264" y="418" fill="#f0f9ff" font-family="Georgia" font-size="25">Actions are judged by intentions,</text>
      <text x="264" y="454" fill="#f0f9ff" font-family="Georgia" font-size="25">and every person will receive</text>
      <text x="264" y="490" fill="#f0f9ff" font-family="Georgia" font-size="25">according to what they intended.</text>
      <text x="234" y="548" fill="#7dd3fc" font-family="Manrope" font-size="15">Trusted daily source · Saved locally</text>
      <rect x="234" y="574" width="162" height="38" rx="19" fill="#0ea5e9" opacity=".2"/><text x="315" y="599" text-anchor="middle" fill="#7dd3fc" font-family="Manrope" font-size="13" font-weight="800">SAVE READING</text>
      <g class="v7-daily-orbit">
        <circle cx="900" cy="400" r="110" fill="#0ea5e9" opacity=".1"/>
        <circle cx="900" cy="400" r="76" fill="#fbbf24" opacity=".95"/>
        <circle cx="926" cy="374" r="64" fill="#fde68a" opacity=".65"/>
        <text x="900" y="408" text-anchor="middle" fill="#713f12" font-family="Sora" font-size="20" font-weight="800">TODAY</text>
        <text x="900" y="438" text-anchor="middle" fill="#92400e" font-family="Manrope" font-size="15">12 Sha'ban</text>
      </g>
      <g class="v7-bookmark-chip"><rect x="842" y="556" width="176" height="58" rx="19" fill="#fff" opacity=".9"/><path d="M868 572h22v28l-11-7-11 7Z" fill="${theme}"/><text x="906" y="592" fill="#1e3a5f" font-family="Manrope" font-size="14" font-weight="800">Daily reflection</text></g>
    </g>
  `);
}

function hadithPrayer(theme) {
  return frame('hadith-prayer', theme, 'Daily Hadith prayer times and notifications', `
    <g filter="url(#hadith-prayer-shadow)">
      <rect x="126" y="108" width="948" height="646" rx="44" fill="#071d30"/>
      <text x="182" y="178" fill="#fff" font-family="Sora" font-size="34" font-weight="700">The next prayer stays visible</text>
      <text x="182" y="212" fill="#bae6fd" font-family="Manrope" font-size="17">Location-based timing and customizable reminders.</text>
      <path class="v7-prayer-arc" d="M210 530C360 250 766 250 922 530" fill="none" stroke="#0ea5e9" stroke-width="9" stroke-linecap="round"/>
      <path d="M210 530C360 250 766 250 922 530" fill="none" stroke="#7dd3fc" stroke-opacity=".22" stroke-width="30" stroke-linecap="round"/>
      ${[
        [250,478,'FAJR','05:42'],[392,344,'SUNRISE','07:11'],[566,292,'DHUHR','12:48'],[740,344,'ASR','15:39'],[882,478,'MAGHRIB','18:24'],
      ].map(([x,y,name,time],i)=>`<g class="v7-prayer-point v7-delay-${i%4}"><circle cx="${x}" cy="${y}" r="18" fill="${i===2?'#fbbf24':'#0ea5e9'}" stroke="#fff" stroke-width="6"/><text x="${x}" y="${y+52}" text-anchor="middle" fill="#e0f2fe" font-family="Manrope" font-size="13" font-weight="800">${name}</text><text x="${x}" y="${y+76}" text-anchor="middle" fill="#7dd3fc" font-family="Sora" font-size="16">${time}</text></g>`).join('')}
      <g class="v7-next-prayer-card">
        <rect x="376" y="520" width="380" height="144" rx="32" fill="#0c2c48" stroke="#38bdf8" stroke-opacity=".4"/>
        <text x="414" y="564" fill="#7dd3fc" font-family="Manrope" font-size="13" font-weight="800" letter-spacing="2">NEXT PRAYER</text>
        <text x="414" y="614" fill="#fff" font-family="Sora" font-size="30" font-weight="800">Dhuhr · 12:48</text>
        <rect x="640" y="552" width="82" height="82" rx="24" fill="${theme}" opacity=".18"/>
        <path class="v7-bell" d="M681 574c-15 0-25 11-25 27v12l-9 12h68l-9-12v-12c0-16-10-27-25-27Zm-10 55c1 9 19 9 20 0" fill="none" stroke="#7dd3fc" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <rect x="832" y="156" width="170" height="62" rx="20" fill="#fff" opacity=".9"/><circle cx="864" cy="187" r="13" fill="#22c55e"/><text x="890" y="193" fill="#1e3a5f" font-family="Manrope" font-size="14" font-weight="800">Location ready</text>
    </g>
  `);
}

function hadithTools(theme) {
  const beads = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const x = 810 + Math.cos(angle) * 128;
    const y = 480 + Math.sin(angle) * 128;
    return `<circle class="v7-bead v7-delay-${i%4}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" fill="${i<7?'#38bdf8':'#164e63'}" stroke="#e0f2fe" stroke-opacity=".45"/>`;
  }).join('');
  return frame('hadith-tools', theme, 'Daily Hadith Qibla compass and smart tasbih', `
    <g filter="url(#hadith-tools-shadow)">
      <rect x="126" y="108" width="948" height="646" rx="44" fill="#071d30"/>
      <text x="182" y="178" fill="#fff" font-family="Sora" font-size="34" font-weight="700">Direction and dhikr in one toolkit</text>
      <text x="182" y="212" fill="#bae6fd" font-family="Manrope" font-size="17">Find Qibla, then count with tactile haptic rhythm.</text>
      <g class="v7-compass">
        <circle cx="374" cy="470" r="194" fill="#0c2c48" stroke="#38bdf8" stroke-opacity=".42" stroke-width="8"/>
        <circle cx="374" cy="470" r="154" fill="none" stroke="#7dd3fc" stroke-opacity=".24" stroke-width="2" stroke-dasharray="7 12"/>
        <text x="374" y="312" text-anchor="middle" fill="#f0f9ff" font-family="Sora" font-size="20" font-weight="800">N</text>
        <text x="532" y="478" text-anchor="middle" fill="#7dd3fc" font-family="Sora" font-size="18">E</text>
        <text x="374" y="638" text-anchor="middle" fill="#7dd3fc" font-family="Sora" font-size="18">S</text>
        <text x="214" y="478" text-anchor="middle" fill="#7dd3fc" font-family="Sora" font-size="18">W</text>
        <g class="v7-compass-needle" transform="rotate(28 374 470)"><path d="M374 324l30 146-30-22-30 22Z" fill="#ef4444"/><path d="M374 616l-30-146 30 22 30-22Z" fill="#e0f2fe" opacity=".8"/></g>
        <circle cx="374" cy="470" r="23" fill="#f0f9ff"/><circle cx="374" cy="470" r="9" fill="${theme}"/>
        <rect x="286" y="682" width="176" height="42" rx="21" fill="#0ea5e9" opacity=".2"/><text x="374" y="709" text-anchor="middle" fill="#7dd3fc" font-family="Manrope" font-size="14" font-weight="800">QIBLA · 128°</text>
      </g>
      <g class="v7-tasbih">
        ${beads}
        <circle cx="810" cy="480" r="84" fill="#0c2c48" stroke="#38bdf8" stroke-opacity=".4"/>
        <text x="810" y="470" text-anchor="middle" fill="#7dd3fc" font-family="Manrope" font-size="14" letter-spacing="2">DHIKR COUNT</text>
        <text x="810" y="530" text-anchor="middle" fill="#fff" font-family="Sora" font-size="58" font-weight="800">27</text>
        <rect x="720" y="660" width="180" height="52" rx="20" fill="#fff" opacity=".9"/><path d="M746 678v16M756 674v24M766 680v12" stroke="${theme}" stroke-width="5" stroke-linecap="round"/><text x="790" y="693" fill="#1e3a5f" font-family="Manrope" font-size="14" font-weight="800">Haptic feedback</text>
      </g>
    </g>
  `);
}

function hadithMedia(theme) {
  return frame('hadith-media', theme, 'Daily Hadith audio playback visual cards and Islamic calendar', `
    <g filter="url(#hadith-media-shadow)">
      <rect x="126" y="108" width="948" height="646" rx="44" fill="#071d30"/>
      <text x="182" y="178" fill="#fff" font-family="Sora" font-size="34" font-weight="700">Listen, design and share</text>
      <text x="182" y="212" fill="#bae6fd" font-family="Manrope" font-size="17">Content moves beyond the reading screen.</text>
      <rect x="180" y="282" width="452" height="304" rx="34" fill="#0c2c48" stroke="#38bdf8" stroke-opacity=".38"/>
      <text x="222" y="332" fill="#7dd3fc" font-family="Manrope" font-size="14" font-weight="800" letter-spacing="2">TEXT TO SPEECH</text>
      <circle cx="280" cy="442" r="62" fill="url(#hadith-media-theme)"/><path d="M264 410l54 32-54 32Z" fill="#fff"/>
      <g class="v7-audio-wave">${[24,44,68,92,54,78,38,64].map((h,i)=>`<rect x="${380+i*25}" y="${442-h/2}" width="11" height="${h}" rx="6" fill="${i%2?theme:'#7dd3fc'}"/>`).join('')}</g>
      <text x="222" y="548" fill="#e0f2fe" font-family="Manrope" font-size="16">Daily reading · 02:14</text>
      <rect x="682" y="252" width="288" height="376" rx="34" fill="url(#hadith-media-theme)"/>
      <circle cx="826" cy="352" r="70" fill="#fff" opacity=".16"/>
      <text x="826" y="368" text-anchor="middle" fill="#fff" font-family="Georgia" font-size="70">“</text>
      <text x="826" y="462" text-anchor="middle" fill="#fff" font-family="Georgia" font-size="21">A calm reminder</text>
      <text x="826" y="493" text-anchor="middle" fill="#fff" font-family="Georgia" font-size="21">for the day ahead.</text>
      <rect x="726" y="546" width="200" height="44" rx="22" fill="#fff" opacity=".18"/><text x="826" y="574" text-anchor="middle" fill="#fff" font-family="Manrope" font-size="14" font-weight="800">SHARE VISUAL CARD</text>
      <g class="v7-calendar-chip"><rect x="720" y="668" width="242" height="58" rx="20" fill="#fff" opacity=".92"/><rect x="742" y="681" width="32" height="32" rx="9" fill="${theme}" opacity=".16"/><text x="750" y="703" fill="${theme}" font-family="Sora" font-size="13" font-weight="800">15</text><text x="792" y="701" fill="#1e3a5f" font-family="Manrope" font-size="14" font-weight="800">Next holy day</text><text x="792" y="717" fill="#64748b" font-family="Manrope" font-size="11">Islamic calendar reminder</text></g>
    </g>
  `);
}

function tinySchedules(theme) {
  return frame('tiny-schedules', theme, 'TinySteps flexible daily and weekly habit schedules', `
    <g filter="url(#tiny-schedules-shadow)">
      <rect x="126" y="108" width="948" height="646" rx="44" fill="#f7fff8" stroke="#dcefe0"/>
      <text x="182" y="178" fill="#102a18" font-family="Sora" font-size="34" font-weight="700">A schedule that fits the habit</text>
      <text x="182" y="212" fill="#5f7465" font-family="Manrope" font-size="17">Every day, selected days or a weekly frequency.</text>
      <rect x="180" y="270" width="616" height="402" rx="34" fill="#fff" stroke="#dcefe0"/>
      <text x="222" y="322" fill="#102a18" font-family="Sora" font-size="22" font-weight="700">Morning walk</text>
      <text x="222" y="352" fill="#718078" font-family="Manrope" font-size="15">Target · 4 times per week</text>
      ${['MON','TUE','WED','THU','FRI','SAT','SUN'].map((d,i)=>`<g class="v7-day-chip v7-delay-${i%4}"><rect x="${220+i*76}" y="392" width="58" height="64" rx="18" fill="${[0,2,4,6].includes(i)?theme:'#eef5ef'}"/><text x="${249+i*76}" y="416" text-anchor="middle" fill="${[0,2,4,6].includes(i)?'#fff':'#718078'}" font-family="Manrope" font-size="11" font-weight="800">${d}</text>${[0,2,4,6].includes(i)?`<path d="M238 ${438}l8 8 15-18" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`:`<circle cx="${249+i*76}" cy="440" r="8" fill="#cbd8ce"/>`}</g>`).join('')}
      <rect x="220" y="500" width="528" height="108" rx="26" fill="#f3faf4"/>
      <text x="250" y="538" fill="#718078" font-family="Manrope" font-size="13" font-weight="800">WEEKLY TARGET</text>
      <text x="250" y="582" fill="#102a18" font-family="Sora" font-size="30" font-weight="800">4 / 4 completed</text>
      <rect x="546" y="542" width="160" height="18" rx="9" fill="#d9e7db"/><rect class="v7-habit-progress" x="546" y="542" width="160" height="18" rx="9" fill="url(#tiny-schedules-theme)"/>
      <g class="v7-schedule-modes">
        ${[['DAILY','Every day'],['SELECTED','Specific days'],['FLEXIBLE','X times weekly']].map(([title,desc],i)=>`<g class="v7-schedule-mode v7-delay-${i}"><rect x="836" y="${294+i*126}" width="178" height="96" rx="24" fill="${i===2?theme:'#fff'}" stroke="${i===2?theme:'#dcefe0'}"/><text x="858" y="${330+i*126}" fill="${i===2?'#fff':'#102a18'}" font-family="Sora" font-size="15" font-weight="800">${title}</text><text x="858" y="${356+i*126}" fill="${i===2?'#dcfce7':'#718078'}" font-family="Manrope" font-size="13">${desc}</text></g>`).join('')}
      </g>
    </g>
  `);
}

function tinyReminders(theme) {
  return frame('tiny-reminders', theme, 'TinySteps smart reminder scheduling', `
    <g filter="url(#tiny-reminders-shadow)">
      <rect x="126" y="108" width="948" height="646" rx="44" fill="#f7fff8" stroke="#dcefe0"/>
      <text x="182" y="178" fill="#102a18" font-family="Sora" font-size="34" font-weight="700">Prompts that match the real week</text>
      <text x="182" y="212" fill="#5f7465" font-family="Manrope" font-size="17">Local reminders can follow different times on different days.</text>
      <rect x="180" y="274" width="574" height="390" rx="34" fill="#fff" stroke="#dcefe0"/>
      <text x="222" y="326" fill="#102a18" font-family="Sora" font-size="22" font-weight="700">Read for 20 minutes</text>
      ${[['Monday','07:30',true],['Tuesday','20:00',true],['Wednesday','07:30',true],['Thursday','OFF',false],['Friday','18:15',true]].map(([day,time,on],i)=>`<g class="v7-reminder-row v7-delay-${i%4}"><rect x="216" y="${360+i*56}" width="504" height="44" rx="15" fill="#f4faf5"/><text x="238" y="${388+i*56}" fill="#405448" font-family="Manrope" font-size="15" font-weight="700">${day}</text><text x="614" y="${388+i*56}" text-anchor="end" fill="${on?theme:'#9aa8a0'}" font-family="Sora" font-size="15" font-weight="800">${time}</text><rect x="646" y="${370+i*56}" width="50" height="24" rx="12" fill="${on?theme:'#d7e3d9'}"/><circle class="v7-toggle-knob" cx="${on?684:658}" cy="${382+i*56}" r="9" fill="#fff"/></g>`).join('')}
      <g class="v7-notification-stack">
        <rect x="808" y="304" width="220" height="118" rx="28" fill="#fff" stroke="#dcefe0"/>
        <circle cx="850" cy="356" r="24" fill="${theme}" opacity=".15"/><path d="M850 337c-11 0-18 8-18 19v10l-7 9h50l-7-9v-10c0-11-7-19-18-19Zm-7 42c1 7 13 7 14 0" fill="none" stroke="${theme}" stroke-width="4"/>
        <text x="886" y="348" fill="#102a18" font-family="Sora" font-size="16" font-weight="800">TinySteps</text><text x="886" y="374" fill="#718078" font-family="Manrope" font-size="13">Time to read</text>
        <rect x="808" y="448" width="220" height="118" rx="28" fill="#fff" stroke="#dcefe0" opacity=".85"/>
        <circle cx="850" cy="500" r="24" fill="#f59e0b" opacity=".15"/><text x="850" y="507" text-anchor="middle" fill="#a16207" font-family="Sora" font-size="18" font-weight="800">2</text><text x="886" y="492" fill="#102a18" font-family="Sora" font-size="16" font-weight="800">2 habits left</text><text x="886" y="518" fill="#718078" font-family="Manrope" font-size="13">Keep the streak alive</text>
        <circle class="v7-reminder-pulse" cx="918" cy="626" r="44" fill="${theme}" opacity=".1"/><circle class="v7-reminder-pulse v7-delay-1" cx="918" cy="626" r="24" fill="${theme}" opacity=".22"/><circle cx="918" cy="626" r="9" fill="${theme}"/>
      </g>
    </g>
  `);
}

function tinyWidget(theme) {
  return frame('tiny-widget', theme, 'TinySteps interactive home screen widget', `
    <g filter="url(#tiny-widget-shadow)">
      <rect x="126" y="108" width="948" height="646" rx="44" fill="#f7fff8" stroke="#dcefe0"/>
      <text x="182" y="178" fill="#102a18" font-family="Sora" font-size="34" font-weight="700">Complete the habit from the home screen</text>
      <text x="182" y="212" fill="#5f7465" font-family="Manrope" font-size="17">The widget removes the trip through the full app.</text>
      <rect x="198" y="270" width="420" height="420" rx="54" fill="#13281a"/>
      <circle cx="252" cy="324" r="16" fill="#fbbf24"/><text x="286" y="332" fill="#fff" font-family="Sora" font-size="20" font-weight="700">Home screen</text>
      <g opacity=".75">${[[244,388],[318,388],[392,388],[466,388],[540,388],[244,462],[318,462],[392,462],[466,462],[540,462]].map(([x,y],i)=>`<rect x="${x}" y="${y}" width="46" height="46" rx="15" fill="${i%3===0?theme:'#34513d'}" opacity="${i%3===0?'.7':'.55'}"/>`).join('')}</g>
      <g class="v7-widget-card">
        <rect x="236" y="532" width="344" height="126" rx="32" fill="#f7fff8"/>
        <text x="264" y="570" fill="#718078" font-family="Manrope" font-size="12" font-weight="800">TODAY · 3 OF 4</text>
        <circle cx="286" cy="614" r="24" fill="${theme}"/>
        <path class="v7-widget-check" d="M274 614l8 8 16-19" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="326" y="608" fill="#102a18" font-family="Sora" font-size="17" font-weight="800">Morning walk</text>
        <text x="326" y="632" fill="#718078" font-family="Manrope" font-size="13">Tap once to complete</text>
      </g>
      <path class="v7-widget-route" d="M650 510C716 510 730 434 796 434" fill="none" stroke="${theme}" stroke-width="6" stroke-linecap="round" stroke-dasharray="12 14"/>
      <g class="v7-complete-card"><rect x="796" y="354" width="220" height="162" rx="34" fill="#fff" stroke="#dcefe0"/><circle cx="906" cy="408" r="34" fill="#dcfce7"/><path d="M888 408l12 12 25-30" fill="none" stroke="#16a34a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><text x="906" y="468" text-anchor="middle" fill="#102a18" font-family="Sora" font-size="18" font-weight="800">Habit complete</text><text x="906" y="492" text-anchor="middle" fill="#718078" font-family="Manrope" font-size="13">Streak updated instantly</text></g>
    </g>
  `);
}

function tinyStats(theme) {
  return frame('tiny-stats', theme, 'TinySteps weekly progress monthly consistency and streak statistics', `
    <g filter="url(#tiny-stats-shadow)">
      <rect x="126" y="108" width="948" height="646" rx="44" fill="#f7fff8" stroke="#dcefe0"/>
      <text x="182" y="178" fill="#102a18" font-family="Sora" font-size="34" font-weight="700">Consistency without a confusing dashboard</text>
      <text x="182" y="212" fill="#5f7465" font-family="Manrope" font-size="17">Weekly progress, monthly patterns and meaningful streaks.</text>
      <rect x="180" y="270" width="510" height="396" rx="34" fill="#fff" stroke="#dcefe0"/>
      <text x="222" y="320" fill="#102a18" font-family="Sora" font-size="21" font-weight="700">Monthly consistency</text>
      <text x="600" y="320" text-anchor="end" fill="${theme}" font-family="Sora" font-size="24" font-weight="800">82%</text>
      <g class="v7-heatmap">${Array.from({length:35},(_,i)=>{const x=222+(i%7)*58,y=360+Math.floor(i/7)*54;const level=(i*7+3)%5;return `<rect class="v7-heat-cell v7-delay-${i%4}" x="${x}" y="${y}" width="40" height="38" rx="11" fill="${level===0?'#e7f0e9':theme}" opacity="${level===0?'.8':(.25+level*.16).toFixed(2)}"/>`}).join('')}</g>
      <rect x="222" y="632" width="420" height="10" rx="5" fill="#e1ece3"/><rect class="v7-consistency-bar" x="222" y="632" width="344" height="10" rx="5" fill="url(#tiny-stats-theme)"/>
      <g class="v7-stat-cards">
        <rect x="730" y="270" width="290" height="118" rx="30" fill="${theme}"/>
        <text x="762" y="312" fill="#dcfce7" font-family="Manrope" font-size="13" font-weight="800">LONGEST STREAK</text><text x="762" y="360" fill="#fff" font-family="Sora" font-size="46" font-weight="800">24 days</text>
        <rect x="730" y="412" width="290" height="118" rx="30" fill="#fff" stroke="#dcefe0"/>
        <text x="762" y="454" fill="#718078" font-family="Manrope" font-size="13" font-weight="800">MOST CONSISTENT</text><text x="762" y="496" fill="#102a18" font-family="Sora" font-size="25" font-weight="800">Drink water</text>
        <rect x="730" y="554" width="290" height="112" rx="30" fill="#fff" stroke="#dcefe0"/>
        <text x="762" y="596" fill="#718078" font-family="Manrope" font-size="13" font-weight="800">WEEKLY COMPLETION</text>
        <g class="v7-mini-bars">${[62,84,72,94,78,88,100].map((h,i)=>`<rect x="${764+i*31}" y="${646-h*.5}" width="18" height="${h*.5}" rx="9" fill="${i===6?theme:'#bbd8c0'}"/>`).join('')}</g>
      </g>
    </g>
  `);
}

export function renderProductVisual(name, theme) {
  const scenes = {
    stockCatalog,
    stockMovement,
    stockInsights,
    stockOffline,
    arrowMemory,
    arrowPressure,
    arrowBoosters,
    arrowProgression,
    hadithDaily,
    hadithPrayer,
    hadithTools,
    hadithMedia,
    tinySchedules,
    tinyReminders,
    tinyWidget,
    tinyStats,
  };
  return (scenes[name] || stockInsights)(theme);
}
