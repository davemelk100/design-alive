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

const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Use the tracks from the audioUrls data
  const tracks: AudioTrack[] = audioTracks;

  // Preload all MP3 files when component mounts
  useEffect(() => {
    tracks.forEach((track) => {
      const audio = new Audio();
      audio.src = track.uniqueUrl;
      audio.preload = "auto";
    });

    // Initialize the audio element with the first track
    if (audioRef.current) {
      audioRef.current.src = tracks[0].uniqueUrl;
      audioRef.current.load();
    }
  }, []);

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
    console.log("playTrack called with index:", index);
    setCurrentTrack(index);
    setLoading(true);
    setPendingPlay(true);
    if (audioRef.current) {
      audioRef.current.src = tracks[index].uniqueUrl;
      audioRef.current.load();
      console.log("Audio src set to:", tracks[index].uniqueUrl);
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
    if (pendingPlay && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setPendingPlay(false);
        })
        .catch((error) => {
          console.error("Error playing track:", error);
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
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          {/* <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Music Player
          </h1> */}

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
          </div>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={nextTrack}
            onLoadedMetadata={handleTimeUpdate}
            onCanPlay={handleCanPlay}
            preload="auto"
          />

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
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
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Volume2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
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
    </div>
  );
};

export default MusicPlayer;
