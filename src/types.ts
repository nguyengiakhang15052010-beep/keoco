export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, 3
  explanation?: string;
  category?: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  emoji: string;
  description: string;
  badgeColor: string;
  accentColor: string;
  avatarSvgType: 'dragon' | 'tiger' | 'panda' | 'eagle' | 'fox' | 'lion' | 'robot' | 'ninja' | 'unicorn' | 'bear';
}

export interface TeamConfig {
  id: 'teamA' | 'teamB';
  name: string;
  characterId: string;
  colorTheme: 'red' | 'blue' | 'amber' | 'emerald' | 'purple' | 'orange';
  score: number; // Number of correct answers
  currentQuestionIndex: number;
}

export type GameStage = 'setup' | 'playing' | 'roundResult' | 'ended';

export type TurnMode = 'alternating' | 'hostSelect';

export interface GameSettings {
  maxQuestionsPerTeam: number; // Default 10
  timeLimitPerQuestion: number; // in seconds, 0 = unlimited
  soundEnabled: boolean;
  pullStepSize: number; // How much rope moves per correct answer (-5 to +5 scale, default 1)
  winThreshold: number; // If rope reaches -5 (Team A) or +5 (Team B) immediate win, or highest at end
  turnMode: TurnMode;
}

export interface RoundHistoryItem {
  round: number;
  teamId: 'teamA' | 'teamB';
  teamName: string;
  questionIndex: number;
  questionText: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  correctOptionIndex: number;
  ropePositionBefore: number;
  ropePositionAfter: number;
  timestamp: number;
}
