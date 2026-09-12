/* =========================================================
   HabitFlow – Auth Page Logic
   ========================================================= */
'use strict';

// ── Ocean background bubbles ──────────────────────────
(function buildBubbles() {
  const wrap = document.getElementById('auth-bubbles');
  if (!wrap) return;
  for (let i = 0; i < 22; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = 3 + Math.random() * 18;
    b.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      animation-duration:${9+Math.random()*18}s;
      animation-delay:${-Math.random()*18}s;
    `;
    wrap.appendChild(b);
  }
  // Rays
  const rays = document.getElementById('auth-rays');
  if (!rays) return;
  [20,38,58,72].forEach((l, i) => {
    const r = document.createElement('span');
    r.style.cssText = `position:absolute;top:-10%;left:${l}%;width:${1+i*.5}px;height:130%;
      background:linear-gradient(180deg,rgba(0,212,200,.5) 0%,transparent 75%);
      transform-origin:top center;opacity:${.3+i*.08};
      animation:rayWave ${8+i*2}s ease-in-out infinite alternate;
      --r:${i%2===0?5:-5};`;
    rays.appendChild(r);
  });
})();

// ── Tab switching ─────────────────────────────────────
let mode = 'login';
function setMode(m) {
  mode = m;
  document.querySelectorAll('.auth-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.mode === m);
  });
  document.getElementById('signup-name-group').style.display = m === 'signup' ? 'flex' : 'none';
  document.getElementById('auth-heading').textContent = m === 'login' ? 'Welcome Back 🌊' : 'Join HabitFlow 🌊';
  document.getElementById('auth-sub').textContent = m === 'login'
    ? 'Sign in to continue your journey.'
    : 'Create your account and start building better habits.';
  document.getElementById('auth-btn-text').textContent = m === 'login' ? 'Sign In' : 'Create Account';
  clearAlert();
}

document.querySelectorAll('.auth-tab').forEach(t => {
  t.addEventListener('click', () => setMode(t.dataset.mode));
});

// ── Toggle password visibility ────────────────────────
document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', () => {
    const inp = btn.previousElementSibling;
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    btn.querySelector('i').className = `fa-solid ${isText ? 'fa-eye' : 'fa-eye-slash'}`;
  });
});

// ── Alert helpers ─────────────────────────────────────
function showAlert(msg, type = 'error') {
  const el = document.getElementById('auth-alert');
  el.className = `auth-alert ${type}`;
  el.innerHTML = `<i class="fa-solid ${type==='error'?'fa-circle-xmark':'fa-circle-check'}"></i> ${msg}`;
}
function clearAlert() {
  const el = document.getElementById('auth-alert');
  el.className = 'auth-alert';
  el.innerHTML = '';
}

// ── Submit ────────────────────────────────────────────
document.getElementById('auth-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();

  const btn  = document.getElementById('auth-btn');
  const email = document.getElementById('auth-email').value.trim();
  const pass  = document.getElementById('auth-pass').value;
  const name  = document.getElementById('auth-name')?.value.trim();

  if (!email || !pass) { showAlert('Please fill in all fields'); return; }
  if (pass.length < 6) { showAlert('Password must be at least 6 characters'); return; }

  btn.classList.add('loading');
  try {
    if (mode === 'login') {
      await DB.auth.login(email, pass);
    } else {
      if (!name) { showAlert('Please enter your name'); btn.classList.remove('loading'); return; }
      await DB.auth.signup(email, pass, name);
    }
    showAlert(mode === 'login' ? 'Signed in! Redirecting...' : 'Account created! Redirecting...', 'success');
    setTimeout(() => { window.location.href = 'app.html'; }, 900);
  } catch (err) {
    showAlert(err.message || 'Something went wrong. Please try again.');
    btn.classList.remove('loading');
  }
});

// ── Demo Mode ─────────────────────────────────────────
document.getElementById('btn-demo').addEventListener('click', async () => {
  clearAlert();
  try {
    await DB.auth.login('demo@habitflow.app', 'demo1234');
    showAlert('Entering demo mode... 🌊', 'success');
    setTimeout(() => { window.location.href = 'app.html'; }, 700);
  } catch(e) {
    showAlert('Demo mode error: ' + e.message);
  }
});

// ── Keydown Enter ─────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const form = document.getElementById('auth-form');
    form.dispatchEvent(new Event('submit'));
  }
});
