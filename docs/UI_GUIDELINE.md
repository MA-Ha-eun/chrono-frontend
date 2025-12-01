# 🎨 UI_GUIDELINE.md

**프로젝트:** Chrono (Side Project Tracker)

**버전:** v1.0

**업데이트:** 2025-12-02

---

## 📖 문서 사용법

이 가이드는 **Cursor AI가 바로 사용할 수 있도록** 작성되었습니다.

- 모든 색상은 Hex 코드로 명시
- Tailwind CSS 클래스명 포함
- 복사-붙여넣기 가능한 코드 예시 제공

---

## 🎯 디자인 철학

```
✨ 깔끔함 (Clean)
   - 불필요한 장식 없이
   - 정보 중심

🎨 모던함 (Modern)
   - 2025년 웹 트렌드
   - Linear, Vercel 스타일

💎 전문성 (Professional)
   - 실제 서비스 수준
   - 촌스럽지 않음

🚀 효율성 (Efficient)
   - 빠른 구현 가능
   - 일관된 디자인 시스템

```

---

## 🎨 색상 시스템

### Primary (청록/Teal)

```css
/* 메인 컬러 */
--primary: #14b8a6 --primary-light: #2dd4bf --primary-dark: #0d9488 /* 배경용 */
  --primary-50: #f0fdfa --primary-100: #ccfbf1;
```

**사용처:**

- 버튼 (Primary)
- 링크
- 커밋 수 강조
- 그래프 막대
- 진행중 뱃지
- 포커스 상태

### Gray Scale

```css
/* 텍스트 */
--gray-900: #111827 /* 제목 */ --gray-800: #1f2937 /* 본문 */
  --gray-700: #374151 /* 서브 */ --gray-600: #4b5563 --gray-500: #6b7280
  /* 설명 */ --gray-400: #9ca3af /* Placeholder */ /* 배경/테두리 */
  --gray-300: #d1d5db --gray-200: #e5e7eb /* 테두리 */ --gray-100: #f3f4f6
  --gray-50: #f9fafb /* 배경 */;
```

### Feedback Colors

```css
--success: #10b981 /* GitHub 잔디 느낌 */ --error: #ef4444 --warning: #f59e0b
  --info: #3b82f6;
```

### 색상 조합 규칙

```
배경: white 또는 gray-50
카드: white + border-gray-200 + shadow-sm
텍스트: gray-800 (본문), gray-500 (설명)
강조: primary (#14B8A6)

```

---

## ✏️ 타이포그래피

### 폰트

```css
font-family:
  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
  Arial, sans-serif;
```

또는 Pretendard 사용 (선택):

```html
<link
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
  rel="stylesheet"
/>
```

### 크기 & 용도

```tsx
/* 페이지 제목 */
className="text-2xl md:text-3xl font-bold text-gray-900"
예: "대시보드", "프로젝트 목록"

/* 섹션 제목 */
className="text-xl font-semibold text-gray-900"
예: "주간 커밋 활동", "최근 프로젝트"

/* 카드 제목 */
className="text-base font-semibold text-gray-900"
예: 프로젝트 이름

/* 본문 텍스트 */
className="text-sm text-gray-700"
예: 설명, 내용

/* 보조 텍스트 */
className="text-xs text-gray-500"
예: "2시간 전", "마지막 업데이트"

/* 강조 숫자 (커밋 수) */
className="text-3xl md:text-4xl font-bold text-[#14B8A6]"
예: "87", "108"

```

---

## 📏 간격 시스템

### 기본 단위

```
xs:  4px   (gap-1)
sm:  8px   (gap-2)
md:  12px  (gap-3)
lg:  16px  (gap-4)
xl:  24px  (gap-6)
2xl: 32px  (gap-8)

```

### 페이지 레벨

```tsx
/* 전체 컨테이너 */
<div className="min-h-screen bg-gray-50">
  /* 메인 콘텐츠 영역 */
  <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
    /* 섹션 간 간격 */
    <div className="space-y-8">{/* 섹션들... */}</div>
  </main>
</div>
```

### 카드 내부

