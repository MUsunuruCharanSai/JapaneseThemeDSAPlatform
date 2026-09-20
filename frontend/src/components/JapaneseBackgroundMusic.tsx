import React, { useState, useEffect, useRef } from 'react';

interface JapaneseBackgroundMusicProps {
  autoPlay?: boolean;
}

const JapaneseBackgroundMusic: React.FC<JapaneseBackgroundMusicProps> = ({
  autoPlay = true
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3); // Start at 30% volume
  const [showControls, setShowControls] = useState(false);

  // Initialize audio when component mounts
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;

      // Set to start from 3 seconds
      audio.currentTime = 3;

      if (autoPlay && isPlaying) {
        // Attempt to play (may be blocked by browser autoplay policies)
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsPlaying(false);
          });
        }
      }
    }
  }, []);

  // Handle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(() => {
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle audio end (loop the music)
  const handleAudioEnd = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 3; // Start from 3 seconds on loop
      audio.play().catch(() => {
      });
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        loop
        onEnded={handleAudioEnd}
        preload="auto"
      >
        <source src="/audio/japanese-fantasy-music.mp3" type="audio/mpeg" />
        <source src="/audio/ytmp3free.cc_japanese-fantasy-music-between-worlds-youtubemp3free.org (1).mp3" type="audio/mpeg" />
        <source src="/audio/japanese-background.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Music Control Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px'
        }}
      >
        {/* Control Panel */}
        {showControls && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(25px)',
              padding: '15px',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(139, 90, 60, 0.1)',
              border: '1px solid rgba(139, 90, 60, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              minWidth: '200px',
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#2d3748',
                textAlign: 'center',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.5px'
              }}
            >
              🎵 Japanese Fantasy
            </div>

            {/* Play/Pause and Mute buttons */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={togglePlayPause}
                style={{
                  background: isPlaying ? 'rgba(139, 90, 60, 0.9)' : 'rgba(139, 90, 60, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(139, 90, 60, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 90, 60, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 90, 60, 0.3)';
                }}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              <button
                onClick={toggleMute}
                style={{
                  background: isMuted ? 'rgba(220, 38, 38, 0.9)' : 'rgba(139, 90, 60, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(139, 90, 60, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${isMuted ? 'rgba(220, 38, 38, 0.4)' : 'rgba(139, 90, 60, 0.4)'}`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 90, 60, 0.3)';
                }}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>

            {/* Volume Slider */}
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#4a5568' }}>🔉</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: '#e2e8f0',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `linear-gradient(to right, #8b5a3c 0%, #8b5a3c ${volume * 100}%, #e2e8f0 ${volume * 100}%, #e2e8f0 100%)`
                }}
              />
              <span style={{ fontSize: '12px', color: '#4a5568' }}>🔊</span>
            </div>

            {/* Volume percentage */}
            <div style={{ fontSize: '11px', color: '#718096', fontWeight: '500' }}>
              Volume: {Math.round(volume * 100)}%
            </div>
          </div>
        )}

        {/* Toggle Controls Button */}
        <button
          onClick={() => setShowControls(!showControls)}
          style={{
            background: 'linear-gradient(135deg, #8b5a3c 0%, #6b4423 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 4px 14px rgba(139, 90, 60, 0.35)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 90, 60, 0.45)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(139, 90, 60, 0.35)';
          }}
        >
          <span style={{
            position: 'relative',
            zIndex: 1,
            animation: 'musicPulse 2s ease-in-out infinite'
          }}>
            🎵
          </span>
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
            transition: 'left 0.8s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.left = '100%';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.left = '-100%';
          }}
          ></div>
        </button>
      </div>

      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes musicPulse {
            0%, 100% {
              transform: scale(1);
              filter: drop-shadow(0 0 4px rgba(139, 90, 60, 0.3));
            }
            50% {
              transform: scale(1.1);
              filter: drop-shadow(0 0 8px rgba(139, 90, 60, 0.5));
            }
          }

          /* Custom volume slider styling */
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #8b5a3c;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(139, 90, 60, 0.3);
            border: 2px solid white;
          }

          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #8b5a3c;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(139, 90, 60, 0.3);
            border: 2px solid white;
          }
        `}
      </style>
    </>
  );
};

export default JapaneseBackgroundMusic;
