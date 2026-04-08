# Router Debugging Guide

## How to Debug the SPA Router

### 1. Open Browser Console
Press `F12` or right-click → Inspect → Console tab

### 2. Navigate from Homepage to Contact
Click the "Contact" link in the navigation

### 3. Check Console Logs
You should see logs like this:

```
🧭 Navigating to: /contact
📄 Loading content for route: contact
Loading contact page...
Fetching contact.html structure...
Injecting contact HTML structure...
Fetching contact data from API...
Contact data received: {page: {...}}
Rendering contact content...
Contact page data: {staff: [], address: {...}}
Contact elements found: {staffList: true, addressBox: true, ...}
✓ Address box rendered
✓ Contact content rendering complete
✓ Contact page loaded and rendered
```

### 4. Common Issues and Solutions

#### Issue: "Failed to fetch contact.html: 404"
**Solution**: The HTML file path is wrong. Check if contact.html exists in the root directory.

#### Issue: "Could not find .page-inner-content in contact.html"
**Solution**: The contact.html structure is different than expected. Check the HTML structure.

#### Issue: Contact elements not found
**Solution**: The HTML structure was injected but elements are missing. Check if `.list--staff` and `.box--address` exist in contact.html.

#### Issue: No data received from API
**Solution**: Check the DataLoader. The API might be failing or returning wrong format.

### 5. Manual Test in Console

You can test the router manually in the console:

```javascript
// Test navigation
window.SPARouter.navigateTo('/contact');

// Check current route
console.log(window.SPARouter.getCurrentRoute());

// Test data loading
window.fetchContact().then(data => console.log('Contact data:', data));

// Test rendering
window.fetchContact().then(data => {
  window.PageRenderer.renderContactContent(data.page);
});
```

### 6. Check if Elements Exist

After navigating to contact, check if elements exist:

```javascript
console.log('Staff list:', document.querySelector('.list--staff'));
console.log('Address box:', document.querySelector('.box--address'));
console.log('Contact wrapper:', document.querySelector('.contact-inner-wrapper'));
```

### 7. Verify Data Structure

Check if the data has the right structure:

```javascript
window.fetchContact().then(data => {
  console.log('Has page?', !!data.page);
  console.log('Has staff?', !!data.page.staff);
  console.log('Has address?', !!data.page.address);
  console.log('Staff count:', data.page.staff.length);
  console.log('Full data:', data);
});
```

## Expected Behavior

When working correctly:
1. Click "Contact" link
2. URL changes to `/contact` (no page reload)
3. Body class changes to `template-contact body-light`
4. Page content changes to contact layout
5. Contact data loads and renders
6. You see address and contact info

## If Nothing Happens

If clicking the link does nothing:

1. Check if `data-navigo` attribute exists on the link:
   ```javascript
   document.querySelector('a[href="/contact"]').hasAttribute('data-navigo')
   ```

2. Check if router initialized:
   ```javascript
   console.log('Router:', window.SPARouter);
   ```

3. Check for JavaScript errors in console

4. Try navigating manually:
   ```javascript
   window.SPARouter.navigateTo('/contact');
   ```
