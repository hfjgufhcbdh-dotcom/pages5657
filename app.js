// ==========================================
// دیده بان قیمت ها و اخبار فناوری
// فایل اصلی برنامه: app.js
// ==========================================

// آدرس API ارزهای دیجیتال CoinGecko
var COINGECKO_API =
  'https://api.coingecko.com/api/v3/coins/markets' +
  '?vs_currency=usd' +
  '&order=market_cap_desc' +
  '&per_page=12' +
  '&page=1' +
  '&sparkline=false' +
  '&price_change_percentage=24h';

// تبدیل عدد به نمایش فارسی
function toFaDigits(str) {
  return String(str).replace(
    /[0-9]/g,
    function(d) {
      return '۰۱۲۳۴۵۶۷۸۹'[d];
    }
  );
}

// قالب‌بندی عدد
function formatNumber(value, decimals) {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }

    });// ==========================================
// ساعت و تاریخ زنده
// ==========================================

function updateClock() {
  var now = new Date();

  var hours = String(now.getHours()).padStart(2, '0');
  var minutes = String(now.getMinutes()).padStart(2, '0');
  var seconds = String(now.getSeconds()).padStart(2, '0');

  var clockElement = document.getElementById('liveClock');

  if (clockElement) {
    clockElement.textContent = toFaDigits(
      hours + ':' + minutes + ':' + seconds
    );
  }

  var dateElement = document.getElementById('liveDate');

  if (dateElement) {
    var dateText = now.toLocaleDateString('fa-IR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    dateElement.textContent = dateText;
  }
}

updateClock();

setInterval(updateClock, 1000);
// ==========================================
// جابه‌جایی بین بخش‌های سایت
// ==========================================

function setupTabs() {
  var tabButtons = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var targetTab = button.getAttribute('data-tab');

      tabButtons.forEach(function(item) {
        item.classList.remove('active');
      });

      tabPanels.forEach(function(panel) {
        panel.classList.remove('active');
      });

      button.classList.add('active');

      var targetPanel = document.getElementById(targetTab);

      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });// ==========================================
// اطلاعات نمونه طلا و سکه
// ==========================================

var goldData = [
  {
    name: 'طلای ۱۸ عیار',
    price: 7200000,
    change: 1.25
  },
  {
    name: 'طلای ۲۴ عیار',
    price: 9600000,
    change: 0.85
  },
  {
    name: 'سکه امامی',
    price: 85000000,
    change: -0.45
  },
  {
    name: 'نیم سکه',
    price: 48000000,
    change: 0.32
  },
  {
    name: 'ربع سکه',
    price: 27500000,
    change: -0.18
  }
];
}
// ==========================================
// اطلاعات نمونه ارز آزاد
// ==========================================

var currencyData = [
  {
    name: 'دلار آمریکا',
    symbol: 'USD',
    price: 105000,
    change: 0.45
  },
  {
    name: 'یورو',
    symbol: 'EUR',
    price: 123000,
    change: -0.22
  },
  {
    name: 'پوند انگلیس',
    symbol: 'GBP',
    price: 142000,
    change: 0.31
  },
  {
    name: 'درهم امارات',
    symbol: 'AED',
    price: 29000,
    change: 0.10
  },
  {
    name: 'لیر ترکیه',
    symbol: 'TRY',
    price: 2950,
    change: -0.15
  }
];// ==========================================
// نمایش طلا و سکه
// ==========================================

function renderGold() {
  var container = document.getElementById('goldCards');

  if (!container) {
    return;
  }

  container.innerHTML = '';

  goldData.forEach(function(item) {
    var change = getChangeInfo(item.change);

    var card = document.createElement('div');

    card.className = 'price-card';

    card.innerHTML =
      '<div class="card-title">' +
        '<span>' + item.name + '</span>' +
      '</div>' +

      '<div class="card-price">' +
        toFaDigits(formatNumber(item.price, 0)) +
        ' تومان' +
      '</div>' +

      '<div class="card-change ' + change.cls + '">' +
        change.arrow + ' ' +
        toFaDigits(change.text) +
      '</div>';

    container.appendChild(card);
  });

  var updateElement = document.getElementById('goldUpdate');

  if (updateElement) {
    updateElement.textContent =
      'آخرین بروزرسانی: ' +
      toFaDigits(
        new Date().toLocaleTimeString('fa-IR')
      );
  }
                   }
// ==========================================
// نمایش ارز آزاد
// ==========================================

