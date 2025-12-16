# 📘 API_SPEC.md

**Chrono – API 명세서**

버전: v1.1

작성일: 2025-12-02  
수정일: 2025-12-12

기반 문서: PRD.md, FRS.md

---

# 1. 개요

본 문서는 **Chrono**의 서버 API 명세서이다.

기능 요구사항(FRS)을 기반으로 각 엔드포인트의 요청/응답/에러코드를 상세하게 기술한다.

모든 API는 기본적으로 **`/api` prefix**를 사용한다.

---

# 2. 인증(Authentication)

## ✔ 인증 방식

- Authorization: `Bearer <access_token>`
- 대부분의 API는 인증 필요
- 인증 불필요 API:
  - 회원가입, 로그인

## ✔ 인증 실패 응답

```json
{
  "message": "Unauthorized",
  "code": "UNAUTHORIZED"
}
```

---

# 3. 에러 응답 공통 구조

```json
{
  "message": "에러 메시지",
  "code": "ERROR_CODE"
}
```

공통 에러 코드:

| code             | 의미           |
| ---------------- | -------------- |
| UNAUTHORIZED     | 토큰 없음/만료 |
| FORBIDDEN        | 권한 없음      |
| VALIDATION_ERROR | 필드 검증 실패 |
| NOT_FOUND        | 리소스 없음    |
| SERVER_ERROR     | 서버 오류      |

GitHub 관련 에러 코드:

| code                    | 의미                   |
| ----------------------- | ---------------------- |
| GITHUB_USERNAME_NOT_SET | GitHub username 미설정 |
| GITHUB_USER_NOT_FOUND   | GitHub 사용자 없음     |
| GITHUB_RATE_LIMIT       | GitHub Rate Limit 초과 |
| GITHUB_REPO_NOT_FOUND   | Repo 존재하지 않음     |

---

# 4. Auth API

## 🔹 4.1 회원가입

### `POST /api/auth/signup`

**인증:** 불필요

### Request

```json
{
  "email": "user@example.com",
  "password": "12345678",
  "nickname": "jimin"
}
```

### Response 201

```json
{
  "id": 1,
  "email": "user@example.com",
  "nickname": "jimin"
}
```

---

## 🔹 4.2 로그인

### `POST /api/auth/login`

**인증:** 불필요

### Request

```json
{
  "email": "user@example.com",
  "password": "12345678"
}
```

### Response 200

```json
{
  "accessToken": "eyJhbGciOiJIUzI...",
  "nickname": "jimin"
}
```

**비고**: Refresh Token은 HttpOnly Cookie로 전송됨

---

## 🔹 4.3 Refresh Token으로 Access Token 재발급

### `POST /api/auth/refresh`

**인증:** 불필요 (Refresh Token 쿠키 필요)

### Request

쿠키에 `refreshToken` 포함 (HttpOnly Cookie)

### Response 200

```json
"eyJhbGciOiJIUzIOTgsImV4cCI6MTc2NDkyNjY~~~~~~~"
```

Access Token 문자열 반환

### Error

- Refresh Token 없음 → 401 UNAUTHORIZED
- Refresh Token 유효하지 않음 → 401 UNAUTHORIZED
- Refresh Token 불일치 → 401 UNAUTHORIZED

---

## 🔹 4.4 로그아웃

### `POST /api/auth/logout`

**인증:** 필요

### Request

본문 없음 (인증 토큰만 필요)

### Response 200

```json
{
  "message": "로그아웃 성공"
}
```

**비고**: 서버 측 Refresh Token 삭제 및 쿠키 제거

---

## 🔹 4.5 이메일 인증코드 발송

### `POST /api/auth/email/send`

**인증:** 불필요

### Request

```json
{
  "email": "user@example.com"
}
```

### Response 200

이메일 인증코드 발송 완료

---

## 🔹 4.6 이메일 인증코드 확인

### `POST /api/auth/email/verify`

**인증:** 불필요

### Request

```json
{
  "email": "user@example.com",
  "code": "A1B2C3D4"
}
```

