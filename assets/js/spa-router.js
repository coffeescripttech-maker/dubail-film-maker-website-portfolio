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
    console.log('🧭 Navigating to:', path);
    
    const routeName = getRouteName(path);
    if (!routeName) {
      console.warn('Unknown route:', path);
      return;
    }

    // Update browser history
    if (pushState) {
      window.history.pushState({ route: routeName }, '', path);
    }

    // Update current route
    Router.currentRoute = routeName;

    // Load content for route
    await loadRouteContent(routeName);

    // Update active nav links
    updateActiveNavLinks(routeName);

    // Scroll to top
    window.scrollTo(0, 0);
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
    console.log('Loading homepage...');
    
    // Check if homepage content already exists
    if (container.querySelector('.homepage-inner-wrapper')) {
      console.log('✓ Homepage content already loaded');
      
      // Just reload the data
      const projects = await window.fetchProjects();
      window.PageRenderer.renderIndexProjects(projects);
      window.PageRenderer.renderHomepageSlider(projects);
      return;
    }

    // Load homepage HTML structure
    try {
      const homepageHTML = await fetch('index.html');
      if (!homepageHTML.ok) {
        throw new Error(`Failed to fetch index.html: ${homepageHTML.status}`);
      }
      const htmlText = await homepageHTML.text();
      
      // Parse HTML and extract page-inner-content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const homepageContent = doc.querySelector('.page-inner-content');
      
      if (homepageContent) {
        container.innerHTML = homepageContent.innerHTML;
        
        // Load projects data
        const projects = await window.fetchProjects();
        window.PageRenderer.renderIndexProjects(projects);
        window.PageRenderer.renderHomepageSlider(projects);
        
        console.log('✓ Homepage loaded');
      }
    } catch (error) {
      console.error('Error loading homepage:', error);
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
    console.log('Loading about page...');
    
    // Check if about content already exists
    if (container.querySelector('.about-inner-wrapper')) {
      console.log('✓ About content already loaded, refreshing data...');
      
      // Just reload the data
      const data = await window.fetchAbout();
      console.log('About data fetched:', data);
      window.PageRenderer.renderAboutContent(data.page);
      return;
    }

    // Load about HTML structure
    console.log('Fetching about.html structure...');
    try {
      const aboutHTML = await fetch('about.html');
      if (!aboutHTML.ok) {
        throw new Error(`Failed to fetch about.html: ${aboutHTML.status}`);
      }
      const htmlText = await aboutHTML.text();
      
      // Parse HTML and extract page-inner-content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const aboutContent = doc.querySelector('.page-inner-content');
      
      if (aboutContent) {
        console.log('Injecting about HTML structure...');
        container.innerHTML = aboutContent.innerHTML;
        
        // Wait a moment for DOM to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Load about data
        console.log('Fetching about data from API...');
        const data = await window.fetchAbout();
        console.log('About data received:', data);
        
        // Render the data
        console.log('Rendering about content...');
        window.PageRenderer.renderAboutContent(data.page);
        
        console.log('✓ About page loaded and rendered');
      } else {
        console.error('Could not find .page-inner-content in about.html');
      }
    } catch (error) {
      console.error('Error loading about page:', error);
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
