# 나이스 글자수 계산기

학교생활기록부(NEIS) 입력 Byte를 브라우저에서 바로 계산하는 정적 웹사이트입니다.
구현 계획은 [plan.md](./plan.md)를 참고하세요.

## 실행

빌드 도구나 의존성이 필요 없습니다. 다만 ES 모듈을 사용하므로 `file://`이 아닌
로컬 서버로 열어야 합니다.

```bash
python3 -m http.server 4173
# http://localhost:4173
```

## 브랜치와 배포

| 브랜치 | 용도 |
| --- | --- |
| `main` | 배포 상태를 유지하는 브랜치. 여기에 푸시되면 자동 배포된다. |
| `Dev` | 개발 브랜치. 작업 후 PR로 `main`에 머지한다. |

`main`에 푸시하면 `.github/workflows/deploy.yml`이 실행되어 GitHub Pages로 배포됩니다.
Actions 탭에서 `Deploy to GitHub Pages` 워크플로를 수동 실행(`workflow_dispatch`)할 수도 있습니다.

배포 URL: https://luminen529.github.io/NiceCatch/

빌드 단계가 없으므로 워크플로는 `index.html`과 `src/`만 `_site`로 모아 그대로 게시합니다.
문서(`plan.md`, `README.md`)와 에디터 설정은 배포에 포함되지 않습니다.

> 최초 1회, 저장소 **Settings → Pages → Build and deployment → Source**를
> **GitHub Actions**로 설정해야 워크플로 배포가 동작합니다.

### 개발 흐름

```bash
git switch Dev
# 작업 후
git add -A && git commit -m "..."
git push origin Dev
# GitHub에서 Dev -> main PR 생성 후 머지하면 배포
```

## 구조

```text
index.html                     SEO 메타데이터 + 진입점
src/
├─ components/
│  ├─ Counter/                 계산기 (상태 소유: Counter.js)
│  │  ├─ Counter.js            상태·자동 저장·렌더 오케스트레이션
│  │  ├─ LimitSelector.js      항목 선택 / 직접 설정
│  │  ├─ TextInput.js          입력창, 복사, 2단계 지우기
│  │  └─ ResultPanel.js        현재/최대/남은/초과 Byte, 진행률, 글자수
│  ├─ Info/                    ByteGuide · LimitTable · FAQ
│  └─ Layout/                  Header · Footer
├─ constants/neisLimits.js     항목별 최대 Byte, 출처, 확인 날짜
├─ hooks/useLocalStorage.js    localStorage 접근 + 디바운스
├─ utils/calculateNeisBytes.js Byte 계산 규칙 (UI와 분리)
├─ styles/globals.css
└─ main.js
```

## 유지보수 포인트

- **기준값 변경**: `src/constants/neisLimits.js`의 `NEIS_LIMITS`, `STANDARD_YEAR`,
  `SOURCE.lastCheckedAt`만 수정하면 선택 칩·안내 표·푸터에 모두 반영됩니다.
- **계산 규칙 변경**: `src/utils/calculateNeisBytes.js`만 수정합니다.
  UI 컴포넌트에는 Byte 규칙이 들어 있지 않습니다.
- **FAQ 추가**: `src/components/Info/FAQ.js`의 `FAQ_ITEMS`에 항목을 추가하면
  화면과 FAQ 구조화 데이터(JSON-LD)에 함께 반영됩니다.
- 배포 도메인이 정해지면 `index.html`의 `<link rel="canonical">` 값을 교체하세요.

## 계산 규칙

| 문자 | Byte |
| --- | --- |
| 한글·한자·전각기호 | 3 |
| 영문·숫자·기호·공백 | 1 |
| 줄바꿈(Enter) | 1 |

`\r\n`은 `\n`으로 정규화한 뒤 계산합니다.

## 개인정보

모든 계산은 브라우저에서만 이루어지며 입력 내용은 서버로 전송되지 않습니다.
자동 저장을 켠 경우에만 현재 브라우저의 `localStorage`에 저장되고,
자동 저장을 끄거나 "저장된 내용 삭제"를 누르면 즉시 삭제됩니다.
