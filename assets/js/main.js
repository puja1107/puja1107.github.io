(() => {
    'use strict';

    const emailAddress = ['pooja', 'kumari', '1107'].join('') + '@' + 'gmail.com';
    const typedText = document.querySelector('.typed-text');
    const cursorType = document.querySelector('.cursor-type');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const themeToggle = document.getElementById('theme-toggle');

    const scrollToTarget = (targetId) => {
        const target = document.querySelector(targetId);
        if (!target) return;
        const header = document.querySelector('.header');
        const offset = header ? header.offsetHeight : 0;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    };

    const closeMenu = () => {
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove('active', 'show');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    };

    const copyText = async (value) => {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(value);
            return;
        }
        const fallback = document.createElement('textarea');
        fallback.value = value;
        fallback.setAttribute('readonly', '');
        fallback.style.position = 'fixed';
        fallback.style.opacity = '0';
        document.body.appendChild(fallback);
        fallback.select();
        document.execCommand('copy');
        fallback.remove();
    };

    const showCopyState = (button, message) => {
        const original = button.getAttribute('aria-label');
        button.setAttribute('aria-label', message);
        button.classList.add('copied');
        window.setTimeout(() => {
            button.setAttribute('aria-label', original || 'Copy contact');
            button.classList.remove('copied');
        }, 1600);
    };

    const animateCounters = () => {
        document.querySelectorAll('.stat-number[data-count]').forEach((counter) => {
            const target = Number(counter.dataset.count);
            const suffix = counter.dataset.suffix || '';
            let current = 0;
            const tick = () => {
                current = Math.min(target, current + Math.max(1, Math.ceil(target / 40)));
                counter.textContent = `${current}${suffix}`;
                if (current < target) window.setTimeout(tick, 30);
            };
            tick();
        });
    };

    const animateSkillBars = () => document.querySelectorAll('.skill-fill[data-width]').forEach((bar) => {
        bar.style.width = bar.dataset.width;
    });

    const initialize = () => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            window.setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = '';
            }, 500);
        }

        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');
                if (!targetId || targetId === '#') return;
                event.preventDefault();
                scrollToTarget(targetId);
                closeMenu();
            });
        });

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isOpen = navMenu.classList.toggle('active');
                navToggle.classList.toggle('active', isOpen);
                navMenu.classList.toggle('show', isOpen);
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });
            document.addEventListener('click', (event) => {
                if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) closeMenu();
            });
        }

        if (themeToggle) {
            const setThemeIcon = (isDark) => {
                themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
                themeToggle.setAttribute('aria-label', isDark ? 'Use light theme' : 'Use dark theme');
            };
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                setThemeIcon(true);
            }
            themeToggle.addEventListener('click', () => {
                const isDark = document.documentElement.getAttribute('data-theme') !== 'dark';
                if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
                else document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                setThemeIcon(isDark);
            });
        }

        document.querySelectorAll('.copy-contact').forEach((button) => {
            button.addEventListener('click', async () => {
                if (button.dataset.copyKind !== 'email') return;
                try {
                    await copyText(emailAddress);
                    showCopyState(button, 'Email copied');
                } catch {
                    showCopyState(button, 'Copy unavailable');
                }
            });
        });

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(contactForm);
                const subject = encodeURIComponent(formData.get('subject'));
                const body = encodeURIComponent(`Name: ${formData.get('name')}\n\n${formData.get('message')}`);
                window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
            });
        }

        const backToTop = document.getElementById('backToTop');
        if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        const textArray = ['GCP Data Engineer', 'Data Engineering Specialist', 'BigQuery & Pipeline Architect', 'Cloud Composer & Airflow Expert'];
        let textIndex = 0;
        let characterIndex = 0;
        const eraseText = () => {
            if (!typedText) return;
            typedText.textContent = textArray[textIndex].slice(0, --characterIndex);
            if (characterIndex > 0) window.setTimeout(eraseText, 70);
            else {
                textIndex = (textIndex + 1) % textArray.length;
                window.setTimeout(typeText, 300);
            }
        };
        const typeText = () => {
            if (!typedText || !cursorType) return;
            const currentText = textArray[textIndex];
            typedText.textContent = currentText.slice(0, characterIndex++);
            cursorType.style.visibility = 'visible';
            if (characterIndex <= currentText.length) window.setTimeout(typeText, 100);
            else window.setTimeout(eraseText, 2000);
        };
        window.setTimeout(typeText, 800);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('animate');
                if (entry.target.classList.contains('hero-stats')) animateCounters();
                if (entry.target.classList.contains('skills-showcase')) animateSkillBars();
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });
        ['.hero-stats', '.skills-showcase'].forEach((selector) => {
            const element = document.querySelector(selector);
            if (element) observer.observe(element);
        });

        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        if (cursor && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
            document.addEventListener('mousemove', (event) => {
                cursor.style.left = `${event.clientX}px`;
                cursor.style.top = `${event.clientY}px`;
                cursorFollower.style.left = `${event.clientX}px`;
                cursorFollower.style.top = `${event.clientY}px`;
            });
        }
    };

    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        const backToTop = document.getElementById('backToTop');
        if (header) header.classList.toggle('scrolled', window.scrollY > 100);
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    // Discourage casual copying while leaving form fields and controls usable.
    document.addEventListener('contextmenu', (event) => {
        if (!event.target.closest('input, textarea, button, a')) event.preventDefault();
    });
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        const blocked = (event.ctrlKey || event.metaKey) && ['c', 'u', 's', 'a', 'p'].includes(key);
        if (blocked || key === 'f12' || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key))) event.preventDefault();
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
    else initialize();
})();
