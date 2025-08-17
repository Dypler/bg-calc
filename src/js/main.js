import '../scss/main.scss'
import { initMasks, recalcAndRender, toggleGov, validate, lookupInn } from './ui.js'
import { getVariant, lockTypeIfNeeded } from './variants.js'

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
  btnLookup: $('btn-lookup'),
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

// маски
initMasks({ phoneEl: els.phone, innEl: els.inn, sumEl: els.sum });

// дефолтные даты
const today = new Date();
const toISO = (d)=>d.toISOString().slice(0,10);
els.start.value = toISO(today);
els.end.value = toISO(new Date(today.getFullYear(), today.getMonth()+6, today.getDate()));

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

// поиск по ИНН
els.btnLookup?.addEventListener('click', ()=>lookupInn({ innEl: els.inn, companyEl: els.company, errEl: els.err.inn }));
els.inn?.addEventListener('blur', ()=>{ if (els.inn.value.trim()) lookupInn({ innEl: els.inn, companyEl: els.company, errEl: els.err.inn }) });

// отправка
els.submit?.addEventListener('click', async ()=>{
  if (!validate({ innEl: els.inn, sumEl: els.sum, phoneEl: els.phone, emailEl: els.email, consentEl: els.consent, errs: els.err })) {
    els.msg.textContent = 'Проверьте корректность полей и согласие на обработку ПДн';
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
    const res = await fetch('/api/leads/bg', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('HTTP '+res.status);
    els.msg.textContent = 'Заявка отправлена. Мы свяжемся с вами.';
  }catch(e){
    console.error(e);
    els.msg.textContent = 'Ошибка отправки. Попробуйте ещё раз.';
  }finally{
    els.submit.disabled = false;
  }
});

// сброс
els.reset?.addEventListener('click', ()=>location.reload());

