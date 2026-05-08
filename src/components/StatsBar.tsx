import { BarChart2, CheckCircle, Flame } from "lucide-react";
import type { Habit } from "../types";
import type { DateKey } from "../utils/date";
import { computeDashboardStats } from "../utils/habitStats";

interface StatsBarProps {
  habits: Habit[];
  today: DateKey;
}

export function StatsBar({ habits, today }: StatsBarProps) {
  const stats = computeDashboardStats(habits, today);

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <CheckCircle size={22} className="stat-icon green" />
        <div>
          <div className="stat-value">
            {stats.completedToday} / {stats.totalHabits}
          </div>
          <div className="stat-label">오늘 완료</div>
        </div>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <div className="progress-ring-wrap">
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" className="ring-bg" />
            <circle
              cx="22"
              cy="22"
              r="18"
              className="ring-fill"
              strokeDasharray={`${(stats.completionRate / 100) * 113} 113`}
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
            />
          </svg>
          <span className="ring-text">{stats.completionRate}%</span>
        </div>
        <div>
          <div className="stat-value">오늘 달성률</div>
          <div className="stat-label">계속 해봐요!</div>
        </div>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <Flame size={22} className="stat-icon orange" />
        <div>
          <div className="stat-value">{stats.totalCurrentStreaks}일</div>
          <div className="stat-label">총 스트릭 합계</div>
        </div>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <BarChart2 size={22} className="stat-icon blue" />
        <div>
          <div className="stat-value">{stats.totalHabits}개</div>
          <div className="stat-label">등록된 습관</div>
        </div>
      </div>
    </div>
  );
}
