/* 데미갓 아카데미 — 화면 조작
   인증(app-auth.js)과 떨어뜨려 두어, 파이어베이스 SDK 가 안 떠도 화면은 살아 있게 한다.
   저장은 아직 브라우저(localStorage)다. Firestore 를 붙이면 store 만 갈아 끼우면 된다. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var all = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  var fmt = function (n) { return Number(n || 0).toLocaleString('ko-KR'); };

  /* 게이트가 어디서 멈췄는지 화면이 직접 말하게 한다. 추측으로 고치지 않으려고. */
  function step(text) {
    var n = document.getElementById('gateStep');
    if (n) n.textContent = 'STEP ' + text;
    window.__step = text;
  }

  /* 게이트는 app.js 가 치운다. 인증 모듈(app-auth.js)은 gstatic 을 정적으로
     import 하므로 그쪽이 막히면 모듈 자체가 안 돌고, 거기에 게이트 제거를
     맡겨 두면 화면이 영원히 '입장 확인 중' 에 갇힌다. */
  function dropGate() {
    var g = document.getElementById('gate');
    if (g) g.remove();
  }

  var UI = window.DGA = { paintAvatar: null, player: { name: '나', profile: null, fam: '' },
                          onReady: null, step: step };

  /* ── 저장소 ──────────────────────────────────── */
  var uid = 'local';
  var S = null;
  function key() { return 'demigod.save.' + uid; }
  function fresh() {
    return {
      ichor: 1240, ether: 300, pity: 0,
      owned: {},            /* cardId -> { n: 장수, lv, star } */
      deck: [],             /* cardId 목록 */
      bondLv: {},           /* cardId -> 0~5 */
      seenBonds: [],        /* "a|b" */
      slots: [null, null, null],   /* { kind, id, until, visited, hours } */
      cleared: {},          /* chapter -> '완막'|'신막'|'실패' */
      clues: 0, day: 1,
      feed: [],
      talkDone: [],
      capUsed: 0, capDay: ''
    };
  }
  function load() {
    try { var raw = localStorage.getItem(key()); if (raw) return JSON.parse(raw); } catch (_) {}
    return null;
  }
  function save() {
    if (typeof UI.put === 'function') { UI.put(S); return; }   /* store.js 가 붙으면 그쪽으로 */
    try { localStorage.setItem(key(), JSON.stringify(S)); } catch (_) {}
  }

  /* ── 데이터 ──────────────────────────────────── */
  var D = {};
  function loadData() {
    var files = ['cards', 'bonds', 'season-01', 'zones', 'schedule', 'economy', 'quiz', 'minigames', 'talks', 'elements', 'flavor'];
    return Promise.all(files.map(function (f) {
      return fetch('data/' + f + '.json').then(function (r) {
        if (!r.ok) throw new Error(f + ' ' + r.status);
        return r.json();
      });
    })).then(function (got) {
      files.forEach(function (f, i) { D[f.replace('-01', '')] = got[i]; });
      D.cardById = {};
      D.cards.cards.forEach(function (c) { D.cardById[c.id] = c; });
      buildNumbers();
    });
  }

  /* ── 오원소 ──────────────────────────────────── */
  var EL_PATH = {
    /* 불 — 끝이 뾰족한 불꽃. 물방울과 안 헷갈리게 위를 꺾었다 */
    fire:  '<path d="M12 2c0 4-4 5-4 9a4 4 0 0 0 8 0c0-2-1-3-2-4 1 4-2 4-2 2 0-3 2-4 0-7Z"/>',
    /* 물 — 둥근 물방울 */
    water: '<path d="M12 3c3.4 4.2 5 6.6 5 9a5 5 0 0 1-10 0c0-2.4 1.6-4.8 5-9Z"/>',
    /* 땅 — 산 */
    earth: '<path d="M2 20h20"/><path d="m4 20 6-11 4 7 2.5-4L22 20"/>',
    /* 바람 — 소용돌이 */
    wind:  '<path d="M4 8h9a3 3 0 1 0-3-3"/><path d="M4 13h13a3 3 0 1 1-3 3"/><path d="M4 18h6"/>',
    /* 번개 */
    bolt:  '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
    /* 무속성 — 비어 있는 고리 */
    none:  '<circle cx="12" cy="12" r="6.5"/>'
  };
  function elIcon(key, px) {
    var ns = 'http://www.w3.org/2000/svg';
    var sv = document.createElementNS(ns, 'svg');
    sv.setAttribute('width', String(px || 12)); sv.setAttribute('height', String(px || 12));
    sv.setAttribute('viewBox', '0 0 24 24'); sv.setAttribute('fill', 'none');
    sv.setAttribute('stroke', 'currentColor'); sv.setAttribute('stroke-width', '1.8');
    sv.setAttribute('stroke-linecap', 'round'); sv.setAttribute('stroke-linejoin', 'round');
    sv.setAttribute('aria-hidden', 'true');
    sv.innerHTML = EL_PATH[key] || EL_PATH.none;
    return sv;
  }
  /* 자물쇠 — 미보유 카드에만 쓴다 */
  function lockIcon(px) {
    var ns = 'http://www.w3.org/2000/svg';
    var sv = document.createElementNS(ns, 'svg');
    sv.setAttribute('width', String(px || 14)); sv.setAttribute('height', String(px || 14));
    sv.setAttribute('viewBox', '0 0 24 24'); sv.setAttribute('fill', 'none');
    sv.setAttribute('stroke', 'currentColor'); sv.setAttribute('stroke-width', '1.8');
    sv.setAttribute('stroke-linecap', 'round'); sv.setAttribute('stroke-linejoin', 'round');
    sv.setAttribute('aria-hidden', 'true');
    sv.innerHTML = '<rect x="4" y="10.5" width="16" height="11"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>';
    return sv;
  }

  function elKo(key) {
    if (!D.elements) return '';
    if (!key) return (D.elements.none && D.elements.none.ko) || '무속성';
    var e = D.elements.list[key];
    return e ? e.ko : '';
  }
  /* 상성 계산과 난수는 battle.js 가 쥐고 있다 — 여기 있던 두 벌은
     아무도 안 부르는 복사본이었다. */

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function stat(c) {
    var o = S.owned[c.id] || { lv: 1, star: c.grade || 1 };
    var lv = o.lv || 1, st = o.star || c.grade || 1;
    return { atk: (c.atk || 1) + (lv - 1) + (st - 1) * 2, hp: (c.hp || 1) + (lv - 1) + (st - 1) };
  }
  /* ── 화면 이동 ───────────────────────────────── */
  var TITLES = { home: '홈', cards: '계보', daily: '일상', shop: '상점', bonds: '인연' };
  /* 재화는 쓰는 화면에서만 보여 준다 — 홈과 상점 */
  var WALLET_ON = { home: 1, shop: 1 };
  var SEGS = {
    cards: ['dex', 'deck', 'grow', 'melt', 'bondmap'],
    daily: ['time', 'hunt'],
    shop: ['summon', 'goods']
  };
  var VIEWS = ['carddet', 'chron', 'scout', 'quiz', 'talk', 'reveal', 'battle', 'result'];
  var curTab = 'home';

  function setTab(name) {
    if (!TITLES[name]) return;
    curTab = name;
    /* 홈은 제목 자리에 플레이어를 세운다 — 배경 그라데이션도 홈에만 */
    $('#stage').setAttribute('data-tab', name);
    $('#screenTitle').textContent = TITLES[name];
    $('#screenTitle').hidden = name === 'home';
    $('#hdMe').hidden = name !== 'home';
    $('#wallets').hidden = !WALLET_ON[name];
    Object.keys(TITLES).forEach(function (k) { $('#tab-' + k).hidden = k !== name; });
    all('[data-tab]').forEach(function (b) {
      b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === name));
    });
    window.scrollTo(0, 0);
  }
  function setSeg(tab, name) {
    (SEGS[tab] || []).forEach(function (k) { var n = $('#seg-' + k); if (n) n.hidden = k !== name; });
    all('#tab-' + tab + ' [data-seg]').forEach(function (b) {
      b.setAttribute('aria-selected', String(b.getAttribute('data-seg') === name));
    });
  }
  function setView(which) {
    $('#stage').hidden = !!which;
    VIEWS.forEach(function (v) { $('#' + v).hidden = v !== which; });
    document.body.classList.toggle('fullscreen-on', !!which);
    window.scrollTo(0, 0);
  }
  UI.setTab = setTab;

  /* ── 지갑 ────────────────────────────────────── */
  function paintWallet() {
    $('#walletIchor').textContent = fmt(S.ichor);
    $('#walletEther').textContent = fmt(S.ether);
  }
  function spend(cur, n) {
    if (S[cur] < n) return false;
    S[cur] -= n; paintWallet(); save(); return true;
  }
  function gain(cur, n) { S[cur] += n; paintWallet(); save(); }

  /* ── 아바타 ──────────────────────────────────── */
  function avatar(node, profile, px) {
    if (node && typeof UI.paintAvatar === 'function') UI.paintAvatar(node, profile, px);
  }

  /* ── 카드 조각 ───────────────────────────────── */
  /* ── 카드 ══════════════════════════════════════════════
     실물 TCG 와 같은 63:88. 구조는 위에서 아래로
       바깥 프레임(흰 바탕·검은 외곽선) → 안쪽 패널 →
       머리 줄(비용·이름·속성) → 일러스트(10:7) → 타입 띠 →
       능력 박스(종이 바탕) → 아래 줄(ATK·HP·번호)
     작은 카드는 능력 한 줄만, 큰 카드는 전문과 설정 문구까지. */
  var EL_KO  = { bolt: '번개', water: '물', fire: '불', earth: '땅', wind: '바람' };
  var LINEAGE = { ZEUS: '제우스', HERA: '헤라', POSEIDON: '포세이돈', DEMETER: '데메테르',
                  ATHENA: '아테나', APOLLO: '아폴론', ARTEMIS: '아르테미스', ARES: '아레스',
                  APHRODITE: '아프로디테', HEPHAISTOS: '헤파이스토스', HERMES: '헤르메스',
                  DIONYSOS: '디오니소스' };
  var FAM_LETTER = { COMMON: 'C', ZEUS: 'Z', HERA: 'H', POSEIDON: 'P', DEMETER: 'D',
                     ATHENA: 'A', APOLLO: 'L', ARTEMIS: 'R', ARES: 'E', APHRODITE: 'F',
                     HEPHAISTOS: 'V', HERMES: 'M', DIONYSOS: 'Y' };
  var cardNo = {};                      /* id → 'Z-001' */
  function buildNumbers() {
    var seen = {};
    D.cards.cards.forEach(function (c) {
      var L = FAM_LETTER[c.family] || 'X';
      seen[L] = (seen[L] || 0) + 1;
      cardNo[c.id] = L + '-' + String(seen[L]).padStart(3, '0');
    });
  }

  /* 우리 데이터를 디자인 시스템이 바라는 모양으로 옮긴다 */
  function cardView(c) {
    var o = S.owned[c.id], st = stat(c);
    var et = window.DGABattle && DGABattle.effectText ? DGABattle.effectText(c.effect) : null;
    return {
      id: cardNo[c.id] || c.id,
      name: c.name,
      type: c.family === 'COMMON' ? '공통' : '계보',
      element: EL_KO[c.element] || null,
      elKey: c.element || 'none',
      lineage: c.family === 'COMMON' ? '' : (LINEAGE[c.family] || c.family) + '의 혈통',
      rarity: o ? (o.star || c.grade) : c.grade,
      cost: c.cost, atk: c.atk == null ? null : st.atk, hp: c.hp == null ? null : st.hp,
      abilities: et ? [{ name: et.name, trigger: et.trigger, text: et.long, short: et.short }] : [],
      flavor: (D.flavor && D.flavor[c.id]) || '',
      owned: o ? o.n : 0,
      lv: o ? o.lv : 1,
      raw: c
    };
  }

  function elIconBox(key, size) {
    var b = el('span', 'tcg-el el-' + key);
    b.appendChild(elIcon(key === 'none' ? null : key, size || 11));
    return b;
  }

  /* 요약 카드는 그림·이름·등급만 보여 준다. 능력과 수치는 상세에서.
     미보유는 테두리 없는 면에 자물쇠와 이름만 둔다. */
  function cardEl(c, opts) {
    opts = opts || {};
    var v = cardView(c);
    var big = !!opts.big;
    var have = v.owned > 0 || opts.always;
    var n = el('article', 'tcg' + (big ? ' big' : '') + (have ? '' : ' locked'));
    n.setAttribute('data-el', v.elKey);
    n.setAttribute('data-grade', String(v.rarity));   /* 프레임 색은 등급이 정한다 */

    function stars() {
      var rk = el('span', 'tcg-stars'); rk.setAttribute('aria-label', '등급 ' + v.rarity);
      for (var i = 0; i < v.rarity; i++) rk.appendChild(document.createTextNode('★'));
      return rk;
    }

    if (!have) {
      var lk = el('span', 'tcg-lock');
      lk.appendChild(lockIcon(20));
      lk.append(el('span', 'nm', v.name), el('span', 'no', '미보유'));
      n.appendChild(lk);
      return wireCard(n, c, v, opts);
    }

    var inner = el('span', 'tcg-in');

    if (big) {
      var hd = el('span', 'tcg-hd');
      hd.appendChild(el('span', 'tcg-cost', v.cost == null ? '?' : String(v.cost)));
      hd.appendChild(el('span', 'tcg-name', v.name));
      if (v.element) hd.appendChild(elIconBox(v.elKey, 24));
      inner.appendChild(hd);
    }

    var art = el('span', 'tcg-art');
    if (window.DGAArt) DGAArt.paint(art, c);
    inner.appendChild(art);

    if (big) {
      var tp = el('span', 'tcg-type');
      tp.appendChild(el('span', 't', [v.type + ' 카드', v.element, v.lineage].filter(Boolean).join(' · ')));
      tp.appendChild(stars());
      inner.appendChild(tp);

      /* 능력이 없으면 없다고 쓰지 않는다 — 빈 칸이 그 자체로 답이다 */
      var ab = el('span', 'tcg-abil');
      v.abilities.forEach(function (a) {
        var h = el('span', 'ab-h');
        h.append(el('b', '', a.name), el('i', '', a.trigger));
        ab.append(h, el('p', 'ab-t', a.text));
      });
      if (v.flavor) ab.appendChild(el('span', 'tcg-flavor', v.flavor));
      inner.appendChild(ab);

      var sv = el('span', 'tcg-stats');
      [['ATK', v.atk], ['HP', v.hp]].forEach(function (p) {
        var box = el('span', 'tcg-stat');
        box.append(el('i', '', p[0]), el('b', '', p[1] == null ? '–' : String(p[1])));
        sv.appendChild(box);
      });
      sv.appendChild(el('span', 'tcg-no', v.id));
      inner.appendChild(sv);
    } else {
      /* 이름판은 두 줄 — 한 줄에 몰면 3열 격자에서 이름이 '올…' 로 잘린다 */
      var ft = el('span', 'tcg-ft');
      var meta = el('span', 'tcg-meta');
      if (v.element) meta.appendChild(elIconBox(v.elKey, 14));
      meta.appendChild(stars());
      ft.append(el('span', 'tcg-name', v.name), meta);
      inner.appendChild(ft);
    }

    n.appendChild(inner);
    return wireCard(n, c, v, opts);
  }

  function wireCard(n, c, v, opts) {
    if (!opts.detail) return n;
    n.classList.add('tappable');
    n.setAttribute('role', 'button');
    n.setAttribute('tabindex', '0');
    n.setAttribute('aria-label', v.name + ' 자세히 보기');
    var go = function () { openCard(c); };
    n.addEventListener('click', go);
    n.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
    return n;
  }

  /* 카드 상세 — 한 장을 300px 로 펼친다. 작은 카드에서 줄인 것(능력 전문과
     설정 문구)을 여기서 돌려준다. 스펙의 접근성 조항이 말하는 보완이다. */
  var BEATS = { bolt: 'water', water: 'fire', fire: 'earth', earth: 'wind', wind: 'bolt' };
  var detCard = null;
  function openCard(c) {
    detCard = c;
    var v = cardView(c);
    var box = $('#detCard'); box.textContent = '';
    /* 도감은 아직 없는 카드도 펼쳐 보여 준다 — 못 가졌다는 말은 아래 '보유' 칸이 한다 */
    box.appendChild(cardEl(c, { big: true, always: true }));
    box.setAttribute('data-el', v.elKey);
    $('#detNo').textContent = v.id;

    $('#detOwn').textContent = v.owned ? v.owned + '장' : '미보유';
    var strongOf = BEATS[c.element], weakOf = null;
    Object.keys(BEATS).forEach(function (k) { if (BEATS[k] === c.element) weakOf = k; });
    $('#detStrong').textContent = c.element ? (EL_KO[strongOf] || '—') : '없음';
    $('#detWeak').textContent   = c.element ? (EL_KO[weakOf] || '—')   : '없음';

    var inDeck = S.deck.indexOf(c.id) >= 0;
    var add = $('#detDeck');
    add.disabled = !v.owned;
    add.textContent = inDeck ? '덱에서 빼기' : '덱에 추가';
    $('#detGrow').disabled = !v.owned;
    $('#detMsg').textContent = '';
    setView('carddet');
  }
  function detDeckToggle() {
    if (!detCard) return;
    var i = S.deck.indexOf(detCard.id);
    if (i >= 0) { S.deck.splice(i, 1); $('#detMsg').textContent = '덱에서 뺐다.'; }
    else if (S.deck.length >= 30) { $('#detMsg').textContent = '덱은 30장까지다.'; return; }
    else { S.deck.push(detCard.id); $('#detMsg').textContent = '덱에 넣었다. (' + S.deck.length + ' / 30)'; }
    save();
    var inDeck = S.deck.indexOf(detCard.id) >= 0;
    $('#detDeck').textContent = inDeck ? '덱에서 빼기' : '덱에 추가';
    paintDex(); paintDeck();
  }

  /* ── 홈 ──────────────────────────────────────── */
  function curChapter() {
    var n = 1;
    for (var i = 1; i <= 12; i++) { if (S.cleared[i]) n = i + 1; }
    return D.season.chapters[Math.min(n, 12) - 1];
  }
  function paintHome() {
    var me = UI.player;
    avatar($('#hdAva'), me.profile, 80);
    $('#hdName').textContent = me.name || '나';
    $('#hdFam').textContent = (LINEAGE[String(me.fam).toUpperCase()] || me.fam || '') + (me.fam ? '의 혈통' : '혈통 미정');

    var ch = curChapter();
    $('#chEyebrow').textContent = 'CHAPTER ' + String(ch.n).padStart(2, '0') + ' · ' + LINEAGE[String(ch.god).toUpperCase()];
    /* 제목은 낱말마다 한 줄씩 — 낱말 중간에서 끊기지 않는다 */
    var t = $('#chTitle'); t.textContent = '';
    String(ch.title).split(/\s+/).forEach(function (w) { t.appendChild(el('span', 'ln', w)); });
    $('#chBoss').textContent = ch.boss.name + ' — ' + ch.boss.weaknessNote;

    /* 오른쪽에 그 장을 맡은 신의 대표 카드 한 장 */
    var pic = D.cards.cards.filter(function (c) {
      return c.family === String(ch.god).toUpperCase();
    }).sort(function (a, b) { return b.grade - a.grade; })[0];
    var box = $('#chCard'); box.textContent = '';
    if (pic) box.appendChild(cardEl(pic, { always: true }));

    /* 지금 할 일 */
    var PH = [['조사', '단서를 모은다'], ['대비', '쪽지시험을 치고 장비를 맞춘다'], ['결전', ch.boss.name + '과 맞선다']];
    var day = Math.min(3, Math.max(1, S.day));
    $('#chDay').textContent = 'DAY ' + day + ' / 3';
    $('#missionLine').textContent = PH[day - 1][1] + '.';
    var pct = ch.clues ? Math.min(100, Math.round(S.clues / ch.clues * 100)) : 0;
    $('#clueBar').style.width = pct + '%';
    $('#clueNum').textContent = S.clues + ' / ' + ch.clues;
    var ph = $('#phases'); ph.textContent = '';
    PH.forEach(function (p, i) {
      if (i) ph.appendChild(el('span', 'sep', ' · '));
      ph.appendChild(el('span', 'phase' + (i + 1 === day ? ' on' : ''), p[0]));
    });

    paintShortcuts();
    paintFeed();
  }

  /* 바로가기 — 전부 실제 상태에서 읽는다 */
  function paintShortcuts() {
    var used = S.slots.filter(Boolean).length;
    $('#scTime').textContent = used + ' / 3';

    var un = unreadTotal();
    var talk = $('#scTalk'); talk.textContent = '';
    talk.className = 'st' + (un ? ' alert' : '');
    if (un) { talk.appendChild(el('span', 'dot')); talk.appendChild(document.createTextNode('안 읽음 ' + un)); }
    else talk.textContent = '새 쪽지 없음';

    $('#scBoard').textContent = S.feed.length ? '글 ' + S.feed.length : '새 글 없음';
  }

  function paintFeed() {
    var f = $('#feed'); f.textContent = '';
    if (!S.feed.length) {
      var e = el('li'); e.appendChild(el('div', 'rule-note', '아직 아무도 아무 말도 남기지 않았다.'));
      f.appendChild(e); return;
    }
    S.feed.slice().reverse().forEach(function (p) {
      var li = el('li', 'post');
      var hd = el('div', 'post-hd');
      var av = el('span', 'ava m'); av.setAttribute('aria-hidden', 'true');
      avatar(av, UI.player.profile, 56);
      var who = el('span', 'who');
      who.append(el('span', 'nm', p.by), el('span', 'mt', p.fam));
      hd.append(av, who, el('span', 'tm', p.at));
      li.append(hd, el('p', 'say', p.text));
      f.appendChild(li);
    });
  }

  /* ── 카드 탭 ─────────────────────────────────── */
  var dexFam = '전체';
  function famKo(fam) {
    if (fam === '전체') return '전체';
    if (fam === 'COMMON') return '공통';
    return LINEAGE[fam] || fam;
  }
  function paintDex() {
    var fs = $('#dexFilters');
    if (!fs.children.length) {
      ['전체'].concat(D.cards.families).forEach(function (fam) {
        var b = el('button', 'filter', famKo(fam));
        b.type = 'button';
        b.setAttribute('data-fam', fam);
        b.setAttribute('aria-pressed', String(fam === dexFam));
        b.addEventListener('click', function () { dexFam = fam; paintDex(); });
        fs.appendChild(b);
      });
    } else {
      all('.filter', fs).forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-fam') === dexFam));
      });
    }
    paintRing();
    var list = D.cards.cards.filter(function (c) { return dexFam === '전체' || c.family === dexFam; });
    var g = $('#dexGrid'); g.textContent = '';
    list.forEach(function (c) { g.appendChild(cardEl(c, { detail: true })); });
    var have = D.cards.cards.filter(function (c) { return S.owned[c.id]; }).length;
    $('#dexCount').textContent = have + ' / ' + D.cards.cards.length;
    $('#dexBar').style.width = Math.round(have / D.cards.cards.length * 100) + '%';
  }

  /* 상극 고리 — 번개 → 물 → 불 → 땅 → 바람 → 번개 */
  function paintRing() {
    var box = $('#elRing');
    if (!box || box.children.length || !D.elements) return;
    D.elements.cycle.forEach(function (k, i) {
      var e = D.elements.list[k];
      var it = el('span', 'ring-it');
      var ic = el('span', 'ring-ic el-' + k);
      ic.appendChild(elIcon(k, 18));
      it.append(ic, el('span', 'ring-n', e.ko));
      it.title = e.why;
      box.appendChild(it);
      if (i === D.elements.cycle.length - 1) return;
      var ar = el('span', 'ring-ar');
      ar.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg>';
      box.appendChild(ar);
    });
  }

  function paintDeck() {
    var l = $('#deckList'); l.textContent = '';
    if (!S.deck.length) {
      var e = el('li'); e.appendChild(el('div', 'empty', '덱이 비어 있다. 도감에서 카드를 넣어 보자.'));
      l.appendChild(e);
    }
    var sum = 0, cnt = 0;
    S.deck.forEach(function (id) {
      var c = D.cardById[id]; if (!c) return;
      if (c.cost != null) { sum += c.cost; cnt++; }
      var li = el('li', 'deckrow');
      li.appendChild(el('span', 'cost', c.cost == null ? '?' : String(c.cost)));
      li.appendChild(el('span', 'nm', c.name));
      li.appendChild(el('span', 'fm', c.family));
      var rm = el('button', 'rm');
      rm.type = 'button';
      rm.setAttribute('aria-label', c.name + ' 덱에서 빼기');
      rm.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 12h12"/></svg>';
      rm.addEventListener('click', function () {
        S.deck.splice(S.deck.indexOf(id), 1); save(); paintDeck();
      });
      li.appendChild(rm);
      l.appendChild(li);
    });
    $('#deckCount').textContent = S.deck.length + ' / 30';
    $('#deckAvg').textContent = cnt ? '평균 코스트 ' + (sum / cnt).toFixed(1) : '평균 코스트 —';

    var b = $('#deckBonds'); b.textContent = '';
    var hits = D.bonds.bonds.filter(function (bd) {
      return S.deck.indexOf(bd.a) >= 0 && S.deck.indexOf(bd.b) >= 0;
    });
    if (!hits.length) {
      var li2 = el('li'); li2.appendChild(el('div', 'empty', '이 덱에서 드러난 관계가 없다.'));
      b.appendChild(li2); return;
    }
    hits.forEach(function (bd) {
      var seen = S.seenBonds.indexOf(bd.a + '|' + bd.b) >= 0;
      var ef = D.bonds.effects[bd.kind];
      var li3 = el('li', 'row-it' + (bd.kind === 'clash' ? ' pinky' : ''));
      var mark = el('span', 'mark');
      mark.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 12h10"/><circle cx="5" cy="12" r="2.4"/><circle cx="19" cy="12" r="2.4"/></svg>';
      var txt = el('span', 'txt');
      txt.appendChild(el('span', 'nm', seen
        ? (D.cardById[bd.a].short + ' · ' + D.cardById[bd.b].short)
        : '??? · ???'));
      txt.appendChild(el('span', 'sub', seen
        ? (ef.note + ' — ATK ' + (ef.atk >= 0 ? '+' : '') + ef.atk + ' / HP ' + (ef.hp >= 0 ? '+' : '') + ef.hp)
        : '호감도 ' + bd.reveal + '단계에서 드러난다'));
      li3.append(mark, txt);
      b.appendChild(li3);
    });
  }

  function paintGrow() {
    var w = $('#growWrap'); w.textContent = '';
    var ownedIds = Object.keys(S.owned);
    if (!ownedIds.length) { w.appendChild(el('div', 'empty', '가진 카드가 없다. 먼저 뽑아 보자.')); return; }
    var id = S.growPick && S.owned[S.growPick] ? S.growPick : ownedIds[0];
    S.growPick = id;
    var c = D.cardById[id], o = S.owned[id], s = stat(c);
    w.appendChild(cardEl(c, { always: true }));

    var m = el('div', 'meter');
    var row = el('div', 'lvrow');
    var lv = el('span', 'lv'); lv.append(el('span', 'k', 'LV'), el('span', 'v', String(o.lv)));
    var nx = el('span', 'lv next'); nx.append(el('span', 'k', 'NEXT'), el('span', 'v', String(o.lv + 1)));
    var ar = el('span', 'arrow');
    ar.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13"/><path d="m13 7 5 5-5 5"/></svg>';
    row.append(lv, ar, nx, el('span', 'spacer'), el('span', 'chip gold', '★ ' + o.star + ' / 3 · ' + (o.n || 1) + '장 보유'));
    m.appendChild(row);

    var cost = 60 + (o.lv - 1) * 40;
    var d = el('div', 'deltas');
    [['ATK', s.atk, s.atk + 1], ['HP', s.hp, s.hp + 1]].forEach(function (p) {
      var r = el('span', 'delta');
      r.append(el('span', 'k', p[0]), el('span', 'a', String(p[1])), el('span', 'b', '→ ' + p[2]));
      d.appendChild(r);
    });
    m.appendChild(d);

    var picker = el('div', 'filters');
    ownedIds.forEach(function (oid) {
      var b = el('button', 'filter', D.cardById[oid].short || oid);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(oid === id));
      b.addEventListener('click', function () { S.growPick = oid; paintGrow(); });
      picker.appendChild(b);
    });
    m.appendChild(picker);

    var foot = el('div', 'fusefoot');
    var price = el('span', 'price');
    price.append(el('span', 'k', 'AITHER'), el('span', 'v', fmt(cost)));
    var go = el('button', 'btn', '강화하기'); go.type = 'button';
    var msg = el('p', 'msg'); msg.classList.add('ok');
    go.addEventListener('click', function () {
      if (!spend('ether', cost)) { msg.style.color = 'var(--alert)'; msg.textContent = '에테르가 모자란다. ' + fmt(cost) + ' 필요.'; return; }
      o.lv += 1; save(); paintGrow();
    });
    foot.append(price, el('span', 'spacer'), go);
    m.append(foot, msg);
    w.appendChild(m);
  }

  var meltSel = [];
  function paintMelt() {
    var g = $('#meltGrid'); g.textContent = '';
    var dups = Object.keys(S.owned).filter(function (id) { return S.owned[id].n > 1; });
    if (!dups.length) { g.appendChild(el('div', 'empty', '중복된 카드가 없다.')); }
    dups.forEach(function (id) {
      var c = D.cardById[id];
      var n = cardEl(c, { always: true });
      n.classList.toggle('sel', meltSel.indexOf(id) >= 0);
      n.addEventListener('click', function () {
        var i = meltSel.indexOf(id);
        if (i >= 0) meltSel.splice(i, 1); else meltSel.push(id);
        paintMelt();
      });
      g.appendChild(n);
    });
    var sum = meltSel.reduce(function (t, id) {
      return t + (D.economy.offering[String(D.cardById[id].grade)] || 20);
    }, 0);
    $('#meltSum').textContent = fmt(sum);
    $('#meltNote').textContent = meltSel.length
      ? meltSel.length + '장을 녹인다. 같은 카드 셋이면 별이 오른다.'
      : '녹일 카드를 고르세요.';
  }

  function paintBondMap() {
    var box = $('#bondMap'); box.textContent = '';
    var ids = Object.keys(S.owned);
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 360 300');
    if (!ids.length) {
      box.appendChild(el('div', 'empty', '가진 카드가 없어 관계도가 비어 있다.'));
      return;
    }
    var pos = {};
    ids.forEach(function (id, i) {
      var ang = (i / ids.length) * Math.PI * 2 - Math.PI / 2;
      pos[id] = { x: 180 + Math.cos(ang) * 112, y: 142 + Math.sin(ang) * 94 };
    });
    D.bonds.bonds.forEach(function (bd) {
      if (!pos[bd.a] || !pos[bd.b]) return;
      var seen = S.seenBonds.indexOf(bd.a + '|' + bd.b) >= 0;
      var line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', pos[bd.a].x); line.setAttribute('y1', pos[bd.a].y);
      line.setAttribute('x2', pos[bd.b].x); line.setAttribute('y2', pos[bd.b].y);
      line.setAttribute('class', 'edge ' + (seen ? bd.kind : ''));
      if (!seen) line.setAttribute('stroke', '#263253');
      svg.appendChild(line);
    });
    ids.forEach(function (id) {
      var c = D.cardById[id];
      var g = document.createElementNS(ns, 'g');
      g.setAttribute('class', 'node ' + (c.tone === 'pink' ? 'pink' : 'lime'));
      var ci = document.createElementNS(ns, 'rect');
      ci.setAttribute('x', pos[id].x - 19); ci.setAttribute('y', pos[id].y - 19);
      ci.setAttribute('width', '38'); ci.setAttribute('height', '38');
      ci.setAttribute('rx', '8');
      var tx = document.createElementNS(ns, 'text');
      tx.setAttribute('x', pos[id].x); tx.setAttribute('y', pos[id].y + 40);
      tx.textContent = c.short || c.name;
      g.append(ci, tx);
      svg.appendChild(g);
    });
    box.appendChild(svg);
  }

  /* ── 일상 ────────────────────────────────────── */
  function today() { return new Date().toISOString().slice(0, 10); }
  function capLeft() {
    if (S.capDay !== today()) { S.capDay = today(); S.capUsed = 0; }
    return Math.max(0, D.economy.daily.etherCap - S.capUsed);
  }
  function earnEther(n) {
    var room = capLeft();
    var got = Math.min(n, room);
    S.capUsed += got; gain('ether', got);
    return got;
  }

  function paintSlots() {
    $('#capLeft').textContent = '에테르 ' + fmt(capLeft()) + ' 남음';
    var box = $('#slots'); box.textContent = '';
    S.slots.forEach(function (sl, i) {
      var b = el('button', 'slot-card'); b.type = 'button';
      if (!sl) {
        /* 빈 칸 — 테두리 대신 면의 명도만 낮춘다 */
        b.className = 'slot-card empty-slot';
        b.setAttribute('aria-label', (i + 1) + '번 칸 — 카드 보내기');
        b.append(el('span', 'plus', '+'), el('span', 'cta', '카드 보내기'),
                 el('span', 'k', (i + 1) + '번 칸'));
        b.addEventListener('click', function () { openSlotDlg(i); });
      } else {
        var left = Math.max(0, sl.until - Date.now());
        var done = left <= 0;
        b.className = 'slot-card ' + (done ? 'ready' : 'busy');
        var def = (sl.kind === 'class' ? D.schedule.classes : D.schedule.jobs)
          .filter(function (x) { return x.id === sl.id; })[0] || { name: sl.id };
        b.append(el('span', 'k', (sl.kind === 'class' ? '수업' : '알바') + ' · ' + sl.hours + '시간'),
                 el('span', 'nm', def.name),
                 el('span', 'left', done ? '완료' : Math.ceil(left / 60000) + '분'));
        if (done) {
          b.appendChild(el('span', 'call', sl.kind === 'class' ? '쪽지시험 보기' : '미니게임 하기'));
          b.addEventListener('click', function () { finishSlot(i); });
        } else {
          b.appendChild(el('span', 'call', sl.visited ? '들렀음' : '들르기'));
          b.addEventListener('click', function () {
            sl.visited = true; save(); paintSlots();
          });
        }
      }
      box.appendChild(b);
    });
    /* 빈 칸이 전부면 가로로 셋을 늘어놓는다 */
    box.classList.toggle('row', S.slots.every(function (x) { return !x; }));
  }

  function openSlotDlg(i) {
    var p = $('#slotPick'); p.textContent = '';
    D.schedule.classes.concat(D.schedule.jobs).forEach(function (def) {
      var isClass = !!def.quizCategory;
      D.schedule.slots.forEach(function (h) {
        if (h !== 2) return;   /* 틀만 — 지금은 2시간만 */
        var b = el('button', 'btn ghost', (isClass ? '수업 · ' : '알바 · ') + def.name);
        b.type = 'button'; b.style.width = '100%';
        b.addEventListener('click', function () {
          S.slots[i] = { kind: isClass ? 'class' : 'job', id: def.id, hours: h,
                         until: Date.now() + h * 60 * 1000, visited: false };  /* 데모: 1시간=1분 */
          save(); $('#slotDlg').close(); paintSlots();
        });
        p.appendChild(b);
      });
    });
    var c = el('button', 'btn ghost', '닫기'); c.type = 'button'; c.style.width = '100%';
    c.addEventListener('click', function () { $('#slotDlg').close(); });
    p.appendChild(c);
    var dlg = $('#slotDlg');
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function finishSlot(i) {
    var sl = S.slots[i];
    if (sl.kind === 'class') { openQuiz(i); return; }
    var won = Math.random() < 0.5;
    var base = 160 * sl.hours;
    var got = Math.round(base * (sl.visited ? 1 : D.economy.skipPenalty) * (won ? 1.3 : 1));
    gain('ichor', got);
    S.slots[i] = null; save(); paintSlots();
    alert('알바 종료 — 이코르 +' + fmt(got) + (won ? ' (미니게임 성공)' : ''));
  }

  var quizSlot = null, quizItem = null;
  function openQuiz(i) {
    quizSlot = i;
    var sl = S.slots[i];
    var def = D.schedule.classes.filter(function (c) { return c.id === sl.id; })[0];
    var pool = D.quiz.puzzles.filter(function (q) {
      return !def || def.quizCategory.indexOf(q.category) >= 0;
    });
    if (!pool.length) pool = D.quiz.puzzles;
    quizItem = pool[Math.floor(Math.random() * pool.length)];
    $('#quizTitle').textContent = quizItem.title;
    $('#quizCat').textContent = (def ? def.name + ' · ' : '') + quizItem.category;
    var b = $('#quizBody'); b.textContent = '';
    var box = el('div', 'bub gm');
    var av = el('span', 'ava s tone-pink');
    av.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14061F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>';
    var t = el('span', 'txt');
    t.append(el('span', 'nm', '쪽지시험'), el('p', 'ln', quizItem.question));
    box.append(av, t);
    b.appendChild(box);
    $('#quizInput').value = '';
    setView('quiz');
    $('#quizInput').focus();
  }
  function submitQuiz() {
    if (!quizItem) return;
    var v = $('#quizInput').value.trim();
    var ok = v && v.toUpperCase().replace(/\s/g, '') === String(quizItem.answer).toUpperCase().replace(/\s/g, '');
    var b = $('#quizBody');
    var r = el('div', 'roll' + (ok ? '' : ' fail'));
    r.append(el('span', 'd', '쪽지시험'), el('span', 'v', ok ? '정답' : '오답'),
             el('span', 'j', ok ? '보상 전액' : '보상 절반'));
    b.appendChild(r);
    if (quizItem.solution) {
      var s = el('div', 'bub gm');
      var av = el('span', 'ava s tone-pink');
      var t = el('span', 'txt');
      t.append(el('span', 'nm', '풀이'), el('p', 'ln', quizItem.solution));
      s.append(av, t); b.appendChild(s);
    }
    var sl = S.slots[quizSlot];
    var base = 180 * (sl ? sl.hours : 2);
    var got = earnEther(Math.round(base * (ok ? 1 : 0.5) * (sl && sl.visited ? 1 : D.economy.skipPenalty)));
    var g = el('div', 'sysline', '에테르 +' + fmt(got) + (got === 0 ? ' (오늘 한도를 채웠다)' : ''));
    b.appendChild(g);
    if (quizSlot != null) { S.slots[quizSlot] = null; }
    quizItem = null; save(); paintSlots();
    var back = el('button', 'btn', '돌아가기'); back.type = 'button';
    back.style.cssText = 'align-self:center;margin-top:8px';
    back.addEventListener('click', function () { setView(null); });
    b.appendChild(back);
  }

  function paintHunt() {
    var l = $('#huntList'); l.textContent = '';
    var open = 0;
    D.zones.zones.forEach(function (z) {
      var res = S.cleared[z.chapter];
      var state = !res ? 'locked' : (res === '실패' ? 'tainted' : 'open');
      if (state !== 'locked') open++;
      var li = el('li');
      var b = el('button', 'row-it' + (state === 'tainted' ? ' pinky' : '')); b.type = 'button';
      if (state === 'locked') b.disabled = true;
      var mark = el('span', 'mark');
      mark.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V5l6 2 6-2 4 1.5V17l-4 2-6-2-6 3Z"/></svg>';
      var txt = el('span', 'txt');
      txt.appendChild(el('span', 'nm', z.name));
      txt.appendChild(el('span', 'sub',
        state === 'locked' ? ('제 ' + z.chapter + ' 장을 막아야 열린다')
        : state === 'tainted' ? ('오염된 판 · ' + elKo(z.element) + ' — 더 어렵고 드랍이 다르다')
        : (elKo(z.element) + ' · ' + z.family + ' 계보 · 덱 10장')));
      b.append(mark, txt, el('span', 'go', state === 'locked' ? '잠김' : '입장'));
      if (state !== 'locked') b.addEventListener('click', function () { enterHunt(z, state); });
      li.appendChild(b);
      l.appendChild(li);
    });
    $('#huntOpen').textContent = open + '곳 열림';
  }
  function enterHunt(z, state) {
    var foe = { name: z.name + '의 잡몹', element: z.element, deck: foeDeck(z) };
    runBattle(foe, z.name, function (r) {
      var got = r.win ? earnEther(state === 'tainted' ? 120 : 80) : 0;
      showResult(r.win, z.name, [['에테르', '+' + fmt(got)], ['턴', r.turns], ['남은 체력', r.myHp]]);
    });
  }

  /* ── 전투 화면 ─────────────────────────────────
     규칙은 battle.js 에 있다. 여기는 그리고 누르는 일만 한다. */
  var G = null, battleDone = null, sel = null;   /* sel: {from:'hand'|'field', i:n} */

  function deckCards() {
    var list = S.deck.map(function (id) { return D.cardById[id]; }).filter(Boolean);
    var playable = D.cards.cards.filter(function (c) { return c.cost != null; });
    while (list.length < 30) list.push(playable[Math.floor(Math.random() * playable.length)]);
    return list.slice(0, 30);
  }
  function foeDeck(zone) {
    var pool = D.cards.cards.filter(function (c) {
      return c.cost != null && (c.element === zone.element || c.family === 'COMMON');
    });
    if (pool.length < 8) pool = D.cards.cards.filter(function (c) { return c.cost != null; });
    var out = [];
    for (var i = 0; i < 30; i++) out.push(pool[Math.floor(Math.random() * pool.length)]);
    return out;
  }

  function runBattle(foe, title, done) {
    battleDone = done; sel = null;
    G = DGABattle.create(deckCards(), foe.deck || deckCards(), hash(title + ':' + Date.now()), 'me');
    $('#battleTitle').textContent = title;
    $('#battleSub').textContent = foe.name + (foe.element ? ' · ' + elKo(foe.element) : '');
    $('#foeName').textContent = foe.name;
    $('#battleMe').textContent = UI.player.name;
    paintBattle();
    setView('battle');
  }

  function unitEl(u, who, i) {
    var n = el('button', 'bunit' + (u.pos === 'def' ? ' def' : '') + (u.sick ? ' sick' : ''));
    n.type = 'button';
    if (sel && sel.from === 'field' && sel.who === who && sel.i === i) n.classList.add('sel');
    var badge = el('span', 'el el-' + (u.card.element || 'none'));
    badge.appendChild(elIcon(u.card.element, 9));
    n.appendChild(badge);
    n.appendChild(el('span', 'bn', u.card.short || u.card.name));
    var st = el('span', 'bs');
    st.append(el('span', 'ba', String(u.atk)), el('span', 'bd', String(u.hp)));
    n.appendChild(st);
    n.appendChild(el('span', 'pos', u.pos === 'def' ? '수비' : '공격'));
    if (u.shield) n.classList.add('shield');
    return n;
  }

  function paintBattle() {
    if (!G) return;
    $('#turnLabel').textContent = 'TURN ' + G.turn + ' · ' + (G.who === 'me' ? '내 턴' : '상대 턴');
    $('#foeNum').textContent = Math.max(0, G.foe.hp);
    $('#myNum').textContent = Math.max(0, G.me.hp);
    $('#foeHp').style.width = Math.max(0, G.foe.hp / DGABattle.HP * 100) + '%';
    $('#myHp').style.width = Math.max(0, G.me.hp / DGABattle.HP * 100) + '%';

    var dots = $('#ichorDots'); dots.textContent = '';
    for (var k = 0; k < Math.max(1, G.me.ichorMax); k++) {
      dots.appendChild(el('i', k < G.me.ichor ? 'on' : ''));
    }

    ['foe', 'me'].forEach(function (who) {
      var f = $('#' + (who === 'foe' ? 'foeField' : 'myField'));
      f.textContent = '';
      G[who].field.forEach(function (u, i) {
        var slot = el('span', 'bslot');
        if (u) {
          var n = unitEl(u, who, i);
          n.addEventListener('click', function () { tapUnit(who, i); });
          slot.appendChild(n);
        } else if (who === 'me' && sel && sel.from === 'hand') {
          slot.classList.add('pick');
        }
        f.appendChild(slot);
      });
      var t = $('#' + (who === 'foe' ? 'foeTraps' : 'myTraps'));
      t.textContent = '';
      G[who].traps.forEach(function (tr) {
        var b = el('span', 'btrap' + (tr ? ' set' : ''), tr ? '계략' : '빈칸');
        t.appendChild(b);
      });
    });

    /* 상대 본체를 칠 수 있을 때만 버튼이 뜬다 */
    var canFace = sel && sel.from === 'field' && sel.who === 'me' &&
                  DGABattle.canAttack(G, 'me', sel.i, 'face');
    $('#foeFace').hidden = !canFace;

    var hand = $('#hand'); hand.textContent = '';
    G.me.hand.forEach(function (c, i) {
      var ok = G.who === 'me' && DGABattle.canPlay(G, 'me', i);
      var n = el('button', 'hcard' + (ok ? '' : ' no') +
        (sel && sel.from === 'hand' && sel.i === i ? ' sel' : ''));
      n.type = 'button';
      var top = el('span', 'top');
      top.append(el('span', 'hc', String(c.cost)),
                 el('span', 'hk', { unit: '인물', ward: '가호', oracle: '신탁', trap: '계략' }[c.kind] || ''));
      n.append(top, el('span', 'hn', c.name));
      var het = window.DGABattle.effectText(c.effect);
      n.appendChild(el('span', 'hs', c.kind === 'unit'
        ? c.atk + ' / ' + c.hp
        : (het ? het.short : '효과')));
      n.addEventListener('click', function () { tapHand(i); });
      hand.appendChild(n);
    });

    paintActs();
    $('#endTurn').disabled = G.who !== 'me' || !!G.over;
    if (G.over) finishBattle();
  }

  function paintActs() {
    var box = $('#bActs'); box.textContent = '';
    if (!G || G.over || G.who !== 'me') return;
    if (sel && sel.from === 'hand') {
      var c = G.me.hand[sel.i];
      if (!c) { sel = null; return; }
      /* 고른 카드가 무슨 일을 하는지 — 내는 자리에서 읽혀야 소용이 있다 */
      var pet = DGABattle.effectText(c.effect);
      if (pet) {
        var tip = el('span', 'actnote');
        tip.append(el('b', '', pet.short), el('span', '', pet.long));
        box.appendChild(tip);
      }
      if (c.kind === 'unit') {
        box.appendChild(actBtn('세로로 세운다', function () { doPlay('atk'); }));
        box.appendChild(actBtn('가로로 눕힌다', function () { doPlay('def'); }));
      } else {
        box.appendChild(actBtn(c.kind === 'trap' ? '뒷면으로 깐다' : '발동한다', function () { doPlay('atk'); }));
      }
      box.appendChild(actBtn('취소', function () { sel = null; paintBattle(); }, true));
    } else if (sel && sel.from === 'field' && sel.who === 'me') {
      var u = G.me.field[sel.i];
      if (!u) { sel = null; return; }
      if (!G.me.flipped && !u.sick) {
        box.appendChild(actBtn(u.pos === 'atk' ? '눕히기' : '세우기', function () {
          DGABattle.flip(G, 'me', sel.i); sel = null; paintBattle();
        }, true));
      }
      box.appendChild(actBtn('취소', function () { sel = null; paintBattle(); }, true));
    }
  }
  function actBtn(label, fn, ghost) {
    var b = el('button', ghost ? 'ghost' : '', label);
    b.type = 'button';
    b.addEventListener('click', fn);
    return b;
  }

  function tapHand(i) {
    if (G.who !== 'me' || G.over) return;
    if (!DGABattle.canPlay(G, 'me', i)) return;
    sel = (sel && sel.from === 'hand' && sel.i === i) ? null : { from: 'hand', i: i };
    paintBattle();
  }
  function doPlay(pos) {
    if (!sel || sel.from !== 'hand') return;
    DGABattle.playCard(G, 'me', sel.i, pos, null);
    sel = null; paintBattle();
  }
  function tapUnit(who, i) {
    if (G.over || G.who !== 'me') return;
    if (who === 'me') {
      if (sel && sel.from === 'hand') { sel = null; paintBattle(); return; }
      sel = (sel && sel.from === 'field' && sel.i === i) ? null : { from: 'field', who: 'me', i: i };
      paintBattle(); return;
    }
    if (sel && sel.from === 'field' && sel.who === 'me') {
      if (DGABattle.canAttack(G, 'me', sel.i, i)) { DGABattle.attack(G, 'me', sel.i, i); sel = null; }
      paintBattle();
    }
  }

  function myEndTurn() {
    if (!G || G.over || G.who !== 'me') return;
    sel = null;
    DGABattle.endTurn(G);
    paintBattle();
    setTimeout(function () {
      if (!G || G.over) { paintBattle(); return; }
      DGABattle.botTurn(G);
      paintBattle();
    }, 500);
  }

  function finishBattle() {
    if (!battleDone) return;
    var fn = battleDone; battleDone = null;
    var r = { win: G.over === 'me', turns: G.turn,
              damage: DGABattle.HP - Math.max(0, G.foe.hp), myHp: Math.max(0, G.me.hp) };
    setTimeout(function () { fn(r); }, 700);
  }

  function paintLog() {
    var box = $('#blog'); box.textContent = '';
    if (!G) return;
    G.log.slice(-60).forEach(function (l) {
      box.appendChild(el('p', l.kind === 'good' ? 'good' : (l.kind === 'bad' ? 'bad' : ''), l.text));
    });
    box.scrollTop = box.scrollHeight;
  }

  function showResult(win, title, gains) {
    $('#resultWord').textContent = win ? '승리' : '패배';
    $('#resultWord').classList.toggle('bad', !win);
    $('#resultSub').textContent = title;
    var g = $('#resultGains'); g.textContent = '';
    gains.forEach(function (p) {
      var n = el('span', 'gain');
      n.append(el('span', 'k', p[0]), el('span', 'v', String(p[1])));
      g.appendChild(n);
    });
    save();
    setView('result');
  }

  /* ── 뽑기 ────────────────────────────────────── */
  function pool(grade) {
    return D.cards.cards.filter(function (c) { return c.grade === grade && c.source === 'pool'; });
  }
  function drawOne() {
    S.pity++;
    var g;
    if (S.pity >= D.economy.summon.pity) g = 3;
    else { var r = Math.random() * 100; g = r < D.economy.summon.rates['3'] ? 3 : (r < 25 ? 2 : 1); }
    if (g === 3) S.pity = 0;
    var box = pool(g); if (!box.length) box = pool(1);
    var c = box[Math.floor(Math.random() * box.length)];
    var o = S.owned[c.id];
    if (o) { o.n++; if (o.n % D.economy.enhance.starNeeds === 0 && o.star < 3) o.star++; }
    else S.owned[c.id] = { n: 1, lv: 1, star: c.grade };
    return c;
  }
  function paintSummon() {
    var e = D.economy.summon;
    $('#cost1').textContent = '이코르 ' + fmt(e.cost1);
    $('#cost12').textContent = '이코르 ' + fmt(e.cost12) + ' · ★3 확정';
    var set = function (id, v) { var n = $(id); if (n) n.textContent = v; };
    set('#pityVal', S.pity); set('#pityVal2', S.pity);
    set('#pityMax', e.pity);

    /* PICK UP ★3 — 작은 카드 셋. 가운데가 주인공이다. */
    var row = $('#pickupRow');
    if (row) {
      row.textContent = '';
      var three = D.cards.cards.filter(function (c) { return c.grade === 3 && c.family !== 'COMMON'; });
      [0, 1, 2].forEach(function (k) {
        var c = three[(k * 7) % three.length];
        if (!c) return;
        var w = el('span', 'pick p' + k);
        w.appendChild(cardEl(c, { always: true, detail: true }));
        row.appendChild(w);
      });
    }
  }
  var lastPull = 1;
  function doPull(n) {
    var cost = n > 1 ? D.economy.summon.cost12 : D.economy.summon.cost1;
    if (!spend('ichor', cost)) {
      $('#pullMsg').textContent = '이코르가 모자란다. ' + fmt(cost) + ' 필요.';
      return;
    }
    $('#pullMsg').textContent = '';
    lastPull = n;
    var got = [];
    for (var i = 0; i < n; i++) got.push(drawOne());
    save(); paintSummon();
    var box = $('#revealCards'); box.textContent = '';
    got.forEach(function (c) { box.appendChild(cardEl(c, { always: true, detail: true })); });
    var best = got.reduce(function (m, c) { return Math.max(m, c.grade); }, 1);
    $('#revealTitle').textContent = best === 3 ? '★3 강림' : (best === 2 ? '괜찮은 손' : '소환 완료');
    $('#revealSub').textContent = (n > 1 ? n + '장 팩' : '1장')
      + ' · 천장 ' + S.pity + ' / ' + D.economy.summon.pity;
    setView('reveal');
  }

  function paintShop() {
    var g = $('#goods'); g.textContent = '';
    [[600, '작은 성배'], [1800, '은빛 성배'], [5000, '황금 성배']].forEach(function (p) {
      var n = el('span', 'good');
      n.append(el('span', 'amt', fmt(p[0])), el('span', 'nm', p[1]));
      var b = el('button', null, '받기'); b.type = 'button';
      b.addEventListener('click', function () { gain('ichor', p[0]); });
      n.appendChild(b); g.appendChild(n);
    });
    var gi = $('#gifts'); gi.textContent = '';
    [['사탕', 1], ['초코바', 2], ['삼각김밥', 3]].forEach(function (p) {
      var n = el('span', 'good');
      n.append(el('span', 'amt', '+' + p[1]), el('span', 'nm', p[0] + ' · 호감도'));
      var b = el('button', null, '준비 중'); b.type = 'button'; b.disabled = true;
      n.appendChild(b); gi.appendChild(n);
    });
  }

  /* ── 인연 · 모모톡 ───────────────────────────── */
  /* 전용 스레드가 없으면 기본 인사를 하나 만들어 준다 */
  function threadFor(id) {
    var own = D.talks.threads.filter(function (t) {
      return t.card === id && S.talkDone.indexOf(t.id) < 0;
    })[0];
    if (own) return own;
    var dft = D.talks.defaultThread;
    if (!dft) return null;
    var tid = 'first-' + id;
    if (S.talkDone.indexOf(tid) >= 0) return null;
    return { id: tid, card: id, bondGain: dft.bondGain, lines: dft.lines };
  }

  function unreadTotal() {
    if (!D.talks) return 0;
    return Object.keys(S.owned).filter(function (id) { return !!threadFor(id); }).length;
  }

  function paintTalks() {
    var l = $('#talkList'); l.textContent = '';
    var ids = Object.keys(S.owned);
    var unread = 0;
    if (!ids.length) {
      var e = el('li'); e.appendChild(el('div', 'empty', '아직 아는 사람이 없다. 먼저 카드를 뽑아 보자.'));
      l.appendChild(e);
    }
    ids.forEach(function (id) {
      var c = D.cardById[id];
      var lv = S.bondLv[id] || 0;
      var th = threadFor(id);
      if (th) unread++;
      var li = el('li');
      var b = el('button', 'row-it'); b.type = 'button';
      /* 아바타는 번개 아이콘이 아니라 그 카드의 일러스트다 — 카드 프레임 축소판 */
      var av = el('span', 'mini'); av.setAttribute('aria-hidden', 'true');
      var mi = el('span', 'mini-in');
      if (window.DGAArt) DGAArt.paint(mi, c);
      av.appendChild(mi);
      var txt = el('span', 'txt');
      txt.appendChild(el('span', 'nm', c.short || c.name));
      txt.appendChild(el('span', 'sub', th ? '새 메시지가 왔다' : '호감도 ' + lv + ' / 5'));
      var bb = el('span', 'bondbar');
      for (var i = 0; i < 5; i++) bb.appendChild(el('span', 'pip' + (i < lv ? ' on' : '')));
      txt.appendChild(bb);
      b.append(av, txt);
      if (th) b.appendChild(el('span', 'unread', '1'));   /* 핑크 칸 */
      b.addEventListener('click', function () { openTalk(id, th); });
      li.appendChild(b);
      l.appendChild(li);
    });
    $('#unreadCount').textContent = '안 읽음 ' + unread;
    $('#tabDot').hidden = unread === 0;
  }
  function openTalk(cardId, thread) {
    var c = D.cardById[cardId];
    $('#talkName').textContent = c.short || c.name;
    $('#talkFam').textContent = c.family;
    avatar($('#talkAva'), { god: (c.family || '').toLowerCase() }, 34);
    var bb = $('#talkBond'); bb.textContent = '';
    var lv = S.bondLv[cardId] || 0;
    for (var i = 0; i < 5; i++) bb.appendChild(el('span', 'pip' + (i < lv ? ' on' : '')));

    var log = $('#talkLog'); log.textContent = '';
    var ch = $('#talkChoices'); ch.textContent = '';
    if (!thread) {
      log.appendChild(el('div', 'sysline', '아직 온 메시지가 없다'));
      log.appendChild(el('div', 'empty',
        '대사는 아직 비어 있다. data/talks.json 에 틀만 잡아 둔 상태다.'));
      var out = el('button', 'choice'); out.type = 'button';
      out.appendChild(el('span', 'no', '\u2190'));
      out.appendChild(document.createTextNode('나가기'));
      out.addEventListener('click', function () { setView(null); });
      ch.appendChild(out);
      setView('talk');
      return;
    }
    log.appendChild(el('div', 'sysline', c.short + ' 가 말을 걸어 왔다'));
    (thread.lines.length ? thread.lines : [{ who: 'npc', text: '' }]).forEach(function (ln) {
      if (ln.who === 'me') return;
      var row = el('div', 'bub');
      var av = el('span', 'ava s'); av.setAttribute('aria-hidden', 'true');
      avatar(av, { god: (c.family || '').toLowerCase() }, 44);
      var t = el('span', 'txt');
      t.append(el('span', 'nm', c.short || c.name),
               el('p', 'ln', ln.text || '(대사 미정)'));
      row.append(av, t);
      log.appendChild(row);
    });
    var choices = (thread.lines.filter(function (l) { return l.who === 'me'; })[0] || {}).choices
      || [{ text: '(답장 미정)', bond: 1 }];
    choices.forEach(function (ci, i) {
      var b = el('button', 'choice'); b.type = 'button';
      b.appendChild(el('span', 'no', String(i + 1)));
      b.appendChild(document.createTextNode(ci.text || '(답장 미정)'));
      b.addEventListener('click', function () {
        var row = el('div', 'bub me');
        var av = el('span', 'ava s'); av.setAttribute('aria-hidden', 'true');
        avatar(av, UI.player.profile, 44);
        var t = el('span', 'txt');
        t.append(el('span', 'nm', UI.player.name), el('p', 'ln', ci.text || '(답장 미정)'));
        row.append(av, t); log.appendChild(row);
        ch.textContent = '';
        S.bondLv[cardId] = Math.min(5, (S.bondLv[cardId] || 0) + (ci.bond || 0));
        if (S.talkDone.indexOf(thread.id) < 0) S.talkDone.push(thread.id);
        D.bonds.bonds.forEach(function (bd) {
          if ((bd.a === cardId || bd.b === cardId) && (S.bondLv[cardId] >= bd.reveal)) {
            var k = bd.a + '|' + bd.b;
            if (S.seenBonds.indexOf(k) < 0) {
              S.seenBonds.push(k);
              log.appendChild(el('div', 'sysline',
                '관계가 드러났다 — ' + D.cardById[bd.a].short + ' · ' + D.cardById[bd.b].short));
            }
          }
        });
        save(); paintTalks();
        var back = el('button', 'choice'); back.type = 'button';
        back.appendChild(el('span', 'no', '←'));
        back.appendChild(document.createTextNode('나가기'));
        back.addEventListener('click', function () { setView(null); });
        ch.appendChild(back);
      });
      ch.appendChild(b);
    });
    setView('talk');
  }

  /* ── 연대기 ──────────────────────────────────── */
  function paintChron() {
    var l = $('#chronList'); l.textContent = '';
    var any = false;
    D.season.chapters.forEach(function (ch) {
      var res = S.cleared[ch.n];
      if (!res) return;
      any = true;
      var n = el('div', 'chron' + (res === '실패' ? ' lost' : ''));
      var hd = el('div', 'hd-r');
      hd.append(el('span', 'n', '제 ' + ch.n + ' 장 · ' + ch.god),
                el('h3', null, ch.title), el('span', 'spacer'),
                el('span', 'res' + (res === '실패' ? ' bad' : ''), res));
      n.appendChild(hd);
      n.appendChild(el('p', 'body-t', ch.text[res] || '(본문 미정 — season-01.json 의 text 가 비어 있다)'));
      l.appendChild(n);
    });
    if (!any) l.appendChild(el('div', 'empty', '아직 끝난 장이 없다. 첫 장을 막아 보자.'));
  }

  /* ── 전체 다시 그리기 ────────────────────────── */
  function paintAll() {
    paintWallet(); paintHome(); paintDex(); paintDeck(); paintGrow(); paintMelt();
    paintBondMap(); paintSlots(); paintHunt(); paintSummon(); paintShop(); paintTalks();
  }

  /* ── 이벤트 ──────────────────────────────────── */
  function wire() {
    all('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () { setTab(b.getAttribute('data-tab')); paintAll(); });
    });
    Object.keys(SEGS).forEach(function (tab) {
      all('#tab-' + tab + ' [data-seg]').forEach(function (b) {
        b.addEventListener('click', function () { setSeg(tab, b.getAttribute('data-seg')); paintAll(); });
      });
    });
    all('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () { setView(null); paintAll(); });
    });
    $('#openChron').addEventListener('click', function () { paintChron(); setView('chron'); });
    /* 바로가기 — 셋 다 이미 있는 화면으로만 보낸다 */
    all('[data-go]').forEach(function (b) {
      b.addEventListener('click', function () {
        var to = b.getAttribute('data-go');
        if (to === 'board') { $('#board').scrollIntoView({ block: 'start' }); return; }
        setTab(to);
        if (to === 'daily') setSeg('daily', 'time');
        paintAll();
      });
    });
    $('#goPhase').addEventListener('click', function () {
      setTab('daily');
      setSeg('daily', S.day === 3 ? 'hunt' : 'time');
      paintAll();
    });
    all('[data-pull]').forEach(function (b) {
      b.addEventListener('click', function () { doPull(parseInt(b.getAttribute('data-pull'), 10)); });
    });
    $('#revealAgain').addEventListener('click', function () { doPull(lastPull); });
    $('#revealToDex').addEventListener('click', function () {
      setView(null); setTab('cards'); setSeg('cards', 'dex'); paintAll();
    });
    $('#endTurn').addEventListener('click', myEndTurn);
    $('#foeFace').addEventListener('click', function () {
      if (sel && sel.from === 'field' && sel.who === 'me') {
        DGABattle.attack(G, 'me', sel.i, 'face'); sel = null; paintBattle();
      }
    });
    var lg = $('#logDlg');
    $('#logOpen').addEventListener('click', function () {
      paintLog(); if (lg.showModal) lg.showModal(); else lg.setAttribute('open', '');
    });
    $('#logClose').addEventListener('click', function () { lg.close(); });
    $('#resultBack').addEventListener('click', function () { setView(null); paintAll(); });
    $('#resultToDex').addEventListener('click', function () {
      setView(null); setTab('cards'); setSeg('cards', 'dex'); paintAll();
    });
    $('#doMelt').addEventListener('click', function () {
      if (!meltSel.length) return;
      var sum = 0;
      meltSel.forEach(function (id) {
        var o = S.owned[id]; if (!o || o.n < 2) return;
        o.n--; sum += D.economy.offering[String(D.cardById[id].grade)] || 20;
      });
      meltSel = []; gain('ether', sum); save(); paintMelt(); paintDex();
    });
    $('#quizSend').addEventListener('click', submitQuiz);
    $('#quizInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submitQuiz(); }
    });
    $('#sayPost').addEventListener('click', postSay);
    $('#sayInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); postSay(); }
    });
    var dlg = $('#profileDlg');
    $('#profileOpen').addEventListener('click', function () {
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    });
    $('#profileClose').addEventListener('click', function () { dlg.close(); });
    $('#detDeck').addEventListener('click', detDeckToggle);
    $('#detGrow').addEventListener('click', function () {
      if (!detCard) return;
      setView(null); setTab('cards'); setSeg('cards', 'grow');
    });
    setInterval(function () { if (curTab === 'daily') paintSlots(); }, 10000);
  }
  function postSay() {
    var t = $('#sayInput').value.trim();
    if (!t) return;
    S.feed.push({ by: UI.player.name, fam: UI.player.fam + ' · 나', text: t, at: '방금' });
    $('#sayInput').value = '';
    save(); paintFeed();
  }

  /* ── 시작 ────────────────────────────────────── */
  /* 데이터가 다 읽히기 전에는 UI.boot 을 내놓지 않는다.
     먼저 불리면 D 가 비어 있어 화면을 그리다 터지고, 게이트가 안 걷힌다. */
  function boot(who, initial) {
    uid = who || 'local';
    S = initial || load() || fresh();
    if (!Object.keys(S.owned).length) {
      /* 처음이면 ★1 두 장을 쥐여 준다 — 덱이 아예 비면 아무것도 못 한다 */
      pool(1).slice(0, 2).forEach(function (c) { S.owned[c.id] = { n: 1, lv: 1, star: 1 }; S.deck.push(c.id); });
      save();
    }
    paintAll();
    dropGate();
  }

  step('2 · 데이터 읽는 중');
  loadData().then(function () {
    step('3 · 인증 기다리는 중');
    wire();
    setTab('home'); setSeg('cards', 'dex'); setSeg('daily', 'time'); setSeg('shop', 'summon');
    UI.boot = boot;                       /* 이제야 연다 */
    if (typeof UI.onReady === 'function') { UI.onReady(); return; }

    /* 아직 인증 모듈이 안 올라왔다. 모듈 본문이 돌면 __authAlive 가 켜지니,
       5초 동안 그것만 본다. 켜지면 계속 기다린다(그쪽이 boot 을 부른다).
       안 켜지면 gstatic 이 막힌 것이므로 브라우저 저장만으로 들여보낸다. */
    var waited = 0;
    var watch = setInterval(function () {
      if (window.__authAlive) { clearInterval(watch); return; }
      waited += 250;
      if (waited < 5000) return;
      clearInterval(watch);
      step('3 · 인증 없이 들어감');
      try { boot('local'); }
      catch (err) {
        $('#gateTitle').textContent = '화면을 그리지 못했습니다';
        $('#gateNote').textContent = String(err.message || err);
      }
    }, 250);
  }).catch(function (e) {
    $('#gateTitle').textContent = '데이터를 못 읽었습니다';
    $('#gateNote').textContent = String(e.message || e);
    step('2 · 데이터 읽기 실패');
  });

  /* 12초가 지나도 게이트가 남아 있으면, 어디서 멈췄는지 보여 주고 길을 준다 */
  setTimeout(function () {
    var gate = document.getElementById('gate');
    if (!gate) return;
    var box = $('#gate .box'); if (!box) return;
    $('#gateTitle').textContent = window.__authResolved ? '들어가지 못했습니다' : '연결하지 못했습니다';
    $('#gateNote').textContent = window.__authResolved
      ? '아래 단계에서 멈췄습니다. 이 글자를 알려 주시면 바로 찾습니다.'
      : '인증 모듈을 불러오지 못했습니다. 네트워크를 확인하고 새로고침해 주세요.';
    if (!box.querySelector('a')) {
      var a = document.createElement('a');
      a.href = 'index.html'; a.textContent = '로그인 화면으로';
      box.appendChild(a);
    }
    /* 데이터가 읽혔다면 저장 없이라도 들어가게 해 준다 */
    if (D && D.cards && typeof UI.boot === 'function' && !box.querySelector('button')) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn';
      b.style.cssText = 'margin-top:4px';
      b.innerHTML = '<span>그래도 들어가기</span>';
      b.addEventListener('click', function () {
        try { UI.boot(window.__uid || 'local', null); gate.remove(); }
        catch (e) { $('#gateNote').textContent = String(e.message || e); }
      });
      box.appendChild(b);
    }
  }, 12000);
})();
