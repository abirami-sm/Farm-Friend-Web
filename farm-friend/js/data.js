/* ==========================================================================
   Farm Friend — Demo Data & Mock AI Layer
   --------------------------------------------------------------------------
   This file plays the role of (a) a seed dataset and (b) a stand-in for the
   three trained models described in the project brief. Every function below
   is written so it can be swapped for a real API call later without
   touching app.js — see the comment above each "model" function.

   Real deployment would replace:
     - predictDisease()   -> POST /api/predict/disease   (CNN / EfficientNet)
     - predictDisaster()  -> POST /api/predict/disaster  (RandomForest/LSTM)
     - analyzeSoil()      -> POST /api/predict/soil       (classifier + rules)
   with fetch() calls returning the same shaped objects.
   ========================================================================== */

const DEMO_OTP = "12345";

/* ---------------------------------------------------------------------- */
/* Reference lists                                                        */
/* ---------------------------------------------------------------------- */

const STATES_INDIA = [
  "Tamil Nadu", "Andhra Pradesh", "Karnataka", "Kerala", "Telangana",
  "Maharashtra", "Punjab", "Uttar Pradesh", "Gujarat", "Odisha", "Other"
];

const TN_DISTRICTS = [
  "Coimbatore", "Erode", "Salem", "Madurai", "Thanjavur", "Tiruchirappalli",
  "Dindigul", "Villupuram", "Tirunelveli", "Virudhunagar", "Other"
];

const CROPS = [
  "Tomato", "Potato", "Rice", "Wheat", "Groundnut", "Onion",
  "Carrot", "Sugarcane", "Maize", "Cotton", "Chilli", "Brinjal"
];

const IRRIGATION_TYPES = ["Rain-fed", "Borewell", "Canal", "Drip", "Sprinkler", "Other"];
const SOIL_TYPES = ["Red Soil", "Black Soil", "Alluvial Soil", "Laterite Soil", "Sandy Loam", "Clay Loam"];
const FARMING_METHODS = ["Organic", "Conventional", "Both"];

/* ---------------------------------------------------------------------- */
/* MODULE 1 — Disease knowledge base                                      */
/* Chemical guidance is intentionally generic — the brief forbids          */
/* inventing dosages, so none are fabricated here.                         */
/* ---------------------------------------------------------------------- */

