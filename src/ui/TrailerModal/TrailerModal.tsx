import React, { useState, useEffect, useRef } from 'react';
import "./TrailerModal.scss"

import IconClose from "../../assets/images/icon-delete.svg?react";
import IconPause from "../../assets/images/icon-pause.svg?react";
import IconContinue from "../../assets/images/icon-continue.svg?react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeUrl: string;
  title: string;
}

// 3. Извлечь video ID из YouTube URL
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  youtubeUrl,
  title
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const playerRef = useRef<any>(null);
  const hideControlsTimeoutRef = useRef<number | null>(null);

  const videoId = getYouTubeVideoId(youtubeUrl);

  // Функция для показа контролов с таймером
  const showControlsWithTimer = () => {
    setShowControls(true);

    // Очищаем предыдущий таймер
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    // Устанавливаем новый таймер на 3 секунды
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Обработчик наведения мыши
  const handleMouseEnter = () => {
    if (isPlaying) {
      showControlsWithTimer();
    }
  };

  // Обработчик движения мыши
  const handleMouseMove = () => {
    if (isPlaying) {
      showControlsWithTimer();
    }
  };

  // Обработчик клавиш
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        handleVideoClick();
      } else if (event.code === 'Escape' || event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    // Блокировка прокрутки
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      // Восстанавливаем прокрутку
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen, isPlaying]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  // 2. Использовать YouTube iframe API
  useEffect(() => {
    if (!isOpen || !videoId) return;

    const loadYouTubeAPI = () => {
      if (window.YT) {
        initializePlayer();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);

      window.onYouTubeIframeAPIReady = initializePlayer;
    };

    const initializePlayer = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        width: '960',
        height: '540',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          rel: 0,
          fs: 0, // отключить полный экран
          cc_load_policy: 0, // отключить субтитры
          iv_load_policy: 3, // отключить аннотации
          disablekb: 0, // отключить клавиатуру
          playsinline: 1
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
          }
        }
      });
    };

    loadYouTubeAPI();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [isOpen, videoId]);

  // 5. Обработчик клика на видео для паузы/воспроизведения
  const handleVideoClick = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      setShowControls(false); // Скрываем контролы при паузе
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
      showControlsWithTimer(); // Показываем контролы при воспроизведении
    }
  };

  if (!isOpen) return null;

  return (
    // 1. Компонент TrailerModal
    <div className="trailer-modal">
      <div className="trailer-modal__overlay" onClick={onClose}>
        <div className="trailer-modal__content" onClick={e => e.stopPropagation()}>
          <button className="trailer-modal__close" onClick={onClose}>
            <IconClose className='trailer-modal__close-icon' width={24} height={24} aria-hidden={true} />
          </button>

          <div
            className="trailer-modal__video"
            onClick={handleVideoClick}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 999 }}
          >
            <div
              id="youtube-player"
              style={{ pointerEvents: 'none' }}
            ></div>
          </div>

          {/* Показать название при паузе */}
          {!isPlaying && (
            <>
              <div className="trailer-modal__title trailer-modal__title--show">
                {title}
              </div>
              <button
                className="trailer-modal__control-btn trailer-modal__control-btn--show"
                onClick={handleVideoClick}
              >
                <IconContinue className='trailer-modal__play-icon' width={40} height={40} aria-hidden={true} />
              </button>
            </>
          )}

          {/* Кнопка паузы при воспроизведении */}
          {isPlaying && (
            <>
              <div className={`trailer-modal__title ${showControls ? 'trailer-modal__title--show' : ''}`}>
                {title}
              </div>
              <button
                className={`trailer-modal__control-btn ${showControls ? 'trailer-modal__control-btn--show' : ''}`}
                onClick={handleVideoClick}
              >
                <IconPause className='trailer-modal__play-icon' width={40} height={40} aria-hidden={true} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Добавить типы для YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}