### Response 200

인증코드 확인 완료

**비고:** 회원가입 전 이메일 인증이 완료되어야 함

---

# 5. User API

## 🔹 5.1 내 정보 조회

### `GET /api/users/me`

**인증:** 필요

### Response

```json
{
  "id": 1,
  "email": "user@example.com",
  "nickname": "jimin",
  "bio": "hi!",
  "githubUsername": "jimin-dev"
}
```

---

## 🔹 5.2 GitHub Username 설정

### `PUT /api/users/me/github`

**인증:** 필요

### Request

```json
{
  "githubUsername": "jimin-dev"
}
```

### Response 200

```json
{
  "githubUsername": "jimin-dev"
}
```

### Error

- 사용자 없음 → NOT_FOUND
- GitHub 유저 없음 → GITHUB_USER_NOT_FOUND

---

## 🔹 (SHOULD) 5.3 프로필 수정

### `PUT /api/users/me`

**인증:** 필요

### Request

```json
{
  "nickname": "새 닉네임",
  "bio": "한줄 소개"
}
```

### Response 200

```json
{
  "id": 1,
  "email": "user@example.com",
  "nickname": "새 닉네임",
  "bio": "한줄 소개",
  "githubUsername": "jimin-dev"
}
```

---

## 🔹 5.4 비밀번호 변경

### `PUT /api/users/me/password`

**인증:** 필요

### Request

```json
{
  "currentPassword": "현재비밀번호",
  "newPassword": "새비밀번호123!"
}
```

**조건:** 새 비밀번호는 영문, 숫자, 특수문자 포함 8자 이상

### Response 200

```json
{
  "message": "비밀번호가 변경되었습니다."
}
```

### Error

- 현재 비밀번호 불일치 → VALIDATION_ERROR
- 새 비밀번호 조건 불만족 → VALIDATION_ERROR

---

## 🔹 5.5 회원탈퇴

### `DELETE /api/users/me`

**인증:** 필요

### Request

본문 없음 (인증 토큰만 필요)

### Response 204

내용 없음

**비고:** 회원 탈퇴 시 관련 프로젝트 및 커밋 데이터 처리 필요

---

# 6. GitHub API (Server-to-GitHub)

## 🔹 6.1 Repo 리스트 조회

### `GET /api/github/repos`

**인증:** 필요

**전제:** githubUsername 존재해야 함

### Response

```json
[
  {
    "name": "project-tracker",
    "fullName": "jimin-dev/project-tracker",
    "description": "사이드 프로젝트 관리 앱",
    "htmlUrl": "https://github.com/jimin-dev/project-tracker",
    "private": false
  }
]
```

### Error

- GitHub username 미설정 → GITHUB_USERNAME_NOT_SET
- GitHub 유저 없음 → GITHUB_USER_NOT_FOUND
- Rate Limit → GITHUB_RATE_LIMIT

---

## 🔹 6.2 GitHub Username 유효성 검증

### `GET /api/github/validate?username=simuneu`

**인증:** 불필요

### Request

Query Parameter: `username` (String)

### Response 200

**성공 시:**
```json
{
  "valid": true,
  "username": "simuneu",
  "avatarUrl": "https://github.com/simuneu.png",
  "message": "존재하는 GitHub 사용자입니다."
}
```

**실패 시:**
```json
{
  "valid": false,
  "username": "simuneuffff",
  "avatarUrl": null,
  "message": "존재하지 않는 GitHub 사용자입니다."
}
```

**비고:** GitHub username 입력 시 실시간 유효성 검증에 활용 가능

---

## 🔹 6.3 GitHub 기본 연동

### `POST /api/github/connect-basic`

**인증:** 필요

### Request

```json
{
  "username": "simuneu"
}
```

### Response 200

```json
{
  "connected": true,
  "type": "BASIC",
  "username": "simuneu",
  "avatarUrl": "https://avatars.githubusercontent.com/u/191446770?v=4",
  "message": "기본 연동이 완료되었습니다."
}
```

