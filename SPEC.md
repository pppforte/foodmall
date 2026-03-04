# SPEC: 음식점 프랜차이즈 홍보 웹사이트

> Reference: https://wandduk.com (완뚝순두부)
> Created: 2026-03-04
> Updated: 2026-03-04 (리뷰 반영 v2)

---

## 1. 프로젝트 개요

음식점 프랜차이즈 브랜드를 홍보하는 웹사이트를 구축합니다.
참조 사이트(wandduk.com)와 동일한 구조와 기능을 현대적 기술 스택으로 재구현합니다.

### 기술 스택

| 항목 | 기술 | 비고 |
|------|------|------|
| 프레임워크 | **Next.js 15** (App Router) | 프론트 + API Route Handlers |
| 스타일링 | **Tailwind CSS 4** | 모바일 퍼스트 반응형 |
| 언어 | **TypeScript** | |
| DB | **MongoDB** (Mongoose ODM) | MongoDB Atlas 무료 티어 |
| 이메일 | **Nodemailer** (SMTP) | Gmail/Naver SMTP |
| 지도 | **Kakao Maps API** | |
| 이미지 저장 | **로컬 public/uploads** → 추후 S3/Cloudinary | |
| 애니메이션 | **Framer Motion** + CSS Animations | 스크롤 트리거 |
| 슬라이더 | **Swiper.js** | 터치 스와이프 지원 |
| 인증 | **JWT** + httpOnly 쿠키 | 관리자 인증 |
| 스팸 방지 | **reCAPTCHA v3** 또는 허니팟 | 문의 폼 보호 |
| 배포 | Vercel 또는 자체 서버 | |

---

## 2. 참조 사이트 모바일 분석

### 2.1 현재 wandduk.com 모바일 상태

| 항목 | 현재 상태 | 문제점 |
|------|----------|--------|
| viewport | `width=1200` 고정 | 모바일에서 데스크톱 페이지를 축소 표시, 진정한 반응형 아님 |
| 모바일 전용 페이지 | 없음 (/m/, m.wandduk.com 모두 404) | 별도 모바일 페이지 미존재 |
| 슬라이드쇼 | `isResponsive: false` | 이미지가 고정 크기, 모바일에서 잘림 |
| 팝업 | 600x800px 고정 | 모바일 화면(360px)에서 완전히 초과 |
| 문의 폼(iframe) | 1140x795px 고정 | 모바일에서 가로 스크롤 발생 |
| 매장 지도(iframe) | 800x400px 고정 | 모바일에서 좌우 스크롤 |
| 상단 문의 바(iframe) | 820x85px 테이블 레이아웃 | 4개 필드 가로 배치, 모바일 불가 |
| Hype 애니메이션 | 100% 폭이지만 고정 높이 | 비율 깨짐 |
| 텍스트 | 대부분 이미지 기반 | 모바일에서 가독성 떨어짐 |

### 2.2 신규 사이트 모바일 전략: Mobile-First 반응형

**기존 사이트의 모바일 미지원을 완전히 개선합니다.**

#### 브레이크포인트

| 이름 | 범위 | 대상 디바이스 |
|------|------|-------------|
| `xs` | 0 ~ 479px | 소형 스마트폰 |
| `sm` | 480 ~ 767px | 대형 스마트폰 |
| `md` | 768 ~ 1023px | 태블릿 |
| `lg` | 1024 ~ 1279px | 소형 데스크톱 |
| `xl` | 1280px+ | 대형 데스크톱 |

---

## 3. 사이트 구조

```
/ (메인 - 원페이지 스크롤)
├── #hero          - 히어로 배너 슬라이드
├── #brand         - 브랜드 소개
├── #menu-slide    - 메뉴 슬라이드 (음식 사진)
├── #media         - 미디어/뉴스 노출
├── #franchise     - 가맹 안내
├── #interior      - 인테리어 갤러리
├── #menu          - 메뉴 탭 (카테고리 A/B/C)
├── #contact       - 창업 문의 폼
├── #store         - 매장 안내 (카카오맵)
└── #footer        - 푸터

/admin (관리자 페이지)
├── /admin/login       - 관리자 로그인
├── /admin              - 대시보드 (통계)
├── /admin/popups      - 팝업 관리 (CRUD)
├── /admin/stores      - 매장 관리 (CRUD)
└── /admin/inquiries   - 문의 목록 확인
```

