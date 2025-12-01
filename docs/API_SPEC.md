# 📘 API_SPEC.md

**Chrono – API 명세서**

버전: v1.0

작성일: 2025-12-02

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
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "jimin",
    "githubUsername": "jimin-dev"
  }
}
```

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

**인증:** 필요

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

## 🔹 6.2 Repo 커밋 데이터 조회 (내부 호출)

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

**인증:** 필요

### Request

```json
{
  "title": "Project Tracker",
  "description": "사이드 프로젝트 관리 도구",
  "targetDate": "2025-12-31",
  "techStack": "React, Spring, MySQL",
  "repoName": "project-tracker"
}
```

### Response 201

```json
{
  "id": 10,
  "title": "Project Tracker",
  "description": "사이드 프로젝트 관리 도구",
  "startDate": "2025-11-20",
  "targetDate": "2025-12-31",
  "techStack": "React, Spring, MySQL",
  "status": "IN_PROGRESS",
  "repoOwner": "jimin-dev",
  "repoName": "project-tracker",
  "github": {
    "totalCommits": 87,
    "lastCommitAt": "2025-11-20T10:22:31Z"
  }
}
```

### Error

- GitHub Repo 조회 실패 → GITHUB_REPO_NOT_FOUND
- GitHub username 미설정 → GITHUB_USERNAME_NOT_SET

---

## 🔹 7.2 프로젝트 수정

### `PUT /api/projects/{projectId}`

**인증:** 필요

### Request

```json
{
  "title": "수정된 제목",
  "description": "업데이트 설명",
  "targetDate": "2026-01-01",
  "techStack": "React, Spring"
}
```

### Response 200

```json
{
  "id": 10,
  "title": "수정된 제목",
  "description": "업데이트 설명",
  "targetDate": "2026-01-01",
  "techStack": "React, Spring",
  "status": "IN_PROGRESS"
}
```

---

## 🔹 7.3 프로젝트 삭제

### `DELETE /api/projects/{projectId}`

**Response 204** (내용 없음)

---

## 🔹 7.4 프로젝트 목록 조회

### `GET /api/projects`

**인증:** 필요

### Response

```json
[
  {
    "id": 10,
    "title": "Project Tracker",
    "status": "IN_PROGRESS",
    "techStack": "React, Spring",
    "lastCommitAt": "2025-11-20T10:22:31Z",
    "totalCommits": 87
  }
]
```

---

## 🔹 7.5 프로젝트 상세 조회

### `GET /api/projects/{projectId}`

### Response

```json
{
  "id": 10,
  "title": "Project Tracker",
  "description": "...",
  "startDate": "2025-11-20",
  "targetDate": "2025-12-31",
  "techStack": "React, Spring, MySQL",
  "status": "IN_PROGRESS",
  "repoName": "project-tracker",
  "repoOwner": "jimin-dev",
  "github": {
    "totalCommits": 87,
    "lastCommitAt": "2025-11-20T10:22:31Z"
  }
}
```

---

# 8. Dashboard API

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

# 9. 상태값 정의

```tsx
status ∈ {
  "IN_PROGRESS",  // 진행 중
  "COMPLETED"     // 완료
}

```

---

# 10. GitHub API 호출 정책

| 내용               | 방식                                        |
| ------------------ | ------------------------------------------- |
| 커밋 수집          | 프로젝트 생성 시 동기 호출                  |
| Repo 리스트        | GitHub username 기반                        |
| Rate Limit 발생 시 | 캐시된 데이터 유지                          |
| Private Repo       | MVP에서는 지원 ❌ (추후 PAT 기반 확장 가능) |

---

# END OF API_SPEC.md
