# 🕶️ ROUNZ 웹페이지 반응형 리뉴얼 프로젝트 (EST_fe_13_2st_project)

이 프로젝트는 이스트소프트 프론트엔드 개발자 오르름캠프 13기 2차 프로젝트로, 안경 및 선글라스 온라인 쇼핑몰 **라운즈(ROUNZ)** 웹사이트를 모티브로 삼아, 최신 웹 트렌드와 프리미엄 디자인 요소를 가미한 **반응형 웹 퍼블리싱 및 모듈형 웹 애플리케이션 리뉴얼 프로젝트**입니다.

---

## 🌟 프로젝트 소개 (Project Overview)

안경을 사고 쓰는 즐거운 경험을 제공하는 **라운즈(ROUNZ)** 쇼핑몰을 고도화된 UI/UX로 재해석했습니다.

- **반응형 웹 디자인**: 데스크톱, 태블릿, 모바일 기기 전체에서 매끄럽게 호환되는 HSL 기반 반응형 레이아웃 구현
- **모듈화된 구조**: Vanilla CSS와 ES Modules(JavaScript)를 사용해 컴포넌트별 결합도와 가독성을 높인 독립적 파일 설계
- **검증된 UI/UX**: 슬라이더, 캐러셀, 동적 지점 검색 필터, 아코디언 메뉴, 가상 피팅 모의 CTA 등 실감형 모바일-데스크톱 인터랙션 제공

---

## 🚀 핵심 기능 (Key Features)

### 1. 메인 매거진 & 브랜드 추천 (`index.html`)

- **STYLE MAGAZINE**: 트렌디한 카드 형태 그리드로 썸네일 호버 시 줌인(Zoom-in) 애니메이션 제공
- **NEW PRODUCT**: 브랜드 필터 칩을 클릭해 동적으로 상품 탐색 가능, 데스크톱/모바일별 가로 슬라이더 및 네비게이션 닷츠(Dots) 자동 조절
- **AI CTA**: 스마트 가상 피팅 예약 유도 배너 탑재
- **ABOUT US**: 모바일 전용 수평 스크롤링 및 **진행 상태 바(Scroll Progress Bar)** 연동
- **ROUNZ STORE**: 지역(시/도, 시/군/구) 필터링 UI 및 방문 예약/전화 걸기 다이렉트 액션 연동

### 2. 모델 비교하기 (`compare.html`)

- **아이웨어 모델 다중 비교**: 3개 열(Column)에 브랜드별 셀렉트 박스와 제품 상세 카드 표출
- **직관적 핀아웃**: 구입하기 및 더 알아보기 액션과 가상피팅/얼굴분석 부가 기능 연계

### 3. 유저 인터페이스 & 기타 페이지

- **상품 목록 및 상세 (`productList.html`, `product.html`)**: 동적 목록화 및 아이웨어 상세 정보 상세 설계
- **장바구니 (`cart.html`)**: 반응형 상품 체크, 가격 집계 처리
- **회원 인증 (`login.html`, `signup.html`)**: 모던한 폼 필드와 유효성 검증 레이아웃

---

## 🛠️ 기술 스택 (Tech Stack)

### **Core**

- **HTML5**: 시맨틱 웹 및 SEO 접근성 향상, 이미지 지연 로딩(`loading="lazy"`) 적용
- **Vanilla CSS**: CSS Custom Properties(변수) 기반의 디자인 시스템화 (`common.css`)
  - 일관된 컬러 토큰, 미세 타이포그래피, 디자인 테마 관리
  - 미디어 쿼리 분기(`1024px` / `768px` / `480px`)를 통한 멀티 디바이스 레이아웃 최적화
- **JavaScript (ES6+)**: ES Modules 방식을 적용하여 페이지 단위 스크립트 모듈 분리 (`js/pages/`, `js/modules/`)

### **Data & Assets**

- **JSON 데이터**: 모의 API용 상품 리스트(`products.json`) 및 전국 안경원 리스트(`stores.json`) 탑재
- **Google Fonts & SVG**: 'Inter', 'Outfit', 'Noto Sans KR' 서체 적용 및 인라인/벡터 벡터 그래픽 최적화

---

## 📂 디렉토리 구조 (Directory Structure)

