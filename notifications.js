/* ═══════════════════════════════════════════════════
   MSEUF Concert Singers – Notifications & Calendar
   notifications.js | Firebase Firestore
═══════════════════════════════════════════════════ */

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9u8_gIBZ7Dz75MKSN8KWANnMiT_YlgzM",
  authDomain: "mseufcsrepertoire-3a24f.firebaseapp.com",
  projectId: "mseufcsrepertoire-3a24f",
  storageBucket: "mseufcsrepertoire-3a24f.firebasestorage.app",
  messagingSenderId: "667145296565",
  appId: "1:667145296565:web:046acc0e3823060d3bfcfc"
};

const app    = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const notifDb = getFirestore(app);
const notifAuth = getAuth(app);

let reminders = [];
const reminderTimers = {};

async function registerSW() {
  if (!("serviceWorker" in navigator)) return null;
  try { return await navigator.serviceWorker.register("sw.js"); }
  catch (e) { console.warn("SW failed:", e); return null; }
}

function getPlatformNote() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "📱 iPhone/iPad — requires iOS 16.4+.";
  if (/Android/.test(ua))          return "📱 Android — supported via Chrome or Firefox.";
  return "💻 Desktop — supported in Chrome, Firefox, and Edge.";
}

function openNotifModal() {
  updateNotifStatus();
  loadRemindersFromDB();
  document.getElementById("notif-modal").classList.add("open");
  document.getElementById("sched-date").value = new Date().toISOString().split("T")[0];
}
function closeNotifModal() {
  document.getElementById("notif-modal").classList.remove("open");
}

function updateNotifStatus() {
  const msg       = document.getElementById("notif-status-msg");
  const enableBtn = document.getElementById("enable-notif-btn");
  const testBtn   = document.getElementById("test-notif-btn");
  const note      = `<div style="font-size:.75rem;color:var(--gold);margin-bottom:8px">${getPlatformNote()}</div>`;
  if (!("Notification" in window)) {
    msg.innerHTML = note + `<span style="color:var(--s-not-rehearsed)">❌ Not supported.</span>`;
    enableBtn.style.display = "none"; return;
  }
  const p = Notification.permission;
  if (p === "granted") {
    msg.innerHTML = note + `<span style="color:var(--s-rehearsed)">✔ Notifications enabled!</span>`;
    enableBtn.style.display = "none";
    testBtn.style.display   = "inline-flex";
  } else if (p === "denied") {
    msg.innerHTML = note + `<span style="color:var(--s-not-rehearsed)">✘ Blocked — allow in browser settings.</span>`;
    enableBtn.style.display = "none";
    testBtn.style.display   = "none";
  } else {
    msg.innerHTML = note + `<span style="color:var(--s-to-be-rehearsed)">⚠ Permission not granted yet.</span>`;
    enableBtn.style.display = "inline-flex";
    testBtn.style.display   = "none";
  }
}

async function requestNotifPermission() {
  const r = await Notification.requestPermission();
  updateNotifStatus();
  if (r === "granted") { await registerSW(); showToast("✔ Notifications enabled!"); sendTestNotif(); }
  else showToast("Notifications blocked", true);
}

function sendTestNotif() {
  if (Notification.permission !== "granted") return;
  new Notification("🎵 MSEUF Concert Singers", { body: "Notifications working!", icon: "mseufcs.png" });
}

async function loadRemindersFromDB() {
  try {
    const q    = query(collection(notifDb, "rehearsal_reminders"), orderBy("rehearsal_ts", "asc"));
    const snap = await getDocs(q);
    reminders  = [];
    snap.forEach(d => reminders.push({ id: d.id, ...d.data() }));
    reminders.forEach(r => scheduleTimer(r));
    renderReminders();
    updateBellBadge();
  } catch (err) { console.error(err); renderReminders(); }
}

