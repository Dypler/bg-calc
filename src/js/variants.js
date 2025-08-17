export function getVariant(){
  const v = document.body.getAttribute('data-variant') || 'all';
  return v; // 'all'|'execution'|'warranty'|'bid'|'advance'|'payment'
}
export function lockTypeIfNeeded(variant, gtypeEl){
  if (variant === 'all') return;
  const map = { bid:'bid', execution:'execution', advance:'advance', warranty:'warranty', payment:'payment' };
  gtypeEl.value = map[variant] || 'execution';
  gtypeEl.disabled = true;
}
export function applyHead(variant){
  // опционально — можно менять <title>/<meta> на лету, если надо
}
