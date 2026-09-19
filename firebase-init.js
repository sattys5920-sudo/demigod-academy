/* 파이어베이스 초기화 — 화면들이 공유하는 한 곳.
   이 게임은 이메일이 아니라 아이디로 입장하므로, 아이디를
   <아이디>@demigod-academy.example 로 바꿔 파이어베이스에 넘긴다.
   (.example 은 실제로 존재할 수 없는 예약 도메인이다.)

   여기 담긴 firebaseConfig 는 비밀이 아니다 — 파이어베이스 웹 앱 설정은 공개를
   전제로 설계돼 있고, 실제 보호는 콘솔의 인증 설정과 보안 규칙이 한다. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

export const firebaseConfig = {
  apiKey: 'AIzaSyCOuVma3nGWfGpvgCP_jfXR4hCdP7pCkm0',
  authDomain: 'demig0d.firebaseapp.com',
  projectId: 'demig0d',
  storageBucket: 'demig0d.firebasestorage.app',
  messagingSenderId: '968811968630',
  appId: '1:968811968630:web:86ad7c3d9db58923d80757',
  measurementId: 'G-8C67HN028T'
};

export const EMAIL_DOMAIN = '@demigod-academy.example';

export const auth = getAuth(initializeApp(firebaseConfig));
auth.useDeviceLanguage();

/* 아이디에는 제한이 없다 — 한글도 공백도 기호도 쓸 수 있다.
   파이어베이스에는 이메일 형태로 넘겨야 하므로 두 가지로 나눠 담는다.

   - 이메일 로컬 파트로 그대로 쓸 수 있는 아이디: 예전과 같은 형태로 유지한다.
     (이미 만들어진 계정이 그대로 살아 있어야 한다)
   - 그 밖의 아이디: UTF-8 바이트를 16진수로 바꿔 u<hex> 로 담는다.
     16진수는 소문자·숫자뿐이라 파이어베이스가 이메일을 소문자로 정규화해도
     원래 값이 깨지지 않는다.

   대소문자는 구분하지 않는다. 화면에 보여줄 원래 표기는 displayName 에 남긴다. */
const SAFE_LOCAL = /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/;

/* 이메일 로컬 파트는 64자까지다. u + hex(31바이트) = 63자. */
export const MAX_ID_BYTES = 31;

export const idBytes = (id) => new TextEncoder().encode(id.toLowerCase()).length;

export function emailOf(id) {
  const key = id.toLowerCase();
  if (key.length <= 32 && SAFE_LOCAL.test(key)) return key + EMAIL_DOMAIN;

  let hex = '';
  for (const byte of new TextEncoder().encode(key)) hex += byte.toString(16).padStart(2, '0');
  return 'u' + hex + EMAIL_DOMAIN;
}

function decodeLocal(local) {
  if (!/^u(?:[0-9a-f]{2})+$/.test(local)) return local;
  const bytes = new Uint8Array(local.slice(1).match(/../g).map((h) => parseInt(h, 16)));
  try { return new TextDecoder().decode(bytes); } catch (_) { return local; }
}

export const idOf = (user) => {
  if (!user) return '';
  if (user.displayName) return user.displayName;
  const local = (user.email || '').replace(EMAIL_DOMAIN, '');
  return local ? decodeLocal(local) : '';
};
