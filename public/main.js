// API 키를 안전하게 불러오기
async function getApiKey() {
    try {
        // 개발 환경: private/config.js에서 로드
        if (window.CONFIG) {
            return window.CONFIG.OPENAI_API_KEY;
        }
        
        // 프로덕션 환경: 환경변수에서 로드  
        if (process.env.OPENAI_API_KEY) {
            return process.env.OPENAI_API_KEY;
        }
        
        // 데모 모드: API 키 없이 샘플 데이터 사용
        console.log("API 키 없음 - 데모 모드로 실행");
        return null;
    } catch (error) {
        console.log("설정 파일 로드 실패 - 데모 모드로 실행");
        return null;
    }
}

// OpenAI API 호출 함수
async function callOpenAI(prompt) {
    const apiKey = await getApiKey();
    
    if (!apiKey) {
        // 데모 데이터 반환
        return {
            response: "이것은 데모 응답입니다. API 키를 설정하면 실제 OpenAI 응답을 받을 수 있습니다.",
            emotion: "neutral",
            demo: true
        };
    }
    
    try {
        // 실제 API 호출
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 150
            })
        });
        
        if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.status}`);
        }
        
        const data = await response.json();
        return {
            response: data.choices[0].message.content,
            emotion: "analyzed",
            demo: false
        };
        
    } catch (error) {
        console.error('OpenAI API 호출 오류:', error);
        return {
            response: "API 호출 중 오류가 발생했습니다. 데모 모드로 전환합니다.",
            emotion: "error",
            demo: true
        };
    }
}

// 감정 분석 함수
async function analyzeEmotion(text) {
    const prompt = `다음 텍스트의 감정을 분석해주세요: "${text}"
    
응답 형식:
- 주요 감정: [기쁨/슬픔/분노/두려움/놀람/혐오/중립]
- 강도: [1-10]
- 설명: [간단한 설명]`;

    return await callOpenAI(prompt);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 감정 컴퓨팅 프로젝트 시작');
    
    // API 키 상태 확인
    setTimeout(async () => {
        const apiKey = await getApiKey();
        const statusEl = document.getElementById('api-status');
        if (statusEl) {
            if (apiKey) {
                statusEl.textContent = '✅ API 키 로드됨 - 실제 분석 가능';
                statusEl.style.color = 'green';
            } else {
                statusEl.textContent = '⚠️ 데모 모드 - API 키를 설정하세요';
                statusEl.style.color = 'orange';
            }
        }
    }, 100);
});