const DISEASE_KB = {
  Tomato: [
    { name: "Early Blight", symptoms: "Dark concentric-ring spots on older leaves, yellowing around lesions.", cause: "Fungal infection (Alternaria), favoured by warm, humid conditions.", severity: "Medium" },
    { name: "Late Blight", symptoms: "Water-soaked patches on leaves that turn brown/black, white mould on undersides.", cause: "Fungal-like pathogen (Phytophthora), spreads fast in cool, wet weather.", severity: "High" },
    { name: "Leaf Curl Virus", symptoms: "Upward curling, thickened, yellowing leaves, stunted growth.", cause: "Viral infection, usually whitefly-transmitted.", severity: "High" },
    { name: "Healthy", symptoms: "No visible disease symptoms detected.", cause: "—", severity: "Low" }
  ],
  Potato: [
    { name: "Late Blight", symptoms: "Dark blotches on leaves, white fungal growth on leaf undersides in humid weather.", cause: "Fungal-like pathogen (Phytophthora infestans).", severity: "High" },
    { name: "Early Blight", symptoms: "Target-shaped brown spots on lower leaves.", cause: "Fungal infection (Alternaria solani).", severity: "Medium" },
    { name: "Healthy", symptoms: "No visible disease symptoms detected.", cause: "—", severity: "Low" }
  ],
  Rice: [
    { name: "Blast", symptoms: "Diamond-shaped lesions with grey centres on leaves.", cause: "Fungal infection (Magnaporthe oryzae).", severity: "High" },
    { name: "Bacterial Leaf Blight", symptoms: "Water-soaked streaks turning yellow-white from leaf tips.", cause: "Bacterial infection (Xanthomonas oryzae).", severity: "Medium" },
    { name: "Healthy", symptoms: "No visible disease symptoms detected.", cause: "—", severity: "Low" }
  ],
  Wheat: [
    { name: "Leaf Rust", symptoms: "Small orange-brown pustules scattered on leaf surface.", cause: "Fungal infection (Puccinia triticina).", severity: "Medium" },
    { name: "Healthy", symptoms: "No visible disease symptoms detected.", cause: "—", severity: "Low" }
  ],
  Groundnut: [
    { name: "Leaf Spot", symptoms: "Small dark brown circular spots with yellow halo.", cause: "Fungal infection (Cercospora spp.).", severity: "Medium" },
    { name: "Healthy", symptoms: "No visible disease symptoms detected.", cause: "—", severity: "Low" }
  ],
  Onion: [
    { name: "Purple Blotch", symptoms: "Purplish-brown lesions with concentric zonation on leaves.", cause: "Fungal infection (Alternaria porri).", severity: "Medium" },
    { name: "Healthy", symptoms: "No visible disease symptoms detected.", cause: "—", severity: "Low" }
  ],
  Carrot: [
    { name: "Leaf Blight", symptoms: "Irregular brown spots with yellow margins on foliage.", cause: "Fungal/bacterial complex.", severity: "Medium" },
    { name: "Healthy", symptoms: "No visible disease symptoms detected.", cause: "—", severity: "Low" }
  ],
  Sugarcane: [
    { name: "Red Rot", symptoms: "Reddening of internal tissue, dried leaves.", cause: "Fungal infection (Colletotrichum falcatum).", severity: "High" },
    { name: "Healthy", symptoms: "No visible disease symptoms detected.", cause: "—", severity: "Low" }
  ],
  Maize: [
    { name: "Leaf Blight", symptoms: "Long, elliptical grey-green lesions on leaves.", cause: "Fungal infection (Exserohilum turcicum).", severity: "Medium" },
    { name: "Healthy", symptoms: "No visible disease symptoms detected.", cause: "—", severity: "Low" }
  ],
  Cotton: [
    { name: "Leaf Curl Virus", symptoms: "Upward leaf curling, vein thickening, stunted bolls.", cause: "Viral infection, whitefly-transmitted.", severity: "High" },
    { name: "Healthy", symptoms: "No visible disease symptoms detected.", cause: "—", severity: "Low" }
  ],
  Chilli: [
    { name: "Leaf Curl", symptoms: "Curling, puckering and yellowing of leaves.", cause: "Viral infection, whitefly-transmitted.", severity: "Medium" },
    { name: "Healthy", symptoms: "No visible disease symptoms detected.", cause: "—", severity: "Low" }
  ],
  Brinjal: [
    { name: "Bacterial Wilt", symptoms: "Sudden wilting of whole plant despite moist soil.", cause: "Bacterial infection (Ralstonia solanacearum).", severity: "High" },
    { name: "Healthy", symptoms: "No visible disease symptoms detected.", cause: "—", severity: "Low" }
  ]
};

const ORGANIC_ACTIONS = [
  "Remove and destroy visibly infected leaves to reduce spread.",
  "Improve field sanitation — clear crop debris after harvest.",
  "Increase plant spacing to improve air circulation.",
  "Avoid overhead irrigation late in the day; water at the base.",
  "Rotate crops with a non-host family next season.",
  "Use neem-based or other locally approved biological sprays where recommended."
];

/* ---------------------------------------------------------------------- */
/* MODULE 2 — Disaster / weather-risk demo series                         */
/* ---------------------------------------------------------------------- */

const RAINFALL_HISTORY_MM = [12, 8, 40, 65, 90, 120, 145, 130, 88, 35, 15, 10]; // Jan–Dec, demo
const TEMP_HISTORY_C = [24, 26, 29, 32, 34, 33, 31, 30, 29, 27, 25, 23];

/* ---------------------------------------------------------------------- */
/* MODULE 3 — Soil thresholds (simplified agronomy ranges for demo)       */
/* ---------------------------------------------------------------------- */

