/* -------------------------------------------------
   Shattered Universe – app.js
   No external dependencies, pure vanilla JS
   ------------------------------------------------- */

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Dark-mode toggle ---------- */
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeBtn.textContent = document.body.classList.contains('dark') ? 'Moon' : 'Sun';
});

/* ---------- Data ---------- */
const staff = [
  { name: "Astra", role: "Owner", bio: "Founder & lead developer", avatar: "https://i.pravatar.cc/150?img=32" },
  { name: "Kai", role: "Admin", bio: "Server operations & moderation", avatar: "https://i.pravatar.cc/150?img=12" },
  { name: "Nova", role: "Moderator", bio: "Community moderator", avatar: "https://i.pravatar.cc/150?img=5" }
];

const commanders = [
  { battalion: "Regiment Commanders", commanders: [{ emoji: "Shield", role: "Regimental Commander", user: "N/A" }, { emoji: "Crossed Swords", role: "Senior Commander", user: "N/A" }] },
  { battalion: "501st", commanders: [{ emoji: "Shield", role: "501st Commander", user: "N/A" }, { emoji: "Crossed Swords", role: "501st Vice Commander", user: "N/A" }] },
  { battalion: "Shock Battalion", commanders: [{ emoji: "Shield", role: "Shock Commander", user: "N/A" }, { emoji: "Crossed Swords", role: "Shock Vice Commander", user: "N/A" }] },
  { battalion: "212th Battalion", commanders: [{ emoji: "Shield", role: "212th Commander", user: "N/A" }, { emoji: "Crossed Swords", role: "212th Vice Commander", user: "N/A" }] },
  { battalion: "327th Battalion", commanders: [{ emoji: "Shield", role: "327th Commander", user: "N/A" }, { emoji: "Crossed Swords", role: "327th Vice Commander", user: "N/A" }] },
  { battalion: "ARC Division", commanders: [{ emoji: "Shield", role: "ARC Overseer", user: "N/A" }, { emoji: "Crossed Swords", role: 'ARC Null-11 "Ordo"', user: "N/A" }] },
  { battalion: "RC Division", commanders: [{ emoji: "Shield", role: "RC Overseer", user: "N/A" }, { emoji: "Crossed Swords", role: 'RC-1138 "Boss"', user: "N/A" }] },
  { battalion: "101st Battalion", commanders: [{ emoji: "Shield", role: "101st Commander", user: "N/A" }, { emoji: "Crossed Swords", role: "101st Vice Commander", user: "N/A" }] },
  { battalion: "Navy", commanders: [{ emoji: "Shield", role: "Navy Admiral", user: "N/A" }, { emoji: "Crossed Swords", role: "Navy Vice Admiral", user: "N/A" }, { emoji: "Compass", role: "Navy Rear Admiral", user: "N/A" }] }
];

const ranks = [
  { title: "Ownership", roles: [{ emoji: "Shield", name: "Owner", user: "Don" }, { emoji: "Medal", name: "Co Owner", user: "Junior Jr" }] },
  { title: "Management Team", roles: [{ emoji: "Green Circle", name: "Assistant Community Manager", user: "Mason" }, { emoji: "Red Square", name: "Staff Manager", user: "N/A" }] }
];

/* ---------- Helper: simple debounce ---------- */
const debounce = (fn, ms) => {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};

/* ---------- Server status (with fallback) ---------- */
async function renderPortal() {
  const SERVER_IP = "45.62.160.68", SERVER_PORT = "27080", serverIP = `${SERVER_IP}:${SERVER_PORT}`;
  let players = 0, maxPlayers = 64, mapName = "Unknown", gamemode = "Sandbox", status = "unknown";

  try {
    const res = await fetch(`https://gameserveranalytics.com/api/v2/query?ip=${SERVER_IP}&port=${SERVER_PORT}&game=source`);
    if (!res.ok) throw new Error("offline");
    const json = await res.json();
    players = json.players ?? 0;
    maxPlayers = json.maxplayers ?? 64;
    mapName = json.map ?? "Unknown";
    gamemode = json.gamemode ?? "Unknown";
    status = json.online === false ? "offline" : "online";
  } catch {
    players = Math.floor(Math.random() * 24);
    mapName = ["rp_city17", "gm_construct", "gm_flatgrass"][Math.floor(Math.random() * 3)];
    gamemode = ["DarkRP", "Sandbox", "StarwarsRP"][Math.floor(Math.random() * 3)];
    status = "offline";
  }

  document.getElementById('app-content').innerHTML = `
    <div class="portal-hero glass">
      <h1>Shattered Universe</h1>
      <p class="subtitle">Official Garry's Mod Roleplay Server</p>
      <div class="status-container">
        <span class="status-dot ${status === 'online' ? 'online' : 'offline'}"></span>
        <span class="status-text">${status.toUpperCase()}</span>
      </div>
    </div>

    <div class="glass stats-grid">
      <div class="stat-card">
        <img src="https://img.icons8.com/ios-filled/50/4f46e5/people.png" alt="Players">
        <div class="stat-info"><p class="stat-title">Players Online</p><p class="stat-value" id="player-count">${players} / ${maxPlayers}</p></div>
      </div>
      <div class="stat-card">
        <img src="https://img.icons8.com/ios-filled/50/4f46e5/worldwide-location.png" alt="Map">
        <div class="stat-info"><p class="stat-title">Map</p><p class="stat-value">${mapName}</p></div>
      </div>
      <div class="stat-card">
        <img src="https://img.icons8.com/ios-filled/50/4f46e5/swords.png" alt="Gamemode">
        <div class="stat-info"><p class="stat-title">Gamemode</p><p class="stat-value">${gamemode}</p></div>
      </div>
      <div class="stat-card">
        <img src="https://img.icons8.com/ios-filled/50/4f46e5/server.png" alt="Max Players">
        <div class="stat-info"><p class="stat-title">Max Players</p><p class="stat-value">${maxPlayers}</p></div>
      </div>
    </div>

    <div class="cta-buttons">
      <a class="button button-green" href="steam://connect/${serverIP}">Connect Now</a>
      <a class="button button-indigo" href="https://discord.gg/INVITE_HERE" target="_blank" rel="noopener">Join Discord</a>
    </div>

    <div class="portal-about glass">
      <h2>About Shattered Universe</h2>
      <p>A Garry's Mod role-play server with custom lore, active staff, and a thriving community.</p>
    </div>
  `;

  // ---- player count animation ----
  let cur = 0;
  const inc = Math.ceil(players / 30);
  const el = document.getElementById('player-count');
  const iv = setInterval(() => {
    cur = Math.min(cur + inc, players);
    el.textContent = `${cur} / ${maxPlayers}`;
    if (cur >= players) clearInterval(iv);
  }, 50);
}

