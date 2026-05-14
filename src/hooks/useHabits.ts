import { useEffect, useState } from "react";
import type { Habit } from "../types";
import { getDateKey } from "../utils/date";

const STORAGE_KEY = "habit-tracker-data";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit: Omit<Habit, "id" | "createdAt" | "completedDates">) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: getDateKey(),
      completedDates: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const updateHabit = (
    id: string,
    habit: Pick<Habit, "name" | "emoji" | "color">
  ) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...habit } : h))
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleToday = (id: string) => {
    const today = getDateKey();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const done = h.completedDates.includes(today);
        return {
          ...h,
          completedDates: done
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today],
        };
      })
    );
  };

  return { habits, addHabit, updateHabit, deleteHabit, toggleToday };
}
