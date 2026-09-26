

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
