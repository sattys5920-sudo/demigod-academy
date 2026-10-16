#!/usr/bin/env python3
"""받아 온 시트를 칸으로 잘라 카드 그림으로 넣는다.

   art/sheets/sheet-01.png … sheet-14.png   ← 생성형에서 받은 것을 여기 둔다
        ↓
   art/cards/<카드 id>.webp                 ← 잘린 낱장
   data/cards.json 의 art 경로                ← 여기까지 적어 준다

       python3 art/slice.py            전부 자른다
       python3 art/slice.py 3 7        3번·7번 시트만 다시 자른다

   칸 차례는 art/PROMPTS.md 의 '칸 차례' 줄과 같다 — 시트를 만든 그
   build.py 가 같은 규칙으로 정하므로 둘이 어긋날 일이 없다.

   한 칸만 망가져 나왔으면 그 카드만 낱장으로 다시 뽑아
   art/cards/<카드 id>.png 로 덮어쓰면 된다. 이 스크립트는 이미 있는
   낱장을 덮어쓰지 않는다(--force 를 주면 덮어쓴다).

   필요: Pillow (pip install pillow)
"""

import io, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHEETS = os.path.join(ROOT, "art/sheets")
CARDS = os.path.join(ROOT, "art/cards")
GRID = 3                 # 3×3
GUTTER = 0.035           # 칸 사이 여백으로 잡아먹힌 비율 — 가장자리를 조금 깎는다
OUT = 512                # 낱장 한 변


def main():
    try:
        from PIL import Image
    except ImportError:
        sys.exit("Pillow 가 필요하다:  pip install pillow")

    sys.path.insert(0, os.path.join(ROOT, "art"))
    import build

    cards = json.load(io.open(os.path.join(ROOT, "data/cards.json"), encoding="utf-8"))
    by_id = {c["id"]: c for c in cards["cards"]}
    plan = build.sheets(cards["cards"])

    force = "--force" in sys.argv
    only = {int(a) for a in sys.argv[1:] if a.isdigit()}

    os.makedirs(CARDS, exist_ok=True)
    made, skipped, missing = 0, 0, []

    for n, (_tag, group) in enumerate(plan, 1):
        if only and n not in only:
            continue
        src = None
        for ext in (".png", ".jpg", ".jpeg", ".webp"):
            p = os.path.join(SHEETS, "sheet-%02d%s" % (n, ext))
            if os.path.exists(p):
                src = p
                break
        if not src:
            missing.append(n)
            continue

        im = Image.open(src).convert("RGB")
        # 시트가 정사각이 아니면 가운데를 정사각으로 잡는다
        w, h = im.size
        side = min(w, h)
        im = im.crop(((w - side) // 2, (h - side) // 2,
                      (w - side) // 2 + side, (h - side) // 2 + side))
        cell = side / GRID
        pad = cell * GUTTER

        for i, card in enumerate(group):
            r, c = divmod(i, GRID)
            box = (int(c * cell + pad), int(r * cell + pad),
                   int((c + 1) * cell - pad), int((r + 1) * cell - pad))
            out = os.path.join(CARDS, card["id"] + ".webp")
            png = os.path.join(CARDS, card["id"] + ".png")
            if os.path.exists(png) and not force:
                skipped += 1          # 손으로 갈아끼운 낱장은 건드리지 않는다
                continue
            if os.path.exists(out) and not force:
                skipped += 1
                continue
            im.crop(box).resize((OUT, OUT), Image.LANCZOS).save(out, "WEBP", quality=88)
            made += 1

    # cards.json 에 경로를 적는다 — 파일이 실제로 있는 것만.
    wired = 0
    for c in cards["cards"]:
        for ext in (".png", ".webp"):          # 손으로 덮어쓴 png 가 우선이다
            if os.path.exists(os.path.join(CARDS, c["id"] + ext)):
                path = "art/cards/" + c["id"] + ext
                if c.get("art") != path:
                    c["art"] = path
                    wired += 1
                break
        else:
            c.pop("art", None)                 # 파일이 없으면 문장으로 돌아간다

    io.open(os.path.join(ROOT, "data/cards.json"), "w", encoding="utf-8").write(
        json.dumps(cards, ensure_ascii=False, indent=2))

    print("잘랐다 %d · 건너뜀 %d · 경로 적음 %d" % (made, skipped, wired))
    if missing:
        print("시트가 없다: " + ", ".join("sheet-%02d" % n for n in missing))
        print("  art/sheets/ 에 넣고 다시 돌려라.")


if __name__ == "__main__":
    main()
