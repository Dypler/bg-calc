import '../scss/main.scss'
import { initMasks, recalcAndRender, toggleGov, validate, lookupInn, debounce } from './ui.js'
import { getVariant, lockTypeIfNeeded } from './variants.js'
import { initHeader } from './header.js'
import { sendLead } from './api.js'

const $ = (id) => document.getElementById(id);

// элементы
const els = {
  mode: $('mode'),
  extrasWrap: $('extras'),
  closed: $('closed'),
  single: $('single'),
  gtype: $('gtype'),
  start: $('start'),
  end: $('end'),
  months: $('months'),
  days: $('days'),
  sum: $('sum'),
  fee: $('fee'),
  minFee: $('minFee'),
  inn: $('inn'),
  company: $('company'),
  phone: $('phone'),
  email: $('email'),
  comment: $('comment'),
  consent: $('consent'),
  submit: $('submit'),
  reset: $('reset'),
  err: {
    inn: $('err-inn'),
    sum: $('err-sum'),
    phone: $('err-phone'),
    email: $('err-email'),
  },
  msg: $('msg')
};

// Header
initHeader();

// маски
initMasks({ phoneEl: els.phone, innEl: els.inn, sumEl: els.sum });

// дефолтные даты
function toLocalISO(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function endOfNextMonth(from){
  const y = from.getFullYear();
  const m = from.getMonth();
  return new Date(y, m + 2, 0); // последний день следующего месяца
}
const today = new Date();
els.start.value = toLocalISO(today);
els.end.value = toLocalISO(endOfNextMonth(today));

// вариант страницы
const VARIANT = getVariant();
lockTypeIfNeeded(VARIANT, els.gtype);

// показ / скрытие доп. условий
toggleGov({ modeEl: els.mode, extrasWrap: els.extrasWrap });
els.mode.addEventListener('change', () => toggleGov({ modeEl: els.mode, extrasWrap: els.extrasWrap }));

// пересчёт
function recalc(){
  recalcAndRender({
    startEl: els.start,
    endEl: els.end,
    sumEl: els.sum,
    gtypeEl: els.gtype,
    extras: { closed: els.closed?.checked, single: els.single?.checked },
    out: { months: els.months, days: els.days, fee: els.fee, minFee: els.minFee }
  });
}
['change','input'].forEach(ev=>{
  ['start','end','sum','gtype','mode','closed','single'].forEach(id=>{
    const el = $(id);
    if (el) el.addEventListener(ev, recalc);
  })
});
recalc();

// поиск по ИНН — при blur и по вводу (дебаунс)
const doLookup = ()=>{ if (els.inn.value.trim()) lookupInn({ innEl: els.inn, companyEl: els.company, errEl: els.err.inn }) };
els.inn?.addEventListener('blur', doLookup);
els.inn?.addEventListener('input', debounce(()=>{
  const digits = (els.inn.value||'').replace(/\D+/g,'');
  if (digits.length===10 || digits.length===12) doLookup();
}, 350));

// отправка
els.submit?.addEventListener('click', async ()=>{
  if (!validate({ innEl: els.inn, sumEl: els.sum, phoneEl: els.phone, emailEl: els.email, consentEl: els.consent, errs: els.err })) {
    showError('Проверьте корректность полей и согласие на обработку персональных данных и политики конфиденциальности');
    return;
  }
  els.msg.textContent = 'Отправка…';
  els.submit.disabled = true;

  const payload = {
    lead_source: VARIANT==='all' ? 'calc_universal' : `calc_${VARIANT}`,
    inn: (els.inn.value||'').replace(/\D+/g,''),
    company_name: els.company.value.trim(),
    mode: els.mode.value,
    extra: {
      closed_procedure: Boolean(els.closed?.checked),
      single_supplier: Boolean(els.single?.checked)
    },
    guarantee_type: els.gtype.value,
    date_start: els.start.value,
    date_end: els.end.value,
    months: Number(els.months.textContent),
    days: Number(els.days.textContent),
    sum_bg: Number(String(els.sum.value||'0').replace(/\s/g,'')),
    // скрытые параметры расчёта — не показываем пользователю
    calc: {
      min_fee: Number(els.minFee.textContent.replace(/\s/g,'')),
      fee: Number(els.fee.textContent.replace(/\s/g,''))
    },
    contact: {
      phone: els.phone.value.trim(),
      email: els.email.value.trim(),
      comment: els.comment.value.trim()
    },
    consent: els.consent.checked
  };

  try{
    const result = await sendLead(payload);
    if (result.success) {
      showSuccess();
      resetForm(); // Сброс формы после успешной отправки
    } else {
      throw new Error(result.error);
    }
  }catch(e){
    console.error(e);
    showError('Ошибка отправки. Попробуйте ещё раз.');
  }finally{
    els.submit.disabled = false;
  }
});

// Показать модалку успеха
function showSuccess() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.add('show');
  }
}

// Закрыть модалку успеха
function closeSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// Показать ошибку в модалке
function showError(message) {
  const modal = document.getElementById('error-modal');
  const messageEl = document.getElementById('modal-message');
  if (modal && messageEl) {
    messageEl.textContent = message;
    modal.classList.add('show');
  }
}

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

// сброс (без перезагрузки страницы)
function resetForm(){
  // селекты и доп. условия
  if (els.mode) els.mode.value = '44-fz';
  if (els.closed) els.closed.checked = false;
  if (els.single) els.single.checked = false;
  toggleGov({ modeEl: els.mode, extrasWrap: els.extrasWrap });

  // даты по умолчанию
  const now = new Date();
  if (els.start) els.start.value = toLocalISO(now);
  if (els.end) els.end.value = toLocalISO(endOfNextMonth(now));

  // сумма и поля
  if (els.sum) els.sum.value = '';
  if (els.inn) els.inn.value = '';
  if (els.company) els.company.value = '';
  if (els.phone) els.phone.value = '';
  if (els.email) els.email.value = '';
  if (els.comment) els.comment.value = '';
  if (els.consent) els.consent.checked = false;

  // тип гарантии с учётом текущего варианта страницы
  lockTypeIfNeeded(VARIANT, els.gtype);

  // ошибки и сообщения
  if (els.err?.inn) els.err.inn.textContent = '';
  if (els.err?.sum) els.err.sum.textContent = '';
  if (els.err?.phone) els.err.phone.textContent = '';
  if (els.err?.email) els.err.email.textContent = '';
  if (els.msg) els.msg.textContent = '';

  // пересчёт и фокус
  recalc();
  els.inn?.focus();
}

els.reset?.addEventListener('click', (e)=>{
  e.preventDefault();
  resetForm();
});

