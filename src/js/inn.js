function resolveToken(){
  // 1) из Vite env
  const fromEnv = import.meta.env.VITE_DADATA_TOKEN;
  if (fromEnv && String(fromEnv).trim()) return String(fromEnv).trim();
  // 2) из localStorage (для локальной отладки)
  try{
    const fromLs = localStorage.getItem('DADATA_TOKEN');
    if (fromLs && fromLs.trim()) return fromLs.trim();
  }catch(_){/* ignore */}
  // 3) из <meta name="dadata-token" content="...">
  const meta = document.querySelector('meta[name="dadata-token"]');
  const fromMeta = meta?.getAttribute('content');
  if (fromMeta && fromMeta.trim()) return fromMeta.trim();
  // 4) Фоллбек: тестовый ключ только в dev-сборке
  if (import.meta.env.DEV) return 'e073ea318d08dbaa698e4fd6d5696b1e00338362';
  return '';
}
function getToken(){
  // Берём токен на каждый вызов, чтобы подхватывать изменения (localStorage/meta) без перезагрузки
  return resolveToken();
}

export async function findByInn(inn){
  const TOKEN = getToken();
  if (!TOKEN) return null; // без токена — не ищем
  const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party';
  const res = await fetch(url, {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Accept':'application/json',
      'Authorization':'Token ' + TOKEN,
    },
    body: JSON.stringify({ query: inn })
  });
  if (!res.ok) throw new Error('DaData HTTP '+res.status);
  const data = await res.json();
  const s = data?.suggestions?.[0];
  if (!s) return null;
  const d = s.data;
  return {
    name: d?.name?.full_with_opf || d?.name?.short_with_opf || s.value,
    ogrn: d?.ogrn || '',
    kpp: d?.kpp || '',
    address: d?.address?.value || ''
  };
}
