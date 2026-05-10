import { useState } from "react";
import type { CSSProperties, SyntheticEvent } from "react";
import type { Habit, HabitDurationType } from "../types";
import { X } from "lucide-react";

type HabitInput = Omit<Habit, "id" | "createdAt" | "completedDates">;

interface Props {
  onAdd: (data: HabitInput) => void;
  onClose: () => void;
}

const PRESET_EMOJIS = [
  "💪", "📚", "🏃", "💧", "🥗", "😴", "✍️",
  "🎵", "🎨", "💻", "🌿", "🚴", "🧹", "📝", "🩺",
];

const PRESET_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#14b8a6",
];
const DURATION_OPTIONS: { label: string; value: HabitDurationType }[] = [
  { label: "매일", value: "daily" },
  { label: "7일", value: "week" },
  { label: "30일", value: "month" },
  { label: "사용자 지정", value: "custom" },
];

type HabitColorStyle = CSSProperties & { "--habit-color": string };

function getDurationDays(
  durationType: HabitDurationType,
  customDaysInput: string
) {
  if (durationType === "custom" && customDaysInput.trim() === "") {
    return undefined;
  }

  const customDays = Number(customDaysInput);

  if (durationType === "week") return 7;
  if (durationType === "month") return 30;
  if (durationType === "custom" && Number.isFinite(customDays)) {
    return Math.min(365, Math.max(1, Math.floor(customDays)));
  }
  return undefined;
}

export function AddHabitModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("💪");
  const [color, setColor] = useState("#6366f1");
  const [durationType, setDurationType] =
    useState<HabitDurationType>("daily");
  const [customDaysInput, setCustomDaysInput] = useState("14");

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const durationDays = getDurationDays(durationType, customDaysInput);

    onAdd({
      name: name.trim(),
      emoji,
      color,
      duration: {
        type: durationType,
        ...(durationDays ? { days: durationDays } : {}),
      },
    });
  };

  const selectedDurationDays = getDurationDays(durationType, customDaysInput);
  const canSubmit =
    Boolean(name.trim()) &&
    (durationType !== "custom" || Boolean(selectedDurationDays));

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

          <div className="form-group">
            <label>기간</label>
            <div className="duration-options">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`duration-option ${
                    durationType === option.value ? "selected" : ""
                  }`}
                  onClick={() => setDurationType(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {durationType === "custom" && (
              <input
                type="number"
                min={1}
                max={365}
                step={1}
                value={customDaysInput}
                onChange={(e) => setCustomDaysInput(e.target.value)}
                placeholder="기간을 일 단위로 입력"
              />
            )}
            {selectedDurationDays && (
              <span className="duration-help">
                시작일에는 D-{selectedDurationDays}로 표시됩니다.
              </span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={!canSubmit}>
            습관 만들기
          </button>
        </form>
      </div>
    </div>
  );
}
