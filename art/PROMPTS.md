# 카드 그림 프롬프트

`python3 art/build.py` 가 지은 것이다. 손으로 고치지 말고 `art/subjects.json` 을 고친 뒤 다시 돌려라.

## 어떻게 쓰나

두 갈래가 있다.

**A. 시트로 받기 (권장 — 14번만 돌리면 된다)**

아래 *시트 프롬프트* 를 하나씩 넣어 **정사각 이미지 한 장**을 받는다. 한 장에 3×3 아홉 칸이 들어 있다. 받은 파일을 `art/sheets/sheet-01.png` … 로 저장하고 `python3 art/slice.py` 를 돌리면 칸을 잘라 카드별 파일로 넣고 `data/cards.json` 에 경로까지 적는다.

칸 몇 개가 망가져 나오면 그 카드만 *낱장 프롬프트* 로 다시 뽑아 `art/cards/<카드id>.png` 로 덮어쓰면 된다.

**B. 낱장으로 받기 (114번 — 품질은 가장 좋다)**

*낱장 프롬프트* 를 그대로 쓴다. 배치 도구가 있으면 `art/prompts.json` 을 먹이면 된다.

## 지켜야 하는 것

- **색은 네 가지뿐이다.** 검정 `#0B0910` · 흰색 `#F2EDF5` · 금색 `#FFC53D` · 빨강 `#FF2B3E`. 강조색은 **등급이 정한다** — ★1 흰색 / ★2 금색 / ★3 빨강. 앱의 다른 화면이 같은 약속을 쓰고 있어서, 여기서 색이 늘면 그림만 혼자 떠 보인다.
- **정사각으로 받는다.** 앱의 그림칸은 4:3 이고 가운데를 잘라 쓴다. 인물은 가운데에, 중요한 것은 가장자리 12% 안쪽에 두게 한다.
- **글자가 들어가면 안 된다.** 카드 이름·수치는 앱이 그린다.
- **테두리·카드틀이 들어가면 안 된다.** 틀도 앱이 그린다.

## 시트 프롬프트

### 시트 01 · ★1 (9칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only (two-tone black and white). No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Quiet, grounded, everyday scale.

Cells:
1. a satyr with shaggy goat legs and small curled horns, mid-dance, playing a reed pipe.
2. a woodland nymph stepping out of a laurel trunk, hair streaming like leaves.
3. a centaur rearing on its hind legs, drawing a short recurve bow.
4. a harpy with vast ragged wings and hooked talons, screaming mid-dive.
5. a siren perched on a sea rock, bird-bodied, mouth open in song.
6. a one-eyed cyclops heaving a boulder above its head.
7. a minotaur lowering its massive bull horns to charge.
8. a dryad whose arms split into oak limbs, feet rooted into the ground.
9. a faun with slender horns, crouched and alert in tall grass.
```

칸 차례 → 1.사티로스 · 2.님프 · 3.켄타우로스 · 4.하르피이아 · 5.세이렌 · 6.키클롭스 · 7.미노타우로스 · 8.드리아드 · 9.파우누스

### 시트 02 · ★1 (9칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only (two-tone black and white). No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Quiet, grounded, everyday scale.

Cells:
1. a lamia, woman above and a great serpent coil below, rising up.
2. an empusa with one bronze leg and one donkey leg, hair burning.
3. a triton merman blowing a spiral conch horn, fish tail curling behind.
4. a nereid sea-nymph riding the crest of a breaking wave, arms spread.
5. a gorgon crowned with writhing snakes, caught mid-stare.
6. a sphinx with a lion's body and feathered wings, seated, posing a riddle.
7. a laurel victory wreath resting on an empty marble pedestal.
8. a single olive branch heavy with fruit, held out in offering.
9. an ancient tortoise-shell lyre, its strings still vibrating.
```

칸 차례 → 1.라미아 · 2.엠푸사 · 3.트리톤 · 4.네레이드 · 5.고르곤 · 6.스핑크스 · 7.월계관 · 8.올리브 가지 · 9.리라

### 시트 03 · ★1 (8칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only (two-tone black and white). No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif as named for each cell. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Quiet, grounded, everyday scale.

