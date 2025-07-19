import React, { useState, useRef, useEffect } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Mostrar contenido después de un breve delay
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = async () => {
    setIsPlaying(true);
    setLogoVisible(true);
    
    // Animación secuencial
    setTimeout(() => setTextVisible(true), 500);
    
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Error al reproducir el audio:', error);
      }
    }
    
    // Completar después de la animación
    setTimeout(() => {
      onComplete();
    }, 3500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      opacity: showContent ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out'
    }}>
      <audio ref={audioRef}>
        <source src="/splash-sound.mp3" type="audio/mpeg" />
      </audio>
      
      {!isPlaying ? (
        <div style={{
          textAlign: 'center',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <div style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '2rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            letterSpacing: '2px'
          }}>
            🎮 Emilio Games Studio
          </div>
          
          <div style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '3rem',
            maxWidth: '500px',
            lineHeight: '1.6'
          }}>
            Sistema de Gestión de Préstamos
          </div>
          
          <button 
            onClick={handleStart}
            style={{
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              fontWeight: '600',
              borderRadius: '50px',
              border: 'none',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)';
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
            }}
          >
            🚀 Ingresar al Sistema
          </button>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          animation: logoVisible ? 'fadeInScale 1s ease-out' : 'none'
        }}>
          <div style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem',
            textShadow: '0 6px 30px rgba(0,0,0,0.4)',
            letterSpacing: '3px',
            animation: textVisible ? 'slideInUp 1s ease-out 0.5s both' : 'none'
          }}>
            🎮 Emilio
          </div>
          
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '300',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '0.5rem',
            animation: textVisible ? 'slideInUp 1s ease-out 0.7s both' : 'none'
          }}>
            Games Studio
          </div>
          
          <div style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '2rem',
            animation: textVisible ? 'fadeIn 1s ease-out 1s both' : 'none'
          }}>
            Cargando sistema...
          </div>
        </div>
      )}
      
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        animation: 'fadeIn 1s ease-out 1.5s both'
      }}>
        <div style={{
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '0.5rem'
        }}>
          Powered by
        </div>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: 'rgba(255,255,255,0.8)'
        }}>
          UNAL
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen; 