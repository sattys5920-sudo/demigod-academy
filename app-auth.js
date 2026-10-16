/* 인증 · 프로필 — 화면 조작(app.js)과 떨어뜨려 둔다. */
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { auth } from './firebase-init.js';
import { godOf, loadProfile, paintAvatar } from './profile.js';

const UI = window.DGA;
UI.paintAvatar = paintAvatar;

const gate = document.getElementById('gate');

onAuthStateChanged(auth, (user) => {
  window.__authResolved = true;
  if (!user) { location.replace('index.html'); return; }

  const profile = loadProfile(user.uid);
  if (!profile) { location.replace('setup.html'); return; }

  const god = godOf(profile.god);
  UI.player = { name: profile.name, profile, fam: god.key.toUpperCase() };

  document.getElementById('profileName').textContent = profile.name;
  document.getElementById('profileFam').textContent = god.key.toUpperCase() + ' · ' + god.line;
  document.getElementById('battleMe').textContent = profile.name;

  paintAvatar(document.getElementById('hdAva'), profile, 46);
  paintAvatar(document.getElementById('dlgAva'), profile, 88);
  paintAvatar(document.getElementById('composerAva'), profile, 56);

  if (typeof UI.boot === 'function') UI.boot(user.uid);
  else UI.onReady = () => UI.boot(user.uid);

  if (gate) gate.remove();
});

document.getElementById('logout').addEventListener('click', async () => {
  try { await signOut(auth); } catch (_) { /* 이미 끊긴 세션 */ }
  location.replace('index.html');
});