Cells:
1. a sealed clay amphora of ambrosia, divine vapour curling from its mouth — background sparse parallel diagonal stripes.
2. a shallow kylix cup brimming with nectar, one drop falling from the rim — background sparse parallel diagonal stripes.
3. a ball of thread unspooling away into a labyrinth corridor — background sparse parallel diagonal stripes.
4. a single worn obol coin held between two fingers above black water — background sparse parallel diagonal stripes.
5. a young demigod gripping a crackling lightning bolt in both hands, chiton whipping in the wind — background sparse jagged lightning zigzags.
6. two hands clasped over a plain gold ring, an oath being bound — background sparse jagged lightning zigzags.
7. a young demigod standing calf-deep in surf, a small wave curling up at their call — background sparse rolling wave lines.
8. a young demigod cradling a sheaf of wheat, barefoot in a ploughed furrow — background sparse stacked stone-brick courses.
9-9. Leave empty: plain near-black #0B0910, nothing in them.
```

칸 차례 → 1.암브로시아 · 2.넥타르 · 3.아리아드네의 실 · 4.스틱스의 뱃삯 · 5.번개를 쥔 아이 · 6.맹세의 반지 · 7.파도의 아이 · 8.이삭을 든 아이

### 시트 04 · ★1 (8칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only (two-tone black and white). No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif as named for each cell. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Quiet, grounded, everyday scale.

Cells:
1. a young demigod with a small owl on their shoulder, holding a wax writing tablet — background sparse jagged lightning zigzags.
2. a young demigod haloed in hard sunrays, a small lyre under one arm — background sparse rising flame tongues.
3. a young demigod beneath a crescent moon, a hound pressed to their heel — background sparse spiral gust curls.
4. a young demigod clenching a notched short sword, jaw set hard — background sparse rising flame tongues.
5. a young demigod stepping out of sea-foam onto a shell-strewn shore — background sparse rolling wave lines.
6. a soot-faced young smith cupping a stolen ember in both hands — background sparse rising flame tongues.
7. a young messenger mid-run, winged sandals, a sealed scroll in one hand — background sparse spiral gust curls.
8. a young demigod in a vine wreath, holding up a heavy bunch of grapes — background sparse stacked stone-brick courses.
9-9. Leave empty: plain near-black #0B0910, nothing in them.
```

칸 차례 → 1.올빼미의 아이 · 2.햇살의 아이 · 3.달빛의 아이 · 4.분노의 아이 · 5.거품의 아이 · 6.카일 · 불씨 도둑 · 7.이즈미 · 전령의 딸 · 8.포도의 아이

### 시트 05 · ★2 (8칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif as named for each cell. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Confident and forceful.

Cells:
1. the Golden Fleece hung on an oak bough, a coiled serpent guarding it — background sparse parallel diagonal stripes.
2. Pandora's jar with the lid ajar, a thin stream of shadow escaping — background sparse parallel diagonal stripes.
3. Cerberus, three snarling hound heads straining against one chain — background sparse parallel diagonal stripes.
4. a chimera — lion in front, goat rising from its back, serpent for a tail — background sparse parallel diagonal stripes.
5. a many-necked hydra, two new heads bursting from a severed stump — background sparse parallel diagonal stripes.
6. a griffin with an eagle's head and a lion's haunches, wings flared wide — background sparse parallel diagonal stripes.
7. a small figure half dissolved into drifting mist, only the eyes still sharp — background sparse parallel diagonal stripes.
8. a great eagle's head in close profile, one unblinking eye filling the frame — background sparse jagged lightning zigzags.
9-9. Leave empty: plain near-black #0B0910, nothing in them.
```

칸 차례 → 1.황금 양털 · 2.판도라의 상자 · 3.케르베로스 · 4.키마이라 · 5.히드라 · 6.그리핀 · 7.미르 · 안개의 아이 · 8.독수리의 눈

### 시트 06 · ★2 (8칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif as named for each cell. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Confident and forceful.

Cells:
1. a thunderbolt striking a pair of scales from directly above — background sparse jagged lightning zigzags.
2. a peacock fanning its full tail, every eye-spot open and staring — background sparse jagged lightning zigzags.
3. a knotted cord drawing tight around a wedding crown — background sparse jagged lightning zigzags.
4. a sea-born youth with braided kelp hair riding a dolphin through spray — background sparse rolling wave lines.
5. a trident driven into the seabed, cracks radiating out through the stone — background sparse rolling wave lines.
6. a harvest basket overflowing with grain and split pomegranates — background sparse stacked stone-brick courses.
7. a barren field under a frozen sky, one dead stalk still standing — background sparse stacked stone-brick courses.
8. a keen-eyed young scout in a crested helm, an owl's wings spread behind them — background sparse jagged lightning zigzags.
9-9. Leave empty: plain near-black #0B0910, nothing in them.
```

칸 차례 → 1.하늘의 재판 · 2.공작의 눈 · 3.질투의 서약 · 4.네레오 · 파도의 아들 · 5.흔들리는 땅 · 6.첫 수확 · 7.돌아오지 않는 계절 · 8.세리 · 올빼미의 눈

### 시트 07 · ★2 (8칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif as named for each cell. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Confident and forceful.

