// ===== دیده بان قیمت ها و اخبار فناوری =====

function proxyUrl(url) {
  return '/api/proxy?url=' + encodeURIComponent(url);
}

function formatNumber(num) {
  if (num == null || isNaN(num)) return '—';

  return new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: 0
  }).format(Math.round(Number(num)));
}

function formatUSD(num) {
  if (num == null || isNaN(num)) return '—';

  return '$' + new Intl.NumberFormat('en-US', {
    maximumFractionDigits: Number(num) < 1 ? 6 : 2
  }).format(Number(num));
}

function formatChange(change) {
  if (change == null || isNaN(change)) {
    return {
      text: '—',
      cls: 'change flat',
      arrow: ''
    };
  }

  const value = Number(change);
  const pct = value.toFixed(2);

  if (value > 0) {
    return {
      text: '+' + pct + '%',
      cls: 'change up',
      arrow: '▲'
    };
  }

  if (value < 0) {
    return {
      text: pct + '%',
      cls: 'change down',
      arrow: '▼'
    };
  }

  return {
    text: '0%',
    cls: 'change flat',
    arrow: '—'
  };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}

function updateClock() {
  const now = new Date();

  const clock = document.getElementById('liveClock');
  const date = document.getElementById('liveDate');

  if (clock) {
    clock.textContent = now.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  if (date) {
    date.textContent = now.toLocaleDateString('fa-IR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

setInterval(updateClock, 1000);
updateClock();

document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn')
      .forEach(btn => btn.classList.remove('active'));

    document.querySelectorAll('.tab-panel')
      .forEach(panel => panel.classList.remove('active'));

    button.classList.add('active');

    const panel = document.getElementById(button.dataset.tab);

    if (panel) {
      panel.classList.add('active');
    }
  });
});

function showLoading(containerId, text = 'در حال بارگذاری…') {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = `
    <div class="loading">
      ${escapeHtml(text)}
    </div>
  `;
}

function showError(containerId, text = 'دریافت اطلاعات ناموفق بود.') {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = `
    <div class="empty-message">
      ${escapeHtml(text)}
    </div>
  `;
}

