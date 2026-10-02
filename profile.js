/* 프로필 — 아바타(신성 계열 문장 또는 올린 사진)와 표시 이름.

   지금은 브라우저의 localStorage 에 기기별로 담는다. 같은 아이디로 다른
   기기에서 들어가면 프로필을 다시 고르게 된다. 기기 사이에서 이어지게
   하려면 Firestore 가 필요하다 — 표시 이름만 파이어베이스 계정에 함께
   저장해 두므로 이름은 어디서든 따라온다. */

/* ── 12신 문장 ──────────────────────────────────────────────
   tone 은 디자인 토큰에 있는 두 형광색 중 하나다. */
export const GODS = [
  { key: 'zeus',       name: '제우스',     line: '하늘과 번개',   tone: 'lime',
    svg: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>' },
  { key: 'hera',       name: '헤라',       line: '맹세와 왕관',   tone: 'pink',
    svg: '<path d="M4 19h16"/><path d="M4 19 5 7l4 4 3-6 3 6 4-4 1 12"/>' },
  { key: 'poseidon',   name: '포세이돈',   line: '바다와 지진',   tone: 'lime',
    svg: '<path d="M12 8v13"/><path d="M5 3v6a7 7 0 0 0 14 0V3"/><path d="M12 3v6"/>' },
  { key: 'demeter',    name: '데메테르',   line: '수확과 계절',   tone: 'lime',
    svg: '<path d="M12 21V9"/><path d="M12 9c0-3 1.8-5 4-6 .2 3-1.4 5.6-4 6Z"/><path d="M12 9c0-3-1.8-5-4-6-.2 3 1.4 5.6 4 6Z"/><path d="M12 15c0-3 1.8-4.6 4-5-.2 3-1.4 4.6-4 5Z"/>' },
  { key: 'athena',     name: '아테나',     line: '지략과 올리브', tone: 'lime',
    svg: '<path d="M5 10a7 7 0 0 1 14 0v2a7 7 0 0 1-14 0v-2Z"/><circle cx="9.3" cy="11" r="1.8"/><circle cx="14.7" cy="11" r="1.8"/><path d="M12 14v2"/>' },
  { key: 'apollo',     name: '아폴론',     line: '태양과 노래',   tone: 'lime',
    svg: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2"/><path d="M12 19v2"/><path d="M3 12h2"/><path d="M19 12h2"/><path d="m5.8 5.8 1.4 1.4"/><path d="m16.8 16.8 1.4 1.4"/><path d="m18.2 5.8-1.4 1.4"/><path d="m7.2 16.8-1.4 1.4"/>' },
  { key: 'artemis',    name: '아르테미스', line: '사냥과 달',     tone: 'pink',
    svg: '<path d="M15 3a9 9 0 1 0 0 18 7.2 7.2 0 0 1 0-18Z"/><path d="M19 5v5h-5"/>' },
  { key: 'ares',       name: '아레스',     line: '전쟁과 분노',   tone: 'pink',
    svg: '<path d="M12 3 5 6v5c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6l-7-3Z"/><path d="M9 12h6"/><path d="M12 9v6"/>' },
  { key: 'aphrodite',  name: '아프로디테', line: '사랑과 파도',   tone: 'pink',
    svg: '<path d="M3 19h18"/><path d="M21 19a9 9 0 0 0-18 0"/><path d="M12 19V9"/><path d="M8 19c0-4 1.4-7.5 4-10"/><path d="M16 19c0-4-1.4-7.5-4-10"/>' },
  { key: 'hephaistos', name: '헤파이스토스', line: '불과 쇠',     tone: 'pink',
    svg: '<path d="M4 20 11 13"/><path d="M9.5 10.5 14 6l4.5 4.5L14 15l-4.5-4.5Z"/>' },
  { key: 'hermes',     name: '헤르메스',   line: '전령과 길',     tone: 'lime',
    svg: '<path d="M12 4v17"/><path d="M12 9C9 6 6 6.6 4 8.6 6 10.6 9 11.6 12 9Z"/><path d="M12 9c3-3 6-2.4 8-.4-2 2-5 3-8 .4Z"/>' },
  { key: 'dionysos',   name: '디오니소스', line: '포도와 광기',   tone: 'pink',
    svg: '<circle cx="9.2" cy="13" r="2.1"/><circle cx="14.8" cy="13" r="2.1"/><circle cx="12" cy="17.4" r="2.1"/><path d="M12 10V6"/><path d="M12 6c2-1.2 3.6-1.4 4.6-3.2"/>' }
];

const BY_KEY = {};
GODS.forEach((g) => { BY_KEY[g.key] = g; });

export const godOf = (key) => BY_KEY[key] || GODS[0];

/* ── 저장 ───────────────────────────────────────────────── */
const storeKey = (uid) => 'demigod.profile.' + uid;

export function loadProfile(uid) {
  if (!uid) return null;
  try {
    const raw = localStorage.getItem(storeKey(uid));
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p || typeof p !== 'object' || !p.name) return null;
    return p;
  } catch (_) {
    return null;   /* 저장소를 못 읽는 환경 */
  }
}

export function saveProfile(uid, profile) {
  if (!uid) return false;
  try {
    localStorage.setItem(storeKey(uid), JSON.stringify(profile));
    return true;
  } catch (_) {
    return false;
  }
}

/* ── 그리기 ─────────────────────────────────────────────────
   아바타는 우리가 만든 고정 문장이거나, 쓰는 사람이 올린 사진이다.
   사진은 <img> 로 넣고, 문장은 inline SVG 로 넣는다. */
export function paintAvatar(el, profile, px) {
  if (!el) return;
  const size = px || 44;
  el.textContent = '';
  el.classList.remove('tone-lime', 'tone-pink', 'has-photo');

  if (profile && profile.photo) {
    const img = document.createElement('img');
    img.src = profile.photo;
    img.alt = '';
    el.classList.add('has-photo');
    el.appendChild(img);
    return;
  }

  const god = godOf(profile && profile.god);
  el.classList.add(god.tone === 'pink' ? 'tone-pink' : 'tone-lime');
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', String(Math.round(size * 0.52)));
  svg.setAttribute('height', String(Math.round(size * 0.52)));
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', '#14061F');
  svg.setAttribute('stroke-width', '2.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = god.svg;     /* 위 GODS 의 고정 문자열만 들어간다 */
  el.appendChild(svg);
}

/* 올린 사진을 정사각 160px 로 줄여 data URL 로 바꾼다.
   원본을 그대로 담으면 저장소 한도를 금방 넘긴다. */
export function shrinkImage(file, px) {
  const side = px || 160;
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) {
      reject(new Error('이미지 파일이 아닙니다.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = side;
      canvas.height = side;
      const ctx = canvas.getContext('2d');
      const crop = Math.min(img.width, img.height);
      ctx.drawImage(
        img,
        (img.width - crop) / 2, (img.height - crop) / 2, crop, crop,
        0, 0, side, side
      );
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('사진을 읽지 못했습니다.'));
    };
    img.src = url;
  });
}
