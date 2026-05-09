# 🐾 PAWSOMEDAY Backend

> 반려동물 돌봄 센터와 보호자를 연결하는 **Pet Care Center Management App**  
> Backend Repository by **Dovelopers**

<br />

## 📝 프로젝트 소개

**PAWSOMEDAY**는 반려동물 돌봄 센터와 보호자가 더 쉽고 신뢰성 있게 소통할 수 있도록 돕는 모바일 애플리케이션입니다.

보호자는 반려동물 프로필을 등록하고 돌봄 센터를 검색해 예약할 수 있으며, 센터는 예약된 반려동물의 데일리 케어 일지와 사진을 관리할 수 있습니다.  
또한 업로드된 사진을 AI 서버와 연동해 반려동물별 사진으로 매칭하고, 보호자에게 더 생생한 케어 기록을 전달하는 것을 목표로 합니다.

<br />

## 🎥 데모 & 발표자료

### 프로젝트 데모

- [📱 앱 시연 영상](https://www.canva.com/design/DAGYkH_AXNE/FtMGOie2TOI1_TAK1-ex1w/edit?utm_content=DAGYkH_AXNE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

### 발표 자료

- [📊 프로젝트 소개 PPT](https://www.figma.com/slides/tsxvJmeHWFl0pkZJ8CatkU/Final-Demo?node-id=1-25&t=CNlIz0thWo28wEbt-1)

<br />

## ✨ 핵심 가치

- 💝 보호자가 안심할 수 있는 반려동물 케어 기록 제공
- 🤝 보호자와 센터 간의 원활한 예약 및 커뮤니케이션
- 📝 일지와 사진을 통한 투명한 돌봄 히스토리 관리
- 🤖 AI 기반 사진 분류를 통한 효율적인 케어 리포트 지원

<br />

## ⭐️ 주요 기능

### 보호자용 기능

- Firebase 인증 기반 회원가입 및 로그인
- 반려동물 프로필 등록, 조회, 수정, 삭제
- 돌봄 센터 검색 및 상세 정보 조회
- 센터 예약 신청
- 예약 현황 및 케어 히스토리 확인
- 데일리 케어 일지 및 사진 확인

### 센터용 기능

- 센터 정보 등록, 조회, 수정, 삭제
- 예약 요청 조회
- 예약 승인 및 거절
- 당일 예약된 반려동물 목록 조회
- 데일리 케어 일지 작성, 수정, 전송
- 사진 업로드 및 반려동물별 사진 전송
- AI 서버 연동을 통한 반려동물 사진 매칭 지원

<br />

## 🛠 기술 스택

### Backend

| Category | Stack |
| --- | --- |
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| ORM | Prisma |
| Database | SQLite |
| Authentication | Firebase Admin SDK |
| Storage | Firebase Storage / AWS S3 |
| API Docs | Swagger |
| HTTP Logging | Morgan, Jet Logger |
| Deployment | GitHub Actions, Ubuntu EC2, PM2 |

### AI / ML 연동

- 센터가 업로드한 당일 사진 데이터를 ML API 서버로 전송
- 당일 예약된 반려동물의 얼굴 이미지 데이터와 매칭
- 매칭 결과를 기반으로 `DiaryPhoto` 데이터 생성
- 매칭되지 않은 반려동물도 빈 사진 묶음으로 `DiaryPhoto` 생성

<br />

## 🗂 프로젝트 구조

```bash
src
├── common          # 공통 path, response 등
├── controllers     # API 비즈니스 로직
├── lib             # Prisma, Storage, ML Handler, Error 관리
├── middlewares     # Auth, LoginUser, Logger, Multer 등
├── routes          # API 라우터
├── types           # Express 타입 확장
├── utils           # 날짜 포맷 및 유틸 함수
├── app.ts          # Express 앱 진입점
└── swaggerConfig.ts
```

<br />

## 🧩 데이터 모델

주요 Prisma 모델은 다음과 같습니다.

| Model | Description |
| --- | --- |
| `User` | 보호자 또는 센터 사용자 정보 |
| `Center` | 돌봄 센터 정보 |
| `Dog` | 반려동물 프로필 |
| `Reservation` | 센터 예약 정보 |
| `DiaryNote` | 데일리 케어 일지 |
| `DiaryPhoto` | 반려동물별 케어 사진 묶음 |
| `File` | 업로드된 이미지 파일 정보 |

> 현재 DB Provider는 `sqlite`이며, Prisma Schema에 PostgreSQL Migration 관련 TODO가 남아 있습니다.

<br />

## 🔐 인증 방식

PAWSOMEDAY Backend는 **Firebase ID Token 기반 인증**을 사용합니다.

인증이 필요한 API 요청에는 아래 형식의 Authorization Header가 필요합니다.

```http
Authorization: Bearer <Firebase ID Token>
```

<br />

## 📚 API 문서

서버 실행 후 Swagger 문서는 아래 경로에서 확인할 수 있습니다.

```bash
http://localhost:8080/api-docs
```

<br />

## 🔗 주요 API

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | 회원가입 |
| `POST` | `/api/auth/login` | 로그인 |

### User

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/user/info/:id` | 사용자 정보 조회 |
| `PUT` | `/api/user/update` | 사용자 정보 수정 |

### Dog

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/dog/add` | 반려동물 등록 |
| `GET` | `/api/dog/all` | 내 반려동물 목록 조회 |
| `GET` | `/api/dog/info/:id` | 반려동물 상세 조회 |
| `PUT` | `/api/dog/update/:id` | 반려동물 정보 수정 |
| `DELETE` | `/api/dog/delete/:id` | 반려동물 삭제 |
| `GET` | `/api/dog/reservations/today` | 센터의 당일 예약 반려동물 조회 |

### Center

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/center/add` | 센터 등록 |
| `GET` | `/api/center/info/:id` | 센터 상세 조회 |
| `PUT` | `/api/center/update/:id` | 센터 정보 수정 |
| `DELETE` | `/api/center/delete/:id` | 센터 삭제 |
| `GET` | `/api/center/search` | 센터 검색 |

### Reservation

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/reservation/add` | 예약 신청 |
| `GET` | `/api/reservation/owner/all` | 보호자 예약 목록 조회 |
| `GET` | `/api/reservation/center/all` | 센터 예약 요청 조회 |
| `PUT` | `/api/reservation/accept/:id` | 예약 승인 |
| `PUT` | `/api/reservation/decline/:id` | 예약 거절 |

### Diary

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/diary` | 특정 반려동물의 일지 및 사진 조회 |
| `POST` | `/api/diary/add/note` | 케어 일지 작성 |
| `PUT` | `/api/diary/update/note/:id` | 케어 일지 수정 |
| `PUT` | `/api/diary/send/note/:id` | 케어 일지 전송 |
| `PUT` | `/api/diary/send/photo/:id` | 케어 사진 전송 |
| `GET` | `/api/diary/note/info/:id` | 케어 일지 상세 조회 |
| `GET` | `/api/diary/photo/info/:id` | 케어 사진 상세 조회 |

### Picture

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/picture/all` | 업로드된 사진 목록 조회 |
| `POST` | `/api/picture/upload` | 사진 업로드 |

<br />

## 🚀 시작하기

### 필수 설치 항목

- Node.js 20.x 권장
- npm
- Firebase Admin SDK Key
- Prisma
- SQLite 또는 Prisma에서 사용할 DB 환경

### 설치 방법

```bash
git clone https://github.com/gpbl-doveloper/back.git
cd back

npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
PORT=8080
DATABASE_URL="file:./dev.db"

FIREBASE_SERVICE_ACCOUNT_PATH="./serviceAccountKey.json"
FIREBASE_STORAGE_BUCKET="your-firebase-storage-bucket"

STORAGE_PROVIDER="firebase"
# STORAGE_PROVIDER="s3"

AWS_REGION="your-aws-region"
AWS_BUCKET_NAME="your-s3-bucket-name"

ML_API_URL="http://localhost:8000"
```

> 실제 Firebase Admin SDK Key, AWS Key, `.env` 파일은 절대 GitHub에 커밋하지 않습니다.

### Prisma 설정

```bash
npx prisma generate
npm run db:push
```

### 개발 서버 실행

```bash
npm run dev
```

서버 실행 후 아래 주소에서 API 문서를 확인할 수 있습니다.

```bash
http://localhost:8080/api-docs
```

<br />

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | TypeScript 빌드 |
| `npm start` | 빌드된 서버 실행 |
| `npm run db:push` | Prisma schema를 DB에 반영 |
| `npm run studio` | Prisma Studio 실행 |

<br />

## 🚢 Deployment

이 프로젝트는 GitHub Actions를 통해 `develop` 브랜치에 push될 때 Ubuntu EC2 서버로 배포됩니다.

배포 과정은 다음과 같습니다.

1. GitHub Actions에서 의존성 설치
2. `.env` 및 Firebase Admin SDK Key 생성
3. Prisma Client 생성
4. TypeScript 빌드
5. EC2 서버로 `dist` 및 환경 파일 전송
6. EC2에서 `git pull`, `npm install`, `prisma db push` 실행
7. PM2로 `pawsomeday` 프로세스 실행
8. PM2로 Prisma Studio 프로세스 실행

### Deployment Architecture

<img width="3840" height="2160" alt="PAWSOMEDAY deployment architecture" src="https://github.com/user-attachments/assets/4ed25d6c-81ec-442c-8c59-44973150918b" />

<br />

## 🤝 기여하기

1. 이 저장소를 Fork 합니다.
2. Feature 브랜치를 생성합니다.

```bash
git checkout -b feature/amazing-feature
```

3. 변경사항을 Commit 합니다.

```bash
git commit -m "feat: add amazing feature"
```

4. 브랜치에 Push 합니다.

```bash
git push origin feature/amazing-feature
```

5. Pull Request를 생성합니다.

<br />

## 👥 팀 멤버

| Role | Member |
| --- | --- |
| 기획/디자인 | [@cathy0305](https://github.com/cathy0305) |
| 프론트엔드 | [@0yeonnnn0](https://github.com/0yeonnnn0) |
| 백엔드 | [@haram8009](https://github.com/haram8009) |
| AI | [@nampaca123](https://github.com/nampaca123) |

<br />

## 📜 라이선스

이 프로젝트는 **ISC License**를 따릅니다.

<br />

---

Feel free to contact us if you have any questions! 🧡
