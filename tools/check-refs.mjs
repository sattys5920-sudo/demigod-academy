/* 린터가 못 보는 것을 본다.

   ESLint 는 자바스크립트 안만, stylelint 는 CSS 안만, html-validate 는
   HTML 안만 본다. 이 앱이 실제로 깨지는 자리는 그 사이다 —

     · JS 가 찾는 #id 가 HTML 에 없다          (게이트에 갇히게 만든 그 버그)
     · 어디선가 var(--없는토큰) 을 쓴다         (조용히 무시돼 색이 안 먹는다)
     · 아무도 안 쓰는 class 가 CSS 에 남는다
     · UI 에 쓰면 안 되는 색이 남아 있다

   node tools/check-refs.mjs
*/

import { readFileSync } from 'node:fs';

const read = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');

const PAGES = ['app.html', 'index.html', 'setup.html'];
const SCRIPTS = ['app.js', 'app-auth.js', 'store.js', 'profile.js', 'battle.js', 'art.js'];
const SHEETS = ['theme.css', 'app.css', 'page.css'];

const html = PAGES.map(read).join('\n');
const js = SCRIPTS.map(read).join('\n');
const css = SHEETS.map(read).join('\n');

let bad = 0;
const fail = (title, items) => {
  if (!items.length) { console.log('ok   ' + title); return; }
  bad += items.length;
  console.log('FAIL ' + title + ' — ' + items.length + '건');
  for (const i of items) console.log('       ' + i);
};

/* 1 · JS 가 찾는 id 가 HTML 에 있나 */
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const wanted = new Set([
  ...[...js.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].map((m) => m[1]),
  ...[...js.matchAll(/\$\(['"]#([A-Za-z][\w-]*)['"]\)/g)].map((m) => m[1]),
  ...[...js.matchAll(/querySelector\(['"]#([A-Za-z][\w-]*)['"]\)/g)].map((m) => m[1])
]);
fail('JS 가 찾는 id 가 전부 HTML 에 있다', [...wanted].filter((w) => !ids.has(w)).sort());

/* 2 · 쓰이는 CSS 토큰이 전부 정의돼 있나 */
const theme = read('theme.css');
const root = theme.slice(theme.indexOf(':root{'), theme.indexOf('\n}', theme.indexOf(':root{')));
const defined = new Set([...root.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const all = html + js + css;
const usedTokens = new Set([...all.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]));
fail('var(--토큰) 이 전부 정의돼 있다', [...usedTokens].filter((t) => !defined.has(t)).sort());
fail('아무도 안 쓰는 토큰이 없다', [...defined].filter((t) => !usedTokens.has(t)).sort());

/* 3 · CSS 에만 남은 class
   주석에 적힌 파일 이름(theme.css)이 class 로 잡히지 않게 먼저 걷어낸다.
   JS 가 이어 붙여 만드는 이름('el el-' + key)도 쓰이는 것으로 본다. */
const cssNoComment = css.replace(/\/\*[\s\S]*?\*\//g, ' ');
const cssClasses = new Set([...cssNoComment.matchAll(/\.([A-Za-z][\w-]*)/g)].map((m) => m[1]));
/* 'el el-' + key 처럼 공백을 품은 문자열도 있다 — 마지막 토막만 본다 */
const prefixes = [...js.matchAll(/['"]([^'"\n]*?-)['"]\s*\+/g)]
  .map((m) => m[1].trim().split(/\s+/).pop())
  .filter((p) => /^[\w-]+-$/.test(p));
/* 데이터가 정하는 이름 — bonds.json 의 kind 가 .edge.link / .edge.deep 이 된다 */
const DATA_DRIVEN = ['link', 'deep'];
const dead = [...cssClasses].filter((c) => {
  if (c.length < 3) return false;
  if (DATA_DRIVEN.includes(c)) return false;
  if (prefixes.some((p) => c.startsWith(p))) return false;
  const re = new RegExp('[\'"\\s]' + c.replace(/-/g, '\\-') + '[\'"\\s]');
  return !re.test(html) && !re.test(js);
}).sort();
fail('CSS 에만 남은 class 가 없다', dead);

/* 4 · 디자인 시스템 v1 이 금지한 것 */
const banned = [];
/* 네온 발광 — 강조색으로 번지는 그림자는 쓰지 않는다 */
for (const m of css.matchAll(/box-shadow\s*:[^;]*rgba\(\s*85\s*,\s*230\s*,\s*242/gi))
  banned.push('강조색 발광 box-shadow — 네온 발광 금지');
for (const m of css.matchAll(/0 0 \d+px (var\(--accent\)|#55[Ee]6[Ff]2)/g))
  banned.push('강조색 발광 box-shadow — 네온 발광 금지');
/* 사선은 두 곳에만 — 홈 챕터 면(.nowch)과 Primary 버튼(.btn.primary) */
for (const [block] of css.matchAll(/[^}]*\bclip-path\s*:\s*polygon[^}]*}/g)) {
  const head = block.split('{')[0];
  if (!/\.nowch|\.btn\.primary/.test(head)) banned.push('사선(clip-path polygon)이 ' + head.trim() + ' 에도 있다');
}
for (const m of css.matchAll(/skewX?\(/g)) banned.push('skew 는 더 쓰지 않는다 (사선은 두 곳의 clip-path 로만)');
/* 모든 요소에 테두리를 두르지 않는다 — 1px 구분선과 카드 흰 테두리만 남긴다 */
for (const [block] of css.matchAll(/[^{}]*\{[^}]*\}/g)) {
  const [head, body] = [block.split('{')[0], block.split('{')[1]];
  const m = body.match(/[^-]border\s*:\s*(\d(?:\.\d)?)px solid/);
  if (m && Number(m[1]) > 1 && !/\.tcg|\.mini|\[aria-busy/.test(head))
    banned.push('굵은 테두리 — ' + head.trim());
}
/* 이모지 금지 — 아이콘은 24px 라인 아이콘 한 세트로. ★ 는 등급 기호라 센다. */
for (const [ch] of html.matchAll(/[\u{1F300}-\u{1FAFF}\u{2700}-\u{27BF}]/gu))
  banned.push('마크업에 이모지 ' + ch);
fail('디자인 시스템 금지 사항 없음', banned);

console.log(bad ? '\n어긋남 ' + bad + '건' : '\n어긋남 0건');
process.exit(bad ? 1 : 0);
