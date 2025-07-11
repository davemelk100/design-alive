# Audio Files Directory

This directory contains MP3 files for the admin-only music player.

## Setup Instructions

1. **Add your MP3 files** to this directory
2. **Update the tracks array** in `src/pages/MusicPlayer.tsx` with your file information:

```typescript
const tracks: Track[] = [
  {
    id: 1,
    title: "Your Song Title",
    artist: "Artist Name",
    url: "/audio/your-file.mp3",
    duration: "3:45",
  },
  // Add more tracks...
];
```

## File Requirements

- **Format**: MP3 files only
- **Naming**: Use descriptive filenames without spaces (use hyphens or underscores)
- **Size**: Keep files reasonably sized for web streaming
- **Quality**: 128-320 kbps is recommended for web use

## Current Tracks

The player is currently configured with:

- `motorbeatv2.mp3` - Mash - Motorhead v Notorious B.I.G. v Pink Floyd
- `aic-fiend.mp3` - Mash - Alice In Chains x Fiend
- `slayer-congas.mp3` - Mash - Slayer x Congas

Add more tracks by updating the tracks array in `src/pages/MusicPlayer.tsx`.

## Access

The music player is only accessible through the admin panel at `/admin-music` or directly at `/music-player` (admin authentication required).
