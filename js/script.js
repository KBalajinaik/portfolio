/**
 * Portfolio JS Script
 * Handles loading screen, theme management, typed text animation,
 * active scroll navigation, projects filtering/search, testimonial slider,
 * contact form actions, scroll progress, scroll reveal effects, and mobile menus.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Loader Screen Handler
  // ==========================================
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }, 800); // smooth entry padding
  });
  
  // Safe fallback if load event is delayed
  setTimeout(() => {
    if (loader && loader.style.opacity !== '0') {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }
  }, 3000);

  // ==========================================
  // 2. Theme Manager (Dark / Light Mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    body.classList.add('light-theme');
    updateThemeIcon('light');
  } else {
    body.classList.remove('light-theme');
    updateThemeIcon('dark');
  }

  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight ? 'light' : 'dark');
  });

  function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (!icon) return;
    
    if (theme === 'light') {
      icon.setAttribute('data-lucide', 'moon');
      icon.className = 'lucide lucide-moon';
    } else {
      icon.setAttribute('data-lucide', 'sun');
      icon.className = 'lucide lucide-sun';
    }
    
    // Re-render Lucide icons for the button
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ==========================================
  // 3. Scroll Progress & Sticky Header & Back To Top
  // ==========================================
  const scrollIndicator = document.getElementById('scroll-indicator');
  const header = document.querySelector('header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Scroll progress indicator
    const scrolled = (scrollTop / docHeight) * 100;
    scrollIndicator.style.width = scrolled + '%';

    // Sticky header
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollTop > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================
  // 4. Mobile Hamburger Navigation Menu
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when link clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // ==========================================
  // 5. Active Link Highlighter on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section');
  
  const navObserverOptions = {
    root: null,
    threshold: 0.25, // highlight when 25% of section is visible
    rootMargin: '-80px 0px 0px 0px' // offset header height
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });

  // ==========================================
  // 6. Typing Animation Effect (Hero Section)
  // ==========================================
  const typedTextSpan = document.querySelector('.typed-text');
  const strings = [
    'Full Stack Web Developer',
    'Backend Systems Engineer',
    'UI/UX Practitioner',
    'Cloud Solutions Enthusiast'
  ];
  const typingDelay = 100;
  const erasingDelay = 60;
  const newStringDelay = 2000;
  let stringIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < strings[stringIndex].length) {
      typedTextSpan.textContent += strings[stringIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newStringDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = strings[stringIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      stringIndex++;
      if (stringIndex >= strings.length) stringIndex = 0;
      setTimeout(type, typingDelay + 300);
    }
  }

  if (typedTextSpan) {
    setTimeout(type, newStringDelay - 1000);
  }

  // ==========================================
  // 7. Scroll Reveal & Skill Progress Trigger
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const skillsSection = document.getElementById('skills');
  const progressFills = document.querySelectorAll('.skill-bar-fill');
  let skillsAnimated = false;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Skills intersection bar trigger
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        progressFills.forEach(bar => {
          const val = bar.getAttribute('data-percentage');
          bar.style.width = val + '%';
        });
        skillsAnimated = true;
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // ==========================================
  // 8. Skill Category Tab Switcher
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const skillContents = document.querySelectorAll('.skills-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      skillContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `skills-${category}`) {
          content.classList.add('active');
        }
      });
      
      // Re-trigger progress bar widths when switching categories
      const activeFills = document.querySelectorAll(`#skills-${category} .skill-bar-fill`);
      activeFills.forEach(bar => {
        const val = bar.getAttribute('data-percentage');
        bar.style.width = val + '%';
      });
    });
  });

  // ==========================================
  // 9. Projects Live Filter & Search
  // ==========================================
  const projectSearchInput = document.getElementById('project-search');
  const projectFilterButtons = document.querySelectorAll('.projects-filter-bar .tab-btn');
  const projectCards = document.querySelectorAll('.project-card');
  let activeFilter = 'all';

  function filterProjects() {
    const searchText = projectSearchInput.value.toLowerCase().trim();
    
    projectCards.forEach(card => {
      const categories = card.getAttribute('data-categories').split(',');
      const title = card.querySelector('.project-title').textContent.toLowerCase();
      const desc = card.querySelector('.project-desc').textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll('.project-tag')).map(t => t.textContent.toLowerCase());
      
      const matchesCategory = (activeFilter === 'all' || categories.includes(activeFilter));
      
      const matchesSearch = searchText === '' || 
                            title.includes(searchText) || 
                            desc.includes(searchText) || 
                            tags.some(tag => tag.includes(searchText));
      
      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  // Filter click actions
  projectFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      filterProjects();
    });
  });

  // Search input typing
  if (projectSearchInput) {
    projectSearchInput.addEventListener('input', filterProjects);
  }

  // ==========================================
  // 10. Testimonials Slider Carousel
  // ==========================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.slider-dots');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  let currentSlideIndex = 0;
  let slideInterval;
  const intervalTime = 6000;

  // Generate dots dynamically
  if (slides.length > 0 && dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetSlideTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll('.slider-dot');

  function updateSlides() {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
      
      if (i === currentSlideIndex) {
        slide.classList.add('active');
        if (dots[i]) dots[i].classList.add('active');
      }
    });
  }

  function nextSlide() {
    currentSlideIndex++;
    if (currentSlideIndex >= slides.length) {
      currentSlideIndex = 0;
    }
    updateSlides();
  }

  function prevSlide() {
    currentSlideIndex--;
    if (currentSlideIndex < 0) {
      currentSlideIndex = slides.length - 1;
    }
    updateSlides();
  }

  function goToSlide(index) {
    currentSlideIndex = index;
    updateSlides();
  }

  function startSlideTimer() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  function resetSlideTimer() {
    clearInterval(slideInterval);
    startSlideTimer();
  }

  if (slides.length > 0) {
    startSlideTimer();
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlideTimer();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlideTimer();
      });
    }
  }

  // ==========================================
  // 11. Contact Form Validations & Notifications
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      
      // Email Regex
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      
      // Input Validation
      if (!name || !email || !subject || !message) {
        showToast('Please fill out all fields.', false);
        return;
      }
      
      if (!emailPattern.test(email)) {
        showToast('Please enter a valid email address.', false);
        return;
      }
      
      // Show loading spinner on button
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="loader-spinner" style="width:20px;height:20px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px;"></span> Sending...';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        showToast('Message sent successfully! Thank you.', true);
        contactForm.reset();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  function showToast(message, isSuccess) {
    if (!toast) return;
    
    const toastIcon = toast.querySelector('i');
    const toastText = toast.querySelector('span');
    
    toastText.textContent = message;
    
    if (isSuccess) {
      toastIcon.className = 'lucide lucide-circle-check';
      toastIcon.style.color = '#22c55e';
    } else {
      toastIcon.className = 'lucide lucide-circle-alert';
      toastIcon.style.color = '#ef4444';
    }
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // ==========================================
  // 12. Animated Canvas Background (Hero Section)
  // ==========================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic resize handler
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Node objects
    const dotsArray = [];
    const dotsCount = Math.min(60, Math.floor((width * height) / 20000)); // responsive density

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      draw() {
        // Adapt grid colors dynamically to light/dark themes
        const isLightTheme = document.body.classList.contains('light-theme');
        ctx.fillStyle = isLightTheme ? 'rgba(59, 130, 246, 0.2)' : 'rgba(6, 182, 212, 0.25)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
    }

    // Initialize particles
    for (let i = 0; i < dotsCount; i++) {
      dotsArray.push(new Particle());
    }

    // Draw links between nearby particles
    function drawConnections() {
      const isLightTheme = document.body.classList.contains('light-theme');
      const connectionColor = isLightTheme ? 'rgba(139, 92, 246, 0.04)' : 'rgba(139, 92, 246, 0.06)';
      const connectionDist = 120;

      for (let i = 0; i < dotsArray.length; i++) {
        for (let j = i + 1; j < dotsArray.length; j++) {
          const dx = dotsArray[i].x - dotsArray[j].x;
          const dy = dotsArray[i].y - dotsArray[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = 1 - dist / connectionDist;
            ctx.beginPath();
            ctx.moveTo(dotsArray[i].x, dotsArray[i].y);
            ctx.lineTo(dotsArray[j].x, dotsArray[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      
      dotsArray.forEach(dot => {
        dot.update();
        dot.draw();
      });

      drawConnections();
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ==========================================
  // 13. Initialize Lucide Icons
  // ==========================================
  if (window.lucide) {
    window.lucide.createIcons();
  }

});
