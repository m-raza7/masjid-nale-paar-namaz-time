function toSlots(row) {
  return [
    { name: "Fajr", azan: row.fajr_azan, jamaat: row.fajr_jamaat },
    { name: "Sunrise", azan: row.sunrise, jamaat: null },
    { name: "Zuhr", azan: row.zuhr_azan, jamaat: row.zuhr_jamaat },
    { name: "Asr", azan: row.asr_azan, jamaat: row.asr_jamaat },
    { name: "Maghrib", azan: row.maghrib_azan, jamaat: row.maghrib_jamaat },
    { name: "Isha", azan: row.isha_azan, jamaat: row.isha_jamaat }
  ];
}
function formatTime12(t) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hh = (h + 11) % 12 + 1;
  return `${hh}:${String(m).padStart(2, "0")} ${period}`;
}
function toMinutes(t) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function currentAndNextPrayer(row, now = /* @__PURE__ */ new Date()) {
  if (!row) return { current: null, next: null, msToNext: 0 };
  const slots = toSlots(row).filter((s) => s.name !== "Sunrise");
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let current = null;
  let next = null;
  for (let i = 0; i < slots.length; i++) {
    const m = toMinutes(slots[i].azan);
    if (m === null) continue;
    if (m <= nowMin) current = slots[i];
    else {
      next = slots[i];
      break;
    }
  }
  if (!next) next = slots[0];
  const nextMin = toMinutes(next.azan) ?? 0;
  const diff = nextMin > nowMin ? nextMin - nowMin : nextMin + (24 * 60 - nowMin);
  return { current, next, msToNext: diff * 60 * 1e3 };
}
function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1e3));
  const h = Math.floor(total / 3600);
  const m = Math.floor(total % 3600 / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function todayISO() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function hijriDate(d = /* @__PURE__ */ new Date()) {
  try {
    return new Intl.DateTimeFormat("en-TN-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(d).replace("AH", "AH");
  } catch {
    return "";
  }
}
export {
  toSlots as a,
  formatCountdown as b,
  currentAndNextPrayer as c,
  formatTime12 as f,
  hijriDate as h,
  todayISO as t
};
