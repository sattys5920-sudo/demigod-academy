/* 카드 그림 — 문장(紋章) 생성기.

   그림 파일이 아직 없다. 그렇다고 114장을 전부 같은 빗금으로 두면
   뽑기를 돌려도 아무 느낌이 없다. 그래서 카드마다 서로 다른 문장을
   코드로 그린다. 나중에 진짜 그림이 생기면 카드의 art 경로만 채우면
   되고(paint 가 그쪽을 먼저 쓴다), 이 파일은 빈 자리를 메우는 쪽으로
   남는다.

   보이는 것마다 뜻이 있어야 눈이 읽는다.

     색      등급.   ★1 흰색 · ★2 금색 · ★3 빨강
     문양    가문.   12신은 각자의 상징, 공통 카드는 부품을 조합한 인장
     구성    번호.   같은 가문 일곱 장이 서로 다른 짜임으로 놓인다
     바탕    원소.   번개 지그재그 · 물 물결 · 불 치솟음 · 땅 벽돌 · 바람 소용돌이
     테두리  종류.   인물 바닥선 · 가호 양옆 빗장 · 신탁 윗별 · 계략 가로 빗장

   같은 카드는 늘 같은 그림이다 — id 에서 뽑은 씨앗만 쓰고 난수는 안 쓴다. */

