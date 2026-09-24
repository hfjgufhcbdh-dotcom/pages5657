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
