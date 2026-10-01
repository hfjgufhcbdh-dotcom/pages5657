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
async function loadNavasan() {
  try {
    const response = await fetch('/api/navasan', {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Navasan API error');
    }

    return await response.json();

  } catch (error) {
    console.error('Navasan:', error);
    return null;
  }
}

async function loadCrypto() {
  try {
    const url =
      'https://api.coingecko.com/api/v3/coins/markets' +
      '?vs_currency=usd' +
      '&ids=bitcoin,ethereum,tether' +
      '&order=market_cap_desc' +
      '&per_page=10' +
      '&page=1' +
      '&sparkline=false';

    const response = await fetch(proxyUrl(url), {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('CoinGecko API error');
    }

    return await response.json();

  } catch (error) {
    console.error('CoinGecko:', error);
    return [];
  }
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

async function updatePrices() {
  const data = await loadNavasan();

  if (data) {
    const dollar = getNavasanPrice(data, [
      'usd_sell',
      'usd',
      'dollar',
      'usd_buy'
    ]);

    const euro = getNavasanPrice(data, [
      'eur_sell',
      'eur',
      'euro',
      'eur_buy'
    ]);

    const gold = getNavasanPrice(data, [
      'gold_18',
      'gold18',
      'geram18',
      'gold'
    ]);

    const coin = getNavasanPrice(data, [
      'coin',
      'sekkeh',
      'coin_emami'
    ]);

    setText('dollarPrice', formatNumber(dollar));
    setText('euroPrice', formatNumber(euro));
    setText('gold18Price', formatNumber(gold));
    setText('coinPrice', formatNumber(coin));
  }

  const crypto = await loadCrypto();

  crypto.forEach(item => {
    setText(
      item.id + 'Price',
      formatUSD(item.current_price)
    );

    const change = document.getElementById(
      item.id + 'Change'
    );

    if (change) {
      const result = formatChange(
        item.price_change_percentage_24h
      );

      change.textContent =
        result.arrow + ' ' + result.text;

      change.className = result.cls;
    }
  });
}

updatePrices();

setInterval(updatePrices, 60000);
