// HTML содержимое для модальных окон

export const policyModalHTML = `
  <div class="hystmodal" id="policy-modal" aria-hidden="true">
    <div class="hystmodal__wrap">
      <div class="hystmodal__window" role="dialog" aria-modal="true">
        <div class="hystmodal__content">
          <div class="modal-header">
            <h2>Политика конфиденциальности</h2>
            <button class="modal-close" data-hystclose aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <h3>1. Общие положения</h3>
            <p>Настоящая Политика конфиденциальности (далее — Политика) определяет порядок обработки и защиты персональных данных пользователей сайта.</p>
            
            <h3>2. Основание и цели обработки</h3>
            <p>Персональные данные обрабатываются на основании согласия пользователя с целью оказания услуг, связи по заявке и улучшения сервиса.</p>
            
            <h3>3. Перечень обрабатываемых данных</h3>
            <p>Мы можем обрабатывать следующие данные: ФИО, телефон, адрес электронной почты, ИНН и иные сведения, предоставленные пользователем.</p>
            
            <h3>4. Хранение и защита</h3>
            <p>Данные хранятся в соответствии с применимым законодательством и защищаются организационными и техническими мерами.</p>
            
            <h3>5. Права пользователя</h3>
            <p>Пользователь вправе запросить уточнение своих данных, их блокирование или удаление, отозвать согласие на обработку.</p>
            
            <h3>6. Контакты</h3>
            <p>По вопросам обработки персональных данных вы можете связаться с нами по контактам, указанным на сайте.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

export const consentModalHTML = `
  <div class="hystmodal" id="consent-modal" aria-hidden="true">
    <div class="hystmodal__wrap">
      <div class="hystmodal__window" role="dialog" aria-modal="true">
        <div class="hystmodal__content">
          <div class="modal-header">
            <h2>Согласие на обработку персональных данных</h2>
            <button class="modal-close" data-hystclose aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <h3>1. Предоставление согласия</h3>
            <p>Отправляя заявку на сайте, пользователь выражает согласие на обработку персональных данных в соответствии с настоящими условиями.</p>
            
            <h3>2. Цели обработки</h3>
            <p>Данные обрабатываются для связи с пользователем, подготовки коммерческого предложения и оказания услуг.</p>
            
            <h3>3. Срок и отзыв согласия</h3>
            <p>Согласие действует до достижения целей обработки либо до момента его отзыва пользователем путем направления запроса.</p>
            
            <h3>4. Третьи лица</h3>
            <p>Данные могут быть переданы партнерам-операторам персональных данных с соблюдением требований безопасности.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// Функция для добавления модальных окон на страницу
export function addModalsToPage() {
  // Добавляем модальные окна в body
  document.body.insertAdjacentHTML('beforeend', policyModalHTML);
  document.body.insertAdjacentHTML('beforeend', consentModalHTML);
}
