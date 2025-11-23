export interface CorrectionItem {
  questionIndex: string;
  isCorrect: boolean;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface GradingResult {
  subject: string;
  overallScore: number;
  summary: string;
  corrections: CorrectionItem[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
