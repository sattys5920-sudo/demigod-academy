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

  var UI = window.DGA = { paintAvatar: null, player: { name: '나', profile: null, fam: '' }, onReady: null };

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
    var files = ['cards', 'bonds', 'season-01', 'zones', 'schedule', 'economy', 'quiz', 'minigames', 'talks', 'elements'];
    return Promise.all(files.map(function (f) {
      return fetch('data/' + f + '.json').then(function (r) {
        if (!r.ok) throw new Error(f + ' ' + r.status);
        return r.json();
      });
    })).then(function (got) {
      files.forEach(function (f, i) { D[f.replace('-01', '')] = got[i]; });
      D.cardById = {};
      D.cards.cards.forEach(function (c) { D.cardById[c.id] = c; });
    });
  }

  /* ── 오원소 ──────────────────────────────────── */
  var EL_PATH = {
    fire:  '<path d="M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 2 1.5 2.5 2 2 .5-1-1-4 1-7Z"/>',
    water: '<path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9Z"/>',
    earth: '<path d="M3 19h18"/><path d="m5 19 5-9 3 5 2-3 4 7"/>',
    wind:  '<path d="M3 9h10a3 3 0 1 0-3-3"/><path d="M3 14h13a3 3 0 1 1-3 3"/>',
    bolt:  '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>'
  };
  function elIcon(key, px) {
    var ns = 'http://www.w3.org/2000/svg';
    var sv = document.createElementNS(ns, 'svg');
    sv.setAttribute('width', String(px || 12)); sv.setAttribute('height', String(px || 12));
    sv.setAttribute('viewBox', '0 0 24 24'); sv.setAttribute('fill', 'none');
    sv.setAttribute('stroke', 'currentColor'); sv.setAttribute('stroke-width', '2.5');
    sv.setAttribute('stroke-linecap', 'round'); sv.setAttribute('stroke-linejoin', 'round');
    sv.setAttribute('aria-hidden', 'true');
    sv.innerHTML = EL_PATH[key] || EL_PATH.bolt;
    return sv;
  }
  function elKo(key) {
    var e = D.elements && D.elements.list[key];
    return e ? e.ko : '';
  }
  /* 상극이면 1.5배, 역상극이면 0.67배, 아니면 그대로 */
  function elMul(mine, theirs) {
    if (!D.elements || !mine || !theirs) return 1;
    var L = D.elements.list, M = D.elements.multiplier;
    if (L[mine] && L[mine].beats === theirs) return M.strong;
    if (L[theirs] && L[theirs].beats === mine) return M.weak;
    return M.even;
  }

  /* ── 전투 — 같은 입력이면 같은 결과 (순수) ───── */
  function rng(seed) {
    var x = seed >>> 0 || 1;
    return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
  }
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
  /* 아직은 간단한 자동 교전이다. 진짜 TCG 규칙(코스트·필드·스킬)은 다음 단계. */
  function sim(deckIds, foe, seed) {
    var rand = rng(seed);
    var deck = deckIds.map(function (id) { return D.cardById[id]; }).filter(Boolean);
    if (!deck.length) return { win: false, damage: 0, turns: 0, log: ['덱이 비어 있다'] };
    var foeHp = foe.hp, myHp = 30, turn = 0, dealt = 0, log = [];
    while (foeHp > 0 && myHp > 0 && turn < 12) {
      turn++;
      var c = deck[Math.floor(rand() * deck.length)];
      var s = stat(c);
      var mul = elMul(c.element, foe.element);
      var hit = Math.max(1, Math.round(s.atk * (0.8 + rand() * 0.6) * mul));
      foeHp -= hit; dealt += hit;
      log.push({ who: 'me', card: c.short || c.name, hit: hit, mul: mul });
      if (foeHp <= 0) break;
      var back = Math.max(1, Math.round(foe.atk * (0.7 + rand() * 0.6)));
      myHp -= back;
      log.push({ who: 'foe', hit: back });
    }
    return { win: foeHp <= 0, damage: dealt, turns: turn, myHp: Math.max(0, myHp), log: log };
  }

  /* ── 화면 이동 ───────────────────────────────── */
  var TITLES = { home: '신탁', cards: '계보', daily: '일상', shop: '상점', bonds: '인연' };
  var SEGS = {
    cards: ['dex', 'deck', 'grow', 'melt', 'bondmap'],
    daily: ['time', 'hunt'],
    shop: ['summon', 'goods']
  };
  var VIEWS = ['chron', 'scout', 'quiz', 'talk', 'reveal', 'battle', 'result'];
  var curTab = 'home';

  function setTab(name) {
    if (!TITLES[name]) return;
    curTab = name;
    $('#screenTitle').textContent = TITLES[name];
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
  function cardEl(c, opts) {
    opts = opts || {};
    var o = S.owned[c.id];
    var s = stat(c);
    var n = el('article', 'card' + (c.tone === 'pink' ? ' pinkish' : ''));
    var top = el('span', 'card-top');
    top.appendChild(el('span', 'cost', c.cost == null ? '?' : String(c.cost)));
    var badge = el('span', 'el el-' + (c.element || 'bolt'));
    badge.title = elKo(c.element);
    badge.appendChild(elIcon(c.element, 11));
    top.appendChild(badge);
    top.appendChild(el('span', 'fam', c.family === 'COMMON' ? '공통' : c.family));
    var art = el('span', 'art');
    art.appendChild(el('span', 'glyph', c.short || c.name));
    art.firstChild.style.fontSize = '15px';
    var rank = el('span', 'rank');
    for (var i = 0; i < (o ? (o.star || c.grade) : c.grade); i++) {
      var sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      sv.setAttribute('width', '12'); sv.setAttribute('height', '12');
      sv.setAttribute('viewBox', '0 0 24 24'); sv.setAttribute('fill', 'none');
      sv.setAttribute('stroke', 'currentColor'); sv.setAttribute('stroke-width', '3');
      sv.setAttribute('stroke-linecap', 'round'); sv.setAttribute('stroke-linejoin', 'round');
      sv.innerHTML = '<path d="m12 3 2.6 5.8 6.4.7-4.8 4.3 1.3 6.2L12 17l-5.5 3 1.3-6.2L3 9.5l6.4-.7L12 3Z"/>';
      rank.appendChild(sv);
    }
    if (o && o.lv > 1) rank.appendChild(document.createTextNode(' LV ' + o.lv));
    var name = el('h3', 'cname', c.name);
    var stats = el('span', 'stats');
    var a = el('span', 'stat atk', c.atk == null ? 'ATK ?' : 'ATK ' + s.atk);
    var h = el('span', 'stat', c.hp == null ? 'HP ?' : 'HP ' + s.hp);
    stats.append(a, h);
    n.append(top, art, rank, name, stats);
    if (!o && !opts.always) n.style.opacity = '.4';
    return n;
  }

  /* ── 홈 ──────────────────────────────────────── */
  function curChapter() {
    var n = 1;
    for (var i = 1; i <= 12; i++) { if (S.cleared[i]) n = i + 1; }
    return D.season.chapters[Math.min(n, 12) - 1];
  }
  function paintHome() {
    var me = UI.player;
    var on = $('#online'); on.textContent = '';
    var a = el('span', 'ava s'); a.setAttribute('aria-hidden', 'true');
    avatar(a, me.profile, 44); on.appendChild(a);
    on.appendChild(el('span', 'n', '지금 들어와 있는 사람 1명 · 나만'));

    var ch = curChapter();
    $('#chEyebrow').textContent = 'CHAPTER ' + String(ch.n).padStart(2, '0') + ' · ' + ch.god;
    $('#chTitle').textContent = ch.title;
    $('#chBoss').textContent = ch.boss.name + ' — ' + ch.boss.weaknessNote;
    $('#chLeft').textContent = 'DAY ' + S.day;

    var ph = $('#phases'); ph.textContent = '';
    [['DAY 1', '조사', '단서 ' + S.clues + ' / ' + ch.clues],
     ['DAY 2', '대비', '쪽지시험 · 장비'],
     ['DAY 3', '결전', ch.boss.name]].forEach(function (p, i) {
      var d = el('span', 'phase' + (i + 1 === S.day ? ' on' : (i + 1 < S.day ? ' done' : '')));
      d.append(el('span', 'd', p[0]), el('span', 't', p[1]), el('span', 's', p[2]));
      ph.appendChild(d);
    });
    paintFeed();
  }
  function paintFeed() {
    var f = $('#feed'); f.textContent = '';
    if (!S.feed.length) {
      var e = el('li'); e.appendChild(el('div', 'empty', '아직 아무도 아무 말도 남기지 않았다.'));
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
  function paintDex() {
    var fs = $('#dexFilters');
    if (!fs.children.length) {
      ['전체'].concat(D.cards.families).forEach(function (fam) {
        var b = el('button', 'filter', fam);
        b.type = 'button';
        b.setAttribute('aria-pressed', String(fam === dexFam));
        b.addEventListener('click', function () { dexFam = fam; paintDex(); });
        fs.appendChild(b);
      });
    } else {
      all('.filter', fs).forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.textContent === dexFam));
      });
    }
    paintRing();
    var list = D.cards.cards.filter(function (c) { return dexFam === '전체' || c.family === dexFam; });
    var g = $('#dexGrid'); g.textContent = '';
    list.forEach(function (c) { g.appendChild(cardEl(c, { always: true })); });
    var have = D.cards.cards.filter(function (c) { return S.owned[c.id]; }).length;
    $('#dexCount').innerHTML = have + ' <span style="color:var(--t3)">/ ' + D.cards.cards.length + '</span>';
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
      ic.appendChild(elIcon(k, 14));
      it.append(ic, el('span', 'ring-n', e.ko));
      it.title = e.why;
      box.appendChild(it);
      var ar = el('span', 'ring-ar');
      ar.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h12"/><path d="m12 6 6 6-6 6"/></svg>';
      box.appendChild(ar);
    });
    var first = el('span', 'ring-it');
    var ic0 = el('span', 'ring-ic el-' + D.elements.cycle[0]);
    ic0.appendChild(elIcon(D.elements.cycle[0], 14));
    first.append(ic0, el('span', 'ring-n', D.elements.list[D.elements.cycle[0]].ko));
    box.appendChild(first);
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
    $('#deckCount').innerHTML = S.deck.length + ' <span style="color:var(--t3)">/ 30</span>';
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
    var msg = el('p', 'msg'); msg.style.cssText = 'min-height:22px;font-size:13px;font-weight:700;color:var(--lime);margin:0';
    go.addEventListener('click', function () {
      if (!spend('ether', cost)) { msg.style.color = 'var(--pink)'; msg.textContent = '에테르가 모자란다. ' + fmt(cost) + ' 필요.'; return; }
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
      if (!seen) line.setAttribute('stroke', '#3B2450');
      svg.appendChild(line);
    });
    ids.forEach(function (id) {
      var c = D.cardById[id];
      var g = document.createElementNS(ns, 'g');
      g.setAttribute('class', 'node ' + (c.tone === 'pink' ? 'pink' : 'lime'));
      var ci = document.createElementNS(ns, 'rect');
      ci.setAttribute('x', pos[id].x - 19); ci.setAttribute('y', pos[id].y - 19);
      ci.setAttribute('width', '38'); ci.setAttribute('height', '38');
      ci.setAttribute('transform', 'rotate(45 ' + pos[id].x + ' ' + pos[id].y + ')');
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
    $('#capLeft').textContent = '오늘 에테르 ' + fmt(capLeft()) + ' 남음';
    var box = $('#slots'); box.textContent = '';
    S.slots.forEach(function (sl, i) {
      var b = el('button', 'slot-card'); b.type = 'button';
      if (!sl) {
        b.append(el('span', 'k', 'SLOT ' + (i + 1)), el('span', 'nm', '비어 있음'),
                 el('span', 'left', '+'));
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
    if (!S.deck.length) { alert('덱이 비어 있다. 카드 탭에서 덱을 짜고 오자.'); return; }
    var foe = { name: z.name + '의 잡몹', element: z.element,
                hp: state === 'tainted' ? 60 : 40, atk: state === 'tainted' ? 6 : 4 };
    runBattle(foe, z.name, function (r) {
      var got = r.win ? earnEther(state === 'tainted' ? 120 : 80) : 0;
      showResult(r.win, z.name, [['AITHER', '+' + fmt(got)], ['DAMAGE', fmt(r.damage)], ['TURNS', r.turns]]);
    });
  }

  /* ── 전투 화면 ───────────────────────────────── */
  var battleDone = null;
  function runBattle(foe, title, done) {
    battleDone = done;
    var seed = hash(title + ':' + Date.now());
    var r = sim(S.deck, foe, seed);
    $('#battleTitle').textContent = title;
    $('#battleSub').textContent = foe.name + (foe.element ? ' · ' + elKo(foe.element) : '');
    $('#foeName').textContent = foe.name;
    $('#foeNum').textContent = '0 / ' + foe.hp;
    $('#foeHp').style.width = '0%';
    $('#myNum').textContent = r.myHp + ' / 30';
    $('#myHp').style.width = (r.myHp / 30 * 100) + '%';
    $('#turnLabel').textContent = 'TURN ' + r.turns;
    $('#turnMana').textContent = '피해 ' + fmt(r.damage);
    var ff = $('#foeField'); ff.textContent = '';
    var mf = $('#myField'); mf.textContent = '';
    for (var i = 0; i < 3; i++) {
      ff.appendChild(el('span', 'slotmini foe', 'EMPTY'));
      mf.appendChild(el('span', 'slotmini', 'EMPTY'));
    }
    var hand = $('#hand'); hand.textContent = '';
    S.deck.slice(0, 5).forEach(function (id) {
      var c = D.cardById[id]; if (c) hand.appendChild(cardEl(c, { always: true }));
    });
    $('#battleResult') && $('#battleResult').remove();
    battleDone.__r = r;
    setView('battle');
  }
  function endTurn() {
    var r = battleDone && battleDone.__r;
    if (!r) { setView(null); return; }
    var fn = battleDone; battleDone = null;
    fn(r);
  }
  function showResult(win, title, gains) {
    $('#resultWord').textContent = win ? '승리' : '패배';
    $('#resultWord').style.color = win ? 'var(--lime)' : 'var(--pink)';
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
    $('#cost1').textContent = fmt(D.economy.summon.cost1);
    $('#cost12').textContent = fmt(D.economy.summon.cost12);
    $('#pityVal').textContent = S.pity;
    $('#pityMax').textContent = D.economy.summon.pity;
    $('#pityBar').style.width = Math.min(100, S.pity / D.economy.summon.pity * 100) + '%';
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
    got.forEach(function (c) { box.appendChild(cardEl(c, { always: true })); });
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
      var av = el('span', 'ava m'); av.setAttribute('aria-hidden', 'true');
      avatar(av, { god: (c.family || '').toLowerCase() }, 56);
      var txt = el('span', 'txt');
      txt.appendChild(el('span', 'nm', c.short || c.name));
      txt.appendChild(el('span', 'sub', th ? '새 메시지가 왔다' : '호감도 ' + lv + ' / 5'));
      var bb = el('span', 'bondbar');
      for (var i = 0; i < 5; i++) bb.appendChild(el('span', 'pip' + (i < lv ? ' on' : '')));
      txt.appendChild(bb);
      b.append(av, txt);
      if (th) b.appendChild(el('span', 'unread', '1'));
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
    $('#endTurn').addEventListener('click', endTurn);
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
  UI.boot = function (who, initial) {
    uid = who || 'local';
    S = initial || load() || fresh();
    if (!Object.keys(S.owned).length) {
      /* 처음이면 ★1 두 장을 쥐여 준다 — 덱이 아예 비면 아무것도 못 한다 */
      pool(1).slice(0, 2).forEach(function (c) { S.owned[c.id] = { n: 1, lv: 1, star: 1 }; S.deck.push(c.id); });
      save();
    }
    paintAll();
  };

  loadData().then(function () {
    wire();
    setTab('home'); setSeg('cards', 'dex'); setSeg('daily', 'time'); setSeg('shop', 'summon');
    if (typeof UI.onReady === 'function') UI.onReady();
    else UI.boot('local');
  }).catch(function (e) {
    $('#gateTitle').textContent = '데이터를 못 읽었습니다';
    $('#gateNote').textContent = String(e.message || e) + ' — 서버로 열어야 합니다 (python3 -m http.server).';
  });

  setTimeout(function () {
    if (window.__authResolved) return;
    var box = $('#gate .box'); if (!box) return;
    $('#gateTitle').textContent = '연결하지 못했습니다';
    $('#gateNote').textContent = '인증 모듈을 불러오지 못했습니다. 새로고침해 주세요.';
    var a = document.createElement('a');
    a.href = 'index.html'; a.textContent = '로그인 화면으로';
    box.appendChild(a);
  }, 8000);
})();