function renderCurrency() {
  var container = document.getElementById('currencyCards');

  if (!container) {
    return;
  }

  container.innerHTML = '';

  currencyData.forEach(function(item) {
    var change = getChangeInfo(item.change);

    var card = document.createElement('div');

    card.className = 'price-card';

    card.innerHTML =
      '<div class="card-title">' +
        '<span>' + item.name + '</span>' +
        '<small>' + item.symbol + '</small>' +
      '</div>' +

      '<div class="card-price">' +
        toFaDigits(formatNumber(item.price, 0)) +
        ' تومان' +
      '</div>' +

      '<div class="card-change ' + change.cls + '">' +
        change.arrow + ' ' +
        toFaDigits(change.text) +
      '</div>';

    container.appendChild(card);
  });

  var updateElement = document.getElementById('currencyUpdate');

  if (updateElement) {
    updateElement.textContent =
      'آخرین بروزرسانی: ' +
      toFaDigits(
        new Date().toLocaleTimeString('fa-IR')
      );
  }
    }
// ==========================================
// دریافت قیمت ارزهای دیجیتال از CoinGecko
// ==========================================

async function fetchCrypto() {
  var container = document.getElementById('cryptoCards');

  if (!container) {
    return;
  }

  container.innerHTML =
    '<div class="loading-box">در حال دریافت قیمت‌ها…</div>';

  try {
    var response = await fetch(COINGECKO_API);

    if (!response.ok) {
      throw new Error(
        'خطا در دریافت اطلاعات: ' + response.status
      );
    }

    var data = await response.json();

    renderCrypto(data);

  } catch (error) {
    console.error('Crypto API Error:', error);

    container.innerHTML =
      '<div class="error-box">' +
        'دریافت قیمت ارزهای دیجیتال با خطا مواجه شد.' +
        '<br>' +
        'لطفاً چند لحظه بعد دوباره تلاش کنید.' +
      '</div>';
  }
      }
// ==========================================
// نمایش ارزهای دیجیتال
// ==========================================

function renderCrypto(data) {
  var container = document.getElementById('cryptoCards');

  if (!container) {
    return;
  }

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML =
      '<div class="error-box">' +
        'اطلاعاتی برای نمایش وجود ندارد.' +
      '</div>';

    return;
  }

  container.innerHTML = '';

  data.forEach(function(coin) {
    var change = getChangeInfo(
      coin.price_change_percentage_24h
    );

    var card = document.createElement('div');

    card.className = 'crypto-card';

    var image = '';

    if (coin.image) {
      image =
        '<img src="' +
        coin.image +
        '" alt="' +
        coin.name +
        '" class="crypto-image">';
    }

    card.innerHTML =
      '<div class="crypto-header">' +
        image +
        '<div>' +
          '<strong>' + coin.name + '</strong>' +
          '<span>' +
            String(coin.symbol || '').toUpperCase() +
          '</span>' +
        '</div>' +
      '</div>' +

      '<div class="crypto-price">' +
        formatDollar(coin.current_price) +
      '</div>' +

      '<div class="card-change ' + change.cls + '">' +
        change.arrow + ' ' +
        toFaDigits(change.text) +
      '</div>' +

      '<div class="crypto-market">' +
        'رتبه بازار: #' +
        toFaDigits(coin.market_cap_rank || '—') +
      '</div>';

    container.appendChild(card);
  });

  var updateElement = document.getElementById('cryptoUpdate');

  if (updateElement) {
    updateElement.textContent =
      'آخرین بروزرسانی: ' +
      toFaDigits(
        new Date().toLocaleTimeString('fa-IR')
      );
  }
}
// ==========================================
// آدرس API اخبار فناوری
// Hacker News
// ==========================================

var HACKER_NEWS_API =
  'https://hacker-news.firebaseio.com/v0/topstories.json';

var HACKER_NEWS_ITEM =
  'https://hacker-news.firebaseio.com/v0/item/';

var NEWS_LIMIT = 10;
// ==========================================
// دریافت اخبار فناوری
// ==========================================

