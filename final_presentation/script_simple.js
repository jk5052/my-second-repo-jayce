class SimplePresentation {
    constructor() {
        this.currentSection = 1;
        this.totalSections = 18;
        this.isTransitioning = false;
        this.init();
    }

    async init() {
        console.log('SimplePresentation initializing...');

        // content.md 파일에서 콘텐츠 로드
        await this.loadContentFromFile();

        // 이벤트 바인딩
        this.bindEvents();

        // 첫 번째 섹션 표시
        this.showSection(1);

        console.log('SimplePresentation initialized');
    }

    async loadContentFromFile() {
        try {
            console.log('Loading content from content.md...');
            const response = await fetch('content.md');
            const contentText = await response.text();

            console.log('Content loaded, parsing sections...');

            // === 로 섹션 분리
            const sections = contentText.split('===').map(s => s.trim()).filter(s => s.length > 0);
            console.log(`Found ${sections.length} sections`);

            // 각 섹션 파싱 및 설정
            sections.forEach((sectionText, index) => {
                if (index < this.totalSections) {
                    const lines = sectionText.split('\n').map(line => line.trim()).filter(line => line);

                    // 제목 찾기 (# 으로 시작)
                    let title = `Section ${index + 1}`;
                    let content = '';

                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        if (line.startsWith('#')) {
                            title = line.replace(/^#+\s*/, '').trim();
                            // 제목 다음 줄부터 콘텐츠
                            content = lines.slice(i + 1).join('\n').trim();
                            break;
                        }
                    }

                    // 마크다운 처리
                    content = this.processMarkdown(content);

                    console.log(`Section ${index + 1} - Title: "${title}", Content: "${content.substring(0, 100)}..."`);

                    // 섹션에 콘텐츠 설정
                    const sectionElement = document.querySelector(`.section-${index + 1} .section-content`);
                    if (sectionElement) {
                        sectionElement.innerHTML = `
                            <h1>${title}</h1>
                            <div class="content">${content}</div>
                        `;
                        console.log(`✅ Set content for section ${index + 1}: ${title}`);
                    }
                }
            });

        } catch (error) {
            console.error('Error loading content.md:', error);
            this.setupFallbackContent();
        }
    }

    processMarkdown(text) {
        console.log('Processing markdown:', text);

        const processed = text
            // 이미지 처리 - 에러 핸들링 추가
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
                console.log(`Found image: alt="${alt}", src="${src}"`);
                return `<img src="${src}" alt="${alt}" onerror="console.error('Image failed to load:', '${src}')" onload="console.log('Image loaded:', '${src}')" />`;
            })
            // 볼드 텍스트
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // 이탤릭 텍스트
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // 줄바꿈을 <br>로 변환
            .replace(/\n/g, '<br>');

        console.log('Processed result:', processed);
        return processed;
    }

    setupFallbackContent() {
        console.log('Setting up fallback content...');
        for (let i = 1; i <= this.totalSections; i++) {
            const sectionElement = document.querySelector(`.section-${i} .section-content`);
            if (sectionElement) {
                sectionElement.innerHTML = `
                    <h1>Section ${i}</h1>
                    <p>Fallback content for section ${i}</p>
                `;
            }
        }
    }

    bindEvents() {
        // 마우스 휠 이벤트 - passive: false 옵션 추가
        document.addEventListener('wheel', (e) => {
            if (this.isTransitioning) return;

            e.preventDefault();

            if (e.deltaY > 0) {
                // 아래로 스크롤 - 다음 섹션
                this.nextSection();
            } else {
                // 위로 스크롤 - 이전 섹션
                this.prevSection();
            }
        }, { passive: false });

        // 키보드 이벤트
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;

            switch(e.key) {
                case 'ArrowDown':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    this.nextSection();
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.prevSection();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.showSection(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.showSection(this.totalSections);
                    break;
            }
        });

        // 인디케이터 클릭
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.showSection(index + 1);
            });
        });

        // 컨트롤 버튼
        const resetBtn = document.getElementById('reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.showSection(1);
            });
        }

        const fullscreenBtn = document.getElementById('fullscreen');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
    }

    nextSection() {
        if (this.currentSection < this.totalSections) {
            this.showSection(this.currentSection + 1);
        }
    }

    prevSection() {
        if (this.currentSection > 1) {
            this.showSection(this.currentSection - 1);
        }
    }

    showSection(sectionNum) {
        if (this.isTransitioning) return;
        
        console.log(`Showing section ${sectionNum}`);
        this.isTransitioning = true;
        this.currentSection = sectionNum;

        // 모든 섹션 숨기기
        document.querySelectorAll('.section').forEach((section, index) => {
            if (index + 1 === sectionNum) {
                // 현재 섹션 표시
                section.style.display = 'flex';
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.style.zIndex = '1000';
                section.classList.add('active');
            } else {
                // 다른 섹션 숨기기
                section.style.display = 'none';
                section.style.opacity = '0';
                section.style.visibility = 'hidden';
                section.style.zIndex = '10';
                section.classList.remove('active');
            }
        });

        // UI 업데이트
        this.updateUI();

        // 전환 완료
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    updateUI() {
        // 인디케이터 업데이트
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            if (index + 1 === this.currentSection) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // 카운터 업데이트
        const counter = document.querySelector('.counter');
        if (counter) {
            counter.textContent = `${String(this.currentSection).padStart(2, '0')} / ${this.totalSections}`;
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing SimplePresentation...');
    new SimplePresentation();
});
