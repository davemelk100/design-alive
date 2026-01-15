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
  Music,
  Music2,
} from "lucide-react";
import {
  AudioTrack,
  TrackVersion,
  BandType,
  bandInfo,
  getTrackUrl,
  getTracksByBandAndType,
} from "../data/audioUrls";
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
  const [trackVersion, setTrackVersion] = useState<TrackVersion>("regular");
  const [showInstrumentals, setShowInstrumentals] = useState(false);
  const [currentBand, setCurrentBand] = useState<BandType>("full-time-bionic");

  const audioRef = useRef<HTMLAudioElement>(null);

  // Get tracks based on current band and view
  const tracks: AudioTrack[] = getTracksByBandAndType(
    currentBand,
    showInstrumentals
  );

  // Get current band info
  const currentBandInfo = bandInfo[currentBand];

  // Reset current track when switching views or bands
  useEffect(() => {
    setCurrentTrack(0);
    if (audioRef.current && tracks.length > 0) {
      const currentTrackData = tracks[0];
      const trackUrl = getTrackUrl(currentTrackData, trackVersion);

      audioRef.current.src = trackUrl;
      audioRef.current.load();
      audioRef.current.volume = volume;
    }
  }, [showInstrumentals, trackVersion, currentBand]);

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
      const currentTrackData = tracks[index];
      const trackUrl = getTrackUrl(currentTrackData, trackVersion);

      audioRef.current.src = trackUrl;
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

  const toggleVersion = () => {
    const newVersion: TrackVersion =
      trackVersion === "regular" ? "instrumental" : "regular";
    setTrackVersion(newVersion);

    // Reload current track with new version
    if (audioRef.current && tracks[currentTrack]) {
      const currentTrackData = tracks[currentTrack];
      const trackUrl = getTrackUrl(currentTrackData, newVersion);

      // Only switch if instrumental version exists
      if (newVersion === "instrumental" && !currentTrackData.instrumentalUrl) {
        return;
      }

      audioRef.current.src = trackUrl;
      audioRef.current.load();

      // If currently playing, continue playing
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const currentTrackData = tracks[currentTrack];
  const hasInstrumental = currentTrackData?.instrumentalUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8 pb-[108px]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          {/* Band Navigation Tabs */}
          <div className="flex justify-center mb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentBand("balm")}
                className={`px-6 py-3 text-lg font-semibold transition-colors border-b-2 ${
                  currentBand === "balm"
                    ? "border-purple-600 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                BALM
              </button>
              <button
                onClick={() => setCurrentBand("full-time-bionic")}
                className={`px-6 py-3 text-lg font-semibold transition-colors border-b-2 ${
                  currentBand === "full-time-bionic"
                    ? "border-purple-600 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Full Time Bionic
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="text-left mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {currentBandInfo.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Music and Composition: {currentBandInfo.composer}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              {currentBandInfo.contributors && (
                <p className="mb-4">
                  <span className="font-medium">Contributors:</span>{" "}
                  {currentBandInfo.contributors}
                </p>
              )}
              {currentBandInfo.samples && (
                <p>
                  <span className="font-medium">Samples:</span>{" "}
                  {currentBandInfo.samples}
                </p>
              )}
            </div>
          </div>

          {/* View Toggle - Only show for BALM */}
          {currentBand === "balm" && (
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setShowInstrumentals(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    !showInstrumentals
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Regular Tracks
                </button>
                <button
                  onClick={() => setShowInstrumentals(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    showInstrumentals
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Instrumental Tracks
                </button>
              </div>
            </div>
          )}

          {/* Current Track Info */}
          <div className="text-left mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {tracks[currentTrack]?.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              {tracks[currentTrack]?.artist}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Version:
              </span>
              <span
                className={`text-sm font-medium px-2 py-1 rounded ${
                  trackVersion === "regular"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }`}
              >
                {trackVersion === "regular" ? "Regular" : "Instrumental"}
              </span>
              {hasInstrumental && (
                <button
                  onClick={toggleVersion}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded transition-colors"
                  disabled={loading}
                >
                  {trackVersion === "regular" ? (
                    <>
                      <Music2 className="h-4 w-4" />
                      Switch to Instrumental
                    </>
                  ) : (
                    <>
                      <Music className="h-4 w-4" />
                      Switch to Regular
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-mono">
              URL:{" "}
              <a
                href={getTrackUrl(tracks[currentTrack], trackVersion)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                {getTrackUrl(tracks[currentTrack], trackVersion)}
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
                `Failed to load audio: ${tracks[currentTrack]?.title} (${trackVersion} version)`
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
              {showInstrumentals ? "Instrumental Playlist" : "Regular Playlist"}
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
