import type { Habit, Stats } from "../types";
import {
  getDateKey,
  getDayDifference,
  getPastDateKeys,
  getPreviousDateKey,
} from "./date";

export interface DashboardStats {
  completedToday: number;
  completionRate: number;
  totalCurrentStreaks: number;
  totalHabits: number;
}

export function computeHabitStats(habit: Habit, today = getDateKey()): Stats {
  const completedDates = getSortedCompletedDates(habit);
  const totalCompletions = completedDates.length;
  const currentStreak = computeCurrentStreak(completedDates, today);
  const longestStreak = computeLongestStreak(completedDates);
  const completionRate = computeRecentCompletionRate(completedDates);

  return { currentStreak, longestStreak, totalCompletions, completionRate };
}

export function computeDashboardStats(
  habits: Habit[],
  today = getDateKey()
): DashboardStats {
  const completedToday = habits.filter((habit) =>
    habit.completedDates.includes(today)
  ).length;

  return {
    completedToday,
    completionRate:
      habits.length === 0
        ? 0
        : Math.round((completedToday / habits.length) * 100),
    totalCurrentStreaks: habits.reduce(
      (sum, habit) => sum + computeHabitStats(habit, today).currentStreak,
      0
    ),
    totalHabits: habits.length,
  };
}

export function buildHabitHeatmapWeeks(dayCount = 35): (string | null)[][] {
  const days = getPastDateKeys(dayCount);
  const firstDayOffset = new Date(`${days[0]}T00:00:00`).getDay();
  const paddedDays = [...Array(firstDayOffset).fill(null), ...days];

  return Array.from({ length: Math.ceil(paddedDays.length / 7) }, (_, index) =>
    paddedDays.slice(index * 7, index * 7 + 7)
  );
}

function getSortedCompletedDates(habit: Habit): string[] {
  return [...new Set(habit.completedDates)].sort();
}

function computeCurrentStreak(completedDates: string[], today: string): number {
  const completedSet = new Set(completedDates);
  let cursor = completedSet.has(today) ? today : getPreviousDateKey(today);
  let streak = 0;

  while (completedSet.has(cursor)) {
    streak += 1;
    cursor = getPreviousDateKey(cursor);
  }

  return streak;
}

function computeLongestStreak(completedDates: string[]): number {
  let currentStreak = 0;
  let longestStreak = 0;

  completedDates.forEach((date, index) => {
    const previousDate = completedDates[index - 1];
    const continuesStreak =
      index > 0 && getDayDifference(previousDate, date) === 1;

    currentStreak = continuesStreak ? currentStreak + 1 : 1;
    longestStreak = Math.max(longestStreak, currentStreak);
  });

  return longestStreak;
}

function computeRecentCompletionRate(completedDates: string[]): number {
  const completedSet = new Set(completedDates);
  const completedInLast30Days = getPastDateKeys(30).filter((date) =>
    completedSet.has(date)
  ).length;

  return Math.round((completedInLast30Days / 30) * 100);
}
