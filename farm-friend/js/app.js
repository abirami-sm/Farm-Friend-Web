/* ==========================================================================
   Farm Friend — App logic
   A client-side SPA. State persists to localStorage so a demo farmer's
   profile and prediction history survive a page refresh. Swap the mock
   model calls in data.js for real fetch() calls when a backend exists —
   nothing here needs to change beyond the request itself.
   ========================================================================== */

const STORAGE_KEY = "farmfriend_state_v1";

const state = {
  loggedIn: false,
  farmer: null,
  pendingLogin: null, // {name, mobile}
  predictions: { disease: [], disaster: [], soil: [] },
  route: "dashboard",
  currentImageDataUrl: null
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/* ---------------------------------------------------------------------- */
/* Persistence                                                             */
/* ---------------------------------------------------------------------- */

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      farmer: state.farmer,
      predictions: state.predictions,
      loggedIn: state.loggedIn
    }));
  } catch (e) { /* storage unavailable — demo continues without persistence */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.farmer) state.farmer = saved.farmer;
    if (saved.predictions) state.predictions = saved.predictions;
    if (saved.loggedIn) state.loggedIn = true;
  } catch (e) { /* ignore corrupt storage */ }
}

/* ---------------------------------------------------------------------- */
/* Screen navigation (landing / login / otp / profile-setup / app)         */
/* ---------------------------------------------------------------------- */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------------------------------------------------------------------- */
/* Init                                                                    */
/* ---------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  populateSelects();
  initLanguage();
  wireLandingAndAuth();
  wireProfileForm();
  wireAppShell();

  if (state.loggedIn && state.farmer) {
    enterApp();
  } else {
    showScreen("screen-landing");
  }
});

function populateSelects() {
  fillOptions("p-state", STATES_INDIA);
  fillOptions("p-district", TN_DISTRICTS);
  fillOptions("p-current-crop", CROPS);
  fillOptions("p-previous-crop", CROPS, true);
  fillOptions("p-irrigation", IRRIGATION_TYPES);
  fillOptions("p-soil-type", SOIL_TYPES, true);

  const chipGroup = document.getElementById("p-farming-method-group");
  chipGroup.innerHTML = FARMING_METHODS.map(m =>
    `<button type="button" class="chip" data-value="${m}">${m}</button>`
  ).join("");
  chipGroup.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      chipGroup.querySelectorAll(".chip").forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
    });
  });
}

function fillOptions(id, list, keepFirst) {
  const el = document.getElementById(id);
  const existing = keepFirst ? el.innerHTML : "";
  el.innerHTML = existing + list.map(v => `<option value="${v}">${v}</option>`).join("");
}

/* ---------------------------------------------------------------------- */
/* Landing + Auth wiring                                                   */
/* ---------------------------------------------------------------------- */

function wireLandingAndAuth() {
  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => showScreen("screen-" + btn.dataset.nav));
  });
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const el = document.getElementById(btn.dataset.scroll);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.getElementById("btn-fill-demo").addEventListener("click", () => {
    document.getElementById("login-name").value = DEMO_FARMER.name;
    document.getElementById("login-mobile").value = DEMO_FARMER.mobile;
  });

  document.getElementById("btn-send-otp").addEventListener("click", () => {
    const name = document.getElementById("login-name").value.trim();
    const mobile = document.getElementById("login-mobile").value.trim();
    const errEl = document.getElementById("login-error");
    if (!name) return showError(errEl, "Please enter your name.");
    if (!/^\d{10}$/.test(mobile)) return showError(errEl, "Please enter a valid 10-digit mobile number.");
    errEl.style.display = "none";
    state.pendingLogin = { name, mobile };
    document.getElementById("otp-mobile-display").textContent = mobile;
    document.querySelectorAll(".otp-digit").forEach(i => i.value = "");
    showScreen("screen-otp");
    setTimeout(() => document.querySelector(".otp-digit").focus(), 50);
  });

  const otpInputs = document.querySelectorAll(".otp-digit");
  otpInputs.forEach((inp, idx) => {
    inp.addEventListener("input", () => {
      inp.value = inp.value.replace(/\D/g, "");
      if (inp.value && idx < otpInputs.length - 1) otpInputs[idx + 1].focus();
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !inp.value && idx > 0) otpInputs[idx - 1].focus();
    });
  });

  document.getElementById("btn-verify-otp").addEventListener("click", () => {
    const code = Array.from(otpInputs).map(i => i.value).join("");
    const errEl = document.getElementById("otp-error");
    if (code.length < 5) return showError(errEl, "Enter the full 5-digit OTP.");
    if (code !== DEMO_OTP) return showError(errEl, "Incorrect OTP. For this prototype, use 12345.");
    errEl.style.display = "none";

    // Existing demo user with a saved profile? Skip straight to dashboard.
    if (state.farmer && state.farmer.mobile === state.pendingLogin.mobile) {
      state.loggedIn = true;
      saveState();
      enterApp();
      return;
    }
    document.getElementById("p-name").value = state.pendingLogin.name;
    document.getElementById("p-mobile").value = state.pendingLogin.mobile;
    showScreen("screen-profile-setup");
  });

  document.getElementById("btn-fill-demo-profile").addEventListener("click", () => {
    const f = DEMO_FARMER;
    document.getElementById("p-name").value = f.name;
    document.getElementById("p-mobile").value = f.mobile;
    document.getElementById("p-state").value = f.state;
    document.getElementById("p-district").value = f.district;
    document.getElementById("p-village").value = f.village;
    document.getElementById("p-land-area").value = f.landArea;
    document.getElementById("p-land-unit").value = f.landUnit;
    document.getElementById("p-current-crop").value = f.currentCrop;
    document.getElementById("p-previous-crop").value = f.previousCrop;
    document.getElementById("p-experience").value = f.experience;
    document.getElementById("p-irrigation").value = f.irrigation;
    document.getElementById("p-soil-type").value = f.soilType;
    document.getElementById("p-water-source").value = f.waterSource;
    document.querySelectorAll("#p-farming-method-group .chip").forEach(c => {
      c.classList.toggle("selected", c.dataset.value === f.farmingMethod);
    });
  });
}