Cells:
1. a loom whose woven cloth turns into a spider's web — background sparse jagged lightning zigzags.
2. a hand plucking a lyre string, the note drawn as a shockwave — background sparse rising flame tongues.
3. a priestess over a smoking fissure, mouth open, laurel smoke coiling around her — background sparse rising flame tongues.
4. a hunter at full draw, arrow nocked, eye sighting along the shaft — background sparse spiral gust curls.
5. a hunting hound's head low to the ground, scenting, ears pricked forward — background sparse spiral gust curls.
6. a fury with blood-red hands and a knotted whip, wings of torn shadow — background sparse rising flame tongues.
7. a spear driven clean through a shield, still quivering — background sparse rising flame tongues.
8. a great open scallop shell, a whisper leaving it drawn as spreading ripples — background sparse rolling wave lines.
9-9. Leave empty: plain near-black #0B0910, nothing in them.
```

칸 차례 → 1.짜인 계략 · 2.리라의 현 · 3.예언의 혀 · 4.시위를 당긴 손 · 5.사냥개의 코 · 6.알렉토 · 붉은 손 · 7.멎지 않는 창 · 8.조개의 속삭임

### 시트 08 · ★2 (8칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif as named for each cell. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Confident and forceful.

Cells:
1. an embroidered golden girdle floating in air, knotted with doves — background sparse rolling wave lines.
2. a massive smith's hammer at rest on an anvil, sparks still hanging in the air — background sparse rising flame tongues.
3. a bronze automaton servant of riveted plates, seams glowing from within — background sparse rising flame tongues.
4. a winged-heeled god leaping between clouds, caduceus in hand — background sparse spiral gust curls.
5. a herd of cattle led away backwards, every hoofprint pointing the wrong way — background sparse spiral gust curls.
6. a kantharos cup that will not empty, wine spilling endlessly over its lip — background sparse stacked stone-brick courses.
7. a maenad procession whirling with thyrsus staves, faces lost in frenzy — background sparse stacked stone-brick courses.
8. a messenger arriving at last, dust-caked, holding a sealed letter high — background sparse spiral gust curls.
9-9. Leave empty: plain near-black #0B0910, nothing in them.
```

칸 차례 → 1.매혹의 띠 · 2.망치의 무게 · 3.자동인형 · 4.날개 달린 신 · 5.훔친 소떼 · 6.끝나지 않는 잔 · 7.광기의 행렬 · 8.돌아온 전령

### 시트 09 · ★2 (8칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif as named for each cell. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Confident and forceful.

Cells:
1. a dead signal tower, beacon cold, severed cables hanging loose — background sparse spiral gust curls.
2. a field of blackened wheat with one stalk still gold — background sparse stacked stone-brick courses.
3. wheat grown monstrously tall, swallowing a city's rooftops — background sparse stacked stone-brick courses.
4. a silent workshop, every machine stopped mid-motion — background sparse rising flame tongues.
5. mass-produced bronze figures walking in lockstep off the line — background sparse rising flame tongues.
6. a wave frozen mid-break, the water hanging perfectly still — background sparse rolling wave lines.
7. a new coastline cut straight through an inland city, waves at the doors — background sparse rolling wave lines.
8. the sun rising seventeen minutes late over a waiting city — background sparse rising flame tongues.
9-9. Leave empty: plain near-black #0B0910, nothing in them.
```

칸 차례 → 1.도착하지 않은 신호 · 2.검은 밀 · 3.도시를 덮은 밀 · 4.멎은 공방 · 5.걸어 다니는 공산품 · 6.멎은 파도 · 7.내륙의 해안선 · 8.17분 늦은 해

### 시트 10 · ★2 (8칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif as named for each cell. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Confident and forceful.

Cells:
1. every clock in a public square stopped at 5:17 — background sparse rising flame tongues.
2. two moons merging back into a single disc — background sparse spiral gust curls.
3. a city that lost a day — calendars torn, streets emptied — background sparse spiral gust curls.
4. a battle line gone still, spears lowered into the dust — background sparse rising flame tongues.
5. war fronts drawn across every continent of a cracked globe — background sparse rising flame tongues.
6. a name spoken again, drawn as ripples crossing still water — background sparse rolling wave lines.
7. the last generation — one figure alone in an empty amphitheatre — background sparse rolling wave lines.
8. a city waking at last, every shutter thrown open — background sparse stacked stone-brick courses.
9-9. Leave empty: plain near-black #0B0910, nothing in them.
```

칸 차례 → 1.5시 17분 · 2.하나가 된 달 · 3.하루를 잃은 도시 · 4.멎은 전선 · 5.모든 대륙의 전선 · 6.다시 불린 이름 · 7.마지막 세대 · 8.깨어난 아침