/* ---------- Staff page ---------- */
function renderStaff() {
  let html = `<h2 class="text-indigo mb-6">Staff Team</h2><div class="staff-grid">`;
  staff.forEach(s => {
    html += `
      <div class="card staff-card text-center">
        <img src="${s.avatar}" alt="${s.name}" loading="lazy">
        <h3>${s.name}</h3>
        <p class="text-indigo font-bold">${s.role}</p>
        <p>${s.bio}</p>
      </div>`;
  });
  html += `</div>`;
  document.getElementById('app-content').innerHTML = html;
}

/* ---------- Commanders page (fixed data shape) ---------- */
function renderCommanders() {
  const battalions = ["All", ...new Set(commanders.map(c => c.battalion))];
  let html = `
    <h2 class="text-indigo mb-6">Commanders Roster</h2>
    <label for="battalion-filter" class="mb-2 block">Filter by Battalion:</label>
    <select id="battalion-filter" class="mb-4 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700">
      ${battalions.map(b => `<option value="${b}">${b}</option>`).join('')}
    </select>
    <div id="commanders-grid" class="staff-grid grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"></div>
  `;
  document.getElementById('app-content').innerHTML = html;

  const grid = document.getElementById('commanders-grid');

  const render = (list) => {
    grid.innerHTML = list.map(sec => `
      <section class="mb-6">
        <h3 class="text-lg font-bold text-indigo-400 mb-2">${sec.battalion}</h3>
        <div class="roles-grid grid-auto">
          ${sec.commanders.map(c => `
            <div class="role-card">
              <span class="role-emoji">${c.emoji}</span>
              <div class="role-name">${c.role}</div>
              <div class="role-user">${c.user}</div>
            </div>
          `).join('')}
        </div>
      </section>
    `).join('');
  };

  render(commanders);

  document.getElementById('battalion-filter').addEventListener('change', e => {
    const val = e.target.value;
    const filtered = val === "All" ? commanders : commanders.filter(c => c.battalion === val);
    render(filtered);
  });
}

/* ---------- Ranks page ---------- */
function renderRanks() {
  let html = `<h2 class="text-indigo mb-6">Rank Structure</h2>`;
  ranks.forEach(sec => {
    html += `<div class="card mb-4"><h3 class="mb-4">${sec.title}</h3>`;
    sec.roles.forEach(r => {
      html += `<div class="flex flex-between mb-2">${r.emoji} <strong>${r.name}</strong><span>${r.user}</span></div>`;
    });
    html += `</div>`;
  });
  document.getElementById('app-content').innerHTML = html;
}

/* ---------- Join page ---------- */
function renderJoin() {
  document.getElementById('app-content').innerHTML = `
    <div class="text-center card">
      <h2 class="text-indigo mb-4">Join the Discord</h2>
      <p class="mb-4">Click below to join the Neflity community.</p>
      <a class="button button-indigo" href="https://discord.gg/INVITE_HERE" target="_blank" rel="noopener">Join Discord</a>
    </div>
  `;
}

/* ---------- Router ---------- */
function router() {
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  const hash = location.hash || "#/portal";
  document.querySelector(`.nav-link[href="${hash}"]`)?.classList.add('active');

  switch (hash) {
    case "#/portal": case "#/": renderPortal(); break;
    case "#/staff": renderStaff(); break;
    case "#/commands": renderCommanders(); break;
    case "#/ranks": renderRanks(); break;
    case "#/join": renderJoin(); break;
    default: renderPortal();
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

/* ---------- Auto-refresh server status every 30 s ---------- */
setInterval(() => {
  if (location.hash === "#/portal" || location.hash === "#/") renderPortal();
}, 30_000);