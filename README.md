# ZEONS CITY 2048
## _2048 Web Game_


<img src="https://img.shields.io/badge/HTML5-ED4242?style=flat&logo=HTML5&logoColor=white"/>  <img src="https://img.shields.io/badge/CSS3-00A4DE?style=flat&logo=css3&logoColor=white"/>  <img src="https://img.shields.io/badge/JavaScript-000000?style=flat&logo=javascript&logoColor=white"/>


<img src="https://img.shields.io/badge/NotebookLM-ED4242?style=flat&logo=NotebookLM&logoColor=white"/>  <img src="https://img.shields.io/badge/Antigravity-000000?style=flat&logo=Antigravity&logoColor=white"/>

구늘 노트북LM 과 안티그래비티를 사용해서 바이브코딩한 사례 입니다.
<!--
![N|Solid](https://notebooklm.google/_/static/branding/v4/light_mode/notebook-logo.svg)



<img src="https://simpleicons.org/icons/notebooklm.svg"/>
<img src="https://img.shield.io/badge/notebooklm?sytle=flat-square&logo=notebooklm&logocolor=white"/>

-->

## 노트북LM, 구글 안티그래비티

노트북LM 과 구글 안티그래비티 (Google Antigravity) 를 이용해서 바이브 코딩으로 2048 게임을 만들었습니다.

- 노트북LM 으로 2048 게임에 대한 분석과 게임 기회 과 구현 기능을 설명
- 노트북LM 에게 구글 안티그래비티가 개발 할 수 있도록 프롬프트 를 작성 요청
- 작성된 프롬프트 를 구글 안티그래비티 프폼프트 창에 입력 후, 개발 시작


총 제작 시간은 약 8시간 이 걸렸습니다.

기본 게임 화면 과 로직 구현은 안티그래비티 가 금방 만들어 주더군요. (약 5분 이내)

게임을 테스트 하면서 게임 몰입감, 효과를 위한 이미지 작업 및 추가 JavaScript 기능 추가 하는데 시간이 많이 걸렸습니다.




## 리소스
| 폴더 | 내용 |
| ------ | ------ |
| \reource\airplane | 플래카드 비행기 이미지 |
| \reource\building | 빌딩이미지 18개 (18.조커빌딩) | |


- \resource 폴더에 이미지를 바꾸시면 농촌, 도심, 해변 테마로 사용 가능, 회사 홍보도 가능

- 빌딩, 비행기 이미지 작업은 Photopea 무료 웹 포토에디터 를 사용 https://www.photopea.com/


제가 이미지 작업에 전문가가 아니라, 이미지 퀄러티는 좋지 않습니다.

전문가 분들에 참여해서 더 좋은 이미지가 제공되면 좋을 것 같습니다.





## 맺음말

즐겁게 플레이 하시면서 바이브 코딩에 대한 경험을 해보시면 좋을 것 같습니다.




## 앱 실행

https://zeons.github.io/CITY2048/





## 프롬프트

```sh
너는 10년 차 프론트엔드 개발자이자 웹 게임 디자인 전문가야. HTML5, CSS3, JavaScript(또는 React)를 사용하여 '제온스(ZEONS)' 회사의 브랜드 홍보를 위한 모던한 2048 웹 게임을 개발해 줘.
1. 핵심 게임 로직 (2048 원작 규칙 적용)
그리드 및 조작: 4x4 그리드에서 진행되는 싱글 플레이어 슬라이딩 블록 퍼즐 게임을 구현해 줘
. 키보드 방향키(상, 하, 좌, 우)와 모바일 터치 스와이프(Touch Swipe) 이벤트를 모두 지원해야 해
.
타일 병합: 타일 이동 시, 같은 값을 가진 인접한 두 타일이 충돌하면 두 값의 합을 가진 새로운 타일로 병합되도록 2D 배열(2D Array) 상태 관리를 구현해 줘
.
타일 생성: 이동이 발생할 때마다 빈칸 중 무작위 위치에 새로운 타일이 생성되며, 이때 2가 나올 확률은 90%, 4가 나올 확률은 10%로 설정해
.
승패 조건: 16칸이 꽉 차고 인접한 타일 중 더 이상 병합할 타일이 없으면 '게임 오버'로 처리하고, 최종 목표인 2048 타일을 만들면 '게임 클리어(승리)' 팝업을 띄워줘
.
2. 디자인 및 UI 커스터마이징 (제온스 브랜드 테마)
건물 진화 시스템 (핵심): 타일에 숫자를 텍스트로 보여주는 대신, 숫자에 매핑되는 CSS 클래스를 부여하여 건물 아이콘이나 이미지로 렌더링해 줘
.
예시: 2는 작은 오두막, 4는 2층 주택, 8은 상가 건물로 시작하여 값이 커질수록 건물이 발전함. 최종적으로 2048에 도달하면 '제온스(ZEONS) 로고가 크게 박힌 웅장한 마천루(빌딩)' 요소가 나타나도록 코드를 구성해 줘.
비행선 애니메이션: 게임 플레이 화면 배경의 최상단 레이어에 제온스 로고가 그려진 비행선 요소(absolute 포지션)를 띄워줘. CSS @keyframes를 사용해 이 비행선이 무작위 높이에서 30초~1분 주기로 화면 좌측에서 우측으로 천천히 가로지르도록 애니메이션을 작성해.
시각 효과: 타일 이동 시 딱딱하게 끊기지 않고 부드럽게 미끄러지도록 CSS의 transition 속성(예: left, top)을 적용하고, 타일이 병합될 때 일시적으로 크기가 커졌다 작아지는(Pop) 스케일 애니메이션을 추가해 줘
. 전체 테마는 현대적인 플랫(Flat) 디자인이나 세련된 야경 테마로 구성해.
3. 부가 기능
점수 시스템: 타일이 병합될 때마다 합쳐진 타일의 값만큼 현재 점수(Score)가 올라가도록 계산해 줘
.
하이스코어 유지: 최고 점수(Best Score)는 브라우저의 localStorage API를 활용하여 사용자가 창을 닫아도 기기에 저장되고 불러와지도록 구현해 줘
.
SNS 공유 기능: 게임 오버 또는 클리어 시 "나는 제온스 시티에 빌딩을 세웠다! 내 최고 점수: [점수]점"이라는 문구와 함께 게임 URL을 공유할 수 있도록 Web Share API를 연동한 '공유하기 버튼'을 만들어 줘.
오디오 제어: HTML5 <audio> 태그를 사용해 모던한 일렉트로닉이나 로파이(Lo-fi) 배경음악(BGM)이 재생되도록 하고, 타일이 합쳐져 건물이 진화할 때마다 재생될 경쾌한 효과음 함수를 포함해 줘.
간단하게 웹앱(홈 화면 추가)으로 설치할 수 있게 버튼을 만들어 주고, 웹앱 설치가 어려운 경우 앱웹 설치 안내 팝업을 띄워 줘.
웹앱 설치시 아이콘 이미지가 보이도록 구성해 줘.

4. 출력 요구사항
HTML 구조, CSS 스타일링, JavaScript 핵심 로직을 분리하여 제공하고, 각 코드 블록이 어떤 역할을 하는지 주석으로 상세히 설명해 줘. 복사 및 붙여넣기만으로 바로 브라우저에서 실행 가능한 형태여야 해.
```