```tsx
<div className="space-y-4 p-5">{/* 내용 */}</div>
```

### Grid 간격

```tsx
/* 카드 그리드 */
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
  {/* 카드들... */}
</div>
```

---

## 🎨 컴포넌트 스타일

### 1. 버튼

### Primary Button

```tsx
<button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#14B8A6] px-4 text-sm font-medium text-white transition-all duration-150 hover:bg-[#0D9488] focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
  <span>버튼 텍스트</span>
</button>
```

### Secondary Button

```tsx
<button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-all duration-150 hover:border-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
  <span>버튼 텍스트</span>
</button>
```

### Ghost Button (아이콘용)

```tsx
<button className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-all duration-150 hover:bg-gray-100 hover:text-gray-700 active:scale-95">
  {/* 아이콘 */}
</button>
```

### Button Sizes

```tsx
/* Small */
className = "h-8 px-3 text-xs";

/* Medium (기본) */
className = "h-10 px-4 text-sm";

/* Large */
className = "h-12 px-6 text-base";

/* Full Width */
className = "w-full";
```

---

### 2. 카드

### 기본 카드

```tsx
<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">
  {/* 내용 */}
</div>
```

### 클릭 가능한 카드

```tsx
<div className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-gray-300 hover:shadow-md active:scale-[0.99]">
  {/* 내용 */}
</div>
```

### 대시보드 통계 카드

```tsx
<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
  {/* 라벨 */}
  <div className="mb-2 text-sm text-gray-500">이번 달 커밋</div>

  {/* 숫자 */}
  <div className="mb-1 text-4xl font-bold text-[#14B8A6]">108</div>

  {/* 보조 정보 */}
  <div className="text-xs text-gray-400">전월 대비 +12</div>
</div>
```

### 프로젝트 카드

```tsx
<div className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">
  {/* 헤더 */}
  <div className="mb-4 flex items-start justify-between">
    <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
      Project Tracker
    </h3>
    <span className="ml-2 shrink-0 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-[#14B8A6]">
      진행중
    </span>
  </div>

  {/* 커밋 수 */}
  <div className="mb-4 flex items-baseline gap-2">
    <span className="text-3xl font-bold text-[#14B8A6]">87</span>
    <span className="text-sm text-gray-500">commits</span>
  </div>

  {/* Tech Stack */}
  <div className="flex flex-wrap gap-2">
    <span className="rounded-md bg-teal-50 px-2 py-1 text-xs text-[#14B8A6]">
      React
    </span>
    <span className="rounded-md bg-teal-50 px-2 py-1 text-xs text-[#14B8A6]">
      Java
    </span>
  </div>

  {/* 하단 정보 */}
  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
    <span>2시간 전 업데이트</span>
    <span>→</span>
  </div>
</div>
```

---

### 3. 입력 필드

### Text Input

```tsx
<div className="space-y-1.5">
  <label className="block text-sm font-medium text-gray-700">제목</label>
  <input
    type="text"
    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 transition-all duration-150 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#14B8A6] focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
    placeholder="프로젝트 제목을 입력하세요"
  />
</div>
```

### Textarea

```tsx
<div className="space-y-1.5">
  <label className="block text-sm font-medium text-gray-700">설명</label>
  <textarea
    rows={4}
    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-all duration-150 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#14B8A6] focus:outline-none"
    placeholder="프로젝트 설명을 입력하세요"
  />
</div>
```

### Select

```tsx
<div className="space-y-1.5">
  <label className="block text-sm font-medium text-gray-700">Repository</label>
  <select className="h-10 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 transition-all duration-150 focus:border-transparent focus:ring-2 focus:ring-[#14B8A6] focus:outline-none">
    <option>선택하세요</option>
    <option>project-tracker</option>
    <option>portfolio-site</option>
  </select>
</div>
```

### Error State

```tsx
<div className="space-y-1.5">
  <label className="block text-sm font-medium text-gray-700">제목</label>
  <input
    type="text"
    className="h-10 w-full rounded-lg border-2 border-red-500 bg-white px-3 text-sm text-gray-900 transition-all duration-150 focus:ring-2 focus:ring-red-500 focus:outline-none"
  />
  <p className="text-xs text-red-500">제목은 필수입니다</p>
</div>
```

