# Farm Friend 🌾

AI-powered farming assistant prototype for Indian farmers (built with Tamil Nadu in mind), covering three modules:

1. **Disease Prediction** — upload a plant photo, get a possible disease, severity and next steps.
2. **Disaster Prediction** — flood / drought risk from rainfall and temperature patterns.
3. **Soil Monitoring & Crop Recommendation** — enter soil + environment readings, get a soil health summary and suitable crops.

This is a **frontend-only demo build**: no server, no database, no real trained models. It runs entirely in the browser, uses `localStorage` to remember the farmer profile and prediction history between visits, and uses a mock "AI layer" (`js/data.js`) that returns realistic, clearly-labelled demo results. It's built so the mock layer can be swapped for a real backend without touching the UI code — see **"Connecting real AI models"** below.

## Running it

No build step needed. Either:

- Open `index.html` directly in a browser, **or**
- Serve the folder locally (recommended, some browsers restrict `file://` fetches):
  ```bash
  cd farm-friend
  python3 -m http.server 8080
  # then visit http://localhost:8080
  ```

## Demo login

- Enter any name + 10-digit mobile number → **Send OTP**
- Demo OTP: **`12345`**
- Or tap **"Use demo farmer details"** on the login screen for prefilled demo data.

## Project structure

```
farm-friend/
├── index.html          All screens (landing, login, OTP, profile setup, app shell)
├── css/
│   └── style.css       Design tokens + all component/page styles
├── js/
│   ├── data.js          Demo datasets + the 3 mock "model" functions
│   └── app.js           Routing, state, auth flow, page rendering
└── README.md
```

It's a single-page app: `index.html` holds every screen as a `<section class="screen">`, and `app.js` toggles which one is visible and renders the post-login pages (dashboard, disease, disaster, soil, alerts, profile, settings) into `#page-content`.

## Connecting real AI models

Each module calls one function in `js/data.js`. Replace the body of that function with a real API call — nothing in `app.js` needs to change, since the return shape stays the same.

| Module | Function | Suggested real model |
|---|---|---|
| Disease Prediction | `predictDisease(crop, imageDataUrl)` | CNN / transfer learning (MobileNet, EfficientNet or ResNet) fine-tuned on labelled leaf-disease images |
| Disaster Prediction | `predictDisaster(month, location)` | Random Forest / XGBoost on historical + forecast weather, or an LSTM for time-series rainfall forecasting |
| Soil Monitoring | `analyzeSoil(inputs)` | Classifier + rule-based suitability scoring over soil, climate and crop features; swap in a trained recommender for `CROP_PROFILES` |

Example swap for disease prediction:

```js
async function predictDisease(crop, imageDataUrl) {
  const res = await fetch("/api/predict/disease", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ crop, image: imageDataUrl })
  });
  return res.json(); // same shape: { crop, disease, confidence, symptoms, cause, severity, organic, chemicalAvailable }
}
```

## Suggested backend data model

The prototype only uses `localStorage`, but here's the schema it's designed around for a real backend (e.g. PostgreSQL/MongoDB):

**farmers** — `farmer_id, name, mobile, state, district, village, land_area, land_unit, current_crop, previous_crop, irrigation_type, farming_experience, soil_type, water_source, farming_method`

**disease_predictions** — `prediction_id, farmer_id, image_url, crop, disease, confidence, severity, timestamp`

**disaster_predictions** — `prediction_id, farmer_id, location, rainfall, temperature, humidity, risk_type, risk_level, timestamp`

**soil_records** — `soil_id, farmer_id, soil_type, temperature, moisture, ph, nitrogen, phosphorus, potassium, organic_carbon, ec, timestamp`

**crop_recommendations** — `recommendation_id, farmer_id, crop, suitability, estimated_growth_period, timestamp`

## Safety notes baked into this build

- No pesticide names, concentrations, or dosages are invented anywhere in the code — chemical guidance always points the farmer to the product label and a qualified agricultural officer.
- Every disease result carries a visible disclaimer that the prediction is preliminary AI guidance, not a confirmed diagnosis.
- Disaster and crop-recommendation language uses "predicted risk" / "recommended based on available inputs" rather than guarantees, and disaster actions focus on water management and crop protection, not pesticide use.
- If you connect a real model, keep these guardrails in the prompt/response layer of whatever service replaces the mock functions.

## Known prototype limits (by design)

- Data is stored in the browser (`localStorage`), not a real database — clearing browser storage clears the demo farmer's history.
- Weather/soil "predictions" are deterministic demo logic, not trained models — see the table above for how to plug real ones in.
- Only one farmer profile is supported per browser at a time.
