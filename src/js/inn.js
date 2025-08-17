const TOKEN = import.meta.env.VITE_DADATA_TOKEN || 'e073ea318d08dbaa698e4fd6d5696b1e00338362'; // лучше использовать свой прокси вместо прямого ключа

export async function findByInn(inn){
  if (!TOKEN) return null; // без токена просто не ищем
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