---

## 4. 페이지별 기능 명세

### 4.1 메인 페이지 (/)

#### 4.1.1 헤더/네비게이션 (고정)

**데스크톱 (lg+)**
- 로고 (좌측, 홈 링크)
- 네비게이션 메뉴 (중앙): 브랜드소개 | 메뉴 | 미디어 | 가맹안내 | 인테리어 | 매장안내 | 창업문의
- 대표번호 (우측, tel: 링크)
- 클릭 시 해당 섹션으로 부드러운 스크롤

**모바일 (< lg)**
- 로고 (좌측)
- 전화 아이콘 (우측, tel: 링크)
- 햄버거 메뉴 (우측)
  - 클릭 시 풀스크린 오버레이 메뉴
  - 섹션 링크 + 대표번호 + 문의하기 CTA 버튼
  - 닫기(X) 버튼

#### 4.1.2 상단 고정 문의 바 (SkyBar)

**데스크톱 (lg+)**
- 헤더 하단에 고정
- 가로 배치: 이름 | 연락처 | 내용/지역 | 개인정보동의 | 보내기
- 스크롤 시에도 항상 표시

**모바일 (< lg)**
- SkyBar 숨김 처리
- 대신 **하단 고정 플로팅 CTA 버튼**: "창업 문의하기"
- 클릭 시 **하단 시트(Bottom Sheet)** 팝업으로 간소화된 폼 표시
  - 이름, 연락처, 내용 3개 필드
  - 개인정보 동의 체크
  - 보내기 버튼

#### 4.1.3 히어로 섹션 (#hero)

| 항목 | 데스크톱 | 모바일 |
|------|---------|--------|
| 높이 | 100vh (풀스크린) | 100svh (safe viewport) |
| 이미지 | 1200x1100 원본 | object-fit: cover 크롭 |
| 슬라이드 | 자동 3초, 페이드 전환 | 터치 스와이프 추가 |
| CTA | 하단에 "창업 상담 신청" 버튼 | 동일 (크기 조정) |

- Swiper.js 사용
- `next/image`로 이미지 최적화
- 비디오 배너 지원 (autoplay, muted, loop)

#### 4.1.4 브랜드 소개 섹션 (#brand)

| 항목 | 데스크톱 | 모바일 |
|------|---------|--------|
| 레이아웃 | 2컬럼 (이미지 + 텍스트) | 1컬럼 (이미지 위, 텍스트 아래) |
| 애니메이션 | 스크롤 시 좌우 슬라이드인 | 스크롤 시 페이드인 (성능 고려) |
| 텍스트 | 실제 텍스트 (이미지 아님) | 가독성 좋은 폰트 크기 |

- Framer Motion `useInView` 활용
- 하단에 **CTA**: "가맹 문의하기 →" 버튼

#### 4.1.5 메뉴 슬라이드 섹션 (#menu-slide)

| 항목 | 데스크톱 | 모바일 |
|------|---------|--------|
| 이미지 크기 | 1200x600 | 100vw, 비율 유지 |
| 네비게이션 | 좌우 화살표 | 터치 스와이프 + 도트 인디케이터 |
| 자동 재생 | 3초 간격 | 동일 (터치 시 일시정지) |

#### 4.1.6 미디어/뉴스 섹션 (#media)

| 항목 | 데스크톱 | 모바일 |
|------|---------|--------|
| 레이아웃 | 3~4컬럼 그리드 | 1~2컬럼 그리드 |
| 미디어 로고 | 원본 크기 | 축소, 그리드 재배치 |

#### 4.1.7 가맹 안내 섹션 (#franchise)

| 항목 | 데스크톱 | 모바일 |
|------|---------|--------|
| 레이아웃 | 아이콘+텍스트 가로 배치 | 세로 스택 |
| 비용/절차/혜택 | 3컬럼 카드 | 1컬럼 아코디언 또는 스택 |

- 하단에 **CTA**: "지금 상담받기 →" 버튼

#### 4.1.8 인테리어 갤러리 (#interior)

