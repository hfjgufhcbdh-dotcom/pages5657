// ===== دیده بان قیمت ها و اخبار فناوری =====

function proxyUrl(url) {
  return '/api/proxy?url=' + encodeURIComponent(url);
}

function formatNumber(num) {
  if (num == null) return '—';
  return new Intl.NumberFormat('fa-IR').format(Math.round(num));
}

function formatUSD(num) {
  if (num == null) return '—';

  return '$' + new Intl.NumberFormat('en-US', {
    maximumFractionDigits: num < 1 ? 6 : 2
  }).format(num);
}

function formatChange(change) {
  if (change == null || isNaN(change)) {
    return { text: '—', cls: 'flat', arrow: '' };
  }

  const pct = change.toFixed(2);

  if (change > 0)
    return { text: '+' + pct + '%', cls: 'up', arrow: '▲' };

  if (change < 0)
    return { text: pct + '%', cls: 'down', arrow: '▼' };

  return { text: '0%', cls: 'flat', arrow: '—' };
}

function toFaDigits(str) {
  return String(str).replace(
    /[0-9]/g,
    d => '۰۱۲۳۴۵۶۷۸۹'[d]
  );
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateClock() {
  const now = new Date();

  document.getElementById('liveClock').textContent =
    now.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

  document.getElementById('liveDate').textContent =
    now.toLocaleDateString('fa-IR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
}

setInterval(updateClock, 1000);
updateClock();

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn')
      .forEach(b => b.classList.remove('active'));

    document.querySelectorAll('.tab-panel')
      .forEach(p => p.classList.remove('active'));

    btn.classList.add('active');

    const panel = document.getElementById(btn.dataset.tab);
    if (panel) panel.classList.add('active');
  });
});

function showSkeletons(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'skeleton skeleton-card';
    container.appendChild(div);
  }
}

function getNavasanPrice(data, keys) {
  for (const key of keys) {
    if (data[key] !== undefined &&
        data[key] !== null &&
        data[key] !== '') {

      const value = parseFloat(data[key]);

      if (!isNaN(value) && value > 0)
        return value;
    }
  }

  return null;
        }
