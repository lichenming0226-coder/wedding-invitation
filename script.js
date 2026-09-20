(() => {
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const weddingDate = new Date('2026-11-20T14:18:00+08:00');
  const now = new Date();
  const days = Math.max(0, Math.ceil((weddingDate - now) / 86400000));
  document.querySelector('#days').textContent = String(days);

  const shareButton = document.querySelector('#shareButton');
  const toast = document.querySelector('#toast');
  let toastTimer;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  shareButton.addEventListener('click', async () => {
    const shareData = {
      title: '李晨鸣 & 高雅婷的婚礼邀请',
      text: '2026年11月20日，诚邀你见证我们的幸福时刻。',
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (error) {
        if (error.name !== 'AbortError') showToast('可复制链接后分享给好友');
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('邀请函链接已复制');
    } catch {
      showToast('请复制浏览器地址进行分享');
    }
  });
})();
