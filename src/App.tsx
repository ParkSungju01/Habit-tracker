import { useState } from "react";
import { useHabits } from "./hooks/useHabits";
import { HabitCard } from "./components/HabitCard";
import { AddHabitModal } from "./components/AddHabitModal";
import { StatsBar } from "./components/StatsBar";
import { Plus } from "lucide-react";
import { getDateKey } from "./utils/date";
import "./App.css";

export default function App() {
  const { habits, addHabit, deleteHabit, toggleToday } = useHabits();
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const today = getDateKey();
  const todayFormatted = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <div className="header-left">
          <span className="logo">🔥 HabitTracker</span>
          <span className="date">{todayFormatted}</span>
        </div>
        <div className="header-right">
          <button
            className="theme-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="테마 변경"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            습관 추가
          </button>
        </div>
      </header>

      <StatsBar habits={habits} today={today} />

      <main className="main">
        {habits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-emoji">🌱</div>
            <h2>아직 습관이 없어요</h2>
            <p>첫 번째 습관을 추가하고 성장을 시작해보세요!</p>
            <button className="add-btn large" onClick={() => setShowModal(true)}>
              <Plus size={18} />
              첫 습관 추가하기
            </button>
          </div>
        ) : (
          <div className="habits-grid">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={() => toggleToday(habit.id)}
                onDelete={() => deleteHabit(habit.id)}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <AddHabitModal
          onAdd={(data: Parameters<typeof addHabit>[0]) => {
            addHabit(data);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
