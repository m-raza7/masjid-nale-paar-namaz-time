export type PrayerName = "Fajr" | "Sunrise" | "Zuhr" | "Asr" | "Maghrib" | "Isha";

export interface PrayerSlot {
  name: PrayerName;
  azan: string | null;
  jamaat: string | null;
}

export interface PrayerRow {
  date: string;
  fajr_azan: string | null;
  fajr_jamaat: string | null;
  sunrise: string | null;
  zuhr_azan: string | null;
  zuhr_jamaat: string | null;
  asr_azan: string | null;
  asr_jamaat: string | null;
  maghrib_azan: string | null;
  maghrib_jamaat: string | null;
  isha_azan: string | null;
  isha_jamaat: string | null;
  jumuah_1: string | null;
  jumuah_2: string | null;
  jumuah_3: string | null;
  notes?: string | null;
}

// Sentinel date used to store a single "current schedule" row.
export const SCHEDULE_DATE = "1970-01-01";

export function toSlots(row: PrayerRow): PrayerSlot[] {
  return [
    { name: "Fajr", azan: row.fajr_azan, jamaat: row.fajr_jamaat },
    { name: "Sunrise", azan: row.sunrise, jamaat: null },
    { name: "Zuhr", azan: row.zuhr_azan, jamaat: row.zuhr_jamaat },
    { name: "Asr", azan: row.asr_azan, jamaat: row.asr_jamaat },
    { name: "Maghrib", azan: row.maghrib_azan, jamaat: row.maghrib_jamaat },
    { name: "Isha", azan: row.isha_azan, jamaat: row.isha_jamaat },
  ];
}

export function formatTime12(t: string | null): string {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, "0")} ${period}`;
}

function toMinutes(t: string | null): number | null {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// export function currentAndNextPrayer(row: PrayerRow | null | undefined, now = new Date()) {
//   if (!row)
//     return { current: null as PrayerSlot | null, next: null as PrayerSlot | null, msToNext: 0 };
//   const slots = toSlots(row).filter((s) => s.name !== "Sunrise");
//   const nowMin = now.getHours() * 60 + now.getMinutes();
//   let current: PrayerSlot | null = null;
//   let next: PrayerSlot | null = null;
//   for (let i = 0; i < slots.length; i++) {
//     const m = toMinutes(slots[i].azan);
//     if (m === null) continue;
//     if (m <= nowMin) current = slots[i];
//     else {
//       next = slots[i];
//       break;
//     }
//   }
//   if (!next) next = slots.find((s) => toMinutes(s.azan) !== null) ?? null;
//   const nextMin = toMinutes(next?.azan ?? null);
//   if (nextMin === null) return { current, next, msToNext: 0 };
//   const diff = nextMin > nowMin ? nextMin - nowMin : nextMin + (24 * 60 - nowMin);
//   return { current, next, msToNext: diff * 60 * 1000 };
// }

export function currentAndNextPrayer(row: PrayerRow | null | undefined, now = new Date()) {
  if (!row) {
    return {
      current: null as PrayerSlot | null,
      next: null as PrayerSlot | null,
      msToNext: 0,
    };
  }

  const slots = toSlots(row)
    .filter((s) => s.name !== "Sunrise")
    .filter((s) => s.jamaat);

  const nowMin = now.getHours() * 60 + now.getMinutes();

  let current: PrayerSlot | null = null;
  let next: PrayerSlot | null = null;

  for (let i = 0; i < slots.length; i++) {
    const m = toMinutes(slots[i].jamaat);

    if (m === null) continue;

    if (m <= nowMin) {
      current = slots[i];
    } else {
      next = slots[i];
      break;
    }
  }

  if (!next) {
    next = slots.find((s) => toMinutes(s.jamaat) !== null) ?? null;
  }

  const nextMin = toMinutes(next?.jamaat ?? null);

  if (nextMin === null) {
    return { current, next, msToNext: 0 };
  }

  const diff = nextMin > nowMin ? nextMin - nowMin : nextMin + (24 * 60 - nowMin);

  return {
    current,
    next,
    msToNext: diff * 60 * 1000,
  };
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function hijriDate(d = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-TN-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
      .format(d)
      .replace("AH", "AH");
  } catch {
    return "";
  }
}
