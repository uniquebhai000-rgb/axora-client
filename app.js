const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- demo data (not real) ---------- */
const VERSIONS = ['1.21.10', '1.21.4', '1.20.6', '1.20.1', '1.19.4', '1.8.9'];
const NEWS = [
  { tag: 'Update',  title: 'Axora Client v1.0.0', text: 'A new era begins!',           date: 'Nov 22, 2026', c: 'linear-gradient(#f6a85b,#3b7a3b)' },
  { tag: 'Feature', title: 'Better Performance',  text: 'Enjoy smoother gameplay.',    date: 'Nov 15, 2026', c: 'linear-gradient(#8B35FF,#1a0838)' },
  { tag: 'News',    title: 'New UI Design',       text: 'A more beautiful interface.', date: 'Nov 10, 2026', c: 'linear-gradient(#FF1744,#1a0838)' },
];
const MODS = [
  { n: 'Performance Core', d: 'Demo entry', on: true },
  { n: 'Zoom',             d: 'Demo entry', on: true },
  { n: 'Minimap',          d: 'Demo entry', on: false },
  { n: 'Keystrokes HUD',   d: 'Demo entry', on: false },
];
const SHADERS = ['Off', 'Neon Nights (demo)', 'Soft Clouds (demo)', 'Realistic (demo)'];

let version = localStorage.getItem('axora.version') || VERSIONS[0];
let shader = 0;

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
const row = (html, cls = '') => { const d = document.createElement('div'); d.className = 'row ' + cls; d.innerHTML = html; return d; };

/* navigation */
function go(page) {
  if (!$('#page-' + page)) page = 'home';
  $$('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + page));
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  history.replaceState(null, '', '#' + page);
  $('.main').scrollTo(0, 0);
}
$$('.nav-item').forEach(b => b.addEventListener('click', () => go(b.dataset.page)));
$$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
$$('[data-toast]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); toast(b.dataset.toast); }));

/* version selector */
function setVersion(v) {
  version = v; localStorage.setItem('axora.version', v);
  $('#verLabel').textContent = v; $('#qJava').textContent = v;
  $$('#verList li').forEach(li => li.classList.toggle('sel', li.textContent === v));
  renderVersionPage();
}
VERSIONS.forEach(v => {
  const li = document.createElement('li'); li.textContent = v;
  li.addEventListener('click', () => { setVersion(v); $('#verSelect').classList.remove('open'); });
  $('#verList').appendChild(li);
});
$('#verBtn').addEventListener('click', e => { e.stopPropagation(); $('#verSelect').classList.toggle('open'); });
document.addEventListener('click', () => $('#verSelect').classList.remove('open'));

/* play: prototype only */
$('#play').addEventListener('click', () =>
  toast(`Prototype only: Axora can't launch Minecraft ${version} yet.`));

/* news */
$('#newsRow').innerHTML = NEWS.map(n => `
  <article class="card"><div class="img" style="background:${n.c}"></div>
  <div class="body"><span class="tag ${n.tag}">${n.tag}</span><strong>${n.title}</strong>${n.text}<span>${n.date}</span></div></article>`).join('');

/* versions page */
function renderVersionPage() {
  const box = $('#verPage'); box.innerHTML = '';
  VERSIONS.forEach(v => {
    const r = row(`<div><strong>Minecraft ${v}</strong><small>Java Edition</small></div>
      <span class="pill">${v === version ? 'Selected' : 'Select'}</span>`, v === version ? 'sel' : '');
    r.style.cursor = 'pointer';
    r.addEventListener('click', () => { setVersion(v); toast(`Selected ${v}`); });
    box.appendChild(r);
  });
}

/* mods page */
MODS.forEach(m => {
  const r = row(`<div><strong>${m.n}</strong><small>${m.d}</small></div><button class="switch ${m.on ? 'on' : ''}" aria-label="Toggle ${m.n}"></button>`);
  r.querySelector('.switch').addEventListener('click', e => { m.on = !m.on; e.currentTarget.classList.toggle('on', m.on); });
  $('#modList').appendChild(r);
});

/* shaders page */
function renderShaders() {
  const box = $('#shaderList'); box.innerHTML = '';
  SHADERS.forEach((s, i) => {
    const r = row(`<strong>${s}</strong><span class="pill">${i === shader ? 'Selected' : 'Select'}</span>`, i === shader ? 'sel' : '');
    r.style.cursor = 'pointer';
    r.addEventListener('click', () => { shader = i; renderShaders(); });
    box.appendChild(r);
  });
}

/* settings */
const ram = $('#ram');
ram.value = localStorage.getItem('axora.ram') || 4;
const showRam = () => { $('#ramVal').textContent = ram.value + ' GB'; };
ram.addEventListener('input', showRam); showRam();
$('#qRam').textContent = ram.value + ' GB';
$('#saveSettings').addEventListener('click', () => {
  localStorage.setItem('axora.ram', ram.value);
  $('#qRam').textContent = ram.value + ' GB';
  toast('Settings saved in this browser.');
});

$('#search').addEventListener('keydown', e => { if (e.key === 'Enter') toast('Search is not built yet.'); });

renderShaders(); setVersion(version);
go(location.hash.slice(1) || 'home');