(function () {
  'use strict';

  var W = 120, H = 90, CY = 45;                /* 그림칸 비율 4:3 — 진짜 그림이 들어올 자리다 */

  /* ── 씨앗 ──────────────────────────────────── */
  function seedOf(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h || 1;
  }
  function rngOf(s) {
    var x = s >>> 0;
    return function () {
      x ^= x << 13; x >>>= 0;
      x ^= x >>> 17;
      x ^= x << 5;  x >>>= 0;
      return x / 4294967296;
    };
  }
  function pick(rnd, n) { return Math.floor(rnd() * n); }

  /* ── 색 = 등급 ────────────────────────────────
     원소는 카드 위쪽 배지가 이미 말한다. 그림은 등급을 말한다 —
     도감을 훑을 때 사람이 실제로 찾는 것이 그것이기 때문이다. */
  var INK  = '#0B0910';
  var TIER = {
    1: { line: '#F2EDF5', soft: 'rgba(242,237,245,.22)', glow: 'rgba(242,237,245,.13)' },
    2: { line: '#FFC53D', soft: 'rgba(255,197,61,.26)',  glow: 'rgba(255,197,61,.16)'  },
    3: { line: '#FF2B3E', soft: 'rgba(255,43,62,.30)',   glow: 'rgba(255,43,62,.19)'   }
  };

  /* ── 바탕 = 원소 ────────────────────────────── */
  function field(element, c) {
    var d = [], i;
    switch (element) {
      case 'bolt':
        for (i = -1; i < 9; i++) {
          var x = i * 16;
          d.push('M' + x + ' 0 L' + (x + 9) + ' 30 L' + x + ' 51 L' + (x + 10) + ' 90');
        }
        break;
      case 'water':
        for (i = 0; i < 9; i++) {
          var y = 5 + i * 11;
          d.push('M-6 ' + y + ' q 9 -6 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0 t 18 0');
        }
        break;
      case 'fire':
        for (i = -1; i < 10; i++) {
          var fx = i * 14 + 7;
          d.push('M' + fx + ' 90 q -6 -24 0 -39 q 6 15 0 39');
        }
        break;
      case 'earth':
        for (i = 0; i < 7; i++) d.push('M0 ' + (i * 13 + 4) + ' H120');
        for (i = 0; i < 10; i++) {
          var bx = i * 13 + ((i % 2) ? 6 : 0);
          d.push('M' + bx + ' 4 V17 M' + bx + ' 30 V43 M' + bx + ' 56 V69');
        }
        break;
      case 'wind':
        for (i = 0; i < 7; i++) {
          var wy = 8 + i * 12;
          d.push('M-4 ' + wy + ' h70 a7 7 0 1 0 -7 -7');
        }
        break;
      default:                                     /* 무속성 — 사선. 문양을 잡아먹지 않게 성기게 */
        for (i = -3; i < 13; i++) d.push('M' + (i * 17) + ' 90 L' + (i * 17 + 50) + ' -8');
        return '<path d="' + d.join(' ') + '" stroke="' + c.glow +
               '" stroke-width="1.3" fill="none"/>';
    }
    return '<path d="' + d.join(' ') + '" stroke="' + c.soft +
           '" stroke-width="1.4" fill="none"/>';
  }

  /* ── 문양 = 가문 ──────────────────────────────
     24×24 안에 그린다. 작게 줄여도 읽히게 획을 적게, 굵게. */
  var MARK = {
    ZEUS:       'M14.5 2 6 13.5h5.2L9.5 22 18 10.5h-5.2L14.5 2Z',                       /* 번개 */
    HERA:       'M3.5 19.5h17M4 19 5 7l4.3 4L12 4.5 14.7 11 19 7l1 12',                  /* 왕관 */
    POSEIDON:   'M5.5 4v4.5a6.5 6.5 0 0 0 13 0V4M12 8.5V21M8 21h8',                      /* 삼지창 */
    DEMETER:    'M12 21.5V6.5M12 7c0-2.3 1.8-3.6 3.4-4.3C15.4 5 14 6.4 12 7Zm0 0c0-2.3-1.8-3.6-3.4-4.3C8.6 5 10 6.4 12 7Zm0 5.5c0-2.3 1.8-3.6 3.4-4.3 0 2.3-1.4 3.7-3.4 4.3Zm0 0c0-2.3-1.8-3.6-3.4-4.3 0 2.3 1.4 3.7 3.4 4.3Z', /* 밀 이삭 */
    ATHENA:     'M12 3.2c4.8 0 8.4 3.6 8.4 8.2 0 5.6-3.8 10.4-8.4 10.4S3.6 17 3.6 11.4C3.6 6.8 7.2 3.2 12 3.2ZM8.2 10.2a2.6 2.6 0 1 0 .01 0ZM15.8 10.2a2.6 2.6 0 1 0 .01 0ZM10.4 13.8 12 16.4l1.6-2.6', /* 올빼미 */
    APOLLO:     'M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6ZM12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1', /* 태양 */
    ARTEMIS:    'M12 2.6a6.6 6.6 0 0 0 9.4 9.4 9.4 9.4 0 1 1-9.4-9.4Z',                             /* 초승달 */
    ARES:       'M12 2.2 20.4 5v7.4c0 4.6-3.6 8.3-8.4 9.4-4.8-1.1-8.4-4.8-8.4-9.4V5ZM7.6 10.2 12 13.8l4.4-3.6M7.6 14.4 12 18l4.4-3.6', /* 방패 */
    APHRODITE:  'M12 21.2C6 18 2.6 13.4 2.6 9.2a9.4 9.4 0 0 1 18.8 0c0 4.2-3.4 8.8-9.4 12ZM12 21.2V4.6M12 21.2 6.4 8.4M12 21.2 17.6 8.4', /* 가리비 */
    HEPHAISTOS: 'M13.4 1.6 22.4 10.6l-4.2 4.2-9-9ZM11.4 7.4 2 16.8l2.2 2.2 9.4-9.4',        /* 망치 */
    HERMES:     'M12 3.4v18M9 21.6h6M11.4 6c-2.4-1.9-5.5-2.3-7.3-1.3 1.4 2.5 4 3.9 7.3 3.9ZM12.6 6c2.4-1.9 5.5-2.3 7.3-1.3-1.4 2.5-4 3.9-7.3 3.9ZM12 10.2c-2.9 0-4.5 1.2-4.5 2.7s1.6 2.7 4.5 2.7 4.5 1.2 4.5 2.7-1.6 2.7-4.5 2.7', /* 카두케우스 */
    DIONYSOS:   'M12 7.5V3.5M12 4c2.4-1 4.4-.4 5.5.4-1.8 1.4-4 1.2-5.5-.4ZM9 10.5a2.1 2.1 0 1 0 0 .1ZM15 10.5a2.1 2.1 0 1 0 0 .1ZM12 14.6a2.1 2.1 0 1 0 0 .1ZM7.6 15a2.1 2.1 0 1 0 0 .1ZM16.4 15a2.1 2.1 0 1 0 0 .1ZM12 19.2a2.1 2.1 0 1 0 0 .1Z' /* 포도 */
  };

  /* ── 공통 카드 · 생물 ─────────────────────────
     신의 문장이 없는 것들이다. 몸통·뿔·눈·입·부속을 부품으로 두고
     id 가 조합을 고른다. 4×5×3×3×5 = 900 가지라 스물한 마리가
     겹칠 일이 없다. */
  function beast(rnd) {
    var p = [];
    var body = pick(rnd, 4), horn = pick(rnd, 5), eyes = 1 + pick(rnd, 3),
        mouth = pick(rnd, 3), limb = pick(rnd, 5);

    /* 몸통 */
    if (body === 0) p.push('M12 3.4a9 9 0 1 0 .01 0Z');                      /* 둥근 */
    else if (body === 1) p.push('M12 2.6c4.6 0 7.4 4 7.4 9s-2.8 9.8-7.4 9.8S4.6 16.6 4.6 11.6 7.4 2.6 12 2.6Z'); /* 길쭉 */
    else if (body === 2) p.push('M4.2 6.5h15.6v7.2c0 4.2-3.6 7.6-7.8 7.6s-7.8-3.4-7.8-7.6Z');                     /* 방패꼴 */
    else p.push('M12 2.8 20.6 19.6H3.4Z');                                   /* 삼각 */

    /* 뿔·귀 */
    if (horn === 1) p.push('M8.4 5.2 6.6 1.4M15.6 5.2l1.8-3.8');
    else if (horn === 2) p.push('M8.2 5.4C5.6 3.4 4.6 2 4.4 .8M15.8 5.4c2.6-2 3.6-3.4 3.8-4.6');
    else if (horn === 3) p.push('M8.6 5 5.4 4.2l1.6 3.4ZM15.4 5l3.2-.8-1.6 3.4Z');
    else if (horn === 4) p.push('M9 4.6C8 1.8 9.6 .6 11 .8M15 4.6c1-2.8-.6-4-2-3.8');

    /* 눈 */
    if (eyes === 1) p.push('M12 10.6a2.4 2.4 0 1 0 .01 0Z');
    else if (eyes === 2) p.push('M8.7 10.8a1.9 1.9 0 1 0 .01 0ZM15.3 10.8a1.9 1.9 0 1 0 .01 0Z');
    else p.push('M7.9 10.2a1.6 1.6 0 1 0 .01 0ZM12 13.1a1.6 1.6 0 1 0 .01 0ZM16.1 10.2a1.6 1.6 0 1 0 .01 0Z');

    /* 입 */
    if (mouth === 1) p.push('M9 16.4 12 19.4l3-3');                           /* 송곳니 */
    else if (mouth === 2) p.push('M8.8 17h6.4');                              /* 가로 */

    /* 부속 */
    if (limb === 1) p.push('M4 9.6C.8 8 .2 5.6.6 4.2 2.8 5 4 7 4 9.6ZM20 9.6c3.2-1.6 3.8-4 3.4-5.4-2.2.8-3.4 2.8-3.4 5.4Z'); /* 날개 */
    else if (limb === 2) p.push('M12 21.4c0 1.6 2.4 2 4 1.2');                /* 꼬리 */
    else if (limb === 3) p.push('M9.4 21v2.4M14.6 21v2.4');                   /* 다리 */
    else if (limb === 4) p.push('M3.6 13.4.8 15.6M20.4 13.4l2.8 2.2');        /* 지느러미 */

    return p.join('');
  }

  /* ── 공통 카드 · 사물 ─────────────────────────
     월계관·리라·넥타르·황금 양털 같은 것들. 생물 부품을 붙이면
     말이 안 되므로 따로 둔다. */
  var THING = [
    'M11.4 21.4C6 20.6 2.6 16 3.4 10.8 3.8 8 5.3 5.6 7.5 4.1M12.6 21.4c5.4-.8 8.8-5.4 8-10.6-.4-2.8-1.9-5.2-4.1-6.7M5.1 15.9l-2.7 1.2M4.9 11.7l-2.9.1M6.2 7.9 3.7 6.5M18.9 15.9l2.7 1.2M19.1 11.7l2.9.1M17.8 7.9l2.5-1.4',  /* 월계관 */
    'M12 22V7M12 10.6c-3-.4-4.6-2.6-4.8-4.8 2.8.2 4.6 2 4.8 4.8Zm0 0c3-.4 4.6-2.6 4.8-4.8-2.8.2-4.6 2-4.8 4.8ZM12 16c-2.6-.4-4-2.2-4.2-4.2 2.4.2 4 1.8 4.2 4.2Z', /* 올리브 가지 */
    'M6 21V5.6C6 3 8.6 1.6 12 1.6s6 1.4 6 4V21M6 21h12M9.4 6v13M12 5.2v14M14.6 6v13',  /* 리라 */
    'M6.4 3h11.2l-1.2 7.4a4.4 4.4 0 0 1-8.8 0ZM12 14.8V20M8 20.4h8',                    /* 잔 */
    'M4 12.2c0-4.2 3.6-7.6 8-7.6s8 3.4 8 7.6c0 1.8-.7 3.4-1.8 4.7l-1.4-1.6-1.7 2.6-1.8-2-1.3 2.4-1.3-2.4-1.8 2-1.7-2.6-1.4 1.6A7.1 7.1 0 0 1 4 12.2ZM8.4 10.8a1.7 1.7 0 1 0 .01 0ZM12 9.2a1.7 1.7 0 1 0 .01 0ZM15.6 10.8a1.7 1.7 0 1 0 .01 0Z', /* 양털 */
    'M3.6 9.6h16.8v10.8H3.6ZM3.6 9.6 6 4.4h12l2.4 5.2M12 4.4v15.9M10.2 13.6h3.6v3h-3.6Z', /* 상자 */
    'M12 2.6a9.4 9.4 0 1 0 .01 0ZM12 6.4a5.6 5.6 0 1 0 .01 0ZM12 10.2a1.8 1.8 0 1 0 .01 0Z', /* 동전 */
    'M12 2.8a9.2 9.2 0 1 0 .01 0ZM4.4 8.2c4.6 2.8 10.6 2.8 15.2 0M3.8 14.4c4.8-3 11.6-3 16.4 0M12 2.8c-3.2 4.8-3.2 13.6 0 18.4M12 2.8c3.2 4.8 3.2 13.6 0 18.4M18.6 19.4l3.6 2.8',  /* 실타래 */
    'M9 2.4h6v2.3c3.1 1.3 5 4.2 5 7.7 0 4.6-3.6 8.3-8 8.3s-8-3.7-8-8.3c0-3.5 1.9-6.4 5-7.7V2.4ZM7.3 6.6 3.9 9.6M16.7 6.6l3.4 3'  /* 암포라 */
  ];

  /* 사물은 아홉 장뿐이다. 해시에 맡기면 월계관에 상자가 붙는다 — 하나씩 짚는다. */
  var THING_OF = {
    'cm-16': 0,   /* 월계관     → 월계관   */
    'cm-17': 1,   /* 올리브 가지 → 가지     */
    'cm-18': 2,   /* 리라       → 리라     */
    'cm-19': 8,   /* 암브로시아  → 접시 위 과실 */
    'cm-20': 3,   /* 넥타르     → 잔       */
    'cm-21': 7,   /* 아리아드네의 실 → 실타래 */
    'cm-22': 6,   /* 스틱스의 뱃삯   → 동전   */
    'cm-23': 4,   /* 황금 양털   → 양털     */
    'cm-24': 5    /* 판도라의 상자 → 상자    */
  };

  /* ── 문양 뒤에 까는 인장 ─────────────────────── */
  function sealPath(kind, r) {
    switch (kind) {
      case 0: return 'M60 ' + (CY - r) + 'a' + r + ' ' + r + ' 0 1 0 .01 0Z';
      case 1: return 'M60 ' + (CY - r) + 'L' + (60 + r) + ' ' + CY + 'L60 ' + (CY + r) + 'L' + (60 - r) + ' ' + CY + 'Z';
      case 2:
        var h = r * 0.866;
        return 'M' + (60 - r) + ' ' + CY + 'L' + (60 - r / 2) + ' ' + (CY - h) + 'L' + (60 + r / 2) + ' ' + (CY - h) +
               'L' + (60 + r) + ' ' + CY + 'L' + (60 + r / 2) + ' ' + (CY + h) + 'L' + (60 - r / 2) + ' ' + (CY + h) + 'Z';
      default:
        return 'M' + (60 - r) + ' ' + (CY + r) + 'V' + CY + 'a' + r + ' ' + r + ' 0 0 1 ' + (r * 2) + ' 0v' + r + 'Z';
    }
  }

  /* ── 종류 = 테두리 ───────────────────────────── */
  function frame(kind, c) {
    var s = ' stroke="' + c.line + '" stroke-width="2.4" fill="none" opacity=".85"';
    if (kind === 'ward')   return '<path d="M4 12v66M116 12v66"' + s + '/>';
    if (kind === 'trap')   return '<path d="M0 45h120"' + s + ' opacity=".45"/>';
    if (kind === 'oracle') return '<path d="M52 7l1.6 3.4L57 12l-3.4 1.6L52 17l-1.6-3.4L47 12l3.4-1.6ZM60 4l1.2 2.6L64 8l-2.8 1.2L60 12l-1.2-2.8L56 8l2.8-1.4ZM68 7l1.6 3.4L73 12l-3.4 1.6L68 17l-1.6-3.4L63 12l3.4-1.6Z" fill="' + c.line + '" opacity=".8"/>';
    return '<path d="M20 83h80"' + s + '/>';
  }

  /* ── 등급 장식 ───────────────────────────────── */
  function rays(grade, c, off) {
    if (grade < 2) return '';
    var n = grade === 3 ? 16 : 10, out = [], i;
    var far = grade === 3 ? 66 : 52;
    for (i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + off;
      out.push('M' + (60 + Math.cos(a) * 26).toFixed(1) + ' ' + (CY + Math.sin(a) * 26).toFixed(1) +
               'L' + (60 + Math.cos(a) * far).toFixed(1) + ' ' + (CY + Math.sin(a) * far * .82).toFixed(1));
    }
    return '<path d="' + out.join('') + '" stroke="' + c.glow + '" stroke-width="2.4" fill="none"/>';
  }

  /* ── 구성 = 카드 번호 ─────────────────────────
     같은 가문 일곱 장이 같은 문양을 쓴다. 그대로 두면 일곱 장이 한
     장처럼 보이므로, 번호대로 짜임을 바꾼다 — 하나 / 거울 둘 / 셋 /
     고리 안 / 크게 잘림 / 비스듬히 / 뒤에 깔림. */
  function place(d, variant, grade, c) {
    var g = function (tf, w) {
      return '<g transform="' + tf + '" fill="none" stroke="' + c.line +
             '" stroke-width="' + (w || 1.9) + '" stroke-linecap="round" stroke-linejoin="round">' +
             '<path d="' + d + '"/></g>';
    };
    var k = grade === 3 ? 2.4 : (grade === 2 ? 2.2 : 2.0);
    var mid = function (s) { return 'translate(' + (60 - 12 * s) + ' ' + (CY - 12 * s) + ') scale(' + s + ')'; };

    switch (variant) {
      case 1:   /* 거울 둘 */
        return g('translate(' + (33 - 12 * 1.7) + ' ' + (CY - 12 * 1.7) + ') scale(1.7)', 1.9) +
               g('translate(' + (87 + 12 * 1.7) + ' ' + (CY - 12 * 1.7) + ') scale(-1.7 1.7)', 1.9);
      case 2:   /* 가운데 큰 것 + 양옆 작은 것 */
        return g('translate(' + (24 - 12 * 1.05) + ' ' + (CY + 4 - 12 * 1.05) + ') scale(1.05)', 2.4) +
               g('translate(' + (96 - 12 * 1.05) + ' ' + (CY + 4 - 12 * 1.05) + ') scale(1.05)', 2.4) +
               g(mid(k * .92));
      case 3:   /* 고리 안에 가둠 */
        return '<path d="M60 ' + (CY - 32) + 'a32 32 0 1 0 .01 0Z" fill="none" stroke="' + c.line +
               '" stroke-width="1.7" opacity=".55"/>' + g(mid(k * .84));
      case 4:   /* 크게 — 칸 밖으로 잘린다 */
        return g('translate(' + (60 - 12 * 4.1) + ' ' + (CY - 12 * 4.1) + ') scale(4.1)', 1.25);
      case 5:   /* 비스듬히 */
        return g('rotate(-14 60 ' + CY + ') ' + mid(k));
      case 6:   /* 뒤에 작게 깔리고, 앞에 하나 */
        return '<g transform="translate(8 10) scale(.72)" fill="none" stroke="' + c.line +
               '" stroke-width="3" opacity=".22"><path d="' + d + '"/></g>' +
               '<g transform="translate(84 44) scale(.72)" fill="none" stroke="' + c.line +
               '" stroke-width="3" opacity=".22"><path d="' + d + '"/></g>' +
               g(mid(k * .95));
      default:  /* 단독 */
        return g(mid(k));
    }
  }

  /* ── 한 장 ───────────────────────────────────── */
  function markup(card) {
    var id = card.id || card.name || 'x';
    var rnd = rngOf(seedOf(id));
    var grade = card.grade || 1;
    var c = TIER[grade] || TIER[1];
    var fam = card.family || 'COMMON';

    /* 번호가 있으면 짜임은 번호가 정한다 — 같은 가문 안에서 안 겹치게 */
    var num = (/(\d+)\s*$/.exec(id) || [0, 0])[1] | 0;
    var variant = num ? (num % 7) : pick(rnd, 7);

    var d = MARK[fam];
    if (!d) {
      if (card.kind === 'unit') d = beast(rnd);
      else d = THING[THING_OF[id] != null ? THING_OF[id] : pick(rnd, THING.length)];
    }

    /* 조각이 네 개를 넘는 문양(카두케우스·포도·태양…)은 작게 줄이면 뭉개진다.
       그런 것에는 여러 개로 벌리는 짜임(거울 둘·셋)을 주지 않는다. */
    if ((d.match(/M/g) || []).length >= 4) {
      if (variant === 1) variant = 3;
      else if (variant === 2) variant = 5;
    }

    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="100%" ' +
             'preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
             '<rect width="' + W + '" height="' + H + '" fill="' + INK + '"/>' +
             field(card.element, c) +
             rays(grade, c, rnd() * 0.4) +
             '<path d="' + sealPath(pick(rnd, 4), 28 + pick(rnd, 6)) + '" fill="rgba(11,9,16,.5)" ' +
                   'stroke="' + c.soft + '" stroke-width="1.8"/>' +
             place(d, variant, grade, c) +
             frame(card.kind, c) +
           '</svg>';
  }

  /* 그림 파일이 생기면 그쪽이 먼저다. 못 불러오면 조용히 문장으로 돌아온다. */
  function paint(node, card) {
    node.textContent = '';
    if (card.art) {
      var img = new Image();
      img.alt = '';
      img.decoding = 'async';
      img.loading = 'lazy';
      img.className = 'art-img';
      img.onerror = function () { node.innerHTML = markup(card); };
      img.src = card.art;
      node.appendChild(img);
      return;
    }
    node.innerHTML = markup(card);
  }

  window.DGAArt = { markup: markup, paint: paint, MARK: MARK };
})();