function showError(el, msg) {
  el.textContent = msg;
  el.style.display = "block";
}

/* ---------------------------------------------------------------------- */
/* Profile form                                                            */
/* ---------------------------------------------------------------------- */

function wireProfileForm() {
  document.getElementById("profile-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const method = document.querySelector("#p-farming-method-group .chip.selected");
    state.farmer = {
      name: document.getElementById("p-name").value.trim(),
      mobile: document.getElementById("p-mobile").value.trim(),
      state: document.getElementById("p-state").value,
      district: document.getElementById("p-district").value,
      village: document.getElementById("p-village").value.trim(),
      landArea: document.getElementById("p-land-area").value,
      landUnit: document.getElementById("p-land-unit").value,
      currentCrop: document.getElementById("p-current-crop").value,
      previousCrop: document.getElementById("p-previous-crop").value,
      experience: document.getElementById("p-experience").value,
      irrigation: document.getElementById("p-irrigation").value,
      soilType: document.getElementById("p-soil-type").value,
      waterSource: document.getElementById("p-water-source").value.trim(),
      farmingMethod: method ? method.dataset.value : ""
    };
    state.loggedIn = true;
    saveState();
    toast("Profile saved");
    enterApp();
  });
}

/* ---------------------------------------------------------------------- */
/* App shell                                                               */
/* ---------------------------------------------------------------------- */

function wireAppShell() {
  document.querySelectorAll("#sidebar-nav .nav-item, #bottom-nav-row button").forEach(btn => {
    btn.addEventListener("click", () => navigate(btn.dataset.route));
  });
  document.getElementById("btn-logout").addEventListener("click", () => {
    state.loggedIn = false;
    saveState();
    showScreen("screen-landing");
  });
}

function enterApp() {
  showScreen("screen-app");
  document.getElementById("avatar-name").textContent = state.farmer.name.split(" ")[0];
  document.getElementById("avatar-initial").textContent = state.farmer.name.charAt(0).toUpperCase();
  navigate("dashboard");
  applyTranslations(document);
}

function navigate(route) {
  state.route = route;
  document.querySelectorAll("#sidebar-nav .nav-item, #bottom-nav-row button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.route === route);
  });
  const titles = {
    dashboard: "Dashboard", disease: "Disease Prediction", disaster: "Disaster Prediction",
    soil: "Soil Monitoring", alerts: "Farming Alerts", profile: "Farmer Profile", settings: "Settings"
  };
  document.getElementById("topbar-title").textContent = titles[route] || "Farm Friend";

  const renderers = {
    dashboard: renderDashboard, disease: renderDiseasePage, disaster: renderDisasterPage,
    soil: renderSoilPage, alerts: renderAlertsPage, profile: renderProfilePage, settings: renderSettingsPage
  };
  (renderers[route] || renderDashboard)();
  applyTranslations(document.getElementById("page-content"));
  document.getElementById("page-content").scrollTo?.(0, 0);
  window.scrollTo(0, 0);
}

const pageEl = () => document.getElementById("page-content");

/* ---------------------------------------------------------------------- */
/* Dashboard                                                                */
/* ---------------------------------------------------------------------- */

