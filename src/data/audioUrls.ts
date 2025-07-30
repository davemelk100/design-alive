export interface AudioTrack {
  id: number;
  title: string;
  artist: string;
  url: string;
  uniqueUrl: string;
  duration: string;
  filename: string;
}

export const audioTracks: AudioTrack[] = [
  {
    id: 1,
    title: "Warrior Women v Egypt",
    artist: "BALM",
    url: "/audio/warrior.mp3",
    uniqueUrl: "/audio/balm-warrior-women-2024.mp3",
    duration: "3:30",
    filename: "warrior.mp3",
  },
  {
    id: 2,
    title: "Motorhead v Notorious B.I.G. v Pink Floyd",
    artist: "BALM",
    url: "/audio/motorbeatv2.mp3",
    uniqueUrl: "/audio/balm-motorhead-big-pink-floyd-mashup.mp3",
    duration: "1:26",
    filename: "motorbeatv2.mp3",
  },
  {
    id: 3,
    title: "Alice In Chains v Fiend",
    artist: "BALM",
    url: "/audio/aic-fiend.mp3",
    uniqueUrl: "/audio/balm-alice-chains-fiend-remix.mp3",
    duration: "0:38",
    filename: "aic-fiend.mp3",
  },
  {
    id: 4,
    title: "Slayer v Congas",
    artist: "BALM",
    url: "/audio/slayer-congas.mp3",
    uniqueUrl: "/audio/balm-slayer-congas-fusion.mp3",
    duration: "2:15",
    filename: "slayer-congas.mp3",
  },
  {
    id: 5,
    title: "Lasorda v Bevacqua",
    artist: "BALM",
    url: "/audio/bevacqua.mp3",
    uniqueUrl: "/audio/balm-lasorda-bevacqua-battle-cropped.mp3",
    duration: "1:22",
    filename: "bevacqua.mp3",
  },
  {
    id: 6,
    title: "Eagles v Big Tuck",
    artist: "BALM",
    url: "/audio/eagles.mp3",
    uniqueUrl: "/audio/eagles.mp3",
    duration: "3:45",
    filename: "eagles.mp3",
  },
  {
    id: 7,
    title: "Specifically or Explicitly",
    artist: "BALM",
    url: "/audio/nothing-specifically.mp3",
    uniqueUrl: "/audio/nothing-specifically.mp3",
    duration: "1:55",
    filename: "nothing-specifically.mp3",
  },
  {
    id: 8,
    title: "Well I'll Be A",
    artist: "BALM",
    url: "/audio/You-Son-Of-A.mp3",
    uniqueUrl: "/audio/You-Son-Of-A.mp3",
    duration: "2:30",
    filename: "You-Son-Of-A.mp3",
  },
  {
    id: 9,
    title: "This Time, It's Jeremy",
    artist: "BALM",
    url: "/audio/claspaliti.mp3",
    uniqueUrl: "/audio/claspaliti.mp3",
    duration: "2:00",
    filename: "claspaliti.mp3",
  },
  {
    id: 10,
    title: "Vokey SM10 Raw",
    artist: "BALM",
    url: "/audio/sickly.mp3",
    uniqueUrl: "/audio/sickly.mp3",
    duration: "4:32",
    filename: "sickly.mp3",
  },
  {
    id: 11,
    title: "Vokey SM10 Raw",
    artist: "BALM",
    url: "/audio/Vokey-SM10-Raw.mp3",
    uniqueUrl: "/audio/Vokey-SM10-Raw.mp3",
    duration: "4:36",
    filename: "Vokey-SM10-Raw.mp3",
  },
];

// Helper function to get track by unique URL
export const getTrackByUniqueUrl = (
  uniqueUrl: string
): AudioTrack | undefined => {
  return audioTracks.find((track) => track.uniqueUrl === uniqueUrl);
};

// Helper function to get track by filename
export const getTrackByFilename = (
  filename: string
): AudioTrack | undefined => {
  return audioTracks.find((track) => track.filename === filename);
};

// Helper function to get all unique URLs
export const getAllUniqueUrls = (): string[] => {
  return audioTracks.map((track) => track.uniqueUrl);
};