### 시트 11 · ★2 (7칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif as named for each cell. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Confident and forceful.

Cells:
1. the last one awake among sleeping crowds — background sparse stacked stone-brick courses.
2. a restored library shelf, books back in order, one still glowing — background sparse jagged lightning zigzags.
3. an open chronicle with every page blank — background sparse jagged lightning zigzags.
4. an oath re-tied — a knotted cord pulled fast around two rings — background sparse jagged lightning zigzags.
5. an unravelled knot, the cord ends drifting apart — background sparse jagged lightning zigzags.
6. someone seated on the empty throne of Olympus, face lost in shadow — background sparse jagged lightning zigzags.
7. a sky with no master, storms colliding unchecked — background sparse jagged lightning zigzags.
8-9. Leave empty: plain near-black #0B0910, nothing in them.
```

칸 차례 → 1.마지막으로 깨어 있는 자 · 2.복구된 서가 · 3.빈 연대기 · 4.다시 묶인 맹세 · 5.풀린 매듭 · 6.빈 왕좌에 앉은 자 · 7.주인 없는 하늘

### 시트 12 · ★3 (9칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif as named for each cell. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Monumental and overwhelming — this is the rarest card in the set.

Cells:
1. a solemn young gatekeeper of the underworld in a dark himation, a heavy key ring in hand, standing before a black doorway — background sparse parallel diagonal stripes.
2. an immense empty marble throne on a cloud summit, lightning arcing across its back — background sparse jagged lightning zigzags.
3. a regal queen crowned in gold, peacock feathers rising behind her like a throne — background sparse jagged lightning zigzags.
4. the lord of the sea rising from a towering wave, trident raised, storm at his back — background sparse rolling wave lines.
5. the mother of the earth, wheat crown, arms open as fields surge up around her — background sparse stacked stone-brick courses.
6. a tall spear and an aegis shield crossed in front of an olive tree — background sparse jagged lightning zigzags.
7. a charioteer driving four flame-maned horses across the sky, sun disc behind them — background sparse rising flame tongues.
8. the moon huntress mid-leap, bow drawn, a blazing crescent behind her — background sparse spiral gust curls.
9. the lord of battle astride a war-horse over a field of broken spears — background sparse rising flame tongues.
```

칸 차례 → 1.하윤 · 명계의 문지기 · 2.올림포스의 왕좌 · 3.왕관을 쓴 자 · 4.바다의 주인 · 5.대지의 어머니 · 6.지혜의 창 · 7.태양을 모는 자 · 8.달의 사냥꾼 · 9.전장의 주인

### 시트 13 · ★3 (8칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif as named for each cell. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Monumental and overwhelming — this is the rarest card in the set.

Cells:
1. a goddess holding out a golden apple, three shadowed hands reaching for it — background sparse rolling wave lines.
2. the master smith at the forge, hammer raised, molten metal spraying — background sparse rising flame tongues.
3. the lord of roads at a crossroads cairn, countless paths radiating out behind him — background sparse spiral gust curls.
4. the lord of revels enthroned on a wine barrel, vines erupting around him — background sparse stacked stone-brick courses.
5. one restored line — a single live cable strung between two distant towers — background sparse spiral gust curls.
6. the year's first sheaf raised against a clearing sky — background sparse stacked stone-brick courses.
7. an order slip burning at the edges, forge-light behind it — background sparse rising flame tongues.
8. a great key lifted out of drowned streets, water streaming off it — background sparse rolling wave lines.
9-9. Leave empty: plain near-black #0B0910, nothing in them.
```

칸 차례 → 1.사랑의 심판 · 2.공방의 주인 · 3.길의 주인 · 4.축제의 주인 · 5.첫 번째 회선 · 6.그해의 첫 수확 · 7.주문서 · 8.잠긴 도시의 열쇠

### 시트 14 · ★3 (8칸)

```
One square image: a 3x3 grid of NINE separate illustrations, divided by thick flat black gutters. Each cell is its own complete picture — no subject may cross a gutter. Cells are numbered 1-9 in reading order: 1-2-3 across the top row, 4-5-6 the middle, 7-8-9 the bottom.

Style — applies to every cell:
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif as named for each cell. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Each cell is flat and full-bleed inside its own cell.

Monumental and overwhelming — this is the rarest card in the set.