const DEMO_ALERTS = [
  { icon: "🌧", title: "Heavy Rain Alert", body: "Rainfall conditions may increase the risk of waterlogging. Check drainage." },
  { icon: "💧", title: "Low Rainfall Alert", body: "Rainfall is expected to remain low. Consider efficient water management." },
  { icon: "🌱", title: "Soil Moisture Alert", body: "Soil moisture is below the selected crop's preferred range." },
  { icon: "🦠", title: "Disease Risk Alert", body: "High humidity and rainfall may increase the risk of fungal disease. Monitor leaves regularly." }
];

function renderDashboard() {
  const f = state.farmer;
  pageEl().innerHTML = `
    <div class="welcome-card">
      <h2>Welcome, ${escapeHtml(f.name)}</h2>
      <div class="meta-row">
        <div class="meta-item"><div class="lbl">Location</div><div class="val">${escapeHtml(f.village)}, ${escapeHtml(f.district)}</div></div>
        <div class="meta-item"><div class="lbl">Land Area</div><div class="val">${escapeHtml(f.landArea)} ${escapeHtml(f.landUnit)}</div></div>
        <div class="meta-item"><div class="lbl">Current Crop</div><div class="val">${escapeHtml(f.currentCrop)}</div></div>
        <div class="meta-item"><div class="lbl">Irrigation</div><div class="val">${escapeHtml(f.irrigation)}</div></div>
      </div>
    </div>

    <div class="module-grid">
      <div class="module-card">
        <div class="icon">🌱</div>
        <h3>Disease Prediction</h3>
        <p>Upload a plant image and identify possible crop diseases.</p>
        <button class="btn btn-primary btn-sm" data-goto="disease">Open Disease Prediction</button>
      </div>
      <div class="module-card disaster">
        <div class="icon">🌦</div>
        <h3>Disaster Prediction</h3>
        <p>Monitor weather-related farming risks such as excessive rainfall and drought.</p>
        <button class="btn btn-primary btn-sm" data-goto="disaster">Open Disaster Prediction</button>
      </div>
      <div class="module-card soil">
        <div class="icon">🌾</div>
        <h3>Soil Monitoring</h3>
        <p>Analyze soil conditions and receive suitable crop recommendations.</p>
        <button class="btn btn-primary btn-sm" data-goto="soil">Open Soil Monitoring</button>
      </div>
    </div>

    <div class="dash-columns">
      <div class="card list-card">
        <div class="list-title">Recent Predictions</div>
        ${renderRecentPredictions()}
      </div>
      <div class="card list-card">
        <div class="list-title">Farming Alerts</div>
        ${DEMO_ALERTS.slice(0, 3).map(a => `
          <div class="alert-row">
            <div class="a-icon">${a.icon}</div>
            <div><div class="a-title">${a.title}</div><div class="a-body">${a.body}</div></div>
          </div>`).join("")}
      </div>
    </div>
  `;
  pageEl().querySelectorAll("[data-goto]").forEach(b => b.addEventListener("click", () => navigate(b.dataset.goto)));
}

function renderRecentPredictions() {
  const all = [
    ...state.predictions.disease.map(p => ({ type: "Disease", main: `${p.crop} — ${p.disease}`, sub: formatDate(p.time), badge: severityBadgeClass(p.severity), badgeText: p.severity })),
    ...state.predictions.disaster.map(p => ({ type: "Disaster", main: p.riskType, sub: formatDate(p.time), badge: riskBadgeClass(p.riskLevel), badgeText: p.riskLevel })),
    ...state.predictions.soil.map(p => ({ type: "Soil", main: `${p.recommendations[0]?.crop || "Analysis"} recommended`, sub: formatDate(p.time), badge: "badge-low", badgeText: "Analyzed" }))
  ].sort((a, b) => new Date(b.sub) - new Date(a.sub)).slice(0, 5);

  if (!all.length) {
    return `<div class="empty-state"><div class="icon">📋</div><p class="mb-0">No predictions yet. Run your first check from a module above.</p></div>`;
  }
  return all.map(p => `
    <div class="history-row">
      <div><div class="h-main">${escapeHtml(p.main)}</div><div class="h-sub">${p.type} · ${p.sub}</div></div>
      <span class="badge ${p.badge}">${p.badgeText}</span>
    </div>`).join("");
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" }) + " · " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function severityBadgeClass(sev) {
  return { Low: "badge-low", Medium: "badge-medium", High: "badge-high" }[sev] || "badge-low";
}
function riskBadgeClass(level) {
  return { Low: "badge-low", Moderate: "badge-moderate", High: "badge-high", Critical: "badge-critical" }[level] || "badge-low";
}

/* ---------------------------------------------------------------------- */
/* MODULE 1 — Disease Prediction page                                      */
/* ---------------------------------------------------------------------- */

