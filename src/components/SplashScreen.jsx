import React, { useState, useRef } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleStart = async () => {
    setIsPlaying(true);
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        onComplete(); // Notificar al componente padre que la animación ha comenzado
      } catch (error) {
        console.error('Error al reproducir el audio:', error);
        onComplete(); // Aún notificamos en caso de error de audio
      }
    }
  };

  return (
    <div className={`splash-screen ${isPlaying ? 'playing' : ''}`}>
      <audio ref={audioRef}>
        <source src="/splash-sound.mp3" type="audio/mpeg" />
      </audio>
      {!isPlaying ? (
        <>  
            <button className="start-button" onClick={handleStart}>
            Ingresar
            </button>
            <br />
            <p>Powered by UNAL</p>
        </>
      ) : (
        <div className="logo-container">
          <span className="logo-text">
            <span className="word word1">Emilio</span>
            <span className="word word2">games</span>
            <span className="word word3">studio</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default SplashScreen; 