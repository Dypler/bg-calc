# Настройка анимаций переходов

## Описание

Реализована система анимаций для плавного перехода между hero-секцией и калькулятором. При загрузке страницы показывается только hero-секция на 100% высоты экрана, остальной контент скрыт.

## Как это работает

1. **При загрузке страницы**: hero-секция занимает 100vh, основной контент скрыт
2. **При клике на кнопку "Рассчитать гарантию"**: 
   - hero-секция плавно исчезает
   - калькулятор плавно появляется
   - происходит плавный скролл к калькулятору

## Настройка анимаций

### Для Hero секции (исчезновение)

Откройте файл `src/scss/_animations.scss` и выберите нужный вариант:

```scss
.hero--hidden {
  // === ВАРИАНТ 1: Fade Out (по умолчанию) ===
  opacity: 0;
  visibility: hidden;
  
  // === ВАРИАНТ 2: Slide Up ===
  // transform: translateY(-100vh);
  // opacity: 0;
  // visibility: hidden;
  
  // === ВАРИАНТ 3: Scale Down ===
  // transform: scale(0.8);
  // opacity: 0;
  // visibility: hidden;
  
  // === ВАРИАНТ 4: Slide Up + Fade ===
  // transform: translateY(-50px);
  // opacity: 0;
  // visibility: hidden;
  
  // === ВАРИАНТ 5: Slide Left ===
  // transform: translateX(-100vw);
  // opacity: 0;
  // visibility: hidden;
  
  // === ВАРИАНТ 6: Slide Right ===
  // transform: translateX(100vw);
  // opacity: 0;
  // visibility: hidden;
  
  // === ВАРИАНТ 7: Zoom Out ===
  // transform: scale(1.5);
  // opacity: 0;
  // visibility: hidden;
  
  // === ВАРИАНТ 8: Rotate + Scale ===
  // transform: rotate(5deg) scale(0.9);
  // opacity: 0;
  // visibility: hidden;
}
```

**Чтобы использовать вариант:**
1. Закомментируйте текущий активный вариант
2. Раскомментируйте нужный вариант
3. Убедитесь, что только один вариант активен

### Для калькулятора (появление)

В том же файле настройте анимацию появления:

```scss
#calc--visible {
  // === ВАРИАНТ A: Slide Up + Fade (по умолчанию) ===
  opacity: 1;
  transform: translateY(0);
  
  // === ВАРИАНТ B: Scale + Fade ===
  // opacity: 1;
  // transform: scale(1);
  
  // === ВАРИАНТ C: Bounce Effect ===
  // opacity: 1;
  // transform: translateY(0);
  // animation: bounceIn 0.6s ease-out;
}
```

### Скорость анимаций

Настройте время анимации в конце файла `_animations.scss`:

```scss
.hero,
#calc {
  // Быстрая анимация
  // transition: all 0.4s ease;
  
  // Средняя анимация (по умолчанию)
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  // Медленная анимация
  // transition: all 1.2s ease-in-out;
}
```

## Структура файлов

- `src/scss/_animations.scss` - основные стили анимаций
- `src/scss/_hero.scss` - базовые стили hero секции
- `src/js/animations.js` - JavaScript логика анимаций
- `src/js/main.js` - подключение анимаций

## Классы CSS

- `.hero--hidden` - скрывает hero секцию
- `.calc--visible` - показывает калькулятор
- `.wrap--visible` - показывает основной контент

## Технические детали

- Используются CSS transitions без сторонних библиотек
- Анимации работают на всех устройствах
- Плавный скролл к калькулятору после анимации
- Легко настраиваемые параметры времени и эффектов

## Примеры использования

### Простой fade out:
```scss
.hero--hidden {
  opacity: 0;
  visibility: hidden;
}
```

### Slide up эффект:
```scss
.hero--hidden {
  transform: translateY(-100vh);
  opacity: 0;
  visibility: hidden;
}
```

### Scale down эффект:
```scss
.hero--hidden {
  transform: scale(0.8);
  opacity: 0;
  visibility: hidden;
}
```

## Советы

1. **Не используйте несколько вариантов одновременно** - это может привести к конфликтам
2. **Тестируйте на разных устройствах** - некоторые эффекты могут работать по-разному
3. **Настройте время анимации** под ваши предпочтения
4. **Используйте cubic-bezier** для более естественных анимаций
