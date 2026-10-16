#!/usr/bin/env python3
"""카드 그림 프롬프트를 짓는다.

   data/cards.json 의 114장 × art/subjects.json 의 주제를 엮어서

     art/prompts.json  기계용 — {id, name, prompt} 114개. 배치 돌릴 때 쓴다.
     art/PROMPTS.md    사람용 — 시트 프롬프트 14개 + 낱장 프롬프트 114개.

   카드 데이터가 바뀌면 이 스크립트를 다시 돌리면 된다.
   python3 art/build.py        (레포 뿌리에서)
"""

import json, io, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── 화풍 ────────────────────────────────────────────────────
# 앱이 이미 쓰고 있는 것과 같은 규칙이다. 색은 네 가지뿐이고, 등급이
# 그중 강조색 하나를 정한다. 그림이 이 규칙 밖으로 나가면 앱에 얹었을 때
# 혼자 떠 보인다.
STYLE = (
 "Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of "
 "Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat "
 "fills, visible halftone dot texture and fine diagonal screen-print lines. "
 "STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, "
 "and one accent {ACCENT}. No other hues. No gradients, no soft shading, no glow, "
 "no 3D render, no photographic lighting. "
 "Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. "
 "One subject, centred, filling the frame and cropped by the edges. "
 "Ancient Greek mythology. "
 "{FIELD} "
 "No text, no letters, no numbers, no logo, no signature, no watermark, no border, "
 "no card frame, no UI. Square 1:1 format, flat background, full bleed."
)

ACCENT = {
    1: "bone white only — the accent is the SAME white #F2EDF5, so this piece is "
       "two-tone black and white",
    2: "warm gold #FFC53D",
    3: "hot crimson #FF2B3E",
}

# 원소마다 배경 무늬를 다르게 — 앱 안에서 쓰는 무늬와 같은 약속이다.
FIELD = {
    "bolt":  "Background motif: sparse jagged lightning zigzags.",
    "water": "Background motif: sparse rolling wave lines.",
    "fire":  "Background motif: sparse rising flame tongues.",
    "earth": "Background motif: sparse stacked stone-brick courses.",
    "wind":  "Background motif: sparse spiral gust curls.",
    None:    "Background motif: sparse parallel diagonal stripes.",
}

GRADE_NOTE = {
    1: "Quiet, grounded, everyday scale.",
    2: "Confident and forceful.",
    3: "Monumental and overwhelming — this is the rarest card in the set.",
}


def prompt_for(card, subject):
    return (STYLE
            .replace("{ACCENT}", ACCENT[card["grade"]])
            .replace("{FIELD}", FIELD.get(card["element"], FIELD[None]))
            + " Subject: " + subject + ". " + GRADE_NOTE[card["grade"]])