| 항목 | 데스크톱 | 모바일 |
|------|---------|--------|
| 슬라이드 크기 | 1000x600 | 100vw, 비율 유지 |
| 네비게이션 | 좌우 화살표 + 페이딩 | 터치 스와이프 + 도트 |
| 이미지 수 | 10장 | 동일, lazy loading |

#### 4.1.9 메뉴 탭 영역 (#menu)

| 항목 | 데스크톱 | 모바일 |
|------|---------|--------|
| 탭 UI | 가로 텍스트 탭 3개 | 가로 스크롤 탭 또는 풀폭 탭 |
| 슬라이드 | 1200x600, 좌우 화살표 | 100vw, 터치 스와이프 |
| 카테고리 전환 | 클릭 | 탭 클릭 또는 스와이프 |

- 카테고리 A: 7장, B: 3장, C: 6장

#### 4.1.10 창업 문의 섹션 (#contact)

**데스크톱 (lg+)**
- 좌측: 대표번호(tel: 링크) + SMS 문의 버튼
- 우측: 창업 상담 폼 (배경 이미지 위 폼 오버레이)
- 폼 필드: 이름*, 연락처*(숫자만), 점포유무(라디오), 창업희망지역*, 문의내용*
- 개인정보 수집 동의 체크 + 처리방침 모달
- 제출 버튼

**모바일 (< lg)**
- 대표번호: 큰 터치 버튼 (전화 아이콘 + 번호)
- 폼: 풀폭 세로 스택
- 각 입력 필드 높이 최소 48px (터치 최적화)
- 라디오 버튼 크기 확대
- 텍스트에어리어 최소 120px 높이
- 제출 버튼: 풀폭 고정

**공통**
- 폼 유효성 검증 (클라이언트 + 서버)
- 연락처: 숫자만 입력 (실시간 검증)
- 개인정보 동의 미체크 시 제출 차단
- 스팸 방지: reCAPTCHA v3 (무표시) 또는 허니팟 필드
- **제출 성공**: "접수 완료" 모달 (접수번호 표시, 확인 버튼)
- **제출 실패**: 인라인 에러 메시지 (빨간 텍스트)
- 제출 중: 버튼 로딩 스피너 + disabled 처리

#### 4.1.11 매장 안내 섹션 (#store)

**데스크톱 (lg+)**
- 카카오맵 (800x400px → max-width: 100%)
- 전체 매장 마커 + 클릭 시 오버레이
- 시/도 드롭다운 + 검색 입력 (가로 배치)
- 하단 매장 테이블 (지역, 매장명, 주소, 전화, 상세보기)

**모바일 (< lg)**
- 카카오맵 (100vw, height: 300px)
- 시/도 드롭다운: 풀폭 select
- 검색: 풀폭 input + 검색 버튼
- 매장 목록: **카드 UI** (테이블 대신)
  - 각 카드: 매장명, 지역 뱃지, 주소, 전화(tel: 링크 버튼)
- 지도 ↔ 목록 전환 탭 (지도보기 | 목록보기)

#### 4.1.12 푸터 (#footer)

| 항목 | 데스크톱 | 모바일 |
|------|---------|--------|
| 레이아웃 | 3~4컬럼 | 1컬럼 스택 |
| 회사 정보 | 가로 배치 | 세로 스택 |
| SNS 링크 | 아이콘 나열 | 동일 (크기 확대) |

### 4.2 팝업 시스템

**데스크톱 (lg+)**
- 사이트 접속 시 이미지/비디오 팝업 노출
- 다중 팝업 지원 (관리자 설정 위치)
- "24시간 동안 다시 열람하지 않습니다" 쿠키 기반 제어
- 닫기 버튼

**모바일 (< lg)**
- 팝업을 **중앙 정렬 모달**로 변환
- 최대 크기: 90vw x 80vh (화면 초과 방지)
- 이미지: `object-fit: contain`으로 비율 유지
- 다중 팝업 시: 한 번에 하나씩 표시 (스택이 아닌 순차)
- YouTube 팝업: 16:9 비율 유지 반응형 iframe
- 닫기 버튼 크기 확대 (최소 44x44px 터치 타겟)

