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

// Matrix-style анимация для hero секции
class MatrixAnimation {
  constructor() {
    this.isActive = false;
    this.rains = [];
    this.container = null;
  }

  init() {
    // Создаем контейнер для анимации
    this.container = document.createElement('div');
    this.container.className = 'matrix-animation';
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      pointer-events: none;
      overflow: hidden;
    `;

    // Добавляем в hero секцию
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.appendChild(this.container);
      this.start();
    }
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;

    // Создаем дождь символов - столбцы идут сверху вниз
    const columnsCount = 30; // Количество столбцов
    const columnWidth = 100 / columnsCount; // Ширина каждого столбца в %
    
    for (let i = 0; i < columnsCount; ++i) {
      const rain = new MatrixRain({ 
        target: this.container, 
        row: 40,
        columnIndex: i,
        columnWidth: columnWidth
      });
      this.rains.push(rain);
    }
  }

  stop() {
    if (!this.isActive) return;
    this.isActive = false;

    // Очищаем все дожди
    this.rains.forEach(rain => rain.destroy());
    this.rains = [];

    // Удаляем контейнер
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

// Класс для отдельного столбца дождя
class MatrixRain {
  constructor({ target, row, columnIndex, columnWidth }) {
    this.element = document.createElement('p');
    this.target = target;
    this.row = row;
    this.columnIndex = columnIndex;
    this.columnWidth = columnWidth;
    this.chars = [];
    this.trail = null;
    this.animationId = null;
    
    this.build();
    this.drop();
  }

  build() {
    const root = document.createDocumentFragment();
    
    // Позиционируем столбец по горизонтали
    this.element.style.cssText = `
      position: absolute;
      left: ${this.columnIndex * this.columnWidth}%;
      top: 0;
      width: ${this.columnWidth}%;
      height: 100%;
      margin: 0;
      padding: 0;
    `;
    
    for (let i = 0; i < this.row; ++i) {
      const char = new MatrixChar();
      // Позиционируем символы вертикально в столбце
      char.element.style.cssText = `
        position: absolute;
        top: ${(i * 100 / this.row)}%;
        left: 50%;
        transform: translateX(-50%);
        margin: 0;
        padding: 0;
      `;
      root.appendChild(char.element);
      this.chars.push(char);
      
      // Случайная мутация символов
      if (Math.random() < 0.3) {
        this.loop(() => char.mutate(), this.random(2000, 8000));
      }
    }
    
    this.trail = new MatrixTrail(this.chars, { 
      size: this.random(8, 25), 
      offset: this.random(0, 100) 
    });
    
    this.element.appendChild(root);
    
    if (this.target) {
      this.target.appendChild(this.element);
    }
  }

  drop() {
    const trail = this.trail;
    const len = trail.body.length;
    const delay = this.random(50, 150);
    
    this.loop(() => {
      trail.move();
      trail.traverse((char, i, last) => {
        if (char && char.element) {
          const opacity = 0.1 + (0.8 / len * (i + 1));
          char.element.style.color = `rgba(155, 255, 155, ${opacity})`;
          
          if (last) {
            char.mutate();
            char.element.style.color = `rgba(155, 255, 155, 0.9)`;
            char.element.style.textShadow = `
              0 0 0.5em rgba(255, 255, 255, 0.8),
              0 0 0.5em rgba(155, 255, 155, 0.8)
            `;
          }
        }
      });
    }, delay);
  }

  loop(fn, delay) {
    let stamp = Date.now();
    const _loop = () => {
      if (Date.now() - stamp >= delay) {
        fn();
        stamp = Date.now();
      }
      this.animationId = requestAnimationFrame(_loop);
    };
    this.animationId = requestAnimationFrame(_loop);
  }

  random(from, to) {
    return ~~(Math.random() * (to - from + 1) + from);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// Класс для отдельного символа
class MatrixChar {
  constructor() {
    this.element = document.createElement('span');
    this.mutate();
  }

  mutate() {
    this.element.textContent = this.getChar();
  }

  getChar() {
    const chars = ["₽", "$", "€", "¥", "£", "₿"];
    return chars[Math.floor(Math.random() * chars.length)];
  }
}

// Класс для трейла символов
class MatrixTrail {
  constructor(list = [], options) {
    this.list = list;
    this.options = Object.assign(
      { size: 10, offset: 0 }, options
    );
    this.body = [];
    this.move();
  }

  traverse(fn) {
    this.body.forEach((n, i) => {
      const last = (i == this.body.length - 1);
      if (n) fn(n, i, last);
    });
  }

  move() {
    this.body = [];
    const { offset, size } = this.options;
    
    for (let i = 0; i < size; ++i) {
      const item = this.list[offset + i - size + 1];
      this.body.push(item);
    }
    
    this.options.offset = 
      (offset + 1) % (this.list.length + size - 1);
  }
}

// Создаем и инициализируем анимацию
const matrixAnimation = new MatrixAnimation();

// Делаем доступной глобально
window.matrixAnimation = matrixAnimation;

// Инициализация аниматора при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing SectionAnimator...');
  new SectionAnimator();
});

export default SectionAnimator;