const SOIL_RANGES = {
  ph:       { low: 6.0, high: 7.5 },
  moisture: { low: 30,  high: 60 },
  n:        { low: 40,  high: 80 },
  p:        { low: 20,  high: 50 },
  k:        { low: 40,  high: 80 },
  oc:       { low: 0.5, high: 0.75 },
  ec:       { low: 0.2, high: 1.0 }
};

const CROP_PROFILES = [
  { crop: "Groundnut", soil: ["Red Soil", "Sandy Loam"], phRange: [6.0, 7.0], water: "Moderate", tempRange: [25, 35], growth: "90–120 days" },
  { crop: "Carrot",    soil: ["Sandy Loam", "Alluvial Soil"], phRange: [6.0, 6.8], water: "Moderate", tempRange: [15, 25], growth: "70–100 days" },
  { crop: "Tomato",    soil: ["Red Soil", "Black Soil", "Alluvial Soil"], phRange: [6.0, 7.0], water: "Moderate", tempRange: [20, 30], growth: "90–120 days" },
  { crop: "Onion",     soil: ["Alluvial Soil", "Black Soil"], phRange: [6.0, 7.5], water: "Moderate", tempRange: [15, 30], growth: "100–150 days" },
  { crop: "Wheat",     soil: ["Alluvial Soil", "Clay Loam"], phRange: [6.0, 7.5], water: "Low-Moderate", tempRange: [15, 25], growth: "110–130 days" },
  { crop: "Sugarcane", soil: ["Black Soil", "Alluvial Soil"], phRange: [6.5, 7.5], water: "High", tempRange: [21, 35], growth: "300–360 days" },
  { crop: "Rice",      soil: ["Clay Loam", "Alluvial Soil"], phRange: [5.5, 7.0], water: "High", tempRange: [20, 35], growth: "110–150 days" },
  { crop: "Maize",     soil: ["Red Soil", "Black Soil", "Sandy Loam"], phRange: [5.8, 7.2], water: "Moderate", tempRange: [18, 32], growth: "90–110 days" },
  { crop: "Cotton",    soil: ["Black Soil"], phRange: [6.0, 8.0], water: "Moderate", tempRange: [21, 35], growth: "150–180 days" },
  { crop: "Chilli",    soil: ["Red Soil", "Sandy Loam"], phRange: [6.0, 7.0], water: "Moderate", tempRange: [20, 30], growth: "120–150 days" },
  { crop: "Brinjal",   soil: ["Red Soil", "Black Soil", "Alluvial Soil"], phRange: [5.5, 7.0], water: "Moderate", tempRange: [21, 30], growth: "100–130 days" }
];

/* ==========================================================================
   MOCK MODEL FUNCTIONS — swap the body for a fetch() to a real endpoint.
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Image analysis — reads the actual pixels of the uploaded photo.        */
/* Measures leaf colour/lesion features, then scores each disease for the */
/* chosen crop against those features. Deterministic: same photo -> same  */
/* result. (Replace with a trained CNN via a backend when available.)     */
/* ---------------------------------------------------------------------- */

function loadImageElement(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = dataUrl;
  });
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