**관리자 팝업 CRUD**
- 이미지 업로드 또는 YouTube URL 입력
- 관리자 식별용 제목
- 위치 (top, left) 설정 - 데스크톱에만 적용
- 크기 (width, height) 설정
- 노출 기간 (시작일 ~ 종료일)
- 클릭 시 이동 URL + 새 탭 여부
- 활성화/비활성화 토글
- 순서 변경 (드래그 또는 숫자)

### 4.3 관리자 페이지 (/admin)

관리자 페이지도 모바일 반응형으로 구현합니다 (태블릿 이상 최적화).

#### 4.3.1 로그인
- ID/PW 입력 폼
- **JWT** 토큰 발급 → **httpOnly 쿠키** 저장
- 세션 만료: 24시간
- 로그인 실패 시 인라인 에러

#### 4.3.2 대시보드
- 오늘 문의 수 / 전체 문의 수
- 전체 매장 수
- 활성 팝업 수
- 최근 문의 5건 리스트

#### 4.3.3 팝업 관리
- 팝업 목록 (카드/리스트 토글 뷰)
- 추가/수정: 모달 폼
  - 제목, 타입(이미지/YouTube), 업로드/URL, 위치, 크기, 기간, 링크, 활성화
- 삭제: 확인 모달
- 순서 변경

#### 4.3.4 매장 관리
- 매장 목록 (지역별 필터, 검색)
- 추가/수정: 모달 폼
  - 매장명, 지역, 도로명주소, 지번주소, 전화번호, 위도, 경도
  - 영업시간, 매장 사진 업로드, 매장 소개
- 삭제: 확인 모달
- 주소 입력 시 카카오 주소 검색 API 연동 (위도/경도 자동)

#### 4.3.5 문의 관리
- 문의 목록 (이름, 연락처, 지역, 접수일, 상태, 경로)
- 상태 필터: 전체 | 미확인 | 확인 | 완료
- 상세 보기: 모달
- 상태 변경: 미확인 → 확인 → 완료
- 삭제: 확인 모달
- 문의 경로 표시 (본문 폼 / 상단 바)

---

## 5. 데이터 모델 (MongoDB)

### 5.1 팝업 (Popup)
```typescript
{
  _id: ObjectId,
  title: string,              // 관리자 식별용 제목
  type: 'image' | 'youtube',  // 팝업 타입
  imageUrl: string,            // 이미지 경로 (업로드 후 URL)
  youtubeUrl: string,          // YouTube embed URL
  top: number,                 // 위치 Y (px, 데스크톱용)
  left: number,                // 위치 X (px, 데스크톱용)
  width: number,               // 너비 (px)
  height: number,              // 높이 (px)
  linkUrl: string,             // 클릭 시 이동 URL
  linkTarget: '_self' | '_blank',
  startDate: Date,             // 노출 시작일
  endDate: Date,               // 노출 종료일
  isActive: boolean,           // 활성화 여부
  sortOrder: number,           // 정렬 순서
  createdAt: Date,
  updatedAt: Date
}
```

### 5.2 매장 (Store)
```typescript
{
  _id: ObjectId,
  name: string,                // 매장명
  region: string,              // 지역 (대구, 부산, 경북 등)
  address: string,             // 도로명 주소
  jibunAddress: string,        // 지번 주소
  phone: string,               // 전화번호
  latitude: number,            // 위도
  longitude: number,           // 경도
  businessHours: string,       // 영업시간
  imageUrl: string,            // 매장 사진 URL
  description: string,         // 매장 소개
  isActive: boolean,           // 활성화 여부
  sortOrder: number,           // 정렬 순서
  createdAt: Date,
  updatedAt: Date
}
```

### 5.3 문의 (Inquiry)
```typescript
{
  _id: ObjectId,
  name: string,                // 이름
  phone: string,               // 연락처
  hasStore: 'yes' | 'no',      // 점포 유무
  region: string,              // 창업 희망 지역
  content: string,             // 문의 내용
  source: 'form' | 'sky',     // 문의 경로 (본문 폼 / 상단 바)
  status: 'pending' | 'confirmed' | 'completed',
  privacyAgreed: boolean,      // 개인정보 동의 여부
  emailSent: boolean,          // 이메일 전송 여부
  ipAddress: string,           // 접수 IP (스팸 방지용)
  createdAt: Date
}
```

