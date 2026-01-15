export interface AudioTrack {
  id: number;
  title: string;
  artist: string;
  url: string;
  uniqueUrl: string;
  duration: string;
  filename: string;
  instrumentalUrl?: string;
  instrumentalFilename?: string;
  isInstrumental?: boolean;
  band?: string;
}

export type TrackVersion = "regular" | "instrumental";
export type BandType = "balm" | "full-time-bionic";

export interface BandInfo {
  name: string;
  composer: string;
  contributors?: string;
  samples?: string;
}

export const bandInfo: Record<BandType, BandInfo> = {
  balm: {
    name: "BALM",
    composer: "Dave Melkonian",
    contributors: "Bryan Caspers, Chris Olson, Michael O'Reilly",
    samples:
      "Fiend, Waka Flocka Flame, Motorhead, Knocked Loose, Youth of Today, Alice In Chains, Pink Floyd, Notorious B.I.G., Eagles, Big Tuck, Tommy LaSorda, Slayer, Method Man",
  },
  "full-time-bionic": {
    name: "Full Time Bionic",
    composer: "",
    contributors: "",
    samples: "",
  },
};

export const audioTracks: AudioTrack[] = [
  // BALM tracks
  {
    id: 1,
    title: "Warrior Women v Egypt",
    artist: "",
    url: "/audio/warrior.mp3",
    uniqueUrl: "/audio/balm-warrior-women-2024.mp3",
    duration: "3:30",
    filename: "warrior.mp3",
    band: "balm",
  },
  {
    id: 2,
    title: "Motorhead v Notorious B.I.G. v Pink Floyd",
    artist: "",
    url: "/audio/motorbeatv2.mp3",
    uniqueUrl: "/audio/balm-motorhead-big-pink-floyd-mashup.mp3",
    duration: "1:26",
    filename: "motorbeatv2.mp3",
    band: "balm",
  },
  {
    id: 3,
    title: "Alice In Chains v Fiend",
    artist: "",
    url: "/audio/aic-fiend.mp3",
    uniqueUrl: "/audio/balm-alice-chains-fiend-remix.mp3",
    duration: "0:38",
    filename: "aic-fiend.mp3",
    band: "balm",
  },
  {
    id: 4,
    title: "Slayer v Congas",
    artist: "",
    url: "/audio/slayer-congas.mp3",
    uniqueUrl: "/audio/balm-slayer-congas-fusion.mp3",
    duration: "2:15",
    filename: "slayer-congas.mp3",
    band: "balm",
  },
  {
    id: 5,
    title: "Lasorda v Bevacqua",
    artist: "",
    url: "/audio/bevacqua.mp3",
    uniqueUrl: "/audio/balm-lasorda-bevacqua-battle-cropped.mp3",
    duration: "1:22",
    filename: "bevacqua.mp3",
    band: "balm",
  },
  {
    id: 6,
    title: "Eagles v Big Tuck",
    artist: "",
    url: "/audio/eagles.mp3",
    uniqueUrl: "/audio/eagles.mp3",
    duration: "3:45",
    filename: "eagles.mp3",
    band: "balm",
  },
  {
    id: 7,
    title: "Specifically or Explicitly",
    artist: "",
    url: "/audio/nothing-specifically.mp3",
    uniqueUrl: "/audio/nothing-specifically.mp3",
    duration: "1:55",
    filename: "nothing-specifically.mp3",
    instrumentalUrl: "/audio/nothing-specifically-instrumental.mp3",
    instrumentalFilename: "nothing-specifically-instrumental.mp3",
    band: "balm",
  },
  {
    id: 8,
    title: "This Time, It's Jeremy",
    artist: "",
    url: "/audio/claspaliti.mp3",
    uniqueUrl: "/audio/claspaliti.mp3",
    duration: "2:00",
    filename: "claspaliti.mp3",
    instrumentalUrl: "/audio/this-time-its-jeremy-instrumental.mp3",
    instrumentalFilename: "this-time-its-jeremy-instrumental.mp3",
    band: "balm",
  },
  {
    id: 9,
    title: "Vokey SM10 Raw",
    artist: "",
    url: "/audio/Vokey-SM10-Raw.mp3",
    uniqueUrl: "/audio/Vokey-SM10-Raw.mp3",
    duration: "4:36",
    filename: "Vokey-SM10-Raw.mp3",
    band: "balm",
  },
  {
    id: 10,
    title: "On Sunday",
    artist: "",
    url: "/audio/on-sunday.mp3",
    uniqueUrl: "/audio/on-sunday.mp3",
    duration: "2:49",
    filename: "on-sunday.mp3",
    band: "balm",
  },
  {
    id: 11,
    title: "One Family Counting Worms In The Paint",
    artist: "",
    url: "/audio/one-family-counting-worms-in-the-paint.mp3",
    uniqueUrl: "/audio/one-family-counting-worms-in-the-paint.mp3",
    duration: "3:15",
    filename: "one-family-counting-worms-in-the-paint.mp3",
    band: "balm",
  },
  // BALM Instrumental tracks
  {
    id: 12,
    title: "Specifically or Explicitly (Instrumental)",
    artist: "",
    url: "/audio/nothing-specifically-instrumental.mp3",
    uniqueUrl: "/audio/nothing-specifically-instrumental.mp3",
    duration: "1:55",
    filename: "nothing-specifically-instrumental.mp3",
    isInstrumental: true,
    band: "balm",
  },
  {
    id: 13,
    title: "This Time, It's Jeremy (Instrumental)",
    artist: "",
    url: "/audio/this-time-its-jeremy-instrumental.mp3",
    uniqueUrl: "/audio/this-time-its-jeremy-instrumental.mp3",
    duration: "2:00",
    filename: "this-time-its-jeremy-instrumental.mp3",
    isInstrumental: true,
    band: "balm",
  },
  {
    id: 14,
    title: "Titleist Vokey SM-10 (Instrumental)",
    artist: "",
    url: "/audio/sickly-instrumental.mp3",
    uniqueUrl: "/audio/sickly-instrumental.mp3",
    duration: "3:45",
    filename: "sickly-instrumental.mp3",
    isInstrumental: true,
    band: "balm",
  },
  {
    id: 15,
    title: "Soulja Boy As A Service (Instrumental)",
    artist: "",
    url: "/audio/soulja-boy-master.mp3",
    uniqueUrl: "/audio/soulja-boy-master.mp3",
    duration: "2:15",
    filename: "soulja-boy-master.mp3",
    isInstrumental: true,
    band: "balm",
  },
  {
    id: 16,
    title: "Beated (Instrumental)",
    artist: "",
    url: "/audio/beated-master.mp3",
    uniqueUrl: "/audio/beated-master.mp3",
    duration: "2:45",
    filename: "beated-master.mp3",
    isInstrumental: true,
    band: "balm",
  },
  {
    id: 17,
    title: "Eating Ourselves",
    artist: "",
    url: "/audio/eating-ourselves-we-are-eating-ourselves.mp3",
    uniqueUrl: "/audio/eating-ourselves-we-are-eating-ourselves.mp3",
    duration: "3:00",
    filename: "eating-ourselves-we-are-eating-ourselves.mp3",
    band: "balm",
  },
  // Full Time Bionic tracks
  {
    id: 101,
    title: "Bait Moss",
    artist: "",
    url: "/audio/ftb-bait-moss.wav",
    uniqueUrl: "/audio/ftb-bait-moss.wav",
    duration: "3:15",
    filename: "ftb-bait-moss.wav",
    band: "full-time-bionic",
  },
  {
    id: 102,
    title: "Arm and Arm",
    artist: "",
    url: "/audio/ftb-arm-and-arm.mp3",
    uniqueUrl: "/audio/ftb-arm-and-arm.mp3",
    duration: "3:00",
    filename: "ftb-arm-and-arm.mp3",
    band: "full-time-bionic",
  },
  {
    id: 103,
    title: "Bring All Your Friends",
    artist: "",
    url: "/audio/ftb-bring-all-your-friends.mp3",
    uniqueUrl: "/audio/ftb-bring-all-your-friends.mp3",
    duration: "3:30",
    filename: "ftb-bring-all-your-friends.mp3",
    band: "full-time-bionic",
  },
  {
    id: 104,
    title: "Chin Music",
    artist: "",
    url: "/audio/ftb-chin-music.mp3",
    uniqueUrl: "/audio/ftb-chin-music.mp3",
    duration: "3:00",
    filename: "ftb-chin-music.mp3",
    band: "full-time-bionic",
  },
  {
    id: 105,
    title: "Pill Choker",
    artist: "",
    url: "/audio/ftb-pill-choker.wav",
    uniqueUrl: "/audio/ftb-pill-choker.wav",
    duration: "3:45",
    filename: "ftb-pill-choker.wav",
    band: "full-time-bionic",
  },
  {
    id: 106,
    title: "Plow the New Ground",
    artist: "",
    url: "/audio/ftb-plow-the-new-ground.wav",
    uniqueUrl: "/audio/ftb-plow-the-new-ground.wav",
    duration: "4:00",
    filename: "ftb-plow-the-new-ground.wav",
    band: "full-time-bionic",
  },
  {
    id: 107,
    title: "Pound for Pound",
    artist: "",
    url: "/audio/ftb-pound-for-pound.mp3",
    uniqueUrl: "/audio/ftb-pound-for-pound.mp3",
    duration: "3:20",
    filename: "ftb-pound-for-pound.mp3",
    band: "full-time-bionic",
  },
  {
    id: 108,
    title: "Praise Your Brotherman",
    artist: "",
    url: "/audio/ftb-praise-your-brotherman.wav",
    uniqueUrl: "/audio/ftb-praise-your-brotherman.wav",
    duration: "3:30",
    filename: "ftb-praise-your-brotherman.wav",
    band: "full-time-bionic",
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

// Helper function to get the appropriate URL based on version
export const getTrackUrl = (
  track: AudioTrack,
  version: TrackVersion
): string => {
  if (version === "instrumental" && track.instrumentalUrl) {
    return track.instrumentalUrl;
  }
  return track.uniqueUrl;
};

// Helper function to get tracks by type
export const getTracksByType = (isInstrumental: boolean): AudioTrack[] => {
  return audioTracks.filter((track) =>
    isInstrumental ? track.isInstrumental : !track.isInstrumental
  );
};

// Helper function to get tracks by band and type
export const getTracksByBandAndType = (
  band: BandType,
  isInstrumental: boolean
): AudioTrack[] => {
  return audioTracks.filter(
    (track) =>
      track.band === band &&
      (isInstrumental ? track.isInstrumental : !track.isInstrumental)
  );
};
