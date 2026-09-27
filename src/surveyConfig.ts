/**
 * =========================================================================
 * SURVEY CONFIGURATION
 * =========================================================================
 * Easily edit the survey parameters below.
 * Change the title, description, questions, options, theme color,
 * simulated page count, and audio file path.
 */

export interface QuestionConfig {
  id: string;
  title: string;
  type: 'text' | 'radio';
  required: boolean;
  options?: string[];
  hasOther?: boolean;
  otherPlaceholder?: string;
  placeholder?: string;
  image?: string;
  helpText?: string;
}

export interface SurveyConfig {
  formTitle: string;
  formDescription: string;
  themeColor: {
    primary: string; // e.g. '#673ab7' (Google Forms purple)
    hover: string;
    pageBackground: string;
    error: string;
  };
  audioFile: string;
  simulatedPageCount: number;
  successMessage: string;
  processingMessage: string;
  questions: QuestionConfig[];
}

export const surveyConfig: SurveyConfig = {
  // 1. FORM TITLE
  formTitle: 'A Study on Online Payment App Adoption Among Street Vendors',

  // 2. FORM DESCRIPTION
  formDescription:
    'This survey is conducted to understand the use, benefits, and challenges of online payment apps among street vendors. The information collected will be used for academic research purposes only.',

  // 3. THEME COLOR
  themeColor: {
    primary: '#673ab7',
    hover: '#5e35b1',
    pageBackground: '#ede7f6',
    error: '#d93025',
  },

  // 4. AUDIO FILE (Path to looping audio played after submit)
  // Audio file URL provided by user
  audioFile:
    '/audio/submit-sound.mp3',

  // 5. SIMULATED PAGE COUNT
  simulatedPageCount: 1_000_000,

  // 6. SUCCESS & PROCESSING MESSAGES
  successMessage: 'Response submitted successfully',
  processingMessage: 'Processing your response...',

  // 7. QUESTIONS
  questions: [
    {
      id: 'name',
      title: 'What is your name?',
      type: 'text',
      required: true,
      placeholder: 'Your answer',
    },
    {
      id: 'q1',
      title: '1. Do you accept online payments from customers?',
      type: 'radio',
      required: true,
      options: ['Yes', 'No'],
    },
    {
      id: 'q2',
      title: '2. Which online payment method do you mainly use?',
      type: 'radio',
      required: true,
      options: ['Google Pay (GPay)', 'PhonePe', 'Paytm', 'UPI QR Code'],
    },
    {
      id: 'q3',
      title: '3. How long have you been using online payment apps?',
      type: 'radio',
      required: true,
      options: [
        'Less than 1 year',
        '1–2 years',
        '2–3 years',
        'More than 3 years',
      ],
    },
    {
      id: 'q4',
      title: '4. Why did you start accepting online payments?',
      type: 'radio',
      required: true,
      options: [
        'Customer demand',
        'Easy and convenient',
        'Faster transactions',
        'Less need for cash',
      ],
    },
    {
      id: 'q5',
      title: '5. How often do customers pay you through online payment?',
      type: 'radio',
      required: true,
      options: ['Rarely', 'Sometimes', 'Often', 'Very often'],
    },
    {
      id: 'q6',
      title:
        '6. Do you think online payments have increased your sales or customers?',
      type: 'radio',
      required: true,
      options: ['Yes', 'No', 'Not Sure'],
    },
    {
      id: 'q7',
      title: '7. What is the biggest benefit of accepting online payments?',
      type: 'radio',
      required: true,
      options: [
        'Convenient',
        'Fast payment',
        'No need to keep change',
        'Easy record of transactions',
        'Other',
      ],
      hasOther: true,
      otherPlaceholder: 'Other...',
    },
    {
      id: 'q8',
      title: '8. What problems do you face while accepting online payments?',
      type: 'radio',
      required: true,
      options: [
        'Poor internet/network',
        'Payment failure',
        'Fraud/scams',
        'Technical problems',
        'No major problems',
      ],
    },
    {
      id: 'q9',
      title: '9. How confident are you in using online payment apps?',
      type: 'radio',
      required: true,
      options: [
        'Very confident',
        'Confident',
        'Neutral',
        'Not very confident',
      ],
    },
    {
      id: 'q10',
      title:
        '10. Would you recommend online payments to other street vendors?',
      type: 'radio',
      required: true,
      options: ['Yes', 'No'],
    },
  ],
};
