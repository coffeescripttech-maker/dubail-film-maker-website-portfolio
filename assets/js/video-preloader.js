/**
 * Video Preloader
 * Starts downloading the first video during page load (before intro animation)
 * This ensures the video is ready to play when the intro completes
 */

console.log('🎬 VIDEO-PRELOADER.JS: Script loaded and executing');

(function() {
  'use strict';

  console.log('🎬 VIDEO-PRELOADER.JS: IIFE started');

  const startPreload = () => {
    console.log('🎬 VIDEO-PRELOADER.JS: startPreload() called');
    console.log('🎬 VIDEO-PRELOADER.JS: window.fetchProjects available?', !!window.fetchProjects);
    
    if (!window.fetchProjects) {
      console.warn('⚠️ EARLY PRELOAD: fetchProjects not available yet, retrying in 50ms...');
      setTimeout(startPreload, 50);
      return;
    }

    console.log('🚀 EARLY PRELOAD: Starting projects data fetch...');
    const startTime = performance.now();

    window.__projectsPreloadPromise = window.fetchProjects()
      .then(projects => {
        const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ EARLY PRELOAD: Projects data loaded in ${elapsed}s`);
        console.log(`📦 EARLY PRELOAD: ${projects.length} projects ready`);

        if (projects.length > 0) {
          const firstVideoUrl = projects[0].video_thumbnail_url || projects[0].video_url;
          window.__firstVideoUrl = firstVideoUrl;
          console.log(`🎬 EARLY PRELOAD: First video URL ready: ${firstVideoUrl.substring(0, 60)}...`);

          createVideoElement(firstVideoUrl, startTime);
        }

        return projects;
      })
      .catch(err => {
        console.error('❌ EARLY PRELOAD: Failed to load projects:', err);
        return [];
      });
  };

  const createVideoElement = (videoUrl, startTime) => {
    const videoWrapper = document.getElementById('homepage-main-video-wrapper');
    
    if (!videoWrapper) {
      console.warn('⚠️ EARLY PRELOAD: Video wrapper not found, cannot preload video');
      return;
    }

    console.log('🎥 EARLY PRELOAD: Creating video element to start download...');
    
    const preloadVideo = document.createElement('video');
    preloadVideo.id = 'preload-video';
    preloadVideo.className = 'js-main-video visible loaded'; // CRITICAL: visible and loaded classes for opacity
    preloadVideo.setAttribute('preload', 'auto');
    preloadVideo.setAttribute('muted', '');
    preloadVideo.setAttribute('playsinline', '');
    preloadVideo.muted = true;
    preloadVideo.playsInline = true;
    preloadVideo.src = videoUrl;
    
    // CRITICAL: Prevent black screen during buffering by keeping last frame visible
    // This CSS property keeps the last rendered frame visible when video is waiting/buffering
    preloadVideo.style.objectFit = 'cover';
    preloadVideo.style.backgroundColor = 'transparent';

    // Inject into wrapper to start download
    videoWrapper.innerHTML = '';
    videoWrapper.appendChild(preloadVideo);
    preloadVideo.load();

    // Store reference for later use
    window.__preloadVideo = preloadVideo;
    
    // CRITICAL: Multi-layer pause protection
    // Layer 1: Override the pause() method
    const originalPause = preloadVideo.pause.bind(preloadVideo);
    preloadVideo.pause = function() {
      if (!document.body.classList.contains('intro-ended')) {
        console.log('🚫 PRELOAD VIDEO: Blocked pause() call during intro - ignoring');
        // Don't pause during intro - just return without doing anything
        return Promise.resolve();
      } else {
        console.log('✅ PRELOAD VIDEO: Pause allowed (intro ended)');
        return originalPause();
      }
    };
    
    // Layer 2: Listen for pause events and immediately resume
    preloadVideo.addEventListener('pause', function onPauseDuringIntro() {
      if (!document.body.classList.contains('intro-ended')) {
        console.log('🚫 PRELOAD VIDEO: Pause event detected during intro - resuming immediately');
        // Resume playing immediately using the native play method
        setTimeout(() => {
          if (preloadVideo.paused && preloadVideo.readyState >= 3) {
            HTMLMediaElement.prototype.play.call(preloadVideo)
              .then(() => console.log('✅ PRELOAD VIDEO: Resumed playing after unwanted pause'))
              .catch(err => console.log('⚠️ PRELOAD VIDEO: Could not resume:', err.message));
          }
        }, 10);
      }
    });
    
    // Layer 3: Periodic monitor to ensure video stays playing during intro
    const pauseMonitor = setInterval(() => {
      if (document.body.classList.contains('intro-ended')) {
        clearInterval(pauseMonitor);
        console.log('✅ PRELOAD VIDEO: Intro ended, stopping pause monitor');
        return;
      }
      
      if (preloadVideo.paused && preloadVideo.readyState >= 3) {
        console.log('🔄 PRELOAD VIDEO: Periodic check found video paused - resuming');
        HTMLMediaElement.prototype.play.call(preloadVideo)
          .then(() => console.log('✅ PRELOAD VIDEO: Resumed from periodic monitor'))
          .catch(err => console.log('⚠️ PRELOAD VIDEO: Could not resume from monitor:', err.message));
      }
    }, 500); // Check every 500ms
    
    // Attach event listeners for debugging
    attachVideoEventListeners(preloadVideo);
    
    // Monitor video progress
    monitorVideoProgress(preloadVideo, startTime);
  };

  const attachVideoEventListeners = (video) => {
    video.addEventListener('loadstart', () => {
      console.log('🎬 EARLY PRELOAD EVENT: loadstart');
    });

    video.addEventListener('loadedmetadata', () => {
      console.log('🎬 EARLY PRELOAD EVENT: loadedmetadata - Duration:', video.duration.toFixed(2) + 's');
    });

    video.addEventListener('loadeddata', () => {
      console.log('🎬 EARLY PRELOAD EVENT: loadeddata - readyState:', video.readyState);
    });

    video.addEventListener('canplay', () => {
      console.log('🎬 EARLY PRELOAD EVENT: canplay - Video can start playing');
      // Try to start playing as soon as we can
      if (video.paused && !document.body.classList.contains('intro-ended')) {
        console.log('🚀 EARLY PRELOAD: Attempting to start playback at canplay');
        video.play()
          .then(() => console.log('✅ EARLY PRELOAD: Video playing from canplay event'))
          .catch(err => console.log('⚠️ EARLY PRELOAD: Play prevented at canplay:', err.message));
      }
    });

    video.addEventListener('canplaythrough', () => {
      console.log('🎬 EARLY PRELOAD EVENT: canplaythrough - Video can play without buffering');
      // Try to start playing when we have enough data
      if (video.paused && !document.body.classList.contains('intro-ended')) {
        console.log('🚀 EARLY PRELOAD: Attempting to start playback at canplaythrough');
        video.play()
          .then(() => console.log('✅ EARLY PRELOAD: Video playing from canplaythrough event'))
          .catch(err => console.log('⚠️ EARLY PRELOAD: Play prevented at canplaythrough:', err.message));
      }
    });

    video.addEventListener('play', () => {
      console.log('▶️ EARLY PRELOAD EVENT: play - Video started playing at', new Date().toLocaleTimeString());
      console.log('   Current time:', video.currentTime.toFixed(2) + 's');
      console.log('   Paused:', video.paused);
    });

    video.addEventListener('pause', () => {
      console.log('⏸️ EARLY PRELOAD EVENT: pause - Video paused at', video.currentTime.toFixed(2) + 's');
    });

    video.addEventListener('playing', () => {
      console.log('▶️ EARLY PRELOAD EVENT: playing - Video is now playing');
    });

    video.addEventListener('waiting', () => {
      console.log('⏳ EARLY PRELOAD EVENT: waiting - Video is buffering');
    });

    video.addEventListener('seeking', () => {
      console.log('⏩ EARLY PRELOAD EVENT: seeking - Video seeking to', video.currentTime.toFixed(2) + 's');
    });

    video.addEventListener('seeked', () => {
      console.log('✅ EARLY PRELOAD EVENT: seeked - Seek complete at', video.currentTime.toFixed(2) + 's');
    });

    video.addEventListener('ended', () => {
      console.log('🏁 EARLY PRELOAD EVENT: ended - Video finished playing');
    });

    video.addEventListener('error', () => {
      console.error('❌ EARLY PRELOAD EVENT: error', video.error);
    });
  };

  const monitorVideoProgress = (video, startTime) => {
    const monitorInterval = setInterval(() => {
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      const buffered = video.buffered.length > 0 ? video.buffered.end(0) : 0;
      const duration = video.duration || 0;
      const percent = duration > 0 ? ((buffered / duration) * 100).toFixed(1) : 0;

      if (video.readyState > 0) {
        console.log(
          `📊 EARLY PRELOAD [${elapsed}s]: ` +
          `readyState=${video.readyState}, ` +
          `buffered=${percent}%, ` +
          `paused=${video.paused}, ` +
          `currentTime=${video.currentTime.toFixed(2)}s`
        );
        
        // CRITICAL: If video is paused during intro and has enough data, resume it
        if (video.paused && video.readyState >= 3 && !document.body.classList.contains('intro-ended')) {
          console.log('🔄 EARLY PRELOAD: Video paused during intro - attempting to resume');
          video.play()
            .then(() => console.log('✅ EARLY PRELOAD: Video resumed from monitor'))
            .catch(err => console.log('⚠️ EARLY PRELOAD: Could not resume from monitor:', err.message));
        }
      }

      // Stop monitoring after 15 seconds or when intro ends
      if (elapsed > 15 || document.body.classList.contains('intro-ended')) {
        clearInterval(monitorInterval);
        if (video.readyState >= 3) {
          console.log(`✅ EARLY PRELOAD: Video ready to play! (readyState=${video.readyState})`);
        }
        if (document.body.classList.contains('intro-ended')) {
          console.log('✅ EARLY PRELOAD: Intro ended, stopping monitor');
        }
      }
    }, 1000);
  };

  // Start immediately or wait for DataLoader
  console.log('🎬 VIDEO-PRELOADER.JS: Setting up initialization...');
  console.log('🎬 VIDEO-PRELOADER.JS: document.readyState =', document.readyState);
  
  if (document.readyState === 'loading') {
    console.log('🎬 VIDEO-PRELOADER.JS: Waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', startPreload);
  } else {
    console.log('🎬 VIDEO-PRELOADER.JS: DOM already loaded, starting immediately');
    startPreload();
  }
  
  console.log('🎬 VIDEO-PRELOADER.JS: IIFE completed');
})();
