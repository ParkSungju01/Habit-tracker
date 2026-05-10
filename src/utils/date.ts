export type DateKey = `${number}-${number}-${number}`;

const DATE_KEY_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getDateKey(date = new Date()): DateKey {
  return DATE_KEY_FORMATTER.format(date) as DateKey;
}

export function getPastDateKeys(count: number, from = new Date()): DateKey[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(from);
    date.setDate(from.getDate() - (count - 1 - index));
    return getDateKey(date);
  });
}

export function getDateKeyRange(startDateKey: string, count: number): DateKey[] {
  const start = new Date(`${startDateKey}T00:00:00`);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return getDateKey(date);
  });
}

export function getPreviousDateKey(dateKey: string): DateKey {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() - 1);
  return getDateKey(date);
}

export function getDayDifference(fromDateKey: string, toDateKey: string): number {
  const from = Date.UTC(...toDateParts(fromDateKey));
  const to = Date.UTC(...toDateParts(toDateKey));
  return (to - from) / 86_400_000;
}

function toDateParts(dateKey: string): [number, number, number] {
  const [year, month, day] = dateKey.split("-").map(Number);
  return [year, month - 1, day];
}