async function extractImageFeatures(dataUrl) {
  const img = await loadImageElement(dataUrl);
  const SIZE = 160;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, SIZE, SIZE);
  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

  let plant = 0, green = 0, yellow = 0, brown = 0, dark = 0, white = 0, orange = 0, purple = 0;
  const cell = 8, grid = SIZE / cell;
  const cellBad = new Array(grid * grid).fill(0);
  const cellPlant = new Array(grid * grid).fill(0);

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      const { h, s, v } = rgbToHsv(data[i], data[i + 1], data[i + 2]);
      const ci = Math.floor(y / cell) * grid + Math.floor(x / cell);

      // Skip plain background: very bright/low-saturation (white/grey paper, sky) and very dark shadows
      const isGreyBg = s < 0.12 && v > 0.55;
      const isBlack = v < 0.10;
      if (isBlack) continue;

      let cls = null;
      if (h >= 70 && h <= 165 && s >= 0.18 && v >= 0.18) cls = "green";
      else if (h >= 45 && h < 70 && s >= 0.35 && v >= 0.45) cls = "yellow";
      else if (h >= 15 && h < 45 && s >= 0.30 && v >= 0.25 && v < 0.70) cls = "brown";
      else if (h >= 15 && h < 40 && s >= 0.60 && v >= 0.70) cls = "orange";
      else if (v < 0.28 && s < 0.65) cls = "dark";
      else if (h >= 255 && h <= 340 && s >= 0.15 && v >= 0.2) cls = "purple";
      else if (isGreyBg) cls = null; // background
      else if (s < 0.14 && v > 0.45) cls = "white";   // pale/mouldy patches on a plant area (kept small)

      if (!cls) continue;
      if (cls === "white") {
        // Only count pale pixels that sit near leaf tissue — handled below via cell context
        white++;
        cellPlant[ci]++;
        continue;
      }
      plant++; cellPlant[ci]++;
      if (cls === "green") green++;
      else if (cls === "yellow") { yellow++; cellBad[ci]++; }
      else if (cls === "brown") { brown++; cellBad[ci]++; }
      else if (cls === "orange") { orange++; cellBad[ci]++; }
      else if (cls === "dark") { dark++; cellBad[ci]++; }
      else if (cls === "purple") { purple++; cellBad[ci]++; }
    }
  }

  // Pale pixels count as "mould/white" only if they're a small fraction of a mostly-plant image
  const plantTotal = Math.max(1, plant);
  const whiteCounted = white < plantTotal * 0.25 ? white : 0;

  // Lesion spotting: fraction of leaf cells with scattered bad pixels (spots) vs. uniformly bad (whole-leaf)
  let spotCells = 0, leafCells = 0, uniformBadCells = 0;
  for (let c = 0; c < cellBad.length; c++) {
    const total = cellPlant[c];
    if (total < cell * cell * 0.35) continue;
    leafCells++;
    const frac = cellBad[c] / total;
    if (frac > 0.08 && frac < 0.7) spotCells++;
    if (frac >= 0.7) uniformBadCells++;
  }

  const denom = plantTotal + whiteCounted;
  const f = {
    plantPixels: plant,
    plantCoverage: plant / (SIZE * SIZE),
    green: green / denom,
    yellow: yellow / denom,
    brown: brown / denom,
    dark: dark / denom,
    orange: orange / denom,
    purple: purple / denom,
    white: whiteCounted / denom,
    spotted: leafCells ? spotCells / leafCells : 0,
    uniformBad: leafCells ? uniformBadCells / leafCells : 0
  };
  f.lesion = f.yellow + f.brown + f.dark + f.orange + f.purple;   // all non-green diseased-looking colour
  return f;
}

/* Per-disease scoring against measured features (0..1+ higher = better match) */
const DISEASE_SIGNATURES = {
  "Healthy":               (f) => 0.6 * f.green - 3.0 * f.lesion - 1.5 * f.white - 1.0 * f.spotted,
  "Early Blight":          (f) => 2.2 * f.brown + 1.2 * f.yellow + 1.6 * f.spotted - 0.5 * f.dark,
  "Late Blight":           (f) => 2.6 * f.dark + 1.6 * f.brown + 1.8 * f.white + 0.6 * f.spotted,
  "Leaf Curl Virus":       (f) => 2.4 * f.yellow + 1.2 * f.uniformBad - 1.0 * f.spotted - 0.8 * f.dark,
  "Leaf Curl":             (f) => 2.4 * f.yellow + 1.2 * f.uniformBad - 1.0 * f.spotted - 0.8 * f.dark,
  "Blast":                 (f) => 2.0 * f.brown + 1.6 * f.white + 1.4 * f.spotted + 0.6 * f.dark,
  "Bacterial Leaf Blight": (f) => 2.6 * f.yellow + 1.4 * f.white + 0.8 * f.uniformBad,
  "Leaf Rust":             (f) => 3.2 * f.orange + 1.4 * f.brown + 1.6 * f.spotted,
  "Leaf Spot":             (f) => 2.2 * f.brown + 1.4 * f.yellow + 2.0 * f.spotted,
  "Purple Blotch":         (f) => 3.2 * f.purple + 1.6 * f.brown + 1.2 * f.spotted,
  "Leaf Blight":           (f) => 2.0 * f.brown + 1.6 * f.yellow + 1.2 * f.spotted + 0.6 * f.dark,
  "Red Rot":               (f) => 3.0 * f.purple + 2.4 * f.orange + 1.6 * f.dark + 1.0 * f.brown,
  "Bacterial Wilt":        (f) => 2.4 * f.yellow + 2.0 * f.uniformBad + 1.0 * f.brown - 1.2 * f.spotted
};

