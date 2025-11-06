# Debugging Production Styling Issues

## Problem
The site is not styled correctly in production, even though it works locally.

## Root Cause
The `dist/` folder contains an outdated build that doesn't include recent CSS and HTML changes.

## Solution Steps

### 1. Verify Current State
Check if `dist/styles.css` matches `public/styles.css`:
```bash
diff public/styles.css dist/styles.css
```

### 2. Rebuild the Site
Rebuild the Astro site to update the `dist/` folder:
```bash
npm run build
# or
bun run build
```

### 3. Verify Build Output
After building, check:
- `dist/styles.css` should match `public/styles.css`
- `dist/index.html` should have the latest HTML changes
- All assets should be in `dist/assets/`

### 4. Test Locally Before Deploying
Preview the built site locally:
```bash
npm run preview
# or
bun run preview
```

Visit `http://localhost:4321` and verify:
- CSS is loading correctly
- Links don't have blue underlines
- Social icons display correctly
- All images are showing
- Buttons are styled correctly

### 5. Check CSS Path
The CSS should be referenced as `/styles.css` (absolute path) in the HTML:
```html
<link rel="stylesheet" href="/styles.css" />
```

### 6. Production Deployment Checklist

#### Before Deploying:
- [ ] Run `npm run build` or `bun run build`
- [ ] Verify `dist/styles.css` has latest changes
- [ ] Verify `dist/index.html` has latest HTML
- [ ] Test locally with `npm run preview`
- [ ] Check browser console for 404 errors

#### After Deploying:
- [ ] Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Check browser DevTools → Network tab for CSS file loading
- [ ] Verify CSS file returns 200 status code
- [ ] Check if CSS file content matches `public/styles.css`
- [ ] Disable browser cache in DevTools to test

### 7. Common Issues & Fixes

#### Issue: CSS file returns 404
**Fix:** Ensure `public/styles.css` exists and is copied to `dist/` during build

#### Issue: CSS loads but styles don't apply
**Fix:** 
- Check browser cache (hard refresh)
- Verify CSS specificity isn't overridden
- Check for JavaScript errors in console
- Verify CSS file content is correct

#### Issue: Links showing blue/underlined
**Fix:** Ensure CSS has:
```css
a{text-decoration:none;color:inherit}
a:visited{color:inherit}
```

#### Issue: Styles work locally but not in production
**Fix:**
- Rebuild the site (`npm run build`)
- Clear CDN/cache if using one
- Verify deployment copied `dist/` folder correctly
- Check Nginx/server configuration for static file serving

### 8. Debugging Commands

```bash
# Check if styles.css exists in dist
ls -la dist/styles.css

# Compare source and built CSS
diff public/styles.css dist/styles.css

# Check HTML for CSS reference
grep -i "styles.css" dist/index.html

# Build and preview
npm run build && npm run preview

# Check file sizes (CSS should be > 3KB)
ls -lh dist/styles.css public/styles.css
```

### 9. Browser DevTools Checks

1. **Network Tab:**
   - Filter by "CSS"
   - Check if `styles.css` loads (status 200)
   - Check file size matches source

2. **Elements Tab:**
   - Inspect an element
   - Check Computed styles
   - Verify CSS rules are applied

3. **Console Tab:**
   - Look for CSS loading errors
   - Check for 404 errors

4. **Sources Tab:**
   - Verify `styles.css` is present
   - Check file content matches source

### 10. Nginx Configuration Check

If using Nginx, ensure it serves CSS files correctly:
```nginx
location ~* \.(css)$ {
  expires 30d;
  access_log off;
  try_files $uri =404;
}
```

## Quick Fix Command

If styles are broken in production:

```bash
# 1. Rebuild
npm run build

# 2. Verify dist/styles.css exists and is updated
ls -lh dist/styles.css

# 3. Redeploy
# (Follow your deployment process - git push, Coolify redeploy, etc.)

# 4. Hard refresh browser
# Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

## Verification

After fixing, verify these elements:
- ✅ Social media icons (no blue/underlines)
- ✅ Navigation links (no blue/underlines)  
- ✅ CTA buttons (orange, no underlines)
- ✅ Hero section (centered, proper spacing)
- ✅ Badge (fits content width)
- ✅ Images display correctly
- ✅ Cookie banner styles correctly

