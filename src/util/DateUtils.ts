export function getDayNames(format: "long" | "short" | "narrow" | undefined = 'long'): string[] {
  // From: https://www.abeautifulsite.net/posts/getting-localized-month-and-day-names-in-the-browser/
  const formatter = new Intl.DateTimeFormat(undefined, { weekday: format, timeZone: 'UTC' });
  const days = [1, 2, 3, 4, 5, 6, 7].map(day => {
    const dd = day < 10 ? `0${day}` : day;
    return new Date(`2022-01-${dd}T00:00:00+00:00`);
  });
  return days.map(date => formatter.format(date));
}

export function getDayName(day: number, format: "long" | "short" | "narrow" | undefined = 'long'): string {
  const formatter = new Intl.DateTimeFormat(undefined, { weekday: format, timeZone: 'UTC' });
  const dd = day < 10 ? `0${day}` : day;
  const date = new Date(`2022-01-${dd}T00:00:00+00:00`);
  return formatter.format(date);
}

export function isToday(day: Date): boolean {
  const today = new Date();
  return day.getDate() == today.getDate() &&
    day.getMonth() == today.getMonth() &&
    day.getFullYear() == today.getFullYear();
}
