export interface SongTrack {
  title: string;
  artist: string;
  url: string;
  audioSrc: string;
}

export const PLAYLIST_SONGS: SongTrack[] = [
  {
    title: 'Yêu đến phát điên',
    artist: 'Nước Dưa Hấu (西瓜汁)',
    url: 'https://youtu.be/MfaNv2xn7Tw',
    audioSrc: '/assets/music/song1.mp3'
  },
  {
    title: 'Lời viện cớ cuối cùng',
    artist: 'h3R3, La Khả Lorkin',
    url: 'https://youtu.be/ZH4cJave6KY',
    audioSrc: '/assets/music/song2.mp3'
  },
  {
    title: 'Còn tôi thì sao',
    artist: 'Cỏ dại (那我呢)',
    url: 'https://youtu.be/lFcWQiVA3aU',
    audioSrc: '/assets/music/song3.mp3'
  },
  {
    title: 'Thuần phục ái tình',
    artist: 'Hoàng Tinh (黄星)',
    url: 'https://youtu.be/ML9ysulneUs',
    audioSrc: '/assets/music/song4.mp3'
  },
  {
    title: 'Em như cái gai đâm vào tim tôi',
    artist: 'Lư Nhuận Trạch (卢润泽)',
    url: 'https://youtu.be/YJVZ9wOMub8',
    audioSrc: '/assets/music/song5.mp3'
  },
  {
    title: 'Giữ lại một phần',
    artist: 'Lam Tước Huân Điệu',
    url: 'https://youtu.be/m_bgWLdz9BA',
    audioSrc: '/assets/music/song6.mp3'
  }
];
