class ZoomPresentation {
    constructor() {
        this.currentSection = 1;
        this.totalSections = 18; // 18개로 수정
        this.isTransitioning = false;
        this.world = document.querySelector('.world');
        this.blurOverlay = document.querySelector('.blur-overlay');
        this.viewport = document.querySelector('.viewport');
        this.init();
    }

    async init() {
        console.log('ZoomPresentation initializing...');
        
        // MD 파일에서 콘텐츠 로드
        try {
            await this.loadContentFromMD();
        } catch (error) {
            console.error('Failed to load MD file, using fallback:', error);
            this.createFallbackContent();
        }
        
        this.bindEvents();
        
        // 초기 상태 설정 - 슬라이드 방식에서는 첫 번째 섹션이 이미 보임
        setTimeout(() => {
            console.log('Setting initial state...');

            // 월드 컨테이너를 첫 번째 섹션 위치로 설정
            this.world.style.transform = 'translateX(0vw)';
            this.currentSection = 1;
            this.updateUI();

            console.log('✅ Initial state set - showing section 1');
        }, 100);
        
        console.log('ZoomPresentation initialized successfully');
    }

    async loadContentFromMD() {
        console.log('Loading content.md...');
        
        try {
            const response = await fetch('content.md');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const markdown = await response.text();
            console.log('MD content loaded, length:', markdown.length);
            
            // MD 내용을 fullContent에 설정
            document.getElementById('fullContent').textContent = markdown;
            
            // 파싱 실행
            this.parseContent();
            
        } catch (error) {
            console.error('Error loading content.md:', error);
            throw error; // 상위에서 fallback 처리
        }
    }

    parseContent() {
        console.log('Starting parseContent...');
        
        const fullContent = document.getElementById('fullContent');
        if (!fullContent) {
            console.error('fullContent element not found!');
            this.createFallbackContent();
            return;
        }

        const contentText = fullContent.textContent || fullContent.innerText;
        console.log(`Raw content found: "${contentText.substring(0, 200)}..."`);
        console.log(`Content length: ${contentText.length}`);

        if (!contentText.trim()) {
            console.error('Content is empty!');
            this.createFallbackContent();
            return;
        }

        // Split by === to get sections
        const sections = contentText.split('===').map(s => s.trim()).filter(s => s.length > 0);
        console.log(`Found ${sections.length} sections from embedded content`);

        if (sections.length === 0) {
            console.error('No sections found after splitting!');
            this.createFallbackContent();
            return;
        }

        sections.forEach((sectionText, index) => {
            console.log(`Processing section ${index + 1}:`, sectionText.substring(0, 100));
            
            if (index < this.totalSections && sectionText) {
                const lines = sectionText.split('\n').filter(line => line.trim());

                // Find title line (starts with #)
                const titleLine = lines.find(line => line.trim().startsWith('#'));
                const title = titleLine ? titleLine.replace(/^#+\s*/, '').trim() : `Section ${index + 1}`;

                // Get content lines (not starting with #)
                const contentLines = lines.filter(line => !line.trim().startsWith('#') && line.trim());
                let content = contentLines.join(' ')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/!\[.*?\]\(https?:\/\/via\.placeholder\.com.*?\)/g, '')  // placeholder 이미지 제거
                    .replace(/!\[(.*?)\]\(((?!https?:\/\/).*?)\)/g, '<img src="$2" alt="$1" />')  // 로컬 이미지만 처리
                    .trim();

                const sectionElement = document.querySelector(`.section-${index + 1} .section-content`);
                console.log(`Looking for: .section-${index + 1} .section-content`);
                console.log(`Found element:`, sectionElement);
                
                if (sectionElement) {
                    const htmlContent = `
                        <h1>${title}</h1>
                        <div class="content">${content || `Test content for section ${index + 1}`}</div>
                    `;
                    sectionElement.innerHTML = htmlContent;
                    console.log(`✅ Updated section ${index + 1}: ${title}`);
                    
                    // Force visibility for debugging
                    if (index === 0) {
                        sectionElement.style.visibility = 'visible';
                        sectionElement.style.display = 'flex';
                        console.log('🔧 Force visibility on first section');
                    }
                } else {
                    console.error(`❌ Section element not found: .section-${index + 1}`);
                }
            }
        });
        
        // Force first section to be visible immediately
        const firstSection = document.querySelector('.section-1');
        const firstSectionContent = document.querySelector('.section-1 .section-content');
        if (firstSection && firstSectionContent) {
            firstSection.classList.add('active');
            firstSection.style.opacity = '1';
            firstSection.style.zIndex = '1000';
            firstSectionContent.style.opacity = '1';
            firstSectionContent.style.transform = 'scale(1)';
            console.log('✅ First section force activated with inline styles');
        }
    }

