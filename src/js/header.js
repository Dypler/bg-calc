export function initHeader(){
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  const burger = $('burger');
  const nav = $('site-nav');

  burger?.addEventListener('click', () => {
    const opened = nav?.classList.toggle('open');
    burger?.classList.toggle('active', Boolean(opened));
    document.body.classList.toggle('menu-open', Boolean(opened));
    burger?.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });

  // Навигация по типам гарантий
  $$('.nav a[data-gtype]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const type = a.getAttribute('data-gtype');
      const gtypeEl = document.getElementById('gtype');
      if (type && gtypeEl) {
        gtypeEl.value = type;
        gtypeEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      nav?.classList.remove('open');
      burger?.classList.remove('active');
      document.body.classList.remove('menu-open');
      burger?.setAttribute('aria-expanded', 'false');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}