### 5.4 관리자 (Admin) - 선택적
```typescript
{
  _id: ObjectId,
  username: string,
  passwordHash: string,        // bcrypt 해시
  createdAt: Date
}
```

> 관리자가 1명이면 환경변수로 충분. 다수면 컬렉션 사용.

---

## 6. API 엔드포인트

### 6.1 공개 API (인증 불필요)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/popups | 활성화된 팝업 목록 (현재 날짜 기준 노출 기간 필터) |
| GET | /api/stores | 매장 목록 (query: region, search, page) |
| GET | /api/stores/[id] | 매장 상세 |
| GET | /api/stores/regions | 시/도 목록 (드롭다운용) |
| POST | /api/inquiries | 문의 접수 (유효성검증 + 이메일전송 + DB저장) |

### 6.2 관리자 API (JWT 인증 필요)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/admin/login | 로그인 (JWT 발급) |
| GET | /api/admin/dashboard | 대시보드 통계 |
| GET/POST | /api/admin/popups | 팝업 목록/추가 |
| PUT/DELETE | /api/admin/popups/[id] | 팝업 수정/삭제 |
| GET/POST | /api/admin/stores | 매장 목록/추가 |
| PUT/DELETE | /api/admin/stores/[id] | 매장 수정/삭제 |
| GET | /api/admin/inquiries | 문의 목록 (query: status, page) |
| PUT | /api/admin/inquiries/[id] | 문의 상태 변경 |
| DELETE | /api/admin/inquiries/[id] | 문의 삭제 |
| POST | /api/admin/upload | 이미지 업로드 (팝업/매장 사진) |

### 6.3 API 공통 사항
- Rate Limiting: 공개 API 분당 60회, 관리자 API 분당 120회
- 에러 응답: `{ success: false, error: string, code: number }`
- 성공 응답: `{ success: true, data: any }`
- 페이지네이션: `{ data: [], total: number, page: number, limit: number }`

---

## 7. 구현 순서 (Phase)

### Phase 1: 프로젝트 셋업 + DB 연결 (1일)
1. Next.js 프로젝트 초기화 (TypeScript, Tailwind CSS, App Router)
2. MongoDB Atlas 연결 + Mongoose 스키마 정의
3. 시드 데이터 작성 (매장 28개, 테스트 팝업, 테스트 문의)
4. 프로젝트 디렉토리 구조 설정
5. 공통 레이아웃 (헤더, 푸터) + 모바일 햄버거 메뉴

### Phase 2: 메인 페이지 섹션 구현 (3~4일)
6. 히어로 슬라이더 (Swiper.js, 반응형)
7. 브랜드 소개 섹션 (스크롤 애니메이션)
8. 메뉴 슬라이드 섹션
9. 미디어/뉴스 섹션
10. 가맹 안내 섹션 (CTA 포함)
11. 인테리어 갤러리 슬라이더
12. 메뉴 탭 영역 (3개 카테고리 + 탭 전환)
13. 푸터 섹션
14. 모바일 하단 플로팅 CTA 버튼

### Phase 3: 핵심 기능 구현 (2~3일)
15. 창업 문의 폼 (유효성 검증 + 성공/실패 UI)
16. 상단 고정 문의 바 (SkyBar, 데스크톱)
17. 모바일 하단 시트 문의 폼
18. Nodemailer 이메일 전송 연동
19. 문의 API (POST /api/inquiries)
20. 카카오맵 연동 + 매장 마커 + 오버레이
21. 매장 목록/검색/필터 (모바일: 카드UI, 지도↔목록 탭)
22. 매장 API (GET /api/stores, /api/stores/regions)
23. 팝업 시스템 (쿠키 24시간, 모바일 모달 변환)
24. 팝업 API (GET /api/popups)

### Phase 4: 관리자 페이지 (2~3일)
25. 관리자 JWT 인증 (로그인/미들웨어)
26. 대시보드 (통계 카드)
27. 팝업 관리 CRUD (이미지 업로드 포함)
28. 매장 관리 CRUD (카카오 주소검색 연동)
29. 문의 관리 (목록/상태변경/삭제)

