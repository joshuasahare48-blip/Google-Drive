/**
 * =========================================================================
 * GOOGLE FORMS-STYLE SURVEY CONTROLLER (script.js)
 * =========================================================================
 *
 * NOTE ON AUDIO FILE LOCATION:
 * Place your MP3 file at:
 *   /audio/submit-sound.mp3  (or in public folder /public/audio/submit-sound.mp3)
 *
 * The audio must be accessible at the URL:
 *   /audio/submit-sound.mp3
 * =========================================================================
 */

// =========================================================================
// EDITABLE SETTINGS
// =========================================================================
const SURVEY_CONFIG = {
  // 1. FORM TITLE
  title: "A Study on Online Payment App Adoption Among Street Vendors",

  // 2. FORM DESCRIPTION
  description:
    "This survey is conducted to understand the use, benefits, and challenges of online payment apps among street vendors. The information collected will be used for academic research purposes only.",

  // 3. THEME COLOR
  themeColor: "#673ab7", // Classic Google Forms purple

  // 4. AUDIO FILE PATH
  // Loop continuous audio on successful submit at 100% volume
  audioPath:
    "https://www.image2url.com/r2/default/audio/1790512369275-0d49639c-8667-4df1-98a2-5bf17a13a54b.mp3",

  // 5. SIMULATED PAGE COUNT (Default: 1,000,000)
  simulatedPageCount: 1000000,

  // 6. SUCCESS & PROCESSING MESSAGES
  successMessage: "Response submitted successfully",
  processingMessage: "Processing your response...",

  // 7. QUESTIONS CONFIGURATION
  questions: [
    {
      id: "name",
      title: "What is your name?",
      type: "text",
      required: true,
      placeholder: "Your answer",
    },
    {
      id: "q1",
      title: "1. Do you accept online payments from customers?",
      type: "radio",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "q2",
      title: "2. Which online payment method do you mainly use?",
      type: "radio",
      required: true,
      options: ["Google Pay (GPay)", "PhonePe", "Paytm", "UPI QR Code"],
    },
    {
      id: "q3",
      title: "3. How long have you been using online payment apps?",
      type: "radio",
      required: true,
      options: [
        "Less than 1 year",
        "1–2 years",
        "2–3 years",
        "More than 3 years",
      ],
    },
    {
      id: "q4",
      title: "4. Why did you start accepting online payments?",
      type: "radio",
      required: true,
      options: [
        "Customer demand",
        "Easy and convenient",
        "Faster transactions",
        "Less need for cash",
      ],
    },
    {
      id: "q5",
      title: "5. How often do customers pay you through online payment?",
      type: "radio",
      required: true,
      options: ["Rarely", "Sometimes", "Often", "Very often"],
    },
    {
      id: "q6",
      title:
        "6. Do you think online payments have increased your sales or customers?",
      type: "radio",
      required: true,
      options: ["Yes", "No", "Not Sure"],
    },
    {
      id: "q7",
      title: "7. What is the biggest benefit of accepting online payments?",
      type: "radio",
      required: true,
      options: [
        "Convenient",
        "Fast payment",
        "No need to keep change",
        "Easy record of transactions",
        "Other",
      ],
      hasOther: true,
    },
    {
      id: "q8",
      title: "8. What problems do you face while accepting online payments?",
      type: "radio",
      required: true,
      options: [
        "Poor internet/network",
        "Payment failure",
        "Fraud/scams",
        "Technical problems",
        "No major problems",
      ],
    },
    {
      id: "q9",
      title: "9. How confident are you in using online payment apps?",
      type: "radio",
      required: true,
      options: [
        "Very confident",
        "Confident",
        "Neutral",
        "Not very confident",
      ],
    },
    {
      id: "q10",
      title:
        "10. Would you recommend online payments to other street vendors?",
      type: "radio",
      required: true,
      options: ["Yes", "No"],
    },
  ],
};

// =========================================================================
// SINGLETON AUDIO INSTANCE
// =========================================================================
// Create exactly ONE Audio object as requested.
const submitAudio = new Audio(SURVEY_CONFIG.audioPath);
submitAudio.loop = true;
submitAudio.volume = 1.0; // 100% volume in HTML Audio

// Export for module or global use
if (typeof window !== "undefined") {
  window.SURVEY_CONFIG = SURVEY_CONFIG;
  window.submitAudio = submitAudio;
}
