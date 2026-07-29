/* ════════════════════════════════════════════════════════
   Anderson de Lima | Premium Portfolio JS
   Advanced animations, custom cursor, canvas charts, mesh
════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. CUSTOM CURSOR & MAGNETIC EFFECT ──────────────── */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Immediate dot follow
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Smooth ring follow
    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Hover effect on clickable items
    const clickables = document.querySelectorAll('a, button, input, textarea, .magnetic');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
    });

    // Magnetic effect
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const hx = rect.left + rect.width / 2;
        const hy = rect.top + rect.height / 2;
        const dx = (e.clientX - hx) * 0.2;
        const dy = (e.clientY - hy) * 0.2;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* ── 2. LOADING SCREEN ───────────────────────────────── */
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderLabel = document.getElementById('loaderLabel');
  
  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 15;
    if (loadProgress > 100) loadProgress = 100;
    
    loaderBar.style.width = `${loadProgress}%`;
    loaderLabel.textContent = `Carregando recursos... ${Math.floor(loadProgress)}%`;
    
    if (loadProgress === 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto'; // allow scroll
        initHeroAnimations();
      }, 400);
    }
  }, 100);
  document.body.style.overflow = 'hidden'; // prevent scroll during load

  function initHeroAnimations() {
    // Stagger reveal hero elements
    const heroElements = document.querySelectorAll('.reveal-up');
    heroElements.forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }

  /* ── 3. NAVBAR & SCROLL PROGRESS ─────────────────────── */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  const updateScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Navbar background
    if (scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Progress bar
    if (docHeight > 0) {
      scrollProgress.style.width = `${(scrollY / docHeight) * 100}%`;
    }

    // Active nav link
    let currentId = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 150;
      if (scrollY >= secTop) currentId = sec.getAttribute('id');
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) link.classList.add('active');
    });
  };
  
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  /* Hamburger Menu */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });
  
  navLinks.forEach(l => l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  }));

  /* ── 4. TYPEWRITER EFFECT ────────────────────────────── */
  const typewriterEl = document.getElementById('typewriter');
  const words = [
    'Business Intelligence',
    'Machine Learning',
    'Engenharia de Dados',
    'Data Visualization',
    'Soluções Estratégicas'
  ];
  let wordIdx = 0, charIdx = 0, isDeleting = false;
  
  function type() {
    const curWord = words[wordIdx];
    const speed = isDeleting ? 40 : 80;
    
    if (!isDeleting && charIdx <= curWord.length) {
      typewriterEl.textContent = curWord.substring(0, charIdx);
      charIdx++;
      if (charIdx > curWord.length) {
        setTimeout(() => { isDeleting = true; type(); }, 2000);
        return;
      }
    } else if (isDeleting && charIdx >= 0) {
      typewriterEl.textContent = curWord.substring(0, charIdx);
      charIdx--;
      if (charIdx < 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(type, 300);
        return;
      }
    }
    setTimeout(type, speed);
  }
  if (typewriterEl) type();

  /* ── 5. SCROLL REVEAL (Intersection Observer) ────────── */
  const revealOpts = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find all stagger-child inside this parent
        const children = entry.target.querySelectorAll('.stagger-child');
        if (children.length > 0) {
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 120);
          });
        } else if (entry.target.classList.contains('stagger-child')) {
          entry.target.classList.add('visible');
        }
        obs.unobserve(entry.target);
      }
    });
  }, revealOpts);

  document.querySelectorAll('.stagger-parent').forEach(el => revealObserver.observe(el));
  
  // Specific observer for skill bars to trigger width animation
  const skillObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.sbar-fill');
        if (bar) {
          const pct = entry.target.dataset.pct;
          setTimeout(() => bar.style.width = `${pct}%`, 300);
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  document.querySelectorAll('.sbar').forEach(el => skillObserver.observe(el));

  // Specific observer for counters
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const span = entry.target;
        const target = parseFloat(span.dataset.to);
        const suffix = span.dataset.suffix || '';
        
        const duration = 2000; // ms
        const start = performance.now();
        
        const updateCount = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          // ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3); 
          const current = Math.floor(easeProgress * target);
          
          span.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(updateCount);
          else span.textContent = target + suffix;
        };
        requestAnimationFrame(updateCount);
        
        obs.unobserve(span);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  /* ── 6. 3D TILT EFFECT ON CARDS ──────────────────────── */
  const tiltCards = document.querySelectorAll('.proj-card, .eco-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1024) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPct = (x / rect.width - 0.5) * 2;
      const yPct = (y / rect.height - 0.5) * -2;
      
      const maxRot = card.classList.contains('proj-card') ? 6 : 10;
      
      card.style.transform = `perspective(1000px) rotateY(${xPct * maxRot}deg) rotateX(${yPct * maxRot}deg) translateY(-8px)`;
      card.style.boxShadow = `
        ${-xPct * 15}px ${yPct * 15 + 20}px 40px rgba(0,0,0,0.4),
        0 0 0 1px rgba(56,189,248,0.2)
      `;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
      card.style.boxShadow = '';
    });
  });

  /* ── 7. MINI CHARTS (CANVAS) IN HERO ─────────────────── */
  
  // A. Bar Chart
  const ctxBar = document.getElementById('miniBarChart')?.getContext('2d');
  if (ctxBar) {
    const w = 160, h = 70;
    const bars = [15, 25, 40, 30, 50, 45, 65, 80];
    const max = Math.max(...bars);
    const spacing = 4;
    const barW = (w - (bars.length-1)*spacing) / bars.length;
    
    let frame = 0;
    function drawBar() {
      ctxBar.clearRect(0, 0, w, h);
      frame += 0.05;
      
      bars.forEach((val, i) => {
        const targetH = (val / max) * h;
        // animate height using sin wave for smooth looping effect
        const curH = targetH * (0.8 + 0.2 * Math.sin(frame + i));
        
        const x = i * (barW + spacing);
        const y = h - curH;
        
        const grad = ctxBar.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(1, 'rgba(56,189,248,0.2)');
        
        ctxBar.fillStyle = grad;
        ctxBar.beginPath();
        ctxBar.roundRect(x, y, barW, curH, [3, 3, 0, 0]);
        ctxBar.fill();
      });
      requestAnimationFrame(drawBar);
    }
    drawBar();
  }
  
  // B. Donut Chart
  const ctxDonut = document.getElementById('miniDonut')?.getContext('2d');
  if (ctxDonut) {
    let dFrame = 0;
    function drawDonut() {
      ctxDonut.clearRect(0, 0, 80, 80);
      dFrame += 0.02;
      
      const cx = 40, cy = 40, r = 32, lw = 8;
      
      // Track
      ctxDonut.beginPath();
      ctxDonut.arc(cx, cy, r, 0, Math.PI * 2);
      ctxDonut.strokeStyle = 'rgba(255,255,255,0.05)';
      ctxDonut.lineWidth = lw;
      ctxDonut.stroke();
      
      // Value
      const endAngle = -Math.PI/2 + (Math.PI * 2 * 0.87);
      
      // Add slight pulsing to the stroke
      const pulse = Math.sin(dFrame) * 2;
      
      ctxDonut.beginPath();
      ctxDonut.arc(cx, cy, r, -Math.PI/2, endAngle);
      ctxDonut.strokeStyle = '#a78bfa';
      ctxDonut.lineWidth = lw + pulse;
      ctxDonut.lineCap = 'round';
      ctxDonut.shadowBlur = 10;
      ctxDonut.shadowColor = '#a78bfa';
      ctxDonut.stroke();
      ctxDonut.shadowBlur = 0; // reset
      
      requestAnimationFrame(drawDonut);
    }
    drawDonut();
  }

  // C. Line Chart
  const ctxLine = document.getElementById('miniLineChart')?.getContext('2d');
  if (ctxLine) {
    const w = 160, h = 55;
    const pts = [10, 20, 15, 30, 25, 40, 35, 50, 45, 60, 55]; // y-values (inverted later)
    const max = 60;
    const step = w / (pts.length - 1);
    
    let lFrame = 0;
    function drawLine() {
      ctxLine.clearRect(0, 0, w, h);
      lFrame -= 1; // move dashed line
      
      ctxLine.beginPath();
      ctxLine.moveTo(0, h - (pts[0]/max)*h);
      
      for(let i=1; i<pts.length; i++) {
        // Smooth curve
        const xc = (i - 1) * step + step / 2;
        const yc = h - ((pts[i-1] + pts[i])/2 / max) * h;
        
        const yCur = h - (pts[i]/max)*h;
        // add slight wave
        const yWave = yCur + Math.sin(lFrame*0.05 + i)*2;
        
        ctxLine.quadraticCurveTo((i-1)*step, h-(pts[i-1]/max)*h, i*step, yWave);
      }
      
      ctxLine.strokeStyle = '#34d399';
      ctxLine.lineWidth = 2.5;
      ctxLine.setLineDash([8, 4]);
      ctxLine.lineDashOffset = lFrame;
      ctxLine.stroke();
      
      requestAnimationFrame(drawLine);
    }
    drawLine();
  }
  
  /* ── 8. RADAR CHART (SKILLS) ─────────────────────────── */
  const ctxRadar = document.getElementById('radarChart')?.getContext('2d');
  if (ctxRadar) {
    const cx = 170, cy = 150, r = 100;
    const sides = 6;
    const labels = ['BI/Dataviz', 'Machine Learning', 'Data Eng/ETL', 'Estatística', 'Negócios', 'Python/Code'];
    const values = [0.95, 0.75, 0.85, 0.8, 0.9, 0.9];
    
    function drawPoly(radius, color, fill=false) {
      ctxRadar.beginPath();
      for (let i = 0; i < sides; i++) {
        const ang = (Math.PI * 2 * i / sides) - Math.PI/2;
        const x = cx + Math.cos(ang) * radius;
        const y = cy + Math.sin(ang) * radius;
        if(i===0) ctxRadar.moveTo(x,y); else ctxRadar.lineTo(x,y);
      }
      ctxRadar.closePath();
      if (fill) { ctxRadar.fillStyle = color; ctxRadar.fill(); }
      else { ctxRadar.strokeStyle = color; ctxRadar.stroke(); }
    }
    
    // Grid
    ctxRadar.lineWidth = 1;
    drawPoly(r, 'rgba(255,255,255,0.1)');
    drawPoly(r*0.66, 'rgba(255,255,255,0.05)');
    drawPoly(r*0.33, 'rgba(255,255,255,0.05)');
    
    // Axes & Labels
    ctxRadar.font = '11px "Space Grotesk"';
    ctxRadar.fillStyle = '#8b9ec7';
    ctxRadar.textAlign = 'center';
    
    for (let i = 0; i < sides; i++) {
      const ang = (Math.PI * 2 * i / sides) - Math.PI/2;
      // Axis
      ctxRadar.beginPath();
      ctxRadar.moveTo(cx, cy);
      ctxRadar.lineTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
      ctxRadar.strokeStyle = 'rgba(255,255,255,0.05)';
      ctxRadar.stroke();
      
      // Label
      const lx = cx + Math.cos(ang) * (r + 25);
      const ly = cy + Math.sin(ang) * (r + 25);
      // adjust alignment based on angle
      if (Math.cos(ang) > 0.1) ctxRadar.textAlign = 'left';
      else if (Math.cos(ang) < -0.1) ctxRadar.textAlign = 'right';
      else ctxRadar.textAlign = 'center';
      
      ctxRadar.fillText(labels[i], lx, ly + 4);
    }
    
    // Data Area (animated)
    let animProgress = 0;
    
    const obsRadar = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting) {
        
        function animateRadar() {
          if (animProgress >= 1) return;
          animProgress += 0.02;
          const easeP = 1 - Math.pow(1 - animProgress, 3);
          
          // Clear only data area bounding box roughly
          ctxRadar.clearRect(0,0,340,300);
          
          // Redraw grid (inefficient but simple)
          ctxRadar.lineWidth = 1;
          drawPoly(r, 'rgba(255,255,255,0.1)');
          drawPoly(r*0.66, 'rgba(255,255,255,0.05)');
          drawPoly(r*0.33, 'rgba(255,255,255,0.05)');
          
          ctxRadar.font = '11px "Space Grotesk"';
          ctxRadar.fillStyle = '#8b9ec7';
          for (let i = 0; i < sides; i++) {
            const ang = (Math.PI * 2 * i / sides) - Math.PI/2;
            ctxRadar.beginPath();
            ctxRadar.moveTo(cx, cy);
            ctxRadar.lineTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
            ctxRadar.strokeStyle = 'rgba(255,255,255,0.05)';
            ctxRadar.stroke();
            const lx = cx + Math.cos(ang) * (r + 25);
            const ly = cy + Math.sin(ang) * (r + 25);
            if (Math.cos(ang) > 0.1) ctxRadar.textAlign = 'left';
            else if (Math.cos(ang) < -0.1) ctxRadar.textAlign = 'right';
            else ctxRadar.textAlign = 'center';
            ctxRadar.fillText(labels[i], lx, ly + 4);
          }
          
          // Draw values
          ctxRadar.beginPath();
          for (let i = 0; i < sides; i++) {
            const ang = (Math.PI * 2 * i / sides) - Math.PI/2;
            const valR = r * values[i] * easeP;
            const x = cx + Math.cos(ang) * valR;
            const y = cy + Math.sin(ang) * valR;
            if(i===0) ctxRadar.moveTo(x,y); else ctxRadar.lineTo(x,y);
          }
          ctxRadar.closePath();
          
          // Gradient fill
          const grad = ctxRadar.createRadialGradient(cx,cy,0, cx,cy,r);
          grad.addColorStop(0, 'rgba(56,189,248,0.6)');
          grad.addColorStop(1, 'rgba(167,139,250,0.2)');
          
          ctxRadar.fillStyle = grad;
          ctxRadar.fill();
          
          ctxRadar.lineWidth = 2;
          ctxRadar.strokeStyle = '#38bdf8';
          ctxRadar.stroke();
          
          // Draw points
          for (let i = 0; i < sides; i++) {
            const ang = (Math.PI * 2 * i / sides) - Math.PI/2;
            const valR = r * values[i] * easeP;
            const x = cx + Math.cos(ang) * valR;
            const y = cy + Math.sin(ang) * valR;
            
            ctxRadar.beginPath();
            ctxRadar.arc(x, y, 4, 0, Math.PI*2);
            ctxRadar.fillStyle = '#fff';
            ctxRadar.fill();
            ctxRadar.strokeStyle = '#38bdf8';
            ctxRadar.lineWidth = 1;
            ctxRadar.stroke();
          }
          
          requestAnimationFrame(animateRadar);
        }
        animateRadar();
        obsRadar.disconnect();
      }
    }, {threshold: 0.5});
    
    obsRadar.observe(document.getElementById('radarChart'));
  }

  /* ── 9. FORM HANDLING ────────────────────────────────── */
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  const formOk = document.getElementById('formOk');
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!form.checkValidity()) return;
    
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Enviando...`;
    btn.style.pointerEvents = 'none';
    
    setTimeout(() => {
      form.reset();
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Enviar Mensagem`;
      btn.style.pointerEvents = 'auto';
      
      formOk.classList.add('show');
      setTimeout(() => formOk.classList.remove('show'), 4000);
    }, 1500);
  });

});

// Keyframe setup for spin
const s = document.createElement('style');
s.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(s);
