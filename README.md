# 🏠Livin
EFUB 5기 AWA 2팀 이방인(Stranger) 프론트엔드 레포지토리입니다

<img width="1920" height="1080" alt="Livin" src="https://github.com/user-attachments/assets/6c981190-1c32-4973-81a7-3b3fc1732acb" />

## 🎈About Livin
>살아본 곳의 진짜 이야기를 담다.
>살아본 경험이 모이는 대학생 주거 리뷰 플랫폼


### **Livin = Live + In**

_직접 살아본 대학생들의 리뷰가 모이는 공간_


## 🌊기능
- 자취방·하숙 후기 작성 및 검색 기능
- 지도 기반 위치 표시와 주변 편의시설 정보 제공
- 기숙사 건물·층·방 타입별 기숙사 후기 작성, 조회, 검색 기능
- 학교 이메일 기반 인증 후기 시스템


## 📅개발 기간
2025.09.01 - 2025.12.02

## 🔧기술 스택

### Communication
<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white">

### Language & Framework
<img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">

### State management
<img src="https://img.shields.io/badge/zustand-orange?style=for-the-badge&logo=zustand&logoColor=white"> <img src="https://img.shields.io/badge/axios-5728dd?style=for-the-badge&logo=axios&logoColor=white">

### Style
 <img src="https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white">

### Deploy
<img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">


## 👩‍💻프로젝트 팀원

|![](https://avatars.githubusercontent.com/u/201191817?v=4)|![](https://avatars.githubusercontent.com/u/126849308?v=4)|![](https://avatars.githubusercontent.com/u/180386497?v=4)|
|:---:|:---:|:---:|
|최서윤|김윤지|이유진|
|[seooyuun](https://github.com/seooyuun)|[ynjii](https://github.com/ynjii)|[pororori](https://github.com/pororori)|
|회원가입 페이지 / 로그인 페이지 / 마이페이지 / 홈페이지 퍼블리싱 및 api 연결|기숙사 리뷰 작성·조회 / 자취하숙 리뷰 작성·조회 페이지 퍼블리싱 및 api 연결|지도, 신규 데이터 등록, 자취방·하숙 데이터리스트 페이지 퍼블리싱 및 api 연결|

## 📂프로젝트 구조

```
📁FRONTEND/
│
├── .github/
│
└── livin/
    ├── .next/
    ├── apis/
    │   ├── auth.ts
    │   ├── axiosInstance.ts
    │   ├── bookmark.ts
    │   ├── comment.ts
    │   ├── dorm.ts
    │   ├── house.ts
    │   └── users.ts
    │
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   ├── signup/
    │   │   │   ├── components/
    │   │   │   │   ├── Step1.tsx
    │   │   │   │   ├── Step2.tsx
    │   │   │   │   ├── Step3.tsx
    │   │   │   │   └── Success.tsx
    │   │   │   ├── page.tsx
    │   │   │   └── Signup.styled.ts
    │   │   └── layout.tsx
    │   │
    │   ├── components/
    │   │   ├── Common/
    │   │   │   ├── FloatingWriteButton.tsx
    │   │   │   └── ImageUpload.tsx
    │   │   ├── Dorm/
    │   │   │   ├── DormReviewCard.tsx
    │   │   │   ├── Dropdown.tsx
    │   │   │   ├── EvaluationItem.tsx
    │   │   │   ├── EvaluationList.tsx
    │   │   │   ├── StarDisplay.tsx
    │   │   │   └── StarRating.tsx
    │   │   ├── Home/
    │   │   │   ├── Rooms/
    │   │   │   │   ├── Roomcard.tsx
    │   │   │   │   ├── RoomInfo.tsx
    │   │   │   │   └── TagComponents.tsx
    │   │   │   ├── DormList.tsx
    │   │   │   ├── PopularRooms.tsx
    │   │   │   └── TopSection.tsx
    │   │   ├── House/
    │   │   │   └── HouseReviewCard.tsx
    │   │   ├── NavigationBar/
    │   │   │   └── NavigationBar.tsx
    │   │   ├── BottomPopup.tsx
    │   │   ├── FilterFloating.tsx
    │   │   ├── FilterPopup.tsx
    │   │   ├── MapView.tsx
    │   │   ├── SearchBar.tsx
    │   │   ├── SelectButton.tsx
    │   │   └── TopBar.tsx
    │   │
    │   ├── dorm/
    │   │   ├── [id]/
    │   │   │   └── page.tsx
    │   │   ├── write/  
    │   │   │   └── page.tsx
    │   │   └── page.tsx
    │   │
    │   ├── home/
    │   │   └── page.tsx
    │   │
    │   ├── houses/
    │   │   ├── [id]/
    │   │   │   └── page.tsx
    │   │   ├── new/
    │   │   │   ├── step1/
    │   │   │   ├── step2/
    │   │   │   └── layout.tsx
    │   │   ├── review/[id]/
    │   │   │   └── page.tsx
    │   │   ├── write/
    │   │   │   ├── layout.tsx
    │   │   │   └── page.tsx
    │   │   └── page.tsx
    │   │
    │   ├── map/
    │   │   └── page.tsx
    │   │
    │   ├── mypage/
    │   │   ├── bookmark/
    │   │   │   └── page.tsx
    │   │   ├── comments/
    │   │   │   └── page.tsx
    │   │   ├── reviews/
    │   │   │   └── page.tsx
    │   │   └── page.tsx
    │   │
    │   ├── search/
    │   │   ├── step1/
    │   │   │   └── page.tsx
    │   │   ├── step2/
    │   │   │   └── page.tsx
    │   │   ├── step3/
    │   │   │   └── page.tsx
    │   │   └── page.tsx
    │   │
    │   ├── stores/
    │   │   └── useBookmarkStore.ts
    │   ├── styles/
    │   │   ├── GlobalStyle.ts
    │   │   ├── mapPage.module.css
    │   │   ├── styled.d.ts
    │   │   └── theme.ts
    │   ├── types/
    │   │   └── building.ts
    │   ├── layout.tsx
    │   ├── page.module.css
    │   ├── page.tsx
    │   └── providers.tsx
    │
    ├── hooks/
    │   ├── FilterContext.tsx
    │   ├── MapContext.tsx
    │   ├── useFilter.ts
    │   └── useMap.ts
    │
    ├── lib/
    │   └── registry.tsx
    │
    ├── node_modules/
    ├── public/
    ├── types/
    │
    ├── .env
    ├── .gitignore
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── tsconfig.json
    └── build.sh

```