async function scheduleReminder() {
  const title    = (document.getElementById("sched-title").value    || "").trim() || "MSEUF Rehearsal";
  const date     = document.getElementById("sched-date").value;
  const time     = document.getElementById("sched-time").value                    || "14:00";
  const duration = parseInt(document.getElementById("sched-duration").value)      || 60;
  const remind   = parseInt(document.getElementById("sched-remind").value)        || 30;
  const location = (document.getElementById("sched-location").value || "").trim();
  const notes    = (document.getElementById("sched-notes").value    || "").trim();
  if (!date) { showToast("⚠ Please pick a date", true); return; }
  const rehearsalTime = new Date(`${date}T${time}`);
  if (isNaN(rehearsalTime)) { showToast("⚠ Invalid date/time", true); return; }
  const notifyTime = new Date(rehearsalTime.getTime() - remind * 60 * 1000);
  const user = notifAuth.currentUser;
  const createdBy = user?.displayName || user?.email || "Member";
  const btn = document.getElementById("save-reminder-btn");
  btn.disabled = true; btn.textContent = "Saving…";
  try {
    await addDoc(collection(notifDb, "rehearsal_reminders"), {
      title, date, time, duration, remind, location, notes,
      rehearsal_ts: rehearsalTime.getTime(),
      notify_ts:    notifyTime.getTime(),
      created_by:   createdBy,
      created_at:   new Date().toISOString()
    });
    showToast("✅ Reminder saved! Visible to all members.");
    document.getElementById("sched-title").value    = "";
    document.getElementById("sched-location").value = "";
    document.getElementById("sched-notes").value    = "";
    await loadRemindersFromDB();
  } catch (err) { showToast("Save failed: " + err.message, true); }
  finally { btn.disabled = false; btn.textContent = "⏰ Save & Share Reminder"; }
}

function scheduleTimer(rem) {
  const diff = rem.notify_ts - Date.now();
  if (diff <= 0) return;
  clearTimeout(reminderTimers[rem.id]);
  reminderTimers[rem.id] = setTimeout(() => {
    const body = `"${rem.title}" starts in ${rem.remind} min${rem.location ? " at " + rem.location : ""}`;
    if (Notification.permission === "granted") {
      new Notification("🎵 Rehearsal Soon!", { body, icon: "mseufcs.png", tag: rem.id });
    }
    showToast("🔔 " + body);
  }, diff);
}

async function deleteReminder(id) {
  clearTimeout(reminderTimers[id]);
  delete reminderTimers[id];
  try {
    await deleteDoc(doc(notifDb, "rehearsal_reminders", id));
    showToast("Reminder deleted");
    await loadRemindersFromDB();
  } catch (err) { showToast("Delete failed: " + err.message, true); }
}

function renderReminders() {
  const container = document.getElementById("reminders-list");
  if (!container) return;
  const now    = Date.now();
  const future = reminders.filter(r => r.rehearsal_ts > now).sort((a,b) => a.rehearsal_ts - b.rehearsal_ts);
  const past   = reminders.filter(r => r.rehearsal_ts <= now).sort((a,b) => b.rehearsal_ts - a.rehearsal_ts).slice(0,5);
  if (!reminders.length) {
    container.innerHTML = `<p style="color:var(--muted);font-size:.83rem;text-align:center;padding:12px 0">No reminders yet. Add the first one above!</p>`;
    return;
  }
  const group = (list, label) => {
    if (!list.length) return "";
    return `<div style="font-size:.68rem;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.08em;margin:10px 0 6px">${label}</div>
      ${list.map(r => `
        <div class="reminder-card ${r.rehearsal_ts <= now ? "past" : ""}">
          <div class="reminder-info">
            <div class="reminder-title">${escHtmlN(r.title)}</div>
            <div class="reminder-meta">📅 ${r.date} &nbsp;🕐 ${r.time}${r.location ? ` &nbsp;📍 ${escHtmlN(r.location)}` : ""} &nbsp;⏱ ${r.duration} min &nbsp;🔔 ${r.remind} min before</div>
            ${r.notes ? `<div class="reminder-notes">📝 ${escHtmlN(r.notes)}</div>` : ""}
            <div style="font-size:.68rem;color:var(--muted);margin-top:4px">👤 ${escHtmlN(r.created_by || "Member")}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:5px;align-items:center;flex-shrink:0">
            <button class="btn btn-calendar btn-sm" onclick="exportSingleToCalendar('google','${r.id}')" title="Google Calendar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7Z"/></svg> GCal
            </button>
            <button class="btn btn-calendar btn-sm" onclick="exportSingleToCalendar('ics','${r.id}')" title=".ics">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12H12V17H17V12ZM16 1V3H8V1H6V3H5C3.89 3 3 3.9 3 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H18V1H16ZM19 19H5V8H19V19Z"/></svg> .ics
            </button>
            <button class="action-btn del-btn" onclick="deleteReminder('${r.id}')" title="Delete">🗑</button>
          </div>
        </div>`).join("")}`;
  };
  container.innerHTML = group(future, "📆 Upcoming") + group(past, "🕐 Past (last 5)");
}

