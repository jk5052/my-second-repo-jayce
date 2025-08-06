class ZoomPresentation {
    constructor() {
        this.currentSection = 1;
        this.totalSections = 18;
        this.isTransitioning = false;
        this.world = document.querySelector('.world');
        this.blurOverlay = document.querySelector('.blur-overlay');
        this.viewport = document.querySelector('.viewport');
        this.init();
    }

    async init() {
        console.log('ZoomPresentation initializing...');
        
        // Parse content with hardcoded sections for reliability
        this.parseContent();
        
        this.bindEvents();
        
        // 초기 상태 설정
        setTimeout(() => {
            console.log('Setting initial state...');
            this.showSection(1);
            this.updateUI();
        }, 200);
        
        console.log('ZoomPresentation initialized successfully');
    }

    parseContent() {
        console.log('Parsing content with hardcoded sections...');
        
        // Hardcoded content for reliable display
        const hardcodedSections = [
            {
                title: "Vulnerable Connections",
                content: "Vulnerable Connections: Technology, Emotion, and Collective Experience"
            },
            {
                title: "Keywords & Intersections", 
                content: "The convergence of <strong>affective computing</strong>, <strong>emotional AI</strong>, <strong>human-computer interaction</strong>, and <strong>critical technology studies</strong> reveals new territories where vulnerability becomes both strength and risk."
            },
            {
                title: "Background Research",
                content: "AI and Humanity? <strong>AI's Weightless Emotions</strong>. True comfort comes not from understanding, but from <strong>shared vulnerability</strong>. How can technology help us evolve by embracing our emotional flaws and vulnerabilities?"
            },
            {
                title: "Emotion as Social Construction",
                content: "<strong>The Constructed Nature of Emotion</strong>. <strong>Immeasurable Complexity</strong>. <strong>AI's Role in Emotional Construction</strong>. AI doesn't read emotions—it <strong>creates</strong> them. Not neutral. Emotions are transformed into abstracted, quantified, controllable data points."
            },
            {
                title: "Situational Technology & Critical Positioning",
                content: "<strong>Western-Centric Limitations</strong>. <strong>Technology is not neutral</strong>—social, cultural, political contexts matter. <strong>Against Emotional Commodification</strong>. <strong>Accessibility and Equity</strong>. <strong>Privacy and Autonomy</strong>."
            },
            {
                title: "Political Dimensions & Power Analysis",
                content: "<strong>Politics of Emotional Technology</strong>: Who controls emotional data and defines valid emotional categories? How are collective emotions commodified? Does technological empathy democratize understanding or create new forms of <strong>emotional surveillance</strong>?"
            },
            {
                title: "Critical Issues in Emotional Data",
                content: "Key considerations when dealing with emotional data: <strong>authenticity</strong>, <strong>consent</strong>, <strong>representation</strong>, <strong>algorithmic bias</strong>, <strong>cultural sensitivity</strong>, and the <strong>ethics of emotional manipulation</strong>."
            },
            {
                title: "Historical Development",
                content: "Computer Science/AI emotional recognition technology's historical trajectory from <strong>rule-based systems</strong> to <strong>machine learning</strong> to <strong>deep neural networks</strong>—each iteration reshaping how we understand and categorize human emotion."
            },
            {
                title: "Global Emotional Bias Map",
                content: "Community emotional culture bias worldwide—mapping how different cultures conceptualize, express, and value emotional experiences, revealing the <strong>limitations of universalist AI approaches</strong>."
            },
            {
                title: "Community",
                content: "Building <strong>inclusive emotional technologies</strong> that honor diverse ways of experiencing and expressing emotion while fostering genuine human connection rather than extractive data collection."
            },
            {
                title: "Methodology",
                content: "Research approach combining <strong>critical technology studies</strong>, <strong>participatory design</strong>, and <strong>community-based research</strong> to understand how emotional technologies impact different communities."
            },
            {
                title: "Case Studies",
                content: "Examining real-world implementations of emotional AI in healthcare, education, and social media—analyzing both benefits and potential harms across different cultural contexts."
            },
            {
                title: "Ethical Framework",
                content: "Developing guidelines for <strong>responsible emotional AI</strong> that prioritizes human agency, cultural sensitivity, and community consent over technological efficiency."
            },
            {
                title: "Future Directions",
                content: "Moving toward <strong>collaborative emotional technologies</strong> that amplify human connection rather than replace it—technologies that serve communities rather than extract from them."
            },
            {
                title: "Implementation",
                content: "Practical steps for creating more equitable emotional technologies: community involvement, transparent algorithms, cultural adaptation, and ongoing ethical review."
            },
            {
                title: "Impact & Evaluation",
                content: "Measuring success not just through technical metrics but through <strong>community wellbeing</strong>, <strong>cultural preservation</strong>, and <strong>genuine human flourishing</strong>."
            },
            {
                title: "Conclusion",
                content: "Technology's role in emotional life is not predetermined. Through critical engagement and community-centered design, we can create technologies that honor our <strong>vulnerable connections</strong>."
            },
            {
                title: "Questions & Discussion",
                content: "How can we ensure emotional technologies serve human flourishing rather than surveillance? What would truly <strong>vulnerable</strong> and <strong>connected</strong> technology look like?"
            }
        ];

        // Apply hardcoded content to sections
        hardcodedSections.forEach((section, index) => {
            if (index < this.totalSections) {
                const sectionElement = document.querySelector(`.section-${index + 1} .section-content`);
                
                if (sectionElement) {
                    const htmlContent = `
                        <h1>${section.title}</h1>
                        <p>${section.content}</p>
                    `;
                    sectionElement.innerHTML = htmlContent;
                    
                    // Set up section content styles
                    sectionElement.style.display = 'flex';
                    sectionElement.style.flexDirection = 'column';
                    sectionElement.style.alignItems = 'center';
                    sectionElement.style.justifyContent = 'center';

                    // Only show first section initially
                    if (index === 0) {
                        sectionElement.style.opacity = '1';
                        sectionElement.style.visibility = 'visible';
                        sectionElement.style.zIndex = '1000';
                    } else {
                        sectionElement.style.opacity = '0';
                        sectionElement.style.visibility = 'hidden';
                        sectionElement.style.zIndex = '10';
                    }
                    
                    console.log(`✅ Updated section ${index + 1}: ${section.title}`);
                } else {
                    console.error(`❌ Section element not found: .section-${index + 1}`);
                }
            }
        });
    }

    createFallbackContent() {
        console.log('Creating fallback content...');
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
        // Mouse wheel navigation
        this.viewport.addEventListener('wheel', (e) => {
            if (this.isTransitioning) return;
            
            e.preventDefault();
            
            if (e.deltaY > 0) {
                this.nextSection();
            } else {
                this.prevSection();
            }
        });

        // Keyboard navigation
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
        if (this.isTransitioning) return;
        if (this.currentSection < this.totalSections) {
            this.isTransitioning = true;
            this.showSection(this.currentSection + 1);
        }
    }

    prevSection() {
        if (this.isTransitioning) return;
        if (this.currentSection > 1) {
            this.isTransitioning = true;
            this.showSection(this.currentSection - 1);
        }
    }

    showSection(sectionNum) {
        console.log(`Showing section ${sectionNum}`);

        this.currentSection = sectionNum;

        // No zoom transformation needed - sections are already fullscreen
        // Just update UI to show/hide sections
        this.updateUI();

        // Small delay to ensure smooth transition
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    updateUI() {
        console.log(`Updating UI for section ${this.currentSection}`);

        // Update sections - hide all first, then show current
        document.querySelectorAll('.section').forEach((section, index) => {
            if (index + 1 === this.currentSection) {
                section.classList.add('active');
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.style.zIndex = '1000';
                console.log(`Activated section ${index + 1}`);
            } else {
                section.classList.remove('active');
                section.style.opacity = '0';
                section.style.visibility = 'hidden';
                section.style.zIndex = '10';
            }
        });

        // Update indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            if (index + 1 === this.currentSection) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Update counter
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ZoomPresentation...');
    new ZoomPresentation();
});
