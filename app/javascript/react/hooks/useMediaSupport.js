// app/javascript/react/hooks/useMediaSupport.js
import { useState, useEffect } from 'react';

/**
 * Hook to detect browser media capabilities
 * @returns {Object} Information about the browser's media support
 */
export const useMediaSupport = () => {
  const [support, setSupport] = useState({
    video: {
      mp4: false,
      webm: false,
      ogg: false,
      hls: false,
      dash: false
    },
    audio: {
      mp3: false,
      wav: false,
      ogg: false,
      aac: false
    },
    image: {
      webp: false,
      avif: false
    }
  });

  useEffect(() => {
    // Check video support
    const videoElement = document.createElement('video');
    setSupport(prevSupport => ({
      ...prevSupport,
      video: {
        mp4: videoElement.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') !== '',
        webm: videoElement.canPlayType('video/webm; codecs="vp8, vorbis"') !== '',
        ogg: videoElement.canPlayType('video/ogg; codecs="theora, vorbis"') !== '',
        hls: videoElement.canPlayType('application/vnd.apple.mpegurl') !== '' ||
              (window.MediaSource && window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')),
        dash: window.MediaSource && window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')
      }
    }));

    // Check audio support
    const audioElement = document.createElement('audio');
    setSupport(prevSupport => ({
      ...prevSupport,
      audio: {
        mp3: audioElement.canPlayType('audio/mpeg;') !== '',
        wav: audioElement.canPlayType('audio/wav; codecs="1"') !== '',
        ogg: audioElement.canPlayType('audio/ogg; codecs="vorbis"') !== '',
        aac: audioElement.canPlayType('audio/aac;') !== ''
      }
    }));

    // Check image support
    const checkWebpSupport = async () => {
      const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
      const webpSupport = await fetch(webpData)
        .then(r => r.blob())
        .then(blob => createImageBitmap(blob))
        .then(() => true)
        .catch(() => false);

      setSupport(prevSupport => ({
        ...prevSupport,
        image: {
          ...prevSupport.image,
          webp: webpSupport
        }
      }));
    };

    const checkAvifSupport = async () => {
      const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      const avifSupport = await fetch(avifData)
        .then(r => r.blob())
        .then(blob => createImageBitmap(blob))
        .then(() => true)
        .catch(() => false);

      setSupport(prevSupport => ({
        ...prevSupport,
        image: {
          ...prevSupport.image,
          avif: avifSupport
        }
      }));
    };

    checkWebpSupport();
    checkAvifSupport();
  }, []);

  return support;
};
