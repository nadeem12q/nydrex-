'use strict';
/* ═══════════════════════════════════════════════
   NYDREX — main.js
   All interactive behavior
   ═══════════════════════════════════════════════ */

/* ─── NAVBAR: scroll effect ─── */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    backToTop.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── HAMBURGER MENU ─── */
const hamburger   = document.getElementById('hamburger');
const mobileSheet = document.getElementById('mobileSheet');
const hamSpans    = hamburger.querySelectorAll('span');

hamburger.addEventListener('click', () => {
  const open = mobileSheet.classList.toggle('open');
  if (open) {
    hamSpans[0].style.transform  = 'translateY(7px) rotate(45deg)';
    hamSpans[1].style.opacity    = '0';
    hamSpans[2].style.transform  = 'translateY(-7px) rotate(-45deg)';
    document.body.style.overflow = 'hidden';
  } else {
    closeMobileMenu();
  }
});

function closeMobileMenu () {
  mobileSheet.classList.remove('open');
  hamSpans[0].style.transform = '';
  hamSpans[1].style.opacity   = '';
  hamSpans[2].style.transform = '';
  document.body.style.overflow = '';
}

mobileSheet.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));

/* ─── SMOOTH SCROLL + ACTIVE NAV ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });

/* ─── AOS: scroll reveal animations ─── */
const aosEls = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-in');
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

aosEls.forEach(el => aosObserver.observe(el));

/* ─── PRICING TOGGLE (PKR / USD / AED) ─── */
const ptoggles = document.querySelectorAll('.ptoggle');
const amounts  = document.querySelectorAll('.tier-amount');
const currSymbols = document.querySelectorAll('.pkr-symbol');

const currencyConfig = {
  pkr: { symbol: 'PKR', key: 'data-pkr' },
  usd: { symbol: 'USD', key: 'data-usd' },
  aed: { symbol: 'AED', key: 'data-aed' },
};

ptoggles.forEach(btn => {
  btn.addEventListener('click', () => {
    ptoggles.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const currency = btn.dataset.currency;
    const config   = currencyConfig[currency];

    currSymbols.forEach(sym => { sym.textContent = config.symbol; });
    amounts.forEach(el => {
      const val = el.getAttribute(config.key);
      if (val) el.textContent = val;
    });
  });
});

/* ─── WORK FILTER TABS ─── */
const filterBtns = document.querySelectorAll('[data-filter]');
const workCards  = document.querySelectorAll('.work-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('category-tab-active'));
    btn.classList.add('category-tab-active');
    const filter = btn.dataset.filter;

    workCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);

      // Subtle fade-in for visible cards
      if (show) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      }
    });
  });
});

/* ─── CODE WINDOW TABS (Products section) ─── */
const cwTabs = document.querySelectorAll('.cw-tab');
cwTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    cwTabs.forEach(t => t.classList.remove('cw-tab-active'));
    tab.classList.add('cw-tab-active');
  });
});

/* ─── CW SIDEBAR items ─── */
const cwSidebarItems = document.querySelectorAll('.cw-sidebar-item');
cwSidebarItems.forEach(item => {
  item.addEventListener('click', () => {
    cwSidebarItems.forEach(i => i.classList.remove('cw-sidebar-active'));
    item.classList.add('cw-sidebar-active');
  });
});

/* ─── CONTACT FORM: validation + submit ─── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('fieldName').value.trim();
    const email   = document.getElementById('fieldEmail').value.trim();
    const service = document.getElementById('fieldService').value;

    // Simple validation
    if (!name) { shakeField('fieldName'); return; }
    if (!isValidEmail(email)) { shakeField('fieldEmail'); return; }
    if (!service) { shakeField('fieldService'); return; }

    // Loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate async send (replace with real API call)
    await new Promise(r => setTimeout(r, 1400));

    // Success
    submitBtn.style.display = 'none';
    formSuccess.style.display = 'block';
    contactForm.reset();

    // Reset after 5s
    setTimeout(() => {
      formSuccess.style.display = 'none';
      submitBtn.style.display   = '';
      submitBtn.textContent      = 'Send Message';
      submitBtn.disabled         = false;
      submitBtn.style.opacity    = '';
    }, 5000);
  });
}

function shakeField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#c64545';
  el.style.boxShadow   = '0 0 0 3px rgba(198,69,69,0.15)';
  el.focus();
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.boxShadow   = '';
  }, 2500);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─── MOCK CHART: animate bars on scroll ─── */
const chartBars = document.querySelectorAll('.mock-bar-wrap > div:not(.mock-bar-active)');
const heroSection = document.querySelector('.hero-band');
if (heroSection) {
  const chartObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      chartBars.forEach((bar, i) => {
        setTimeout(() => {
          bar.style.transition = `height 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms`;
        }, 100);
      });
      chartObserver.disconnect();
    }
  }, { threshold: 0.5 });
  chartObserver.observe(heroSection);
}

/* ─── WVM CHART: work visual mock bars ─── */
const wvmBars = document.querySelectorAll('.wvm-chart > div');
wvmBars.forEach((bar, i) => {
  bar.style.transition = `height 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms`;
});

/* ─── FAQ ACCORDION ─── */
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!btn || !answer) return;
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    faqItems.forEach(fi => {
      fi.classList.remove('open');
      fi.querySelector('.faq-answer').style.maxHeight = '0';
    });
    // Open clicked (if wasn't already open)
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ─── COOKIE CONSENT ─── */
const cookieBanner = document.getElementById('cookieConsent');
if (cookieBanner && !localStorage.getItem('nydrex-cookies-accepted')) {
  cookieBanner.classList.remove('hidden');
}
const acceptCookies = document.getElementById('acceptCookies');
if (acceptCookies) {
  acceptCookies.addEventListener('click', () => {
    localStorage.setItem('nydrex-cookies-accepted', 'true');
    cookieBanner.classList.add('hidden');
  });
}

/* ─── STAT COUNTER ANIMATION ─── */
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const isPercent = suffix === '%';
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length) {
  const statObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      statNumbers.forEach(el => {
        const text = el.textContent.trim();
        let num = parseInt(text);
        let suffix = '';
        if (text.includes('+')) suffix = '+';
        if (text.includes('%')) suffix = '%';
        if (!isNaN(num)) animateCounter(el, num, suffix);
      });
      statObserver.disconnect();
    }
  }, { threshold: 0.5 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statObserver.observe(heroStats);
}

console.log('%c NYDREX ', 'background:#cc785c;color:#fff;font-size:16px;font-weight:bold;padding:4px 14px;border-radius:4px;');
console.log('%c Software that moves business forward. ', 'color:#8e8b82;font-size:12px;');