**비고:** 
- Public repository만 접근 가능
- MVP에서는 기본 방식으로 사용

---

## 🔹 6.4 GitHub PAT 연동

### `POST /api/github/connect-pat`

**인증:** 필요

### Request

```json
{
  "username": "simuneu",
  "pat": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### Response 200

```json
{
  "connected": true,
  "type": "FULL",
  "message": "github full연동 완료"
}
```

**비고:**
- PAT는 암호화되어 저장됨
- Private repository 접근 가능
- 향후 버전에서 기본 연동 후 PAT 입력 옵션 제공 예정
- PAT 생성 가이드:
  - https://github.com/settings/tokens?type=beta 이동
  - [Generate new token] 클릭
  - Repository access: All repositories 또는 필요한 레포만 선택
  - Repository permissions: Contents (Read-only), Metadata (Read-only)
  - User permissions: Email addresses (Read-only), Profile (Read-only)

---

## 🔹 6.5 Repo 커밋 데이터 조회 (내부 호출)

### 사용처: 프로젝트 생성 시 자동 호출

### Response 예시

```json
{
  "totalCommits": 87,
  "lastCommitAt": "2025-11-20T10:22:31Z"
}
```

---

# 7. Project API

## 🔹 7.1 프로젝트 생성

### `POST /api/projects`

**인증:** 필요

**비고:** 현재 백엔드 작업 진행 중. 최종 스펙은 백엔드 작업 완료 후 확정 예정.

### Request

```json
{
  "owner": "jimin-dev",
  "repoName": "project-tracker",
  "repoUrl": "https://github.com/jimin-dev/project-tracker",
  "title": "Project Tracker",
  "description": "사이드 프로젝트 관리 도구",
  "techStack": ["React", "Spring", "MySQL"],
  "startDate": "2025-12-01",
  "targetDate": "2025-12-31"
}
```

**필수 필드:**
- `owner`: GitHub username
- `repoName`: Repository 이름
- `repoUrl`: Repository URL

**선택 필드:**
- `title`, `description`, `techStack`, `startDate`, `targetDate`

### Response 200

```json
{
  "projectId": 10
}
```

### Error

- 중복 등록 → 400 Bad Request (이미 등록된 프로젝트)
- GitHub Repo 조회 실패 → 400 Bad Request
- Private repo인데 PAT 미설정 → 400 Bad Request (PAT 등록 필요)

---

## 🔹 7.2 프로젝트 메타데이터 수정

### `PUT /api/projects/{projectId}/meta`

**인증:** 필요

### Request

```json
{
  "title": "수정된 제목",
  "description": "업데이트 설명",
  "techStack": ["React", "Spring"],
  "startDate": "2025-12-01",
  "targetDate": "2026-01-01"
}
```

**비고:** 모든 필드는 선택사항. 수정할 필드만 포함하면 됨.

### Response 200

내용 없음 (204 No Content)

---

## 🔹 7.3 프로젝트 상태 변경

### `PATCH /api/projects/{projectId}/status`

**인증:** 필요

### Request

```json
{
  "status": "COMPLETED"
}
```

**상태값:** `IN_PROGRESS` 또는 `COMPLETED`

### Response 200

내용 없음 (204 No Content)

---

## 🔹 7.4 프로젝트 삭제 (소프트 삭제)

### `PATCH /api/projects/{projectId}/active`

**인증:** 필요

### Request

```json
{
  "active": false
}
```

**비고:** 
- `active: false` → 프로젝트 비활성화 (소프트 삭제)
- `active: true` → 프로젝트 활성화 (복구)
- 비활성화된 프로젝트는 목록 조회에서 제외됨

### Response 200

내용 없음 (204 No Content)

---

## 🔹 7.5 프로젝트 목록 조회

### `GET /api/projects`

**인증:** 필요

**정렬:** 최근 커밋 날짜 기준 내림차순

**비고:** 활성화된 프로젝트(`active: true`)만 조회됨

### Response 200

```json
[
  {
    "projectId": 10,
    "owner": "jimin-dev",
    "repoName": "project-tracker",
    "repoUrl": "https://github.com/jimin-dev/project-tracker",
    "active": true,
    "createdAt": "2025-12-13T19:38:57.93523",
    "title": "Project Tracker",
    "status": "IN_PROGRESS",
    "techStack": ["React", "Spring"],
    "totalCommits": 87,
    "lastCommitAt": "2025-11-20T10:22:31",
    "startDate": "2025-11-20",
    "targetDate": "2025-12-31"
  }
]
```

**비고:**
- `active: false`인 프로젝트는 목록에 포함되지 않음
- `techStack`은 문자열 배열 (null 가능)
- `title`, `description`, `startDate`, `targetDate`는 null 가능 (메타데이터 미입력 시)

---

## 🔹 7.6 프로젝트 상세 조회

### `GET /api/projects/{projectId}`

**인증:** 필요

### Response 200

```json
{
  "projectId": 10,
  "owner": "jimin-dev",
  "repoName": "project-tracker",
  "repoUrl": "https://github.com/jimin-dev/project-tracker",
  "title": "Project Tracker",
  "description": "사이드 프로젝트 관리 도구",
  "techStack": ["React", "Spring", "MySQL"],
  "startDate": "2025-11-20",
  "targetDate": "2025-12-31",
  "status": "IN_PROGRESS",
  "active": true,
  "createdAt": "2025-12-13T19:38:57.93523",
  "totalCommit": 87,
  "lastCommitAt": "2025-11-20T10:22:31"
}
```

**비고:**
- `active: false`인 프로젝트는 조회 불가 (404 에러)
- `techStack`은 문자열 배열
- `totalCommit` (단수형) 주의

---

# 8. Commit API

## 🔹 8.1 커밋 동기화

### `POST /api/projects/{projectId}/commits/sync`

**인증:** 필요

### Response 200

```json
{
  "message": "커밋 동기화 완료",
  "savedCount": 12
}
```

**비고:** 프로젝트 상세 페이지에서 수동 커밋 동기화 버튼으로 활용 가능

---

## 🔹 8.2 커밋 통계 조회

### `GET /api/projects/{projectId}/commits/summary`

**인증:** 필요

### Response 200

```json
{
  "projectId": 2,
  "totalCommits": 12,
  "latestCommitDate": "2025-07-20T12:16:35",
  "commitsThisWeek": 0,
  "mostActiveDay": "Sunday"
}
```

**비고:** 프로젝트 상세 페이지에서 커밋 통계 표시에 활용 가능

---

# 9. Dashboard API

## 🔹 8.1 대시보드 전체 데이터 조회

### `GET /api/dashboard`

**인증:** 필요

### Response

```json
{
  "summary": {
    "inProgressCount": 3,
    "completedCount": 2,
    "totalCommitsThisMonth": 108
  },
  "weeklyCommits": [
    {
      "dayOfWeek": "MON",
      "date": "2025-11-17",
      "count": 3
    },
    {
      "dayOfWeek": "TUE",
      "date": "2025-11-18",
      "count": 5
    }
  ],
  "weekInfo": {
    "startDate": "2025-11-17",
    "endDate": "2025-11-23"
  },
  "recentProjects": [
    {
      "id": 10,
      "title": "Project Tracker",
      "lastCommitAt": "2025-11-20T10:22:31Z",
      "totalCommits": 87
    }
  ]
}
```

---

# 10. 상태값 정의

```tsx
status ∈ {
  "IN_PROGRESS",  // 진행 중
  "COMPLETED"     // 완료
}

```

---

# 11. GitHub API 호출 정책

| 내용               | 방식                                        |
| ------------------ | ------------------------------------------- |
| 커밋 수집          | 프로젝트 생성 시 동기 호출                  |
| Repo 리스트        | GitHub username 기반                        |
| Rate Limit 발생 시 | 캐시된 데이터 유지                          |
| Private Repo       | MVP에서는 지원 ❌ (추후 PAT 기반 확장 가능) |

---

# END OF API_SPEC.md
