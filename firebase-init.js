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

export const emailOf = (id) => id.toLowerCase() + EMAIL_DOMAIN;

export const idOf = (user) =>
  (user && (user.displayName || (user.email || '').replace(EMAIL_DOMAIN, ''))) || '';