function renderDiseasePage() {
  state.currentImageDataUrl = null;
  pageEl().innerHTML = `
    <div class="page-head">
      <h2>Disease Prediction</h2>
      <p class="muted">Upload a clear photo of the affected leaf or plant for the best result.</p>
    </div>
    <div class="card">
      <div class="field">
        <label>Crop</label>
        <select id="dz-crop">${CROPS.map(c => `<option value="${c}" ${c === state.farmer.currentCrop ? "selected" : ""}>${c}</option>`).join("")}</select>
      </div>
      <div id="dz-upload-area">
        <div class="upload-zone" id="dz-dropzone">
          <div class="icon">📷</div>
          <p class="mb-0"><strong>Click to upload</strong> or drag and drop a plant photo</p>
          <p class="hint">JPG or PNG, clear focus on the affected leaf</p>
        </div>
        <input type="file" id="dz-file-input" accept="image/*" style="display:none">
      </div>
      <button class="btn btn-primary btn-block mt-2" id="dz-predict-btn" disabled>Predict Disease</button>
    </div>
    <div id="dz-result-area" class="mt-2"></div>
  `;

  const dropzone = document.getElementById("dz-dropzone");
  const fileInput = document.getElementById("dz-file-input");
  const predictBtn = document.getElementById("dz-predict-btn");

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("drag"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag");
    if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) handleImageFile(fileInput.files[0]);
  });

  function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      state.currentImageDataUrl = reader.result;
      document.getElementById("dz-upload-area").innerHTML = `
        <div class="preview-wrap">
          <img src="${reader.result}" alt="Uploaded plant photo">
          <button class="remove-btn" id="dz-remove-btn" title="Remove image">✕</button>
        </div>`;
      document.getElementById("dz-remove-btn").addEventListener("click", () => renderDiseasePage());
      predictBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  predictBtn.addEventListener("click", async () => {
    const crop = document.getElementById("dz-crop").value;
    const resultArea = document.getElementById("dz-result-area");
    predictBtn.disabled = true;
    resultArea.innerHTML = `
      <div class="card loading-block">
        <div class="spinner"></div>
        <p class="mb-0">Analyzing image for ${escapeHtml(crop)} disease symptoms…</p>
      </div>`;
    const result = await predictDisease(crop, state.currentImageDataUrl);
    result.time = new Date().toISOString();
    state.predictions.disease.unshift(result);
    saveState();
    renderDiseaseResult(result, resultArea);
    predictBtn.disabled = false;
  });
}

function renderDiseaseResult(r, container) {
  const isHealthy = r.disease === "Healthy";
  container.innerHTML = `
    <div class="card">
      <div class="result-hero">
        <div>
          <div class="muted text-sm">Detected Disease</div>
          <div class="r-title">${escapeHtml(r.disease)}${isHealthy ? " 🌿" : ""}</div>
        </div>
        <span class="badge ${severityBadgeClass(r.severity)}">Severity: ${r.severity}</span>
      </div>
      <div class="text-sm muted">Confidence</div>
      <div class="confidence-bar"><div class="fill" style="width:${r.confidence}%"></div></div>
      <div class="text-sm">${r.confidence}%</div>

      ${r.lowQuality ? `<p class="text-sm muted mt-1">⚠️ Very little leaf was visible in this photo, so this result is unreliable. Please upload a closer, well-lit photo of the affected leaf.</p>` : ""}
      ${!isHealthy ? `
      <div class="mt-2">
        <div class="status-row"><div class="s-label">Basic symptoms</div></div>
        <p class="text-sm">${escapeHtml(r.symptoms)}</p>
        <div class="status-row"><div class="s-label">Possible cause</div></div>
        <p class="text-sm">${escapeHtml(r.cause)}</p>
      </div>

      <div class="section-title mt-2">Recommended Actions</div>
      <div class="tab-row">
        <button class="tab-btn active" data-tab="organic">Natural / Organic</button>
        <button class="tab-btn" data-tab="chemical">Chemical Management</button>
      </div>
      <div class="tab-panel active" data-panel="organic">
        <ul class="action-list">${r.organic.map(a => `<li>🌿 ${escapeHtml(a)}</li>`).join("")}</ul>
      </div>
      <div class="tab-panel" data-panel="chemical">
        ${r.chemicalAvailable ? `
          <div class="chem-card">
            <dl>
              <dt>Active ingredient</dt><dd>Consult a verified agri-input source for your region</dd>
              <dt>Purpose</dt><dd>Fungal/bacterial management for ${escapeHtml(r.disease)}</dd>
              <dt>Application</dt><dd>As directed on the approved product label</dd>
              <dt>Dosage / rate</dt><dd>Follow the product label and local agricultural guidance</dd>
              <dt>Precautions</dt><dd>Use protective equipment; observe pre-harvest interval on the label</dd>
            </dl>
          </div>
          <p class="text-sm muted">Follow the product label and consult a qualified agricultural expert before applying any pesticide.</p>
        ` : `<p class="text-sm muted">Verified chemical dosage information is not available for this case. Follow the product label and consult a qualified agricultural officer or agricultural expert before applying any pesticide.</p>`}
      </div>

      <div class="disclaimer-box">
        <strong>Disclaimer:</strong> This prediction is generated using an AI-based image analysis system and is intended only as preliminary agricultural guidance. The result may not always be accurate and should not be treated as a confirmed diagnosis. Before applying any pesticide, fungicide, insecticide, or other agricultural chemical, farmers should verify the recommendation using the product label and consult a qualified agricultural officer or agricultural expert. Always follow legally approved application instructions and safety precautions.
      </div>
      ` : `<p class="mt-1">No action needed right now — keep monitoring the plant regularly.</p>`}
    </div>
  `;

  container.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      container.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      container.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add("active");
    });
  });
}

