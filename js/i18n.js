/* Farm Friend — lightweight client-side multilingual UI */
const LANG_STORAGE_KEY = "farmfriend_language_v1";
const LANGUAGES = {
  en: "English",
  ta: "தமிழ்",
  hi: "हिन्दी",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ"
};

const I18N = {
  en: {},
  ta: {
    "Farm Friend": "ஃபார்ம் ஃப்ரெண்ட்", "Farmer Login": "விவசாயி உள்நுழைவு", "Farmer Name": "விவசாயி பெயர்", "Mobile Number": "மொபைல் எண்",
    "Enter your details to receive a one-time password.": "ஒருமுறை பயன்படுத்தும் கடவுச்சொல்லைப் பெற உங்கள் விவரங்களை உள்ளிடவும்.", "Send OTP": "OTP அனுப்பு", "Use demo farmer details": "டெமோ விவசாயி விவரங்களைப் பயன்படுத்து",
    "Verify OTP": "OTP சரிபார்ப்பு", "We've sent a one-time password to": "ஒருமுறை பயன்படுத்தும் கடவுச்சொல் அனுப்பப்பட்டுள்ளது:", "Change number": "எண்ணை மாற்று", "Verify & Continue": "சரிபார்த்து தொடரவும்",
    "Set up your farmer profile": "உங்கள் விவசாயி சுயவிவரத்தை அமைக்கவும்", "Tell us about your farm so recommendations fit your field. Fields marked * are required.": "உங்கள் வயலைப் பற்றி கூறுங்கள்; அதற்கேற்ற பரிந்துரைகள் வழங்கப்படும். * குறியிட்டவை அவசியம்.", "Fill demo data": "டெமோ தரவை நிரப்பு",
    "Personal Information": "தனிப்பட்ட தகவல்", "Farming Information": "விவசாய தகவல்", "Optional Information": "விருப்பத் தகவல்", "State": "மாநிலம்", "District": "மாவட்டம்", "Village / City": "கிராமம் / நகரம்",
    "Total Land Area": "மொத்த நிலப்பரப்பு", "Land Area Unit": "நிலப்பரப்பு அலகு", "Current Crop": "தற்போதைய பயிர்", "Previous Crop": "முந்தைய பயிர்", "Farming Experience (years)": "விவசாய அனுபவம் (ஆண்டுகள்)", "Irrigation Type": "பாசன வகை", "Soil Type": "மண் வகை", "Available Water Source": "கிடைக்கும் நீர் ஆதாரம்", "Preferred Farming Method": "விருப்பமான விவசாய முறை", "Save & Continue": "சேமித்து தொடரவும்",
    "Dashboard": "டாஷ்போர்டு", "Disease Prediction": "நோய் கணிப்பு", "Disaster Prediction": "பேரிடர் கணிப்பு", "Soil Monitoring": "மண் கண்காணிப்பு", "Farming Alerts": "விவசாய எச்சரிக்கைகள்", "Farmer Profile": "விவசாயி சுயவிவரம்", "Settings": "அமைப்புகள்", "Logout": "வெளியேறு", "Home": "முகப்பு", "Disease": "நோய்", "Disaster": "பேரிடர்", "Soil": "மண்", "Profile": "சுயவிவரம்",
    "Location": "இருப்பிடம்", "Land Area": "நிலப்பரப்பு", "Irrigation": "பாசனம்", "Open Disease Prediction": "நோய் கணிப்பைத் திறக்கவும்", "Open Disaster Prediction": "பேரிடர் கணிப்பைத் திறக்கவும்", "Open Soil Monitoring": "மண் கண்காணிப்பைத் திறக்கவும்", "Recent Predictions": "சமீபத்திய கணிப்புகள்",
    "Upload a plant image and identify possible crop diseases.": "தாவரப் படத்தைப் பதிவேற்றி சாத்தியமான பயிர் நோய்களை கண்டறியவும்.", "Monitor weather-related farming risks such as excessive rainfall and drought.": "அதிக மழை மற்றும் வறட்சி போன்ற வானிலை சார்ந்த விவசாய அபாயங்களை கண்காணிக்கவும்.", "Analyze soil conditions and receive suitable crop recommendations.": "மண் நிலையை பகுப்பாய்வு செய்து பொருத்தமான பயிர் பரிந்துரைகளைப் பெறவும்.",
    "No predictions yet. Run your first check from a module above.": "இன்னும் கணிப்புகள் இல்லை. மேலே உள்ள தொகுதியிலிருந்து முதல் சோதனையை இயக்கவும்.", "Notifications based on recent weather and field conditions.": "சமீபத்திய வானிலை மற்றும் வயல் நிலைமைகளை அடிப்படையாகக் கொண்ட அறிவிப்புகள்.",
    "Crop": "பயிர்", "Click to upload": "பதிவேற்ற கிளிக் செய்யவும்", "or drag and drop a plant photo": "அல்லது தாவரப் புகைப்படத்தை இழுத்து விடவும்", "JPG or PNG, clear focus on the affected leaf": "JPG அல்லது PNG; பாதிக்கப்பட்ட இலையில் தெளிவான கவனம்", "Predict Disease": "நோயைக் கணிக்கவும்", "Detected Disease": "கண்டறியப்பட்ட நோய்", "Recommended Actions": "பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்",
    "Soil Parameters": "மண் அளவுருக்கள்", "Use demo readings": "டெமோ அளவீடுகளைப் பயன்படுத்து", "Soil Temperature (°C)": "மண் வெப்பநிலை (°C)", "Soil Moisture (%)": "மண் ஈரப்பதம் (%)", "Soil pH": "மண் pH", "Nitrogen (N)": "நைட்ரஜன் (N)", "Phosphorus (P)": "பாஸ்பரஸ் (P)", "Potassium (K)": "பொட்டாசியம் (K)", "Organic Carbon (%)": "கரிம கார்பன் (%)", "Electrical Conductivity — EC (dS/m)": "மின்கடத்துத்திறன் — EC (dS/m)", "Environmental Parameters": "சுற்றுச்சூழல் அளவுருக்கள்", "Air Temperature (°C)": "காற்று வெப்பநிலை (°C)", "Humidity (%)": "ஈரப்பதம் (%)", "Rainfall (mm)": "மழைப்பொழிவு (mm)", "Irrigation Availability": "பாசன கிடைப்புத்தன்மை", "Analyze Soil": "மண்ணைப் பகுப்பாய்வு செய்யவும்", "Soil Health Summary": "மண் ஆரோக்கிய சுருக்கம்", "Recommended Crops": "பரிந்துரைக்கப்பட்ட பயிர்கள்", "Smart Crop Comparison": "ஸ்மார்ட் பயிர் ஒப்பீடு", "Suitability": "பொருத்தம்", "Water Need": "நீர் தேவை", "Growth Period": "வளர்ச்சி காலம்",
    "Notifications": "அறிவிப்புகள்", "Farming alerts enabled": "விவசாய எச்சரிக்கைகள் இயக்கப்பட்டுள்ளன", "App Version": "ஆப் பதிப்பு", "Prototype 1.0 (demo mode)": "முன்மாதிரி 1.0 (டெமோ முறை)", "About Farm Friend": "ஃபார்ம் ஃப்ரெண்ட் பற்றி", "Clear Prediction History": "கணிப்பு வரலாற்றை அழிக்கவும்",
    "Name": "பெயர்", "Mobile": "மொபைல்", "Current Crop": "தற்போதைய பயிர்", "Previous Crop": "முந்தைய பயிர்", "Farming Experience": "விவசாய அனுபவம்", "Water Source": "நீர் ஆதாரம்", "Farming Method": "விவசாய முறை", "Edit Profile": "சுயவிவரத்தைத் திருத்து"
  },
  hi: {
    "Farm Friend": "फार्म फ्रेंड", "Farmer Login": "किसान लॉगिन", "Farmer Name": "किसान का नाम", "Mobile Number": "मोबाइल नंबर", "Enter your details to receive a one-time password.": "वन-टाइम पासवर्ड प्राप्त करने के लिए अपनी जानकारी दर्ज करें।", "Send OTP": "OTP भेजें", "Use demo farmer details": "डेमो किसान विवरण उपयोग करें", "Verify OTP": "OTP सत्यापित करें", "Change number": "नंबर बदलें", "Verify & Continue": "सत्यापित करें और जारी रखें", "Set up your farmer profile": "अपना किसान प्रोफ़ाइल सेट करें", "Personal Information": "व्यक्तिगत जानकारी", "Farming Information": "कृषि जानकारी", "Optional Information": "वैकल्पिक जानकारी", "State": "राज्य", "District": "जिला", "Village / City": "गाँव / शहर", "Total Land Area": "कुल भूमि क्षेत्र", "Land Area Unit": "भूमि क्षेत्र इकाई", "Current Crop": "वर्तमान फसल", "Previous Crop": "पिछली फसल", "Farming Experience (years)": "कृषि अनुभव (वर्ष)", "Irrigation Type": "सिंचाई प्रकार", "Soil Type": "मिट्टी का प्रकार", "Available Water Source": "उपलब्ध जल स्रोत", "Preferred Farming Method": "पसंदीदा कृषि विधि", "Save & Continue": "सहेजें और जारी रखें", "Dashboard": "डैशबोर्ड", "Disease Prediction": "रोग पूर्वानुमान", "Disaster Prediction": "आपदा पूर्वानुमान", "Soil Monitoring": "मिट्टी निगरानी", "Farming Alerts": "कृषि अलर्ट", "Farmer Profile": "किसान प्रोफ़ाइल", "Settings": "सेटिंग्स", "Logout": "लॉगआउट", "Home": "होम", "Disease": "रोग", "Disaster": "आपदा", "Soil": "मिट्टी", "Profile": "प्रोफ़ाइल", "Location": "स्थान", "Land Area": "भूमि क्षेत्र", "Irrigation": "सिंचाई", "Open Disease Prediction": "रोग पूर्वानुमान खोलें", "Open Disaster Prediction": "आपदा पूर्वानुमान खोलें", "Open Soil Monitoring": "मिट्टी निगरानी खोलें", "Recent Predictions": "हाल के पूर्वानुमान", "Crop": "फसल", "Click to upload": "अपलोड करने के लिए क्लिक करें", "Predict Disease": "रोग का पूर्वानुमान करें", "Detected Disease": "पहचाना गया रोग", "Recommended Actions": "अनुशंसित कार्य", "Soil Parameters": "मिट्टी के पैरामीटर", "Use demo readings": "डेमो रीडिंग उपयोग करें", "Soil Temperature (°C)": "मिट्टी का तापमान (°C)", "Soil Moisture (%)": "मिट्टी की नमी (%)", "Soil pH": "मिट्टी pH", "Nitrogen (N)": "नाइट्रोजन (N)", "Phosphorus (P)": "फॉस्फोरस (P)", "Potassium (K)": "पोटैशियम (K)", "Environmental Parameters": "पर्यावरणीय पैरामीटर", "Air Temperature (°C)": "हवा का तापमान (°C)", "Humidity (%)": "आर्द्रता (%)", "Rainfall (mm)": "वर्षा (mm)", "Irrigation Availability": "सिंचाई उपलब्धता", "Analyze Soil": "मिट्टी का विश्लेषण करें", "Soil Health Summary": "मिट्टी स्वास्थ्य सारांश", "Recommended Crops": "अनुशंसित फसलें", "Smart Crop Comparison": "स्मार्ट फसल तुलना", "Suitability": "उपयुक्तता", "Water Need": "पानी की आवश्यकता", "Growth Period": "विकास अवधि", "Notifications": "सूचनाएँ", "Farming alerts enabled": "कृषि अलर्ट सक्षम हैं", "App Version": "ऐप संस्करण", "About Farm Friend": "फार्म फ्रेंड के बारे में", "Clear Prediction History": "पूर्वानुमान इतिहास साफ़ करें", "Name": "नाम", "Mobile": "मोबाइल", "Previous Crop": "पिछली फसल", "Farming Experience": "कृषि अनुभव", "Water Source": "जल स्रोत", "Farming Method": "कृषि विधि", "Edit Profile": "प्रोफ़ाइल संपादित करें"
  },
  te: {
    "Farm Friend": "ఫార్మ్ ఫ్రెండ్", "Farmer Login": "రైతు లాగిన్", "Farmer Name": "రైతు పేరు", "Mobile Number": "మొబైల్ నంబర్", "Enter your details to receive a one-time password.": "వన్-టైమ్ పాస్‌వర్డ్ పొందడానికి మీ వివరాలను నమోదు చేయండి.", "Send OTP": "OTP పంపండి", "Use demo farmer details": "డెమో రైతు వివరాలను ఉపయోగించండి", "Verify OTP": "OTP ధృవీకరించండి", "Change number": "నంబర్ మార్చండి", "Verify & Continue": "ధృవీకరించి కొనసాగండి", "Set up your farmer profile": "మీ రైతు ప్రొఫైల్‌ను ఏర్పాటు చేయండి", "Personal Information": "వ్యక్తిగత సమాచారం", "Farming Information": "వ్యవసాయ సమాచారం", "Optional Information": "ఐచ్ఛిక సమాచారం", "State": "రాష్ట్రం", "District": "జిల్లా", "Village / City": "గ్రామం / నగరం", "Total Land Area": "మొత్తం భూభాగం", "Land Area Unit": "భూభాగ యూనిట్", "Current Crop": "ప్రస్తుత పంట", "Previous Crop": "మునుపటి పంట", "Farming Experience (years)": "వ్యవసాయ అనుభవం (సంవత్సరాలు)", "Irrigation Type": "నీటిపారుదల రకం", "Soil Type": "మట్టి రకం", "Available Water Source": "అందుబాటులో ఉన్న నీటి వనరు", "Preferred Farming Method": "ఇష్టమైన వ్యవసాయ విధానం", "Save & Continue": "సేవ్ చేసి కొనసాగండి", "Dashboard": "డ్యాష్‌బోర్డ్", "Disease Prediction": "వ్యాధి అంచనా", "Disaster Prediction": "విపత్తు అంచనా", "Soil Monitoring": "మట్టి పర్యవేక్షణ", "Farming Alerts": "వ్యవసాయ హెచ్చరికలు", "Farmer Profile": "రైతు ప్రొఫైల్", "Settings": "సెట్టింగ్స్", "Logout": "లాగ్ అవుట్", "Home": "హోమ్", "Disease": "వ్యాధి", "Disaster": "విపత్తు", "Soil": "మట్టి", "Profile": "ప్రొఫైల్", "Location": "ప్రదేశం", "Land Area": "భూభాగం", "Irrigation": "నీటిపారుదల", "Open Disease Prediction": "వ్యాధి అంచనాను తెరవండి", "Open Disaster Prediction": "విపత్తు అంచనాను తెరవండి", "Open Soil Monitoring": "మట్టి పర్యవేక్షణను తెరవండి", "Recent Predictions": "ఇటీవలి అంచనాలు", "Crop": "పంట", "Click to upload": "అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి", "Predict Disease": "వ్యాధిని అంచనా వేయండి", "Detected Disease": "గుర్తించిన వ్యాధి", "Recommended Actions": "సిఫార్సు చేసిన చర్యలు", "Soil Parameters": "మట్టి పరామితులు", "Use demo readings": "డెమో రీడింగ్స్ ఉపయోగించండి", "Soil Temperature (°C)": "మట్టి ఉష్ణోగ్రత (°C)", "Soil Moisture (%)": "మట్టి తేమ (%)", "Soil pH": "మట్టి pH", "Nitrogen (N)": "నైట్రోజన్ (N)", "Phosphorus (P)": "ఫాస్ఫరస్ (P)", "Potassium (K)": "పొటాషియం (K)", "Environmental Parameters": "పర్యావరణ పరామితులు", "Air Temperature (°C)": "గాలి ఉష్ణోగ్రత (°C)", "Humidity (%)": "తేమ (%)", "Rainfall (mm)": "వర్షపాతం (mm)", "Irrigation Availability": "నీటిపారుదల లభ్యత", "Analyze Soil": "మట్టిని విశ్లేషించండి", "Soil Health Summary": "మట్టి ఆరోగ్య సారాంశం", "Recommended Crops": "సిఫార్సు చేసిన పంటలు", "Smart Crop Comparison": "స్మార్ట్ పంట పోలిక", "Suitability": "అనుకూలత", "Water Need": "నీటి అవసరం", "Growth Period": "పెరుగుదల కాలం", "Notifications": "నోటిఫికేషన్లు", "Farming alerts enabled": "వ్యవసాయ హెచ్చరికలు ప్రారంభించబడ్డాయి", "App Version": "యాప్ వెర్షన్", "About Farm Friend": "ఫార్మ్ ఫ్రెండ్ గురించి", "Clear Prediction History": "అంచనా చరిత్రను క్లియర్ చేయండి", "Name": "పేరు", "Mobile": "మొబైల్", "Farming Experience": "వ్యవసాయ అనుభవం", "Water Source": "నీటి వనరు", "Farming Method": "వ్యవసాయ విధానం", "Edit Profile": "ప్రొఫైల్ సవరించండి"
  },
  kn: {
    "Farm Friend": "ಫಾರ್ಮ್ ಫ್ರೆಂಡ್", "Farmer Login": "ರೈತ ಲಾಗಿನ್", "Farmer Name": "ರೈತನ ಹೆಸರು", "Mobile Number": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", "Enter your details to receive a one-time password.": "ಒಮ್ಮೆ ಬಳಸುವ ಪಾಸ್‌ವರ್ಡ್ ಪಡೆಯಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.", "Send OTP": "OTP ಕಳುಹಿಸಿ", "Use demo farmer details": "ಡೆಮೋ ರೈತ ವಿವರಗಳನ್ನು ಬಳಸಿ", "Verify OTP": "OTP ಪರಿಶೀಲಿಸಿ", "Change number": "ಸಂಖ್ಯೆ ಬದಲಿಸಿ", "Verify & Continue": "ಪರಿಶೀಲಿಸಿ ಮುಂದುವರಿಸಿ", "Set up your farmer profile": "ನಿಮ್ಮ ರೈತ ಪ್ರೊಫೈಲ್ ಹೊಂದಿಸಿ", "Personal Information": "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ", "Farming Information": "ಕೃಷಿ ಮಾಹಿತಿ", "Optional Information": "ಐಚ್ಛಿಕ ಮಾಹಿತಿ", "State": "ರಾಜ್ಯ", "District": "ಜಿಲ್ಲೆ", "Village / City": "ಗ್ರಾಮ / ನಗರ", "Total Land Area": "ಒಟ್ಟು ಭೂ ಪ್ರದೇಶ", "Land Area Unit": "ಭೂ ಪ್ರದೇಶ ಘಟಕ", "Current Crop": "ಪ್ರಸ್ತುತ ಬೆಳೆ", "Previous Crop": "ಹಿಂದಿನ ಬೆಳೆ", "Farming Experience (years)": "ಕೃಷಿ ಅನುಭವ (ವರ್ಷಗಳು)", "Irrigation Type": "ನೀರಾವರಿ ಪ್ರಕಾರ", "Soil Type": "ಮಣ್ಣಿನ ಪ್ರಕಾರ", "Available Water Source": "ಲಭ್ಯವಿರುವ ನೀರಿನ ಮೂಲ", "Preferred Farming Method": "ಆದ್ಯತೆಯ ಕೃಷಿ ವಿಧಾನ", "Save & Continue": "ಉಳಿಸಿ ಮುಂದುವರಿಸಿ", "Dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", "Disease Prediction": "ರೋಗ ಮುನ್ಸೂಚನೆ", "Disaster Prediction": "ವಿಪತ್ತು ಮುನ್ಸೂಚನೆ", "Soil Monitoring": "ಮಣ್ಣು ಮೇಲ್ವಿಚಾರಣೆ", "Farming Alerts": "ಕೃಷಿ ಎಚ್ಚರಿಕೆಗಳು", "Farmer Profile": "ರೈತ ಪ್ರೊಫೈಲ್", "Settings": "ಸೆಟ್ಟಿಂಗ್ಸ್", "Logout": "ಲಾಗ್ ಔಟ್", "Home": "ಮುಖಪುಟ", "Disease": "ರೋಗ", "Disaster": "ವಿಪತ್ತು", "Soil": "ಮಣ್ಣು", "Profile": "ಪ್ರೊಫೈಲ್", "Location": "ಸ್ಥಳ", "Land Area": "ಭೂ ಪ್ರದೇಶ", "Irrigation": "ನೀರಾವರಿ", "Open Disease Prediction": "ರೋಗ ಮುನ್ಸೂಚನೆ ತೆರೆಯಿರಿ", "Open Disaster Prediction": "ವಿಪತ್ತು ಮುನ್ಸೂಚನೆ ತೆರೆಯಿರಿ", "Open Soil Monitoring": "ಮಣ್ಣು ಮೇಲ್ವಿಚಾರಣೆ ತೆರೆಯಿರಿ", "Recent Predictions": "ಇತ್ತೀಚಿನ ಮುನ್ಸೂಚನೆಗಳು", "Crop": "ಬೆಳೆ", "Click to upload": "ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ", "Predict Disease": "ರೋಗ ಮುನ್ಸೂಚನೆ ಮಾಡಿ", "Detected Disease": "ಪತ್ತೆಯಾದ ರೋಗ", "Recommended Actions": "ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳು", "Soil Parameters": "ಮಣ್ಣಿನ ನಿಯತಾಂಕಗಳು", "Use demo readings": "ಡೆಮೋ ಅಳತೆಗಳನ್ನು ಬಳಸಿ", "Soil Temperature (°C)": "ಮಣ್ಣಿನ ತಾಪಮಾನ (°C)", "Soil Moisture (%)": "ಮಣ್ಣಿನ ತೇವಾಂಶ (%)", "Soil pH": "ಮಣ್ಣಿನ pH", "Nitrogen (N)": "ನೈಟ್ರೋಜನ್ (N)", "Phosphorus (P)": "ಫಾಸ್ಫರಸ್ (P)", "Potassium (K)": "ಪೊಟ್ಯಾಸಿಯಂ (K)", "Environmental Parameters": "ಪರಿಸರ ನಿಯತಾಂಕಗಳು", "Air Temperature (°C)": "ಗಾಳಿಯ ತಾಪಮಾನ (°C)", "Humidity (%)": "ಆರ್ದ್ರತೆ (%)", "Rainfall (mm)": "ಮಳೆಯ ಪ್ರಮಾಣ (mm)", "Irrigation Availability": "ನೀರಾವರಿ ಲಭ್ಯತೆ", "Analyze Soil": "ಮಣ್ಣನ್ನು ವಿಶ್ಲೇಷಿಸಿ", "Soil Health Summary": "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸಾರಾಂಶ", "Recommended Crops": "ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆಗಳು", "Smart Crop Comparison": "ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಹೋಲಿಕೆ", "Suitability": "ಸೂಕ್ತತೆ", "Water Need": "ನೀರಿನ ಅಗತ್ಯ", "Growth Period": "ಬೆಳವಣಿಗೆ ಅವಧಿ", "Notifications": "ಅಧಿಸೂಚನೆಗಳು", "Farming alerts enabled": "ಕೃಷಿ ಎಚ್ಚರಿಕೆಗಳು ಸಕ್ರಿಯವಾಗಿವೆ", "App Version": "ಆಪ್ ಆವೃತ್ತಿ", "About Farm Friend": "ಫಾರ್ಮ್ ಫ್ರೆಂಡ್ ಬಗ್ಗೆ", "Clear Prediction History": "ಮುನ್ಸೂಚನೆ ಇತಿಹಾಸ ತೆರವುಗೊಳಿಸಿ", "Name": "ಹೆಸರು", "Mobile": "ಮೊಬೈಲ್", "Farming Experience": "ಕೃಷಿ ಅನುಭವ", "Water Source": "ನೀರಿನ ಮೂಲ", "Farming Method": "ಕೃಷಿ ವಿಧಾನ", "Edit Profile": "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ"
  }
};

