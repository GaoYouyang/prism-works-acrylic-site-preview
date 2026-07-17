
(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-navigation');
  const setMenu = (open) => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle?.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (innerWidth > 900) setMenu(false); });
  addEventListener('scroll', () => header?.classList.toggle('is-scrolled', scrollY > 32), { passive: true });

  const processStage = document.querySelector('.process-artifact-stage');
  const processHeading = processStage?.querySelector('.process-stage-heading strong');
  const processCounter = processStage?.querySelector('.process-stage-heading > span');
  const labels = [
    '需求输入 / ARTWORK BRIEF', '规格方案 / PRINT & MATERIAL',
    '效果确认 / LAYER COMPOSITE', '生产安排 / CUTTING READY',
    '项目检查 / ASSEMBLY REVIEW', '交付确认 / PACKED PRODUCT'
  ];
  if (processStage && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = Number(visible.target.dataset.processStep || 0);
      processStage.dataset.step = String(index + 1);
      if (processHeading) processHeading.textContent = labels[index];
      if (processCounter) processCounter.textContent = '0' + (index + 1) + ' / 06';
    }, { threshold: [.25, .45, .7], rootMargin: '-18% 0px -38%' });
    document.querySelectorAll('[data-process-step]').forEach((step) => observer.observe(step));
  }

  document.querySelectorAll('form[data-static-preview="true"]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let result = form.querySelector('.static-form-result');
      if (!result) {
        result = document.createElement('div');
        result.className = 'static-form-result';
        result.setAttribute('role', 'status');
        form.append(result);
      }
      result.textContent = '这是 GitHub 共享预览版，不会实际提交询盘。正式站上线后会接通数据库与后台。';
      result.focus?.();
    });
  });
})();
