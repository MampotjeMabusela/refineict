const $ = (id) => document.getElementById(id);

async function api(url, opts) {
  const r = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) },
    ...opts,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Request failed');
  return j;
}

function showApp(on) {
  $('login-panel').hidden = on;
  $('app-panel').hidden = !on;
}

async function checkSession() {
  try {
    await api('/api/admin/me');
    showApp(true);
    await loadLeads();
  } catch {
    showApp(false);
  }
}

function exportHref() {
  const q = $('q').value.trim();
  const handled = $('handled').value;
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (handled !== '') params.set('handled', handled);
  const qs = params.toString();
  $('export').href = '/api/admin/leads.csv' + (qs ? `?${qs}` : '');
}

async function loadLeads() {
  const msg = $('list-msg');
  msg.textContent = 'Loading…';
  msg.className = 'form-msg';
  try {
    const params = new URLSearchParams();
    const q = $('q').value.trim();
    const handled = $('handled').value;
    if (q) params.set('q', q);
    if (handled !== '') params.set('handled', handled);
    exportHref();
    const rows = await api('/api/admin/leads?' + params.toString());
    $('rows').innerHTML = rows
      .map(
        (r) => `
      <tr data-id="${r.id}">
        <td>${new Date(r.created_at).toLocaleString()}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${escapeHtml(r.email)}<br>${escapeHtml(r.phone || '')}</td>
        <td>${escapeHtml(r.service || '—')}</td>
        <td>${escapeHtml(r.message)}</td>
        <td>
          <span class="pill${r.handled ? ' done' : ''}">${r.handled ? 'Handled' : 'Open'}</span><br>
          <button type="button" class="btn btn-sm" data-toggle="${r.id}" data-handled="${r.handled ? 0 : 1}" style="margin-top:.4rem">
            Mark ${r.handled ? 'open' : 'handled'}
          </button>
        </td>
      </tr>`
      )
      .join('');
    msg.textContent = rows.length ? `${rows.length} lead(s)` : 'No leads match.';
  } catch (e) {
    msg.className = 'form-msg err';
    msg.textContent = e.message;
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('login-msg');
  msg.className = 'form-msg';
  msg.textContent = 'Signing in…';
  try {
    await api('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        username: $('username').value,
        password: $('password').value,
      }),
    });
    msg.textContent = '';
    showApp(true);
    await loadLeads();
  } catch (err) {
    msg.className = 'form-msg err';
    msg.textContent = err.message;
  }
});

$('logout').addEventListener('click', async () => {
  await api('/api/admin/logout', { method: 'POST', body: '{}' });
  showApp(false);
});

$('refresh').addEventListener('click', loadLeads);
$('q').addEventListener('input', () => {
  clearTimeout(window.__q);
  window.__q = setTimeout(loadLeads, 300);
});
$('handled').addEventListener('change', loadLeads);

$('rows').addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-toggle]');
  if (!btn) return;
  const id = btn.getAttribute('data-toggle');
  const handled = btn.getAttribute('data-handled') === '1';
  try {
    await api(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ handled }),
    });
    await loadLeads();
  } catch (err) {
    $('list-msg').className = 'form-msg err';
    $('list-msg').textContent = err.message;
  }
});

checkSession();
