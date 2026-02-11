/* ==========================================
   Valentine's reCAPTCHA — Script
   ========================================== */

(function () {
  'use strict';

  // ---- Config ----
  const TILES = [
    { id: 1, type: 'valentine', emoji: '🧑' },
    { id: 2, type: 'other', emoji: '🌳' },
    { id: 3, type: 'valentine', emoji: '🧑' },
    { id: 4, type: 'other', emoji: '🏠' },
    { id: 5, type: 'valentine', emoji: '🧑' },
    { id: 6, type: 'other', emoji: '🐶' },
    { id: 7, type: 'valentine', emoji: '🧑' },
    { id: 8, type: 'other', emoji: '🚗' },
    { id: 9, type: 'valentine', emoji: '🧑' },
  ];

  const REJECTION_MESSAGES = [
    "Ernsthaft?! Derek Shepherd?! 😤 Überleg dir das nochmal...",
    "Hmmm... bist du sicher? Der ist doch nur im Fernsehen! 🤔💔",
    "Netter Versuch! Aber ich glaub, da gibt's eine bessere Option... 😏",
    "McDreamy? Wirklich? Schau nochmal genauer hin! 👀💕",
    "Plot Twist: Derek ist leider nicht verfügbar 😅 Versuch's nochmal!",
  ];

  // Shuffle helper
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ---- DOM refs ----
  const heartsBg = document.getElementById('hearts-bg');
  const stepCheckbox = document.getElementById('step-checkbox');
  const stepChallenge = document.getElementById('step-challenge');
  const stepChoose = document.getElementById('step-choose');
  const stepFinal = document.getElementById('step-final');
  const checkboxArea = document.getElementById('checkbox-area');
  const checkboxBox = document.getElementById('checkbox-box');
  const checkboxSpinner = document.getElementById('checkbox-spinner');
  const checkboxCheck = document.getElementById('checkbox-check');
  const captchaGrid = document.getElementById('captcha-grid');
  const verifyBtn = document.getElementById('verify-btn');
  const chooseGrid = document.getElementById('choose-grid');
  const rejectionOverlay = document.getElementById('rejection-overlay');
  const rejectionText = document.getElementById('rejection-text');
  const rejectionClose = document.getElementById('rejection-close');
  const heartBurst = document.getElementById('heart-burst');

  let selectedTiles = new Set();
  let rejectionIndex = 0;

  // ---- Floating Hearts ----
  function createFloatingHearts() {
    const hearts = ['❤️', '💕', '💖', '💗', '💘', '💝', '💓', '💞', '🩷', '♥️'];
    for (let i = 0; i < 25; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (14 + Math.random() * 22) + 'px';
      heart.style.animationDuration = (6 + Math.random() * 8) + 's';
      heart.style.animationDelay = (Math.random() * 10) + 's';
      heartsBg.appendChild(heart);
    }
  }

  // ============================================================
  // STEP 1: Checkbox click
  // ============================================================
  checkboxArea.addEventListener('click', function () {
    checkboxSpinner.classList.add('active');
    checkboxBox.style.borderColor = 'transparent';

    setTimeout(function () {
      checkboxSpinner.classList.remove('active');
      stepCheckbox.style.display = 'none';
      stepChallenge.style.display = 'block';
      buildGrid();
    }, 1200 + Math.random() * 800);
  });

  // ============================================================
  // STEP 2: Image grid
  // ============================================================
  function buildGrid() {
    captchaGrid.innerHTML = '';
    const shuffled = shuffle([...TILES]);

    shuffled.forEach(function (tile) {
      const el = document.createElement('div');
      el.className = 'captcha-tile';
      el.dataset.id = tile.id;
      el.dataset.type = tile.type;

      // Add pink border hint for valentine tiles
      if (tile.type === 'valentine') {
        el.classList.add('valentine-hint');
      }

      // Placeholder image
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder-img ' + tile.type;
      placeholder.textContent = tile.emoji;

      // Overlay + check
      const overlay = document.createElement('div');
      overlay.className = 'tile-overlay';

      const check = document.createElement('div');
      check.className = 'tile-check';
      check.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      overlay.appendChild(check);
      el.appendChild(placeholder);
      el.appendChild(overlay);

      el.addEventListener('click', function () {
        toggleTile(el, tile);
      });

      captchaGrid.appendChild(el);
    });
  }

  function toggleTile(el, tile) {
    if (selectedTiles.has(tile.id)) {
      selectedTiles.delete(tile.id);
      el.classList.remove('selected');
    } else {
      selectedTiles.add(tile.id);
      el.classList.add('selected');
    }
  }

  // Verify button
  verifyBtn.addEventListener('click', function () {
    const valentineIds = TILES.filter(t => t.type === 'valentine').map(t => t.id);
    const otherIds = TILES.filter(t => t.type === 'other').map(t => t.id);

    const allValentinesSelected = valentineIds.every(id => selectedTiles.has(id));
    const noOthersSelected = otherIds.every(id => !selectedTiles.has(id));

    if (allValentinesSelected && noOthersSelected) {
      // Move to Step 3 — choose your valentine
      stepChallenge.style.display = 'none';
      stepChoose.style.display = 'block';
      buildChooseCards();
    } else {
      const container = document.querySelector('.captcha-challenge-container');
      container.classList.add('shake');
      setTimeout(() => container.classList.remove('shake'), 650);
      selectedTiles.clear();
      document.querySelectorAll('.captcha-tile').forEach(el => el.classList.remove('selected'));
    }
  });

  // ============================================================
  // STEP 3: Choose your Valentine
  // ============================================================
  function buildChooseCards() {
    chooseGrid.innerHTML = '';

    const candidates = [
      {
        id: 'derek',
        name: 'Derek Shepherd',
        subtitle: 'McDreamy 🏥',
        type: 'wrong',
        emoji: '👨‍⚕️',
        imgSrc: null,
      },
      {
        id: 'placeholder',
        name: 'Dein wahrer Valentine',
        subtitle: '💖 ???',
        type: 'correct',
        emoji: '🧑',
        imgSrc: null,
      },
    ];

    // Shuffle the order so it's not always the same
    const shuffled = shuffle([...candidates]);

    shuffled.forEach(function (candidate) {
      const card = document.createElement('div');
      card.className = 'choose-card';
      card.dataset.type = candidate.type;

      if (candidate.imgSrc) {
        const img = document.createElement('img');
        img.className = 'choose-card-img';
        img.src = candidate.imgSrc;
        img.alt = candidate.name;
        card.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.className = 'choose-card-placeholder';
        ph.textContent = candidate.emoji || '❓';
        card.appendChild(ph);
      }

      const label = document.createElement('div');
      label.className = 'choose-card-label';
      label.innerHTML = '<strong>' + candidate.name + '</strong><br>' + candidate.subtitle;
      card.appendChild(label);

      card.addEventListener('click', function () {
        if (candidate.type === 'wrong') {
          handleWrongChoice(card);
        } else {
          handleCorrectChoice();
        }
      });

      chooseGrid.appendChild(card);
    });
  }

  function handleWrongChoice(card) {
    // Wiggle the card
    card.classList.add('wiggle');
    setTimeout(() => card.classList.remove('wiggle'), 500);

    // Show rejection overlay with rotating messages
    const msg = REJECTION_MESSAGES[rejectionIndex % REJECTION_MESSAGES.length];
    rejectionIndex++;
    rejectionText.textContent = msg;
    rejectionOverlay.classList.add('active');
  }

  rejectionClose.addEventListener('click', function () {
    rejectionOverlay.classList.remove('active');
  });

  function handleCorrectChoice() {
    stepChoose.style.display = 'none';
    stepFinal.style.display = 'block';

    createHeartBurst();
    createFireworks();
    createConfetti();

    // Continuous extra hearts
    let burstCount = 0;
    const interval = setInterval(() => {
      createConfetti(20);
      burstCount++;
      if (burstCount >= 3) clearInterval(interval);
    }, 1500);
  }

  // ============================================================
  // STEP 4: Success effects
  // ============================================================
  function createHeartBurst() {
    const burstHearts = ['❤️', '💖', '💗', '💕', '💘', '💝', '🩷'];
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('span');
      heart.className = 'burst-heart';
      heart.textContent = burstHearts[Math.floor(Math.random() * burstHearts.length)];
      const angle = (360 / 20) * i;
      const dist = 80 + Math.random() * 100;
      heart.style.setProperty('--bx', (Math.cos(angle * Math.PI / 180) * dist) + 'px');
      heart.style.setProperty('--by', (Math.sin(angle * Math.PI / 180) * dist) + 'px');
      heart.style.setProperty('--br', (Math.random() * 360) + 'deg');
      heart.style.animationDelay = (Math.random() * 0.4) + 's';
      heart.style.fontSize = (16 + Math.random() * 18) + 'px';
      heartBurst.appendChild(heart);
    }
  }

  function createFireworks() {
    const colors = ['#e84393', '#fd79a8', '#ff6b6b', '#feca57', '#ff9ff3', '#f368e0', '#ee5a24'];
    // Launch several fireworks from different positions
    for (let f = 0; f < 5; f++) {
      setTimeout(() => {
        const cx = 10 + Math.random() * 80; // vw
        const cy = 10 + Math.random() * 50; // vh
        for (let i = 0; i < 30; i++) {
          const particle = document.createElement('div');
          particle.className = 'firework';
          particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          particle.style.left = cx + 'vw';
          particle.style.top = cy + 'vh';
          const angle = (360 / 30) * i + Math.random() * 12;
          const dist = 40 + Math.random() * 120;
          particle.style.setProperty('--fx', (Math.cos(angle * Math.PI / 180) * dist) + 'px');
          particle.style.setProperty('--fy', (Math.sin(angle * Math.PI / 180) * dist) + 'px');
          particle.style.animationDelay = (Math.random() * 0.15) + 's';
          particle.style.width = (3 + Math.random() * 5) + 'px';
          particle.style.height = particle.style.width;
          document.body.appendChild(particle);
        }
      }, f * 600);
    }

    // Clean up
    setTimeout(() => {
      document.querySelectorAll('.firework').forEach(el => el.remove());
    }, 6000);
  }

  function createConfetti(count) {
    count = count || 60;
    const colors = ['#e84393', '#fd79a8', '#fab1a0', '#ff6b6b', '#ee5a24', '#f8c291', '#ff9ff3', '#feca57'];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.width = (6 + Math.random() * 8) + 'px';
      piece.style.height = (6 + Math.random() * 8) + 'px';
      piece.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      piece.style.animationDelay = (Math.random() * 1) + 's';
      document.body.appendChild(piece);
    }

    setTimeout(() => {
      document.querySelectorAll('.confetti-piece').forEach(el => el.remove());
    }, 5000);
  }

  // ---- Init ----
  createFloatingHearts();
})();
