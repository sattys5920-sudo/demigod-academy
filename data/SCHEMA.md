# 데이터 파일

본문·대사는 **전부 빈칸**이다. 구조만 잡아 둔 상태이고, 글은 나중에 채운다.

| 파일 | 담는 것 | 채워진 정도 |
| --- | --- | --- |
| `season-01.json` | 12장 구조 · 괴물 · 약점 · 결과 분기 · 결말 | 구조 100% · **본문 0%** |
| `zones.json` | 사냥터 12지대 · 우두머리 · 드랍 | 구조 100% · 수치 0% |
| `cards.json` | 카드(=NPC 학생) · 등급 · 계보 · 스탯 | 기존 7장 100% · **장 보상 33장 수치 0%** |
| `bonds.json` | 관계선 · 연계/불화 효과 · 공개 조건 | 스키마 + 샘플 4개 |
| `talks.json` | 모모톡 스레드 · 답장 분기 · 장면 해금 | 스키마 + 뼈대 2개 · **대사 0%** |
| `schedule.json` | 수업 4 · 알바 4 · 시간 블록 | 구조 100% · 수치 0% |
| `quiz.json` | 쪽지시험 문제 **40개** | **100%** (괴이에서 이식) |
| `minigames.json` | 알바 미니게임 5종 | **100%** (괴이에서 이식) |
| `economy.json` | 재화 · 뽑기 확률 · 한도 · 비용 | 임시값 |

## 괴이에서 가져온 것

`sattys5920-sudo/grosof4` 의 「괴이」 프로젝트에서 옮겼다.

- `src/data/hallPuzzles.ts` (30문제) → `quiz.json`
- `src/data/classroomPuzzles.ts` (10문제) → `quiz.json` — **포장 문구(brief·hint)는 공포 톤이라 비웠다.**
  문제와 답은 그대로 쓸 수 있다
- `src/data/hallMinigames.ts` → `minigames.json`

## 수치를 채우는 순서

`null` 로 비어 있는 곳은 기준 하나가 정해지면 역산된다.

> **한 사람이 시즌 동안 버는 것으로 주력 서너 장을 만렙까지 올린다.**

1. `economy.daily.etherCap` 과 `enhance.levelCostCurve` 를 이 기준에 맞춰 잡는다
2. 거기서 `schedule` 의 수업·알바 보상이 나온다
3. 카드 스탯이 정해지면 `zones` 드랍과 `season.boss.hp` 가 따라온다

보스 체력은 **12인 고정**이라 바로 잡힌다 — `1인 평균 기여 × 12 × 난이도`.
