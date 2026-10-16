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

/* 4 · 디자인 시스템이 금지한 것 */
const banned = [];
if (/font-style\s*:\s*italic/.test(css)) banned.push('css 에 font-style:italic (기울임은 skewX 로만)');
if (/border-radius\s*:\s*(?!0)/.test(css + html)) banned.push('border-radius 가 남아 있다 (모서리는 clip-path 로)');
for (const m of (js + html).matchAll(/var\(--gold\)/g)) banned.push('UI 에 var(--gold) — 노랑은 번개 속성 전용');
for (const m of css.matchAll(/var\(--gold\)/g)) banned.push('CSS 에 var(--gold) — 노랑은 번개 속성 전용');
fail('디자인 시스템 금지 사항 없음', banned);

console.log(bad ? '\n어긋남 ' + bad + '건' : '\n어긋남 0건');
process.exit(bad ? 1 : 0);
