import IMask from 'imask'
import { calcFee, monthsBetween, daysBetween, coefByType, coefByExtras, MIN_FEE_RUB, DEFAULT_BASE_RATE } from './calc.js'
import { findByInn } from './inn.js'

export function initMasks({ phoneEl, innEl, sumEl }){
  if (phoneEl) IMask(phoneEl, { mask: '+{7} 000 000-00-00' });
  if (innEl) IMask(innEl, { mask: [{mask:'0000000000'},{mask:'000000000000'}] });
  if (sumEl) IMask(sumEl, { mask: Number, scale: 0, thousandsSeparator: ' ', padFractionalZeros: false });
}

export function getSumValue(sumEl){
  return Number(String(sumEl.value || '0').replace(/\s/g,''));
}

export function recalcAndRender({ startEl, endEl, sumEl, gtypeEl, extras, out }){
  const m = Math.max(0, monthsBetween(startEl.value, endEl.value));
  const d = Math.max(0, daysBetween(startEl.value, endEl.value));
  out.months.textContent = m.toFixed(2);
  out.days.textContent = String(d);
  const sum = getSumValue(sumEl);
  const kType = coefByType(gtypeEl.value);
  const kExtra = coefByExtras(extras);
  const fee = calcFee(sum, m, DEFAULT_BASE_RATE, kType, kExtra);
  out.fee.textContent = fee.toLocaleString('ru-RU');
  out.minFee.textContent = MIN_FEE_RUB.toLocaleString('ru-RU');
}

export function toggleGov({ modeEl, extrasWrap }){
  const isGov = modeEl.value === '44-fz' || modeEl.value === '223-fz';
  extrasWrap.classList.toggle('hidden', !isGov);
}

export function validate({ innEl, sumEl, phoneEl, emailEl, consentEl, errs }){
  let ok = true;
  const inn = (innEl.value||'').replace(/\D+/g,'');
  errs.inn.textContent = (inn.length===10 || inn.length===12) ? '' : 'ИНН: 10 (юр) или 12 (ИП) цифр';
  if (errs.inn.textContent) ok=false;

  const sum = getSumValue(sumEl);
  errs.sum.textContent = sum >= 10000 ? '' : 'Минимальная сумма 10 000 ₽';
  if (errs.sum.textContent) ok=false;

  const phoneDigits = (phoneEl.value||'').replace(/\D+/g,'');
  errs.phone.textContent = phoneDigits.length >= 11 ? '' : 'Укажите корректный телефон';
  if (errs.phone.textContent) ok=false;

  errs.email.textContent = (/^[^\s@]+@[^@\s]+\.[^@\s]+$/.test(emailEl.value)) ? '' : 'Укажите корректный email';
  if (errs.email.textContent) ok=false;

  if (!consentEl.checked) ok=false;

  return ok;
}

export async function lookupInn({ innEl, companyEl, errEl }){
  const inn = (innEl.value||'').replace(/\D+/g,'');
  if (!(inn.length===10 || inn.length===12)) { errEl.textContent = 'ИНН некорректен'; return; }
  companyEl.value = 'Поиск…';
  try{
    const info = await findByInn(inn);
    if (info) {
      companyEl.value = info.name || '';
      errEl.textContent = '';
    } else {
      companyEl.value = '';
      errEl.textContent = 'Не найдено. Укажите наименование вручную.';
    }
  }catch(e){
    companyEl.value = '';
    errEl.textContent = 'Ошибка запроса. Укажите наименование вручную.';
  }
}

// Утилита: дебаунс
export function debounce(fn, ms = 200){
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