Cells:
1. the first true morning, hard sunrays breaking over rooftops — background sparse rising flame tongues.
2. the true moon restored, vast and knife-sharp above the hunt — background sparse spiral gust curls.
3. an unexplained peace — weapons laid down in an empty field — background sparse rising flame tongues.
4. the most-spoken word blooming outward in hard rings of light — background sparse rolling wave lines.
5. a dream nobody remembers, dissolving into vine and smoke — background sparse stacked stone-brick courses.
6. one restored line of text burning on an open page — background sparse jagged lightning zigzags.
7. a contract nobody knows, sealed and lying face-down — background sparse jagged lightning zigzags.
8. the sky returned — clouds parting above a restored throne — background sparse jagged lightning zigzags.
9-9. Leave empty: plain near-black #0B0910, nothing in them.
```

칸 차례 → 1.첫 아침 · 2.진짜 달 · 3.설명되지 않은 평화 · 4.가장 많이 불린 말 · 5.기억나지 않는 꿈 · 6.돌아온 한 줄 · 7.아무도 모르는 계약 · 8.돌아온 하늘

## 낱장 프롬프트

### `cm-01` — 사티로스 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a satyr with shaggy goat legs and small curled horns, mid-dance, playing a reed pipe. Quiet, grounded, everyday scale.
```

### `cm-02` — 님프 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a woodland nymph stepping out of a laurel trunk, hair streaming like leaves. Quiet, grounded, everyday scale.
```

### `cm-03` — 켄타우로스 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a centaur rearing on its hind legs, drawing a short recurve bow. Quiet, grounded, everyday scale.
```

### `cm-04` — 하르피이아 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a harpy with vast ragged wings and hooked talons, screaming mid-dive. Quiet, grounded, everyday scale.
```

### `cm-05` — 세이렌 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a siren perched on a sea rock, bird-bodied, mouth open in song. Quiet, grounded, everyday scale.
```

### `cm-06` — 키클롭스 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a one-eyed cyclops heaving a boulder above its head. Quiet, grounded, everyday scale.
```

### `cm-07` — 미노타우로스 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a minotaur lowering its massive bull horns to charge. Quiet, grounded, everyday scale.
```

### `cm-08` — 드리아드 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a dryad whose arms split into oak limbs, feet rooted into the ground. Quiet, grounded, everyday scale.
```

### `cm-09` — 파우누스 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a faun with slender horns, crouched and alert in tall grass. Quiet, grounded, everyday scale.
```

### `cm-10` — 라미아 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a lamia, woman above and a great serpent coil below, rising up. Quiet, grounded, everyday scale.
```

### `cm-11` — 엠푸사 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: an empusa with one bronze leg and one donkey leg, hair burning. Quiet, grounded, everyday scale.
```

### `cm-12` — 트리톤 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a triton merman blowing a spiral conch horn, fish tail curling behind. Quiet, grounded, everyday scale.
```

### `cm-13` — 네레이드 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a nereid sea-nymph riding the crest of a breaking wave, arms spread. Quiet, grounded, everyday scale.
```

### `cm-14` — 고르곤 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a gorgon crowned with writhing snakes, caught mid-stare. Quiet, grounded, everyday scale.
```

### `cm-15` — 스핑크스 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a sphinx with a lion's body and feathered wings, seated, posing a riddle. Quiet, grounded, everyday scale.
```

### `cm-16` — 월계관 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a laurel victory wreath resting on an empty marble pedestal. Quiet, grounded, everyday scale.
```

### `cm-17` — 올리브 가지 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a single olive branch heavy with fruit, held out in offering. Quiet, grounded, everyday scale.
```

### `cm-18` — 리라 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: an ancient tortoise-shell lyre, its strings still vibrating. Quiet, grounded, everyday scale.
```

### `cm-19` — 암브로시아 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a sealed clay amphora of ambrosia, divine vapour curling from its mouth. Quiet, grounded, everyday scale.
```

### `cm-20` — 넥타르 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a shallow kylix cup brimming with nectar, one drop falling from the rim. Quiet, grounded, everyday scale.
```

### `cm-21` — 아리아드네의 실 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a ball of thread unspooling away into a labyrinth corridor. Quiet, grounded, everyday scale.
```

### `cm-22` — 스틱스의 뱃삯 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a single worn obol coin held between two fingers above black water. Quiet, grounded, everyday scale.
```

### `cm-23` — 황금 양털 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the Golden Fleece hung on an oak bough, a coiled serpent guarding it. Confident and forceful.
```

### `cm-24` — 판도라의 상자 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: Pandora's jar with the lid ajar, a thin stream of shadow escaping. Confident and forceful.
```

### `cm-25` — 케르베로스 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: Cerberus, three snarling hound heads straining against one chain. Confident and forceful.
```

### `cm-26` — 키마이라 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a chimera — lion in front, goat rising from its back, serpent for a tail. Confident and forceful.
```

### `cm-27` — 히드라 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a many-necked hydra, two new heads bursting from a severed stump. Confident and forceful.
```

