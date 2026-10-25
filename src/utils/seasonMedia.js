export const normalizeSeason = (type, season) => {
  if (type !== 'tv') return null;
  if (season === '' || season === null || season === undefined) return null;

  const parsed = Number(season);
  if (!Number.isInteger(parsed) || parsed < 1) return null;

  return parsed;
};

export const getDefaultSeasonForType = (type, currentSeason = null) => {
  if (type !== 'tv') return null;
  const existing = normalizeSeason('tv', currentSeason);
  return existing ?? 1;
};

export const formatMediaTitle = (item) => {
  if (!item || !item.name) return '';
  const season = normalizeSeason(item.type, item.season);
  if (season !== null) {
    return `${item.name} (S${season})`;
  }
  return item.name;
};

export const deduplicateHistorySeeds = (items) => {
  if (!Array.isArray(items)) return [];
  const uniqueByTmdbId = new Map();

  for (const item of items) {
    if (!item?.tmdb_id) continue;
    if (item.status !== 'watched' && item.status !== 'watching') continue;
    if (!uniqueByTmdbId.has(item.tmdb_id)) {
      uniqueByTmdbId.set(item.tmdb_id, item);
    }
  }

  return Array.from(uniqueByTmdbId.values());
};
