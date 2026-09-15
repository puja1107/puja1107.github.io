// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    }
});

// Smooth scrolling for section links.
document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    const sectionId = target.getAttribute('href');
    if (!sectionId || sectionId === '#') return;

    const section = document.querySelector(sectionId);
    if (!section) return;

    e.preventDefault();
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    window.scrollTo({
        top: section.offsetTop - headerHeight,
        behavior: 'smooth'
    });

    if (target.classList.contains('nav-link')) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        target.classList.add('active');
    }

    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle?.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Mobile Menu
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}
themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
});
// Load saved theme on init
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(localStorage.getItem('theme') || 'light');
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Typed Text Effect
const typedTextSpan = document.querySelector('.typed-text');
const cursorSpan = document.querySelector('.cursor-type');
const textArray = [
    "GCP Data Engineer",
    "Data Engineering Specialist",
    "BigQuery & Pipeline Architect",
    "Cloud Composer & Airflow Expert"
];
const typingDelay = 100;
const erasingDelay = 80;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

// Start typing effect
document.addEventListener('DOMContentLoaded', function() {
    if (textArray.length) setTimeout(type, newTextDelay + 250);
});

// Counter Animation for Stats
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const suffix = counter.getAttribute('data-suffix') || '';
        const rawCurrent = counter.innerText.replace(/[^0-9]/g, '');
        const current = +rawCurrent;
        const increment = Math.max(1, Math.ceil(target / 40));
        
        if (current < target) {
            const nextVal = Math.min(target, current + increment);
            counter.innerText = nextVal + suffix;
            setTimeout(animateCounters, 30);
        } else {
            counter.innerText = target + suffix;
        }
    });
};

// Skill Bars Animation
const animateSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-fill');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
    });
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('hero-stats')) {
                animateCounters();
            }
            if (entry.target.classList.contains('skills-showcase')) {
                animateSkillBars();
            }
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    const skillsShowcase = document.querySelector('.skills-showcase');
    
    if (heroStats) observer.observe(heroStats);
    if (skillsShowcase) observer.observe(skillsShowcase);
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Custom Cursor (Desktop only)
if (window.innerWidth > 768) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    // Hide cursors on mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    }
    
}

// Contact Form Handling (Formspree)
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const status = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Simple validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();
    
    if (!name || !email || !subject || !message) {
        status.textContent = 'Please fill in all fields.';
        status.style.color = '#ef4444';
        status.style.display = 'block';
        return;
    }
    
    // Disable button, show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    status.textContent = '';
    status.style.display = 'none';
    
    // Submit via Formspree
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            status.textContent = '✅ Thank you! Your message has been sent. I will get back to you soon.';
            status.style.color = '#22c55e';
            form.reset();
        } else {
            throw new Error('Server error');
        }
    })
    .catch(error => {
        status.textContent = '❌ Something went wrong. Please email me directly at poojakumari1107@gmail.com.';
        status.style.color = '#ef4444';
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
        status.style.display = 'block';
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Add scrolled class styling
const style = document.createElement('style');
style.textContent = `
    .header.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        box-shadow: var(--shadow-light);
    }
    
    [data-theme="dark"] .header.scrolled {
        background: rgba(15, 23, 42, 0.95);
    }
`;
document.head.appendChild(style);

// Contact Reveal — mask email and phone
document.querySelectorAll('.contact-reveal').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const real = el.getAttribute('data-real');
        const masked = el.getAttribute('data-masked');
        if (el.textContent.trim() === masked) {
            el.textContent = real;
            el.href = 'mailto:' + real;
        } else {
            el.textContent = masked;
            el.href = '#';
        }
    });
});

// Hero reveal buttons
document.getElementById('hero-email-reveal')?.addEventListener('click', (e) => {
    e.preventDefault();
    const el = e.currentTarget;
    const real = el.getAttribute('data-real');
    el.href = 'mailto:' + real;
    el.innerHTML = '<i class="fas fa-envelope"></i> ' + real;
});

document.getElementById('hero-phone-reveal')?.addEventListener('click', (e) => {
    e.preventDefault();
    const el = e.currentTarget;
    const real = el.getAttribute('data-real');
    el.href = 'tel:' + real;
    el.innerHTML = '<i class="fas fa-phone"></i> ' + real;
});
