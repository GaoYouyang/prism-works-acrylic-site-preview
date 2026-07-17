
(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-navigation');
  const supportWidget = document.querySelector('[data-support-widget]');
  const supportToggle = supportWidget?.querySelector('[data-support-toggle]');
  const supportClose = supportWidget?.querySelector('[data-support-close]');
  const supportPanel = supportWidget?.querySelector('[data-support-panel]');
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const menuIsOpen = () => toggle?.getAttribute('aria-expanded') === 'true';
  const supportIsOpen = () => supportWidget?.classList.contains('is-open') === true;
  const setMenu = (open, { restoreFocus = false } = {}) => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open && restoreFocus) toggle.focus();
  };
  const setSupport = (open, { focusPanel = false, restoreFocus = false } = {}) => {
    if (!supportWidget || !supportToggle) return;
    supportWidget.classList.toggle('is-open', open);
    supportToggle.setAttribute('aria-expanded', String(open));
    supportToggle.setAttribute('aria-label', open ? '关闭客服面板' : '打开客服面板');
    supportPanel?.setAttribute('aria-hidden', String(!open));
    if (open && focusPanel) {
      const firstFocusable = supportPanel?.querySelectorAll(focusableSelector)[0];
      (firstFocusable || supportPanel)?.focus();
    } else if (!open && restoreFocus) {
      supportToggle.focus();
    }
  };

  toggle?.addEventListener('click', () => {
    const opening = !menuIsOpen();
    if (opening) setSupport(false);
    setMenu(opening);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  supportToggle?.addEventListener('click', () => {
    const opening = !supportIsOpen();
    if (opening) setMenu(false);
    setSupport(opening, { focusPanel: opening });
  });
  supportClose?.addEventListener('click', () => setSupport(false, { restoreFocus: true }));
  addEventListener('pointerdown', (event) => {
    if (supportWidget && !supportWidget.contains(event.target)) setSupport(false);
  });
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (supportIsOpen()) {
        event.preventDefault();
        setSupport(false, { restoreFocus: true });
      } else if (menuIsOpen()) {
        event.preventDefault();
        setMenu(false, { restoreFocus: true });
      }
      return;
    }
    if (event.key !== 'Tab' || !supportIsOpen() || !supportPanel) return;
    const focusable = [...supportPanel.querySelectorAll(focusableSelector)];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) {
      event.preventDefault();
      supportPanel.focus();
      return;
    }
    const focusIsInside = supportPanel.contains(document.activeElement);
    if (event.shiftKey && (document.activeElement === first || !focusIsInside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !focusIsInside)) {
      event.preventDefault();
      first.focus();
    }
  });
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
    form.querySelector('[data-static-preview-lock]')?.removeAttribute('disabled');
    form.querySelector('button[type="submit"]')?.removeAttribute('disabled');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let result = form.querySelector('.static-form-result');
      if (!result) {
        result = document.createElement('div');
        result.className = 'static-form-result';
        form.append(result);
      }
      result.setAttribute('role', 'status');
      result.setAttribute('aria-live', 'polite');
      result.setAttribute('aria-atomic', 'true');
      result.setAttribute('tabindex', '-1');
      result.textContent = '这是 GitHub 共享预览版，不会实际提交询盘。正式站上线后会接通数据库与后台。';
      result.focus();
    });
  });
})();