### `cm-28` — 그리핀 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a griffin with an eagle's head and a lion's haunches, wings flared wide. Confident and forceful.
```

### `cm-29` — 하윤 · 명계의 문지기 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a solemn young gatekeeper of the underworld in a dark himation, a heavy key ring in hand, standing before a black doorway. Monumental and overwhelming — this is the rarest card in the set.
```

### `cm-30` — 미르 · 안개의 아이 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse parallel diagonal stripes. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a small figure half dissolved into drifting mist, only the eyes still sharp. Confident and forceful.
```

### `zeus-1` — 번개를 쥔 아이 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a young demigod gripping a crackling lightning bolt in both hands, chiton whipping in the wind. Quiet, grounded, everyday scale.
```

### `zeus-2` — 독수리의 눈 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a great eagle's head in close profile, one unblinking eye filling the frame. Confident and forceful.
```

### `zeus-3` — 하늘의 재판 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a thunderbolt striking a pair of scales from directly above. Confident and forceful.
```

### `zeus-4` — 올림포스의 왕좌 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: an immense empty marble throne on a cloud summit, lightning arcing across its back. Monumental and overwhelming — this is the rarest card in the set.
```

### `hera-1` — 맹세의 반지 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: two hands clasped over a plain gold ring, an oath being bound. Quiet, grounded, everyday scale.
```

### `hera-2` — 공작의 눈 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a peacock fanning its full tail, every eye-spot open and staring. Confident and forceful.
```

### `hera-3` — 질투의 서약 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a knotted cord drawing tight around a wedding crown. Confident and forceful.
```

### `hera-4` — 왕관을 쓴 자 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a regal queen crowned in gold, peacock feathers rising behind her like a throne. Monumental and overwhelming — this is the rarest card in the set.
```

### `poseidon-1` — 파도의 아이 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a young demigod standing calf-deep in surf, a small wave curling up at their call. Quiet, grounded, everyday scale.
```

### `poseidon-2` — 네레오 · 파도의 아들 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a sea-born youth with braided kelp hair riding a dolphin through spray. Confident and forceful.
```

### `poseidon-3` — 흔들리는 땅 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a trident driven into the seabed, cracks radiating out through the stone. Confident and forceful.
```

### `poseidon-4` — 바다의 주인 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the lord of the sea rising from a towering wave, trident raised, storm at his back. Monumental and overwhelming — this is the rarest card in the set.
```

### `demeter-1` — 이삭을 든 아이 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a young demigod cradling a sheaf of wheat, barefoot in a ploughed furrow. Quiet, grounded, everyday scale.
```

### `demeter-2` — 첫 수확 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a harvest basket overflowing with grain and split pomegranates. Confident and forceful.
```

### `demeter-3` — 돌아오지 않는 계절 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a barren field under a frozen sky, one dead stalk still standing. Confident and forceful.
```

### `demeter-4` — 대지의 어머니 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the mother of the earth, wheat crown, arms open as fields surge up around her. Monumental and overwhelming — this is the rarest card in the set.
```

### `athena-1` — 올빼미의 아이 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a young demigod with a small owl on their shoulder, holding a wax writing tablet. Quiet, grounded, everyday scale.
```

### `athena-2` — 세리 · 올빼미의 눈 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a keen-eyed young scout in a crested helm, an owl's wings spread behind them. Confident and forceful.
```

### `athena-3` — 짜인 계략 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a loom whose woven cloth turns into a spider's web. Confident and forceful.
```

### `athena-4` — 지혜의 창 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a tall spear and an aegis shield crossed in front of an olive tree. Monumental and overwhelming — this is the rarest card in the set.
```

### `apollo-1` — 햇살의 아이 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a young demigod haloed in hard sunrays, a small lyre under one arm. Quiet, grounded, everyday scale.
```

### `apollo-2` — 리라의 현 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a hand plucking a lyre string, the note drawn as a shockwave. Confident and forceful.
```

### `apollo-3` — 예언의 혀 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a priestess over a smoking fissure, mouth open, laurel smoke coiling around her. Confident and forceful.
```

### `apollo-4` — 태양을 모는 자 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a charioteer driving four flame-maned horses across the sky, sun disc behind them. Monumental and overwhelming — this is the rarest card in the set.
```

### `artemis-1` — 달빛의 아이 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a young demigod beneath a crescent moon, a hound pressed to their heel. Quiet, grounded, everyday scale.
```

### `artemis-2` — 시위를 당긴 손 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a hunter at full draw, arrow nocked, eye sighting along the shaft. Confident and forceful.
```

### `artemis-3` — 사냥개의 코 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a hunting hound's head low to the ground, scenting, ears pricked forward. Confident and forceful.
```

