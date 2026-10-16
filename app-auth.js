/* 인증 · 프로필 — 화면 조작(app.js)과 떨어뜨려 둔다. */
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { auth } from './firebase-init.js';
import { godOf, loadProfile, paintAvatar } from './profile.js';
import { attachStore } from './store.js';

/* import 가 다 풀려 여기까지 왔다는 표시. app.js 가 이걸 보고
   '인증 모듈이 살아 있으니 더 기다릴지' 를 정한다. */
window.__authAlive = true;

const UI = window.DGA;
UI.paintAvatar = paintAvatar;

const gate = document.getElementById('gate');

/* 게이트에 갇히지 않게 — 무엇이 잘못됐는지 보여 주고 빠져나갈 길을 준다 */
function fail(title, note) {
  const t = document.getElementById('gateTitle');
  const n = document.getElementById('gateNote');
  if (t) t.textContent = title;
  if (n) n.textContent = note;
  const box = document.querySelector('#gate .box');
  if (box && !box.querySelector('a')) {
    const a = document.createElement('a');
    a.href = 'index.html';
    a.textContent = '로그인 화면으로';
    box.appendChild(a);
  }
}

const step = (t) => { if (UI && typeof UI.step === 'function') UI.step(t); };

onAuthStateChanged(auth, async (user) => {
  window.__authResolved = true;
  step('4 · 저장 여는 중');
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

  let store = { initial: null, put: null, cloud: false };
  try {
    store = await attachStore(user.uid);
  } catch (err) {
    console.warn('[store] 저장을 붙이지 못했습니다:', err);
  }
  step('5 · 화면 그리는 중');
  window.__uid = user.uid;
  if (store.put) UI.put = store.put;
  if (!store.cloud) console.info('[store] 브라우저에만 저장합니다.');

  const start = () => {
    try {
      UI.boot(user.uid, store.initial);
    } catch (err) {
      console.error('[app] 화면을 그리지 못했습니다:', err);
      fail('화면을 그리지 못했습니다', String((err && err.message) || err));
      return;
    }
    step('6 · 완료');
    if (gate && gate.isConnected) gate.remove();   /* boot 이 이미 치웠을 수도 있다 */
  };
  if (typeof UI.boot === 'function') start();
  else UI.onReady = start;
});

document.getElementById('logout').addEventListener('click', async () => {
  try { await signOut(auth); } catch (_) { /* 이미 끊긴 세션 */ }
  location.replace('index.html');
});