/* ---------------------------------------------------------------------- */
/* MODULE 2 — Disaster Prediction page                                     */
/* ---------------------------------------------------------------------- */

function renderDisasterPage() {
  const currentMonth = new Date().getMonth();
  pageEl().innerHTML = `
    <div class="page-head">
      <h2>Disaster Prediction</h2>
      <p class="muted">Farming risk from rainfall and temperature patterns for ${escapeHtml(state.farmer.district)}, ${escapeHtml(state.farmer.state)}.</p>
    </div>
    <div class="card">
      <div class="field" style="max-width:260px;">
        <label>Check risk for month (demo data)</label>
        <select id="ds-month">${MONTHS.map((m, i) => `<option value="${i}" ${i === currentMonth ? "selected" : ""}>${m}</option>`).join("")}</select>
      </div>
      <button class="btn btn-primary" id="ds-check-btn">Check Disaster Risk</button>
    </div>
    <div id="ds-result-area" class="mt-2"></div>
  `;

  const run = async () => {
    const month = parseInt(document.getElementById("ds-month").value, 10);
    const resultArea = document.getElementById("ds-result-area");
    resultArea.innerHTML = `<div class="card loading-block"><div class="spinner"></div><p class="mb-0">Reading rainfall, temperature and forecast patterns…</p></div>`;
    const r = await predictDisaster(month, `${state.farmer.village}, ${state.farmer.district}`);
    r.time = new Date().toISOString();
    r.monthLabel = MONTHS[month];
    state.predictions.disaster.unshift(r);
    saveState();
    renderDisasterResult(r, resultArea);
  };

  document.getElementById("ds-check-btn").addEventListener("click", run);
  run();
}

function renderDisasterResult(r, container) {
  const levelClass = r.riskLevel.toLowerCase();
  const isFlood = r.riskType.includes("Excess");
  const isDrought = r.riskType.includes("Drought");
  const floodActions = ["Avoid unnecessary irrigation", "Improve field drainage", "Protect harvested crops from moisture", "Check for waterlogging in low-lying plots", "Delay fertilizer application until conditions dry", "Monitor for disease risk after prolonged wet conditions"];
  const droughtActions = ["Save and store available water", "Reduce non-essential irrigation", "Prefer drip or efficient irrigation methods", "Use mulching to retain soil moisture", "Monitor soil moisture regularly", "Prioritize water for critical crop growth stages"];

  container.innerHTML = `
    <div class="risk-hero ${levelClass}">
      <div class="r-type">${escapeHtml(r.riskType)} · ${r.monthLabel || ""}</div>
      <div class="r-level">${r.riskLevel} Risk</div>
    </div>
    <div class="metric-grid">
      <div class="metric-tile"><div class="m-label">Expected Rainfall</div><div class="m-value">${r.rainfall} mm</div></div>
      <div class="metric-tile"><div class="m-label">Temperature</div><div class="m-value">${r.temperature}°C</div></div>
      <div class="metric-tile"><div class="m-label">Humidity</div><div class="m-value">${r.humidity}%</div></div>
      <div class="metric-tile"><div class="m-label">Forecast Period</div><div class="m-value" style="font-size:1rem;">${r.forecastPeriod}</div></div>
    </div>
    <div class="card">
      <div class="section-title">Historical Comparison</div>
      <p class="text-sm">This month's rainfall (${r.rainfall} mm) is <strong>${r.historicalComparison}</strong> (12-month average: ${r.avgRainfall} mm) for ${escapeHtml(r.location)}.</p>

      <div class="section-title mt-2">Crop Impact</div>
      <p class="text-sm">${isFlood ? "Prolonged wet conditions can raise fungal disease pressure and delay field operations for " + escapeHtml(state.farmer.currentCrop) + "." : isDrought ? "Water stress during key growth stages can affect yield potential for " + escapeHtml(state.farmer.currentCrop) + "." : "Conditions are broadly favourable for " + escapeHtml(state.farmer.currentCrop) + " this period."}</p>

      <div class="section-title mt-2">Recommended Farming Action</div>
      <ul class="action-list">
        ${(isFlood ? floodActions : isDrought ? droughtActions : ["Continue routine monitoring", "Maintain normal irrigation schedule", "Watch weather updates for any change"]).map(a => `<li>✅ ${a}</li>`).join("")}
      </ul>
      <p class="text-sm muted mt-1">This is a predicted risk based on available data, not a certainty. Recommendations focus on water management and crop protection.</p>
    </div>
  `;
}

