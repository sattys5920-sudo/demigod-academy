/* 인증 · 프로필 — 화면 조작(app.js)과 떨어뜨려 둔다. */
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { auth } from './firebase-init.js';
import { godOf, loadProfile, paintAvatar } from './profile.js';
import { attachStore } from './store.js';

const UI = window.DGA;
UI.paintAvatar = paintAvatar;

const gate = document.getElementById('gate');

onAuthStateChanged(auth, async (user) => {
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

  const store = await attachStore(user.uid);
  UI.put = store.put;
  if (!store.cloud) console.info('[store] 브라우저에만 저장합니다. Firestore 를 켜면 기기 사이로 이어집니다.');

  const start = () => UI.boot(user.uid, store.initial);
  if (typeof UI.boot === 'function') start();
  else UI.onReady = start;

  if (gate) gate.remove();
});

document.getElementById('logout').addEventListener('click', async () => {
  try { await signOut(auth); } catch (_) { /* 이미 끊긴 세션 */ }
  location.replace('index.html');
});
