/* Kat — smart on-site assistant: answers + navigates */
(function () {
  const HISTORY_KEY = 'kat.history.v1';
  const OPEN_KEY = 'kat.open.v1';
  const MAX_HISTORY = 12;

  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(HISTORY_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.slice(-MAX_HISTORY) : [];
    } catch {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
    } catch {
      /* ignore quota */
    }
  }

  function formatReply(text) {
    const escaped = String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function goTo(nav) {
    if (!nav || !nav.href) return;
    if (nav.external) {
      window.open(nav.href, '_blank', 'noopener,noreferrer');
      return;
    }
    const url = new URL(nav.href, window.location.origin);
    const samePath =
      url.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '') ||
      (url.pathname.endsWith('/index.html') &&
        (location.pathname === '/' || location.pathname.endsWith('/index.html')));

    if (samePath && url.hash) {
      const el = document.querySelector(url.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', url.hash);
        return;
      }
    }
    window.location.assign(url.pathname + url.search + url.hash);
  }

  function mount() {
    if (document.getElementById('kat-root')) return;
    if (location.pathname.includes('admin')) return;

    const root = document.createElement('div');
    root.id = 'kat-root';
    root.innerHTML = `
<button type="button" class="kat-launcher" id="kat-launcher" aria-expanded="false" aria-controls="kat-panel" aria-label="Open Kat, site assistant">
  <span class="kat-launcher-avatar" aria-hidden="true">K</span>
  <span class="kat-launcher-label">Ask Kat</span>
</button>
<section class="kat-panel" id="kat-panel" hidden role="dialog" aria-modal="false" aria-labelledby="kat-title">
  <header class="kat-header">
    <div class="kat-header-text">
      <p class="kat-kicker">Refine ICT assistant</p>
      <h2 id="kat-title">Kat</h2>
    </div>
    <button type="button" class="kat-close" id="kat-close" aria-label="Close Kat">×</button>
  </header>
  <div class="kat-messages" id="kat-messages" aria-live="polite"></div>
  <div class="kat-suggestions" id="kat-suggestions"></div>
  <form class="kat-form" id="kat-form">
    <label class="visually-hidden" for="kat-input">Message Kat</label>
    <input id="kat-input" name="message" type="text" maxlength="800" autocomplete="off" placeholder="Ask about services, or say “go to contact”…" required>
    <button type="submit" class="kat-send" id="kat-send">Send</button>
  </form>
</section>`;
    document.body.appendChild(root);

    const launcher = document.getElementById('kat-launcher');
    const panel = document.getElementById('kat-panel');
    const closeBtn = document.getElementById('kat-close');
    const form = document.getElementById('kat-form');
    const input = document.getElementById('kat-input');
    const messages = document.getElementById('kat-messages');
    const suggestionsEl = document.getElementById('kat-suggestions');
    const sendBtn = document.getElementById('kat-send');

    let history = loadHistory();
    let busy = false;

    function setOpen(open) {
      panel.hidden = !open;
      launcher.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('kat-open', open);
      try {
        sessionStorage.setItem(OPEN_KEY, open ? '1' : '0');
      } catch {
        /* ignore */
      }
      if (open) {
        input.focus();
        messages.scrollTop = messages.scrollHeight;
      }
    }

    function addBubble(role, html, meta) {
      const row = document.createElement('div');
      row.className = `kat-msg kat-msg--${role}`;
      const bubble = document.createElement('div');
      bubble.className = 'kat-bubble';
      bubble.innerHTML = html;
      row.appendChild(bubble);
      if (meta?.navigate) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'kat-nav-btn';
        btn.textContent = meta.navigate.external
          ? `Open ${meta.navigate.label}`
          : `Go to ${meta.navigate.label}`;
        btn.addEventListener('click', () => goTo(meta.navigate));
        row.appendChild(btn);
      }
      messages.appendChild(row);
      messages.scrollTop = messages.scrollHeight;
    }

    function renderSuggestions(list) {
      suggestionsEl.innerHTML = '';
      (list || []).slice(0, 5).forEach((label) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'kat-chip';
        b.textContent = label;
        b.addEventListener('click', () => {
          input.value = label;
          form.requestSubmit();
        });
        suggestionsEl.appendChild(b);
      });
    }

    function ensureWelcome() {
      if (messages.childElementCount) return;
      if (history.length) {
        history.forEach((m) => {
          addBubble(m.role === 'assistant' ? 'assistant' : 'user', formatReply(m.content));
        });
        renderSuggestions(['Services', 'Pricing', 'Contact', 'Office map']);
        return;
      }
      addBubble(
        'assistant',
        formatReply(
          "Hi — I'm **Kat**. Ask me anything about Refine ICT, or tell me where to take you (services, pricing, contact, map, a specific service…)."
        )
      );
      renderSuggestions(['Show services', 'Pricing plans', 'Contact & quote', 'Office location', 'Cybersecurity']);
    }

    async function ask(text) {
      if (busy) return;
      const message = String(text || '').trim();
      if (!message) return;

      busy = true;
      sendBtn.disabled = true;
      addBubble('user', formatReply(message));
      history.push({ role: 'user', content: message });
      saveHistory(history);
      renderSuggestions([]);

      const typing = document.createElement('div');
      typing.className = 'kat-msg kat-msg--assistant';
      typing.innerHTML = '<div class="kat-bubble kat-typing">Kat is thinking…</div>';
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;

      try {
        const res = await fetch('/api/kat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history: history.slice(0, -1) }),
        });
        const data = await res.json().catch(() => ({}));
        typing.remove();

        if (!res.ok) {
          addBubble('assistant', formatReply(data.error || 'Something went wrong. Please try again.'));
          return;
        }

        addBubble('assistant', formatReply(data.reply), { navigate: data.navigate });
        history.push({ role: 'assistant', content: data.reply || '' });
        saveHistory(history);
        renderSuggestions(data.suggestions);

        if (data.navigate) {
          window.setTimeout(() => goTo(data.navigate), 700);
        }
      } catch {
        typing.remove();
        addBubble(
          'assistant',
          formatReply("I couldn't reach the server just now. Check your connection and try again.")
        );
      } finally {
        busy = false;
        sendBtn.disabled = false;
        input.focus();
      }
    }

    launcher.addEventListener('click', () => {
      const open = panel.hidden;
      setOpen(open);
      if (open) ensureWelcome();
    });
    closeBtn.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) setOpen(false);
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value;
      input.value = '';
      ask(value);
    });

    // Position above WhatsApp
    document.body.classList.add('has-kat');

    try {
      if (sessionStorage.getItem(OPEN_KEY) === '1') {
        setOpen(true);
        ensureWelcome();
      }
    } catch {
      /* ignore */
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