/* ---------------------------------------------------------------------- */
/* MODULE 3 — Soil Monitoring & Crop Recommendation page                   */
/* ---------------------------------------------------------------------- */

function renderSoilPage() {
  pageEl().innerHTML = `
    <div class="page-head">
      <h2>Soil Monitoring</h2>
      <p class="muted">Enter your soil and environment readings. No sensor connected? Enter values manually for this prototype.</p>
    </div>
    <div class="card">
      <div class="flex-between mb-0">
        <div class="section-title mb-0">Soil Parameters</div>
        <button class="btn btn-ghost btn-sm" id="sm-demo-btn">Use demo readings</button>
      </div>
      <div class="field-row">
        <div class="field"><label>Soil Type</label><select id="sm-soil-type">${SOIL_TYPES.map(s => `<option value="${s}">${s}</option>`).join("")}</select></div>
        <div class="field"><label>Soil Temperature (°C)</label><input id="sm-soil-temp" type="number" step="0.1"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Soil Moisture (%)</label><input id="sm-moisture" type="number" step="0.1"></div>
        <div class="field"><label>Soil pH</label><input id="sm-ph" type="number" step="0.1"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Nitrogen (N)</label><input id="sm-n" type="number" step="0.1"></div>
        <div class="field"><label>Phosphorus (P)</label><input id="sm-p" type="number" step="0.1"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Potassium (K)</label><input id="sm-k" type="number" step="0.1"></div>
        <div class="field"><label>Organic Carbon (%)</label><input id="sm-oc" type="number" step="0.01"></div>
      </div>
      <div class="field"><label>Electrical Conductivity — EC (dS/m)</label><input id="sm-ec" type="number" step="0.01"></div>

      <div class="section-title mt-2">Environmental Parameters</div>
      <div class="field-row">
        <div class="field"><label>Air Temperature (°C)</label><input id="sm-air-temp" type="number" step="0.1"></div>
        <div class="field"><label>Humidity (%)</label><input id="sm-humidity" type="number" step="0.1"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Rainfall (mm)</label><input id="sm-rainfall" type="number" step="0.1"></div>
        <div class="field"><label>Irrigation Availability</label>
          <select id="sm-irrigation-avail"><option>Available</option><option>Limited</option><option>Not Available</option></select>
        </div>
      </div>

      <button class="btn btn-primary btn-block mt-1" id="sm-analyze-btn">Analyze Soil</button>
    </div>
    <div id="sm-result-area" class="mt-2"></div>
  `;

  document.getElementById("sm-demo-btn").addEventListener("click", () => {
    const d = DEMO_SOIL_VALUES;
    document.getElementById("sm-soil-type").value = d.soilType;
    document.getElementById("sm-soil-temp").value = d.soilTemp;
    document.getElementById("sm-moisture").value = d.moisture;
    document.getElementById("sm-ph").value = d.ph;
    document.getElementById("sm-n").value = d.n;
    document.getElementById("sm-p").value = d.p;
    document.getElementById("sm-k").value = d.k;
    document.getElementById("sm-oc").value = d.oc;
    document.getElementById("sm-ec").value = d.ec;
    document.getElementById("sm-air-temp").value = d.airTemp;
    document.getElementById("sm-humidity").value = d.humidity;
    document.getElementById("sm-rainfall").value = d.rainfall;
    document.getElementById("sm-irrigation-avail").value = d.irrigationAvailability;
  });

  document.getElementById("sm-analyze-btn").addEventListener("click", async () => {
    const inputs = {
      soilType: document.getElementById("sm-soil-type").value,
      soilTemp: parseFloat(document.getElementById("sm-soil-temp").value),
      moisture: parseFloat(document.getElementById("sm-moisture").value),
      ph: parseFloat(document.getElementById("sm-ph").value),
      n: parseFloat(document.getElementById("sm-n").value),
      p: parseFloat(document.getElementById("sm-p").value),
      k: parseFloat(document.getElementById("sm-k").value),
      oc: parseFloat(document.getElementById("sm-oc").value),
      ec: parseFloat(document.getElementById("sm-ec").value),
      airTemp: parseFloat(document.getElementById("sm-air-temp").value),
      humidity: parseFloat(document.getElementById("sm-humidity").value),
      rainfall: parseFloat(document.getElementById("sm-rainfall").value)
    };
    const resultArea = document.getElementById("sm-result-area");
    resultArea.innerHTML = `<div class="card loading-block"><div class="spinner"></div><p class="mb-0">Analyzing soil health and matching suitable crops…</p></div>`;
    const r = await analyzeSoil(inputs);
    r.time = new Date().toISOString();
    state.predictions.soil.unshift(r);
    saveState();
    renderSoilResult(r, resultArea);
  });
}

