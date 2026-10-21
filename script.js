/* ========== SCRIPT.JS ========== */

// ---- Particle System ----
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const EMOJIS = ['✨', '⭐', '💫', '🌸', '💜', '💕'];
const particles = Array.from({ length: 50 }, () => createParticle());

function createParticle() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 12 + 6,
    speedY: -(Math.random() * 0.5 + 0.2),
    speedX: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.6 + 0.2,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    rotate: Math.random() * 360,
    rotateSpeed: (Math.random() - 0.5) * 0.5,
  };
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.font = `${p.size}px serif`;
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotate * Math.PI) / 180);
    ctx.fillText(p.emoji, -p.size / 2, p.size / 2);
    ctx.restore();

    p.y += p.speedY;
    p.x += p.speedX;
    p.rotate += p.rotateSpeed;

    if (p.y < -30) {
      p.y = canvas.height + 30;
      p.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ---- Floating Hearts (Hero) ----
function createFloatingHeart(container) {
  const heart = document.createElement('span');
  heart.textContent = Math.random() < 0.5 ? '💕' : '💜';
  const size = Math.random() * 20 + 14;
  const left = Math.random() * 100;
  const duration = Math.random() * 6 + 6;
  const rot = (Math.random() - 0.5) * 60;

  heart.style.cssText = `
    position: absolute;
    left: ${left}%;
    bottom: -2rem;
    font-size: ${size}px;
    animation: heart-rise ${duration}s ${Math.random() * 3}s ease-in forwards;
    --rot: ${rot}deg;
    pointer-events: none;
  `;
  container.appendChild(heart);
  setTimeout(() => heart.remove(), (duration + 3) * 1000);
}

const heartsContainer = document.getElementById('floatingHearts');
function spawnHearts() {
  createFloatingHeart(heartsContainer);
  setTimeout(spawnHearts, Math.random() * 1500 + 500);
}
spawnHearts();

// ---- YouTube IFrame Player API ----
const YT_VIDEO_ID = 'x1yYLrWJwkk';
let ytPlayer = null;
let isPlaying = false;
let ytReady = false;
let playRequested = false;

// Called automatically by YouTube API when ready
window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('yt-player', {
    height: '1',
    width: '1',
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      loop: 1,
      playlist: YT_VIDEO_ID,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
    },
    events: {
      onReady: (e) => {
        ytReady = true;
        e.target.setVolume(40);
        if (playRequested) {
          e.target.playVideo();
        }
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) {
          isPlaying = true;
          musicBtn.classList.add('playing');
          musicIcon.textContent = '🎵';
        } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
          isPlaying = false;
          musicBtn.classList.remove('playing');
          musicIcon.textContent = '🔇';
        }
      },
    },
  });
};

// ---- Envelope Click → Open ----
const envelopeScreen = document.getElementById('envelope-screen');
const mainContent = document.getElementById('main');

envelopeScreen.addEventListener('click', () => {
  envelopeScreen.classList.add('fade-out');
  setTimeout(() => {
    envelopeScreen.style.display = 'none';
    mainContent.classList.remove('hidden');
    tryPlayMusic();
  }, 800);
});

// ---- Music Control ----
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');

function tryPlayMusic() {
  if (ytReady && ytPlayer) {
    ytPlayer.playVideo();
  } else {
    // Player not ready yet — flag to play once ready
    playRequested = true;
  }
}

musicBtn.addEventListener('click', () => {
  if (!ytPlayer) return;
  if (isPlaying) {
    ytPlayer.pauseVideo();
    isPlaying = false;
    musicBtn.classList.remove('playing');
    musicIcon.textContent = '🔇';
  } else {
    tryPlayMusic();
  }
});

// ---- Candle Interaction ----
const candles = document.querySelectorAll('.candle-wrap');
const wishMsg = document.getElementById('wishMsg');
let litCount = candles.length;

const wishes = [
  '✨ คิดอะไรแล้วขอพรเลย!',
  '💜 อีกหน่อยแล้ว...',
  '🌸 เกือบถึงแล้ว!',
  '💕 หนึ่งเดียวแล้ว!',
  '🎂 Happy Birthday สีกาแพท! ขอให้ความปรารถนาเป็นจริงนะ 💜✨',
];

candles.forEach(candle => {
  candle.addEventListener('click', () => {
    if (candle.dataset.lit === 'true') {
      candle.dataset.lit = 'false';
      litCount--;
      const msg = wishes[candles.length - litCount - 1] || wishes[wishes.length - 1];
      wishMsg.textContent = msg;

      if (litCount === 0) {
        launchConfetti();
        wishMsg.textContent = '🎉 Happy Birthday สีกาแพท! 🎂💕 ขอให้ทุกความปรารถนาเป็นจริงนะ ✨';
      }
    }
  });
});

// ---- Confetti Burst ----
function launchConfetti() {
  const colors = ['#f9a8d4', '#c4b5fd', '#fb7185', '#fbbf24', '#34d399'];
  for (let i = 0; i < 80; i++) {
    const conf = document.createElement('div');
    conf.style.cssText = `
      position: fixed;
      top: ${Math.random() * 60 + 20}%;
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      z-index: 9999;
      pointer-events: none;
      animation: conf-fall ${Math.random() * 2 + 1.5}s ease forwards;
    `;
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 4000);
  }

  // Inject confetti keyframes if not already injected
  if (!document.getElementById('conf-style')) {
    const style = document.createElement('style');
    style.id = 'conf-style';
    style.textContent = `
      @keyframes conf-fall {
        0% { transform: translateY(-40px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(400px) rotate(${Math.random() * 720}deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ---- Scroll Reveal ----
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fade-in-up 0.7s ease forwards';
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.letter-card, .gallery-item, .closing-card').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ---- Photo Placeholder Click (file upload) ----
document.querySelectorAll('.photo-placeholder').forEach((slot, i) => {
  slot.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = document.createElement('img');
      img.src = url;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      const parent = slot.parentElement;
      parent.innerHTML = '';
      parent.appendChild(img);
    };
    input.click();
  });
});
