import HystModal from 'hystmodal'
import { addModalsToPage } from './modalContent.js'

// Добавляем модальные окна на страницу
addModalsToPage();

// Инициализируем hystmodal с базовыми настройками
export const hystModal = new HystModal({
  linkAttributeName: 'data-hystmodal'
});

// Функция для показа модалки успеха
export function showSuccess() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.add('show');
  }
}

// Функция для закрытия модалки успеха
export function closeSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// Функция для показа ошибки в модалке
export function showError(message) {
  const modal = document.getElementById('error-modal');
  const messageEl = document.getElementById('modal-message');
  if (modal && messageEl) {
    messageEl.textContent = message;
    modal.classList.add('show');
  }
}

// Инициализация обработчиков для стандартных модалок
export function initStandardModals() {
  // Закрытие модалки по клику на фон
  document.getElementById('error-modal')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('show');
    }
  });

  // Закрытие модалки успеха по клику на фон
  document.getElementById('success-modal')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('show');
    }
  });
}
