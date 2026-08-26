PLACE OF ART — COMPLETE WEBSITE PACKAGE

WHAT IS ALREADY BUILT
- Warm, dark brown / beige / amber site design
- Separate pages instead of one long homepage
- Home: Place of Art / Tattoo Shop & Gallery
- Artists page
- Individual artist biography + portfolio pages
- Jessie-Ann Odell — 10+ years — Realism, Fine Line, Micro Realism
- Ian Odell — 8 years — Fine Line, Realism, Blackwork
- Taylor Paige Graham — 2+ years — Fine Line, Traditional
- Vivian Howerton — 1 year — Traditional, Cyberpunk, Native Ornamental
- Jaycee McKinney — Apprentice, displayed but not bookable
- The Shop page for studio photos
- Art Gallery page for paintings / artwork for sale
- Healed page
- News & Events page
- About Us story including Saint Ink in Heilsbronn, Germany in 2016
- Contact page:
  Place of Art Tattoo Shop & Gallery
  319 Dewey Ave
  Poteau, Oklahoma 74953
  (918) 564-4741
- Pricing page
- Professional Studio Policy, Privacy Policy and Terms pages
- Booking flow with customer info + reference-image chooser + artist + calendar + review
- Sunday closed
- General request window 9:00 AM–5:00 PM
- Jessie-Ann small tattoos: 9:00 AM–1:00 PM only
- Large/custom projects: start at 9:00 AM
- Fine Line duration logic:
  0.5–1 inch, 1–3 tattoos: 60 minutes
  2–3 inch, 1–3 tattoos: 90 minutes
  4–5 inch, 1 tattoo: 60 minutes
  4–5 inch, 2–3 tattoos: 120 minutes
- Fine Line Bundle asks size first, then 1 / 2 / 3 tattoos
- $50 non-refundable deposit
- $100 deposit for appointments priced $500+
- 48-hour rescheduling notice
- Pending request -> Accept / Decline workflow
- Shared artist dashboard with artist colors
- Deposit due / deposit paid / tattoo total price fields
- Large/custom total can remain Custom / TBD

DEMO MODE
The GitHub Pages version can save requests in the same browser using localStorage.
That is ONLY for testing. It is not secure and it is not shared across devices.

TO MAKE IT A REAL SHARED SYSTEM
1. Create a Supabase project.
2. Run supabase-schema.sql in Supabase SQL Editor.
3. Create an Auth account for each artist/team member.
4. Link each Auth user's UUID to artists.user_id.
5. Create a private Storage bucket for tattoo reference images and add appropriate RLS policies.
6. Connect booking.js/admin.js to Supabase instead of localStorage.
7. Connect Stripe or Square for the deposit payment step.
8. Use webhook/server-side payment confirmation to mark deposit_paid. Do not trust a browser-only success flag.
9. Keep all secret keys OFF GitHub. Only public/publishable browser keys belong in frontend code.
10. Before relying on the policy text as your final legal document, have it reviewed for your Oklahoma business.

FILES YOU CAN EDIT LATER
- Artist photos: replace the placeholders on artist pages
- Artist portfolio photos: replace portfolio placeholders
- The Shop: add your remaining real studio photos
- Art Gallery: add painting photos, titles and prices
- Healed: add healed tattoo images
- News & Events: update as needed
- Aftercare: replace the general text with your exact studio aftercare protocol


REDESIGN V2:
- Homepage now has logo/background hero, Welcome section, and large clickable category tiles.
- About Us now contains the full Saint Ink -> USA -> Place of Art story.
- Booking now uses large illustrated tattoo-category icons.
- Fine Line Bundle flow is size first, then 1 / 2 / 3 tattoos.
- Booking continues to client info + reference images + artist + calendar + review.