### `artemis-4` — 달의 사냥꾼 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the moon huntress mid-leap, bow drawn, a blazing crescent behind her. Monumental and overwhelming — this is the rarest card in the set.
```

### `ares-1` — 분노의 아이 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a young demigod clenching a notched short sword, jaw set hard. Quiet, grounded, everyday scale.
```

### `ares-2` — 알렉토 · 붉은 손 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a fury with blood-red hands and a knotted whip, wings of torn shadow. Confident and forceful.
```

### `ares-3` — 멎지 않는 창 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a spear driven clean through a shield, still quivering. Confident and forceful.
```

### `ares-4` — 전장의 주인 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the lord of battle astride a war-horse over a field of broken spears. Monumental and overwhelming — this is the rarest card in the set.
```

### `aphrodite-1` — 거품의 아이 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a young demigod stepping out of sea-foam onto a shell-strewn shore. Quiet, grounded, everyday scale.
```

### `aphrodite-2` — 조개의 속삭임 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a great open scallop shell, a whisper leaving it drawn as spreading ripples. Confident and forceful.
```

### `aphrodite-3` — 매혹의 띠 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: an embroidered golden girdle floating in air, knotted with doves. Confident and forceful.
```

### `aphrodite-4` — 사랑의 심판 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a goddess holding out a golden apple, three shadowed hands reaching for it. Monumental and overwhelming — this is the rarest card in the set.
```

### `hephaistos-1` — 카일 · 불씨 도둑 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a soot-faced young smith cupping a stolen ember in both hands. Quiet, grounded, everyday scale.
```

### `hephaistos-2` — 망치의 무게 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a massive smith's hammer at rest on an anvil, sparks still hanging in the air. Confident and forceful.
```

### `hephaistos-3` — 자동인형 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a bronze automaton servant of riveted plates, seams glowing from within. Confident and forceful.
```

### `hephaistos-4` — 공방의 주인 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the master smith at the forge, hammer raised, molten metal spraying. Monumental and overwhelming — this is the rarest card in the set.
```

### `hermes-1` — 이즈미 · 전령의 딸 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a young messenger mid-run, winged sandals, a sealed scroll in one hand. Quiet, grounded, everyday scale.
```

### `hermes-2` — 날개 달린 신 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a winged-heeled god leaping between clouds, caduceus in hand. Confident and forceful.
```

### `hermes-3` — 훔친 소떼 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a herd of cattle led away backwards, every hoofprint pointing the wrong way. Confident and forceful.
```

### `hermes-4` — 길의 주인 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the lord of roads at a crossroads cairn, countless paths radiating out behind him. Monumental and overwhelming — this is the rarest card in the set.
```

### `dionysos-1` — 포도의 아이 (★1)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent bone white only — the accent is the SAME white #F2EDF5, so this piece is two-tone black and white. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a young demigod in a vine wreath, holding up a heavy bunch of grapes. Quiet, grounded, everyday scale.
```

### `dionysos-2` — 끝나지 않는 잔 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a kantharos cup that will not empty, wine spilling endlessly over its lip. Confident and forceful.
```

### `dionysos-3` — 광기의 행렬 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a maenad procession whirling with thyrsus staves, faces lost in frenzy. Confident and forceful.
```

### `dionysos-4` — 축제의 주인 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the lord of revels enthroned on a wine barrel, vines erupting around him. Monumental and overwhelming — this is the rarest card in the set.
```

### `c01-win` — 돌아온 전령 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a messenger arriving at last, dust-caked, holding a sealed letter high. Confident and forceful.
```

### `c01-lose` — 도착하지 않은 신호 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a dead signal tower, beacon cold, severed cables hanging loose. Confident and forceful.
```

### `c01-perfect` — 첫 번째 회선 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: one restored line — a single live cable strung between two distant towers. Monumental and overwhelming — this is the rarest card in the set.
```

### `c02-win` — 검은 밀 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a field of blackened wheat with one stalk still gold. Confident and forceful.
```

### `c02-lose` — 도시를 덮은 밀 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: wheat grown monstrously tall, swallowing a city's rooftops. Confident and forceful.
```

### `c02-perfect` — 그해의 첫 수확 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the year's first sheaf raised against a clearing sky. Monumental and overwhelming — this is the rarest card in the set.
```

### `c03-win` — 멎은 공방 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a silent workshop, every machine stopped mid-motion. Confident and forceful.
```

### `c03-lose` — 걸어 다니는 공산품 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: mass-produced bronze figures walking in lockstep off the line. Confident and forceful.
```

### `c03-perfect` — 주문서 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: an order slip burning at the edges, forge-light behind it. Monumental and overwhelming — this is the rarest card in the set.
```

