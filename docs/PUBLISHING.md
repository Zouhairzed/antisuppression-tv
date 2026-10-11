# Publishing on LG Content Store

## Checklist
- [ ] Create an LG account and register on **LG Seller Lounge** (seller.lgappstv.com) as an
      *Individual Seller* (or Corporate if you form a company).
- [ ] Register on **webOS TV Developer** (webostv.developer.lge.com) and get the SDK/CLI.
- [ ] Test on a real TV with the Developer Mode app.
- [ ] Run the **App Self Checklist** from the developer site and fix issues.
- [ ] Prepare submission files:
  - [x] `.ipk` package (`ares-package . -e docs -e README.md`)
  - [x] Icons (80×80, 130×130 in the app; 400×400 store icon in `docs/store-assets/`) and splash
  - [x] Screenshots in `docs/screenshots/`
  - [x] **UX scenario** text in `docs/UX_SCENARIO.md` — copy into the Seller Lounge template
  - [x] **Privacy policy** page in `docs/privacy-policy.html` (published; share it publicly
        and paste its link in the form)
  - [x] Description, keywords, age rating in `docs/STORE_LISTING.md`
  - [ ] Choose service countries
- [ ] Submit via *App Management → App Submission*.
- [ ] LG QA: pre-test → function test → content test. Fix and re-submit if rejected.

## Notes for this app
- Keep wording as "vision training / exercise supplement". Avoid claims that it *treats* or
  *cures* amblyopia — medical claims may trigger extra review or medical-device rules in
  some countries.
- Include the "consult your eye-care professional" disclaimer in-app and in the store text.
- Colour accuracy varies by TV picture mode — tell users to disable eye-comfort modes.