---

### 4. 뱃지/태그

### 상태 뱃지

```tsx
/* 진행중 */
<span className="inline-flex items-center gap-1 px-2.5 py-1
  rounded-full text-xs font-medium
  bg-teal-50 text-[#14B8A6]">
  <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></span>
  진행중
</span>

/* 완료 */
<span className="inline-flex items-center gap-1 px-2.5 py-1
  rounded-full text-xs font-medium
  bg-green-50 text-green-700">
  <span className="w-1.5 h-1.5 rounded-full bg-green-700"></span>
  완료
</span>

/* 중단 */
<span className="inline-flex items-center gap-1 px-2.5 py-1
  rounded-full text-xs font-medium
  bg-gray-100 text-gray-600">
  <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
  중단
</span>

```

### Tech Stack 태그

```tsx
<span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-[#14B8A6]">
  React
</span>
```

---

### 5. 네비게이션

### 상단 네비게이션

```tsx
<nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
  <div className="mx-auto max-w-6xl px-4 md:px-6">
    <div className="flex h-16 items-center justify-between">
      {/* 로고 */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#0D9488]">
          <span className="text-sm font-bold text-white">D</span>
        </div>
        <span className="text-lg font-bold text-gray-900">Chrono</span>
      </div>

      {/* 메뉴 */}
      <div className="hidden items-center gap-1 md:flex">
        <a
          href="#"
          className="rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-[#14B8A6]"
        >
          대시보드
        </a>
        <a
          href="#"
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          프로젝트
        </a>
        <a
          href="#"
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          설정
        </a>
      </div>

      {/* 유저 */}
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-gray-700 md:block">지민</span>
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
      </div>
    </div>
  </div>
</nav>
```

---

### 6. 로딩 상태

### 버튼 로딩

```tsx
<button
  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#14B8A6] px-4 text-sm font-medium text-white"
  disabled
>
  {/* 스피너 */}
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>

  <span>로딩 중...</span>
</button>
```

### 페이지 로딩

```tsx
<div className="flex min-h-screen items-center justify-center">
  <div className="space-y-4 text-center">
    {/* 스피너 */}
    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#14B8A6]"></div>
    <p className="text-sm text-gray-500">로딩 중...</p>
  </div>
</div>
```

### Skeleton (카드용)

```tsx
<div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5">
  <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
  <div className="mb-4 h-8 w-1/2 rounded bg-gray-200"></div>
  <div className="flex gap-2">
    <div className="h-6 w-16 rounded bg-gray-200"></div>
    <div className="h-6 w-16 rounded bg-gray-200"></div>
  </div>
</div>
```

---

### 7. 차트 (Chart.js)

```tsx
import { Bar } from "react-chartjs-2";

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#14B8A6",
      padding: 12,
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#14B8A6",
      borderWidth: 0,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#6B7280",
        font: {
          size: 12,
        },
      },
    },
    y: {
      grid: {
        color: "#F3F4F6",
        drawBorder: false,
      },
      ticks: {
        color: "#6B7280",
        font: {
          size: 12,
        },
      },
    },
  },
};

const chartData = {
  labels: ["월", "화", "수", "목", "금", "토", "일"],
  datasets: [
    {
      data: [3, 5, 7, 0, 4, 2, 1],
      backgroundColor: "#14B8A6",
      hoverBackgroundColor: "#0D9488",
      borderRadius: 6,
      barThickness: 40,
    },
  ],
};

<div className="h-64">
  <Bar options={chartOptions} data={chartData} />
</div>;
```

---

## 📱 반응형 규칙

### Breakpoints

```
sm:  640px  (모바일 가로)
md:  768px  (태블릿)
lg:  1024px (데스크탑)
xl:  1280px (큰 데스크탑)

```

### 일반 패턴

```tsx
/* 텍스트 크기 */
className = "text-2xl md:text-3xl";

/* 패딩 */
className = "p-4 md:p-6";

/* Grid */
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

/* 숨김/보임 */
className = "hidden md:block"; // 모바일 숨김
className = "md:hidden"; // 데스크탑 숨김

/* Gap */
className = "gap-4 md:gap-6";
```

