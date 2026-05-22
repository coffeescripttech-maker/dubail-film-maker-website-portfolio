/**
 * SPA Router - Centralized Navigation Handler
 * Handles client-side routing without full page reloads
 * Dynamically loads content based on route
 */

(function() {
  'use strict';

  const Router = {
    currentRoute: null,
    routes: {
      '/': 'homepage',
      '/index': 'homepage',
      '/index.html': 'homepage',
      '/works': 'works',
      '/works.html': 'works',
      '/about': 'about',
      '/about.html': 'about',
      '/contact': 'contact',
      '/contact.html': 'contact'
    }
  };

  // Get route name from path
  function getRouteName(path) {
    // Normalize path
    path = path.replace(/\/$/, ''); // Remove trailing slash
    if (path === '') path = '/';
    
    return Router.routes[path] || null;
  }

  // Navigate to a route
  async function navigateTo(path, pushState = true) {
    const startTime = performance.now();
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🧭 NAVIGATION STARTED');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📍 Target Path:', path);
    console.log('📍 Current Route:', Router.currentRoute || 'none');
    console.log('⏰ Time:', new Date().toLocaleTimeString());
    
    const routeName = getRouteName(path);
    if (!routeName) {
      console.warn('❌ Unknown route:', path);
      return;
    }
    
    console.log('✅ Route Name:', routeName);

    // Update browser history
    if (pushState) {
      window.history.pushState({ route: routeName }, '', path);
      console.log('📝 Browser history updated');
    }

    // Update current route
    Router.currentRoute = routeName;

    // Load content for route
    console.log('');
    console.log('📦 Loading route content...');
    await loadRouteContent(routeName);

    // Update active nav links
    console.log('');
    console.log('🔗 Updating navigation links...');
    updateActiveNavLinks(routeName);

    // Scroll to top
    window.scrollTo(0, 0);
    console.log('⬆️  Scrolled to top');
    
    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ NAVIGATION COMPLETE');
    console.log('═══════════════════════════════════════════════════════');
    console.log('⏱️  Total Duration:', duration + 's');
    console.log('📍 Final Route:', Router.currentRoute);
    console.log('');
  }

  // Load content for a specific route
  async function loadRouteContent(routeName) {
    console.log('📄 Loading content for route:', routeName);

    // Get the main content container
    const pageInnerContent = document.querySelector('.page-inner-content');
    if (!pageInnerContent) {
      console.error('Page content container not found');
      return;
    }

    // Update body class
    updateBodyClass(routeName);

    try {
      switch (routeName) {
        case 'homepage':
          await loadHomepage(pageInnerContent);
          break;
        case 'works':
          await loadWorksPage(pageInnerContent);
          break;
        case 'about':
          await loadAboutPage(pageInnerContent);
          break;
        case 'contact':
          await loadContactPage(pageInnerContent);
          break;
        default:
          console.warn('No loader for route:', routeName);
      }
    } catch (error) {
      console.error('Error loading route content:', error);
    }
  }

  // Update body class based on route
  function updateBodyClass(routeName) {
    const body = document.body;
    
    // Remove all template classes
    body.classList.remove('template-homepage', 'template-works', 'template-about', 'template-contact', 'body-light');
    
    // Add appropriate class
    switch (routeName) {
      case 'homepage':
        body.classList.add('template-homepage');
        break;
      case 'works':
        body.classList.add('template-works');
        break;
      case 'about':
        body.classList.add('template-about', 'body-light');
        break;
      case 'contact':
        body.classList.add('template-contact', 'body-light');
        break;
    }
  }

  // Load homepage content
  async function loadHomepage(container) {
    const stepStartTime = performance.now();
    console.log('');
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│ 🏠 LOADING HOMEPAGE                                 │');
    console.log('└─────────────────────────────────────────────────────┘');
    
    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'page-loading-indicator';
    loadingIndicator.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 14px; z-index: 10000;';
    loadingIndicator.textContent = 'Loading...';
    document.body.appendChild(loadingIndicator);
    console.log('⏳ Loading indicator shown');
    
    try {
      // Step 1: Fetch HTML
      console.log('');
      console.log('📄 STEP 1: Fetching HTML structure');
      console.log('   Source: index.html');
      const fetchStart = performance.now();
      
      const homepageHTML = await fetch('index.html');
      if (!homepageHTML.ok) {
        throw new Error(`Failed to fetch index.html: ${homepageHTML.status}`);
      }
      const htmlText = await homepageHTML.text();
      
      const fetchDuration = ((performance.now() - fetchStart) / 1000).toFixed(2);
      console.log('   ✅ HTML fetched (' + fetchDuration + 's, ' + (htmlText.length / 1024).toFixed(1) + 'KB)');
      
      // Step 2: Parse and inject HTML
      console.log('');
      console.log('🔨 STEP 2: Parsing and injecting HTML');
      const parseStart = performance.now();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const homepageContent = doc.querySelector('.page-inner-content');
      
      if (homepageContent) {
        container.innerHTML = homepageContent.innerHTML;
        const parseDuration = ((performance.now() - parseStart) / 1000).toFixed(2);
        console.log('   ✅ HTML injected (' + parseDuration + 's)');
        
        // Wait for DOM to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('   ⏸️  DOM settled (100ms wait)');
        
        // Step 3: Verify elements
        console.log('');
        console.log('🔍 STEP 3: Verifying critical elements');
        const videoWrapper = document.getElementById('homepage-main-video-wrapper');
        const worksContainer = document.getElementById('works');
        const sliderContainer = document.getElementById('homepage-slider');
        
        console.log('   Video Wrapper:', videoWrapper ? '✅ Found' : '❌ Missing');
        console.log('   Works Container:', worksContainer ? '✅ Found' : '❌ Missing');
        console.log('   Slider Container:', sliderContainer ? '✅ Found' : '❌ Missing');
        
        if (!videoWrapper || !worksContainer || !sliderContainer) {
          throw new Error('Critical homepage elements missing after injection');
        }
        
        // Step 4: Fetch projects data
        console.log('');
        console.log('📊 STEP 4: Fetching projects data');
        let projects = null;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (!projects && retryCount < maxRetries) {
          try {
            const apiStart = performance.now();
            console.log('   Attempt ' + (retryCount + 1) + '/' + maxRetries + '...');
            
            projects = await window.fetchProjects();
            
            const apiDuration = ((performance.now() - apiStart) / 1000).toFixed(2);
            
            if (!projects || projects.length === 0) {
              throw new Error('No projects returned from API');
            }
            
            console.log('   ✅ Projects loaded (' + apiDuration + 's)');
            console.log('   📦 Count: ' + projects.length + ' projects');
          } catch (error) {
            retryCount++;
            console.warn('   ⚠️  Attempt ' + retryCount + ' failed:', error.message);
            if (retryCount < maxRetries) {
              const waitTime = 500 * retryCount;
              console.log('   ⏳ Waiting ' + waitTime + 'ms before retry...');
              await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
              throw error;
            }
          }
        }
        
        // Step 5: Render content
        console.log('');
        console.log('🎨 STEP 5: Rendering homepage content');
        const renderStart = performance.now();
        
        console.log('   Rendering projects list...');
        window.PageRenderer.renderIndexProjects(projects);
        console.log('   ✅ Projects list rendered');
        
        console.log('   Rendering homepage slider...');
        window.PageRenderer.renderHomepageSlider(projects);
        console.log('   ✅ Slider rendered');
        
        const renderDuration = ((performance.now() - renderStart) / 1000).toFixed(2);
        console.log('   ⏱️  Render time: ' + renderDuration + 's');
        
        // Wait for rendering to complete
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Step 6: Verify videos
        console.log('');
        console.log('📹 STEP 6: Verifying video elements');
        const videos = videoWrapper.querySelectorAll('video');
        console.log('   Found ' + videos.length + ' video elements');
        
        if (videos.length > 0) {
          const firstVideo = videos[0];
          firstVideo.classList.add('visible', 'loaded');
          if (firstVideo.readyState < 2) {
            firstVideo.load();
          }
          console.log('   ✅ First video initialized');
          console.log('   📊 Ready state: ' + firstVideo.readyState);
          console.log('   📊 Network state: ' + firstVideo.networkState);
        } else {
          console.warn('   ⚠️  No videos found!');
        }
        
        const totalDuration = ((performance.now() - stepStartTime) / 1000).toFixed(2);
        console.log('');
        console.log('┌─────────────────────────────────────────────────────┐');
        console.log('│ ✅ HOMEPAGE LOADED SUCCESSFULLY                     │');
        console.log('└─────────────────────────────────────────────────────┘');
        console.log('⏱️  Total time: ' + totalDuration + 's');
      } else {
        throw new Error('Could not find .page-inner-content in index.html');
      }
    } catch (error) {
      console.log('');
      console.log('┌─────────────────────────────────────────────────────┐');
      console.log('│ ❌ HOMEPAGE LOADING FAILED                          │');
      console.log('└─────────────────────────────────────────────────────┘');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      
      // Show error message to user
      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: white; text-align: center; flex-direction: column; gap: 20px;">
          <p style="font-size: 18px;">Failed to load homepage</p>
          <p style="font-size: 14px; opacity: 0.7;">${error.message}</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: white; color: black; border: none; cursor: pointer; border-radius: 4px;">
            Reload Page
          </button>
        </div>
      `;
    } finally {
      // Remove loading indicator
      if (loadingIndicator && loadingIndicator.parentNode) {
        loadingIndicator.parentNode.removeChild(loadingIndicator);
        console.log('⏳ Loading indicator removed');
      }
    }
  }

  // Load works page content
  async function loadWorksPage(container) {
    console.log('Loading works page...');
    
    // Check if works content already exists
    if (container.querySelector('.works-inner-wrapper')) {
      console.log('✓ Works content already loaded');
      
      // Just reload the data
      const projects = await window.fetchProjects();
      window.PageRenderer.renderWorksProjects(projects);
      return;
    }

    // Load works HTML structure
    try {
      const worksHTML = await fetch('works.html');
      if (!worksHTML.ok) {
        throw new Error(`Failed to fetch works.html: ${worksHTML.status}`);
      }
      const htmlText = await worksHTML.text();
      
      // Parse HTML and extract page-inner-content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const worksContent = doc.querySelector('.page-inner-content');
      
      if (worksContent) {
        container.innerHTML = worksContent.innerHTML;
        
        // Load projects data
        const projects = await window.fetchProjects();
        window.PageRenderer.renderWorksProjects(projects);
        
        console.log('✓ Works page loaded');
      }
    } catch (error) {
      console.error('Error loading works page:', error);
    }
  }

  // Load about page content
  async function loadAboutPage(container) {
    console.log('🔵 loadAboutPage called');
    console.log('Container:', container);
    
    // Always reload the HTML structure to ensure clean state
    console.log('Fetching about.html structure...');
    try {
      const aboutHTML = await fetch('about.html');
      if (!aboutHTML.ok) {
        throw new Error(`Failed to fetch about.html: ${aboutHTML.status}`);
      }
      const htmlText = await aboutHTML.text();
      console.log('✓ about.html fetched, length:', htmlText.length);
      
      // Parse HTML and extract page-inner-content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const aboutContent = doc.querySelector('.page-inner-content');
      
      if (aboutContent) {
        console.log('✓ Found .page-inner-content, injecting...');
        container.innerHTML = aboutContent.innerHTML;
        console.log('✓ HTML injected, container children:', container.children.length);
        
        // Wait a moment for DOM to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Load about data
        console.log('Fetching about data from API...');
        const data = await window.fetchAbout();
        console.log('✓ About data received:', data);
        
        // Render the data
        console.log('Calling renderAboutContent...');
        window.PageRenderer.renderAboutContent(data.page);
        
        console.log('✅ About page loaded and rendered');
      } else {
        console.error('❌ Could not find .page-inner-content in about.html');
      }
    } catch (error) {
      console.error('❌ Error loading about page:', error);
    }
  }

  // Load contact page content
  async function loadContactPage(container) {
    console.log('Loading contact page...');
    console.log('Current container HTML length:', container.innerHTML.length);
    console.log('Has contact-inner-wrapper?', !!container.querySelector('.contact-inner-wrapper'));
    
    // Always reload the structure and data for now (we can optimize later)
    // This ensures we get fresh content every time
    
    // Load contact HTML structure
    console.log('Fetching contact.html structure...');
    try {
      const contactHTML = await fetch('contact.html');
      if (!contactHTML.ok) {
        throw new Error(`Failed to fetch contact.html: ${contactHTML.status}`);
      }
      const htmlText = await contactHTML.text();
      console.log('Fetched contact.html, length:', htmlText.length);
      
      // Parse HTML and extract page-inner-content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const contactContent = doc.querySelector('.page-inner-content');
      
      if (contactContent) {
        console.log('Found .page-inner-content, injecting...');
        container.innerHTML = contactContent.innerHTML;
        console.log('Injected HTML, new container length:', container.innerHTML.length);
        
        // Verify elements exist
        const staffList = document.querySelector('.list--staff');
        const addressBox = document.querySelector('.box--address');
        console.log('After injection - Staff list exists?', !!staffList);
        console.log('After injection - Address box exists?', !!addressBox);
        
        // Wait a moment for DOM to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Load contact data
        console.log('Fetching contact data from API...');
        const data = await window.fetchContact();
        console.log('Contact data received:', data);
        
        // Render the data
        console.log('Calling PageRenderer.renderContactContent...');
        window.PageRenderer.renderContactContent(data.page);
        
        console.log('✓ Contact page loaded and rendered');
      } else {
        console.error('Could not find .page-inner-content in contact.html');
        console.log('HTML preview:', htmlText.substring(0, 500));
      }
    } catch (error) {
      console.error('Error loading contact page:', error);
      console.error('Error stack:', error.stack);
    }
  }

  // Update active navigation links
  function updateActiveNavLinks(routeName) {
    const navLinks = document.querySelectorAll('.header__subnav a[data-slug]');
    
    console.log(`🔗 Updating nav links for route: ${routeName}, found ${navLinks.length} links`);
    
    if (navLinks.length === 0) {
      console.warn('⚠️ No navigation links found - menu may not be initialized');
      // Try to find and log what's in the header
      const header = document.querySelector('.header');
      const subnav = document.querySelector('.header__subnav');
      console.log('Header debug:', {
        header: !!header,
        subnav: !!subnav,
        subnavHTML: subnav ? subnav.innerHTML.substring(0, 200) : 'N/A'
      });
    }
    
    navLinks.forEach(link => {
      const linkSlug = link.getAttribute('data-slug');
      
      if (linkSlug === routeName) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove('active');
      }
    });
  }

  // Initialize router
  function init() {
    console.log('🚀 Initializing SPA Router...');

    // Handle popstate (back/forward buttons)
    window.addEventListener('popstate', (event) => {
      const path = window.location.pathname;
      navigateTo(path, false);
    });

    // Intercept all navigation clicks
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[data-navigo]');
      
      if (link) {
        event.preventDefault();
        event.stopPropagation();
        
        const href = link.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript:')) {
          navigateTo(href);
        }
      }
    });

    // Load initial route
    const initialPath = window.location.pathname;
    const initialRoute = getRouteName(initialPath);
    
    if (initialRoute) {
      Router.currentRoute = initialRoute;
      updateActiveNavLinks(initialRoute);
      console.log('✓ Initial route:', initialRoute);
    }

    console.log('✓ SPA Router initialized');
  }

  // Export router
  window.SPARouter = {
    init,
    navigateTo,
    getCurrentRoute: () => Router.currentRoute
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
