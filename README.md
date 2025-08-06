# 🧠 감정 컴퓨팅 프로젝트

## 📁 프로젝트 구조

```
my-second-repo-jayce/
├── public/                 # 공개 코드 (GitHub에 업로드)
│   ├── main-page.html     # 메인 페이지
│   ├── main.js            # API 키 없는 안전한 코드
│   ├── movie.html         # 3D 영화 감정 우주
│   ├── *.html             # 기타 프로젝트 파일들
│   └── *.json             # 데이터 파일들
├── private/               # 개인 설정 (GitHub에 업로드 안됨)
│   └── config.js          # API 키 포함
├── final_presentation/    # 최종 발표 자료
├── .gitignore            # private 폴더 제외 설정
└── README.md
```

## 🔐 API 키 설정 방법

### 1. private/config.js 파일 생성
```javascript
const CONFIG = {
    OPENAI_API_KEY: "여기에-실제-API-키를-입력",
    API_BASE_URL: "https://api.openai.com/v1"
};

if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
```

### 2. 로컬에서 실행
- `public/main-page.html` 열기
- API 키가 있으면 실제 분석, 없으면 데모 모드

## 🚀 프로젝트 실행

### 로컬 서버 실행
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server 설치 필요)
npx http-server

# 브라우저에서 접속
http://localhost:8000/public/main-page.html
```

## 🎯 주요 프로젝트

- **🎬 3D 영화 감정 우주**: `public/movie.html`
- **📊 2D 감정 탐색**: `public/2d-explore.html`
- **🌐 3D 감정 탐색**: `public/3d-explore.html`
- **🎯 최종 발표**: `final_presentation/`

## 🔒 보안

- `private/` 폴더는 `.gitignore`로 제외
- API 키는 로컬에만 저장
- 공개 코드는 데모 모드로 작동