---

## 🎬 애니메이션

### Transition

```tsx
/* 기본 */
className = "transition-all duration-150";

/* 느린 */
className = "transition-all duration-300";

/* 색상만 */
className = "transition-colors duration-150";

/* Transform만 */
className = "transition-transform duration-150";
```

### Hover 효과

```tsx
/* 카드 */
hover:shadow-md hover:scale-[1.01]

/* 버튼 */
hover:bg-[#0D9488] active:scale-95

/* 링크 */
hover:text-[#14B8A6] hover:underline

```

---

## 📄 페이지별 레이아웃

### 대시보드

```tsx
<div className="min-h-screen bg-gray-50">
  <nav>{/* 네비게이션 */}</nav>

  <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
    {/* 페이지 헤더 */}
    <div className="mb-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
        대시보드
      </h1>
      <p className="text-sm text-gray-500">당신의 프로젝트 활동을 한눈에</p>
    </div>

    {/* 요약 카드 */}
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
      {/* 통계 카드 3개 */}
    </div>

    {/* 주간 그래프 */}
    <div className="mb-8">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          주간 커밋 활동
        </h2>
        {/* 차트 */}
      </div>
    </div>

    {/* 최근 프로젝트 */}
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        최근 프로젝트
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 프로젝트 카드들 */}
      </div>
    </div>
  </main>
</div>
```

### 로그인 페이지

```tsx
<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
  <div className="w-full max-w-md">
    {/* 로고 */}
    <div className="mb-8 text-center">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488]">
        <span className="text-2xl font-bold text-white">D</span>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Chrono</h1>
      <p className="text-sm text-gray-500">개발자의 프로젝트 활동 추적</p>
    </div>

    {/* 로그인 카드 */}
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <form className="space-y-4">
        {/* 입력 필드들 */}
        <button type="submit" className="w-full ...">
          로그인
        </button>
      </form>
    </div>
  </div>
</div>
```

---

## 🎯 Cursor 프롬프트 템플릿

### 대시보드 페이지

```
UI_GUIDELINE.md를 기반으로 대시보드 페이지를 만들어줘.

레이아웃:
- 상단: 요약 카드 3개 (grid 1/3 반응형)
  - 진행 중 프로젝트 수
  - 완료 프로젝트 수
  - 이번 달 커밋 수
- 중간: 주간 커밋 그래프 (Chart.js Bar 차트)
- 하단: 최근 프로젝트 리스트 (카드 2열)

색상:
- Primary: #14B8A6 (청록)
- 커밋 수는 청록색으로 강조
- 회색 배경 (#F9FAFB)
- 흰색 카드

스타일:
- 모든 카드는 rounded-xl, shadow-sm
- hover 시 shadow-md
- 간격은 gap-4 또는 gap-6
- Tailwind CSS 사용

```

### 프로젝트 목록 페이지

```
UI_GUIDELINE.md를 기반으로 프로젝트 목록 페이지를 만들어줘.

레이아웃:
- 상단: 제목 + "새 프로젝트" 버튼
- 카드 그리드 (2열 반응형)

카드 내용:
- 제목 + 상태 뱃지
- 커밋 수 (청록색 강조)
- Tech Stack 태그들
- 하단: 업데이트 시간

상태 뱃지:
- 진행중: bg-teal-50 text-[#14B8A6]
- 완료: bg-green-50 text-green-700

인터랙션:
- 카드 hover 시 shadow-md, scale-[1.01]
- 클릭하면 상세 페이지로

```

---

## ✅ 체크리스트

구현 전 확인사항:

```
□ 색상 코드 (#14B8A6) 정확히 사용
□ 모든 카드 rounded-xl
□ hover 효과 적용
□ transition-all duration-150
□ 반응형 (md: breakpoint)
□ 텍스트 크기 일관성
□ 간격 (gap-4, gap-6) 통일
□ 로딩/에러 상태 처리
□ 포커스 ring 적용 (접근성)

```
