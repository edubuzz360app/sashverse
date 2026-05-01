import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. NAVBAR
// ==========================================
const nav = document.getElementById('site-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

document.querySelectorAll('[href="#creator-section"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('creator-section')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ==========================================
// 2. AMBIENT IMAGE SEQUENCE ENGINE
// ==========================================
const TOTAL_FRAMES = 91;
const canvas = document.getElementById('sequence-canvas');
const ctx = canvas.getContext('2d');

// Frame cache
const frameImages = new Array(TOTAL_FRAMES + 1);
let currentFrame = 1;
let targetFrame = 1;

function getFrameSrc(index) {
  return `/assets/bg-img/ezgif-frame-${String(index).padStart(3, '0')}.png`;
}

// Canvas sizing
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawFrame(currentFrame);
}

function drawFrame(index) {
  const img = frameImages[index];
  if (!img || !img.complete) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Cover-fit the image
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvas.width / canvas.height;
  let drawW, drawH, drawX, drawY;

  if (canvasRatio > imgRatio) {
    drawW = canvas.width;
    drawH = canvas.width / imgRatio;
    drawX = 0;
    // Align closer to top so robot face doesn't cut off
    drawY = (canvas.height - drawH) * 0.1;
  } else {
    drawH = canvas.height;
    drawW = canvas.height * imgRatio;
    drawX = (canvas.width - drawW) / 2;
    drawY = 0;
  }

  // Render at full — CSS handles opacity/blur/brightness suppression
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

// Preload frames in priority ranges
function preloadRange(start, end) {
  return new Promise((resolve) => {
    let loaded = 0;
    const total = end - start + 1;
    for (let i = start; i <= end; i++) {
      if (frameImages[i] && frameImages[i].complete) {
        loaded++;
        if (loaded >= total) resolve();
        continue;
      }
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        loaded++;
        if (loaded >= total) resolve();
      };
      img.onerror = () => {
        loaded++;
        if (loaded >= total) resolve();
      };
      frameImages[i] = img;
    }
    if (loaded >= total) resolve();
  });
}

// ==========================================
// 3. IMAGE SEQUENCE SCROLL CONTROL
// ==========================================
function mapRange(value, inMin, inMax, outMin, outMax) {
  const clamped = Math.max(inMin, Math.min(inMax, value));
  return Math.round(outMin + ((clamped - inMin) * (outMax - outMin)) / (inMax - inMin));
}

// Five folds mapped to the available 91 frames
const foldConfig = {
  fold2: { startFrame: 1,  endFrame: 18, opacityStart: 0.70, opacityEnd: 0.78, scaleStart: 1.02, scaleEnd: 1.05, yStart: 0,   yEnd: -5  },
  fold3: { startFrame: 19, endFrame: 36, opacityStart: 0.75, opacityEnd: 0.82, scaleStart: 1.03, scaleEnd: 1.06, yStart: -3,  yEnd: -10 },
  fold4: { startFrame: 37, endFrame: 54, opacityStart: 0.78, opacityEnd: 0.85, scaleStart: 1.03, scaleEnd: 1.06, yStart: -5,  yEnd: -15 },
  fold5: { startFrame: 55, endFrame: 72, opacityStart: 0.82, opacityEnd: 0.90, scaleStart: 1.02, scaleEnd: 1.04, yStart: -2,  yEnd: -5  },
  fold6: { startFrame: 73, endFrame: 91, opacityStart: 0.85, opacityEnd: 0.92, scaleStart: 1.00, scaleEnd: 1.02, yStart: 0,   yEnd: 0   }
};

function updateCanvasStyle(foldKey, progress) {
  const config = foldConfig[foldKey];
  if (!config) return;

  const opacity = config.opacityStart + (config.opacityEnd - config.opacityStart) * progress;
  const scale = config.scaleStart + (config.scaleEnd - config.scaleStart) * progress;
  const translateY = config.yStart + (config.yEnd - config.yStart) * progress;

  canvas.style.opacity = opacity;
  canvas.style.filter = `brightness(0.75) saturate(1.3)`;
  canvas.style.transform = `scale(${scale}) translateY(${translateY}px)`;
}

// ==========================================
// 4. GSAP SCROLL ANIMATIONS (CONTENT)
// ==========================================

// --- Hero content fade out ---
gsap.to('.hero-content', {
  opacity: 0,
  y: -50,
  ease: 'none',
  scrollTrigger: {
    trigger: '.fold-hero',
    start: '30% top',
    end: 'bottom top',
    scrub: true
  }
});

// --- Helix lines stagger reveal ---
gsap.utils.toArray('.helix-line').forEach((line, i) => {
  gsap.to(line, {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: '.fold-helix',
      start: `${15 + i * 15}% bottom`,
      end: `${35 + i * 15}% center`,
      scrub: 1
    }
  });
});

