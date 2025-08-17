export const DEFAULT_BASE_RATE = 2.3; // %/год, скрытый ориентир
export const MIN_FEE_RUB = 1200;

export function monthsBetween(sISO, eISO){
  const s = new Date(sISO), e = new Date(eISO);
  const ms = e - s;
  if (!isFinite(ms) || ms <= 0) return 0;
  return ms / (30.4375*24*3600*1000);
}
export function daysBetween(sISO, eISO){
  const s = new Date(sISO), e = new Date(eISO);
  const ms = e - s;
  if (!isFinite(ms) || ms <= 0) return 0;
  return Math.ceil(ms / (24*3600*1000));
}
export function coefByType(type){
  switch(type){
    case 'bid': return 0.85;
    case 'execution': return 1.00;
    case 'warranty': return 1.05;
    case 'advance': return 1.15;
    case 'payment': return 1.10;
    default: return 1.00;
  }
}
export function coefByExtras({closed=false, single=false}={}){
  let k = 1;
  if (closed) k *= 1.10;
  if (single) k *= 1.05;
  return k;
}
export function calcFee(sumRub, months, baseRateYear = DEFAULT_BASE_RATE, kType=1, kExtra=1){
  const effRateY = baseRateYear * kType * kExtra;
  const effPeriod = (effRateY/100) * (months/12);
  return Math.max(Math.round(sumRub * effPeriod), MIN_FEE_RUB);
}
