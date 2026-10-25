import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeText, matchesFilterQuery } from '../src/utils/filterMedia.js';

test('normalizeText strips punctuation, collapses whitespace, and lowercases', () => {
  assert.equal(
    normalizeText('  Wake Up Dead Man: A Knives Out Mystery! '),
    'wake up dead man a knives out mystery'
  );
  assert.equal(normalizeText(''), '');
  assert.equal(normalizeText(null), '');
});

test('matchesFilterQuery matches word prefixes in title', () => {
  assert.equal(matchesFilterQuery('beas', 'The Beast in Me'), true);
  assert.equal(matchesFilterQuery('al', 'All Her Fault'), true);
  assert.equal(matchesFilterQuery('al', 'Malice'), false);
  assert.equal(
    matchesFilterQuery('knives', 'Wake Up Dead Man: A Knives Out Mystery'),
    true
  );
  assert.equal(matchesFilterQuery('the beas', 'The Beast in Me'), true);
  assert.equal(
    matchesFilterQuery('dead man', 'Wake Up Dead Man: A Knives Out Mystery'),
    true
  );
  assert.equal(matchesFilterQuery('wake up', 'Wake Up Dead Man'), true);
  assert.equal(
    matchesFilterQuery('mystery', 'Wake Up Dead Man: A Knives Out Mystery'),
    true
  );
  assert.equal(matchesFilterQuery('out', 'Knives Out'), true);
});

test('matchesFilterQuery matches word prefixes in nickname and empty query', () => {
  assert.equal(matchesFilterQuery('bcs', 'Better Call Saul', 'BCS'), true);
  assert.equal(matchesFilterQuery('saul', 'Better Call Saul', 'BCS'), true);
  assert.equal(matchesFilterQuery('xyz', 'Better Call Saul', 'BCS'), false);
  assert.equal(matchesFilterQuery('', 'Better Call Saul'), true);
});