function getNavasanPrice(data, keys) {
  if (!data || typeof data !== 'object') {
    return null;
  }

  for (const key of keys) {
    if (
      data[key] !== undefined &&
      data[key] !== null &&
      data[key] !== ''
    ) {
      const value = parseFloat(
        String(data[key]).replace(/,/g, '')
      );

      if (!isNaN(value) && value > 0) {
        return value;
      }
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

    const data = await response.json();

    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error('CoinGecko:', error);
    return [];
  }
}

async function loadTechNews() {
  try {
    const topStoriesUrl =
      'https://hacker-news.firebaseio.com/v0/topstories.json';

    const response = await fetch(proxyUrl(topStoriesUrl), {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Hacker News API error');
    }

    const ids = await response.json();

    if (!Array.isArray(ids)) {
      return [];
    }

    const selectedIds = ids.slice(0, 6);

    const stories = await Promise.all(
      selectedIds.map(async id => {
        try {
          const storyResponse = await fetch(
            proxyUrl(
              `https://hacker-news.firebaseio.com/v0/item/${id}.json`
            ),
            {
              cache: 'no-store'
            }
          );

          if (!storyResponse.ok) {
            return null;
          }

          return await storyResponse.json();

        } catch (error) {
          console.error('News item:', error);
          return null;
        }
      })
    );

    return stories.filter(
      story => story && story.title
    );

  } catch (error) {
    console.error('Hacker News:', error);
    return [];
  }
}

function setUpdateTime(id) {
  const element = document.getElementById(id);

  if (!element) return;

  element.textContent =
    'آخرین بروزرسانی: ' +
    new Date().toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
}

function renderPriceCard(
  name,
  symbol,
  value,
  unit = 'تومان'
) {
  return `
    <div class="price-card">
      <div class="price-card-name">
        ${escapeHtml(name)}
      </div>

      <div class="price-card-symbol">
        ${escapeHtml(symbol)}
      </div>

      <div class="price-value">
        ${formatNumber(value)}
      </div>

      <div class="price-unit">
        ${escapeHtml(unit)}
      </div>
    </div>
  `;
}

function renderGoldCards(data) {
  const container = document.getElementById('goldCards');

  if (!container) return;

  const gold18 = getNavasanPrice(data, [
    'gold_18',
    'gold18',
    'geram18',
    'gold18k',
    'gold'
  ]);

  const coin = getNavasanPrice(data, [
    'coin_emami',
    'coin',
    'sekkeh',
    'emami',
    'sekee'
  ]);

  if (gold18 == null && coin == null) {
    showError(
      'goldCards',
      'قیمت طلا و سکه در دسترس نیست.'
    );
    return;
  }

  let html = '';

  if (gold18 != null) {
    html += renderPriceCard(
      'طلای ۱۸ عیار',
      'هر گرم',
      gold18
    );
  }

  if (coin != null) {
    html += renderPriceCard(
      'سکه امامی',
      'سکه تمام',
      coin
    );
  }

  container.innerHTML = html;
}

function renderCurrencyCards(data) {
  const container = document.getElementById('currencyCards');

  if (!container) return;

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

  if (dollar == null && euro == null) {
    showError(
      'currencyCards',
      'قیمت ارز در دسترس نیست.'
    );
    return;
  }

  let html = '';

  if (dollar != null) {
    html += renderPriceCard(
      'دلار آمریکا',
      'USD',
      dollar
    );
  }

  if (euro != null) {
    html += renderPriceCard(
      'یورو',
      'EUR',
      euro
    );
  }

  container.innerHTML = html;
}

function renderCryptoCards(coins) {
  const container = document.getElementById('cryptoCards');

  if (!container) return;

  if (!coins.length) {
    showError(
      'cryptoCards',
      'قیمت ارزهای دیجیتال در دسترس نیست.'
    );
    return;
  }

  container.innerHTML = coins.map((coin, index) => {
    const change = formatChange(
      coin.price_change_percentage_24h
    );

    const image = coin.image
      ? `<img
          class="crypto-image"
          src="${escapeHtml(coin.image)}"
          alt="${escapeHtml(coin.name)}"
          loading="lazy"
        >`
      : '';

    return `
      <div class="crypto-card">

        ${image}

        <div class="crypto-info">

          <div class="crypto-rank">
            رتبه ${index + 1}
          </div>

          <div class="crypto-name">
            ${escapeHtml(coin.name)}
          </div>

          <div class="crypto-symbol">
            ${escapeHtml(
              String(coin.symbol || '').toUpperCase()
            )}
          </div>

          <div class="crypto-price">
            ${formatUSD(coin.current_price)}
          </div>

          <div class="${change.cls}">
            ${change.arrow}
            ${escapeHtml(change.text)}
          </div>

        </div>

      </div>
    `;
  }).join('');
}

function formatNewsDate(timestamp) {
  if (!timestamp) return '';

  try {
    return new Date(timestamp * 1000)
      .toLocaleString('fa-IR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

  } catch {
    return '';
  }
}

function renderNews(stories) {
  const container = document.getElementById('newsCards');

  if (!container) return;

  if (!stories.length) {
    showError(
      'newsCards',
      'در حال حاضر خبری دریافت نشد.'
    );
    return;
  }

  container.innerHTML = stories.map(story => {
    const title = escapeHtml(story.title);
    const date = formatNewsDate(story.time);

    let link = story.url;

    if (!link) {
      link =
        `https://news.ycombinator.com/item?id=${story.id}`;
    }

    return `
      <article class="news-card">

        <div class="news-title">
          <a
            href="${escapeHtml(link)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${title}
          </a>
        </div>

        <div class="news-meta">
          ${date ? escapeHtml(date) : ''}
          ${
            story.score != null
              ? ` • امتیاز: ${escapeHtml(story.score)}`
              : ''
          }
        </div>

      </article>
    `;
  }).join('');
}

async function updatePrices() {
  showLoading('goldCards');
  showLoading('currencyCards');
  showLoading('cryptoCards');
  showLoading('newsCards');

  const [navasan, crypto, news] =
    await Promise.all([
      loadNavasan(),
      loadCrypto(),
      loadTechNews()
    ]);

  if (navasan) {
    renderGoldCards(navasan);
    renderCurrencyCards(navasan);
  } else {
    showError(
      'goldCards',
      'اتصال به سرویس قیمت طلا برقرار نشد.'
    );

    showError(
      'currencyCards',
      'اتصال به سرویس قیمت ارز برقرار نشد.'
    );
  }

  renderCryptoCards(crypto);
  renderNews(news);

  setUpdateTime('goldUpdate');
  setUpdateTime('currencyUpdate');
  setUpdateTime('cryptoUpdate');
  setUpdateTime('newsUpdate');
}

updatePrices();

setInterval(updatePrices, 60000);