async function fetchNews() {
  var container = document.getElementById('newsCards');

  if (!container) {
    return;
  }

  container.innerHTML =
    '<div class="loading-box">در حال دریافت اخبار فناوری…</div>';

  try {
    var response = await fetch(HACKER_NEWS_API);

    if (!response.ok) {
      throw new Error(
        'خطا در دریافت فهرست اخبار'
      );
    }

    var ids = await response.json();

    var selectedIds = ids.slice(0, NEWS_LIMIT);

    var requests = selectedIds.map(function(id) {
      return fetch(
        HACKER_NEWS_ITEM + id + '.json'
      ).then(function(res) {
        if (!res.ok) {
          return null;
        }

        return res.json();
      });
    });

    var results = await Promise.all(requests);

    var news = results.filter(function(item) {
      return item &&
             item.type === 'story' &&
             item.title;
    });

    renderNews(news);

  } catch (error) {
    console.error('News API Error:', error);

    container.innerHTML =
      '<div class="error-box">' +
        'دریافت اخبار فناوری با خطا مواجه شد.' +
        '<br>' +
        'لطفاً بعداً دوباره تلاش کنید.' +
      '</div>';
  }
}
// ==========================================
// نمایش اخبار فناوری
// ==========================================

function renderNews(news) {
  var container = document.getElementById('newsCards');

  if (!container) {
    return;
  }

  if (!Array.isArray(news) || news.length === 0) {
    container.innerHTML =
      '<div class="error-box">' +
        'خبری برای نمایش پیدا نشد.' +
      '</div>';

    return;
  }

  container.innerHTML = '';

  news.forEach(function(item) {
    var card = document.createElement('article');

    card.className = 'news-card';

    var title = item.title || 'بدون عنوان';

    var url = item.url ||
      'https://news.ycombinator.com/item?id=' +
      item.id;

    var dateText = '';

    if (item.time) {
      dateText = new Date(
        item.time * 1000
      ).toLocaleString('fa-IR');
    }

    card.innerHTML =
      '<h3>' +
        title +
      '</h3>' +

      '<p class="news-meta">' +
        '🕒 ' +
        toFaDigits(dateText) +
      '</p>' +

      '<a href="' +
        url +
        '" target="_blank" rel="noopener noreferrer">' +
        'مشاهده خبر' +
      '</a>';

    container.appendChild(card);
  });

  var updateElement = document.getElementById('newsUpdate');

  if (updateElement) {
    updateElement.textContent =
      'آخرین بروزرسانی: ' +
      toFaDigits(
        new Date().toLocaleTimeString('fa-IR')
      );
  }
}
// ==========================================
// راه‌اندازی اولیه سایت
// ==========================================

function initializeSite() {
  setupTabs();

  renderGold();

  renderCurrency();

  fetchCrypto();

  fetchNews();
}
// ==========================================
// بروزرسانی خودکار ارزهای دیجیتال
// هر ۶۰ ثانیه
// ==========================================

setInterval(function() {
  fetchCrypto();
}, 60000);
// ==========================================
// بروزرسانی خودکار اخبار
// هر ۵ دقیقه
// ==========================================

setInterval(function() {
  fetchNews();
}, 300000);
// ==========================================
// مدیریت خطای تصاویر ارز دیجیتال
// ==========================================

document.addEventListener(
  'error',
  function(event) {
    var target = event.target;

    if (
      target &&
      target.tagName === 'IMG' &&
      target.classList.contains('crypto-image')
    ) {
      target.style.display = 'none';
    }
  },
  true
);
// ==========================================
// مدیریت خطاهای عمومی جاوااسکریپت
// ==========================================

window.addEventListener(
  'error',
  function(event) {
    console.error(
      'خطای عمومی سایت:',
      event.error || event.message
    );
  }
);

window.addEventListener(
  'unhandledrejection',
  function(event) {
    console.error(
      'خطای پردازش:',
      event.reason
    );
  }
);
// ==========================================
// تشخیص وضعیت اتصال اینترنت
// ==========================================

function updateConnectionStatus() {
  if (navigator.onLine) {
    document.body.classList.remove('offline');
  } else {
    document.body.classList.add('offline');
    console.warn('اتصال اینترنت قطع است.');
  }
}

window.addEventListener(
  'online',
  updateConnectionStatus
);

window.addEventListener(
  'offline',
  updateConnectionStatus
);

updateConnectionStatus();
// ==========================================
// عنوان صفحه
// ==========================================

document.title =
  'دیده بان قیمت ها و اخبار فناوری';
// ==========================================
// اجرای سایت پس از آماده شدن صفحه
// ==========================================

document.addEventListener(
  'DOMContentLoaded',
  function() {
    initializeSite();

    console.log(
      'دیده بان قیمت ها و اخبار فناوری آماده شد.'
    );
  }
);
