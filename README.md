# 데미갓 아카데미

그리스로마신화 12계보의 자손(데미갓)이 현대 학원에서 카드로 서열을 정하는 TCG 웹앱.
형광 팝 만화 톤 — 두꺼운 흰 아웃라인, 하프톤 도트, 라임·핑크 형광 대비.

## 화면

| 파일 | 화면 | 상태 |
| --- | --- | --- |
| `index.html` | 입장 — 가입 / 로그인 / 관리자 코드 | 완료 |
| `lobby.html` | 로비 — 시즌, 대전 시작, 오늘의 신탁, 내 덱 | 완료 |
| — | 카드 수집 / 덱 빌더 | 예정 |
| — | 카드 상세 | 예정 |
| — | 전투 | 예정 |

빌드 단계가 없는 정적 HTML입니다. 파일을 브라우저로 바로 열어도 동작합니다.

## 디자인 토큰

| 역할 | 값 |
| --- | --- |
| 배경 | `#14061F` |
| 패널 | `#1E0B2C` |
| 아웃라인 / 반전 패널 | `#FFFFFF` |
| 주요 강조 (라임) | `#C6FF3D` |
| 보조 강조 (핑크) | `#FF2E93` |
| 본문 보조 텍스트 | `#E4D8EE` · `#B7A5C4` · `#9B86AD` |
| 비활성 테두리 | `#3B2450` |

라임·핑크·흰색 위의 글자는 항상 `#14061F`. 형광색 위에 흰 글자는 쓰지 않습니다.

서체: 제목·버튼 `Gasoek One` / 숫자·영문 라벨 `Archivo Black` / 본문 `Gothic A1`.
형태: 주요 요소마다 4~5px 흰 아웃라인, 알약형 999px · 작은 카드 18px · 큰 패널 28px,
blur 없는 하드 섀도우(`10px 10px 0`), 작은 카드는 `rotate(-2deg ~ 2.2deg)`.

## 계정과 관리자 코드

로그인·가입은 **Firebase Authentication(이메일/비밀번호)** 를 씁니다. 이 게임은
이메일이 아니라 아이디로 입장하므로, 아이디를 `<아이디>@demigod-academy.example`
로 바꿔 파이어베이스에 넘깁니다. 비밀번호는 구글 쪽에 해시로만 남고 이 저장소나
브라우저에 평문으로 저장되지 않습니다.

`index.html` 의 `firebaseConfig` 값은 비밀이 아닙니다 — 파이어베이스 웹 앱 설정은
공개를 전제로 설계돼 있고, 실제 보호는 콘솔의 인증 설정과 보안 규칙이 합니다.

다만 **관리자 코드는 아직 클라이언트 상수**라 소스를 열면 그대로 보입니다.
관리자 콘솔에 실제 데이터 편집 기능을 붙이기 전에 서버(Custom Claims 등)로
옮겨야 합니다.

## 배포

### GitHub Pages

저장소 **Settings → Pages** 에서 Source `Deploy from a branch`, Branch `main` / `/ (root)`.

게시 주소: `https://sattys5920-sudo.github.io/demigod-academy/`

### Firebase Hosting

```sh
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

`.firebaserc` 의 `PASTE_PROJECT_ID` 를 실제 프로젝트 ID로 바꾼 뒤 실행합니다.
게시 주소: `https://<프로젝트 ID>.web.app`

파이어베이스 콘솔에서 미리 해둘 것:

1. **Authentication → Sign-in method → 이메일/비밀번호** 사용 설정
2. **Authentication → Settings → 승인된 도메인** 에 `sattys5920-sudo.github.io` 추가
   (Pages 쪽에서도 로그인이 되게 하려면 필요합니다)
