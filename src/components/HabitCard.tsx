import { useState } from "react";
import type { CSSProperties } from "react";
import type { Habit } from "../types";
import { Flame, Pencil, Trash2, TrendingUp } from "lucide-react";
import { getDateKey, getDateKeyRange, getDayDifference } from "../utils/date";
import { buildHabitHeatmapWeeks, computeHabitStats } from "../utils/habitStats";

interface Props {
  habit: Habit;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const DAYS_LABEL = ["일", "월", "화", "수", "목", "금", "토"];
type HabitColorStyle = CSSProperties & { "--habit-color": string };

function getDurationDays(habit: Habit): number | undefined {
  if (!habit.duration || habit.duration.type === "daily") return undefined;
  if (habit.duration.type === "week") return 7;
  if (habit.duration.type === "month") return 30;
  return habit.duration.days;
}

function getDdayLabel(habit: Habit, today: string): string | undefined {
  const durationDays = getDurationDays(habit);
  if (!durationDays) return undefined;

  const elapsedDays = Math.max(0, getDayDifference(habit.createdAt, today));
  const remainingDays = Math.max(0, durationDays - elapsedDays);

  return remainingDays === 0 ? "D-Day" : `D-${remainingDays}`;
}

export function HabitCard({ habit, onToggle, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const today = getDateKey();
  const stats = computeHabitStats(habit, today);
  const isDoneToday = habit.completedDates.includes(today);
  const weeks = buildHabitHeatmapWeeks();
  const durationDays = getDurationDays(habit);
  const ddayLabel = getDdayLabel(habit, today);
  const periodDates = durationDays
    ? getDateKeyRange(habit.createdAt, durationDays)
    : [];

  function getIntensity(date: string | null): number {
    if (!date) return -1;
    return habit.completedDates.includes(date) ? 1 : 0;
  }

  function getPeriodCellState(date: string) {
    if (habit.completedDates.includes(date)) return "done";
    if (getDayDifference(today, date) > 0) return "future";
    return "miss";
  }

  return (
    <div
      className="habit-card"
      style={{ "--habit-color": habit.color } as HabitColorStyle}
    >
      <div className="card-header">
        <div className="card-title-row">
          <span className="habit-emoji">{habit.emoji}</span>
          <div className="habit-title">
            <span className="habit-name">{habit.name}</span>
            {ddayLabel && <span className="habit-dday">{ddayLabel}</span>}
          </div>
        </div>
        <div className="card-actions">
          {confirmDelete ? (
            <div className="confirm-delete">
              <span>삭제?</span>
              <button className="btn-yes" onClick={onDelete}>
                예
              </button>
              <button
                className="btn-no"
                onClick={() => setConfirmDelete(false)}
              >
                아니오
              </button>
            </div>
          ) : (
            <>
              <button className="icon-btn" onClick={onEdit} title="수정">
                <Pencil size={15} />
              </button>
              <button
                className="icon-btn danger"
                onClick={() => setConfirmDelete(true)}
                title="삭제"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card-stats">
        <div className="mini-stat">
          <Flame size={14} className="mini-icon" />
          <span>{stats.currentStreak}일 연속</span>
        </div>
        <div className="mini-stat">
          <TrendingUp size={14} className="mini-icon" />
          <span>최고 {stats.longestStreak}일</span>
        </div>
        <div className="mini-stat completion-badge">
          <span>{stats.completionRate}%</span>
        </div>
      </div>

      {durationDays ? (
        <div className="period-checks">
          {periodDates.map((date, index) => (
            <div
              key={date}
              className={`period-check ${getPeriodCellState(date)} ${
                date === today ? "today" : ""
              }`}
              title={date}
            >
              {index + 1}
            </div>
          ))}
        </div>
      ) : (
        <div className="heatmap">
          <div className="heatmap-dow-labels">
            {DAYS_LABEL.map((d) => (
              <span key={d} className="dow-label">{d}</span>
            ))}
          </div>
          <div className="heatmap-grid">
            {weeks.map((week, wi) => (
              <div key={wi} className="heatmap-col">
                {week.map((day, di) => {
                  const intensity = getIntensity(day);
                  return (
                    <div
                      key={di}
                      className={`heatmap-cell ${
                        intensity === -1
                          ? "empty"
                          : intensity === 1
                          ? "done"
                          : "miss"
                      } ${day === today ? "today" : ""}`}
                      title={day ?? ""}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className={`checkin-btn ${isDoneToday ? "done" : ""}`}
        onClick={onToggle}
      >
        {isDoneToday ? "✅ 오늘 완료!" : "⬜ 오늘 체크하기"}
      </button>
    </div>
  );
}
