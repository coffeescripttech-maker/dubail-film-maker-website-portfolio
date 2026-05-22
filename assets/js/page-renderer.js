/**
 * Centralized Page Renderer
 * Single source of truth for rendering page content
 * Handles all page-specific rendering logic
 */

(function() {
  'use strict';

  const DEBUG_HOVER = false;

  const PageRenderer = {
    renderIndexProjects,
    renderWorksProjects,
    renderHomepageSlider,
    renderAboutContent,
    renderContactContent,
    renderProjectDetail,
    initializePage
  };

  function renderWorksProjects(projects) {
    console.log('Rendering projects for works page...');
    const worksContainer = document.getElementById('works-list-project');

    if (!worksContainer) {
      console.warn('Works list container not found');
      return;
    }

    worksContainer.innerHTML = '';

    projects.forEach(project => {
      const displayClient = project.client_short || project.client;
      
      const projectHTML = `
      <li class="box box--work" data-cat="${project.classification}">
        <a href="${project.link}" class="box--work__link js-has-cursor-text" onclick="event.preventDefault(); event.stopPropagation(); window.location.href='${project.link}'; return false;">
          <div class="box--work__info">
            <p>${displayClient}</p>
            <h2>${project.title}</h2>
          
            <p>${project.category}</p>
          </div>
          <div class="box--work__video video-wrapper has-poster">
            <img class="video-img-poster lazy-media"
              data-src="${project.poster_image}"
              alt="">
            <video class="js-video lazy-media"
             data-src="${project.video_url}"
              playsinline loop muted></video>
          </div>
          <div class="cursor-text-animated js-cursor-text-animated">
            <div class="mooving-elements is-arrow" data-friction="1">
              <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.72366 3.91174H7.0685L5.14349 3.8482L6.53777 4.99985L8.40882 6.65189L7.19444 7.72412L5.3234 6.07209L4.01007 4.83306L4.07303 6.50892L4.06404 8.02593L2.3819 6.54069L2.39989 2.42649L7.04152 2.42649L8.72366 3.91174Z" fill="white"/>
              </svg>
            </div>
            <div class="mooving-elements shift cursor-main-text" data-friction="5">
              <h2>${project.title}</h2>
              <p>${displayClient}</p>
              <p>${project.category}</p>
            </div>
          </div>
        </a>
      </li>
    `;

      worksContainer.innerHTML += projectHTML;
    });

    // Initialize LazyLoad for dynamically added elements (matching index.html pattern)
    setTimeout(() => {
      const lazyElements = worksContainer.querySelectorAll('.lazy-media');
      console.log(`Found ${lazyElements.length} lazy elements to initialize on works page`);
      
      if (typeof LazyLoad !== 'undefined') {
        // Create new LazyLoad instance for dynamic content
        const worksLazyLoad = new LazyLoad({
          elements_selector: '#works-list-project .lazy-media',
          threshold: 0,
          callback_loaded: (el) => {
            el.classList.add('loaded');
            console.log('✓ Lazy loaded:', el.tagName);
          }
        });
        console.log('✓ LazyLoad initialized for', projects.length, 'projects on works page');
      } else {
        console.warn('LazyLoad not available, loading all media immediately');
        // Fallback: convert data-src to src immediately
        lazyElements.forEach(el => {
          if (el.dataset.src) {
            el.src = el.dataset.src;
            el.classList.add('loaded');
          }
        });
      }
      
      // Add 'ready' class to fade in the listing
      const blocListing = document.querySelector('.bloc-projects-listing');
      if (blocListing) {
        blocListing.classList.add('ready');
        console.log('✓ Added ready class to bloc-projects-listing on works page');
      }
      
      // Dispatch event to trigger hover re-initialization
      setTimeout(() => {
        const event = new Event('projects-rendered');
        window.dispatchEvent(event);
        console.log('✓ Dispatched projects-rendered event for works page');
      }, 200);
    }, 100);
  }

  function renderIndexProjects(projects) {
    console.log('Rendering projects for index page...');
    const worksContainer = document.getElementById('works');

    if (!worksContainer) {
      console.warn('Works container not found');
      return;
    }

    // Check if we have initial projects already loaded
    const initialCount = parseInt(worksContainer.getAttribute('data-initial-count') || '0');
    
    if (initialCount > 0) {
      console.log(`✓ Found ${initialCount} initial projects, updating them with fresh data and loading remaining ${projects.length - initialCount} projects...`);
      
      // Remove initial-count attribute so we don't do this again
      worksContainer.removeAttribute('data-initial-count');
      
      // First, update the initial projects with fresh data
      const initialProjects = worksContainer.querySelectorAll('.initial-project');
      projects.slice(0, initialCount).forEach((project, index) => {
        if (initialProjects[index]) {
          // Update the existing project with fresh data
          const link = initialProjects[index].querySelector('.box--work__link');
          if (link) {
            link.setAttribute('onclick', `window.location.replace('${project.link}'); return false;`);
          }
          
          const video = initialProjects[index].querySelector('video.js-video');
          if (video && project.video_url) {
            video.src = project.video_url;
            video.load();
          }
          
          const img = initialProjects[index].querySelector('.video-img-poster');
          if (img && project.poster_image) {
            img.src = project.poster_image;
            if (project.poster_image_srcset) {
              img.srcset = project.poster_image_srcset;
            }
          }
          
          // Remove the initial-project class
          initialProjects[index].classList.remove('initial-project');
          
          // Update data-cat attribute
          initialProjects[index].setAttribute('data-cat', project.classification);
        }
      });
      
      // Then append the remaining projects
      projects.slice(initialCount).forEach(project => {
      const displayClient = project.client_short || project.client;
      
      const projectHTML = `
      <li class="box box--work" data-cat="${project.classification}">
        <a href="${project.link}" class="box--work__link js-has-cursor-text">
          <div class="box--work__info">
             <p>${displayClient}</p>
            <h2>${project.title}</h2>
         
            <p>${project.category}</p>
          </div>
          <div class="box--work__video video-wrapper has-poster">
            <img class="video-img-poster lazy-media loaded"
              src="${project.poster_image}"
              alt="">
            <video class="js-video lazy-media loaded"
             src="${project.video_url}"
              playsinline loop muted></video>
          </div>
          <div class="cursor-text-animated js-cursor-text-animated">
            <div class="mooving-elements is-arrow" data-friction="1">
              <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.72366 3.91174H7.0685L5.14349 3.8482L6.53777 4.99985L8.40882 6.65189L7.19444 7.72412L5.3234 6.07209L4.01007 4.83306L4.07303 6.50892L4.06404 8.02593L2.3819 6.54069L2.39989 2.42649L7.04152 2.42649L8.72366 3.91174Z" fill="white"/>
              </svg>
            </div>
            <div class="mooving-elements shift cursor-main-text" data-friction="5">
              <h2>${project.title}</h2>
              <p>${displayClient}</p>
              <p>${project.category}</p>
            </div>
          </div>
        </a>
      </li>
    `;

        worksContainer.innerHTML += projectHTML;
      });
    } else {
      // No initial projects, render all from scratch
      console.log('No initial projects found, rendering all projects...');
      worksContainer.innerHTML = '';
      
      projects.forEach(project => {
        const displayClient = project.client_short || project.client;
        
        const projectHTML = `
      <li class="box box--work" data-cat="${project.classification}">
        <a href="${project.link}" class="box--work__link js-has-cursor-text">
          <div class="box--work__info">
                <p>${displayClient}</p>
            <h2>${project.title}</h2>
      
            <p>${project.category}</p>
          </div>
          <div class="box--work__video video-wrapper has-poster">
            <img class="video-img-poster lazy-media loaded"
              src="${project.poster_image}"
              alt="">
            <video class="js-video lazy-media loaded"
             src="${project.video_url}"
              playsinline loop muted></video>
          </div>
          <div class="cursor-text-animated js-cursor-text-animated">
            <div class="mooving-elements is-arrow" data-friction="1">
              <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.72366 3.91174H7.0685L5.14349 3.8482L6.53777 4.99985L8.40882 6.65189L7.19444 7.72412L5.3234 6.07209L4.01007 4.83306L4.07303 6.50892L4.06404 8.02593L2.3819 6.54069L2.39989 2.42649L7.04152 2.42649L8.72366 3.91174Z" fill="white"/>
              </svg>
            </div>
            <div class="mooving-elements shift cursor-main-text" data-friction="5">
              <h2>${project.title}</h2>
              <p>${displayClient}</p>
              <p>${project.category}</p>
            </div>
          </div>
        </a>
      </li>
    `;
        worksContainer.innerHTML += projectHTML;
      });
    }

    setTimeout(() => {
      if (typeof LazyLoad !== 'undefined' && window.lazyLoadInstance) {
        window.lazyLoadInstance.update();
      }
      
      const videos = worksContainer.querySelectorAll('video.js-video');
      videos.forEach(video => {
        if (video.src && video.readyState < 2) {
          video.load();
        }
      });
      console.log('✓ Initialized', videos.length, 'project videos for hover playback');
      
      // Dispatch event to trigger custom hover initialization
      setTimeout(() => {
        const event = new Event('projects-rendered');
        window.dispatchEvent(event);
      }, 200);
    }, 100);
  }

  function renderHomepageSlider(projects) {
    console.log('Rendering homepage slider...');
    const sliderContainer = document.getElementById('homepage-slider');
    
    if (!sliderContainer) {
      console.log('Homepage slider container not found');
      return;
    }

    // Use up to 6 projects for slider with pagination
    const sliderProjects = projects.slice(0, 6);
    console.log(`Using ${sliderProjects.length} projects for slider (from ${projects.length} total)`);

    // CRITICAL: Inject first video into wrapper IMMEDIATELY so it loads during intro animation
    if (sliderProjects.length > 0) {
      const videoWrapper = document.getElementById('homepage-main-video-wrapper');
      if (videoWrapper) {
        // Check if preload video already exists from early preload script
        const preloadVideo = window.__preloadVideo || document.getElementById('preload-video');
        const firstVideoUrl = window.__firstVideoUrl || sliderProjects[0].video_thumbnail_url || sliderProjects[0].video_url;
        
        if (preloadVideo && preloadVideo.src && preloadVideo.src.includes(firstVideoUrl.split('/').pop())) {
          console.log('✅ VIDEO PRELOAD: Using existing preloaded video element at', new Date().toLocaleTimeString());
          console.log('📊 VIDEO PRELOAD: Current readyState:', preloadVideo.readyState, getReadyStateText(preloadVideo.readyState));
          console.log('📊 VIDEO PRELOAD: Current networkState:', preloadVideo.networkState, getNetworkStateText(preloadVideo.networkState));
          console.log('📊 VIDEO PRELOAD: Current time:', preloadVideo.currentTime.toFixed(2) + 's');
          console.log('📊 VIDEO PRELOAD: Paused:', preloadVideo.paused);
          
          const buffered = preloadVideo.buffered.length > 0 ? preloadVideo.buffered.end(0) : 0;
          const duration = preloadVideo.duration || 0;
          const percent = duration > 0 ? ((buffered / duration) * 100).toFixed(1) : 0;
          console.log('📊 VIDEO PRELOAD: Buffered:', percent + '%');
          
          // Set autoplay on existing video
          preloadVideo.setAttribute('autoplay', '');
          preloadVideo.autoplay = true;
          
          // Check video state and handle accordingly
          if (preloadVideo.readyState >= 3) {
            if (preloadVideo.paused) {
              console.log('🚀 VIDEO PRELOAD: Video ready but paused, calling play() at', new Date().toLocaleTimeString());
              preloadVideo.play()
                .then(() => {
                  console.log('✅ VIDEO PRELOAD: play() promise resolved - video playing at', new Date().toLocaleTimeString());
                  console.log('   Current time:', preloadVideo.currentTime.toFixed(2) + 's');
                  console.log('   Paused:', preloadVideo.paused);
                })
                .catch(err => console.log('❌ VIDEO PRELOAD: Auto-play prevented:', err.message));
            } else {
              console.log('✅ VIDEO PRELOAD: Video already playing! No need to call play()');
              console.log('   Current time:', preloadVideo.currentTime.toFixed(2) + 's');
            }
          } else {
            console.log('⏳ VIDEO PRELOAD: Video not ready yet (readyState=' + preloadVideo.readyState + '), will auto-play when ready');
          }
        } else {
          // Preload video not found or different URL, create new one
          console.log('⚠️ VIDEO PRELOAD: Preload video not found, creating new element');
          const startTime = performance.now();
          
          console.log('🚀 ========== VIDEO PRELOAD STARTED ==========');
          console.log('📹 Video URL:', firstVideoUrl);
          console.log('⏱️  Start time:', new Date().toLocaleTimeString());
          console.log('🎯 Using preloaded URL:', !!window.__firstVideoUrl);
          
          // Create video element directly (not via innerHTML)
          const video = document.createElement('video');
          video.className = 'js-main-video visible loaded';
          video.setAttribute('preload', 'auto');
          video.setAttribute('muted', '');
          video.setAttribute('playsinline', '');
          video.muted = true; // Ensure muted for autoplay
          video.playsInline = true;
          
          // Clear wrapper and add video
          videoWrapper.innerHTML = '';
          videoWrapper.appendChild(video);
          
          // CRITICAL: Set src AFTER appending to DOM
          video.src = firstVideoUrl;
          
          console.log('📊 Initial readyState:', video.readyState, getReadyStateText(video.readyState));
          console.log('📊 Video element:', video);
          console.log('📊 Video src set:', video.src);
          console.log('📊 Video in DOM:', document.body.contains(video));
          console.log('📊 Video wrapper visible:', videoWrapper.offsetParent !== null);
          
          // Force load
          try {
            video.load();
            console.log('✅ video.load() called successfully');
          } catch (e) {
            console.error('❌ video.load() failed:', e);
          }
          
          // CRITICAL: Set autoplay AFTER load() to prevent it from being reset
          video.setAttribute('autoplay', '');
          video.autoplay = true;
          console.log('✅ Autoplay set after load():', video.autoplay);
          
          // Check currentSrc after a moment
          setTimeout(() => {
            console.log('📊 Video currentSrc (after 100ms):', video.currentSrc);
            console.log('📊 Video networkState:', video.networkState, getNetworkStateText(video.networkState));
          }, 100);
          
          // Add error handler
          video.addEventListener('error', (e) => {
            console.error('❌ Video loading error:', {
              error: video.error,
            code: video.error?.code,
            message: video.error?.message,
            src: video.src,
            networkState: video.networkState
          });
        });
        
        // Periodic status check
        const statusInterval = setInterval(() => {
          const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
          const buffered = video.buffered.length > 0 ? video.buffered.end(0) : 0;
          const duration = video.duration || 0;
          const percent = duration > 0 ? ((buffered / duration) * 100).toFixed(1) : 0;
          const networkState = video.networkState;
          
          console.log(`⏳ [${elapsed}s] readyState=${video.readyState} (${getReadyStateText(video.readyState)}), networkState=${networkState} (${getNetworkStateText(networkState)}), buffered=${percent}%, paused=${video.paused}`);
          
          // Stop checking after 10 seconds or when playing
          if (elapsed > 10 || !video.paused) {
            clearInterval(statusInterval);
            if (!video.paused) {
              console.log('✅ Video is playing, stopping status checks');
            } else {
              console.log('⚠️ Video still not playing after 10s');
              console.log('🔍 Debug info:', {
                src: video.src,
                currentSrc: video.currentSrc,
                readyState: video.readyState,
                networkState: video.networkState,
                error: video.error,
                paused: video.paused,
                muted: video.muted,
                autoplay: video.autoplay,
                preload: video.preload
              });
            }
          }
        }, 500);
        
        // Track loading progress
        const logProgress = () => {
          const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
          const buffered = video.buffered.length > 0 ? video.buffered.end(0) : 0;
          const duration = video.duration || 0;
          const percent = duration > 0 ? ((buffered / duration) * 100).toFixed(1) : 0;
          console.log(`� [${elapsed}s] Progress: ${percent}% buffered (${buffered.toFixed(1)}s / ${duration.toFixed(1)}s) - readyState: ${video.readyState}`);
          
          // Try to play as soon as we reach readyState 3 during download
          if (video.readyState >= 3 && video.paused) {
            console.log(`🎯 ReadyState 3 reached during download! Attempting instant playback...`);
            tryPlay('progress-readystate-3');
          }
        };
        
        video.addEventListener('progress', logProgress);
        
        // Play as soon as we have enough data (readyState >= 3)
        const tryPlay = (eventName) => {
          const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
          const buffered = video.buffered.length > 0 ? video.buffered.end(0) : 0;
          const duration = video.duration || 0;
          const percent = duration > 0 ? ((buffered / duration) * 100).toFixed(1) : 0;
          
          console.log(`🎬 [${elapsed}s] Event: ${eventName}`);
          console.log(`   readyState: ${video.readyState} (${getReadyStateText(video.readyState)})`);
          console.log(`   Buffered: ${percent}% (${buffered.toFixed(1)}s / ${duration.toFixed(1)}s)`);
          
          // Play at readyState 3 (HAVE_FUTURE_DATA) for instant playback
          if (video.readyState >= 3 && video.paused) {
            console.log(`🚀 Attempting playback at readyState ${video.readyState}...`);
            video.play()
              .then(() => {
                console.log('✅ ========== VIDEO PLAYING ==========');
                console.log(`   Started after ${elapsed}s`);
                console.log(`   readyState: ${video.readyState} (${getReadyStateText(video.readyState)})`);
                console.log(`   Playing with ${percent}% buffered (instant playback mode)`);
                console.log('============================================');
                video.removeEventListener('progress', logProgress);
                clearInterval(statusInterval);
              })
              .catch(err => {
                console.log('❌ Auto-play prevented:', err.message, err);
              });
          } else if (video.readyState < 3) {
            console.log(`⏸️ Not ready yet (readyState ${video.readyState}), waiting for more data...`);
          }
        };
        
        // Try multiple events for maximum compatibility
        video.addEventListener('loadstart', () => console.log('🎬 Event: loadstart'), { once: true });
        video.addEventListener('loadedmetadata', () => tryPlay('loadedmetadata'), { once: true });
        video.addEventListener('loadeddata', () => tryPlay('loadeddata'), { once: true });
        video.addEventListener('canplay', () => tryPlay('canplay'), { once: true });
        video.addEventListener('canplaythrough', () => tryPlay('canplaythrough'), { once: true });
        
        // Also try immediately in case video is already cached
        setTimeout(() => {
          if (video.readyState >= 3) {
            console.log('⚡ Video already cached!');
            tryPlay('immediate-cached');
          } else if (video.readyState === 0 && video.networkState === 2) {
            console.log('⚠️ Video stuck at readyState 0, trying to reload...');
            video.load();
          }
        }, 100);
        }
      }
    }
    
    // Helper function to get readable readyState text
    function getReadyStateText(state) {
      const states = {
        0: 'HAVE_NOTHING',
        1: 'HAVE_METADATA',
        2: 'HAVE_CURRENT_DATA',
        3: 'HAVE_FUTURE_DATA',
        4: 'HAVE_ENOUGH_DATA'
      };
      return states[state] || 'UNKNOWN';
    }
    
    // Helper function to get readable networkState text
    function getNetworkStateText(state) {
      const states = {
        0: 'NETWORK_EMPTY',
        1: 'NETWORK_IDLE',
        2: 'NETWORK_LOADING',
        3: 'NETWORK_NO_SOURCE'
      };
      return states[state] || 'UNKNOWN';
    }

    // Fade in effect for smooth loading
    sliderContainer.style.opacity = '0';
    sliderContainer.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      renderSliderContent(sliderContainer, sliderProjects);
      updateMainVideoSection(sliderProjects);
      updateSliderCounter(sliderProjects.length);
      
      // Fade in after content is rendered
      sliderContainer.style.opacity = '1';
      
      console.log('✓ Homepage slider loaded and faded in');
    }, 100);
  }
  
  function updateSliderCounter(total) {
    const sliderTotal = document.getElementById('slider-total');
    if (sliderTotal) {
      sliderTotal.textContent = total;
    }
  }
  
  function updateMainVideoSection(projects) {
    if (!projects || projects.length === 0) return;
    
    const firstProject = projects[0];
    const videoWrapper = document.getElementById('homepage-main-video-wrapper');
    const mainLink = document.getElementById('homepage-main-link');
    const mobileLink = document.getElementById('homepage-mobile-link');
    
    console.log('Updating main video section with:', firstProject);
    
    if (videoWrapper) {
      // Check if first video is already loaded (from early injection in renderHomepageSlider)
      const existingFirstVideo = videoWrapper.querySelector('video.js-main-video');
      const firstVideoUrl = projects[0].video_thumbnail_url || projects[0].video_url;
      
      if (existingFirstVideo && existingFirstVideo.src.includes(firstVideoUrl.split('/').pop())) {
        console.log('✓ First video already loaded, adding remaining videos');
        
        // First video already exists, just add the rest
        let additionalVideosHTML = '';
        projects.slice(1).forEach((project) => {
          additionalVideosHTML += `
            <video
              class="js-main-video"
              data-src="${project.video_thumbnail_url || project.video_url}"
              muted
              playsinline
            ></video>
          `;
        });
        
        // Append additional videos
        videoWrapper.innerHTML += additionalVideosHTML;
        
        // Load additional videos
        const additionalVideos = videoWrapper.querySelectorAll('video[data-src]');
        additionalVideos.forEach((video) => {
          if (video.dataset.src && !video.src) {
            video.src = video.dataset.src;
            setTimeout(() => video.load(), 100);
          }
        });
        
        console.log('✓ Loaded', additionalVideos.length, 'additional main videos');
      } else {
        // First video not found or different, render all videos
        console.log('⚠ First video not pre-loaded, rendering all videos');
        let videosHTML = '';
        projects.forEach((project, index) => {
          const preloadAttr = index === 0 ? 'preload="auto"' : '';
          videosHTML += `
            <video
              class="js-main-video"
              data-src="${project.video_thumbnail_url || project.video_url}"
              ${preloadAttr}
              muted
              playsinline
            ></video>
          `;
        });
        videoWrapper.innerHTML = videosHTML;
        
        // Load and initialize videos immediately (no delay)
        const videos = videoWrapper.querySelectorAll('video[data-src]');
        videos.forEach((video, index) => {
          if (video.dataset.src && !video.src) {
            video.src = video.dataset.src;
            
            // Make first video visible and start loading immediately
            if (index === 0) {
              video.classList.add('visible', 'loaded');
              video.load(); // Start loading immediately
              
              // Try to play as soon as we have enough data
              video.addEventListener('canplay', function() {
                if (this.paused) {
                  this.play().catch(err => console.log('Auto-play prevented:', err));
                  console.log('✓ First video visible and auto-playing');
                }
              }, { once: true });
              
              // Fallback: also listen for loadeddata
              video.addEventListener('loadeddata', function() {
                if (this.paused) {
                  this.play().catch(err => console.log('Auto-play prevented:', err));
                }
              }, { once: true });
            } else {
              // Load other videos with slight delay to prioritize first video
              setTimeout(() => video.load(), 100);
            }
          }
        });
        console.log('✓ Loaded', videos.length, 'main videos');
      }
      
      // Update links and enable interaction
      const itemTitle = firstProject.title || 'Project';
      const itemLink = firstProject.link || '#';
      
      if (mainLink) {
        mainLink.href = itemLink;
        mainLink.setAttribute('onclick', `window.location.replace('${itemLink}'); return false;`);
        mainLink.setAttribute('data-cursor-text', `Open ${itemTitle}`);
        mainLink.style.pointerEvents = 'auto';
        mainLink.style.opacity = '1';
      }
      
      if (mobileLink) {
        mobileLink.href = itemLink;
        mobileLink.setAttribute('onclick', `window.location.replace('${itemLink}'); return false;`);
        mobileLink.style.pointerEvents = 'auto';
        mobileLink.style.opacity = '1';
      }
      
      // Update cursor text
      const cursorText = mainLink?.querySelector('.cursor-main-text');
      if (cursorText) {
        cursorText.textContent = `open ${itemTitle}`;
      }
      
      console.log('✓ Main video section updated and enabled');
    }
  }

  function renderSliderContent(container, projects) {
    let cursorPlayerHTML = `
      <div class="cursor-player-animated js-cursor-player-animated">
        <div class="mooving-elements players-wrapper is-player" data-friction="7">
    `;
    
    projects.forEach(project => {
      cursorPlayerHTML += `
          <video
            class="js-video player-animated-player"
            data-src="${project.video_url}"
            playsinline=""
            loop=""
            muted=""
          ></video>
      `;
    });
    
    cursorPlayerHTML += `
        </div>
      </div>
    `;

    let listItemsHTML = '';
    projects.forEach((project, index) => {
      const displayClient = project.client_short || project.client;
      listItemsHTML += `
        <li class="${index === 0 ? 'is-active' : ''}" data-project-index="${index}">
          <a href="${project.link}" class="js-change-video">
           
              <p>${displayClient}</p>
          <h2>${project.title}</h2>
           <p>${project.classification}</p>
          </a>
        </li>
      `;
    });

    container.innerHTML = cursorPlayerHTML + listItemsHTML;
    
    console.log('Homepage slider rendered with', projects.length, 'projects');
    
    setTimeout(() => {
      if (typeof LazyLoad !== 'undefined' && window.lazyLoadInstance) {
        window.lazyLoadInstance.update();
        console.log('✓ Lazy loading updated for homepage slider');
      }
      
      const videos = container.querySelectorAll('video[data-src]');
      videos.forEach((video, index) => {
        if (video.dataset.src && !video.src) {
          const videoUrl = video.dataset.src;
          
          // Check if it's a valid MP4 URL (not HLS .m3u8)
          if (videoUrl.includes('.m3u8')) {
            console.warn(`⚠ Cursor player video ${index + 1} is HLS stream (.m3u8), skipping:`, videoUrl);
            // Try to convert to MP4 if it's a Vimeo URL
            if (videoUrl.includes('vimeo')) {
              console.log('Note: This project uses HLS streaming. Cursor player needs direct MP4 URLs.');
            }
          } else {
            video.src = videoUrl;
            video.load();
            console.log(`✓ Loaded cursor player video ${index + 1}:`, videoUrl.substring(0, 50) + '...');
          }
        }
      });
      console.log('✓ Loaded', videos.length, 'cursor player videos');
      
      if (typeof initCursorPlayer === 'function') {
        initCursorPlayer();
      }
      
      // Dispatch event to trigger cursor player re-initialization
      setTimeout(() => {
        const event = new Event('slider-rendered');
        window.dispatchEvent(event);
        console.log('✓ Dispatched slider-rendered event');
      }, 200);
    }, 100);
  }

  function renderAboutContent(pageData) {
    console.log('Rendering about page content (magazine layout)...');
    const aboutBox = document.querySelector('.about-content');
    const aboutButton = document.querySelector('.btn-reel, .player-link');
    let aboutImagesList = document.querySelector('.list--about-images');
    const videoElement = document.querySelector('.js-popin-video video');

    if (!aboutBox) {
      console.error('About content container not found');
      return;
    }

    let contentHTML = '';
    
    // ROW 1: Header (Full width)
    if (pageData.founder) {
      contentHTML += `
        <div class="about-header">
          <h2>${pageData.founder.name}</h2>
          <h3>${pageData.founder.title}</h3>
        </div>
      `;
      
      // ROW 2: 4-column grid
      if (pageData.founder.bio) {
        const bioParagraphs = pageData.founder.bio.split('<br /><br />').filter(p => p.trim());
        const companyParagraphs = pageData.content ? pageData.content.main_text.split('<br /><br />').filter(p => p.trim()) : [];
        
        contentHTML += `<div class="about-row-2">`;
        
        // Column 1: Intro
        contentHTML += `
          <div class="col-intro">

            <p>${bioParagraphs[0] || ''}</p>
          </div>
        `;
        
        // Column 2: Biography
        contentHTML += `
          <div class="col-biography">
        
            <p>${bioParagraphs[1] || ''}</p>
          </div>
        `;
        
        // Column 3: Achievements
        contentHTML += `
          <div class="col-achievements">
          
            <p>${bioParagraphs[2] || ''}</p>
          </div>
        `;
        
        // Column 4: Company Info
        contentHTML += `
          <div class="col-company">
       
            <p>${companyParagraphs[0] || ''}</p>
          </div>
        `;
        
        contentHTML += `</div>`; // Close row-2
        
        // ROW 3: Image + Remaining content (2 columns)
        contentHTML += `<div class="about-row-3">`;
        
        // Large image (left column)
        contentHTML += `<div class="col-large-image" id="about-large-image"></div>`;
        
        // Right column wrapper with 2 sub-columns
        contentHTML += `<div class="col-remaining-content">`;
        
        // Remaining bio paragraphs (3, 4, 5...) - right column, left sub-column
        contentHTML += `<div class="col-remaining-bio">`;
        bioParagraphs.slice(3).forEach(para => {
          contentHTML += `<p>${para}</p>`;
        });
        contentHTML += `</div>`; // Close col-remaining-bio
        
        // Remaining company paragraphs (1, 2, 3...) - right column, right sub-column
        contentHTML += `<div class="col-remaining-company">`;
        companyParagraphs.slice(1).forEach(para => {
          contentHTML += `<p>${para}</p>`;
        });
        contentHTML += `</div>`; // Close col-remaining-company
        
        contentHTML += `</div>`; // Close col-remaining-content
        
        contentHTML += `</div>`; // Close row-3
      }
    }

    if (aboutBox) {
      aboutBox.innerHTML = contentHTML;
      
      // Add large image after rendering
      if (pageData.images && pageData.images.length > 0) {
        const largeImageContainer = document.getElementById('about-large-image');
        if (largeImageContainer) {
          largeImageContainer.innerHTML = `<img src="${pageData.images[0].url}" alt="${pageData.images[0].alt || 'Featured'}" />`;
        }
      }
    }

    if (aboutButton && pageData.content && pageData.content.video_button) {
      aboutButton.innerHTML = `<span class="cta-text">view DubaiFilmMaker reel 2026</span><svg class="cta-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
      
      if (!aboutButton.classList.contains('btn-reel')) {
        aboutButton.classList.add('btn-reel');
      }
    }

    if (videoElement && pageData.content && pageData.content.video_button && pageData.content.video_button.video_url) {
      videoElement.src = pageData.content.video_button.video_url;
    }

    // ROW 4: Render thumbnails (remaining images)
    if (aboutImagesList && pageData.images && pageData.images.length > 1) {
      let imagesHTML = '';
      // Skip first image (used as large image), show remaining as thumbnails
      pageData.images.slice(1).forEach(image => {
        imagesHTML += `
          <div class="about-image-item">
            <img class="pic" src="${image.url}" alt="${image.alt || ''}" />
          </div>
        `;
      });
      aboutImagesList.innerHTML = imagesHTML;
    }
    
    // Ensure wrapper structure
    const aboutInnerWrapper = document.querySelector('.about-inner-wrapper');
    let imagesButtonWrapper = document.querySelector('.images-button-wrapper');
    
    if (!imagesButtonWrapper && aboutInnerWrapper) {
      aboutImagesList = document.querySelector('.list--about-images');
      const aboutButton = document.querySelector('.player-link');
      
      if (aboutImagesList && aboutButton) {
        const wrapper = document.createElement('div');
        wrapper.className = 'images-button-wrapper';
        aboutImagesList.parentNode.insertBefore(wrapper, aboutImagesList);
        wrapper.appendChild(aboutImagesList);
        wrapper.appendChild(aboutButton);
      }
    }
  }

  function renderContactContent(pageData) {
    console.log('Rendering contact page content...');
    console.log('Contact page data:', pageData);
    
    const staffList = document.querySelector('.list--staff');
    const addressBox = document.querySelector('.box--address');

    console.log('Contact elements found:', {
      staffList: !!staffList,
      addressBox: !!addressBox,
      hasStaffData: !!(pageData && pageData.staff),
      hasAddressData: !!(pageData && pageData.address)
    });

    if (staffList && pageData.staff) {
      staffList.innerHTML = '';

      pageData.staff.forEach(department => {
        const departmentHTML = `
    <li>
      <h2>${department.title}</h2>
      <ul class="list list--members">
        ${department.members
          .map(
            member => `
          <li>
            ${member.name}<br/>
            <a class="lnk lnk--through" href="mailto:${member.email}">${member.email}</a>
          </li>
        `
          )
          .join('')}
      </ul>
    </li>
  `;
        staffList.innerHTML += departmentHTML;
      });
      
      console.log('✓ Staff list rendered with', pageData.staff.length, 'departments');
    } else {
      console.warn('⚠ Could not render staff list:', {
        staffList: !!staffList,
        hasStaffData: !!(pageData && pageData.staff)
      });
    }

    if (addressBox && pageData.address) {
      let addressHTML = `
  <p class="contact-city">${pageData.address.city}</p>
  <p class="contact-info">
    <span class="contact-line">T:<a class="lnk lnk--through" href="tel:${pageData.address.phone}">${pageData.address.phone}</a></span><br/>
    <span class="contact-line">E:<a class="lnk lnk--through" href="mailto:${pageData.address.email}">${pageData.address.email.toUpperCase()}</a></span>
  </p>
`;
      
      if (pageData.social) {
        addressHTML += '<p class="contact-social">';
        if (pageData.social.vimeo) {
          addressHTML += `<span class="contact-line">Vimeo:<a class="lnk lnk--through" href="${pageData.social.vimeo}" target="_blank" rel="noopener">DUBAIFILMMAKER</a></span><br/>`;
        }
        if (pageData.social.instagram) {
          addressHTML += `<span class="contact-line">Instagram:<a class="lnk lnk--through" href="${pageData.social.instagram}" target="_blank" rel="noopener">@DUBAIFILMMAKER</a></span>`;
        }
        addressHTML += '</p>';
      }
      
      addressBox.innerHTML = addressHTML;
      console.log('✓ Address box rendered');
    } else {
      console.warn('⚠ Could not render address box:', {
        addressBox: !!addressBox,
        hasAddressData: !!(pageData && pageData.address)
      });
    }
    
    console.log('✓ Contact content rendering complete');
  }

  function renderProjectDetail(project) {
    console.log('Rendering project detail:', project.title);
    
    const displayClient = project.client_short || project.client;
    
    document.getElementById('page-title').textContent = `DubaiFilmMaker – ${project.title}`;
    document.getElementById('page-description').setAttribute('content', `${project.title} - ${displayClient}`);
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-client').textContent = displayClient;

    const videoElement = document.getElementById('project-video');
    
    // Check if Arabic version exists
    const hasArabicVersion = !!(project.video_url_full_arabic);
    console.log('Arabic version available:', hasArabicVersion);
    
    // Show/hide language toggle
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
      if (hasArabicVersion) {
        languageToggle.style.display = 'flex';
        setupLanguageToggle(project, videoElement);
        console.log('✓ Language toggle enabled');
      } else {
        languageToggle.style.display = 'none';
      }
    }
    
    // Use full video for project detail page (complete experience)
    // Falls back to video_url if video_url_full doesn't exist (backward compatibility)
    const fullVideo = project.video_url_full || project.video_url;
    videoElement.src = fullVideo;
    
    // Ensure autoplay attributes are set (belt and suspenders approach)
    videoElement.setAttribute('autoplay', '');
    videoElement.setAttribute('muted', '');
    videoElement.setAttribute('loop', '');
    videoElement.setAttribute('playsinline', '');
    videoElement.muted = true; // Ensure muted for autoplay policy compliance
    
    // Attempt to play (in case autoplay doesn't trigger)
    videoElement.load();
    videoElement.play().catch(err => {
      console.log('Autoplay prevented by browser:', err.message);
      console.log('User interaction may be required to start playback');
    });
    
    console.log('✓ Project detail video:', fullVideo);
    console.log('✓ Autoplay enabled (muted, loop, playsinline)');

    if (project.credits && project.credits.length > 0) {
      const creditsList = document.getElementById('credits-list');
      creditsList.innerHTML = '';
      
      project.credits.forEach(credit => {
        const dt = document.createElement('dt');
        dt.textContent = credit.role;
        const dd = document.createElement('dd');
        dd.textContent = credit.name;
        creditsList.appendChild(dt);
        creditsList.appendChild(dd);
      });
    } else {
      const creditsLink = document.querySelector('.lnk--credits');
      if (creditsLink) creditsLink.style.display = 'none';
    }
  }

  function setupLanguageToggle(project, videoElement) {
    let currentLanguage = 'en';
    
    const buttons = document.querySelectorAll('.btn-language');
    
    buttons.forEach(btn => {
      // Remove any existing listeners by cloning
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', function() {
        const lang = this.dataset.lang;
        
        if (lang === currentLanguage) {
          console.log('Already on', lang, 'version');
          return;
        }
        
        console.log('Switching language from', currentLanguage, 'to', lang);
        
        // Save current playback state
        const currentTime = videoElement.currentTime;
        const wasPaused = videoElement.paused;
        
        // Update button states
        document.querySelectorAll('.btn-language').forEach(b => {
          b.classList.toggle('active', b.dataset.lang === lang);
        });
        
        // Switch video source
        let newVideoUrl;
        if (lang === 'ar') {
          newVideoUrl = project.video_url_full_arabic;
        } else {
          newVideoUrl = project.video_url_full || project.video_url;
        }
        
        console.log('Loading video:', newVideoUrl);
        
        // Update video source
        videoElement.src = newVideoUrl;
        
        // Restore playback state when video is ready
        videoElement.addEventListener('loadedmetadata', function onLoaded() {
          // Try to restore time position (if within new video duration)
          if (currentTime > 0 && currentTime < videoElement.duration) {
            videoElement.currentTime = currentTime;
            console.log('Restored playback position:', currentTime.toFixed(2) + 's');
          }
          
          // Resume playback if it was playing
          if (!wasPaused) {
            videoElement.play().catch(err => {
              console.log('Autoplay prevented after language switch:', err.message);
            });
          }
          
          videoElement.removeEventListener('loadedmetadata', onLoaded);
        });
        
        currentLanguage = lang;
        console.log('✓ Language switched to', lang);
      });
    });
    
    console.log('✓ Language toggle listeners attached');
  }

  async function initializePage() {
    const pathname = window.location.pathname;
    
    // try {
    //   if (pathname === '/' || pathname.includes('index')) {
    //     await loadIndexPage();
    //   } else if (pathname.includes('about')) {
    //     await loadAboutPage();
    //   } else if (pathname.includes('contact')) {
    //     await loadContactPage();
    //   } else if (pathname.includes('project-detail')) {
    //     await loadProjectDetailPage();
    //   }
    // } catch (error) {
    //   console.error('Error initializing page:', error);
    // }
  }

  async function loadIndexPage() {
    const projects = await window.fetchProjects();
    renderIndexProjects(projects);
    renderHomepageSlider(projects);
  }

  async function loadAboutPage() {
    const data = await window.fetchAbout();
    renderAboutContent(data.page);
  }

  async function loadContactPage() {
    const data = await window.fetchContact();
    renderContactContent(data.page);
  }

  async function loadProjectDetailPage() {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const projectId = urlParams.get('id');
    
    if (!projectId) {
      console.error('No project ID provided');
      return;
    }

    const projects = await window.fetchProjects();
    const project = projects.find(p => p.id == projectId);
    
    if (!project) {
      console.error('Project not found with ID:', projectId);
      return;
    }

    renderProjectDetail(project);
  }

  // Re-initialize cursor and video hover interactions after dynamic rendering
  function reinitializeInteractions(container) {
    if (DEBUG_HOVER) console.log('Re-initializing cursor and video hover interactions...');
    
    // Re-initialize video hover play/pause
    const videoElements = container.querySelectorAll('.box--work');
    if (DEBUG_HOVER) console.log('Found', videoElements.length, 'project boxes to reinitialize');
    
    videoElements.forEach((box, index) => {
      if (DEBUG_HOVER) console.log(`[hover:init] Processing box ${index + 1}/${videoElements.length}`);
      const video = box.querySelector('video.js-video');
      const link = box.querySelector('.box--work__link');
      
      if (video && link) {
        if (DEBUG_HOVER) {
          console.log('[hover:init] found box', {
            hasVideo: !!video,
            hasLink: !!link,
            dataSrc: video.dataset ? video.dataset.src : undefined,
            src: video.currentSrc || video.src
          });
        }

        // Ensure video has src attribute (not just data-src)
        if (!video.src && video.dataset.src) {
          video.src = video.dataset.src;
        }

        // If the source isn't a direct mp4, the <video> element usually can't play it.
        // (e.g. https://player.vimeo.com/video/... is not a playable mp4 URL)
        const currentSrc = video.currentSrc || video.src || '';
        const isDirectMp4 = /\.mp4(\?|$)/i.test(currentSrc);
        if (DEBUG_HOVER && !isDirectMp4) {
          console.log('[hover:init] non-mp4 video src detected (hover play may fail)', currentSrc);
        }
        
        // Ensure video is loaded
        if (video.readyState < 2) {
          video.load();
        }
        
        // Add hover event listeners
        link.addEventListener('mouseenter', function() {
          if (DEBUG_HOVER) {
            console.log('[hover:enter]', {
              title: box.querySelector('.box--work__info h2')?.textContent,
              src: video.currentSrc || video.src,
              readyState: video.readyState,
              paused: video.paused
            });
          }

          const srcNow = video.currentSrc || video.src || '';
          const directMp4Now = /\.mp4(\?|$)/i.test(srcNow);
          if (!directMp4Now) {
            if (DEBUG_HOVER) console.log('[hover:enter] skipped play (not a direct mp4)', srcNow);
            return;
          }

          // Only play if video is ready
          if (video.readyState >= 2 && video.paused) {
            video.play().catch(err => {
              // Silently handle play errors (video might still be loading)
              if (err.name !== 'AbortError') {
                if (DEBUG_HOVER) console.log('[hover:play:error]', err.name);
              }
            });
          } else if (video.readyState < 2) {
            // Video not ready, load it and play when ready
            video.addEventListener('loadeddata', function onLoaded() {
              if (link.matches(':hover')) {
                video.play().catch(() => {});
              }
              video.removeEventListener('loadeddata', onLoaded);
            }, { once: true });
            video.load();
          }
        });
        
        link.addEventListener('mouseleave', function() {
          if (DEBUG_HOVER) {
            console.log('[hover:leave]', {
              src: video.currentSrc || video.src,
              readyState: video.readyState,
              paused: video.paused
            });
          }
          if (!video.paused) {
            video.pause();
            video.currentTime = 0;
          }
        });
      }
    });
    
    // Trigger global cursor initialization if available
    if (typeof window.initCursorAnimations === 'function') {
      window.initCursorAnimations();
    }
    
    // Trigger global video initialization if available
    if (typeof window.initVideoHover === 'function') {
      window.initVideoHover();
    }
    
    console.log('✓ Interactions re-initialized for', videoElements.length, 'project items');
  }

  window.PageRenderer = PageRenderer;
  console.log('✓ PageRenderer module initialized');
})();


