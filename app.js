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

  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals || 0,
    maximumFractionDigits: decimals || 2
  });
      }
// تبدیل قیمت دلار به نمایش مناسب
function formatDollar(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }

  if (value >= 1000) {
    return '$' + formatNumber(value, 0);
  }

  if (value >= 1) {
    return '$' + formatNumber(value, 2);
  }

  if (value >= 0.01) {
    return '$' + formatNumber(value, 4);
  }

  return '$' + formatNumber(value, 8);
}

// وضعیت تغییر قیمت
function getChangeInfo(change) {

  if (change === null || change === undefined || isNaN(change)) {
    return {
      text: '—',
      cls: 'flat',
      arrow: '—'
    };
  }

  var value = Number(change);

  if (value > 0) {
    return {
      text: '+' + value.toFixed(2) + '%',
      cls: 'up',
      arrow: '▲'
    };
  }

  if (value < 0) {
    return {
      text: value.toFixed(2) + '%',
      cls: 'down',
      arrow: '▼'
    };
  }

  return {
    text: '۰.۰۰%',
    cls: 'flat',
    arrow: '—'
  };
}
