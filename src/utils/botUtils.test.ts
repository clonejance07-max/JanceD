import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterAndSortBots,
  getAvatarObjectPosition,
  getRecommendedBots,
  extractYouTubeId,
  pickHexagram,
  pickRandomBot,
  parseBoldMarkdown
} from './botUtils';
import { BOTS_DATA, UPCOMING_BOTS } from '../data/bots';
import { PLAYLIST_SONGS } from '../data/songs';

test('UPCOMING_BOTS is empty and BOTS_DATA contains 5 characters', () => {
  assert.equal(UPCOMING_BOTS.length, 0);
  const all = filterAndSortBots(BOTS_DATA, '', null);
  assert.equal(all.length, 5);
  assert.equal(all[0].id, 'hoac-kinh');
  assert.equal(all[0].name, 'Hoắc Kình');
  assert.equal(
    all[0].link,
    'https://aistudio.google.com/u/5/prompts/16ybPvae--U21tgVpGvhitGRGlQ7TVBZw'
  );
  assert.equal(all[0].avatar, '/assets/aistudio/IMG_9234_6aefc2b9.jpeg');
  assert.equal(all[1].id, 'kim-seung-ho');
  assert.equal(all[2].id, 'tham-da-than');
  assert.equal(all[3].id, 'tieu-huyen-duc');
  assert.equal(all[4].id, 'tan-vong-canh');
});

test('filterAndSortBots filters by search query on name and tags', () => {
  const byName = filterAndSortBots(BOTS_DATA, 'Hoắc Kình', null);
  assert.equal(byName.length, 1);
  assert.equal(byName[0].id, 'hoac-kinh');

  const byTag = filterAndSortBots(BOTS_DATA, 'Hắc đạo', null);
  assert.equal(byTag.some((b) => b.name === 'Hoắc Kình'), true);

  const noMatch = filterAndSortBots(BOTS_DATA, 'Không tồn tại', null);
  assert.equal(noMatch.length, 0);
});

test('filterAndSortBots filters by selectedTag accurately', () => {
  const coTrangBots = filterAndSortBots(BOTS_DATA, '', 'Cổ trang');
  assert.equal(coTrangBots.length, 2);
  const hienDaiBots = filterAndSortBots(BOTS_DATA, '', 'Hiện đại');
  assert.equal(hienDaiBots.length, 3);
  assert.equal(hienDaiBots[0].id, 'hoac-kinh');
});

test('getRecommendedBots returns recommended characters', () => {
  const rec = getRecommendedBots(BOTS_DATA);
  assert.equal(rec.length, 5);
  assert.equal(rec.every((b) => b.isRecommended), true);
});

test('PLAYLIST_SONGS contains the 6 user songs with valid YouTube IDs', () => {
  assert.equal(PLAYLIST_SONGS.length, 6);
  assert.equal(PLAYLIST_SONGS[0].title, 'Yêu đến phát điên');
  assert.equal(extractYouTubeId(PLAYLIST_SONGS[0].url), 'MfaNv2xn7Tw');
  assert.equal(PLAYLIST_SONGS[1].title, 'Lời viện cớ cuối cùng');
  assert.equal(extractYouTubeId(PLAYLIST_SONGS[1].url), 'ZH4cJave6KY');
  assert.equal(PLAYLIST_SONGS[2].title, 'Còn tôi thì sao');
  assert.equal(extractYouTubeId(PLAYLIST_SONGS[2].url), 'lFcWQiVA3aU');
  assert.equal(PLAYLIST_SONGS[3].title, 'Thuần phục ái tình');
  assert.equal(extractYouTubeId(PLAYLIST_SONGS[3].url), 'ML9ysulneUs');
  assert.equal(PLAYLIST_SONGS[4].title, 'Em như cái gai đâm vào tim tôi');
  assert.equal(extractYouTubeId(PLAYLIST_SONGS[4].url), 'YJVZ9wOMub8');
  assert.equal(PLAYLIST_SONGS[5].title, 'Giữ lại một phần');
  assert.equal(extractYouTubeId(PLAYLIST_SONGS[5].url), 'm_bgWLdz9BA');
  assert.equal(extractYouTubeId('invalid-url'), null);
});

test('pickHexagram and pickRandomBot return valid items across boundary values', () => {
  const firstHex = pickHexagram(0);
  const lastHex = pickHexagram(0.9999);
  assert.ok(firstHex.name.includes('Quẻ'));
  assert.ok(lastHex.name.includes('Quẻ'));

  const firstBot = pickRandomBot(BOTS_DATA, 0.05);
  const fifthBot = pickRandomBot(BOTS_DATA, 0.95);
  assert.equal(firstBot?.id, 'tan-vong-canh');
  assert.equal(fifthBot?.id, 'hoac-kinh');
});

test('parseBoldMarkdown splits **bold** segments accurately', () => {
  const tokens = parseBoldMarkdown('Xin chào **JanceD** góc nhỏ **Dark Romance**!');
  assert.equal(tokens.length, 5);
  assert.deepEqual(tokens[0], { type: 'text', text: 'Xin chào ' });
  assert.deepEqual(tokens[1], { type: 'bold', text: 'JanceD' });
  assert.deepEqual(tokens[2], { type: 'text', text: ' góc nhỏ ' });
  assert.deepEqual(tokens[3], { type: 'bold', text: 'Dark Romance' });
  assert.deepEqual(tokens[4], { type: 'text', text: '!' });
});

test('getAvatarObjectPosition prioritizes custom coordinates and auto-frames tall portraits', () => {
  const seungHo = BOTS_DATA.find((b) => b.id === 'kim-seung-ho');
  assert.equal(getAvatarObjectPosition(seungHo, 'circle'), '42% 8%');
  assert.equal(getAvatarObjectPosition(seungHo, 'card'), '45% 4%');
  assert.equal(getAvatarObjectPosition({}, 'circle', 736, 1624), '50% 8%');
  assert.equal(getAvatarObjectPosition({}, 'card', 736, 1624), '50% 4%');
  assert.equal(getAvatarObjectPosition({}, 'circle', 800, 1200), '50% 20%');
});

