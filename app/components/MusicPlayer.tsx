import React, { useRef, useState } from "react";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio ref={audioRef} src="/audio.MP3" />
      <button onClick={togglePlay}>
        
          <img src="/qr.png" className="w-[200px] " />
        
      </button>
    </div>
  );
};

export default MusicPlayer;
