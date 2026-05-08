export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string; // ISO date string YYYY-MM-DD
  completedDates: string[]; // array of YYYY-MM-DD
}

export interface Stats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number; // last 30 days %
}
