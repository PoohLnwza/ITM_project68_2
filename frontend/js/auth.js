/**
 * auth.js — Cyberpark Authentication
 *
 * Modes (set window.AUTH_MODE before including this script):
 *   "guard"    — auto-guard page; close modal → history.back()  (module pages)
 *   "intercept"— no auto-guard; intercept .start-btn clicks     (path pages)
 *   undefined  — no auth enforcement                            (index)
 */

(function () {
  // ── Patch global fetch to bypass ngrok browser warning ────────────────────
  const _origFetch = window.fetch;
  window.fetch = function (url, opts = {}) {
    opts.headers = opts.headers || {};
    if (
      typeof opts.headers === 'object' &&
      !(opts.headers instanceof Headers)
    ) {
      opts.headers['ngrok-skip-browser-warning'] = 'true';
    }
    return _origFetch.call(this, url, opts);
  };

  let API = window.location.origin;
  if (API.includes('file://') || window.location.port === '5500' || window.location.port === '3000') {
    API = 'http://localhost:8000';
  }
  const TOKEN_KEY = 'ss_token';
  const EMAIL_KEY = 'ss_email';
  const MODE = window.AUTH_MODE || null; // "guard" | "intercept" | null
  
  function setCookie(name, value, days) {
    try {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    } catch(e) {}
    try { localStorage.setItem(name, value); } catch(e) {}
  }

  function getCookie(name) {
    let val = null;
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          val = c.substring(nameEQ.length, c.length);
          break;
        }
      }
    } catch(e) {}
    
    if (!val) {
      try { val = localStorage.getItem(name); } catch(e) {}
    }
    return val;
  }

  function deleteCookie(name) {
    try { document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'; } catch(e) {}
    try { localStorage.removeItem(name); } catch(e) {}
  }

  function getCssHref() {
    const isSubPage = window.location.pathname.includes('/pages/');
    return isSubPage ? '../css/auth.css' : 'css/auth.css';
  }

  function injectCSS() {
    if (document.getElementById('auth-css')) return;
    const link = document.createElement('link');
    link.id = 'auth-css';
    link.rel = 'stylesheet';
    link.href = getCssHref();
    document.head.appendChild(link);
  }

  // ── Modal HTML ────────────────────────────────────────────────────────────
  function createModal() {
    const div = document.createElement('div');
    div.id = 'auth-overlay';
    div.innerHTML = `
      <div class="auth-card">
        <button class="auth-close" id="auth-close-btn" title="ปิด">✕</button>

        <div class="auth-logo">
          <span class="auth-logo-title">CYBERPARK</span>
          <span class="auth-logo-sub">CYBERSECURITY LEARNING PLATFORM</span>
        </div>

        <div class="auth-tabs">
          <button class="auth-tab active" id="tab-login" onclick="Auth.showTab('login')">ACCESS SYSTEM</button>
          <button class="auth-tab" id="tab-register" onclick="Auth.showTab('register')">CREATE AGENT</button>
        </div>

        <!-- Login Form -->
        <form class="auth-form active" id="form-login" onsubmit="Auth.handleLogin(event)">
          <div class="auth-field">
            <label>EMAIL</label>
            <input type="email" id="login-email" placeholder="user@example.com" required />
          </div>
          <div class="auth-field">
            <label>PASSWORD</label>
            <input type="password" id="login-password" placeholder="••••••••" required />
          </div>
          <div class="auth-message" id="login-msg"></div>
          <button type="submit" class="auth-submit" id="login-btn">ACCESS SYSTEM →</button>
        </form>

        <!-- Register Form -->
        <form class="auth-form" id="form-register" onsubmit="Auth.handleRegister(event)">
          <div class="auth-field">
            <label>EMAIL</label>
            <input type="email" id="reg-email" placeholder="user@example.com" required />
          </div>
          <div class="auth-field">
            <label>PASSWORD (min 6 chars)</label>
            <input type="password" id="reg-password" placeholder="••••••••" required minlength="6" />
          </div>
          <div class="auth-message" id="reg-msg"></div>
          <button type="submit" class="auth-submit" id="reg-btn">CREATE AGENT →</button>
        </form>

        <p class="auth-prompt">root@cyberpark:~$ <span>authenticate_user</span></p>
      </div>
    `;
    document.body.appendChild(div);

    // Close button behaviour
    document.getElementById('auth-close-btn').addEventListener('click', () => {
      if (MODE === 'guard') {
        history.back();
      } else {
        hideModal();
      }
    });
  }

  // ── Show / hide modal ─────────────────────────────────────────────────────
  function showModal() {
    injectCSS();
    if (!document.getElementById('auth-overlay')) createModal();
    document.getElementById('auth-overlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    const el = document.getElementById('auth-overlay');
    if (el) el.style.display = 'none';
    document.body.style.overflow = '';
    _pendingCallback = null;
  }

  // ── Tab switching ─────────────────────────────────────────────────────────
  function showTab(tab) {
    document
      .getElementById('form-login')
      .classList.toggle('active', tab === 'login');
    document
      .getElementById('form-register')
      .classList.toggle('active', tab === 'register');
    document
      .getElementById('tab-login')
      .classList.toggle('active', tab === 'login');
    document
      .getElementById('tab-register')
      .classList.toggle('active', tab === 'register');
    clearMessages();
  }

  function clearMessages() {
    ['login-msg', 'reg-msg'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.className = 'auth-message';
        el.textContent = '';
      }
    });
  }

  function setMessage(id, text, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = `auth-message ${type}`;
    el.textContent = text;
  }

  function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading
      ? 'กำลังดำเนินการ...'
      : btnId === 'login-btn'
        ? 'ACCESS SYSTEM →'
        : 'CREATE AGENT →';
  }

  // ── Pending callback after successful login ───────────────────────────────
  let _pendingCallback = null;

  // ── Login ─────────────────────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    setLoading('login-btn', true);
    clearMessages();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage('login-msg', data.detail || 'ข้อมูลไม่ถูกต้อง หรือเซิร์ฟเวอร์ปฏิเสธการเข้าถึง โปรดตรวจสอบอีกครั้ง', 'error');
        return;
      }

      setCookie(TOKEN_KEY, data.token, 7);
      setCookie(EMAIL_KEY, data.email, 7);
      hideModal();

      if (_pendingCallback) {
        const cb = _pendingCallback;
        _pendingCallback = null;
        cb();
      }
    } catch {
      setMessage('login-msg', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ โปรดตรวจสอบเครือข่ายอินเทอร์เน็ตแล้วลองใหม่', 'error');
    } finally {
      setLoading('login-btn', false);
    }
  }

  // ── Register ──────────────────────────────────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault();
    setLoading('reg-btn', true);
    clearMessages();

    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage('reg-msg', data.detail || 'ข้อมูลไม่ถูกต้อง หรือเซิร์ฟเวอร์ปฏิเสธการเข้าถึง โปรดตรวจสอบอีกครั้ง', 'error');
        return;
      }

      setMessage(
        'reg-msg',
        'สมัครสำเร็จ! กรุณา login เพื่อเข้าใช้งาน',
        'success',
      );
      document.getElementById('form-register').reset();
    } catch {
      setMessage('reg-msg', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ โปรดตรวจสอบเครือข่ายอินเทอร์เน็ตแล้วลองใหม่', 'error');
    } finally {
      setLoading('reg-btn', false);
    }
  }

  // ── Token validation ──────────────────────────────────────────────────────
  function getToken() {
    return getCookie(TOKEN_KEY);
  }

  function getEmail() {
    return getCookie(EMAIL_KEY);
  }

  async function isTokenValid(token) {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // ── requireAuth(callback) — show modal if not logged in ───────────────────
  async function requireAuth(callbackOrUrl) {
    const token = getToken();
    const cb =
      typeof callbackOrUrl === 'string'
        ? () => {
            window.location.href = callbackOrUrl;
          }
        : callbackOrUrl;

    if (token && (await isTokenValid(token))) {
      cb();
    } else {
      deleteCookie(TOKEN_KEY);
      deleteCookie(EMAIL_KEY);
      _pendingCallback = cb;
      showModal();
    }
  }

  // ── Auto-guard (for module pages) ─────────────────────────────────────────
  async function guardPage() {
    const token = getToken();
    if (token && (await isTokenValid(token))) return;
    deleteCookie(TOKEN_KEY);
    deleteCookie(EMAIL_KEY);
    showModal();
  }

  // ── Intercept .start-btn clicks ───────────────────────────────────────────
  function interceptStartButtons() {
    document.querySelectorAll('.start-btn').forEach((btn) => {
      // Determine destination from onclick attribute or parent <a>
      let dest = null;

      const onclickAttr = btn.getAttribute('onclick') || '';
      const matchOnclick = onclickAttr.match(/href\s*=\s*['"]([^'"]+)['"]/);
      if (matchOnclick) {
        dest = matchOnclick[1];
        btn.removeAttribute('onclick');
      }

      const parentLink = btn.closest('a[href]');
      if (!dest && parentLink) {
        dest = parentLink.getAttribute('href');
        parentLink.removeAttribute('href');
        parentLink.style.cursor = 'default';
      }

      if (!dest) return; // no destination, skip

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        requireAuth(dest);
      });
    });
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  function logout() {
    deleteCookie(TOKEN_KEY);
    deleteCookie(EMAIL_KEY);
    window.location.href = window.location.pathname.includes('/pages/')
      ? '../index.html'
      : 'index.html';
  }

  // ── Progress Tracking ─────────────────────────────────────────────────────
  async function saveProgress(moduleId, progressPercent, completedIds) {
    const token = getToken();
    if (!token) return { success: false, message: 'No token' };

    try {
      const res = await fetch(`${API}/api/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          module_id: moduleId,
          progress_percent: progressPercent,
          completed_ids: completedIds,
        }),
      });
      return { success: res.ok };
    } catch {
      return { success: false };
    }
  }

  async function submitTask(moduleId, sectionId) {
    const token = getToken();
    if (!token) return { success: false, message: 'No token' };

    try {
      const res = await fetch(`${API}/api/submit-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          module_id: moduleId,
          section_id: sectionId,
        }),
      });
      const data = await res.json();
      return {
        success: res.ok,
        progress_percent: data.progress_percent,
        completed_ids: data.completed_ids,
      };
    } catch {
      return { success: false };
    }
  }

  async function getProgress(moduleId) {
    const data = await getProgressData(moduleId);
    return data.percent;
  }

  async function getProgressData(moduleId) {
    const token = getToken();
    if (!token) return { percent: 0, completed_ids: [] };
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const modData = data.progress && data.progress[moduleId];
        if (typeof modData === 'object') {
          return {
            percent: modData.percent || 0,
            completed_ids: modData.completed_ids || [],
          };
        }
        return { percent: modData || 0, completed_ids: [] };
      }
    } catch (e) {}
    return { percent: 0, completed_ids: [] };
  }

  // ── Profile Updates ───────────────────────────────────────────────────────
  async function updateEmail(newEmail, password) {
    const token = getToken();
    if (!token) return { success: false, message: 'Please log in first' };
    try {
      const res = await fetch(`${API}/api/auth/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_email: newEmail, password: password }),
      });
      const data = await res.json();
      if (res.ok) {
        setCookie(TOKEN_KEY, data.token, 7);
        setCookie(EMAIL_KEY, data.email, 7);
        return { success: true, message: data.message };
      } else {
        return {
          success: false,
          message: data.detail || 'Email update failed',
        };
      }
    } catch (e) {
      return { success: false, message: 'Server connection error' };
    }
  }

  async function updatePassword(currentPassword, newPassword) {
    const token = getToken();
    if (!token) return { success: false, message: 'Please log in first' };
    try {
      const res = await fetch(`${API}/api/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message };
      } else {
        return {
          success: false,
          message: data.detail || 'Password update failed',
        };
      }
    } catch (e) {
      return { success: false, message: 'Server connection error' };
    }
  }

  async function getAchievements() {
    const token = getToken();
    if (!token) return [];
    try {
      const res = await fetch(`${API}/api/achievements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.badges || [];
      }
    } catch (e) {
      console.error('Failed to get achievements:', e);
    }
    return [];
  }

  async function unlockBadge(badgeId) {
    const token = getToken();
    if (!token) return;
    try {
      await fetch(`${API}/api/achievements/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ badge_id: badgeId }),
      });
    } catch (e) {
      console.error('Failed to unlock badge:', e);
    }
  }

  async function getMe() {
    const token = getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('getMe error:', e);
    }
    return null;
  }

  async function setChosenPath(path) {
    const token = getToken();
    if (!token) return { success: false, message: 'No token' };
    try {
      const res = await fetch(`${API}/api/user/path`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ path: path }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update local state if needed
        window.userChosenPath = data.path;
      }
      return { success: res.ok, message: data.message, path: data.path };
    } catch (e) {
      return { success: false, message: 'Server error' };
    }
  }

  async function handleSidebarPathClick(path, url) {
    const token = getToken();
    if (!token) {
      requireAuth(url);
      return;
    }

    // Fetch latest profile to be sure
    const profile = await getMe();
    const currentPath = profile ? profile.chosen_path : null;

    if (currentPath && currentPath !== path) {
      const confirmChange = confirm(
        'คุณต้องการเปลี่ยนสายการเรียนใช่หรือไม่? (Class ของคุณจะถูกเปลี่ยนตามสายที่เลือกใหม่)',
      );
      if (!confirmChange) return;
    }

    const res = await setChosenPath(path);
    if (res.success) {
      window.location.href = url;
    } else {
      alert('เกิดข้อผิดพลาด: ' + res.message);
    }
  }

  async function syncSidebarUI() {
    const token = getToken();
    if (!token) return;

    const profile = await getMe();
    if (!profile || !profile.chosen_path) return;

    const path = profile.chosen_path;
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    const links = navMenu.querySelectorAll('.nav-link');
    links.forEach((link) => {
      const linkPath = link.getAttribute('data-path');
      const text = link.textContent.toUpperCase();

      const isMatch =
        linkPath === path ||
        (path === 'technical' &&
          !linkPath &&
          text.includes('TECHNICAL') &&
          !text.includes('NON')) ||
        (path === 'non-technical' && !linkPath && text.includes('NON-TECH'));

      if (isMatch) {
        // Add IN PROGRESS tag if not exists
        if (!link.querySelector('.sidebar-path-status')) {
          const tag = document.createElement('span');
          tag.className = 'sidebar-path-status';
          tag.textContent = '[PROGRESS]';
          link.appendChild(tag);
        }
      }
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.Auth = {
    showTab,
    handleLogin,
    handleRegister,
    requireAuth,
    logout,
    saveProgress,
    submitTask,
    getProgress,
    getProgressData,
    getAchievements,
    unlockBadge,
    getToken,
    getEmail,
    getMe,
    setChosenPath,
    handleSidebarPathClick,
    syncSidebarUI,
    updateEmail,
    updatePassword,
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    if (MODE === 'guard') {
      guardPage();
    } else if (MODE === 'intercept') {
      interceptStartButtons();
    }
    // Always sync sidebar if possible
    syncSidebarUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
