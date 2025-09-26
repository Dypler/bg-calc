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

  // Закрытие мобильного меню при клике на внешние ссылки
  $$('.nav a[target="_blank"]').forEach((a) => {
    a.addEventListener('click', () => {
      nav?.classList.remove('open');
      burger?.classList.remove('active');
      document.body.classList.remove('menu-open');
      burger?.setAttribute('aria-expanded', 'false');
    });
  });
}


