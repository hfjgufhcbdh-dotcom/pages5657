===========

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
