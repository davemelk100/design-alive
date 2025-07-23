import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import { audioTracks, AudioTrack } from "../data/audioUrls";
import MobileTrayMenu from "../components/MobileTrayMenu";

const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Use the tracks from the audioUrls data
  const tracks: AudioTrack[] = audioTracks;

  // Initialize the audio element with the first track when component mounts
  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      console.log("Loading audio file:", tracks[0].uniqueUrl);
      audioRef.current.src = tracks[0].uniqueUrl;
      audioRef.current.load();
      audioRef.current.volume = volume;
    }
  }, []);

  // Update volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (audioRef.current.readyState < 3) {
          setLoading(true);
        }
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playTrack = (index: number) => {
    setCurrentTrack(index);
    setLoading(true);
    setPendingPlay(true);
    if (audioRef.current) {
      console.log(
        "Loading track:",
        tracks[index].title,
        "URL:",
        tracks[index].uniqueUrl
      );
      audioRef.current.src = tracks[index].uniqueUrl;
      audioRef.current.load();
      // Ensure volume is properly set after loading
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = isMuted ? 0 : volume;
        }
      }, 100);
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % tracks.length;
    playTrack(next);
  };

  const prevTrack = () => {
    const prev = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    playTrack(prev);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const [pendingPlay, setPendingPlay] = useState(false);

  const handleCanPlay = () => {
    setLoading(false);
    setAudioError(null); // Clear any previous errors
    if (pendingPlay && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setPendingPlay(false);
        })
        .catch(() => {
          setPendingPlay(false);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    // Update mute state based on volume
    setIsMuted(newVolume === 0);

    // Add visual feedback
    console.log(`Volume changed to: ${Math.round(newVolume * 100)}%`);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        // Unmute: restore previous volume
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        // Mute: set volume to 0
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8 pb-[108px]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          {/* Bandcamp Link */}
          <div className="text-center mb-6">
            <a
              href="https://balmsoothes.bandcamp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
              aria-label="Visit BALM on Bandcamp"
            >
              <span>🎵</span>
              <span>Listen on Bandcamp</span>
              <span>→</span>
            </a>
          </div>

          {/* Current Track Info */}
          <div className="text-left mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {tracks[currentTrack]?.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              {tracks[currentTrack]?.artist}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-mono">
              URL:{" "}
              <a
                href={tracks[currentTrack]?.uniqueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                {tracks[currentTrack]?.uniqueUrl}
              </a>
            </p>
            {audioError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="text-sm">{audioError}</p>
                <button
                  onClick={() => setAudioError(null)}
                  className="mt-2 text-xs underline"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={nextTrack}
            onLoadedMetadata={handleTimeUpdate}
            onCanPlay={handleCanPlay}
            onError={(e) => {
              console.error("Audio loading error:", e);
              setLoading(false);
              setPendingPlay(false);
              setAudioError(
                `Failed to load audio: ${tracks[currentTrack]?.title}`
              );
            }}
            preload="auto"
          />

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-6 mb-8 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10 rounded-full">
                <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
              </div>
            )}
            <button
              onClick={prevTrack}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              <SkipBack className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={togglePlay}
              className="p-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              disabled={loading}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              <SkipForward className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Volume2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                    (isMuted ? 0 : volume) * 100
                  }%, #e5e7eb ${(isMuted ? 0 : volume) * 100}%, #e5e7eb 100%)`,
                }}
                aria-label="Volume control"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>

          {/* Playlist */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Playlist
            </h3>
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  index === currentTrack
                    ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700"
                    : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
                onClick={() => playTrack(index)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p
                      className={`font-medium ${
                        index === currentTrack
                          ? "text-purple-900 dark:text-purple-100"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {track.title}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {track.duration}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <MobileTrayMenu />
    </div>
  );
};

export default MusicPlayer;
