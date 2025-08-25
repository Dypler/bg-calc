/**
 * Анимации перехода между секциями
 * Управляет показом/скрытием hero секции и хедера
 */

class SectionAnimator {
  constructor() {
    this.hero = document.querySelector('.hero');
    this.calc = document.getElementById('calc');
    this.wrap = document.querySelector('.wrap');
    this.heroBtn = document.querySelector('.hero__btn');
    this.header = document.querySelector('.site-header');
    
    console.log('SectionAnimator initialized:', {
      hero: this.hero,
      calc: this.calc,
      wrap: this.wrap,
      heroBtn: this.heroBtn,
      header: this.header
    });
    
    this.init();
  }

  init() {
    // Вешаем обработчик на кнопку hero
    if (this.heroBtn) {
      this.heroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Hero button clicked');
        this.startTransition();
      });
    }
  }



  startTransition() {
    console.log('Starting transition...');
    
    // Начинаем анимацию исчезновения hero
    this.hideHero();
    
    // Через небольшую задержку показываем контент
    setTimeout(() => {
      console.log('Showing content...');
      this.showContent();
    }, 400); // Половина времени анимации hero
  }

  hideHero() {
    if (this.hero) {
      this.hero.classList.add('hero--hidden');
      console.log('Hero hidden, classes:', this.hero.className);
    }
  }



  showContent() {
    this.showHeader();
    this.showMainContent();
  }



  showHeader() {
    if (this.header) {
      this.header.style.opacity = '1';
      this.header.style.visibility = 'visible';
      this.header.classList.add('site-header--visible');
      console.log('Header shown, classes:', this.header.className);
    }
  }



  showMainContent() {
    if (this.wrap) {
      this.wrap.style.opacity = '1';
      this.wrap.style.visibility = 'visible';
      this.wrap.classList.add('wrap--visible');
      console.log('Main content shown, classes:', this.wrap.className);
    }
    
    // Показываем калькулятор
    if (this.calc) {
      this.calc.classList.add('calc--visible');
      console.log('Calculator shown');
    }
  }



  // Метод для сброса анимации (если нужно)
  reset() {
    if (this.hero) {
      this.hero.classList.remove('hero--hidden');
      this.hero.style.opacity = '';
      this.hero.style.visibility = '';
    }
    if (this.header) {
      this.header.classList.remove('site-header--visible');
      this.header.style.opacity = '0';
      this.header.style.visibility = 'hidden';
    }
    if (this.wrap) {
      this.wrap.classList.remove('wrap--visible');
      this.wrap.style.opacity = '0';
      this.wrap.style.visibility = 'hidden';
    }
    if (this.calc) {
      this.calc.classList.remove('calc--visible');
    }
    
    console.log('Animation reset');
  }
}

// Инициализация аниматора при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing SectionAnimator...');
  new SectionAnimator();
});

export default SectionAnimator;