// --- Magic S dissolving ---
gsap.to('.magic-s', {
  opacity: 0,
  filter: 'blur(10px)',
  scale: 1.5,
  scrollTrigger: {
    trigger: '.fold-helix',
    start: 'top bottom',
    end: 'top center',
    scrub: 1
  }
});

// --- Section headers ---
gsap.utils.toArray('.section-header.reveal-block').forEach(header => {
  gsap.to(header, {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: header,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1
    }
  });
});

// --- Agent cards stagger ---
gsap.utils.toArray('.agent-card.reveal-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    delay: i * 0.1
  });
});

// --- SAS cards stagger ---
gsap.utils.toArray('.sas-card.reveal-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    delay: i * 0.12
  });
});

// --- Creator reveal ---
gsap.to('.creator-inner.reveal-block', {
  opacity: 1,
  y: 0,
  duration: 1.2,
  scrollTrigger: {
    trigger: '.fold-creator',
    start: 'top 65%',
    toggleActions: 'play none none none'
  }
});

// --- CTA reveal ---
gsap.to('.cta-inner.reveal-block', {
  opacity: 1,
  y: 0,
  duration: 1.2,
  scrollTrigger: {
    trigger: '.fold-cta',
    start: 'top 70%',
    toggleActions: 'play none none none'
  }
});

// ==========================================
// 5. AMBIENT SCROLL DRIVER
// ==========================================
const immersiveZone = document.getElementById('immersive-zone');
const foldElements = {
  fold2: document.getElementById('helix-fold'),
  fold3: document.getElementById('species-fold'),
  fold4: document.getElementById('sas-fold'),
  fold5: document.getElementById('creator-section'),
  fold6: document.getElementById('cta-fold')
};

ScrollTrigger.create({
  trigger: immersiveZone,
  start: 'top top',
  end: 'bottom bottom',
  scrub: 0.8,
  onUpdate: () => {
    const scrollY = window.scrollY;
    const viewCenter = scrollY + window.innerHeight / 2;

    for (const [foldKey, foldEl] of Object.entries(foldElements)) {
      if (!foldEl) continue;
      const config = foldConfig[foldKey];
      const foldTop = foldEl.offsetTop;
      const foldEnd = foldTop + foldEl.offsetHeight;

      if (viewCenter >= foldTop && viewCenter <= foldEnd) {
        const progress = Math.max(0, Math.min(1, (viewCenter - foldTop) / (foldEnd - foldTop)));

        // Map to frame
        targetFrame = mapRange(progress, 0, 1, config.startFrame, config.endFrame);

        // Update style
        updateCanvasStyle(foldKey, progress);

        // Draw frame if changed
        if (currentFrame !== targetFrame) {
          currentFrame = targetFrame;
          requestAnimationFrame(() => drawFrame(currentFrame));
        }

        break;
      }
    }
  }
});

// ==========================================
// 6. INIT + PRELOAD
// ==========================================
async function init() {
  resizeCanvas();

  // Priority load: first fold range
  await preloadRange(1, 18);
  drawFrame(1);

  // Stream remaining ranges
  preloadRange(19, 36);
  preloadRange(37, 54);
  preloadRange(55, 72);
  preloadRange(73, 91);
}

window.addEventListener('resize', resizeCanvas);
init();

// ==========================================
// 7. CUSTOM CURSOR SYSTEM
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = -100, mouseY = -100;
let dotX = -100, dotY = -100;
let ringX = -100, ringY = -100;
let cursorVisible = false;

// Lerp constant for smoothing the trailing outer ring
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

// Track mouse instantly
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (!cursorVisible && cursorDot && cursorRing) {
    cursorVisible = true;
    dotX = mouseX;
    dotY = mouseY;
    ringX = mouseX;
    ringY = mouseY;
    cursorDot.classList.add('is-visible');
    cursorRing.classList.add('is-visible');
  }
});

// Animate using requestAnimationFrame
function animateCursor() {
  dotX = mouseX;
  dotY = mouseY;
  
  ringX = lerp(ringX, mouseX, 0.15);
  ringY = lerp(ringY, mouseY, 0.15);
  
  if (cursorDot && cursorRing) {
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  
  requestAnimationFrame(animateCursor);
}
requestAnimationFrame(animateCursor);

// Add hover effects
const interactables = document.querySelectorAll('a, button, [role="button"], .agent-card, .sas-card');
interactables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursorDot && cursorRing) {
      cursorDot.classList.add('hovered');
      cursorRing.classList.add('hovered');
    }
  });
  el.addEventListener('mouseleave', () => {
    if (cursorDot && cursorRing) {
      cursorDot.classList.remove('hovered');
      cursorRing.classList.remove('hovered');
    }
  });
});

// Scroll effect
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (cursorRing) cursorRing.style.opacity = '0.3';
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    if (cursorRing) cursorRing.style.opacity = '1';
  }, 100);
});