### Phase 5: 마무리 (1~2일)
30. SEO 최적화 (메타태그, OG, sitemap.xml, robots.txt)
31. 성능 최적화 (next/image, lazy loading, 번들 분석)
32. 모바일 전체 테스트 (360px, 480px, 768px)
33. 크로스 브라우저 테스트
34. 스팸 방지 (reCAPTCHA 또는 허니팟) 적용
35. 배포 설정

---

## 8. 디렉토리 구조

```
foodmall/
├── public/
│   ├── images/              # 정적 이미지 (배너, 메뉴, 인테리어 등)
│   │   ├── hero/
│   │   ├── brand/
│   │   ├── menu/
│   │   ├── media/
│   │   ├── franchise/
│   │   └── interior/
│   ├── uploads/             # 동적 업로드 (팝업, 매장 사진)
│   └── favicon.png
├── src/
│   ├── app/
│   │   ├── layout.tsx       # 루트 레이아웃 (메타, 폰트)
│   │   ├── page.tsx         # 메인 페이지 (섹션 조합)
│   │   ├── globals.css      # Tailwind 기본 설정
│   │   ├── api/
│   │   │   ├── popups/route.ts
│   │   │   ├── stores/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── regions/route.ts
│   │   │   ├── inquiries/route.ts
│   │   │   └── admin/
│   │   │       ├── login/route.ts
│   │   │       ├── dashboard/route.ts
│   │   │       ├── popups/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       ├── stores/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       ├── inquiries/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       └── upload/route.ts
│   │   └── admin/
│   │       ├── layout.tsx     # 관리자 레이아웃 (사이드바)
│   │       ├── page.tsx       # 대시보드
│   │       ├── login/page.tsx
│   │       ├── popups/page.tsx
│   │       ├── stores/page.tsx
│   │       └── inquiries/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── MobileMenu.tsx    # 모바일 햄버거 메뉴
│   │   │   ├── Footer.tsx
│   │   │   ├── SkyBar.tsx        # 데스크톱 상단 문의 바
│   │   │   └── MobileCTA.tsx     # 모바일 하단 플로팅 버튼
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── BrandSection.tsx
│   │   │   ├── MenuSlideSection.tsx
│   │   │   ├── MediaSection.tsx
│   │   │   ├── FranchiseSection.tsx
│   │   │   ├── InteriorSection.tsx
│   │   │   ├── MenuTabSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   └── StoreSection.tsx
│   │   ├── popup/
│   │   │   └── PopupManager.tsx
│   │   ├── ui/
│   │   │   ├── Slider.tsx
│   │   │   ├── KakaoMap.tsx
│   │   │   ├── BottomSheet.tsx   # 모바일 하단 시트
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx      # 로딩 스켈레톤
│   │   │   └── Toast.tsx         # 알림 토스트
│   │   └── admin/
│   │       ├── Sidebar.tsx
│   │       ├── StatsCard.tsx
│   │       ├── DataTable.tsx
│   │       └── FormModal.tsx
│   ├── lib/
│   │   ├── mongodb.ts           # MongoDB 연결 (싱글톤)
│   │   ├── email.ts             # Nodemailer 설정
│   │   ├── auth.ts              # JWT 인증 유틸
│   │   └── upload.ts            # 이미지 업로드 유틸
│   ├── models/
│   │   ├── Popup.ts             # Mongoose 스키마
│   │   ├── Store.ts
│   │   └── Inquiry.ts
│   ├── hooks/
│   │   ├── useMediaQuery.ts     # 반응형 훅
│   │   └── useInView.ts         # 스크롤 감지
│   └── types/
│       └── index.ts
├── scripts/
│   └── seed.ts                  # 시드 데이터 스크립트
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── .env.local
```

---

## 9. 환경변수 (.env.local)

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/foodmall?retryWrites=true&w=majority

# SMTP (이메일)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_TO=client@example.com
MAIL_FROM="프랜차이즈 문의 <noreply@example.com>"

# 카카오맵
NEXT_PUBLIC_KAKAO_MAP_KEY=your-kakao-javascript-key

# 관리자 인증
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$...  # bcrypt 해시값
JWT_SECRET=your-jwt-secret-key

# 사이트 정보
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=프랜차이즈명
NEXT_PUBLIC_PHONE=1668-1977

# reCAPTCHA (선택)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