function currentLanguage() {
  return localStorage.getItem(LANG_STORAGE_KEY) || "en";
}

function t(text) {
  const lang = currentLanguage();
  return (I18N[lang] && I18N[lang][text]) || text;
}

function applyTranslations(root = document) {
  const lang = currentLanguage();
  document.documentElement.lang = lang;
  root.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  root.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(el => {
    const original = el.dataset.i18nPlaceholder;
    if (original) el.placeholder = t(original);
  });
  const walker = document.createTreeWalker(root.body || root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const value = node.nodeValue.trim();
    if (!value) return;
    if (I18N[lang] && I18N[lang][value]) node.nodeValue = node.nodeValue.replace(value, I18N[lang][value]);
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => el.title = t(el.dataset.i18nTitle));
  document.querySelectorAll(".language-select").forEach(sel => sel.value = lang);
}

function setLanguage(lang) {
  if (!LANGUAGES[lang]) return;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  applyTranslations(document);
  if (typeof navigate === "function" && state.loggedIn) navigate(state.route || "dashboard");
}

function initLanguage() {
  document.querySelectorAll(".language-select").forEach(sel => {
    sel.value = currentLanguage();
    sel.addEventListener("change", e => setLanguage(e.target.value));
  });
  applyTranslations(document);
}