function scoreDiseases(options, f) {
  // "Looks diseased" evidence: coloured lesions, pale mould, and scattered spotting
  const sick = f.lesion + 0.6 * f.white + 0.5 * f.spotted;
  const clean = f.lesion < 0.015 && f.white < 0.02 && f.spotted < 0.03;
  return options.map((opt) => {
    const sig = DISEASE_SIGNATURES[opt.name];
    let score = sig ? sig(f) : 0;
    if (opt.name === "Healthy") score += clean ? 1.0 : -Math.min(1.5, sick * 8);
    else score += clean ? -0.8 : Math.min(0.8, sick * 4);
    return { opt, score };
  }).sort((a, b) => b.score - a.score);
}

async function predictDisease(crop, imageDataUrl) {
  const options = DISEASE_KB[crop] || DISEASE_KB.Tomato;
  let f;
  try {
    f = await extractImageFeatures(imageDataUrl);
  } catch (e) {
    f = null;
  }
  await new Promise((r) => setTimeout(r, 900)); // keep the "analysing" feel

  // Not enough plant tissue in the photo — say so instead of guessing
  if (!f || f.plantCoverage < 0.08) {
    return {
      crop,
      disease: "Healthy",
      confidence: 40,
      symptoms: "No visible disease symptoms detected.",
      cause: "—",
      severity: "Low",
      organic: [],
      chemicalAvailable: false,
      lowQuality: true
    };
  }

  const ranked = scoreDiseases(options, f);
  const top = ranked[0], second = ranked[1];
  const pick = top.opt;

  // Confidence from how clearly the top match beats the runner-up, plus how much plant was visible
  const margin = second ? Math.max(0, top.score - second.score) : 0.5;
  let confidence = 62 + margin * 60 + Math.min(12, f.plantCoverage * 20);
  if (pick.name === "Healthy") confidence = 70 + (1 - Math.min(1, f.lesion * 6)) * 24;
  confidence = Math.max(55, Math.min(pick.name === "Healthy" ? 96 : 92, Math.round(confidence)));

  // Severity scales with how much of the leaf looks affected
  let severity = pick.severity;
  if (pick.name !== "Healthy") {
    if (f.lesion > 0.40) severity = "High";
    else if (f.lesion > 0.18) severity = pick.severity === "Low" ? "Medium" : pick.severity;
    else if (f.lesion < 0.08) severity = "Low";
    else if (pick.severity === "High") severity = "Medium";
  }

  return {
    crop,
    disease: pick.name,
    confidence,
    symptoms: pick.symptoms,
    cause: pick.cause,
    severity,
    organic: pick.name === "Healthy" ? [] : ORGANIC_ACTIONS.slice(0, 4).concat([]),
    chemicalAvailable: pick.name !== "Healthy" && severity !== "Low"
  };
}