---

## 10. 모바일 UX 체크리스트

구현 시 아래 항목을 반드시 확인합니다.

### 터치 인터랙션
- [ ] 모든 터치 타겟 최소 44x44px
- [ ] 슬라이더 터치 스와이프 동작 확인
- [ ] 폼 입력 시 가상 키보드에 의한 레이아웃 깨짐 방지
- [ ] tel: 링크 모바일에서 전화 앱 연결 확인
- [ ] 팝업 닫기 버튼 터치 용이성

### 레이아웃
- [ ] 360px(Galaxy S series) 최소 폭에서 가로 스크롤 없음
- [ ] 100svh 사용 (iOS Safari 주소창 고려)
- [ ] 모바일 네비게이션(햄버거) 정상 동작
- [ ] 하단 플로팅 CTA 버튼이 콘텐츠를 가리지 않음 (하단 패딩)
- [ ] 카카오맵 모바일에서 핀치 줌 동작

### 성능
- [ ] 모바일 이미지는 적절한 srcSet으로 작은 크기 제공
- [ ] 뷰포트 밖 이미지 lazy loading
- [ ] 모바일에서 Lighthouse Performance 85+
- [ ] 첫 로드 시 LCP 2.5초 이내

### 폼
- [ ] 연락처 입력 시 `inputMode="numeric"` (숫자 키패드)
- [ ] 폼 제출 후 성공/실패 피드백 모달
- [ ] 하단 시트 폼 외부 클릭 시 닫힘
- [ ] 입력 중 하단 시트가 키보드에 가리지 않도록 스크롤

---

## 11. 참조 사이트 매장 데이터 (시드)

현재 wandduk.com에 등록된 매장 28개:

| 지역 | 매장 |
|------|------|
| 대구 | 본점, 고성점, 매천점, 테크노폴리스점, 성서점, 황금점, 만촌점, 동대구점, 죽전점, 동성로점, 신암점, 월배점, 다사점, 두류점 |
| 부산 | 부산본점, 온천점, 시청점, 광안리점, 센텀점, 서면일번가점, 화명점, 해운대좌동점 |
| 경북 | 경산사동점, 경산옥산점, 구미인동점 |
| 경남 | 밀양내이점, 창원중동점 |

> 실제 구현 시에는 고객사의 브랜드/매장 데이터로 교체합니다.

---

## 12. 비기능 요구사항

| 항목 | 요구사항 |
|------|---------|
| 반응형 | Mobile-First: xs(0), sm(480), md(768), lg(1024), xl(1280) |
| SEO | title, description, OG 태그, sitemap.xml, robots.txt, 구조화 데이터 |
| 성능 | Lighthouse 85+(모바일), 90+(데스크톱), LCP < 2.5s |
| 보안 | JWT httpOnly 쿠키, CSRF 보호, XSS 방지, Rate Limiting, reCAPTCHA |
| 접근성 | WCAG 2.1 AA, 키보드 네비게이션, alt 텍스트, 적절한 색상 대비 |
| 브라우저 | Chrome, Safari, Samsung Internet, Firefox, Edge (최신 2버전) |
| 이미지 | WebP/AVIF 자동 변환 (next/image), srcSet 반응형 |

---

## 13. 고객사 확인 필요 사항

구현 착수 전 고객사에 확인이 필요한 항목:

1. **브랜드 에셋**: 로고 파일(SVG/PNG), 브랜드 컬러, 폰트
2. **콘텐츠 이미지**: 히어로 배너, 메뉴 사진, 인테리어 사진, 미디어 로고
3. **텍스트 콘텐츠**: 브랜드 스토리, 가맹 안내 내용, 회사 정보
4. **매장 데이터**: 전체 매장 목록 (이름, 주소, 좌표, 전화번호)
5. **이메일 수신처**: 문의 접수 시 수신할 이메일 주소
6. **도메인**: 사용할 도메인명
7. **호스팅**: Vercel / 자체 서버 / Cafe24 등 호스팅 선호
8. **카카오 API 키**: 카카오 개발자 계정 및 앱 키
9. **개인정보 처리방침**: 법적 문구 제공 여부
10. **팝업 초기 콘텐츠**: 첫 팝업에 사용할 이미지/영상