const SOIL_EXPLANATIONS = {
  ph: { Low: "Soil may be more acidic than most crops prefer.", Optimal: "pH is in a good range for most crops.", High: "Soil may be more alkaline than most crops prefer." },
  moisture: { Low: "Soil moisture may be insufficient for healthy root growth.", Optimal: "Moisture level looks suitable for most crops.", High: "Soil may be waterlogged — check drainage." },
  n: { Low: "Your soil may require nitrogen management for crops with higher nitrogen demand.", Optimal: "Nitrogen level looks adequate.", High: "Nitrogen is on the higher side — avoid over-fertilizing." },
  p: { Low: "Phosphorus may be limiting for root and flower development.", Optimal: "Phosphorus level looks adequate.", High: "Phosphorus is on the higher side." },
  k: { Low: "Potassium may be limiting for fruit quality and disease resistance.", Optimal: "Potassium level looks adequate.", High: "Potassium is on the higher side." },
  oc: { Low: "Organic matter is low — consider compost or organic manure.", Optimal: "Organic matter level looks healthy.", High: "Organic matter is rich — good for soil structure." },
  ec: { Low: "Salinity is low, generally not a concern.", Optimal: "Electrical conductivity is in a normal range.", High: "Salinity may be elevated — monitor for salt stress." }
};

function renderSoilResult(r, container) {
  const labels = { ph: "Soil pH", moisture: "Moisture", n: "Nitrogen", p: "Phosphorus", k: "Potassium", oc: "Organic Matter", ec: "Salinity / EC" };
  const rows = Object.keys(labels).map(key => {
    const status = r.health[key];
    if (!status) return "";
    return `
      <div class="status-row">
        <div><div class="s-label">${labels[key]}: ${status}</div><div class="s-note">${SOIL_EXPLANATIONS[key][status]}</div></div>
        <span class="badge ${status === "Optimal" ? "badge-low" : status === "Low" ? "badge-moderate" : "badge-high"}">${status}</span>
      </div>`;
  }).join("");

  const comparisonRows = r.recommendations.map(c => `
    <tr>
      <td>${c.crop}</td>
      <td>${c.suitability}</td>
      <td>${c.water}</td>
      <td>${c.growth}</td>
    </tr>`).join("");

  const cropCards = r.recommendations.slice(0, 4).map(c => `
    <div class="crop-rec-card">
      <div class="flex-between mb-0"><h4 class="mb-0">${c.crop}</h4><span class="badge ${c.suitability === "Highly Suitable" ? "badge-low" : c.suitability === "Suitable" ? "badge-moderate" : "badge-high"}">${c.suitability}</span></div>
      <div class="req-row"><span class="muted">Water requirement</span><span>${c.water}</span></div>
      <div class="req-row"><span class="muted">Temperature range</span><span>${c.tempRange[0]}–${c.tempRange[1]}°C</span></div>
      <div class="req-row"><span class="muted">Soil preference</span><span>${c.soil.join(", ")}</span></div>
      <div class="req-row"><span class="muted">Growth period</span><span>${c.growth}</span></div>
    </div>`).join("");

  container.innerHTML = `
    <div class="card">
      <div class="section-title">Soil Health Summary</div>
      ${rows || `<p class="text-sm muted">Enter more soil values above for a fuller health summary.</p>`}
      <p class="text-sm muted mt-1">Status is estimated from the values entered — not exact lab measurements unless sourced from real lab or sensor data.</p>
    </div>

    <div class="card mt-2">
      <div class="section-title">Recommended Crops</div>
      <div class="crop-card-grid">${cropCards}</div>
    </div>

    <div class="card mt-2">
      <div class="section-title">Smart Crop Comparison</div>
      <div class="table-scroll">
        <table class="crop-table">
          <thead><tr><th>Crop</th><th>Suitability</th><th>Water Need</th><th>Growth Period</th></tr></thead>
          <tbody>${comparisonRows}</tbody>
        </table>
      </div>
      <p class="text-sm muted mt-1">Values are generated from the available demo dataset/model — recommended based on the inputs provided, not a guarantee of yield or growth speed.</p>
    </div>
  `;
}

/* ---------------------------------------------------------------------- */
/* Alerts page                                                             */
/* ---------------------------------------------------------------------- */