### `c04-win` — 멎은 파도 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a wave frozen mid-break, the water hanging perfectly still. Confident and forceful.
```

### `c04-lose` — 내륙의 해안선 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a new coastline cut straight through an inland city, waves at the doors. Confident and forceful.
```

### `c04-perfect` — 잠긴 도시의 열쇠 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a great key lifted out of drowned streets, water streaming off it. Monumental and overwhelming — this is the rarest card in the set.
```

### `c05-win` — 17분 늦은 해 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the sun rising seventeen minutes late over a waiting city. Confident and forceful.
```

### `c05-lose` — 5시 17분 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: every clock in a public square stopped at 5:17. Confident and forceful.
```

### `c05-perfect` — 첫 아침 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the first true morning, hard sunrays breaking over rooftops. Monumental and overwhelming — this is the rarest card in the set.
```

### `c06-win` — 하나가 된 달 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: two moons merging back into a single disc. Confident and forceful.
```

### `c06-lose` — 하루를 잃은 도시 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a city that lost a day — calendars torn, streets emptied. Confident and forceful.
```

### `c06-perfect` — 진짜 달 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse spiral gust curls. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the true moon restored, vast and knife-sharp above the hunt. Monumental and overwhelming — this is the rarest card in the set.
```

### `c07-win` — 멎은 전선 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a battle line gone still, spears lowered into the dust. Confident and forceful.
```

### `c07-lose` — 모든 대륙의 전선 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: war fronts drawn across every continent of a cracked globe. Confident and forceful.
```

### `c07-perfect` — 설명되지 않은 평화 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rising flame tongues. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: an unexplained peace — weapons laid down in an empty field. Monumental and overwhelming — this is the rarest card in the set.
```

### `c08-win` — 다시 불린 이름 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a name spoken again, drawn as ripples crossing still water. Confident and forceful.
```

### `c08-lose` — 마지막 세대 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the last generation — one figure alone in an empty amphitheatre. Confident and forceful.
```

### `c08-perfect` — 가장 많이 불린 말 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse rolling wave lines. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the most-spoken word blooming outward in hard rings of light. Monumental and overwhelming — this is the rarest card in the set.
```

### `c09-win` — 깨어난 아침 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a city waking at last, every shutter thrown open. Confident and forceful.
```

### `c09-lose` — 마지막으로 깨어 있는 자 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the last one awake among sleeping crowds. Confident and forceful.
```

### `c09-perfect` — 기억나지 않는 꿈 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse stacked stone-brick courses. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a dream nobody remembers, dissolving into vine and smoke. Monumental and overwhelming — this is the rarest card in the set.
```

### `c10-win` — 복구된 서가 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a restored library shelf, books back in order, one still glowing. Confident and forceful.
```

### `c10-lose` — 빈 연대기 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: an open chronicle with every page blank. Confident and forceful.
```

### `c10-perfect` — 돌아온 한 줄 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: one restored line of text burning on an open page. Monumental and overwhelming — this is the rarest card in the set.
```

### `c11-win` — 다시 묶인 맹세 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: an oath re-tied — a knotted cord pulled fast around two rings. Confident and forceful.
```

### `c11-lose` — 풀린 매듭 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: an unravelled knot, the cord ends drifting apart. Confident and forceful.
```

### `c11-perfect` — 아무도 모르는 계약 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a contract nobody knows, sealed and lying face-down. Monumental and overwhelming — this is the rarest card in the set.
```

### `c12-win` — 빈 왕좌에 앉은 자 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: someone seated on the empty throne of Olympus, face lost in shadow. Confident and forceful.
```

### `c12-lose` — 주인 없는 하늘 (★2)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent warm gold #FFC53D. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: a sky with no master, storms colliding unchecked. Confident and forceful.
```

### `c12-perfect` — 돌아온 하늘 (★3)

```
Flat graphic illustration, silkscreen concert-poster aesthetic (in the spirit of Persona 5 UI art): hard-edged shapes, heavy confident black contour lines, flat fills, visible halftone dot texture and fine diagonal screen-print lines. STRICTLY three colours only: deep near-black background #0B0910, bone white #F2EDF5, and one accent hot crimson #FF2B3E. No other hues. No gradients, no soft shading, no glow, no 3D render, no photographic lighting. Bold diagonal composition, dramatic silhouette that still reads at thumbnail size. One subject, centred, filling the frame and cropped by the edges. Ancient Greek mythology. Background motif: sparse jagged lightning zigzags. No text, no letters, no numbers, no logo, no signature, no watermark, no border, no card frame, no UI. Square 1:1 format, flat background, full bleed. Subject: the sky returned — clouds parting above a restored throne. Monumental and overwhelming — this is the rarest card in the set.
```