```bash
├── .husky/             # Git Hooks 설정 (Husky)
├── assets/             # 이미지, 아이콘 등 정적 자원
├── css/
│   ├── common.css      # 공통 디자인 시스템 (변수, 타이포)
│   ├── index.css       # 메인 페이지 전용 스타일
│   ├── compare.css     # 모델 비교 페이지 전용 스타일
│   ├── normalize.css   # 브라우저 간 기본 스타일 차이 보정
│   ├── reset.css       # 기본 마진/패딩 초기화
│   └── ...             # 페이지별 개별 스타일시트
├── data/
│   ├── products.json   # 상품 모의 데이터
│   └── stores.json     # 안경원 지점 모의 데이터
├── html/
│   ├── index.html      # 메인 매거진 페이지
│   ├── compare.html    # 모델 비교 페이지
│   ├── login.html      # 로그인 페이지
│   ├── signup.html     # 회원가입 페이지
│   ├── cart.html       # 장바구니 페이지
│   ├── stores.html     # 매장 찾기 페이지
│   └── ...
├── js/
│   ├── main.js         # 글로벌 스크립트 (슬라이더, 아코디언, 스크롤 프로그레스 등)
│   ├── common.js       # 공통 헬퍼 스크립트
│   ├── pages/          # 페이지별 독립 비즈니스 로직 스크립트
│   └── ...
├── .gitignore          # Git 추적 예외 정의 파일
├── eslint.config.mjs   # ESLint 문법 오류/품질 분석 규칙 정의 파일
└── package.json        # 의존성 패키지 및 스크립트 정의 파일
```

---

## ⚡ 주요 최적화 내역 (Optimizations)

1. **미디어 쿼리 스코프 격리**:
   - 기존의 `@media (width <= 768px)` 내부 괄호 누락 버그를 완벽히 해결하여, 데스크톱 해상도(`> 768px`)에서 메인 영역 하위 레이아웃이 유실되거나 깨지는 문제를 근본적으로 해결했습니다.
2. **페이지 간 흐름 연계 (UX 고도화)**:
   - 헤더의 로고(`index.html`), 로그인(`login.html`), 장바구니(`cart.html`), 푸터의 플래그십 스토어/파트너 안경원(`stores.html`) 링크를 올바르게 연결하여 유저 탐색 편의성을 높였습니다.
3. **이미지 렌더링 최적화**:
   - 뷰포트 아래 영역에 존재하는 무거운 배너 이미지 및 상품 썸네일 카드에 `loading="lazy"` 속성을 적용하여 LCP(Largest Contentful Paint) 속도를 획기적으로 개선했습니다.

---

## 👥 팀원 소개 (Team Members)

역할에 맞춰 개별 기능 브랜치를 활용하여 안정적인 협업을 진행하고 있습니다.

| 이름     | 역할                                                    | 담당 브랜치 | GitHub 링크                                                      |
| :------- | :------------------------------------------------------ | :---------- | :--------------------------------------------------------------- |
| **정민** | 👑 팀장 / 기획/디자인/로그인/회원가입/상품비교 퍼블리싱 | `jeongmin`  | [@chittybb1357-commits](https://github.com/chittybb1357-commits) |
| **성희** | 💻 팀원 / 기획/디자인/메인/푸터/상품비교 퍼블리싱       | `sunghee`   | [@xoxoworld](https://github.com/xoxoworld)                       |
| **시원** | 💻 팀원 / 기획/디자인/상세/안경원 퍼블리싱              | `siwon`     | [@isnow-x](https://github.com/isnow-x)                           |
| **소호** | 💻 팀원 / 기획/디자인/메인/헤더 퍼블리싱                | `soho`      | [@soho1109](https://github.com/soho1109)                         |
| **소영** | 💻 팀원 / 기획/디자인/상품목록/장바구니 퍼블리싱        | `soyoung`   | [@s0y0ungk](https://github.com/s0y0ungk)                         |

---

## 🏃 실행 방법 (Getting Started)

이 프로젝트는 기본적으로 브라우저에서 바로 실행할 수 있는 정적 웹 애플리케이션이지만, 개발 품질 및 SASS 컴파일을 효율적으로 수행하기 위해 Node.js 패키지 환경이 함께 구성되어 있습니다.

1. **저장소 클론**:
   ```bash
   git clone https://github.com/xoxoworld/EST_fe_13_2st_project.git
   ```

2. **패키지 의존성 설치**:
   ```bash
   npm install
   ```
   - 설치 완료 시, 커밋 시점에 자동으로 자바스크립트 결함을 분석하는 **Husky (Git Hook)**가 자동으로 활성화됩니다.

3. **SCSS/SASS 실시간 자동 컴파일 (압축 및 감시)**:
   ```bash
   npm run watch:css
   ```
   - `scss/` 폴더 내부의 `.scss` 수정본을 실시간으로 감시하여 저장할 때마다 자동으로 최적화 및 압축된 `.css`로 `css/` 폴더에 변환 배출합니다.

4. **1회성 CSS 빌드**:
   ```bash
   npm run build:css
   ```

5. **자바스크립트 품질 분석 (ESLint)**:
   - 코드를 스테이지하고 커밋할 때마다 staged 파일들을 대상으로 검사가 자동 작동합니다.
   - 프로젝트 전체 수동 검사:
     ```bash
     npx eslint js
     ```
