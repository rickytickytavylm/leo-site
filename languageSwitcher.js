// Language Switcher for Leo Recovery Website

class LanguageSwitcher {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.init();
    }

    // Detect user's browser language or load from localStorage
    detectLanguage() {
        const savedLang = localStorage.getItem('leoRecoveryLang');
        if (savedLang && (savedLang === 'ru' || savedLang === 'en' || savedLang === 'es')) {
            return savedLang;
        }

        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('ru')) {
            return 'ru';
        } else if (browserLang.startsWith('es')) {
            return 'es';
        }
        return 'en'; // Default to English
    }

    // Initialize language switcher
    init() {
        // Apply language on page load
        this.switchLanguage(this.currentLang, false);

        // Add event listeners to language buttons
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Haptic feedback
                if ('vibrate' in navigator) {
                    navigator.vibrate(15);
                }
                
                const lang = btn.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
    }

    // Switch language
    switchLanguage(lang, saveToStorage = true) {
        if (lang !== 'ru' && lang !== 'en' && lang !== 'es') return;

        this.currentLang = lang;

        // Save to localStorage
        if (saveToStorage) {
            localStorage.setItem('leoRecoveryLang', lang);
        }

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Show/hide community section and rehabs for English FIRST
        this.toggleCommunitySection(lang);

        // Update all translations
        this.updateContent(lang);

        // Update images
        this.updateImages(lang);

        // Update App Store link
        this.updateAppStoreLink(lang);
    }

    // Update all text content
    updateContent(lang) {
        const t = translations[lang];

        // Update navigation
        const navFeatures = document.querySelector('.nav-link[href="#features"]');
        const navDownload = document.querySelector('.nav-link[href="#download"]');
        const navCommunity = document.querySelector('.nav-link[href="#community"]');
        
        if (navFeatures) navFeatures.textContent = t.nav.features;
        if (navDownload) navDownload.textContent = t.timeline.downloadBtn;
        if (navCommunity) navCommunity.textContent = t.nav.community || '';

        // Update hero section
        const badge = document.querySelector('.badge');
        if (badge) {
            const statusDot = badge.querySelector('.status-dot');
            badge.textContent = t.hero.badge;
            if (statusDot) badge.prepend(statusDot);
        }

        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.textContent = t.hero.title;

        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) heroSubtitle.textContent = t.hero.subtitle;

        const downloadBtn = document.querySelector('.hero-buttons .btn-primary');
        if (downloadBtn) {
            const svg = downloadBtn.querySelector('svg');
            downloadBtn.textContent = t.hero.downloadBtn;
            if (svg) downloadBtn.prepend(svg);
        }

        // Update solution section
        const solutionTitle = document.querySelector('.solution-section .section-title');
        if (solutionTitle) solutionTitle.textContent = t.solution.title;

        const solutionDesc = document.querySelector('.solution-section .section-description');
        if (solutionDesc) solutionDesc.textContent = t.solution.description;

        const solutionListItems = document.querySelectorAll('.solution-list li span');
        if (solutionListItems.length >= 4 && t.solution.list) {
            solutionListItems.forEach((item, index) => {
                if (t.solution.list[index]) {
                    item.textContent = t.solution.list[index];
                }
            });
        }

        // Update stats labels
        const statLabels = document.querySelectorAll('.stat-label');
        if (statLabels.length >= 3) {
            statLabels[0].textContent = t.hero.usersLabel;
            statLabels[1].textContent = t.hero.ratingLabel;
            statLabels[2].textContent = t.hero.supportLabel;
        }

        // Update benefits section
        const benefitsTitle = document.querySelector('.section-header .section-title');
        if (benefitsTitle) benefitsTitle.textContent = t.benefits.title;

        const featuresHeaderDesc = document.querySelector('.section-header .section-description');
        if (featuresHeaderDesc) featuresHeaderDesc.textContent = t.featuresHeader.description;

        const benefitTitles = document.querySelectorAll('.benefit-title');
        if (benefitTitles.length >= 3) {
            benefitTitles[0].textContent = t.benefits.card1;
            benefitTitles[1].textContent = t.benefits.card2;
            benefitTitles[2].textContent = t.benefits.card3;
        }

        // Update features - work with ALL feature cards directly
        const allFeatureCards = document.querySelectorAll('.feature-card');

        if (lang === 'en' || lang === 'es') {
            // For English and Spanish - update each feature card individually (7 features, skip rehabs)
            const featureMap = [1, 2, 3, 4, 5, 6, 8]; // Maps HTML index to feature number (skip 7)
            let visibleIndex = 0; // Counter for visible cards
            
            allFeatureCards.forEach((card, idx) => {
                // Skip hidden cards (rehabs aggregator = index 6)
                if (idx === 6) return;
                
                const featureNum = featureMap[visibleIndex];
                if (!featureNum) return;
                
                const featureData = t.features[`feature${featureNum}`];
                if (!featureData) return;
                
                // Find elements within this specific card
                const icon = card.querySelector('.feature-icon');
                const title = card.querySelector('.feature-title');
                const description = card.querySelector('.feature-description');
                const list = card.querySelector('.feature-list');
                
                // Update icon number based on visible position
                if (icon) {
                    icon.textContent = String(visibleIndex + 1).padStart(2, '0');
                }
                
                // Update title
                if (title) {
                    title.textContent = featureData.title;
                }
                
                // Update description
                if (description) {
                    description.textContent = featureData.description;
                }
                
                // Update list items
                if (list && featureData.list) {
                    const items = list.querySelectorAll('li');
                    items.forEach((item, i) => {
                        if (featureData.list[i]) {
                            item.textContent = featureData.list[i];
                        }
                    });
                }
                
                visibleIndex++;
            });
        } else {
            // For Russian - 8 features
            allFeatureCards.forEach((card, idx) => {
                const featureNum = idx + 1; // 1-8
                const featureData = t.features[`feature${featureNum}`];
                if (!featureData) return;
                
                // Find elements within this specific card
                const icon = card.querySelector('.feature-icon');
                const title = card.querySelector('.feature-title');
                const description = card.querySelector('.feature-description');
                const list = card.querySelector('.feature-list');
                
                // Update icon number
                if (icon) {
                    icon.textContent = String(featureNum).padStart(2, '0');
                }
                
                // Update title
                if (title) {
                    title.textContent = featureData.title;
                }
                
                // Update description
                if (description) {
                    description.textContent = featureData.description;
                }
                
                // Update list items
                if (list && featureData.list) {
                    const items = list.querySelectorAll('li');
                    items.forEach((item, i) => {
                        if (featureData.list[i]) {
                            item.textContent = featureData.list[i];
                        }
                    });
                }
            });
        }

        // Update timeline section
        const timelineTitle = document.querySelector('.download-section .section-title');
        if (timelineTitle) timelineTitle.textContent = t.timeline.title;

        const timelineDesc = document.querySelector('.download-section .section-description');
        if (timelineDesc) timelineDesc.textContent = t.timeline.description;

        const stepTitles = document.querySelectorAll('.step-title');
        if (stepTitles.length >= 3) {
            stepTitles[0].textContent = t.timeline.step1;
            stepTitles[1].textContent = t.timeline.step2;
            stepTitles[2].textContent = t.timeline.step3;
        }

        const timelineDownloadBtn = document.querySelector('.download-section .btn-white');
        if (timelineDownloadBtn) {
            const svg = timelineDownloadBtn.querySelector('svg');
            timelineDownloadBtn.textContent = t.timeline.downloadBtn;
            if (svg) timelineDownloadBtn.prepend(svg);
        }

        // Update community section (only for Russian)
        if (lang === 'ru') {
            const communityTitle = document.querySelector('.community-section .section-title');
            if (communityTitle) communityTitle.textContent = t.community.title;

            const communityDesc = document.querySelector('.community-section .section-description');
            if (communityDesc) communityDesc.textContent = t.community.description;

            const communityBtn = document.querySelector('.community-section .btn-liquid-glass');
            if (communityBtn) {
                const svg = communityBtn.querySelector('svg');
                communityBtn.textContent = t.community.joinBtn;
                if (svg) communityBtn.prepend(svg);
            }
        }

        // Update footer
        const footerCompany = document.querySelector('.footer-company');
        if (footerCompany) footerCompany.textContent = t.footer.company;

        const footerDesc = document.querySelector('.footer-description');
        if (footerDesc) footerDesc.textContent = t.footer.description;

        const footerSectionTitles = document.querySelectorAll('.footer-section h4');
        if (footerSectionTitles.length >= 2) {
            footerSectionTitles[0].textContent = t.footer.contactsTitle;
            footerSectionTitles[1].textContent = t.footer.legalTitle;
        }

        const aboutLink = document.querySelector('.about-link');
        if (aboutLink) aboutLink.textContent = t.footer.aboutLink;

        const privacyLink = document.querySelector('.privacy-link');
        if (privacyLink) privacyLink.textContent = t.footer.privacyLink;

        const copyright = document.querySelector('.footer-copyright');
        if (copyright) copyright.textContent = t.footer.copyright;

        // Update mobile navigation
        const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav .nav-item span');
        if (mobileNavItems.length >= 3) {
            mobileNavItems[0].textContent = t.mobileNav.home;
            mobileNavItems[1].textContent = t.mobileNav.features;
            mobileNavItems[2].textContent = t.mobileNav.download;
            if (mobileNavItems.length >= 4 && lang === 'ru') {
                mobileNavItems[3].textContent = t.mobileNav.community || '';
            }
        }

        // Update modal titles
        const aboutModalTitle = document.querySelector('#aboutModal .modal-header h3');
        if (aboutModalTitle) aboutModalTitle.textContent = t.modals.aboutTitle;

        const privacyModalTitle = document.querySelector('#privacyModal .modal-header h3');
        if (privacyModalTitle) privacyModalTitle.textContent = t.modals.privacyTitle;

        // Update about modal content
        this.updateAboutModal(lang);

        // Update privacy modal content
        this.updatePrivacyModal(lang);

        // Update page title and meta
        if (lang === 'en') {
            document.title = 'Leo Recovery - Your Path to Recovery';
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.content = 'Leo Recovery - A comprehensive app for overcoming addictions with AI assistant, journal, tracker, and community support.';
            }
        } else if (lang === 'es') {
            document.title = 'Leo Recovery - Tu Camino Hacia La Recuperación';
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.content = 'Leo Recovery - Una aplicación completa para superar adicciones con asistente de IA, diario, rastreador y apoyo de la comunidad.';
            }
        } else {
            document.title = 'Leo Recovery - Ваш путь к восстановлению';
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.content = 'Leo Recovery - комплексное приложение для преодоления зависимостей с AI-помощником, дневником, трекером и поддержкой сообщества.';
            }
        }
    }

    // Update images (mockups)
    updateImages(lang) {
        const allFeatureCards = document.querySelectorAll('.feature-card');
        const paths = imagePaths[lang];

        if (lang === 'en' || lang === 'es') {
            // For English and Spanish - map to features 1,2,3,4,5,6,8 (skip feature7 at index 6)
            const featureMap = [1, 2, 3, 4, 5, 6, 8];
            let visibleIndex = 0;
            
            allFeatureCards.forEach((card, idx) => {
                // Skip hidden card (rehabs aggregator = index 6)
                if (idx === 6) return;
                
                const mockupImg = card.querySelector('.feature-mockup img');
                const featureNum = featureMap[visibleIndex];
                
                if (mockupImg && featureNum && paths.mockups[`feature${featureNum}`]) {
                    mockupImg.src = paths.mockups[`feature${featureNum}`];
                }
                
                visibleIndex++;
            });
        } else {
            // For Russian - all 8 features
            allFeatureCards.forEach((card, idx) => {
                const mockupImg = card.querySelector('.feature-mockup img');
                const featureNum = idx + 1; // 1-8
                
                if (mockupImg && paths.mockups[`feature${featureNum}`]) {
                    mockupImg.src = paths.mockups[`feature${featureNum}`];
                }
            });
        }

        // Update background images via inline styles
        const desktopBg = document.querySelector('.desktop-bg');
        if (desktopBg && paths.backgrounds.desktop) {
            desktopBg.style.backgroundImage = `url('${paths.backgrounds.desktop}')`;
        }

        const mobileBg = document.querySelector('.mobile-bg');
        if (mobileBg && paths.backgrounds.mobile) {
            mobileBg.style.backgroundImage = `url('${paths.backgrounds.mobile}')`;
        }

        // Community backgrounds (only for Russian)
        if (lang === 'ru' && paths.backgrounds.tgDesktop) {
            const communityContent = document.querySelector('.community-content');
            if (communityContent) {
                communityContent.style.backgroundImage = `url('${paths.backgrounds.tgDesktop}')`;
            }
        }
    }

    // Show/hide community section and rehabs aggregator for different languages
    toggleCommunitySection(lang) {
        const communitySection = document.querySelector('.community-section');
        const communityNavLink = document.querySelector('.nav-link[href="#community"]');
        const communityMobileNavItem = document.querySelector('.mobile-bottom-nav .nav-item[href="#community"]');
        const rehabsFeatureCard = document.querySelector('.feature-card:nth-child(7)'); // Feature 7 - Rehabs Aggregator

        if (lang === 'en' || lang === 'es') {
            // Hide community section, navigation, and rehabs aggregator for English and Spanish
            if (communitySection) communitySection.style.display = 'none';
            if (communityNavLink) communityNavLink.style.display = 'none';
            if (communityMobileNavItem) communityMobileNavItem.style.display = 'none';
            if (rehabsFeatureCard) rehabsFeatureCard.style.display = 'none';
        } else {
            // Show for Russian
            if (communitySection) communitySection.style.display = 'block';
            if (communityNavLink) communityNavLink.style.display = 'inline-block';
            if (communityMobileNavItem) communityMobileNavItem.style.display = 'flex';
            if (rehabsFeatureCard) rehabsFeatureCard.style.display = 'grid';
        }
    }

    // Update App Store link based on language
    updateAppStoreLink(lang) {
        const appStoreLinks = document.querySelectorAll('a[href*="apps.apple.com"]');
        appStoreLinks.forEach(link => {
            if (lang === 'en') {
                link.href = 'https://apps.apple.com/us/app/leo-recovery/id6752736987';
            } else if (lang === 'es') {
                link.href = 'https://apps.apple.com/es/app/leo-recovery/id6752736987';
            } else {
                link.href = 'https://apps.apple.com/ru/app/leo-recovery/id6752736987';
            }
        });
    }

    // Update About modal content
    updateAboutModal(lang) {
        const modalBody = document.querySelector('#aboutModal .modal-body');
        if (!modalBody) return;

        const companyInfo = modalBody.querySelector('.company-info');
        if (!companyInfo) return;

        if (lang === 'en') {
            companyInfo.innerHTML = `
                <p><strong>Phone:</strong> <a href="tel:+37493864503">+374 93 864503</a></p>
                <p><strong>Email:</strong> <a href="mailto:rickytickytavylm@gmail.com">rickytickytavylm@gmail.com</a></p>
                <p><strong>Website:</strong> <a href="https://melniapps.com" target="_blank">melniapps.com</a></p>
                <p><strong>Address:</strong> apt. 204, 26A M. Khorenats st.</p>
                <p><strong>City:</strong> Yerevan, Armenia (AM)</p>
                <p><strong>Postal Code:</strong> 0010</p>
            `;
        } else if (lang === 'es') {
            companyInfo.innerHTML = `
                <p><strong>Teléfono:</strong> <a href="tel:+37493864503">+374 93 864503</a></p>
                <p><strong>Email:</strong> <a href="mailto:rickytickytavylm@gmail.com">rickytickytavylm@gmail.com</a></p>
                <p><strong>Sitio Web:</strong> <a href="https://melniapps.com" target="_blank">melniapps.com</a></p>
                <p><strong>Dirección:</strong> apt. 204, 26A M. Khorenats st.</p>
                <p><strong>Ciudad:</strong> Yerevan, Armenia (AM)</p>
                <p><strong>Código Postal:</strong> 0010</p>
            `;
        } else {
            companyInfo.innerHTML = `
                <p><strong>Телефон:</strong> <a href="tel:+37493864503">+374 93 864503</a></p>
                <p><strong>Email:</strong> <a href="mailto:rickytickytavylm@gmail.com">rickytickytavylm@gmail.com</a></p>
                <p><strong>Веб-сайт:</strong> <a href="https://melniapps.com" target="_blank">melniapps.com</a></p>
                <p><strong>Адрес:</strong> apt. 204, 26A M. Khorenats st.</p>
                <p><strong>Город:</strong> Yerevan, Armenia (AM)</p>
                <p><strong>Почтовый индекс:</strong> 0010</p>
            `;
        }
    }

    // Update Privacy modal content
    updatePrivacyModal(lang) {
        const modalBody = document.querySelector('#privacyModal .modal-body');
        if (!modalBody) return;

        if (lang === 'en') {
            modalBody.innerHTML = `
                <p><strong>Last updated:</strong> November 12, 2025</p>
                
                <h4>About this Policy</h4>
                <p>This privacy policy applies exclusively to the Leo Recovery website. For the privacy policy of the Leo Recovery mobile application, please refer to the documentation within the app.</p>

                <h4>Information Collection</h4>
                <p>Our website is informational and <strong>does not collect</strong> personal user data. We do not use cookies, analytics systems, or other tracking tools.</p>

                <h4>Links to External Resources</h4>
                <p>Our site contains links to the App Store, Telegram, and other external resources. We are not responsible for the privacy policies of these sites. When following links, the privacy policy of the respective platforms applies.</p>

                <h4>Security</h4>
                <p>Since we do not collect personal data from site visitors, questions of data protection and storage do not apply to this website.</p>

                <h4>Policy Changes</h4>
                <p>We reserve the right to update this policy. Any changes take effect immediately upon publication on the site.</p>

                <h4>Contact</h4>
                <p>If you have questions about this website privacy policy, contact us:</p>
                <p>Email: <a href="mailto:rickytickytavylm@gmail.com">rickytickytavylm@gmail.com</a></p>
                <p>Developer website: <a href="https://melniapps.com" target="_blank">melniapps.com</a></p>
            `;
        } else if (lang === 'es') {
            modalBody.innerHTML = `
                <p><strong>Última actualización:</strong> 12 de noviembre de 2025</p>
                
                <h4>Acerca de esta Política</h4>
                <p>Esta política de privacidad se aplica exclusivamente al sitio web de Leo Recovery. Para la política de privacidad de la aplicación móvil Leo Recovery, consulte la documentación dentro de la aplicación.</p>

                <h4>Recopilación de Información</h4>
                <p>Nuestro sitio web es informativo y <strong>no recopila</strong> datos personales de usuarios. No utilizamos cookies, sistemas de analítica ni otras herramientas de seguimiento.</p>

                <h4>Enlaces a Recursos Externos</h4>
                <p>Nuestro sitio contiene enlaces a App Store, Telegram y otros recursos externos. No somos responsables de las políticas de privacidad de estos sitios. Al seguir los enlaces, se aplica la política de privacidad de las plataformas respectivas.</p>

                <h4>Seguridad</h4>
                <p>Dado que no recopilamos datos personales de los visitantes del sitio, las cuestiones de protección y almacenamiento de datos no se aplican a este sitio web.</p>

                <h4>Cambios en la Política</h4>
                <p>Nos reservamos el derecho de actualizar esta política. Cualquier cambio entra en vigor inmediatamente después de su publicación en el sitio.</p>

                <h4>Contacto</h4>
                <p>Si tiene preguntas sobre esta política de privacidad del sitio web, contáctenos:</p>
                <p>Email: <a href="mailto:rickytickytavylm@gmail.com">rickytickytavylm@gmail.com</a></p>
                <p>Sitio web del desarrollador: <a href="https://melniapps.com" target="_blank">melniapps.com</a></p>
            `;
        } else {
            modalBody.innerHTML = `
                <p><strong>Последнее обновление:</strong> 12 ноября 2025</p>
                
                <h4>О данной политике</h4>
                <p>Данная политика конфиденциальности относится исключительно к веб-сайту Leo Recovery. Для политики конфиденциальности мобильного приложения Leo Recovery, пожалуйста, ознакомьтесь с документацией в приложении.</p>

                <h4>Сбор информации</h4>
                <p>Наш веб-сайт является информационным и <strong>не собирает</strong> личные данные пользователей. Мы не используем cookies, системы аналитики или другие инструменты отслеживания.</p>

                <h4>Ссылки на внешние ресурсы</h4>
                <p>Наш сайт содержит ссылки на App Store, Telegram и другие внешние ресурсы. Мы не несем ответственности за политику конфиденциальности этих сайтов. При переходе по ссылкам применяется политика конфиденциальности соответствующих платформ.</p>

                <h4>Безопасность</h4>
                <p>Поскольку мы не собираем персональные данные посетителей сайта, вопросы их защиты и хранения не применимы к данному веб-сайту.</p>

                <h4>Изменения в политике</h4>
                <p>Мы оставляем за собой право обновлять эту политику. Любые изменения вступают в силу сразу после публикации на сайте.</p>

                <h4>Контакты</h4>
                <p>Если у вас есть вопросы о данной политике конфиденциальности сайта, свяжитесь с нами:</p>
                <p>Email: <a href="mailto:rickytickytavylm@gmail.com">rickytickytavylm@gmail.com</a></p>
                <p>Сайт разработчиков: <a href="https://melniapps.com" target="_blank">melniapps.com</a></p>
            `;
        }
    }
}

// Initialize language switcher when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
});

