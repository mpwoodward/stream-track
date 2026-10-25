import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  normalizeSeason,
  getDefaultSeasonForType,
  formatMediaTitle,
  deduplicateHistorySeeds
} from '../src/utils/seasonMedia.js';

test('normalizeSeason returns positive integer for tv and null for movies or empty values', () => {
  assert.equal(normalizeSeason('tv', 1), 1);
  assert.equal(normalizeSeason('tv', '2'), 2);
  assert.equal(normalizeSeason('tv', ''), null);
  assert.equal(normalizeSeason('tv', null), null);
  assert.equal(normalizeSeason('tv', undefined), null);
  assert.equal(normalizeSeason('tv', 0), null);
  assert.equal(normalizeSeason('tv', -1), null);
  assert.equal(normalizeSeason('tv', 1.5), null);
  assert.equal(normalizeSeason('movie', 1), null);
  assert.equal(normalizeSeason('movie', '3'), null);
});

test('getDefaultSeasonForType defaults tv to 1 when empty and clears season for movie', () => {
  assert.equal(getDefaultSeasonForType('tv'), 1);
  assert.equal(getDefaultSeasonForType('tv', null), 1);
  assert.equal(getDefaultSeasonForType('tv', ''), 1);
  assert.equal(getDefaultSeasonForType('tv', 3), 3);
  assert.equal(getDefaultSeasonForType('movie', 3), null);
  assert.equal(getDefaultSeasonForType('movie'), null);
});

test('formatMediaTitle appends (S#) for tv items with a season and leaves others unchanged', () => {
  assert.equal(
    formatMediaTitle({ name: 'Scrubs', type: 'tv', season: 1 }),
    'Scrubs (S1)'
  );
  assert.equal(
    formatMediaTitle({ name: 'Scrubs', type: 'tv', season: 2 }),
    'Scrubs (S2)'
  );
  assert.equal(
    formatMediaTitle({ name: 'Scrubs', type: 'tv', season: null }),
    'Scrubs'
  );
  assert.equal(
    formatMediaTitle({ name: 'Scrubs', type: 'tv' }),
    'Scrubs'
  );
  assert.equal(
    formatMediaTitle({ name: 'Inception', type: 'movie', season: 1 }),
    'Inception'
  );
  assert.equal(
    formatMediaTitle({ name: 'Inception', type: 'movie', season: null }),
    'Inception'
  );
});

test('deduplicateHistorySeeds keeps only one seed candidate per tmdb_id from watching/watched', () => {
  const items = [
    { id: '1', tmdb_id: 4556, name: 'Scrubs', type: 'tv', season: 1, status: 'watched' },
    { id: '2', tmdb_id: 4556, name: 'Scrubs', type: 'tv', season: 2, status: 'watched' },
    { id: '3', tmdb_id: 4556, name: 'Scrubs', type: 'tv', season: 3, status: 'watching' },
    { id: '4', tmdb_id: 1396, name: 'Breaking Bad', type: 'tv', season: 1, status: 'watched' },
    { id: '5', tmdb_id: 9999, name: 'Unreleased Show', type: 'tv', season: 1, status: 'want_to_watch' },
    { id: '6', tmdb_id: null, name: 'Manual Entry', type: 'tv', season: 1, status: 'watched' }
  ];

  const seeds = deduplicateHistorySeeds(items);
  assert.equal(seeds.length, 2);
  assert.deepEqual(
    seeds.map(s => s.tmdb_id),
    [4556, 1396]
  );
});

test('Vue components wire season input, card display suffix, and recommendation seeding', () => {
  const addMediaView = fs.readFileSync(new URL('../src/views/AddMediaView.vue', import.meta.url), 'utf8');
  assert.match(addMediaView, /v-if="form\.type === 'tv'"/);
  assert.match(addMediaView, /v-model\.number="form\.season"/);
  assert.match(addMediaView, /normalizeSeason\(form\.value\.type,\s*form\.value\.season\)/);

  const showCard = fs.readFileSync(new URL('../src/components/ShowCard.vue', import.meta.url), 'utf8');
  assert.match(showCard, /formatMediaTitle\(props\.item\)/);
  assert.match(showCard, /\{\{\s*displayTitle\s*\}\}/);

  const homeView = fs.readFileSync(new URL('../src/views/HomeView.vue', import.meta.url), 'utf8');
  assert.match(homeView, /deduplicateHistorySeeds\(mediaItems\.value\)/);
  assert.match(homeView, /season:\s*getDefaultSeasonForType\(item\.type\)/);
});