def sheets(cards, per=9):
    """등급끼리 묶어 한 시트에 강조색이 하나만 오게 한다.

       '색은 세 가지뿐' 이 이 화풍의 전부인데, 한 장 안에 흰·금·빨강이
       섞여 있으면 모델이 그 지시를 흘리고 색이 번진다. 등급으로 묶으면
       '이 그림은 전부 금색' 한 마디로 끝난다. 덤으로 같은 등급끼리는
       기세도 비슷해서(★1 잔잔 / ★3 압도) 한 장이 고르게 나온다."""
    out = []
    for g in (1, 2, 3):
        same = [c for c in cards if c["grade"] == g]
        if not same: continue
        # 9로 딱 자르면 마지막에 한 칸짜리 시트가 남는다. 장수를 먼저 정하고
        # 고르게 나눈다 — 55장이면 8·8·8·8·8·8·7 이지 9×6+1 이 아니다.
        n = -(-len(same) // per)
        base, rest, i = len(same) // n, len(same) % n, 0
        for k in range(n):
            take = base + (1 if k < rest else 0)
            out.append(("★%d" % g, same[i:i + take]))
            i += take
    return out


def main():
    cards = json.load(io.open(os.path.join(ROOT, "data/cards.json"), encoding="utf-8"))["cards"]
    subj = json.load(io.open(os.path.join(ROOT, "art/subjects.json"), encoding="utf-8"))

    missing = [c["id"] for c in cards if c["id"] not in subj]
    if missing:
        sys.exit("주제가 없는 카드: " + ", ".join(missing))

    rows = [{"id": c["id"], "name": c["name"], "grade": c["grade"],
             "prompt": prompt_for(c, subj[c["id"]])} for c in cards]
    io.open(os.path.join(ROOT, "art/prompts.json"), "w", encoding="utf-8").write(
        json.dumps(rows, ensure_ascii=False, indent=1))

    md = ["# 카드 그림 프롬프트",
          "",
          "`python3 art/build.py` 가 지은 것이다. 손으로 고치지 말고 "
          "`art/subjects.json` 을 고친 뒤 다시 돌려라.",
          "",
          "## 어떻게 쓰나",
          "",
          "두 갈래가 있다.",
          "",
          "**A. 시트로 받기 (권장 — %d번만 돌리면 된다)**" % len(sheets(cards)),
          "",
          "아래 *시트 프롬프트* 를 하나씩 넣어 **정사각 이미지 한 장**을 받는다. "
          "한 장에 3×3 아홉 칸이 들어 있다. 받은 파일을 "
          "`art/sheets/sheet-01.png` … 로 저장하고 `python3 art/slice.py` 를 돌리면 "
          "칸을 잘라 카드별 파일로 넣고 `data/cards.json` 에 경로까지 적는다.",
          "",
          "칸 몇 개가 망가져 나오면 그 카드만 *낱장 프롬프트* 로 다시 뽑아 "
          "`art/cards/<카드id>.png` 로 덮어쓰면 된다.",
          "",
          "**B. 낱장으로 받기 (114번 — 품질은 가장 좋다)**",
          "",
          "*낱장 프롬프트* 를 그대로 쓴다. 배치 도구가 있으면 "
          "`art/prompts.json` 을 먹이면 된다.",
          "",
          "## 지켜야 하는 것",
          "",
          "- **색은 네 가지뿐이다.** 검정 `#0B0910` · 흰색 `#F2EDF5` · "
          "금색 `#FFC53D` · 빨강 `#FF2B3E`. 강조색은 **등급이 정한다** — "
          "★1 흰색 / ★2 금색 / ★3 빨강. 앱의 다른 화면이 같은 약속을 쓰고 있어서, "
          "여기서 색이 늘면 그림만 혼자 떠 보인다.",
          "- **정사각으로 받는다.** 앱의 그림칸은 4:3 이고 가운데를 잘라 쓴다. "
          "인물은 가운데에, 중요한 것은 가장자리 12% 안쪽에 두게 한다.",
          "- **글자가 들어가면 안 된다.** 카드 이름·수치는 앱이 그린다.",
          "- **테두리·카드틀이 들어가면 안 된다.** 틀도 앱이 그린다.",
          ""]

    md += ["## 시트 프롬프트", ""]
    ACC_SHORT = {1: "bone white only (two-tone black and white)",
                 2: "warm gold #FFC53D",
                 3: "hot crimson #FF2B3E"}
    for i, (tag, group) in enumerate(sheets(cards), 1):
        # 아홉 칸이 같이 쓰는 값은 한 번만 말한다. 칸마다 되풀이하면
        # 모델이 지시를 흘린다.
        one_acc = len({c["grade"] for c in group}) == 1
        one_fld = len({c["element"] for c in group}) == 1
        one_note = one_acc

        shared = (STYLE
                  .replace("{ACCENT}", ACC_SHORT[group[0]["grade"]] if one_acc
                           else "the accent named for that cell")
                  .replace("{FIELD}", FIELD.get(group[0]["element"], FIELD[None]) if one_fld
                           else "Background motif as named for each cell.")
                  .replace("Square 1:1 format, flat background, full bleed.",
                           "Each cell is flat and full-bleed inside its own cell."))

        md += ["### 시트 %02d · %s (%d칸)" % (i, tag, len(group)), "", "```"]
        md += ["One square image: a 3x3 grid of NINE separate illustrations, divided by "
               "thick flat black gutters. Each cell is its own complete picture — no "
               "subject may cross a gutter. Cells are numbered 1-9 in reading order: "
               "1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.",
               "",
               "Style — applies to every cell:",
               shared]
        if one_note:
            md += ["", GRADE_NOTE[group[0]["grade"]]]
        md += ["", "Cells:"]
        for n, c in enumerate(group, 1):
            bits = [subj[c["id"]]]
            if not one_fld: bits.append(FIELD.get(c["element"], FIELD[None]).replace("Background motif: ", "background ").rstrip("."))
            if not one_acc: bits.append("accent " + ACC_SHORT[c["grade"]])
            if not one_note: bits.append(GRADE_NOTE[c["grade"]].rstrip("."))
            md.append("%d. %s." % (n, " — ".join(bits)))
        if len(group) < 9:
            md.append("%d-9. Leave empty: plain near-black #0B0910, nothing in them."
                      % (len(group) + 1))
        md += ["```", "",
               "칸 차례 → " + " · ".join("%d.%s" % (n, c["name"])
                                        for n, c in enumerate(group, 1)),
               ""]

    md += ["## 낱장 프롬프트", ""]
    for r in rows:
        md += ["### `%s` — %s (★%d)" % (r["id"], r["name"], r["grade"]), "",
               "```", r["prompt"], "```", ""]

    io.open(os.path.join(ROOT, "art/PROMPTS.md"), "w", encoding="utf-8").write("\n".join(md))
    print("카드 %d장 · 시트 %d장 → art/PROMPTS.md · art/prompts.json"
          % (len(rows), len(sheets(cards))))


if __name__ == "__main__":
    main()
