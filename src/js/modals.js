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
  hystModal.open('#success-modal');
}

// Функция для закрытия модалки успеха
export function closeSuccessModal() {
  hystModal.close('#success-modal');
}

// Функция для показа ошибки в модалке
export function showError(message) {
  const messageEl = document.getElementById('modal-message');
  if (messageEl) {
    messageEl.textContent = message;
  }
  hystModal.open('#error-modal');
}

// Инициализация обработчиков для стандартных модалок
export function initStandardModals() {
  // Эта функция больше не нужна для hystmodal, но оставляем для совместимости
  // hystmodal автоматически обрабатывает все события
}
