# 🌆 ZEONS CITY 2048
### "나만의 웅장한 도시를 건설하는 3D 전략 퍼즐 게임"

[![HTML5](https://img.shields.io/badge/HTML5-ED4242?style=for-the-badge&logo=HTML5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

---

## 📖 프로젝트 소개
**ZEONS CITY 2048**은 고전적인 2048 퍼즐 게임의 로직을 현대적인 **도시 건설 테마**와 **3D 시각 효과**로 재해석한 웹 애플리케이션입니다. 같은 가치의 건물을 합쳐 더 거대하고 세련된 마천루로 진화시키며, 자신만의 도시를 완성해 나가는 즐거움을 선사합니다.

이 프로젝트는 **구글 노트북LM(NotebookLM)**과 **안티그래비티(Antigravity)**를 활용한 **'바이브 코딩(Vibe Coding)'**의 대표적인 사례로, 기획부터 핵심 로직 구현까지 AI와 인간의 협업으로 완성되었습니다.

---

## ✨ 핵심 기능 (Key Features)

### 1. 시각적 경험 (Visual Experience)
- **3D Isometric Board:** CSS의 `perspective`와 `transform`을 활용하여 입체감 있는 3D 보드판을 구현했습니다.
- **Dynamic Weather System:** 게임 진행 중 실시간으로 계절이 변화하며, 그에 따른 날씨 효과(벚꽃, 햇살, 낙엽, 눈)가 화면을 채웁니다.
- **Building Evolution:** 2부터 131,072까지 총 17단계의 고퀄리티 건물 이미지로 도시의 발전 단계를 시각화합니다.
- **Ambient Animation:** 하늘을 가로지르는 제온스(ZEONS) 비행선과 부드러운 타일 이동 애니메이션이 몰입감을 더합니다.

### 2. 전략적 메커니즘 (Game Logic)
- **Joker Building System:** 3콤보 이상 달성 시 획득하는 '조커 빌딩' 아이템을 통해, 원하는 위치에서 타일을 즉시 업그레이드할 수 있는 전략적 요소를 추가했습니다.
- **City Leveling:** 최고 타일의 가치에 따라 도시 레벨(LV)이 상승하며, 레벨업 시 화려한 파티클 효과가 나타납니다.
- **Progressive UI:** 게임 플레이 중 숫자를 숨기고 건물 위주로 감상하거나, BGM을 자유롭게 선택할 수 있는 편의 기능을 제공합니다.

### 3. 기술적 완성도 (Technical Details)
- **PWA (Progressive Web App):** 오프라인 실행 지원 및 서비스 워커를 통한 설치가 가능하여, 모바일 기기에서 앱처럼 사용할 수 있습니다.
- **Web Share & Capture:** `html2canvas`를 활용하여 현재 도시의 스크린샷을 생성하고, Web Share API를 통해 SNS에 즉시 최고의 점수를 공유할 수 있습니다.
- **Synthesized Audio:** Web Audio API(`AudioContext`)를 사용하여 콤보 및 레벨업 시 청량한 사운드 효과를 실시간으로 생성합니다.

---

## 🛠 기술 스택 (Tech Stack)
- **Core:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Libraries:**
  - `html2canvas`: 스크린샷 생성
  - `Service Worker`: PWA 지원 및 캐싱
- **Design Tools:** Photopea (Asset editing)
- **AI Orchestration:** Google NotebookLM & Antigravity

---

## 🚀 시작하기 & 설치 (Get Started)

### 1. 온라인 플레이
아래 주소에서 즉시 플레이할 수 있습니다.
👉 [https://zeons.github.io/CITY2048/](https://zeons.github.io/CITY2048/)

### 2. 앱(PWA) 설치 가이드
- **Android/Desktop:** 주소창 우측의 '설치' 아이콘 또는 화면 하단의 '앱 설치하기' 버튼 클릭.
- **iOS (iPhone/iPad):**
  1. Safari 브라우저에서 접속.
  2. 하단 **'공유'** 버튼 클릭.
  3. **'홈 화면에 추가'** 선택.

---

## 📁 디렉토리 구조
```text
/c:/Works/CITY2048
├── index.html        # 게임 메인 레이아웃
├── style.css         # 3D 테마 및 애니메이션 스타일링
├── script.js        # 게임 로직, 날씨, 오디오 및 PWA 연동
├── manifest.json     # PWA 설치 정보
├── sw.js             # 서비스 워커 (오프라인 캐싱)
└── resource/         # 건물 및 비행선 이미지 자산
```

---

## 💡 개발기 (The Vibe Coding Story)
> "전통적인 코딩 방식에서 벗어나, NotebookLM으로 기획을 분석하고 Antigravity와 대화하며 자연스럽게 흐르듯 개발했습니다."

- **기획 단계:** NotebookLM을 통해 2048 게임의 본질과 도시 건설 테마의 결합 아이디어 도출.
- **구현 단계:** Antigravity에게 10년 차 개발자 페르소나를 부여하여 부드러운 타일 이동과 정교한 3D CSS 구축.
- **폴리싱:** 사용자의 피드백을 실시간으로 반영하며 날씨 이펙트와 BGM 시스템 추가.

---

## 🎨 자원 활용
- **빌딩 및 비행선 이미지:** Photopea를 활용하여 제작.
- **폰트:** Google Fonts (Outfit, Inter).
- **효과음:** Web Audio API를 활용한 자체 합성음.

---
**ZEONS CITY 2048**과 함께 세련된 미래 도시를 건설해 보세요! 🌃
