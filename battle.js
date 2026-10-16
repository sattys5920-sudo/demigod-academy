/* 전투 엔진 — 순수하게 돌아간다. 같은 seed 와 같은 행동이면 같은 결과가 나온다.
   규칙은 RULES.md 에 있다. 브라우저와 Node 가 같이 쓴다. */
(function (root) {
  'use strict';

  var FIELD = 3, TRAPS = 2, HP = 30, HAND_MAX = 8, ICHOR_MAX = 10;

  function rngFrom(seed) {
    var x = (seed >>> 0) || 1;
    return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
  }
  function shuffle(list, rand) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* 원소 상극 — 번개 → 물 → 불 → 땅 → 바람 → 번개 */
  var BEATS = { bolt: 'water', water: 'fire', fire: 'earth', earth: 'wind', wind: 'bolt' };
  function mul(mine, theirs) {
    if (!mine || !theirs) return 1;
    if (BEATS[mine] === theirs) return 1.5;
    if (BEATS[theirs] === mine) return 0.67;
    return 1;
  }

  function side(deck, rand) {
    return {
      hp: HP, ichor: 0, ichorMax: 0, fatigue: 0, flipped: false,
      deck: shuffle(deck, rand), hand: [],
      field: [null, null, null], traps: [null, null]
    };
  }

  /* 하스스톤의 동전 — 후공이 한 장 더 뽑고, 이번 턴에 쓸 이코르 하나를 받는다.
     이게 없으면 선공이 65% 로 이긴다. */
  var COIN = { id: 'coin', name: '신들의 동전', short: '동전', kind: 'oracle',
               cost: 0, grade: 1, element: null, atk: null, hp: null,
               effect: { key: 'gain_ichor', n: 1 } };

  function create(myDeck, foeDeck, seed, firstWho) {
    var rand = rngFrom(seed);
    var g = { seed: seed, rand: rand, turn: 0, who: firstWho === 'foe' ? 'foe' : 'me',
              over: null, log: [], me: side(myDeck, rand), foe: side(foeDeck, rand) };
    var second = g.who === 'me' ? 'foe' : 'me';
    for (var i = 0; i < 4; i++) { draw(g, 'me'); draw(g, 'foe'); }
    draw(g, second);                 /* 후공은 한 장 더 */
    g[second].hand.push(COIN);       /* 그리고 동전 */
    beginTurn(g);
    return g;
  }

  function say(g, text, kind) { g.log.push({ text: text, kind: kind || 'sys' }); }

  function draw(g, who) {
    var s = g[who];
    if (!s.deck.length) {
      s.fatigue += 1;
      s.hp -= s.fatigue;
      say(g, (who === 'me' ? '내' : '상대') + ' 덱이 비었다 — 피로 ' + s.fatigue, 'bad');
      checkOver(g);
      return null;
    }
    var c = s.deck.shift();
    if (s.hand.length >= HAND_MAX) { say(g, '손패가 가득 차 ' + c.name + ' 이(가) 탔다', 'bad'); return null; }
    s.hand.push(c);
    return c;
  }

  function beginTurn(g) {
    g.turn += 1;
    var s = g[g.who];
    s.ichorMax = Math.min(ICHOR_MAX, s.ichorMax + 1);
    s.ichor = s.ichorMax;
    s.flipped = false;
    s.field.forEach(function (u) { if (u) { u.sick = false; u.acted = false; } });
    draw(g, g.who);
  }

  /* ── 효능 설명 ────────────────────────────────
     규칙을 집행하는 곳 바로 옆에 둔다. 화면 쪽에 따로 적어 두면
     규칙을 고칠 때 설명이 같이 안 고쳐져 둘이 어긋난다.
     short 는 카드 위에 한 줄로, long 은 자세히 보기와 손패에 쓴다. */
  var TEXT = {
    buff_atk:   function (n) { return ['공격 +' + n,     '내 인물 하나의 공격력이 ' + n + ' 오른다.',          '고양',      '등장']; },
    buff_all:   function ()  { return ['전체 +1/+1',     '내 인물 전부의 공격력과 체력이 1씩 오른다.',          '군세',      '등장']; },
    damage:     function (n) { return ['피해 ' + n,      '상대 인물 하나에 ' + n + ' 피해를 준다.',            '일격',      '발동']; },
    damage_all: function (n) { return ['전체 피해 ' + n, '상대 인물 전부에 ' + n + ' 피해를 준다.',            '진노',      '발동']; },
    heal:       function (n) { return ['회복 ' + n,      '내 본체 체력을 ' + n + ' 회복한다.',                 '치유',      '발동']; },
    draw:       function (n) { return ['뽑기 ' + n,      '카드를 ' + n + '장 뽑는다.',                         '계시',      '발동']; },
    gain_ichor: function (n) { return ['이코르 +' + n,   '이번 턴에 쓸 이코르가 ' + n + ' 늘어난다.',          '이코르의 샘', '발동']; },
    shield:     function ()  { return ['보호막',         '피해를 한 번 흘려 넘긴다. 한 번 쓰면 사라진다.',      '가호의 막',  '지속']; },
    guard:      function ()  { return ['수비 자세',      '눕혀서 나온다. 받는 피해가 절반이고, 대신 반격하지 않는다.', '방벽',  '지속']; },
    pierce:     function ()  { return ['관통',           '수비 자세로 선 상대도 절반으로 깎이지 않고 그대로 때린다.',  '관통',  '지속']; },
    counter:    function (n) { return ['반사 ' + n,      '엎어 둔다. 상대가 공격해 오면 그 인물에게 ' + n + ' 피해를 돌려준다.', '되갚음', '반응']; },
    negate:     function ()  { return ['공격 무효',      '엎어 둔다. 상대의 공격 한 번을 통째로 없앤다.',       '무효 선언', '반응']; }
  };
  function effectText(eff) {
    if (!eff || !TEXT[eff.key]) return null;
    var t = TEXT[eff.key](eff.n || 1);
    return { short: t[0], long: t[1], name: t[2], trigger: t[3] };
  }

  /* ── 능력 ──────────────────────────────────── */
  function myUnits(s) { return s.field.filter(Boolean); }
  function applyEffect(g, who, eff, selfUnit) {
    if (!eff) return;
    var me = g[who], you = g[who === 'me' ? 'foe' : 'me'];
    var n = eff.n || 1;
    switch (eff.key) {
      case 'buff_atk':
        var t = myUnits(me)[0];
        if (t) { t.atk += n; say(g, t.card.short + ' 공격 +' + n, 'good'); }
        break;
      case 'buff_all':
        myUnits(me).forEach(function (u) { u.atk += 1; u.hp += 1; });
        say(g, '내 인물 전부 +1 / +1', 'good');
        break;
      case 'damage':
        var f = myUnits(you)[0];
        if (f) { hurt(g, who === 'me' ? 'foe' : 'me', f, n); say(g, f.card.short + ' 에 ' + n + ' 피해', 'good'); }
        break;
      case 'damage_all':
        myUnits(you).slice().forEach(function (u) { hurt(g, who === 'me' ? 'foe' : 'me', u, n); });
        say(g, '상대 인물 전부에 ' + n + ' 피해', 'good');
        break;
      case 'heal':
        me.hp = Math.min(HP, me.hp + n); say(g, '본체 ' + n + ' 회복', 'good'); break;
      case 'draw':
        for (var i = 0; i < n; i++) draw(g, who);
        say(g, n + '장 뽑았다', 'good'); break;
      case 'gain_ichor':
        me.ichor += n; say(g, '이코르 +' + n, 'good'); break;
      case 'shield':
        var sh = selfUnit || myUnits(me)[0];
        if (sh) { sh.shield = 1; say(g, sh.card.short + ' 에 보호막', 'good'); }
        break;
      case 'guard':
        if (selfUnit) { selfUnit.pos = 'def'; say(g, selfUnit.card.short + ' 수비 표시로 섰다', 'good'); }
        break;
      case 'pierce':
        if (selfUnit) { selfUnit.pierce = true; say(g, selfUnit.card.short + ' 는 수비를 꿰뚫는다', 'good'); }
        break;
    }
    cleanup(g);
  }

  function hurt(g, who, unit, amount) {
    if (unit.shield) { unit.shield = 0; say(g, unit.card.short + ' 가 피해를 한 번 흘렸다'); return 0; }
    unit.hp -= amount;
    return amount;
  }

  function cleanup(g) {
    ['me', 'foe'].forEach(function (w) {
      g[w].field.forEach(function (u, i) {
        if (u && u.hp <= 0) { say(g, u.card.short + ' 이(가) 쓰러졌다'); g[w].field[i] = null; }
      });
    });
    checkOver(g);
  }

  function checkOver(g) {
    if (g.over) return;
    if (g.me.hp <= 0 && g.foe.hp <= 0) g.over = 'draw';
    else if (g.foe.hp <= 0) g.over = 'me';
    else if (g.me.hp <= 0) g.over = 'foe';
  }

  /* ── 행동 ──────────────────────────────────── */
  function canPlay(g, who, handIndex) {
    var s = g[who], c = s.hand[handIndex];
    if (!c || g.over) return false;
    if (s.ichor < c.cost) return false;
    if (c.kind === 'unit') return s.field.indexOf(null) >= 0;
    if (c.kind === 'trap') return s.traps.indexOf(null) >= 0;
    return true;
  }

  function playCard(g, who, handIndex, pos, slot) {
    if (!canPlay(g, who, handIndex)) return false;
    var s = g[who], c = s.hand[handIndex];
    s.ichor -= c.cost;
    s.hand.splice(handIndex, 1);

    if (c.kind === 'unit') {
      var at = (slot != null && s.field[slot] === null) ? slot : s.field.indexOf(null);
      var u = { card: c, atk: c.atk, hp: c.hp, maxHp: c.hp, pos: pos === 'def' ? 'def' : 'atk',
                sick: true, acted: false, shield: 0, pierce: false };
      s.field[at] = u;
      say(g, c.name + ' 등장 (' + (u.pos === 'def' ? '수비' : '공격') + ' 표시)');
      applyEffect(g, who, c.effect, u);
    } else if (c.kind === 'trap') {
      s.traps[s.traps.indexOf(null)] = { card: c, face: 'down' };
      say(g, '계략을 한 장 깔았다');
    } else {
      say(g, c.name + ' 발동');
      applyEffect(g, who, c.effect, null);
    }
    return true;
  }

  /* 턴마다 한 번만 표시를 바꾼다 */
  function flip(g, who, slot) {
    var s = g[who], u = s.field[slot];
    if (!u || s.flipped || u.sick || g.over) return false;
    u.pos = u.pos === 'atk' ? 'def' : 'atk';
    s.flipped = true;
    say(g, u.card.short + ' 를 ' + (u.pos === 'def' ? '눕혔다' : '세웠다'));
    return true;
  }

  function hasGuard(s) { return s.field.some(function (u) { return u && u.pos === 'def'; }); }

  function canAttack(g, who, from, to) {
    var s = g[who], o = g[who === 'me' ? 'foe' : 'me'], u = s.field[from];
    if (g.over || !u || u.sick || u.acted || u.pos !== 'atk') return false;
    if (to === 'face') return !hasGuard(o);
    var t = o.field[to];
    if (!t) return false;
    if (hasGuard(o) && t.pos !== 'def') return false;   /* 눕힌 것부터 치워야 한다 */
    return true;
  }

  function attack(g, who, from, to) {
    if (!canAttack(g, who, from, to)) return false;
    var s = g[who], ow = who === 'me' ? 'foe' : 'me', o = g[ow], u = s.field[from];
    u.acted = true;
    if (springNegate(g, ow)) { cleanup(g); return true; }

    if (to === 'face') {
      var dmg = Math.max(1, Math.round(u.atk));
      o.hp -= dmg;
      say(g, u.card.short + ' 가 본체를 쳤다 — ' + dmg, who === 'me' ? 'good' : 'bad');
      springTraps(g, ow, u);
      checkOver(g);
      return true;
    }

    var t = o.field[to];
    var m = mul(u.card.element, t.card.element);
    var raw = u.atk * m;
    if (t.pos === 'def' && !u.pierce) raw = Math.floor(raw / 2);
    var hit = Math.max(1, Math.round(raw));
    hurt(g, ow, t, hit);
    var tag = m > 1 ? ' (상극 ×1.5)' : (m < 1 ? ' (역상극 ×0.67)' : '');
    say(g, u.card.short + ' → ' + t.card.short + ' ' + hit + ' 피해' + tag, who === 'me' ? 'good' : 'bad');

    if (t.pos === 'atk') {                       /* 세로끼리는 서로 맞는다 */
      var back = Math.max(1, Math.round(t.atk * mul(t.card.element, u.card.element)));
      hurt(g, who, u, back);
      say(g, t.card.short + ' 의 반격 — ' + back);
    }
    springTraps(g, ow, u);
    cleanup(g);
    return true;
  }

  /* 상대가 공격하면 깔아 둔 계략이 터진다 */
  /* 무효 계략은 피해가 들어가기 전에 터진다 — 그게 '무효' 의 뜻이다.
     반사(counter)는 맞은 뒤에 돌려주지만, 이쪽은 공격 자체를 없앤다. */
  function springNegate(g, ownerWho) {
    var s = g[ownerWho];
    for (var i = 0; i < s.traps.length; i++) {
      var tr = s.traps[i];
      if (!tr || tr.face !== 'down') continue;
      var eff = tr.card.effect;
      if (!eff || eff.key !== 'negate') continue;
      s.traps[i] = null;
      say(g, tr.card.name + ' 발동 — 공격이 무효가 됐다', ownerWho === 'me' ? 'good' : 'bad');
      return true;
    }
    return false;
  }

  function springTraps(g, ownerWho, attacker) {
    var s = g[ownerWho];
    for (var i = 0; i < s.traps.length; i++) {
      var tr = s.traps[i];
      if (!tr || tr.face !== 'down') continue;
      var eff = tr.card.effect;
      if (!eff || eff.key !== 'counter') continue;
      s.traps[i] = null;
      var n = eff.n || 2;
      say(g, tr.card.name + ' 발동 — ' + n + ' 반사', ownerWho === 'me' ? 'good' : 'bad');
      if (attacker) hurt(g, ownerWho === 'me' ? 'foe' : 'me', attacker, n);
      cleanup(g);
      break;
    }
  }

  function endTurn(g) {
    if (g.over) return;
    g.who = g.who === 'me' ? 'foe' : 'me';
    beginTurn(g);
  }

  /* ── 봇 ────────────────────────────────────────
     욕심쟁이. 낼 수 있는 건 비싼 것부터 내고, 눕힌 걸 먼저 치운다. */
  /* 동전은 더 비싼 카드를 한 턴 당겨 내려고 쓰는 것이다. 마지막에 쓰면 의미가 없다. */
  function useCoinIfUseful(g, who) {
    var s = g[who];
    var coin = -1;
    s.hand.forEach(function (c, i) {
      if (c.cost === 0 && c.effect && c.effect.key === 'gain_ichor') coin = i;
    });
    if (coin < 0) return;
    var want = s.hand.some(function (c, i) {
      return i !== coin && c.cost === s.ichor + 1 && c.cost <= s.ichorMax + 1;
    });
    if (want) playCard(g, who, coin, 'atk', null);
  }

  function botTurn(g) {
    useCoinIfUseful(g, 'foe');
    var guard = 0;
    while (!g.over && guard++ < 24) {
      var s = g.foe;
      var best = -1, bestCost = -1;
      s.hand.forEach(function (c, i) {
        if (canPlay(g, 'foe', i) && c.cost > bestCost) { best = i; bestCost = c.cost; }
      });
      if (best < 0) break;
      var c = s.hand[best];
      /* 체력이 깎였으면 눕혀서 버틴다 */
      var pos = (c.kind === 'unit' && s.hp <= 12 && c.hp > c.atk) ? 'def' : 'atk';
      playCard(g, 'foe', best, pos, null);
    }
    guard = 0;
    while (!g.over && guard++ < 24) {
      var did = false;
      for (var i = 0; i < FIELD; i++) {
        if (canAttack(g, 'foe', i, 'face')) { attack(g, 'foe', i, 'face'); did = true; break; }
        for (var j = 0; j < FIELD; j++) {
          if (canAttack(g, 'foe', i, j)) { attack(g, 'foe', i, j); did = true; break; }
        }
        if (did) break;
      }
      if (!did) break;
    }
    if (!g.over) endTurn(g);
  }

  var API = { create: create, playCard: playCard, useCoinIfUseful: useCoinIfUseful, flip: flip, attack: attack,
              effectText: effectText,
              canPlay: canPlay, canAttack: canAttack, endTurn: endTurn, botTurn: botTurn,
              hasGuard: hasGuard, mul: mul, FIELD: FIELD, TRAPS: TRAPS, HP: HP };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.DGABattle = API;
})(typeof window !== 'undefined' ? window : globalThis);