function predictDisaster(month, location) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = month;
      const rainfall = RAINFALL_HISTORY_MM[idx];
      const avgRainfall = RAINFALL_HISTORY_MM.reduce((a, b) => a + b, 0) / 12;
      const temperature = TEMP_HISTORY_C[idx];
      const humidity = Math.round(55 + (rainfall / 150) * 35);

      let riskType, riskLevel;
      if (rainfall > avgRainfall * 1.4) {
        riskType = "Excess Rainfall / Flood Risk";
        riskLevel = rainfall > avgRainfall * 1.8 ? "Critical" : "High";
      } else if (rainfall < avgRainfall * 0.2) {
        riskType = "Drought / Low Rainfall Risk";
        riskLevel = "Critical";
      } else if (rainfall < avgRainfall * 0.4) {
        riskType = "Drought / Low Rainfall Risk";
        riskLevel = "High";
      } else if (rainfall < avgRainfall * 0.7) {
        riskType = "Drought / Low Rainfall Risk";
        riskLevel = "Moderate";
      } else if (rainfall > avgRainfall * 1.15) {
        riskType = "Excess Rainfall / Flood Risk";
        riskLevel = "Moderate";
      } else {
        riskType = "Balanced Rainfall Conditions";
        riskLevel = "Low";
      }

      resolve({
        location,
        riskType,
        riskLevel,
        rainfall,
        avgRainfall: Math.round(avgRainfall),
        temperature,
        humidity,
        forecastPeriod: "Next 7–10 days",
        historicalComparison: rainfall > avgRainfall
          ? Math.round(((rainfall - avgRainfall) / avgRainfall) * 100) + "% above the 12-month average"
          : Math.round(((avgRainfall - rainfall) / avgRainfall) * 100) + "% below the 12-month average"
      });
    }, 1400);
  });
}

function analyzeSoil(inputs) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const status = (value, range) => {
        if (value === null || value === undefined || value === "" || isNaN(value)) return null;
        if (value < range.low) return "Low";
        if (value > range.high) return "High";
        return "Optimal";
      };

      const health = {
        ph: status(inputs.ph, SOIL_RANGES.ph),
        moisture: status(inputs.moisture, SOIL_RANGES.moisture),
        n: status(inputs.n, SOIL_RANGES.n),
        p: status(inputs.p, SOIL_RANGES.p),
        k: status(inputs.k, SOIL_RANGES.k),
        oc: status(inputs.oc, SOIL_RANGES.oc),
        ec: status(inputs.ec, SOIL_RANGES.ec)
      };

      const recs = CROP_PROFILES.map((p) => {
        let score = 0, total = 0;
        total++; if (p.soil.includes(inputs.soilType)) score++;
        if (inputs.ph) { total++; if (inputs.ph >= p.phRange[0] && inputs.ph <= p.phRange[1]) score++; }
        if (inputs.airTemp) { total++; if (inputs.airTemp >= p.tempRange[0] && inputs.airTemp <= p.tempRange[1]) score++; }
        const ratio = total ? score / total : 0;
        let suitability;
        if (ratio >= 0.9) suitability = "Highly Suitable";
        else if (ratio >= 0.6) suitability = "Suitable";
        else if (ratio >= 0.3) suitability = "Moderately Suitable";
        else suitability = "Less Suitable";
        return { ...p, suitability, matchRatio: ratio };
      }).sort((a, b) => b.matchRatio - a.matchRatio).slice(0, 6);

      resolve({ health, recommendations: recs });
    }, 1400);
  });
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------------------------------------------------------------- */
/* Demo seed data                                                          */
/* ---------------------------------------------------------------------- */

const DEMO_FARMER = {
  name: "Murugan S",
  mobile: "9876543210",
  state: "Tamil Nadu",
  district: "Coimbatore",
  village: "Sulur",
  landArea: "3.5",
  landUnit: "Acres",
  currentCrop: "Tomato",
  previousCrop: "Maize",
  experience: "8",
  irrigation: "Drip",
  soilType: "Red Soil",
  waterSource: "Borewell",
  farmingMethod: "Both"
};

const DEMO_SOIL_VALUES = {
  soilType: "Red Soil", soilTemp: 27, moisture: 24, ph: 6.4,
  n: 32, p: 18, k: 45, oc: 0.42, ec: 0.6,
  airTemp: 31, humidity: 58, rainfall: 12, irrigationAvailability: "Available"
};
