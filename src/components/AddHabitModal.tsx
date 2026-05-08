import { useState } from "react";
import type { CSSProperties, SyntheticEvent } from "react";
import type { Habit } from "../types";
import { X } from "lucide-react";

type HabitInput = Omit<Habit, "id" | "createdAt" | "completedDates">;

interface Props {
  onAdd: (data: HabitInput) => void;
  onClose: () => void;
}

const PRESET_EMOJIS = [
  "💪", "📚", "🏃", "🧘", "💧", "🥗", "😴", "✍️",
  "🎵", "🎨", "💻", "🌿", "🚴", "🧹", "📝", "🩺",
];

const PRESET_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#14b8a6",
];
type HabitColorStyle = CSSProperties & { "--habit-color": string };

export function AddHabitModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("💪");
  const [color, setColor] = useState("#6366f1");

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), emoji, color });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>새 습관 추가</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div
            className="habit-preview"
            style={{ "--habit-color": color } as HabitColorStyle}
          >
            <span className="preview-emoji">{emoji}</span>
            <span className="preview-name">{name || "습관 이름"}</span>
          </div>

          <div className="form-group">
            <label>습관 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 물 2L 마시기"
              maxLength={30}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>아이콘</label>
            <div className="emoji-grid">
              {PRESET_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={`emoji-btn ${emoji === e ? "selected" : ""}`}
                  onClick={() => setEmoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>색상</label>
            <div className="color-grid">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-btn ${color === c ? "selected" : ""}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={!name.trim()}>
            습관 만들기
          </button>
        </form>
      </div>
    </div>
  );
}
