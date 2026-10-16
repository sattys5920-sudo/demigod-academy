/* 저장소 — 브라우저를 즉시 캐시로 쓰고, 파이어스토어에 밀어 쓴다.

   파이어스토어 SDK 를 못 불러오거나, 아직 안 켜져 있거나, 네트워크가 막혀도
   게임은 그대로 돌아간다. 그래서 SDK 를 정적으로 import 하지 않고 안에서
   동적으로 부른다 — 여기서 실패해도 인증 모듈이 같이 죽지 않게. */

const SDK = 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
const localKey = (uid) => 'demigod.save.' + uid;

function readLocal(uid) {
  try { const raw = localStorage.getItem(localKey(uid)); return raw ? JSON.parse(raw) : null; }
  catch (_) { return null; }
}
function writeLocal(uid, state) {
  try { localStorage.setItem(localKey(uid), JSON.stringify(state)); } catch (_) {}
}

/* 진행된 정도 — 둘 다 있을 때 어느 쪽을 쓸지 고른다 */
function size(s) {
  if (!s) return -1;
  return Object.keys(s.owned || {}).length * 10 + (s.feed || []).length;
}

export async function attachStore(uid) {
  const local = readLocal(uid);
  let fs = null, ref = null, cloud = null, ok = false;

  try {
    const [mod, init] = await Promise.all([import(SDK), import('./firebase-init.js')]);
    fs = mod;
    ref = mod.doc(mod.getFirestore(init.app), 'users', uid, 'save', 'main');
    const snap = await mod.getDoc(ref);
    ok = true;
    if (snap.exists()) cloud = snap.data().state || null;
  } catch (err) {
    console.warn('[store] 클라우드 저장을 쓸 수 없어 브라우저에만 담습니다:', (err && err.code) || err);
  }

  const initial = size(cloud) >= size(local) ? (cloud || local) : local;

  let timer = null, pending = null;
  function put(state) {
    writeLocal(uid, state);
    if (!ok) return;
    pending = state;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const s = pending; pending = null;
      try { await fs.setDoc(ref, { state: s, at: fs.serverTimestamp() }, { merge: true }); }
      catch (err) { console.warn('[store] 클라우드 쓰기 실패:', (err && err.code) || err); }
    }, 1500);   /* 몰아서 한 번 — 쓰기 횟수를 아낀다 */
  }

  return { initial, put, cloud: ok };
}