    createFallbackContent() {
        console.log('Creating fallback content...');
        
        const fallbackSections = [
            { title: 'Vulnerable Connections', content: 'Technology, Emotion, and Collective Experience' },
            { title: 'Keywords & Intersections', content: 'The convergence of <strong>affective computing</strong>, <strong>emotional AI</strong>, <strong>human-computer interaction</strong>, and <strong>critical technology studies</strong>.' },
            { title: 'Background Research', content: 'AI and Humanity? <strong>AI\'s Weightless Emotions</strong>. True comfort comes from <strong>shared vulnerability</strong>.' },
            { title: 'Emotion as Social Construction', content: '<strong>The Constructed Nature of Emotion</strong>. AI doesn\'t read emotions—it <strong>creates</strong> them.' },
            { title: 'Situational Technology', content: '<strong>Technology is not neutral</strong>—social, cultural, political contexts matter.' },
            { title: 'Political Dimensions', content: '<strong>Politics of Emotional Technology</strong>: Who controls emotional data?' },
            { title: 'Critical Issues', content: 'Key considerations: <strong>authenticity</strong>, <strong>consent</strong>, <strong>representation</strong>.' },
            { title: 'Historical Development', content: 'From <strong>rule-based systems</strong> to <strong>machine learning</strong> to <strong>deep neural networks</strong>.' },
            { title: 'Global Emotional Bias', content: 'Community emotional culture bias worldwide—mapping how different cultures conceptualize, express, and value emotional experiences, revealing the <strong>limitations of universalist AI approaches</strong>.' },
            { title: 'Community', content: 'Building <strong>inclusive emotional technologies</strong> that honor diverse ways of experiencing emotion.' },
            { title: 'Core Data Parameters', content: '<strong>Facial expressions</strong>, <strong>vocal patterns</strong>, <strong>physiological signals</strong>.' },
            { title: 'Prior Research - 1', content: 'Ben Grosser\'s <strong>"Computers Watching Movies"</strong> explores machine vision interpretation.' },
            { title: 'Prior Research - 2', content: '<strong>"Cleansing Emotional Data"</strong> examines how datasets are normalized and sanitized.' },
            { title: 'Research Question', content: 'Can we design systems that respect emotional complexity and vulnerability?' },
            { title: 'Methodology & Approach', content: 'Qualitative/quantitative/multisensory experiments emphasizing critical reflection.' },
            { title: 'Design Experiments', content: '<strong>Synesthetic objects</strong>: Stickiness, Sharpness, Weight with multisensory feedback.' },
            { title: 'Future Applications', content: 'Creating bridges between emotional language and embodied experience.' },
            { title: 'Project Impact & Vision', content: 'Revealing the violence of emotional datafication through experiential critique.' }
        ];

        fallbackSections.forEach((section, index) => {
            if (index < this.totalSections) {
                const sectionElement = document.querySelector(`.section-${index + 1} .section-content`);
                if (sectionElement) {
                    sectionElement.innerHTML = `
                        <h1 style="color: white; font-size: 3.5rem; margin-bottom: 30px; text-align: center;">${section.title}</h1>
                        <p style="color: rgba(255,255,255,0.95); font-size: 1.6rem; text-align: center; line-height: 1.6;">${section.content}</p>
                    `;
                    console.log(`✅ Created fallback section ${index + 1}: ${section.title}`);
                } else {
                    console.error(`❌ Fallback: Section element not found: .section-${index + 1}`);
                }
            }
        });
    }

    bindEvents() {
        // Mouse wheel with smooth zoom transition
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (this.isTransitioning) {
                console.log('⏳ Wheel event ignored - transitioning');
                return;
            }

            console.log(`🖱️ Wheel event: deltaY=${e.deltaY}`);
            if (e.deltaY > 0) {
                this.nextSection();
            } else {
                this.prevSection();
            }
        }, { passive: false });

        // Touch events - 가로 슬라이드
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            if (this.isTransitioning) return;
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 80) {
                if (diff > 0) {
                    // 왼쪽으로 스와이프 - 다음 섹션
                    this.nextSection();
                } else {
                    // 오른쪽으로 스와이프 - 이전 섹션
                    this.prevSection();
                }
            }
        });

        // Keyboard navigation - 가로 방향
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;

            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    this.nextSection();
                    break;
                case 'ArrowLeft':
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

        // Indicator navigation
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.showSection(index + 1);
            });
        });

        // Control buttons
        document.getElementById('reset').addEventListener('click', () => {
            this.showSection(1);
        });

        document.getElementById('fullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    nextSection() {
        console.log(`➡️ Next section requested (current: ${this.currentSection})`);
        if (this.currentSection < this.totalSections) {
            this.showSection(this.currentSection + 1);
        } else {
            console.log('Already at last section');
        }
    }

    prevSection() {
        console.log(`⬅️ Previous section requested (current: ${this.currentSection})`);
        if (this.currentSection > 1) {
            this.showSection(this.currentSection - 1);
        } else {
            console.log('Already at first section');
        }
    }



    showSection(sectionNum) {
        if (this.isTransitioning) return;

        console.log(`Sliding to section ${sectionNum}`);
        this.isTransitioning = true;
        this.currentSection = sectionNum;

        // 월드 컨테이너를 슬라이드
        const translateX = -(sectionNum - 1) * 100; // 각 섹션은 100vw
        this.world.style.transform = `translateX(${translateX}vw)`;

        // UI 업데이트
        this.updateUI();

        // 전환 완료
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800); // CSS transition과 맞춤
    }

    updateUI() {
        console.log(`Updating UI for section ${this.currentSection}`);

        // Update sections
        document.querySelectorAll('.section').forEach((section, index) => {
            if (index === this.currentSection - 1) {
                section.classList.add('active');
                console.log(`Activated section ${index + 1}`);
            } else {
                section.classList.remove('active');
            }
        });

        // Update indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            if (index === this.currentSection - 1) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Update progress
        document.getElementById('current-section').textContent =
            this.currentSection.toString().padStart(2, '0');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {
                console.log('Fullscreen not supported');
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Initialize presentation
document.addEventListener('DOMContentLoaded', () => {
    new ZoomPresentation();
});