function exportToCalendar(type) {
  const title    = (document.getElementById("sched-title").value    || "").trim() || "MSEUF Rehearsal";
  const date     = document.getElementById("sched-date").value;
  const time     = document.getElementById("sched-time").value                    || "14:00";
  const duration = parseInt(document.getElementById("sched-duration").value)      || 60;
  const location = (document.getElementById("sched-location").value || "").trim();
  const notes    = (document.getElementById("sched-notes").value    || "").trim();
  const remind   = parseInt(document.getElementById("sched-remind").value)        || 30;
  if (!date) { showToast("⚠ Fill in a date first", true); return; }
  doCalendarExport(type, { title, date, time, duration, location, notes, remind, rehearsal_ts: new Date(`${date}T${time}`).getTime() });
}

function exportSingleToCalendar(type, remId) {
  const r = reminders.find(r => r.id === remId);
  if (r) doCalendarExport(type, r);
}

function doCalendarExport(type, rem) {
  const start = new Date(rem.rehearsal_ts);
  const end   = new Date(start.getTime() + (rem.duration || 60) * 60000);
  if (type === "google") {
    const fmt = d => d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action","TEMPLATE");
    url.searchParams.set("text", rem.title);
    url.searchParams.set("dates",`${fmt(start)}/${fmt(end)}`);
    url.searchParams.set("details", rem.notes || "MSEUF Concert Singers Rehearsal");
    if (rem.location) url.searchParams.set("location", rem.location);
    window.open(url.toString(), "_blank");
    showToast("Opening Google Calendar…");
    return;
  }
  const pad = n => String(n).padStart(2,"0");
  const fL  = d => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//MSEUF Concert Singers//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VEVENT",
    `UID:${Date.now()}@mseufcs`,`DTSTART:${fL(start)}`,`DTEND:${fL(end)}`,`SUMMARY:${rem.title}`,
    `DESCRIPTION:${rem.notes || "MSEUF Concert Singers Rehearsal"}`,
    rem.location ? `LOCATION:${rem.location}` : "",
    "BEGIN:VALARM",`TRIGGER:-PT${rem.remind||30}M`,"ACTION:DISPLAY",`DESCRIPTION:Reminder: ${rem.title}`,"END:VALARM",
    "END:VEVENT","END:VCALENDAR"].filter(Boolean).join("\r\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" })),
    download: rem.title.replace(/[^a-z0-9]/gi,"_") + ".ics"
  });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  showToast("📅 .ics downloaded!");
}

function updateBellBadge() {
  const btn = document.getElementById("notif-btn");
  if (!btn) return;
  const n = reminders.filter(r => r.rehearsal_ts > Date.now()).length;
  btn.innerHTML = n > 0 ? `🔔 Reminders <span class="bell-badge">${n}</span>` : `🔔 Reminders`;
}

function escHtmlN(s) {
  return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// Expose globally
window.openNotifModal          = openNotifModal;
window.closeNotifModal         = closeNotifModal;
window.requestNotifPermission  = requestNotifPermission;
window.sendTestNotif           = sendTestNotif;
window.scheduleReminder        = scheduleReminder;
window.deleteReminder          = deleteReminder;
window.exportToCalendar        = exportToCalendar;
window.exportSingleToCalendar  = exportSingleToCalendar;

document.addEventListener("DOMContentLoaded", () => {
  registerSW();
  loadRemindersFromDB();
  setInterval(loadRemindersFromDB, 30000);
  document.getElementById("notif-modal")?.addEventListener("click", e => {
    if (e.target === document.getElementById("notif-modal")) closeNotifModal();
  });
});
