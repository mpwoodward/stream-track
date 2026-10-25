export const normalizeText = (str) =>
  (str || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export const matchesFilterQuery = (query, name, nickname = '') => {
  const nQuery = normalizeText(query);
  if (!nQuery) return true;

  const nName = normalizeText(name);
  const nNickname = nickname ? normalizeText(nickname) : '';

  return (
    (' ' + nName).includes(' ' + nQuery) ||
    (' ' + nNickname).includes(' ' + nQuery)
  );
};
