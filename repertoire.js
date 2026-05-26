/* ═══════════════════════════════════════════════════
   MSEUF Concert Singers – Song Repertoire Tracker
   repertoire.js | Firebase Firestore
═══════════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const SONGS_DB = {
  "BATCH": {
    "EASY": [
      {
        "title": "Now That I Have You",
        "solo": "SOLO",
        "id": "builtin_BATCH_EASY_0"
      },
      {
        "title": "Ikaw Lamang",
        "solo": "SOLO",
        "id": "builtin_BATCH_EASY_1"
      },
      {
        "title": "L'Important C'est La Rose",
        "solo": "DESCANT",
        "id": "builtin_BATCH_EASY_2"
      },
      {
        "title": "Ave Verum Corpus",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_3"
      },
      {
        "title": "Viri Galilaei",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_4"
      },
      {
        "title": "Manila, Manila",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_5"
      },
      {
        "title": "Rosas Pandan",
        "solo": "DESCANT",
        "id": "builtin_BATCH_EASY_6"
      },
      {
        "title": "Kalesa",
        "solo": "SOLO",
        "id": "builtin_BATCH_EASY_7"
      },
      {
        "title": "Above All Else",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_8"
      },
      {
        "title": "One Thing I Ask",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_9"
      },
      {
        "title": "Bibingka",
        "solo": "SOLO",
        "id": "builtin_BATCH_EASY_10"
      },
      {
        "title": "Til I Met You",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_11"
      },
      {
        "title": "Leron, Leron Sinta",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_12"
      },
      {
        "title": "Dahil Sa Iyo",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_13"
      },
      {
        "title": "Simbang Gabi",
        "solo": "DESCANT",
        "id": "builtin_BATCH_EASY_14"
      },
      {
        "title": "Bonse Aba",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_15"
      },
      {
        "title": "Izzar Ederak",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_16"
      },
      {
        "title": "Noypi",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_17"
      },
      {
        "title": "Why We Sing",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_18"
      },
      {
        "title": "For Good",
        "solo": "SOLO",
        "id": "builtin_BATCH_EASY_19"
      },
      {
        "title": "Na'ay",
        "solo": "NONE",
        "id": "builtin_BATCH_EASY_20"
      }
    ],
    "MEDIUM": [
      {
        "title": "Kruhay",
        "solo": "DESCANT",
        "id": "builtin_BATCH_MEDIUM_0"
      },
      {
        "title": "Chua-ay",
        "solo": "DESCANT",
        "id": "builtin_BATCH_MEDIUM_1"
      },
      {
        "title": "Exultate Justi In Domino",
        "solo": "NONE",
        "id": "builtin_BATCH_MEDIUM_2"
      },
      {
        "title": "Namamasko",
        "solo": "DESCANT",
        "id": "builtin_BATCH_MEDIUM_3"
      },
      {
        "title": "Gaano Ko Ikaw Kamahal",
        "solo": "NONE",
        "id": "builtin_BATCH_MEDIUM_4"
      },
      {
        "title": "Nais Ko",
        "solo": "NONE",
        "id": "builtin_BATCH_MEDIUM_5"
      },
      {
        "title": "Cebuano Medley",
        "solo": "DESCANT",
        "id": "builtin_BATCH_MEDIUM_6"
      },
      {
        "title": "Pangarap Ko ang Ibigin ka",
        "solo": "DESCANT",
        "id": "builtin_BATCH_MEDIUM_7"
      },
      {
        "title": "Bahay",
        "solo": "NONE",
        "id": "builtin_BATCH_MEDIUM_8"
      },
      {
        "title": "Kay Ganda ng Ating Musika",
        "solo": "NONE",
        "id": "builtin_BATCH_MEDIUM_9"
      },
      {
        "title": "Minsan ang Minahal ay Ako",
        "solo": "SOLO",
        "id": "builtin_BATCH_MEDIUM_10"
      },
      {
        "title": "Sa Mahal Kong Bayan",
        "solo": "NONE",
        "id": "builtin_BATCH_MEDIUM_11"
      },
      {
        "title": "Rosita De Un Verde Palmar",
        "solo": "NONE",
        "id": "builtin_BATCH_MEDIUM_12"
      },
      {
        "title": "The Majesty and Glory of Your Name",
        "solo": "NONE",
        "id": "builtin_BATCH_MEDIUM_13"
      },
      {
        "title": "Abba Gold",
        "solo": "NONE",
        "id": "builtin_BATCH_MEDIUM_14"
      },
      {
        "title": "Bagani",
        "solo": "NONE",
        "id": "builtin_BATCH_MEDIUM_15"
      }
    ],
    "HARD": [
      {
        "title": "Kaisa-isa Niyan",
        "solo": "NONE",
        "id": "builtin_BATCH_HARD_0"
      },
      {
        "title": "Padayon",
        "solo": "SOLO",
        "id": "builtin_BATCH_HARD_1"
      },
      {
        "title": "Himig ng Hangin",
        "solo": "NONE",
        "id": "builtin_BATCH_HARD_2"
      },
      {
        "title": "Three Kalinga Chants",
        "solo": "SOLO",
        "id": "builtin_BATCH_HARD_3"
      },
      {
        "title": "Talismane",
        "solo": "NONE",
        "id": "builtin_BATCH_HARD_4"
      },
      {
        "title": "Iisang Bangka",
        "solo": "NONE",
        "id": "builtin_BATCH_HARD_5"
      },
      {
        "title": "Alleluia",
        "solo": "NONE",
        "id": "builtin_BATCH_HARD_6"
      },
      {
        "title": "Bituing Walang Ningning",
        "solo": "NONE",
        "id": "builtin_BATCH_HARD_7"
      },
      {
        "title": "Sana'y Wala Nang Wakas",
        "solo": "NONE",
        "id": "builtin_BATCH_HARD_8"
      },
      {
        "title": "Piliin Mo Ang Pilipinas",
        "solo": "NONE",
        "id": "builtin_BATCH_HARD_9"
      }
    ]
  },
  "ENGLISH_MASS": {
  "EASY": [
    {
      "title": "Alleluia - Jeremiah Neztler",
      "solo": "NONE",
      "id": "builtin_ENGLISH_MASS_EASY_0"
    },
    {
      "title": "Ashes",
      "solo": "NONE",
      "id": "builtin_ENGLISH_MASS_EASY_1"
    },
    {
      "title": "Blessed Be The Name",
      "solo": "NONE",
      "id": "builtin_ENGLISH_MASS_EASY_2"
    },
    {
      "title": "Lead Me Lord",
      "solo": "NONE",
      "id": "builtin_ENGLISH_MASS_EASY_3"
    },
    {
      "title": "Sing to the Lord",
      "solo": "NONE",
      "id": "builtin_ENGLISH_MASS_EASY_4"
    },
    {
      "title": "Take and Receive",
      "solo": "NONE",
      "id": "builtin_ENGLISH_MASS_EASY_5"
    },
    {
      "title": "Thanks to the Lord",
      "solo": "NONE",
      "id": "builtin_ENGLISH_MASS_EASY_6"
    }
  ],
  "MEDIUM": [
    {
      "title": "English Mass",
      "solo": "NONE",
      "id": "builtin_ENGLISH_MASS_MEDIUM_0"
    },
    {
      "title": "Mass Songs Wedding",
      "solo": "NONE",
      "id": "builtin_ENGLISH_MASS_MEDIUM_1"
    },
    {
      "title": "Prayer of St. Francis of Assisi",
      "solo": "NONE",
      "id": "builtin_ENGLISH_MASS_MEDIUM_2"
    },
    {
      "title": "Prayer of St. Theresa of Avila",
      "solo": "NONE",
      "id": "builtin_ENGLISH_MASS_MEDIUM_3"
    }
  ],
  "HARD": []
},
  "TAGALOG_MASS": {
  "EASY": [
    {
      "title": "Alay Sa Diyos",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_0"
    },
    {
      "title": "Ama Namin",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_1"
    },
    {
      "title": "Awit Ng Paghahangad",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_2"
    },
    {
      "title": "Bayan, Magsiawit Na",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_3"
    },
    {
      "title": "Great Amen",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_4"
    },
    {
      "title": "Humayo't Ihayag",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_5"
    },
    {
      "title": "Ito Ang Araw",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_6"
    },
    {
      "title": "Kordero ng Diyos",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_7"
    },
    {
      "title": "Kyrie Eleison",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_8"
    },
    {
      "title": "Laudate Dominum",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_9"
    },
    {
      "title": "Panunumpa",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_10"
    },
    {
      "title": "Papuri Sa Diyos",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_11"
    },
    {
      "title": "Santo",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_12"
    },
    {
      "title": "Si Kristo'y Namatay",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_13"
    },
    {
      "title": "Stella Maris",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_14"
    },
    {
      "title": "Tinapay ng Buhay",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_EASY_15"
    }
  ],
  "MEDIUM": [
    {
      "title": "Banal Ka Poon",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_MEDIUM_0"
    },
    {
      "title": "Misa Pastorela",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_MEDIUM_1"
    },
    {
      "title": "Pag-aalay Ng Bayan",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_MEDIUM_2"
    },
    {
      "title": "Panginoon, Kaawaan Mo Kami",
      "solo": "NONE",
      "id": "builtin_TAGALOG_MASS_MEDIUM_3"
    }
  ],
  "HARD": []
};

const firebaseConfig = {
  apiKey: "AIzaSyD9u8_gIBZ7Dz75MKSN8KWANnMiT_YlgzM",
  authDomain: "mseufcsrepertoire-3a24f.firebaseapp.com",
  projectId: "mseufcsrepertoire-3a24f",
  storageBucket: "mseufcsrepertoire-3a24f.firebasestorage.app",
  messagingSenderId: "667145296565",
  appId: "1:667145296565:web:046acc0e3823060d3bfcfc",
  measurementId: "G-53PHR6TQT9"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const auth = getAuth(app);

let statuses    = {};
let customSongs = [];
let currentCat  = "BATCH";
let saving      = {};
let deletingId  = null;

const DIFF_COLORS = { EASY: "var(--easy)", MEDIUM: "var(--medium)", HARD: "var(--hard)" };

const STATUS_LABELS = {
  "rehearsed":        "✔ Rehearsed",
  "not-rehearsed":    "✘ Not Rehearsed",
  "to-be-rehearsed":  "🔔 To Be Rehearsed",
  "assessed":         "◉ Sang for Assessment",
  "none":             "— No Status"
};

const STATUS_COLORS = {
  "rehearsed":        "var(--s-rehearsed)",
  "not-rehearsed":    "var(--s-not-rehearsed)",
  "to-be-rehearsed":  "var(--s-to-be-rehearsed)",
  "assessed":         "var(--s-assessed)",
  "none":             "var(--muted)"
};

// Toast
let toastTimer;
function showToast(msg, isError = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.background = isError ? "linear-gradient(135deg,#f85149,#ff6b6b)" : "linear-gradient(135deg,#c9a84c,#e8c97a)";
  t.style.color = isError ? "#fff" : "#2d0609";
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// Auth
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "https://carlosjosealbiol.github.io/mseufcsrepertoire/index.html";
  } else {
    loadUserInfo(user);
    loadAll();
  }
});

function loadUserInfo(user) {
  const nameEl   = document.getElementById("header-name");
  const avatarEl = document.getElementById("header-avatar");
  if (nameEl) nameEl.textContent = user.displayName || user.email?.split("@")[0] || "Member";
  if (avatarEl && user.photoURL) {
    avatarEl.src = user.photoURL;
    avatarEl.style.display = "block";
  }
}

async function signOutApp() {
  await signOut(auth);
  window.location.href = "https://carlosjosealbiol.github.io/mseufcsrepertoire/index.html";
}

// Load
async function loadAll() {
  await Promise.all([loadStatuses(), loadCustomSongs()]);
}

async function loadStatuses() {
  try {
    const snap = await getDocs(collection(db, "repertoire_status"));
    statuses = {};
    snap.forEach(d => { statuses[d.id] = d.data().status; });
    renderSongs();
  } catch (err) {
    showToast("Could not load: " + err.message, true);
    renderSongs();
  }
}

async function loadCustomSongs() {
  try {
    const snap = await getDocs(collection(db, "repertoire_songs"));
    customSongs = [];
    snap.forEach(d => customSongs.push({ id: d.id, ...d.data() }));
    customSongs.sort((a, b) => (a.created_at || "").localeCompare(b.created_at || ""));
    renderSongs();
  } catch (err) { console.error(err); }
}

function getMergedSongs(cat, diff) {
  const builtin = ((SONGS_DB[cat] || {})[diff] || []);
  const custom  = customSongs.filter(s => s.category === cat && s.difficulty === diff)
    .map(s => ({ id: s.id, title: s.title, solo: s.solo || "NONE", isCustom: true }));
  return [...builtin, ...custom];
}

// Status toggle
async function setStatus(songId, newStatus) {
  const current     = statuses[songId] || "none";
  const finalStatus = (current === newStatus) ? "none" : newStatus;
  statuses[songId]  = finalStatus;
  updateStatusButtons(songId, finalStatus);
  updateStats();
  clearTimeout(saving[songId]);
  saving[songId] = setTimeout(async () => {
    try {
      await setDoc(doc(db, "repertoire_status", songId), {
        status: finalStatus,
        updated_at: new Date().toISOString()
      });
      showToast(finalStatus === "none" ? "Status cleared" : STATUS_LABELS[finalStatus]);
    } catch (err) { showToast("Save failed: " + err.message, true); }
  }, 400);
}

function updateStatusButtons(songId, status) {
  ["rehearsed","not-rehearsed","to-be-rehearsed","assessed"].forEach(s => {
    const btn = document.getElementById("btn-" + songId + "-" + s);
    if (!btn) return;
    btn.classList.remove("active-rehearsed","active-not-rehearsed","active-to-be-rehearsed","active-assessed");
    if (status === s) btn.classList.add("active-" + s);
  });
  const lbl = document.getElementById("lbl-" + songId);
  if (lbl) {
    lbl.textContent = status === "none" ? "" : STATUS_LABELS[status];
    lbl.style.color = STATUS_COLORS[status] || "var(--muted)";
  }
}

// Modals
function openAddModal() {
  document.getElementById("modal-title").textContent = "＋ Add New Song";
  document.getElementById("m-title").value    = "";
  document.getElementById("m-diff").value     = "EASY";
  document.getElementById("m-solo").value     = "NONE";
  document.getElementById("m-category").value = currentCat;
  document.getElementById("m-edit-id").value  = "";
  document.getElementById("m-save-btn").textContent = "💾 Save Song";
  document.getElementById("song-modal").classList.add("open");
  setTimeout(() => document.getElementById("m-title").focus(), 100);
}

function openAddModalFor(diff) { openAddModal(); document.getElementById("m-diff").value = diff; }

function openEditModal(songId) {
  const song = customSongs.find(s => s.id === songId);
  if (!song) return;
  document.getElementById("modal-title").textContent = "✏ Edit Song";
  document.getElementById("m-title").value    = song.title;
  document.getElementById("m-diff").value     = song.difficulty;
  document.getElementById("m-solo").value     = song.solo || "NONE";
  document.getElementById("m-category").value = song.category || currentCat;
  document.getElementById("m-edit-id").value  = song.id;
  document.getElementById("m-save-btn").textContent = "💾 Update Song";
  document.getElementById("song-modal").classList.add("open");
  setTimeout(() => document.getElementById("m-title").focus(), 100);
}

function closeModal() { document.getElementById("song-modal").classList.remove("open"); }

async function saveSongModal() {
  const title    = document.getElementById("m-title").value.trim();
  const diff     = document.getElementById("m-diff").value;
  const solo     = document.getElementById("m-solo").value;
  const category = document.getElementById("m-category").value;
  const editId   = document.getElementById("m-edit-id").value;
  if (!title) { showToast("⚠ Please enter a song title", true); return; }
  const btn = document.getElementById("m-save-btn");
  btn.disabled = true; btn.textContent = "Saving…";
  try {
    const id = editId || "custom_" + Date.now();
    await setDoc(doc(db, "repertoire_songs", id), {
      title, difficulty: diff, solo, category,
      created_at: new Date().toISOString()
    });
    showToast(editId ? "✅ Song updated!" : "✅ Song added!");
    closeModal();
    await loadCustomSongs();
  } catch (err) { showToast("Save failed: " + err.message, true); }
  finally { btn.disabled = false; btn.textContent = editId ? "💾 Update Song" : "💾 Save Song"; }
}

function openDeleteModal(songId, songTitle) {
  deletingId = songId;
  document.getElementById("delete-song-name").textContent = songTitle;
  document.getElementById("delete-modal").classList.add("open");
}

function closeDeleteModal() { deletingId = null; document.getElementById("delete-modal").classList.remove("open"); }

async function confirmDelete() {
  if (!deletingId) return;
  const btn = document.getElementById("confirm-delete-btn");
  btn.disabled = true; btn.textContent = "Deleting…";
  try {
    await deleteDoc(doc(db, "repertoire_songs", deletingId));
    await deleteDoc(doc(db, "repertoire_status", deletingId));
    delete statuses[deletingId];
    showToast("Song deleted");
    closeDeleteModal();
    await loadCustomSongs();
  } catch (err) { showToast("Delete failed: " + err.message, true); }
  finally { btn.disabled = false; btn.textContent = "🗑 Delete"; }
}

function switchCat(cat) {
  currentCat = cat;
  document.querySelectorAll(".cat-tab").forEach(t => t.classList.toggle("active", t.dataset.cat === cat));
  renderSongs();
}

// Render
function renderSongs() {
  const query        = (document.getElementById("search-input").value || "").toLowerCase();
  const filterDiff   = document.getElementById("filter-diff").value;
  const filterStatus = document.getElementById("filter-status").value;
  const grid         = document.getElementById("song-grid");
  let html = "";

  ["EASY","MEDIUM","HARD"].forEach(diff => {
    if (filterDiff && filterDiff !== diff) return;
    const songs = getMergedSongs(currentCat, diff).filter(s => {
      const matchQ = !query || s.title.toLowerCase().includes(query);
      const st     = statuses[s.id] || "none";
      return matchQ && (!filterStatus || st === filterStatus);
    });
    if (!songs.length) return;
    const diffLabel = diff.charAt(0) + diff.slice(1).toLowerCase();
    html += `
      <div class="diff-section">
        <div class="diff-header">
          <div class="diff-dot" style="background:${DIFF_COLORS[diff]}"></div>
          <span style="color:${DIFF_COLORS[diff]};font-family:'Playfair Display',serif">${diffLabel}</span>
          <span class="diff-count">${songs.length} song${songs.length !== 1 ? "s" : ""}</span>
          <button class="btn btn-gold btn-sm" style="margin-left:10px;font-size:.7rem;padding:3px 10px"
                  onclick="openAddModalFor('${diff}')">＋ Add to ${diffLabel}</button>
        </div>
        <table class="song-table">
          <thead>
            <tr>
              <th style="width:36px">#</th>
              <th>Song Title</th>
              <th>Solo / Descant</th>
              <th>Status</th>
              <th>Label</th>
              <th style="width:90px;text-align:center">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${songs.map((s, i) => {
              const st  = statuses[s.id] || "none";
              const stC = STATUS_COLORS[st] || "var(--muted)";
              const id  = s.id;
              return `<tr>
                <td style="color:var(--muted);font-size:.76rem">${i + 1}</td>
                <td class="song-title">${escHtml(s.title)}${s.isCustom ? ' <span style="font-size:.64rem;color:var(--gold);opacity:.75">★</span>' : ""}</td>
                <td><span class="solo-badge solo-${s.solo}">${s.solo}</span></td>
                <td>
                  <div class="status-group">
                    <button class="status-toggle ${st==="rehearsed"?"active-rehearsed":""}" id="btn-${id}-rehearsed" onclick="setStatus('${id}','rehearsed')" title="Rehearsed">✔</button>
                    <button class="status-toggle ${st==="not-rehearsed"?"active-not-rehearsed":""}" id="btn-${id}-not-rehearsed" onclick="setStatus('${id}','not-rehearsed')" title="Not Rehearsed">✘</button>
                    <button class="status-toggle ${st==="to-be-rehearsed"?"active-to-be-rehearsed":""}" id="btn-${id}-to-be-rehearsed" onclick="setStatus('${id}','to-be-rehearsed')" title="To Be Rehearsed">🔔</button>
                    <button class="status-toggle ${st==="assessed"?"active-assessed":""}" id="btn-${id}-assessed" onclick="setStatus('${id}','assessed')" title="Sang for Assessment">◉</button>
                  </div>
                </td>
                <td><span class="status-label" id="lbl-${id}" style="color:${stC}">${st !== "none" ? STATUS_LABELS[st] : ""}</span></td>
                <td style="text-align:center">
                  ${s.isCustom
                    ? `<div style="display:flex;gap:5px;justify-content:center">
                         <button class="action-btn edit-btn" onclick="openEditModal('${id}')" title="Edit">✏</button>
                         <button class="action-btn del-btn" onclick="openDeleteModal('${id}','${s.title.replace(/'/g,"\\'")}')" title="Delete">🗑</button>
                       </div>`
                    : `<span style="font-size:.66rem;color:var(--gold);font-style:italic;font-weight:600">MSEUFCS</span>`}
                </td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>`;
  });

  grid.innerHTML = html || `<div class="empty-state"><div class="icon">🔍</div><p>No songs match your filters.</p></div>`;
  updateStats();
}

// Stats
function updateStats() {
  let total = 0, rehearsed = 0, notRehearsed = 0, toBeRehearsed = 0, assessed = 0;
  ["EASY","MEDIUM","HARD"].forEach(diff => {
    getMergedSongs(currentCat, diff).forEach(s => {
      total++;
      const st = statuses[s.id] || "none";
      if (st === "rehearsed")       rehearsed++;
      if (st === "not-rehearsed")   notRehearsed++;
      if (st === "to-be-rehearsed") toBeRehearsed++;
      if (st === "assessed")        assessed++;
    });
  });
  const none = total - rehearsed - notRehearsed - toBeRehearsed - assessed;
  document.getElementById("stats-bar").innerHTML = `
    <span class="stat-pill" style="background:rgba(63,185,80,.15);color:var(--s-rehearsed)">✔ ${rehearsed}</span>
    <span class="stat-pill" style="background:rgba(248,81,73,.12);color:var(--s-not-rehearsed)">✘ ${notRehearsed}</span>
    <span class="stat-pill" style="background:rgba(255,193,7,.15);color:var(--s-to-be-rehearsed)">🔔 ${toBeRehearsed}</span>
    <span class="stat-pill" style="background:rgba(201,168,76,.15);color:var(--s-assessed)">◉ ${assessed}</span>
    <span class="stat-pill" style="background:rgba(110,118,129,.1);color:var(--muted)">— ${none}</span>
    <span style="font-size:.72rem;color:var(--muted)">/ ${total}</span>
  `;
}

function escHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Expose functions globally
window.setStatus        = setStatus;
window.openAddModal     = openAddModal;
window.openAddModalFor  = openAddModalFor;
window.openEditModal    = openEditModal;
window.closeModal       = closeModal;
window.saveSongModal    = saveSongModal;
window.openDeleteModal  = openDeleteModal;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete    = confirmDelete;
window.switchCat        = switchCat;
window.loadAll          = loadAll;
window.signOutApp       = signOutApp;

document.addEventListener("DOMContentLoaded", () => {
  setInterval(loadAll, 15000);
  document.getElementById("song-modal").addEventListener("click", e => { if (e.target === document.getElementById("song-modal")) closeModal(); });
  document.getElementById("delete-modal").addEventListener("click", e => { if (e.target === document.getElementById("delete-modal")) closeDeleteModal(); });
  document.getElementById("m-title").addEventListener("keydown", e => { if (e.key === "Enter") saveSongModal(); });
});
