# TODO - JS enhancements for whole project

## Step 1: Setup plan implementation
- [x] Create shared JS file: `Assets/Js/app.js`
- [x] Implement site-wide UX features:

  - [x] Scroll-to-top button
  - [x] IntersectionObserver-based reveal (with reduced motion support)
  - [x] Toast notifications utility

## Step 2: Enquiry page form UX
- [x] In `Assets/Js/app.js`, add enquiry form behavior for `Enquiry.html`:
  - [x] Inline validation (required + minlength)
  - [x] Disable submit when invalid
  - [x] Remember last form values in `localStorage`
  - [x] Prevent page reload on submit; show success toast


## Step 3: Wire JS to pages
- [x] Update `index.html` to load `Assets/Js/app.js`
- [x] Update `services.html` to load `Assets/Js/app.js`
- [x] Update `contact.html` to load `Assets/Js/app.js`
- [x] Update `Enquiry.html` to load `Assets/Js/app.js`
- [x] Update `about.html` to also load `Assets/Js/app.js` (keep `about.js` intact)


## Step 4: Quick verification
- [ ] Open each page in browser; confirm no console errors
- [ ] Confirm about.html toggles still work
- [ ] Confirm enquiry form UX works (validation + toast + saved values)