function renderAlertsPage() {
  pageEl().innerHTML = `
    <div class="page-head"><h2>Farming Alerts</h2><p class="muted">Notifications based on recent weather and field conditions.</p></div>
    <div class="card">
      ${DEMO_ALERTS.map(a => `
        <div class="alert-row">
          <div class="a-icon">${a.icon}</div>
          <div><div class="a-title">${a.title}</div><div class="a-body">${a.body}</div></div>
        </div>`).join("")}
    </div>
  `;
}

/* ---------------------------------------------------------------------- */
/* Profile page (view + edit)                                              */
/* ---------------------------------------------------------------------- */

function renderProfilePage() {
  const f = state.farmer;
  pageEl().innerHTML = `
    <div class="page-head"><h2>Farmer Profile</h2></div>
    <div class="card">
      <div class="status-row"><div class="s-label">Name</div><div>${escapeHtml(f.name)}</div></div>
      <div class="status-row"><div class="s-label">Mobile</div><div>${escapeHtml(f.mobile)}</div></div>
      <div class="status-row"><div class="s-label">Location</div><div>${escapeHtml(f.village)}, ${escapeHtml(f.district)}, ${escapeHtml(f.state)}</div></div>
      <div class="status-row"><div class="s-label">Land Area</div><div>${escapeHtml(f.landArea)} ${escapeHtml(f.landUnit)}</div></div>
      <div class="status-row"><div class="s-label">Current Crop</div><div>${escapeHtml(f.currentCrop)}</div></div>
      <div class="status-row"><div class="s-label">Previous Crop</div><div>${escapeHtml(f.previousCrop || "—")}</div></div>
      <div class="status-row"><div class="s-label">Farming Experience</div><div>${escapeHtml(f.experience)} years</div></div>
      <div class="status-row"><div class="s-label">Irrigation Type</div><div>${escapeHtml(f.irrigation)}</div></div>
      <div class="status-row"><div class="s-label">Soil Type</div><div>${escapeHtml(f.soilType || "—")}</div></div>
      <div class="status-row"><div class="s-label">Water Source</div><div>${escapeHtml(f.waterSource || "—")}</div></div>
      <div class="status-row"><div class="s-label">Farming Method</div><div>${escapeHtml(f.farmingMethod || "—")}</div></div>
    </div>
    <button class="btn btn-secondary mt-2" id="btn-edit-profile">Edit Profile</button>
  `;
  document.getElementById("btn-edit-profile").addEventListener("click", () => {
    // Prefill the profile-setup form with current values and reuse that screen.
    document.getElementById("p-name").value = f.name;
    document.getElementById("p-mobile").value = f.mobile;
    document.getElementById("p-state").value = f.state;
    document.getElementById("p-district").value = f.district;
    document.getElementById("p-village").value = f.village;
    document.getElementById("p-land-area").value = f.landArea;
    document.getElementById("p-land-unit").value = f.landUnit;
    document.getElementById("p-current-crop").value = f.currentCrop;
    document.getElementById("p-previous-crop").value = f.previousCrop || "";
    document.getElementById("p-experience").value = f.experience;
    document.getElementById("p-irrigation").value = f.irrigation;
    document.getElementById("p-soil-type").value = f.soilType || "";
    document.getElementById("p-water-source").value = f.waterSource || "";
    document.querySelectorAll("#p-farming-method-group .chip").forEach(c => {
      c.classList.toggle("selected", c.dataset.value === f.farmingMethod);
    });
    showScreen("screen-profile-setup");
  });
}

/* ---------------------------------------------------------------------- */
/* Settings page                                                           */
/* ---------------------------------------------------------------------- */

function renderSettingsPage() {
  pageEl().innerHTML = `
    <div class="page-head"><h2>Settings</h2></div>
    <div class="card">
      <div class="status-row"><div class="s-label">Land Area Unit</div><div>${escapeHtml(state.farmer.landUnit)}</div></div>
      <div class="status-row"><div class="s-label">Notifications</div><div>Farming alerts enabled</div></div>
      <div class="status-row"><div class="s-label">App Version</div><div>Prototype 1.0 (demo mode)</div></div>
    </div>
    <div class="card mt-2">
      <div class="section-title">About Farm Friend</div>
      <p class="text-sm">Farm Friend is an agricultural decision-support prototype. Predictions are AI-generated guidance and are not guarantees of disease diagnosis, disaster outcome, or crop yield. Always confirm important decisions with a qualified agricultural expert.</p>
    </div>
    <button class="btn btn-secondary mt-2" id="btn-clear-history">Clear Prediction History</button>
  `;
  document.getElementById("btn-clear-history").addEventListener("click", () => {
    state.predictions = { disease: [], disaster: [], soil: [] };
    saveState();
    toast("Prediction history cleared");
  });
}

/* ---------------------------------------------------------------------- */
/* Utilities                                                                */
/* ---------------------------------------------------------------------- */

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
